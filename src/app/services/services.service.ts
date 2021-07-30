import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EntidadesModel } from '../models/entidades/entidades.model';

@Injectable({
  providedIn: 'root'
})
export class ServicesService {

  apiUrl: string = 'http://localhost:3000';
  constructor(private http:HttpClient) { }

  showTasks(usuario:string) {
    console.log(usuario);
    return this.http.get(`${this.apiUrl}/SECOP?usuario=`+usuario);
  }
}
