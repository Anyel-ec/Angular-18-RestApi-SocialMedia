import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommentSpringService {
  private apiUrl = 'http://localhost:8080/comment'; // URL del backend

  constructor(private http: HttpClient) {}

  // Método para agregar un comentario principal
  addComment(comment: Comment): Observable<Comment> {
    return this.http.post<Comment>(`${this.apiUrl}/save`, comment);
  }

  // Método para agregar una respuesta a un comentario existente
  addResponse(commentId: number, response: Comment): Observable<Comment> {
    return this.http.put<Comment>(`${this.apiUrl}/${commentId}/response`, response);
  }
}
