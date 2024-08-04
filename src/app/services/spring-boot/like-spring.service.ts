import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Like {
  id: string;
  postId: number;
  userId: number;
  liked: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class LikeSpringService {

  private apiUrl = 'http://localhost:8081/springboot/like'; // URL base del backend

  constructor(private http: HttpClient) {}

  getLikesByPostId(postId: number): Observable<Like[]> {
    return this.http.get<Like[]>(`${this.apiUrl}/post/${postId}`);
  }

  countLikesByPostId(postId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/post/${postId}/count`);
  }

  addOrUpdateLike(postId: number, userId: number, liked: boolean): Observable<Like> {
    return this.http.post<Like>(`${this.apiUrl}/post/${postId}/user/${userId}?liked=${liked}`, {});
  }

  removeLike(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }


  deleteLikesByPostId(postId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/post/${postId}/delete`);
  }

}
