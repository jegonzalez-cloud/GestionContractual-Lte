import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ServicesService {

  apiUrl: string = 'http://localhost:3000';
  constructor(private http:HttpClient) { }

  showTasks(usuario:string,password:string) {
    //return this.http.get(`${this.apiUrl}/SECOP?usuario=`+usuario);
    console.log(password)
    return this.http.get(`${environment.apiTestUrl}Users/GetDataSecop?username=`+usuario+`&password=`+password);
  }
}
