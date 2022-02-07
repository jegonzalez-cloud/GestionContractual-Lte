import {Component, Input, OnInit, SimpleChanges, ViewChild,Inject,LOCALE_ID,} from '@angular/core';
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

  public processComponent! : number;
  public infoPagos!: any;
  public cantidadCuotas: any;
  public verDescuentos: any = [];


  @Input() prueba: any;
  @ViewChild('openbutton') openbutton: any;
  @ViewChild('openbuttonListadoPagos') openbuttonListadoPagos: any;

  private clickEventSubscription!: Subscription;
  private clickEventSubscriptionGetDataProcess!: Subscription;

  constructor(private modal: ModalService, private secopService: SecopService, private service: ServicesService,private router:Router, @Inject(LOCALE_ID) public locale: string) {
    this.clickEventSubscription = this.modal.getClickEvent().subscribe(() => {
      setTimeout(() => {
        this.proceso = this.prueba.CONS_PROCESO;
        this.tipo_proceso = this.prueba.TIPO_PROCESO;
        this.tipo_contrato = this.prueba.TIPO_CONTRATO;
        this.justificacion_proceso = this.prueba.JUST_TIPO_PROCESO;
        this.nombre_proceso = this.prueba.NOMBRE_PROCESO;
        this.unidad_contratacion = this.prueba.UNI_CONTRATACION;
        this.equipo_contratacion = this.prueba.EQUIPO_CONTRATACION;
        this.descripcion_proceso = this.prueba.DESCRIPCION_PROCESO;
        this.tipo_identificacion = this.prueba.TIP_IDEN_PROV;
        this.identificacion_contratista = this.prueba.COD_PROV;
        this.nombre_contratista = this.prueba.NOM_PROV;
        this.fecha_nacimiento_contratista = this.prueba.NACIMIENTO_PROV;
        this.genero_contratista = this.prueba.GENERO_PROV;
        this.correo_contratista = this.prueba.CORREO_PROV;
        this.dpto_contratista = this.prueba.DPTO_PROV;
        this.ciudad_contratista = this.prueba.CIUDAD_PROV;
        this.ubicacion_contratista = this.prueba.UBICACION_PROV;
        this.categoria_contratacion = this.prueba.CATE_CONTRATACION;
        this.profesion_contratista = this.prueba.PROFESION_PROV;
        this.documentos_tipo = this.prueba.DOCUMENTOS_TIPO;
        this.interadministrativos = this.prueba.INTERADMINISTRATIVOS;
        this.definir_lotes = this.prueba.DEFINIR_LOTES;
        this.fecha_inicio = this.prueba.FECHA_INICIO;
        this.fecha_termino = this.prueba.FECHA_TERMINO;
        this.firma_contrato = this.prueba.FIRMA_CONTRATO;
        this.plazo_ejecucion = this.prueba.PLAZO_EJECUCION;
        this.plan_pagos = this.prueba.PLAN_PAGOS;
        this.valor_oferta = this.prueba.VAL_OFERTA;
        this.tiempo_duracion = this.prueba.TIEMPO_DURACION_CONTRATO;
        this.duracion_contrato = this.prueba.DURACION_CONTRATO;
        this.estado = this.prueba.ESTADO;

        this.onOpen();
      }, 100);
    });
  }

  ngOnInit(): void {
    this.processComponent = 0;
    if(this.router.url == '/home/process'){
      this.processComponent = 1;
    }
  }

  public onOpen() {
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

  anularProceso(proceso: string) {
    this.secopService.updateProcess(proceso, this.ROL, this.entidad, this.codigoEntidad, this.username, 'anulado').subscribe((response: any) => {
      this.service.sendClickEvent();
      if (response.Status = 'Ok') {
        utils.showAlert('Se Anulo el proceso #' + proceso + '!', 'warning');
        this.modal.sendClickEventGetDataProcess();
      }
    });
  }

  editarProceso(){
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

}
