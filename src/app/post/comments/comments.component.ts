import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { CommentSpringService, Comment, CommentResponse } from '../../services/spring-boot/comment-spring.service';
import { UserSpringService, User } from '../../services/spring-boot/user-spring.service';

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [CommentSpringService, UserSpringService],
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit {
  comments: Comment[] = [];
  newComment: string = '';
  newReply: string = '';
  expandedCommentId: string | null = null;
  userMap: { [key: number]: string } = {};
  validUserIds: Set<number> = new Set();

  constructor(
    private commentService: CommentSpringService,
    private userService: UserSpringService
  ) {}

  ngOnInit() {
    this.loadAllUsers();
  }

  loadComments() {
    this.commentService.getComments().subscribe(
      (data: Comment[]) => {
        this.comments = data;
        console.log('Comments:', data);

        const userIds = [
          ...new Set(
            data.map(comment => comment.userId).concat(data.flatMap(comment => comment.responses.map(reply => reply.userId)))
          )
        ];

        console.log('User IDs:', userIds);

        const validUserIds = userIds.filter(id => this.validUserIds.has(id));
        if (validUserIds.length > 0) {
          const userRequests = validUserIds.map(id => this.userService.getUserByID(id));
          forkJoin(userRequests).subscribe(users => {
            users.forEach(user => (this.userMap[user.id] = user.name));
          });
        }
      },
      error => {
        console.error('Error fetching comments:', error);
      }
    );
  }

  loadAllUsers() {
    this.userService.getAllUsers().subscribe(
      (data: User[]) => {
        console.log('All users:', data);
        data.forEach(user => {
          this.validUserIds.add(user.id);
          this.userMap[user.id] = user.name;
        });
        this.loadComments(); // Load comments after fetching all users
      },
      error => {
        console.error('Error fetching all users:', error);
      }
    );
  }

  handleAddComment() {
    if (this.newComment.trim() !== '') {
      const newComment: Comment = {
        id: '', // Dejar vacío, el backend asignará uno
        postId: 1, // Aquí puedes asignar el postId correspondiente
        userId: 4, // Cambiar a un userId válido
        content: this.newComment,
        timeCreated: new Date().toISOString(),
        responses: []
      };
      this.commentService.addComment(newComment).subscribe(
        comment => {
          this.comments.push(comment);
          this.newComment = '';
        },
        error => {
          console.error('Error adding comment:', error);
        }
      );
    }
  }

  handleAddReply(commentId: string) {
    const comment = this.comments.find(c => c.id === commentId);
    if (comment && this.newReply.trim() !== '') {
      const newReply: CommentResponse = {
        id: '', // Dejar vacío, el backend asignará uno
        commentId: commentId,
        userId: 4, // Cambiar a un userId válido
        content: this.newReply,
        timeCreated: new Date().toISOString()
      };
      comment.responses.push(newReply);
      this.commentService.updateComment(commentId, comment).subscribe(
        () => {
          this.newReply = '';
        },
        error => {
          console.error('Error adding reply:', error);
        }
      );
    }
  }

  handleReply(commentId: string) {
    // Implement reply logic
  }

  handleEdit(commentId: string) {
    // Implement edit logic
  }

  handleDelete(commentId: string) {
    this.commentService.deleteComment(commentId).subscribe(
      () => {
        this.comments = this.comments.filter(comment => comment.id !== commentId);
      },
      error => {
        console.error('Error deleting comment:', error);
      }
    );
  }

  handleExpand(commentId: string) {
    this.expandedCommentId = this.expandedCommentId === commentId ? null : commentId;
  }

  getUserName(userId: number): string {
    return this.userMap[userId] || 'Unknown User';
  }
}
