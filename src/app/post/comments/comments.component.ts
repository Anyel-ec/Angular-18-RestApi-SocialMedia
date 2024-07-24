import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommentSpringService } from '../../services/spring-boot/comment-spring.service';


export interface CommentResponse {
  id: string;
  userId: number;
  content: string;
  timeCreated: string;
}

export interface Comment {
  id: string;
  postId: number;
  userId: number;
  content: string;
  timeCreated: string;
  responses: CommentResponse[];
}


@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [CommentSpringService],
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.scss'
})
export class CommentsComponent implements OnInit {
  comments: Comment[] = [];
  newComment: string = '';
  newReply: string = '';
  expandedCommentId: string | null = null;

  constructor(private commentService: CommentSpringService) {}

  ngOnInit() {
    this.loadComments();
  }

  loadComments() {
    this.commentService.getComments().subscribe(
      (data: Comment[]) => {
        this.comments = data;
      },
      (error) => {
        console.error('Error fetching comments:', error);
      }
    );
  }

  handleAddComment() {
    if (this.newComment.trim() !== '') {
      const newComment: Comment = {
        id: '', // Dejar vacío, el backend asignará uno
        postId: 1, // Aquí puedes asignar el postId correspondiente
        userId: 1, // Aquí puedes asignar el userId correspondiente
        content: this.newComment,
        timeCreated: new Date().toISOString(),
        responses: []
      };
      this.commentService.addComment(newComment).subscribe(
        (comment) => {
          this.comments.push(comment);
          this.newComment = '';
        },
        (error) => {
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
        userId: 1, // Aquí puedes asignar el userId correspondiente
        content: this.newReply,
        timeCreated: new Date().toISOString()
      };
      comment.responses.push(newReply);
      this.commentService.updateComment(commentId, comment).subscribe(
        () => {
          this.newReply = '';
        },
        (error) => {
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
      (error) => {
        console.error('Error deleting comment:', error);
      }
    );
  }

  handleExpand(commentId: string) {
    this.expandedCommentId = this.expandedCommentId === commentId ? null : commentId;
  }
}
