import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root',
})
export class SapService {
  apiUrl: string = 'http://localhost:3000';
  constructor(private http: HttpClient) {}

  getCdp() {
    return this.http.get(`${this.apiUrl}/SAP`);
  }

  createProveedorSap(usuarioSap : any){
    return this.http.post(`${environment.apiTestUrl}contratos/CrearProveedor`, usuarioSap);
  }

  getTipoIdentificacionSap(token:any){
    return this.http.get(`${environment.apiTestUrl}contratos/getTipoIdentificacionSap?token=${token}`);
  }

  getTipoPersonaSap(token:any){
    return this.http.get(`${environment.apiTestUrl}contratos/getTipoPersonaSap?token=${token}`);
  }

  getTratamientoPersonaSap(token:any){
    return this.http.get(`${environment.apiTestUrl}contratos/getTratamientoPersonaSap?token=${token}`);
  }

  getClaseImpuestoSap(token:any){
    return this.http.get(`${environment.apiTestUrl}contratos/getClaseImpuestoSap?token=${token}`);
  }

  getExistenciaProveedorSap(token:any,identificacion:any){
    return this.http.get(`${environment.apiTestUrl}contratos/getExistenciaProveedorSap?token=${token}&identificacion=${identificacion}`);
  }
}
