import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SapService {
  apiUrl: string = 'http://localhost:3000';
  constructor(private http: HttpClient) {}

  getCdp() {
    return this.http.get(`${this.apiUrl}/SAP`);
  }
}
