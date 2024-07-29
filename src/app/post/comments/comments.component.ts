import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { CommentSpringService, Comment, CommentResponse } from '../../services/spring-boot/comment-spring.service';
import { UserSpringService, User } from '../../services/spring-boot/user-spring.service';
import { SessionService } from '../../services/shared/session.service';

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [CommentSpringService, UserSpringService, SessionService],
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit {
  @Input() postId!: number;
  @Output() commentAdded = new EventEmitter<void>();

  comments: Comment[] = [];
  newComment: string = '';
  newReply: string = '';
  editingComment: Comment | null = null;
  editingResponse: CommentResponse | null = null;
  expandedCommentId: string | null = null;
  userMap: { [key: number]: string } = {};
  validUserIds: Set<number> = new Set();
  currentUser: any;

  constructor(
    private commentService: CommentSpringService,
    private userService: UserSpringService,
    private sessionService: SessionService
  ) {}

  ngOnInit() {
    this.loadAllUsers();
    this.currentUser = this.sessionService.getUser();
    this.loadComments();
  }

  loadComments() {
    this.commentService.getCommentsByPostId(this.postId).subscribe(
      (data: Comment[]) => {
        this.comments = data;
        console.log('Comments loaded:', data);

        const userIds = [
          ...new Set(
            data.map(comment => comment.userId).concat(data.flatMap(comment => comment.responses.map(reply => reply.userId)))
          )
        ];

        const validUserIds = userIds.filter(id => this.validUserIds.has(id));
        if (validUserIds.length > 0) {
          const userRequests = validUserIds.map(id => this.userService.getUserByID(id));
          forkJoin(userRequests).subscribe(users => {
            users.forEach(user => (this.userMap[user.id] = user.name));
          });
        }

        const postIds = [...new Set(data.map(comment => comment.postId))];
        postIds.forEach(postId => {
          this.commentService.countCommentsByPostId(postId).subscribe(
            count => console.log(`Number of comments for post ${postId}:`, count),
            error => console.error(`Error fetching comment count for post ${postId}:`, error)
          );
        });
      },
      error => console.error('Error fetching comments:', error)
    );
  }

  loadAllUsers() {
    this.userService.getAllUsers().subscribe(
      (data: User[]) => {
        data.forEach(user => {
          this.validUserIds.add(user.id);
          this.userMap[user.id] = user.name;
        });
        this.loadComments();
      },
      error => console.error('Error fetching all users:', error)
    );
  }

  handleAddComment() {
    if (this.newComment.trim() !== '') {
      const newComment: Comment = {
        postId: this.postId,
        userId: this.currentUser.id,
        content: this.newComment,
        timeCreated: new Date().toISOString(),
        responses: []
      };
      console.log('Adding comment:', newComment);
      this.commentService.addComment(newComment).subscribe(
        comment => {
          this.comments.push(comment);
          this.newComment = '';
          this.commentAdded.emit();
          console.log('Comment added:', comment);
        },
        error => console.error('Error adding comment:', error)
      );
    }
  }

  handleAddReply(commentId: string) {
    const comment = this.comments.find(c => c.id === commentId);
    if (comment && this.newReply.trim() !== '') {
      const newReply: CommentResponse = {
        commentId: commentId,
        userId: this.currentUser.id,
        content: this.newReply,
        timeCreated: new Date().toISOString()
      };
      console.log('Adding reply:', newReply);
      this.commentService.addResponse(commentId, newReply).subscribe(
        updatedComment => {
          const index = this.comments.findIndex(c => c.id === commentId);
          this.comments[index] = updatedComment;
          this.newReply = '';
          console.log('Reply added:', newReply);
        },
        error => console.error('Error adding reply:', error)
      );
    }
  }

  handleEdit(comment: Comment) {
    this.editingComment = { ...comment };
    console.log('Editing comment:', this.editingComment);
  }

  handleEditResponse(reply: CommentResponse) {
    this.editingResponse = { ...reply };
    console.log('Editing response:', this.editingResponse);
  }



  handleCancelEdit() {
    console.log('Cancelling edit for comment:', this.editingComment);
    this.editingComment = null;
  }

  handleCancelEditResponse() {
    console.log('Cancelling edit for response:', this.editingResponse);
    this.editingResponse = null;
  }



  handleExpand(commentId: string) {
    this.expandedCommentId = this.expandedCommentId === commentId ? null : commentId;
    console.log('Expanding comment:', this.expandedCommentId);
  }

  getUserName(userId: number): string {
    return this.userMap[userId] || 'Unknown User';
  }

  handleSaveEdit() {
    if (this.editingComment) {
      const commentId = this.editingComment.id ?? ''; // Asegurarse de que id no sea undefined
      if (commentId) {
        console.log('Saving edited comment:', this.editingComment);
        this.commentService.updateComment(commentId, this.editingComment, this.currentUser.id).subscribe(
          updatedComment => {
            const index = this.comments.findIndex(c => c.id === this.editingComment!.id);
            this.comments[index] = updatedComment;
            this.editingComment = null;
            console.log('Comment updated:', updatedComment);
          },
          error => console.error('Error updating comment:', error)
        );
      } else {
        console.error('Error: Comment ID is undefined.');
      }
    }
  }

  handleSaveEditResponse(commentId: string, responseId: string) {
    if (this.editingResponse) {
      console.log('Saving edited response:', this.editingResponse);
      this.commentService.updateResponse(commentId, responseId, this.editingResponse, this.currentUser.id).subscribe(
        updatedComment => {
          const index = this.comments.findIndex(c => c.id === commentId);
          this.comments[index] = updatedComment;
          this.editingResponse = null;
          console.log('Response updated:', updatedComment);
        },
        error => console.error('Error updating response:', error)
      );
    }
  }

  handleDelete(commentId: string) {
    console.log('Deleting comment with ID:', commentId);
    this.commentService.deleteComment(commentId, this.currentUser.id).subscribe(
      () => {
        this.comments = this.comments.filter(comment => comment.id !== commentId);
        console.log('Comment deleted:', commentId);
      },
      error => console.error('Error deleting comment:', error)
    );
  }

  handleDeleteResponse(commentId: string, responseId: string) {
    console.log('Deleting response with ID:', responseId);
    this.commentService.deleteResponse(commentId, responseId, this.currentUser.id).subscribe(
      updatedComment => {
        const index = this.comments.findIndex(c => c.id === commentId);
        this.comments[index] = updatedComment;
        console.log('Response deleted:', updatedComment);
      },
      error => console.error('Error deleting response:', error)
    );
  }


}
