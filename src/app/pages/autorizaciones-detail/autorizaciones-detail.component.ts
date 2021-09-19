import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {SecopService} from "../../services/secop/secop.service";

@Component({
  selector: 'app-autorizaciones-detail',
  templateUrl: './autorizaciones-detail.component.html',
  styleUrls: ['./autorizaciones-detail.component.css']
})
export class AutorizacionesDetailComponent implements OnInit {
  public status_hist_res:any;
  public res_hist_pro:any;
  myParam!:string;
  numeroProceso!:string;
  username!:string;
  nombre!:string;
  valor!:string;
  duracion!:string;
  tipoContrato!:string;
  estado!:string;
  created!:string;
  response!:any;

  constructor(private route:ActivatedRoute,private secopService:SecopService) { }

  ngOnInit(): void {
    this.getAutorizacionesXProceso();
  }

  checkHistoryAuth(){

  }

  printAction(something:any){}

  getAutorizacionesXProceso(){
    this.route.params.subscribe((params: Params) => {
      this.myParam = params['id'];
      console.log(this.myParam)
      let username = atob(localStorage.getItem('username')!);
      this.secopService.getAutorizacionesXProceso(this.myParam).subscribe((response:any)=>{
        console.log(response);
        this.response = response.Values.ResultFields;
        // this.numeroProceso = response.Values.ResultFields[0].CONS_PROCESO;
        // this.username = response.Values.ResultFields[0].USR_LOGIN;
        // this.nombre = response.Values.ResultFields[0].NOMBRE_USUARIO;
        // this.valor = response.Values.ResultFields[0].VAL_OFERTA;
        // this.duracion = response.Values.ResultFields[0].DURACION_CONTRATO;
        // this.tipoContrato = response.Values.ResultFields[0].TIPO_CONTRATO;
        // this.estado = response.Values.ResultFields[0].ESTADO;
        // this.created = response.Values.ResultFields[0].CREATED;
      })
    });
  }

}
