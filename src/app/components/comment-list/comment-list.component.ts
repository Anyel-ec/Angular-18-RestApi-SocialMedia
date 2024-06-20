import { Component, OnInit } from '@angular/core';
import { CommentsService } from '../../services/flask/comments.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-comment-list',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  providers: [CommentsService],
  templateUrl: './comment-list.component.html',
  styleUrl: './comment-list.component.scss'
})
export class CommentListComponent implements OnInit {

  comments: any[] = [];

  constructor(private commentService: CommentsService) { }

  ngOnInit(): void {
    this.commentService.getComments().subscribe(data => {
      this.comments = data;
    });
  }
}
