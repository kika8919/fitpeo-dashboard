import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  get(url: string): Observable<any> {
    return this.http.get(url);
  }

  post(url: string, body: any = {}): Observable<any> {
    return this.http.post(url, JSON.stringify(body));
  }

  put(url: string, body: any = {}): Observable<any> {
    return this.http.put(url, JSON.stringify(body));
  }

  delete(url: string, body: any = {}): Observable<any> {
    return this.http.delete(url, { body });
  }
}
