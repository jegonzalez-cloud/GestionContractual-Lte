import {Component, Input, OnInit, SimpleChanges, ViewChild, Inject, LOCALE_ID,} from '@angular/core';
import {Subscription} from "rxjs";
import {ModalService} from "../../../services/modal/modal.service";
import Swal from "sweetalert2";
import * as utils from "../../../utils/functions";
import {SecopService} from "../../../services/secop/secop.service";
import {ServicesService} from "../../../services/services.service";
import {Router} from "@angular/router";
import * as func from "../../../utils/functions";

@Component({
  selector: 'app-modal-process',
  templateUrl: './modal-process.component.html',
  styleUrls: ['./modal-process.component.css']
})
export class ModalProcessComponent implements OnInit {

  //TODO: **** PROCESO ****
  proceso: any;
  tipo_proceso: any;
  tipo_contrato: any;
  justificacion_proceso: any;
  nombre_proceso: any;
  unidad_contratacion: any;
  equipo_contratacion: any;
  descripcion_proceso: any;
  tipo_identificacion: any;
  identificacion_contratista: any;
  nombre_contratista: any;
  fecha_nacimiento_contratista: any;
  genero_contratista: any;
  correo_contratista: any;
  dpto_contratista: any;
  ciudad_contratista: any;
  ubicacion_contratista: any;
  categoria_contratacion: any;
  profesion_contratista: any;
  documentos_tipo: any;
  interadministrativos: any;
  definir_lotes: any;
  fecha_inicio: any;
  fecha_termino: any;
  firma_contrato: any;
  plazo_ejecucion: any;
  plan_pagos: any;
  valor_oferta: any;
  tiempo_duracion: any;
  duracion_contrato: any;
  estado: any;
  //TODO: **** END PROCESO ****

  //TODO: **** CONFIG APP ****
  ROL: any = atob(localStorage.getItem('rol')!);
  entidad: string = atob(localStorage.getItem('entidad')!);
  codigoEntidad: string = atob(localStorage.getItem('codigoEntidad')!);
  username: string = atob(localStorage.getItem('username')!);
  centroGestor: string = atob(localStorage.getItem('centroGestor')!);
  token: string = localStorage.getItem('token')!;
  //TODO: **** END CONFIG APP ****

  public component!: number;
  public infoPagos!: any;
  public cantidadCuotas: any;
  public verDescuentos: any = [];
  public dataModal: any;
  public infoModal: any;

  @ViewChild('openbutton') openbutton: any;
  @ViewChild('openbuttonListadoPagos') openbuttonListadoPagos: any;

  private clickEventSubscription!: Subscription;
  private PROCESO_SELECCIONADO: any;
  private autorizaciones: any;

  constructor(private modal: ModalService, private secopService: SecopService, private service: ServicesService, private router: Router, @Inject(LOCALE_ID) public locale: string) {
  }

  ngOnInit(): void {
    this.component = 0;
    if (this.router.url == '/home/process') {
      this.component = 1;
    }
    else if(this.router.url == '/home/busqueda') {
      this.component = 2;
    }
    else if(this.router.url == '/home/autorizaciones') {
      this.component = 3;
    }
    this.clickEventSubscription = this.modal.getClickEvent().subscribe(() => {
      let dataModal = JSON.parse(localStorage.getItem('modalData')!);
      this.rellenarModal(dataModal);
    });
  }

  rellenarModal(dataModal:any){
    setTimeout(() => {
      this.infoModal = dataModal;
      this.PROCESO_SELECCIONADO = dataModal.CONS_PROCESO;
      this.proceso = dataModal.CONS_PROCESO;
      this.tipo_proceso = dataModal.TIPO_PROCESO;
      this.tipo_contrato = dataModal.TIPO_CONTRATO;
      this.justificacion_proceso = dataModal.JUST_TIPO_PROCESO;
      this.nombre_proceso = dataModal.NOMBRE_PROCESO;
      this.unidad_contratacion = dataModal.UNI_CONTRATACION;
      this.equipo_contratacion = dataModal.EQUIPO_CONTRATACION;
      this.descripcion_proceso = dataModal.DESCRIPCION_PROCESO;
      this.tipo_identificacion = dataModal.TIP_IDEN_PROV;
      this.identificacion_contratista = dataModal.COD_PROV;
      this.nombre_contratista = dataModal.NOM_PROV;
      this.fecha_nacimiento_contratista = dataModal.NACIMIENTO_PROV;
      this.genero_contratista = dataModal.GENERO_PROV;
      this.correo_contratista = dataModal.CORREO_PROV;
      this.dpto_contratista = dataModal.DPTO_PROV;
      this.ciudad_contratista = dataModal.CIUDAD_PROV;
      this.ubicacion_contratista = dataModal.UBICACION_PROV;
      this.categoria_contratacion = dataModal.CATE_CONTRATACION;
      this.profesion_contratista = dataModal.PROFESION_PROV;
      this.documentos_tipo = dataModal.DOCUMENTOS_TIPO;
      this.interadministrativos = dataModal.INTERADMINISTRATIVOS;
      this.definir_lotes = dataModal.DEFINIR_LOTES;
      this.fecha_inicio = dataModal.FECHA_INICIO;
      this.fecha_termino = dataModal.FECHA_TERMINO;
      this.firma_contrato = dataModal.FIRMA_CONTRATO;
      this.plazo_ejecucion = dataModal.PLAZO_EJECUCION;
      this.plan_pagos = dataModal.PLAN_PAGOS;
      this.valor_oferta = dataModal.VAL_OFERTA;
      this.tiempo_duracion = dataModal.TIEMPO_DURACION_CONTRATO;
      this.duracion_contrato = dataModal.DURACION_CONTRATO;
      this.estado = dataModal.ESTADO;
      this.onOpen();
      utils.deleteData('dataModal');
    }), 100;
  }

  onOpen() {
    this.openbutton.nativeElement.click();
  }

  public onOpenListadoPagos() {
    this.openbuttonListadoPagos.nativeElement.click();
  }

  validarAnulacion(proceso: string) {
    Swal.fire({
      title: 'Esta Seguro?',
      text: "Esta accion no se podrá revertir!",
      icon: 'warning',
      showCancelButton: true,
      allowOutsideClick: false,
      confirmButtonColor: 'primary',
      cancelButtonColor: 'dark',
      confirmButtonText: 'Si, anular proceso!',
      cancelButtonText: 'No, deseo revisar!',
      reverseButtons: true
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.anularProceso(proceso);
      }
    });
  }

  editarProceso() {
    this.modal.sendClickEventsubjectFillFields();
  }

  fillModal(numProceso: any) {
    this.router.navigate(['home/autorizaciones-det/' + numProceso]);
  }

  getPagosXRpc(proceso: any) {
    this.secopService.getRpcFromProcess(proceso).subscribe((response: any) => {
      if (response.Status != 'Ok') {
        utils.showAlert('No se encontro un RPC asociado al proceso', 'error');
        return;
      } else {
        let rpc = response.Values.ResultFields;
        if (rpc != null && rpc.toString().length == 10) {
          this.secopService.getPagosXRpc(this.token, rpc).subscribe((response: any) => {
            if (response.Status != 'Ok') {
              utils.showAlert('Rpc no encontrado, por favor intente de nuevo!', 'error');
            } else {
              this.infoPagos = response.Values.ResultFields;
              this.cantidadCuotas = this.infoPagos.length
              utils.showAlert('Consulta exitosa!', 'success');
              this.onOpenListadoPagos();
            }
          });
        } else {
          utils.showAlert('No se encontro un codigo Rpc asociado!', 'error');
        }
      }
    });
  }

  generateReports() {
    func.generarReporte(this.infoPagos, this.locale, this.centroGestor, this.nombre_contratista, this.identificacion_contratista);
  }

  WatchDescuento(infopago: any) {
    if (this.verDescuentos[infopago[0]]) {
      this.verDescuentos[infopago[0]] = false;
    } else {
      this.verDescuentos[infopago[0]] = true;
    }
  }

  aprobarAutorizacion(proceso:string){
    this.secopService.updateProcess(proceso,this.ROL,this.entidad,this.codigoEntidad,this.username,'aprobado').subscribe((response:any)=>{
      this.service.sendClickEvent();
      if(response.Status = 'Ok'){
        utils.showAlert('Se autorizo el proceso #'+proceso+ ' correctamente!','success');
        //disparar creacion secop segun rol
        // if(this.ROL == 44){
        if(this.ROL == 6){
          //console.log('aqui vamos');
          this.secopService.getUnspscData(this.token,proceso).subscribe((response:any)=>{
            // console.log('aqui estamos');
            // console.log(this.token);
            // console.log(response);
            let usuarioConect = atob(localStorage.getItem('usuarioConect')!);
            let conectPw = atob(localStorage.getItem('conectPw')!);
            let arr: Array<any> = [];
            arr.push(this.infoModal);
            arr.push(response.Values.ResultFields);
            arr.push({"USUARIO_CONNECT":usuarioConect});
            arr.push({"PASSWORD_CONNECT":conectPw});
            arr.push({"USC_CODIGO_ENTIDAD":this.codigoEntidad});
            arr.push({"TOKEN":this.token});

            this.secopService.createSoapProcess(arr).subscribe((response:any)=>{
              console.log(response);
            });
            //utils.sendSoapData(this.PROCESO_SELECCIONADO,response.Values.ResultFields);
          });

        }
        this.getAutorizacionesXEntidad();
      }
    });
  }

  rechazarAutorizacion(proceso:string){
    this.secopService.updateProcess(proceso,this.ROL,this.entidad,this.codigoEntidad,this.username,'rechazado').subscribe((response:any)=>{
      this.service.sendClickEvent();
      if(response.Status = 'Ok'){
        utils.showAlert('Se rechazo el proceso #'+proceso+ '!','warning');
        this.getAutorizacionesXEntidad();
      }
    });
  }

  anularProceso(proceso: string) {
    this.secopService.updateProcess(proceso, this.ROL, this.entidad, this.codigoEntidad, this.username, 'anulado').subscribe((response: any) => {
      this.service.sendClickEvent();
      if (response.Status = 'Ok') {
        utils.showAlert('Se Anulo el proceso #' + proceso + '!', 'warning');
        this.getAutorizacionesXEntidad();
      }
    });
  }

  getAutorizacionesXEntidad(){
    this.secopService.getAutorizacionesXEntidad(this.entidad).subscribe((response:any)=>{
      this.autorizaciones = response.Values.ResultFields;
      this.component == 1 ? this.modal.sendClickEventGetDataProcess() :
        this.component == 2 ? this.modal.sendClickEventDataBusqueda() :
          this.component == 3 ? this.modal.sendClickEventDataAutorizaciones() : '';

      // this.infoProcess();
    })
  }

}
