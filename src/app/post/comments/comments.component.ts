import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';


interface Reply {
  id: number;
  user: string;
  date: string;
  content: string;
}

interface Comment {
  id: number;
  user: string;
  date: string;
  content: string;
  replies: Reply[];
}


@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.scss'
})
export class CommentsComponent {
  comments: Comment[] = [
    {
      id: 1,
      user: 'John Doe',
      date: '2023-06-26',
      content: 'This is a great article!',
      replies: [
        {
          id: 1,
          user: 'Jane Smith',
          date: '2023-06-26',
          content: 'I agree, it was very informative.'
        },
        {
          id: 2,
          user: 'Bob Johnson',
          date: '2023-06-27',
          content: 'Thanks for sharing this!'
        }
      ]
    },
    {
      id: 2,
      user: 'Sarah Lee',
      date: '2023-06-25',
      content: 'I have a question about the topic discussed here.',
      replies: []
    },
    {
      id: 3,
      user: 'Michael Chen',
      date: '2023-06-24',
      content: 'Awesome work, keep it up!',
      replies: [
        {
          id: 1,
          user: 'Emily Wong',
          date: '2023-06-24',
          content: 'I\'m glad you enjoyed it!'
        }
      ]
    }
  ];

  newComment: string = '';
  newReply: string = '';
  expandedCommentId: number | null = null;

  handleAddComment() {
    if (this.newComment.trim() !== '') {
      this.comments.push({
        id: this.comments.length + 1,
        user: 'You',
        date: new Date().toISOString().slice(0, 10),
        content: this.newComment,
        replies: []
      });
      this.newComment = '';
    }
  }

  handleAddReply(commentId: number) {
    const comment = this.comments.find(c => c.id === commentId);
    if (comment && this.newReply.trim() !== '') {
      comment.replies.push({
        id: comment.replies.length + 1,
        user: 'You',
        date: new Date().toISOString().slice(0, 10),
        content: this.newReply
      });
      this.newReply = '';
    }
  }

  handleReply(commentId: number) {
    // Implement reply logic
  }

  handleEdit(commentId: number) {
    // Implement edit logic
  }

  handleDelete(commentId: number) {
    this.comments = this.comments.filter(comment => comment.id !== commentId);
  }

  handleExpand(commentId: number) {
    this.expandedCommentId = this.expandedCommentId === commentId ? null : commentId;
  }
}
