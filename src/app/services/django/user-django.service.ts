import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserDjangoService {
  private apiUrl = 'http://localhost:8000/api/v2/users/';

  constructor(private http: HttpClient) { }

  getUsers(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  login(email: string, password: string): Observable<any> {
    const loginUrl = `${this.apiUrl}verify_login/`;
    const body = { email, password };
    return this.http.post<any>(loginUrl, body);
  }

  register(user: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, user);
  }

  getUserByEmail(email: string): Observable<any> {
    const url = `${this.apiUrl}by_email/`;
    const params = new HttpParams().set('email', email);
    return this.http.get<any>(url, { params });
  }


  getUserById(userId: number): Observable<any> {
    const url = `${this.apiUrl}${userId}/`;
    return this.http.get<any>(url);
  }

  getVerifyExitsUser(email: string): Observable<any> {
    const url = `${this.apiUrl}/verify_exist`;
    const body = { email };
    return this.http.post<any>(url, body);
  }
}
