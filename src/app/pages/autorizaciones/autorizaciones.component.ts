import {AfterContentInit, AfterViewInit, Component, OnInit, ViewChild,Inject,LOCALE_ID} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import * as utils from "../../utils/functions";
import {NavigationExtras, Router} from "@angular/router";
import Swal from "sweetalert2";
import {SecopService} from "../../services/secop/secop.service";
import {ServicesService} from "../../services/services.service";
import * as func from "../../utils/functions";
import {Subscription} from "rxjs";
import {ModalService} from "../../services/modal/modal.service";

@Component({
  selector: 'app-autorizaciones',
  templateUrl: './autorizaciones.component.html',
  styleUrls: ['./autorizaciones.component.css']
})
export class AutorizacionesComponent implements OnInit {
  displayedColumns: string[] = ['Num','Identificacion', 'Nombre', 'Estado', 'Fecha', 'Creador', 'ValorOferta'];
  //Numeración	ID Secop	Nombre del Proceso	Dependencia	Unidad	Equipo	Valor oferta
  public dataSource!: MatTableDataSource<any>;
  public autorizaciones: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('closebutton') closebutton:any;
  @ViewChild('openbutton') openbutton:any;
  PROCESO_SELECCIONADO!:any;
  PROCESO!: any;
  ESTADO!: any;
  ROL: any = atob(localStorage.getItem('rol')!);
  TIPO_PROCESO!: any;
  TIPO_CONTRATO!: any;
  NOMBRE_PROCESO!: any;
  private token: string = localStorage.getItem('token')!;
  private entidad: string = atob(localStorage.getItem('entidad')!);
  private codigoEntidad: string = atob(localStorage.getItem('codigoEntidad')!);
  private username: string = atob(localStorage.getItem('username')!);

  DESCRIPCION_PROCESO: any;
  COD_PROV: any;
  NOM_PROV: any;
  CORREO_PROV: any;
  CELULAR_PROV: any;
  TIP_IDEN_PROV: any;
  DPTO_PROV: any;
  CIUDAD_PROV: any;
  CATE_CONTRATACION: any;
  UBICACION_PROV: any;
  NACIMIENTO_PROV: any;
  GENERO_PROV: any;
  PROFESION_PROV: any;
  JUST_TIPO_PROCESO: any;
  EQUIPO_CONTRATACION: any;
  UNI_CONTRATACION: any;
  DOCUMENTOS_TIPO: any;
  INTERADMINISTRATIVOS: any;
  DEFINIR_LOTES: any;
  FECHA_INICIO: any;
  FECHA_TERMINO: any;
  FIRMA_CONTRATO: any;
  PLAZO_EJECUCION: any;
  PLAN_PAGOS: any;
  VAL_OFERTA: any;
  TIEMPO_DURACION_CONTRATO: any;
  DURACION_CONTRATO: any;
  CODIGO_RPC: any;
  CENTRO_GESTOR: any;
  infoPagos: any;
  private clickEventSubscription!: Subscription;

  constructor(private router: Router,private secopService:SecopService,private service:ServicesService,@Inject(LOCALE_ID) public locale: string,private modal: ModalService) {
  }

  ngOnInit(): void {
    this.getAutorizacionesXEntidad();
    this.clickEventSubscription = this.modal.getClickEventDataAutorizaciones().subscribe(() => {
      this.getAutorizacionesXEntidad();
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  infoProcess(): void {
    if (this.autorizaciones != null && this.autorizaciones.length > 0) {
      this.dataSource = new MatTableDataSource(this.autorizaciones!);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    } else {
      utils.showAlert('Error de información', 'error');
    }
  }

  goDetail(row: any) {
    this.secopService.getSelectedProcess(this.token,row.CONS_PROCESO).subscribe((response: any) => {
      localStorage.setItem('modalData', JSON.stringify(Object.assign({}, response.Values.ResultFields[0][0])));
      this.PROCESO_SELECCIONADO = response.Values.ResultFields[0][0];
      this.CENTRO_GESTOR = response.Values.ResultFields[0][0].CENTRO_GESTOR;
      this.PROCESO = response.Values.ResultFields[0][0].CONS_PROCESO;
      this.TIPO_PROCESO = response.Values.ResultFields[0][0].TIPO_PROCESO;
      this.TIPO_CONTRATO = response.Values.ResultFields[0][0].TIPO_CONTRATO;
      this.NOMBRE_PROCESO = response.Values.ResultFields[0][0].NOMBRE_PROCESO;
      this.DESCRIPCION_PROCESO = response.Values.ResultFields[0][0].DESCRIPCION_PROCESO;
      this.COD_PROV = response.Values.ResultFields[0][0].COD_PROV;
      this.NOM_PROV = response.Values.ResultFields[0][0].NOM_PROV;
      this.NACIMIENTO_PROV = response.Values.ResultFields[0][0].NACIMIENTO_PROV;
      this.CORREO_PROV = response.Values.ResultFields[0][0].CORREO_PROV;
      this.CELULAR_PROV = response.Values.ResultFields[0][0].CELULAR_PROV;
      this.TIP_IDEN_PROV = response.Values.ResultFields[0][0].TIP_IDEN_PROV;
      this.DPTO_PROV = response.Values.ResultFields[0][0].DPTO_PROV;
      this.CIUDAD_PROV = response.Values.ResultFields[0][0].CIUDAD_PROV;
      this.UBICACION_PROV = response.Values.ResultFields[0][0].UBICACION_PROV;
      this.CATE_CONTRATACION = response.Values.ResultFields[0][0].CATE_CONTRATACION;
      this.GENERO_PROV = response.Values.ResultFields[0][0].GENERO_PROV;
      this.PROFESION_PROV = response.Values.ResultFields[0][0].PROFESION_PROV;
      this.JUST_TIPO_PROCESO = response.Values.ResultFields[0][0].JUST_TIPO_PROCESO;
      this.EQUIPO_CONTRATACION = response.Values.ResultFields[0][0].EQUIPO_CONTRATACION;
      this.UNI_CONTRATACION = response.Values.ResultFields[0][0].UNI_CONTRATACION;
      this.DOCUMENTOS_TIPO = response.Values.ResultFields[0][0].DOCUMENTOS_TIPO;
      this.INTERADMINISTRATIVOS = response.Values.ResultFields[0][0].INTERADMINISTRATIVOS;
      this.DEFINIR_LOTES = response.Values.ResultFields[0][0].DEFINIR_LOTES;
      this.ESTADO = response.Values.ResultFields[0][0].ESTADO;
      this.CODIGO_RPC = response.Values.ResultFields[0][0].CODIGO_RPC;
      this.FECHA_INICIO = response.Values.ResultFields[0][0].FECHA_INICIO;
      this.FECHA_TERMINO = response.Values.ResultFields[0][0].FECHA_TERMINO;
      this.FIRMA_CONTRATO = response.Values.ResultFields[0][0].FIRMA_CONTRATO;
      this.PLAZO_EJECUCION = response.Values.ResultFields[0][0].PLAZO_EJECUCION;
      this.PLAN_PAGOS = response.Values.ResultFields[0][0].PLAN_PAGOS;
      this.VAL_OFERTA = response.Values.ResultFields[0][0].VAL_OFERTA;
      this.TIEMPO_DURACION_CONTRATO  = response.Values.ResultFields[0][0].TIEMPO_DURACION_CONTRATO ;
      this.DURACION_CONTRATO = response.Values.ResultFields[0][0].DURACION_CONTRATO;
      this.modal.sendClickEvent();
    });
  }

  getAutorizacionesXEntidad(){
    this.secopService.getAutorizacionesXEntidad(this.entidad).subscribe((response:any)=>{
      this.autorizaciones = response.Values.ResultFields;
      this.infoProcess();
    })
  }

  public onOpen(){
    this.openbutton.nativeElement.click();
  }

  generateReports() {
    func.generarReporte(this.infoPagos, this.locale,this.CENTRO_GESTOR,this.NOM_PROV,this.COD_PROV);
  }
}
