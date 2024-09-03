import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProvinceDjangoService {
  private apiUrl = 'http://localhost:8080/django/api/v2/provinces/';

  constructor(private http: HttpClient) { }

  getAllProvinces(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getProvinceById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}${id}/`);
  }

  createProvince(provinceData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, provinceData);
  }

  updateProvince(id: number, provinceData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}${id}/`, provinceData);
  }

  deleteProvince(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}${id}/`);
  }
}
