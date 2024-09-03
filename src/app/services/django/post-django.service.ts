import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class PostDjangoService {

  private baseUrl = 'http://localhost:8080/django/api/v2/posts/';

  constructor(private http: HttpClient) {}

  // Método para crear una nueva publicación
  createPost(formData: FormData): Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');

    return this.http.post<any>(this.baseUrl, formData, { headers: headers }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error al crear la publicación', error);
        return throwError(error);
      })
    );
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
  updatePost(postId: number, postData: FormData): Observable<any> {
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
