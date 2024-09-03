import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StatusDjangoService {
  private apiUrl = 'http://localhost:8080/django/api/v2/statuses/';

  constructor(private http: HttpClient) { }

  getAllStatuses(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getStatusById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}${id}/`);
  }

  createStatus(statusData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, statusData);
  }

  updateStatus(id: number, statusData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}${id}/`, statusData);
  }

  deleteStatus(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}${id}/`);
  }
}
