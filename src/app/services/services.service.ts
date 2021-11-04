import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from "../../environments/environment";
import {Subject,Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ServicesService {
  private subject = new Subject<any>();
  private modals: any[] = [];

  apiUrl: string = 'http://localhost:3000';
  constructor(private http:HttpClient) { }

  sendClickEvent(){
    this.subject.next();
  }

  getClickEvent():Observable<any>{
    return this.subject.asObservable();
  }

  getDependencias(usuario:string,password:string) {
    //return this.http.get(`${this.apiUrl}/SECOP?usuario=`+usuario);
//     console.log(password)
//     return this.http.get(`${environment.apiTestUrl}Users/GetDataSecop?username=`+usuario+`&password=`+password+`&type=`+type);
    return this.http.get(`${environment.apiTestUrl}Users/GetDependenciasSecop?username=`+usuario+`&password=`+password);
  }

  getDataSecop(usuario:string,password:string){
    return this.http.get(`${environment.apiTestUrl}Users/GetDataSecop?username=`+usuario+`&password=`+password);
  }

  getTipoProceso(){
    return this.http.get(`${environment.apiTestUrl}Contratos/getTiposProceso`);
  }

  getTiposContrato(proceso:string){
    return this.http.get(`${environment.apiTestUrl}Contratos/getTiposContrato?proceso=`+proceso);
  }

  getTiposJustificacionContrato(contrato:string){
    return this.http.get(`${environment.apiTestUrl}Contratos/getTiposJustificacionContrato?tipoContrato=`+contrato);
  }

  getEquipoContratacion(tipoProceso:string){
    return this.http.get(`${environment.apiTestUrl}Contratos/getEquiposContratacion?tipoProceso=`+tipoProceso);
  }

  getUnidadesContratacion(username:string,entidad:string){
    return this.http.get(`${environment.apiTestUrl}Contratos/getUnidadesContratacion?entidad=`+entidad+`&username=`+username);
  }

  getDepartamentos(codigoPais:string){
    return this.http.get(`${environment.apiTestUrl}Contratos/getDepartamentos?codigoPais=`+codigoPais);
  }

  getMunicipios(codigoDpto:string){
    return this.http.get(`${environment.apiTestUrl}Contratos/getMunicipios?codigoDpto=`+codigoDpto);
  }

  open(id: string) {
    // open modal specified by id
    const modal = this.modals.find(x => x.id === id);
    modal.open();
  }

}
