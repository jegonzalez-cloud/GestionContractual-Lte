import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from 'src/environments/environment';
import {map, tap} from 'rxjs/operators';
import {UserModel} from 'src/app/models/user/user.model';
import {Store} from "@ngrx/store";
import * as acciones from '../../store/actions';
import * as utils from '../../utils/functions';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  data: any;

  constructor(private http: HttpClient, private store: Store) {
  }

  login(datos: any): Observable<any> {
    this.data = {username: btoa(datos.Username), password: btoa(datos.Password)};
    return this.http
      .post(`${environment.apiTestUrl}security/gettoken`, this.data)
    /*.pipe(map((userData) => userData), tap((data:any) => {
      if(data.Token != '-1'){
        localStorage.setItem('token',data.Token);
        this.store.dispatch(acciones.cargarUsuarios({ token: data.Token }));
      }
      else{
        utils.showAlert('Credenciales Incorrectas!','error');
      }
    }));*/
  }

  getBasicInformation(token: string): Observable<any> {
    return this.http
      .get(`${environment.apiTestUrl}users/GetUserBasicInformation?token=${token}`)
    // .pipe(map((userPermission) => userPermission));
  }

  getUserPermissions(token: string): Observable<any> {
    return this.http
      .get(`${environment.apiTestUrl}security/GetUserPermisions?token=${token}&AppId=3`)
      .pipe(map((userPermission) => userPermission));
  }

  public saveStorage(token: string, document: string, user: UserModel, ResumedPermissions: any): any {
    localStorage.setItem('token', btoa(token));//atob()
    localStorage.setItem('userStorage', JSON.stringify(user));
    localStorage.setItem('ResumedPermissions', JSON.stringify(ResumedPermissions));
    //this.token = token;
  }

  public getDept(token: any, username: any) {
    return this.http.get(`${environment.apiTestUrl}users/getusers?token=${token}&username=${username}`);
  }

  public isLogin() {
    let token = atob(localStorage.getItem('token')!);
    return this.http.get(`${environment.apiTestUrl}security/CheckToken?token=${token}`);
    // return token ? true : false;
  }

  public logout(token: string) {
    this.data = {token: token};
    return this.http
      // .post(`${environment.apiTestUrl}security/CancelTokens`, this.data);
      .get(`${environment.apiTestUrl}security/CancelTokensLegalBase?token=${token}`);
  }

  public userError() {
    console.log('error');
  }

  getUsuarioConnect(user:string,centroGestor:string){
    return this.http.get(`${environment.apiTestUrl}contratos/getUsuarioConnect?username=${user}&centroGestor=${centroGestor}`);
  }

  getEntidades(user:string){
    return this.http.get(`${environment.apiTestUrl}contratos/getEntidadesEstatales?username=${user}`);
  }

  public getConfigApp(token:any){
    return this.http.get(`${environment.apiTestUrl}contratos/getConfigApp?token=${token}`);
  }
  public getRolxId(token:any,rol_order:number){
    return this.http.get(`${environment.apiTestUrl}Contratos/GetRolesXId?token=${token}&rol_order=${rol_order}`);
  }

  public GetUsersLB(token: any) {
    return this.http.get(`${environment.apiTestUrl}Contratos/GetUsersLB?token=${token}`);
  }

  public GetUsersConnect(token: any) {
    return this.http.get(`${environment.apiTestUrl}Contratos/GetUsersConnect?token=${token}`);
  }

  public GetUsersConnection(token: any,idUser: number) {
    return this.http.get(`${environment.apiTestUrl}Contratos/GetUsersConnection?token=${token}&idUser=${idUser}`);
  }

  public GetHiringTeams(token: any,eqcCod: number) {
    return this.http.get(`${environment.apiTestUrl}Contratos/GetHiringTeams?token=${token}&eqcCod=${eqcCod}`);
  }

  public GetHiringUnit(token: any,uni_cod: number) {
    return this.http.get(`${environment.apiTestUrl}Contratos/GetHiringUnit?token=${token}&uni_cod=${uni_cod}`);
  }

  public getUserConectxId(token: any, usc_cod: number) {
    return this.http.get(`${environment.apiTestUrl}Contratos/getUserConectxId?token=${token}&usc_cod=${usc_cod}`);
  }

  public insertUserRol(datos: any) {
    return this.http
      .post(`${environment.apiTestUrl}Contratos/insertUserRol`, datos)
  }

  public insertUserConnect(datos: any) {
    return this.http
      .post(`${environment.apiTestUrl}Contratos/insertUserConnect`, datos)
  }

  public updateUserConnect(datos: any) {
    return this.http
      .post(`${environment.apiTestUrl}Contratos/updateUserConnect`, datos)
  }

  public insertHiringTeams(datos: any) {
    return this.http
      .post(`${environment.apiTestUrl}Contratos/insertHiringTeams`, datos)
  }

  public updateHiringTeams(datos: any) {
    return this.http
      .post(`${environment.apiTestUrl}Contratos/updateHiringTeams`, datos)
  }

  public insertHiringUnit(datos: any) {
    return this.http
      .post(`${environment.apiTestUrl}Contratos/insertHiringUnit`, datos)
  }

  public updateHiringUnit(datos: any) {
    return this.http
      .post(`${environment.apiTestUrl}Contratos/updateHiringUnit`, datos)
  }


  public updateUserRol(datos: any) {

    return this.http
      .post(`${environment.apiTestUrl}Contratos/updateUserRol`, datos)
  }

  public getParametros(token: any, rol: any) {
    return this.http.get(`${environment.apiTestUrl}Contratos/getParametros?token=${token}&rol=${rol}`);
  }
}
