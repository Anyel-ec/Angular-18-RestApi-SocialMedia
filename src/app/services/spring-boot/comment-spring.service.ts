import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface CommentResponse {
  id?: string;  // Cambiar a opcional
  commentId: string;
  userId: number;
  content: string;
  timeCreated: string;
}

export interface Comment {
  id?: string;  // Cambiar a opcional
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

  constructor(private http: HttpClient) { }

  getComments(): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiUrl}/`);
  }

  addResponse(commentId: string, response: CommentResponse): Observable<Comment> {
    return this.http.post<Comment>(`${this.apiUrl}/${commentId}/response`, response);
  }

  getCommentsByPostId(postId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiUrl}/post/${postId}`);
  }

  addComment(comment: Comment): Observable<Comment> {
    return this.http.post<Comment>(`${this.apiUrl}/save`, comment);
  }

  deleteCommentsByPostId(postId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/post/${postId}/delete`);
  }

  countCommentsByPostId(postId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/count/${postId}`);
  }

  updateComment(id: string, comment: Comment, userId: number): Observable<Comment> {
    return this.http.put<Comment>(`${this.apiUrl}/${id}/update?userId=${userId}`, comment);
  }

  deleteComment(id: string, userId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}/delete?userId=${userId}`);
  }

  updateResponse(commentId: string, responseId: string, response: CommentResponse, userId: number): Observable<Comment> {
    return this.http.put<Comment>(`${this.apiUrl}/${commentId}/response/${responseId}/update?userId=${userId}`, response);
  }

  deleteResponse(commentId: string, responseId: string, userId: number): Observable<Comment> {
    return this.http.delete<Comment>(`${this.apiUrl}/${commentId}/response/${responseId}/delete?userId=${userId}`);
  }


}
