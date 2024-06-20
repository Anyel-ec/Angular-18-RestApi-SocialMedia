import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class CommentsService {
  private apiUrl = 'http://127.0.0.1:5000/api/getComment';

  constructor(private http: HttpClient) { }

  getComments(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}
