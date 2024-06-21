import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommentSpringService {
  private apiUrl = 'http://localhost:8080/comment'; // URL del backend

  constructor(private http: HttpClient) {}

  addComment(comment: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/save`, comment);
  }

  // Método para agregar una respuesta a un comentario existente
  addResponse(commentId: number, response: Comment): Observable<Comment> {
    return this.http.put<Comment>(`${this.apiUrl}/${commentId}/response`, response);
  }

  getCommentsByPostId(postId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/post/${postId}`);
  }

  addReplyToComment(commentId: number, reply: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${commentId}/reply`, reply);
  }


}
