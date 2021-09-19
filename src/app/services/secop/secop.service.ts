import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SecopService {

  //private REST_API_SERVER = "http://localhost:3000";

  constructor(private httpClient: HttpClient) { }

  public sendGetDataSecop(){
    return this.httpClient.get(`${environment.apiSecop}`);
  }

  public getDataProcess(departID: any, type: any){
    return this.httpClient.get(`${environment.apiTestUrl}contratos/GetProcess?departID=${departID}&type=${type}`);
  }

  public insertProcess(data: any) {
    console.log(data)
    return this.httpClient.post(`${environment.apiTestUrl}contratos/insertProcess`, data);
  }

  // public searchDataSecop(col: any, param: any){
  //   return this.httpClient.get(`${environment.apiSecopProviders}&${col}=${param}`);
  //   // return this.httpClient.get(`${environment.apiSecopProviders}&$where=${col} like '%25${param}%25'`);
  // }

  public searchDataSecop(col: any, param: any){
      return this.httpClient.get(`${environment.apiSecopProviders}&${col}=${param}`);
    // return this.httpClient.get(`${environment.apiSecopProviders}&$where=${col} like '%25${param}%25'`);
  }

  public getLastConsecutive(type: any){
    return this.httpClient.get(`${environment.apiTestUrl}contratos/lastConsecutive?type=${type}`);
  }

  public searchDataProcess(pro_id: any, state: any){
    return this.httpClient.get(`${environment.apiTestUrl}contratos/searchProcess?pro_id=${pro_id}&state=${state}`);
  }

  public getDepartmentsCont(token: any){
    return this.httpClient.get(`${environment.apiTestUrl}contratos/GetDepartmentsCont?token=${token}`);
  }

  public getAutorizaciones(username: string, codigoEntidad: string, nombreEntidad:string, proceso:string){
    return this.httpClient.get(`${environment.apiTestUrl}contratos/getAutorizaciones?username=${username}&codigoEntidad=${codigoEntidad}&nombreEntidad=${nombreEntidad}&proceso=${proceso}`);
  }

  public getSelectedProcess(token:string,proceso:string){
    return this.httpClient.get(`${environment.apiTestUrl}contratos/getSelectedProcess?proceso=${proceso}&token=${token}`);
  }

  public getAutorizacionesXEntidad(codigoEntidad:string){
    return this.httpClient.get(`${environment.apiTestUrl}contratos/getAutorizacionesXEntidad?codigoEntidad=${codigoEntidad}`);
  }

  public getAutorizacionesXProceso(proceso:string){
    return this.httpClient.get(`${environment.apiTestUrl}contratos/getAutorizacionesXProceso?proceso=${proceso}`);
  }

  public updateProcess(proceso:string,rol:any,entidad:string,codigoEntidad:string,username:string,rechazo:string){
    let data = {
      "proceso": proceso,
      "rol": rol,
      "entidad":entidad,
      "codigoEntidad":codigoEntidad,
      "username":username,
      "rechazo":rechazo
    }
    return this.httpClient.post(`${environment.apiTestUrl}contratos/updateProcess`, data);
  }
}
