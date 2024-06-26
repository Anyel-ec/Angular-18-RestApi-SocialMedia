import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class PostDjangoService {

  private baseUrl = 'http://localhost:8000/api/v2/posts/';

  constructor(private http: HttpClient) {}

  // Método para crear una nueva publicación
  createPost(postData: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, postData);
  }

  // Método para obtener todas las publicaciones
  getAllPosts(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  // Método para obtener una publicación por su ID
  getPostById(postId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}${postId}/`);
  }

  // Método para actualizar una publicación por su ID
  updatePost(postId: number, postData: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}${postId}/`, postData);
  }

  // Método para eliminar una publicación por su ID
  deletePost(postId: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}${postId}/`);
  }

  // Método para obtener publicaciones por ID de usuario
  getPostsByUserId(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}by_user/?user_id=${userId}`);
  }

  // Método para obtener publicaciones por email de usuario
  getPostsByEmail(email: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}by_email/?email=${email}`);
  }
}
