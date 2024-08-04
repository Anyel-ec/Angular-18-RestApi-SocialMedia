import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GenderDjangoService {
  private apiUrl = 'http://localhost:8081/django/api/v2/genders/';

  constructor(private http: HttpClient) { }

  getAllGenders(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getGenderById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}${id}/`);
  }

  createGender(genderData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, genderData);
  }

  updateGender(id: number, genderData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}${id}/`, genderData);
  }

  deleteGender(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}${id}/`);
  }
}
