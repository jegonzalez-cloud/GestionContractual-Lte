import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { UserModel } from 'src/app/models/user/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  data:any;
  constructor(private http:HttpClient) { }

  login(datos:any): Observable<any> {    
    this.data = {username: btoa(datos.Username), password: btoa(datos.Password)};
    return this.http
      .post(`${environment.apiTestUrl}security/gettoken`, this.data)
      .pipe(map((userData) => userData));
  }

  getUserPermissions(token: string): Observable<any> {
    return this.http
      .get(`${environment.apiTestUrl}security/GetUserPermisions?token=${token}&AppId=3`)
      .pipe(map((userPermission) => userPermission));
  }

  public saveStorage(token: string,document:string, user: UserModel, ResumedPermissions: any): any {
    localStorage.setItem('token', token);//atob()
    localStorage.setItem('userStorage', JSON.stringify(user));
    localStorage.setItem('ResumedPermissions', JSON.stringify(ResumedPermissions));
    //this.token = token;
  }
}
