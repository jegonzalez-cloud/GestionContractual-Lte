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

  constructor(private route:ActivatedRoute,private secopService:SecopService) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.myParam = params['id'];
      let username = atob(localStorage.getItem('username')!) ;
      let codigoEntidad = atob(localStorage.getItem('codigoEntidad')!) ;
      let entidad = atob(localStorage.getItem('entidad')!) ;
      this.secopService.getAutorizaciones(username,codigoEntidad,entidad,this.myParam).subscribe((response:any)=>{
        console.log(response.Values.ResultFields);
        this.numeroProceso = response.Values.ResultFields[0].CONS_PROCESO;
        this.username = response.Values.ResultFields[0].USR_LOGIN;
        this.nombre = response.Values.ResultFields[0].NOMBRE_USUARIO;
        this.valor = response.Values.ResultFields[0].VAL_OFERTA;
        this.duracion = response.Values.ResultFields[0].DURACION_CONTRATO;
        this.tipoContrato = response.Values.ResultFields[0].TIPO_CONTRATO;
      })
    });
  }

  checkHistoryAuth(){

  }

  printAction(something:any){}

}
