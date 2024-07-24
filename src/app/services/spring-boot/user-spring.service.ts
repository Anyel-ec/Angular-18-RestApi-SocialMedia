import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  birthdate: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserSpringService {

  private apiUrl = 'http://localhost:8080/restConsumer';

  constructor(private http: HttpClient) {}

  getUserByID(userId: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/getUserByID/${userId}`);
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/getUserAll`);
  }

  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError(error.message || 'Server error');
  }


}
