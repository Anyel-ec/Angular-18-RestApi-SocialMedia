import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

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

@Injectable({
  providedIn: 'root'
})
export class CommentSpringService {
  private apiUrl = 'http://localhost:8080/comment'; // URL del backend

  constructor(private http: HttpClient) {}

  getComments(): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiUrl}/`);
  }

  addResponse(commentId: string, response: CommentResponse): Observable<Comment> {
    return this.http.put<Comment>(`${this.apiUrl}/${commentId}/response`, response);
  }

  getCommentsByPostId(postId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiUrl}/post/${postId}`);
  }

  addComment(comment: Comment): Observable<Comment> {
    return this.http.post<Comment>(`${this.apiUrl}/save`, comment);
  }

  addReplyToComment(id: string, reply: CommentResponse): Observable<Comment> {
    return this.http.post<Comment>(`${this.apiUrl}/${id}/reply`, reply);
  }

  updateComment(id: string, comment: Comment): Observable<Comment> {
    return this.http.put<Comment>(`${this.apiUrl}/${id}/update`, comment);
  }

  deleteComment(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}/delete`);
  }
}
