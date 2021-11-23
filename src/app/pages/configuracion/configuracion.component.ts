import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {SecopService} from "../../services/secop/secop.service";
import * as utils from "../../utils/functions";

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.component.html',
  styleUrls: ['./configuracion.component.css']
})
export class ConfiguracionComponent implements OnInit {
  configForm!: FormGroup;

  constructor(private fb: FormBuilder,private secopService:SecopService) { }

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.configForm = this.fb.group({
      token: new FormControl(localStorage.getItem('token')!),
      color: new FormControl(atob(localStorage.getItem( 'color')!)),
      cdp: new FormControl(atob(localStorage.getItem('linkCdp')!)),
      pagos: new FormControl(atob(localStorage.getItem('linkPagos')!)),
      consultarProceso: new FormControl(atob(localStorage.getItem('linkProceso')!)),
      estadoContrato: new FormControl(atob(localStorage.getItem('estadoProceso')!)),
      identificacionSecop: new FormControl(atob(localStorage.getItem('identificacionSecop')!)),
      dataSecop: new FormControl(atob(localStorage.getItem('dataSecop')!)),
      salarioMinimo: new FormControl(atob(localStorage.getItem('salarioMinimo')!)),
      topeMaximo: new FormControl(atob(localStorage.getItem('topeMaximo')!)),
      cantidadSalarios: new FormControl(atob(localStorage.getItem('cantidadSalarios')!)),
    });
    console.log(this.configForm.controls['color'].value);
  }

  saveColor(){
    let color = this.configForm.controls['color'].value;
    localStorage.setItem('color',btoa(color));
    let r:any = document.querySelector(':root');
    r.style.setProperty('--companyColor', color);
    let dataForm = Object.assign(this.configForm.value);
    this.secopService.updateConfigApp(dataForm).subscribe((response:any)=>{
      if(response.Values.ResultFields == 'Ok'){
        utils.showAlert('Configuración actualizada','success');
      }
      else{
        utils.showAlert('No se pudo actualizar la configuración','error');
      }
    });
  }


}
