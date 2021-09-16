import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ServicesService {

  apiUrl: string = 'http://localhost:3000';
  constructor(private http:HttpClient) { }

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
}
