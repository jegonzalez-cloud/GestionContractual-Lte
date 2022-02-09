import {Component, Inject, LOCALE_ID, OnInit, ViewChild} from '@angular/core';
import {NavigationExtras, Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {cargarIdioma} from 'src/app/store/actions';
import {AppState} from 'src/app/store/app.reducers';
import {AuthService} from "../../services/auth/auth.service";
import Swal from "sweetalert2";
import {SecopService} from "../../services/secop/secop.service";
import {ServicesService} from "../../services/services.service";
import {Subscription} from "rxjs";
import * as utils from "../../utils/functions";
import * as func from "../../utils/functions";
import {ModalService} from "../../services/modal/modal.service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  public lenguaje: string = 'es';
  public cantidadAutorizaciones: any;
  public autorizaciones: any;
  private username: string = atob(localStorage.getItem('username')!);
  entidad: string = atob(localStorage.getItem('entidad')!);
  private token: string = localStorage.getItem('token')!;
  private codigoEntidad: string = atob(localStorage.getItem('codigoEntidad')!);
  clickEventSubscription!: Subscription;
  PROCESO!: any;
  ESTADO!: any;
  ROL: any = atob(localStorage.getItem('rol')!);
  TIPO_PROCESO!: any;
  TIPO_CONTRATO!: any;
  NOMBRE_PROCESO!: any;
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
  bbb:boolean=true;
  @ViewChild('closebutton') closebutton: any;
  @ViewChild('openbutton') openbutton: any;
  userImage = "./assets/img/avatar.png";
  nameUser: any;
  logoImage: any;
  public modalData!: any;

  constructor(private router: Router, private store: Store<AppState>, private authService: AuthService, private secopService: SecopService, private service: ServicesService,private modal: ModalService) {
    this.changeVar();
    this.clickEventSubscription = this.service.getClickEvent().subscribe(() => {
      this.getAutorizaciones();
    })
  }

  ngOnInit(): void {
    this.getAutorizaciones();
    this.getUserData();
    this.store.select('idioma').subscribe(({idioma}) => {
      this.lenguaje = idioma;
    });


    // this.cantidadAutorizaciones = 0;
  }

  setIdioma() {
    if (this.lenguaje === 'es') {
      this.lenguaje = 'en';
    } else if (this.lenguaje === 'en') {
      this.lenguaje = 'es';
    }
    localStorage.setItem('lang', this.lenguaje)
    this.store.dispatch(cargarIdioma({idioma: this.lenguaje}));
  }

  async logOut() {
    let token = localStorage.getItem('token')!;
    Swal.fire({
      title: 'Loading...'
    });
    Swal.showLoading();

    this.authService.logout(token).subscribe((data:any) => {
      Swal.close();
      Swal.fire({
        title: '¿Esta seguro de cerrar la sesion?',
        icon: 'warning',
        showCancelButton: false,
        allowOutsideClick: false,
        showCloseButton: true,
        confirmButtonColor: 'red',
        confirmButtonText: 'ACEPTAR!'
      }).then((result) => {
        if (result.isConfirmed) {
          localStorage.clear();
          this.router.navigate(['login']);
        }
      })
    });
  }

  getAutorizaciones() {
    this.secopService.getAutorizaciones(this.username, this.codigoEntidad, this.entidad, '').subscribe((response: any) => {
      if (response.Values.ResultFields != null && response.Values.ResultFields.length > 0) {
        this.cantidadAutorizaciones = response.Values.ResultFields.length;
        this.autorizaciones = response.Values.ResultFields;
      } else {
        this.cantidadAutorizaciones = 0;
        this.autorizaciones = null;
      }
    })
    setInterval(() => {
      this.secopService.getAutorizaciones(this.username, this.codigoEntidad, this.entidad, '').subscribe((response: any) => {
        if (response.Values.ResultFields != null && response.Values.ResultFields.length > 0) {
          this.cantidadAutorizaciones = response.Values.ResultFields.length
          this.autorizaciones = response.Values.ResultFields;
        } else {
          this.cantidadAutorizaciones = 0;
          this.autorizaciones = null;
        }
        // localStorage.setItem('autorizaciones', JSON.stringify(response.Values.ResultFields))
      })
    }, 100000)
  }

  goDetail(row: any) {
    this.secopService.getSelectedProcess(this.token, row).subscribe((response: any) => {
      localStorage.setItem('modalData', JSON.stringify(Object.assign({}, response.Values.ResultFields[0][0])));
      this.PROCESO = response.Values.ResultFields[0][0].CONS_PROCESO;
      this.CENTRO_GESTOR = response.Values.ResultFields[0][0].CENTRO_GESTOR;
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
      this.TIEMPO_DURACION_CONTRATO = response.Values.ResultFields[0][0].TIEMPO_DURACION_CONTRATO;
      this.DURACION_CONTRATO = response.Values.ResultFields[0][0].DURACION_CONTRATO;
      this.modal.sendClickEvent();
    });
  }

  changeVar() {
    let color = atob(localStorage.getItem('color')!);
    let r: any = document.querySelector(':root');
    r.style.setProperty('--companyColor', color);
  }

  getUserData() {
    this.nameUser = localStorage.getItem('name')!;
    this.userImage = localStorage.getItem('userImage')!;
    this.entidad = atob(localStorage.getItem('entidad')!);
    this.userImage = "./assets/img/avatar.png";
    this.logoImage = "./assets/img/Logo-helppeople-2021-horizontal.png";
    this.nameUser = atob(this.nameUser!);
  }
}
