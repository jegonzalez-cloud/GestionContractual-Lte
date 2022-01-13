import {AfterViewInit, Component, HostListener, OnDestroy, OnInit, ViewChild, Inject, LOCALE_ID} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {Store} from '@ngrx/store';
import {TranslateService} from '@ngx-translate/core';
import {AuthService} from 'src/app/services/auth/auth.service';
import {SapService} from 'src/app/services/sap/sap.service';
import {SecopService} from 'src/app/services/secop/secop.service';
import {AppState} from 'src/app/store/app.reducers';
import Swal from 'sweetalert2';
import * as utils from '../../utils/functions'
import {ServicesService} from "../../services/services.service";
import {MatPaginator} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";
import {MatDialog} from '@angular/material/dialog';
import {MatSort} from "@angular/material/sort";
import {NavigationExtras, Router} from "@angular/router";
import * as moment from 'moment';
import * as funciones from "../../utils/functions";
import * as func from "../../utils/functions";
import * as XLSX from "xlsx";
import {TooltipPosition} from '@angular/material/tooltip';
import {concatMap, delay, map, switchMap} from "rxjs/operators";
import {formatDate, formatPercent} from "@angular/common";
import {error} from "jquery";

@Component({
  selector: 'app-process',
  templateUrl: './process.component.html',
  styleUrls: ['./process.component.css']
})
export class ProcessComponent implements OnDestroy, OnInit, AfterViewInit {
  private idioma!: string;
  createProcessForm!: FormGroup;
  departments: any = [];
  info_process: any = [];
  page: number = 0;
  result: any = [];
  secopSearch: any = [];
  userDataFromSecop: any = [];
  camposSecop: any[] = [];
  validadorTipoIdentidad: boolean = true;
  data: any;
  unidades: any[] = [];
  equipos: any[] = [];
  gastos: any[] = ['Funcionamiento', 'Inversion'];
  color: boolean = false;
  public fecha: string = this.getCurrentDate();
  public fechaMinimaNacimiento: string = this.ValidarMayoriaEdad();
  public tiposProceso: any;
  public tiposContrato: any;
  public tiposJustificacionContrato: any;
  public equipoContratacion: any;
  public iconColor: string = 'lightgray';
  public valorContrato: any = true;
  public departamentos: any;
  public municipios: any;
  // public displayedColumns: string[] = ['Numeración',	'Nombre del proceso',	'Entidad',	'Unidad',	'Equipo',	'Valor Oferta'];
  public displayedColumns: string[] = ['Num', 'Nombre', 'Entidad', 'Unidad', 'ValorOferta'];
  public displayedColumnsProcess: string[] = ['Num', 'Identificacion', 'Nombre', 'Estado', 'Fecha', 'Creador', 'ValorOferta'];
  //Numeración	ID Secop	Nombre del Proceso	Dependencia	Unidad	Equipo	Valor oferta
  public dataSource!: MatTableDataSource<any>;
  public dataSourceSecop!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  // @ViewChild(MatPaginator) paginatorSecop!: MatPaginator;
  @ViewChild('paginatorSecop', {static: true}) paginatorSecop!: MatPaginator;
  // @ViewChild('sortSecop', { static: true }) sortSecop!: MatSort;
  @ViewChild(MatSort) sortSecop!: MatSort;
  private token: string = localStorage.getItem('token')!;
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
  PROCESO!: any;
  ESTADO!: any;
  CODIGO_RPC!: any;
  infoPagos!: any;
  ROL: any = atob(localStorage.getItem('rol')!);
  private entidad: string = atob(localStorage.getItem('entidad')!);
  private codigoEntidad: string = atob(localStorage.getItem('codigoEntidad')!);
  private username: string = atob(localStorage.getItem('username')!);
  private centroGestor: string = atob(localStorage.getItem('centroGestor')!);
  toppingList: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];
  codigoUNSPSC!: any;
  myForm!: FormGroup;
  cdpForm!: FormGroup;
  arr!: FormArray;
  cdpArray!: FormArray;
  colorBotonUNSPSC = '#0b9fa5';
  borderBotonUSNPSC = '#0b9fa5';
  fontcolorBotonUNSPSC = '#0b9fa5';
  validateDataUNSPSC: number = 0;
  validateDataCdp: number = 0;
  UNIDADESUNSPSC!: any;
  categoriasProfesion!: any;
  categoriasSubProfesion!: any;
  @ViewChild('closebutton') closebutton: any;
  @ViewChild('closebuttonUNSPSC') closebuttonUNSPSC: any;
  @ViewChild('closebuttonCdp') closebuttonCdp: any;
  @ViewChild('openbutton') openbutton: any;
  @ViewChild('openbuttonErrorCdp') openbuttonErrorCdp: any;
  CENTRO_GESTOR: any;
  progressValue: number = 0;
  progressValueTotal: number = 0;
  procesosError: any = [];
  cdpError: any = [];
  procesosExitosos: any = [];
  cantidadError: any;
  cantidadErrorCdp: any;
  verErrores: any;
  filename: any = 'Seleccione un archivo';
  minSalary: any;
  maxSalary: any;
  cantidadMaximaSalarios: any;
  isJuridico: any;

  // TODO: validaciones:
  validacionCelular: boolean = false;
  validacionCorreo: boolean = false;
  verDescuentos: any = [];
  cantidadCuotas: any;
  valorAcomparar: any;

  constructor(
    private fb: FormBuilder,
    private secopService: SecopService,
    private service: ServicesService,
    private sapService: SapService,
    private authService: AuthService,
    private translate: TranslateService,
    private store: Store<AppState>,
    public dialog: MatDialog,
    private router: Router,
    @Inject(LOCALE_ID) public locale: string
  ) {
    this.store.select('idioma').subscribe(({idioma}) => {
      this.idioma = idioma;
      this.translate.use(idioma);
    });
  }

  ngAfterViewInit() {
    this.secopService.sendGetDataSecop().subscribe((data: any) => {
      // console.log(data)
      this.result = data;
      this.dataSourceSecop = new MatTableDataSource(this.result);
      this.dataSourceSecop.paginator = this.paginatorSecop;
      this.dataSourceSecop.sort = this.sortSecop;
    });
  }

  ngOnDestroy(): void {
  }

  // @HostListener('window:beforeunload')
  // onBeforeUnload() {
  //   return false;
  // }

  ngOnInit(): void {
    let username = atob(localStorage.getItem('username')!);
    this.minSalary = atob(localStorage.getItem('salarioMinimo')!);//985000; // traer salario minimo de la base de datos
    this.maxSalary = atob(localStorage.getItem('topeMaximo')!);//985000; // traer salario minimo de la base de datos
    // let token = atob(localStorage.getItem('token')!);
    let codigoEntidad = atob(localStorage.getItem('codigoEntidad')!);
    this.service.getUnidadesContratacion(username, codigoEntidad).subscribe((data: any) => {
      this.unidades = data.Values.ResultFields;
    });

    this.createProcessForm = this.fb.group({
      token: new FormControl(atob(localStorage.getItem('token')!)),
      username: new FormControl(atob(localStorage.getItem('username')!)),
      codigoEntidad: new FormControl(atob(localStorage.getItem('codigoEntidad')!)),
      centroGestor: new FormControl(atob(localStorage.getItem('centroGestor')!)),
      //*****************************************************************************************************************
      tipoIdentificacion: new FormControl(null, [Validators.required]),
      identificacion: new FormControl({value: '', disabled: true}, [Validators.required]),
      proveedor: new FormControl({value: '', disabled: true}, [Validators.required]),
      ubicacion: new FormControl({value: '', disabled: true}, [Validators.required]),
      fechaNacimiento: new FormControl({value: '', disabled: true}, [Validators.required]),
      genero: new FormControl(null, [Validators.required]),
      departamento: new FormControl(null, [Validators.required]),
      municipio: new FormControl(null, [Validators.required]),
      categoriaContratacion: new FormControl(null, [Validators.required]),
      profesion: new FormControl({value: null, disabled: false}, [Validators.required]),
      correo: new FormControl('', [Validators.required, Validators.email]),
      celular: new FormControl({value: '',disabled: false}, [Validators.required, Validators.minLength(10), Validators.maxLength(10)]),
      //****************************************************************************************************************
      tipoProceso: new FormControl(null, [Validators.required]),
      tipoContrato: new FormControl(null, [Validators.required]),
      justificacionTipoProceso: new FormControl(null, [Validators.required]),
      nombreProceso: new FormControl('', [Validators.required]),
      objeto: new FormControl('', [Validators.required]),
      unidad: new FormControl(null, [Validators.required]),
      equipo: new FormControl(null, [Validators.required]),
      acuerdos: new FormControl({value: 'NO', disabled: true}, [Validators.required]),
      acuerdoPaz: new FormControl({value: 'NO', disabled: true}, [Validators.required]),
      //****************************************************************************************************************
      documentosTipo: new FormControl({value: 'NO', disabled: false}),
      codigoUNSPSC: new FormControl({value: '', disabled: false}),
      interadministrativos: new FormControl({value: 'NO', disabled: true}, [Validators.required]),
      definirLotes: new FormControl({value: 'NO', disabled: true}, [Validators.required]),
      firmaContrato: new FormControl({value: null, disabled: false}, [Validators.required]),
      fechaInicio: new FormControl({value: null, disabled: false}, [Validators.required]),
      fechaTermino: new FormControl({value: null, disabled: false}, [Validators.required]),
      plazoEjecucion: new FormControl({value: null, disabled: false}, [Validators.required]),
      definirPagos: new FormControl({value: 'NO', disabled: true}, [Validators.required]),
      valorContrato: new FormControl({value: '', disabled: true}, [Validators.required]),
      duracionContrato: new FormControl({value: null, disabled: true}, [Validators.required]),
      tiempoDuracion: new FormControl({value: '', disabled: true}, [Validators.required]),
      comite: new FormControl({value: '', disabled: false}, [Validators.required]),
      // cdp: new FormControl({value: '', disabled: true}, [Validators.required]),
      // categoriaProfesion: new FormControl({value: '', disabled: false}, [Validators.required]),
    });
    this.myForm = this.fb.group({
      arr: this.fb.array([this.createItem()])
    })
    this.cdpForm = this.fb.group({
      cdpArray: this.fb.array([this.createCdpItem()])
    })
    //*************** TABLAS PROCESOS ********************
    this.getdataProcess();
    //****************************************************
    this.getChangeContractValue();
    this.getTiposProceso();
    this.departmentsCont();
    this.getUserData();
    this.getDepartamentos();
    this.getUnidadesUnspsc();
    this.getCategoriaProfesion();
    // this.fillEntidad();
  }

  infoProcess(): void {
    if (this.info_process.Status === 'Ok') {
      this.info_process = this.info_process.Values[0];
      this.dataSource = new MatTableDataSource(this.info_process);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    } else {
      utils.showAlert('Error de información', 'error');
    }
  }

  getChangeContractValue() {
    this.createProcessForm.controls['valorContrato'].valueChanges.subscribe((data: number) => {
      this.cdpForm.reset();
      // this.cdpForm.reset();
      if (data > 0) {
        this.valorContrato = false;
        this.valorAcomparar = data;
        this.createProcessForm.controls['duracionContrato'].reset();
        this.createProcessForm.controls['duracionContrato'].disable();
        this.createProcessForm.controls['tiempoDuracion'].reset();
        this.createProcessForm.controls['tiempoDuracion'].disable();
        // this.createProcessForm.controls['cdp'].reset();
        this.iconColor = 'lightgray';
        this.color = false;
        this.getColor();
      } else {
        this.valorContrato = true;
      }
    })
  }

  departmentsCont(): void {
    let token = atob(localStorage.getItem('token')!);
    this.secopService.getDepartmentsCont(token).subscribe((data) => {
      this.departments = data;
      this.departments = this.departments.Values;
    });
  }

  getUserData() {
    let token = atob(localStorage.getItem('token')!);
    let username = atob(localStorage.getItem('username')!);
    this.authService.getDept(token, username).subscribe((data) => {
      // console.log(data);
    });
  }

  onKeydownEvent(event: HTMLInputElement): void {
    let search_item = event.value.length;
    let search_value = event.value;
    // console.log(search_value);

    if (search_item > 4) {
      this.secopService
        // .searchDataSecop('nit','tipo_empresa',tipoIdValue, search_value)
        .searchDataSecop('nit', search_value)
        .subscribe((data) => {
          this.userDataFromSecop = data;
          if (this.userDataFromSecop.length > 0) {
            this.createProcessForm.controls['proveedor'].setValue(this.userDataFromSecop[0].nombre)
            this.createProcessForm.controls['ubicacion'].setValue(this.userDataFromSecop[0].ubicacion)
            // this.camposSecop = [];
            // this.camposSecop.push(this.userDataFromSecop[0].nombre);
            // this.camposSecop.push(this.userDataFromSecop[0].ubicacion);
          } else {
            utils.showAlert("El N° de identificacion no se encontro!", "error");
            this.camposSecop = [];
            return;
          }
        });
    } else {
      let Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer);
          toast.addEventListener('mouseleave', Swal.resumeTimer);
        },
      });
      Toast.fire({
        icon: 'error',
        title: 'El valor a insertar debe ser mayor a 4 digitos!',
      });
      return;
    }
  }

  createProcess() {
    if (this.createProcessForm.invalid) {
      return;
    }
    let duracion = this.createProcessForm.controls['duracionContrato'].value;
    let tiempo_duracion = this.createProcessForm.controls['tiempoDuracion'].value;
    this.formatDate(this.createProcessForm.controls['fechaNacimiento'].value, 'fechaNacimiento');
    this.formatDate(this.createProcessForm.controls['fechaTermino'].value, 'fechaTermino');
    this.formatDate(this.createProcessForm.controls['firmaContrato'].value, 'firmaContrato');
    this.formatDate(this.createProcessForm.controls['fechaInicio'].value, 'fechaInicio');
    this.formatDate(this.createProcessForm.controls['plazoEjecucion'].value, 'plazoEjecucion');
    this.createProcessForm.enable();
    this.createProcessForm.controls['username'].setValue(atob(localStorage.getItem('username')!));
    this.createProcessForm.controls['codigoEntidad'].setValue(atob(localStorage.getItem('codigoEntidad')!));
    this.createProcessForm.controls['centroGestor'].setValue(atob(localStorage.getItem('centroGestor')!));
    this.createProcessForm.controls['token'].setValue(atob(localStorage.getItem('token')!));
    this.createProcessForm.controls['duracionContrato'].setValue(duracion);
    this.createProcessForm.controls['tiempoDuracion'].setValue(tiempo_duracion);
    let dataForm = Object.assign(this.createProcessForm.value);
    this.secopService.insertProcess(dataForm).subscribe(
      (data: any) => {
        if (data.Status == 'Ok') {
          this.createProcessForm.reset();
          this.createProcessForm.controls['valorContrato'].setValue('');
          this.createProcessForm.controls['valorContrato'].disable();
          this.createProcessForm.controls['tiempoDuracion'].disable();
          this.createProcessForm.controls['acuerdos'].setValue('NO');
          this.createProcessForm.controls['documentosTipo'].setValue('NO');
          this.createProcessForm.controls['codigoUNSPSC'].reset();
          this.createProcessForm.controls['interadministrativos'].setValue('NO');
          this.createProcessForm.controls['acuerdoPaz'].setValue('NO');
          this.createProcessForm.controls['definirPagos'].setValue('NO');
          this.createProcessForm.controls['definirLotes'].setValue('NO');
          this.createProcessForm.controls['genero'].reset();
          this.createProcessForm.controls['departamento'].reset();
          this.createProcessForm.controls['municipio'].reset();
          this.createProcessForm.controls['profesion'].reset();
          this.color = false;
          utils.showAlert('Proceso creado correctamente!', 'success');
          this.secopService.getDataProcess('0001', 1, this.centroGestor).subscribe((data: any) => {
            this.info_process = data;
            this.infoProcess();
          });
          let tamanio = this.myForm.controls['arr'].value.length;
          for (let i = 0; i < tamanio; i++) {
            this.myForm.controls['arr'].value[i].proceso = data.proId;
          }
          // let unspscForm = Object.assign(this.myForm.controls['arr'].value);
          this.secopService.insertUNSPSC(this.myForm.controls['arr'].value).subscribe((response: any) => {
            this.myForm.controls['arr'].reset();
            this.myForm.reset();
          });

          let dataCdp = localStorage.getItem('dataCdp');
          if (dataCdp != null) {
            // console.log(1)
            let dato = JSON.parse(dataCdp);
            // console.log(dato)
            // console.log(dato.length)
            let size = dato.length;
            for (let i = 0; i < size; i++) {
              dato[i].proceso = data.proId;
            }
            this.secopService.insertCdp(dato).subscribe((response: any) => {
              // console.log(response);
              this.cdpForm.reset();
            });
          }
        }
      }, (error: any) => {
        this.createProcessForm.reset();
        utils.showAlert('Proceso creado incorrectamente!', 'error');
        console.log('error ==> ' + error);
      });
    this.createProcessForm.controls['acuerdoPaz'].disable();
    this.createProcessForm.controls['definirPagos'].disable();
    this.createProcessForm.controls['definirLotes'].disable();
    this.createProcessForm.controls['interadministrativos'].disable();
    this.createProcessForm.controls['codigoUNSPSC'].disable();
    this.createProcessForm.controls['documentosTipo'].disable();
    this.createProcessForm.controls['acuerdos'].disable();
    this.createProcessForm.controls['ubicacion'].disable();
    this.createProcessForm.controls['proveedor'].disable();
    // this.createProcessForm.controls['cdp'].disable();
  }

  changeTipoIdentificacion(data: any) {
    this.createProcessForm.controls['identificacion'].enable();
    this.createProcessForm.controls['valorContrato'].enable();
    this.createProcessForm.controls['valorContrato'].setValue('');
    this.createProcessForm.controls['fechaNacimiento'].setValue('');
    this.createProcessForm.controls['duracionContrato'].reset();
    if (data.value == 'Nit') {
      this.isJuridico = true;
      this.fechaMinimaNacimiento = '';
    } else {
      this.isJuridico = false;
      this.fechaMinimaNacimiento = this.ValidarMayoriaEdad();
    }
    this.createProcessForm.controls['fechaNacimiento'].enable();
    this.iconColor = 'lightgray';
  }

  async getCdpMountValidate() {
    this.color = false;
    this.iconColor = 'lightgray';
    this.getColor();
    let dataCdp = localStorage.getItem('dataCdp');
    if (dataCdp != null && this.createProcessForm.controls['valorContrato'].value != null) {
      let data = JSON.parse(dataCdp);
      let longitud = data.length;
      for (let i = 0; i < longitud; i++) {
        let cdp = data[i].cdp;
        let vigencia = data[i].vigencia;
        let valor = data[i].valor;
        let res =  await this.secopService.getCdpMount(this.token, this.centroGestor, cdp, valor, vigencia).toPromise().then((response: any) => {
          if (response.Status != 'Ok') {
            this.color = false;
            this.createProcessForm.controls['duracionContrato'].setValue('');
            this.createProcessForm.controls['tiempoDuracion'].setValue('');
            this.createProcessForm.controls['duracionContrato'].disable();
            this.createProcessForm.controls['tiempoDuracion'].disable();
            this.cdpError.push({posicion:'Cdp N°' +(i + 1),cdp:cdp,vigencia:vigencia,valor:valor,error:response.Values.Error});
          }
          else{
            if(response.Values.ResultFields < valor){
              this.cdpError.push({posicion:'Cdp N°' +(i + 1),cdp:cdp,vigencia:vigencia,valor:valor,error:'Valor mayor a monto Cdp'});
            }
          }
        }).catch((error: any) => {
          console.log(error);
        });
        // this.secopService.getCdpMount(this.token, this.centroGestor, cdp, this.createProcessForm.controls['valorContrato'].value, vigencia).subscribe((response: any) => {
        //   console.log('response');
        //   console.log(response);
        //   if (response.Status != 'Ok') {
        //     this.color = false;
        //     utils.showAlert('CDP no encontrado por favor intente de nuevo!', 'error');
        //     // this.createProcessForm.controls['cdp'].setValue('');
        //     this.createProcessForm.controls['duracionContrato'].setValue('');
        //     this.createProcessForm.controls['tiempoDuracion'].setValue('');
        //     this.createProcessForm.controls['duracionContrato'].disable();
        //     this.createProcessForm.controls['tiempoDuracion'].disable();
        //     //resolve();
        //   } else {
        //     let monto = response.Values.ResultFields;
        //     if (monto != null && monto != '' && monto.length > 0 && parseFloat(monto) < this.createProcessForm.controls['valorContrato'].value) {
        //       this.color = false;
        //       utils.showAlert('No hay fondos suficientes!', 'error');
        //       // this.createProcessForm.controls['cdp'].setValue('');
        //       this.createProcessForm.controls['duracionContrato'].setValue('');
        //       this.createProcessForm.controls['tiempoDuracion'].setValue('');
        //       this.createProcessForm.controls['duracionContrato'].disable();
        //       this.createProcessForm.controls['tiempoDuracion'].disable();
        //       //resolve();
        //     } else {
        //       this.color = true;
        //       //utils.showAlert('Valor del contrato valido', 'success');
        //       //utils.showAlert('Por favor ingrese un CDP de 10 digitos!', 'error');
        //       this.valorAcomparar = this.createProcessForm.controls['valorContrato'].value;
        //       // localStorage.setItem('cdp',cdp);
        //       // this.createProcessForm.controls['cdp'].setValue(cdp);
        //       this.createProcessForm.controls['duracionContrato'].enable();
        //     }
        //   }
        // });
        // alert(i)
        if(i == longitud-1){
          this.verificarErroresCdp(this.cdpError.length);
        }
      }
    }

    // if (
    //   this.createProcessForm.controls['valorContrato'].value != null &&
    //   this.createProcessForm.controls['valorContrato'].value != '' &&
    //   this.createProcessForm.controls['valorContrato'].value >= 1
    // ) {
    // const {value: formValues} = await Swal.fire({
    //   title: 'Ingrese el número de CDP',
    //   showCloseButton: true,
    //   confirmButtonColor: '#007BFF',
    //   confirmButtonText: 'Continue',
    //   input: 'text',
    //   inputAttributes: {
    //     autocapitalize: 'off',
    //     maxlength: '10',
    //     minlength: '10'
    //   },
    //   allowOutsideClick: false,
    //   focusConfirm: false,
    //   inputValidator: (value: any) => {
    //     return new Promise(async (resolve: any) => {
    //       if (value.length == 10) {
    //         let cdp = value;
    //         const {value: vigencia} = await Swal.fire({
    //           title: 'Ingrese la vigencia del CDP',
    //           showCloseButton: true,
    //           confirmButtonColor: '#007BFF',
    //           confirmButtonText: 'Continue',
    //           input: 'text',
    //           inputAttributes: {
    //             autocapitalize: 'off',
    //             maxlength: '4',
    //             minlength: '4'
    //           },
    //           allowOutsideClick: false,
    //           focusConfirm: false,
    //           inputValidator: (value: any) => {
    //             return new Promise((resolve: any) => {
    //               if (value.length == 4) {
    //                 let vigencia = value;
    //                 this.centroGestor = atob(localStorage.getItem('centroGestor')!);
    //                 this.secopService.getCdpMount(this.token, this.centroGestor, cdp, this.createProcessForm.controls['valorContrato'].value, vigencia).subscribe((response: any) => {
    //                   console.log('response');
    //                   console.log(response);
    //                   if (response.Status != 'Ok') {
    //                     this.color = false;
    //                     utils.showAlert('CDP no encontrado por favor intente de nuevo!', 'error');
    //                     // this.createProcessForm.controls['cdp'].setValue('');
    //                     this.createProcessForm.controls['duracionContrato'].setValue('');
    //                     this.createProcessForm.controls['tiempoDuracion'].setValue('');
    //                     this.createProcessForm.controls['duracionContrato'].disable();
    //                     this.createProcessForm.controls['tiempoDuracion'].disable();
    //                     //resolve();
    //                   } else {
    //                     let monto = response.Values.ResultFields;
    //                     if (monto != null && monto != '' && monto.length > 0 && parseFloat(monto) < this.createProcessForm.controls['valorContrato'].value) {
    //                       this.color = false;
    //                       utils.showAlert('No hay fondos suficientes!', 'error');
    //                       // this.createProcessForm.controls['cdp'].setValue('');
    //                       this.createProcessForm.controls['duracionContrato'].setValue('');
    //                       this.createProcessForm.controls['tiempoDuracion'].setValue('');
    //                       this.createProcessForm.controls['duracionContrato'].disable();
    //                       this.createProcessForm.controls['tiempoDuracion'].disable();
    //                       //resolve();
    //                     } else {
    //                       this.color = true;
    //                       //utils.showAlert('Valor del contrato valido', 'success');
    //                       //utils.showAlert('Por favor ingrese un CDP de 10 digitos!', 'error');
    //                       this.valorAcomparar = this.createProcessForm.controls['valorContrato'].value;
    //                       // localStorage.setItem('cdp',cdp);
    //                       // this.createProcessForm.controls['cdp'].setValue(cdp);
    //                       this.createProcessForm.controls['duracionContrato'].enable();
    //                     }
    //                     resolve();
    //                   }
    //                 });
    //               } else {
    //                 resolve('Por favor Ingrese 4 Digitos :)')
    //               }
    //             })
    //           }
    //         });
    //         // resolve();
    //       } else {
    //         resolve('Por favor Ingrese 10 Digitos :)')
    //       }
    //     })
    //   }
    // });
    //
    // if (formValues) {
    //   if (formValues!.toString().length != 10) {
    //     utils.showAlert('Por favor ingrese un CDP de 10 digitos!', 'error');
    //     return;
    //   }
    // }
    // }
  }

  verificarErroresCdp(errores:any){
    if(errores != null && errores != 0){
      localStorage.removeItem('dataCdp');
      this.cantidadErrorCdp = errores;
      utils.showAlert('Por favor revise los Cdp ingresados','warning');
      this.onOpenErroresCdp();
      this.validateDataCdp = 0;
    }
    else{
      this.validateDataCdp = 1;
      this.color = true;
      this.createProcessForm.controls['duracionContrato'].enable();
      utils.showAlert('Codigos CDP validos exitosamente', 'success');
    }
  }

  // changeEscolaridad() {
  //   if (
  //     this.createProcessForm.controls['escolaridad'].value !== 'Selecione...'
  //   ) {
  //     alert(this.createProcessForm.controls['escolaridad'].value);
  //     this.createProcessForm.controls['profesion'].enable();
  //   } else {
  //     this.createProcessForm.controls['profesion'].disable();
  //   }
  // }

  getColor() {
    let validColor = (this.color === true) ? 'lightgreen' : 'lightgray';
    return validColor;
  }

  formatDate(data: string, campo: string) {
    let result = moment(data).format().slice(0, -6);
    // let d = new Date(data);
    // let dia = (d.getDate().toString().length == 1) ? '0' + d.getDate().toString() : d.getDate().toString();
    // let mes = ((d.getMonth() + 1).toString().length == 1) ? '0' + (d.getMonth() + 1).toString() : (d.getMonth() + 1).toString();
    // let anio = d.getFullYear();
    // let hora = d.getHours();
    // let minutos = (d.getMinutes().toString().length == 1) ? '0' + d.getMinutes() : d.getMinutes();
    // let segundos = (d.getSeconds().toString().length == 1) ? '0' + d.getSeconds() : d.getSeconds();
    return this.createProcessForm.controls[campo].setValue(result);
  }

  getCurrentDate() {
    let d = new Date();
    let dia = (d.getDate().toString().length == 1) ? '0' + d.getDate().toString() : d.getDate().toString();
    let mes = ((d.getMonth() + 1).toString().length == 1) ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1);
    let anio = d.getFullYear();
    let hora = (d.getHours().toString().length == 1) ? '0' + d.getHours().toString() : d.getHours().toString();
    let minutos = (d.getMinutes().toString().length == 1) ? '0' + d.getMinutes().toString() : d.getMinutes().toString();
    return anio + '-' + mes + '-' + dia + 'T' + hora + ':' + minutos;
  }

  getTiposProceso() {
    this.createProcessForm.controls['justificacionTipoProceso'].reset('')
    this.service.getTipoProceso().subscribe((data: any) => {
      this.tiposProceso = data.Values.ResultFields;
    })
  }

  getTiposContrato() {
    this.tiposJustificacionContrato = null;
    this.service.getTiposContrato(this.createProcessForm.controls['tipoProceso'].value).subscribe((data: any) => {
      this.tiposContrato = data.Values.ResultFields;
    })
  }

  getTiposJustificacionContrato() {
    this.service.getTiposJustificacionContrato(this.createProcessForm.controls['tipoContrato'].value).subscribe((data: any) => {
      this.tiposJustificacionContrato = data.Values.ResultFields;
    })
  }

  getEquipoContratacion() {
    this.service.getEquipoContratacion(this.createProcessForm.controls['tipoProceso'].value).subscribe((data: any) => {
      this.equipoContratacion = data.Values.ResultFields;
    });
  }

  validateMount(value: any) {
    // this.createProcessForm.controls['duracionContrato'].setValue(value.target.value.toString())
    let valorContrato = this.createProcessForm.controls['valorContrato'].value;
    let tipoIdentificacion = this.createProcessForm.controls['tipoIdentificacion'].value;
    let duracionContrato = this.createProcessForm.controls['duracionContrato'].value;

    let validate;
    switch (tipoIdentificacion) {
      case 'Cédula':
        validate = (valorContrato / duracionContrato < this.maxSalary) ? true : false;
        break;
      case 'Cédula de Extranjería':
        validate = (valorContrato / duracionContrato < this.maxSalary) ? true : false;
        break;
      case 'Nit':
        validate = (valorContrato > (this.minSalary * this.cantidadMaximaSalarios)) ? false : true;
        break;
      default:
        validate = false;
        break;
    }
    // console.log(validate);
    // this.iconColor = (validate === true) ? 'lightgreen' : 'lightgray';

    if (validate === true) {
      this.iconColor = 'lightgreen';
      // utils.showAlert('validación! ','success');
    } else {
      this.iconColor = 'lightgray';
      this.validateDataUNSPSC = 0;
      utils.showAlert('El valor excede los limites establecidos en la tabla de honorarios! ', 'error');
    }
  }

  getDepartamentos() {
    this.service.getDepartamentos('1').subscribe((data: any) => {
      this.departamentos = data.Values.ResultFields;
    });
  }

  getMunicipios() {
    let dpto = this.createProcessForm.controls['departamento'].value
    this.service.getMunicipios(dpto).subscribe((data: any) => {
      this.municipios = data.Values.ResultFields;
    });
  }

  // test() {
  //   alert('jojojo')
  //   utils.sendSoapData([], '');
  // }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  applyFilterSecop(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceSecop.filter = filterValue.trim().toLowerCase();
    if (this.dataSourceSecop.paginator) {
      this.dataSourceSecop.paginator.firstPage();
    }
  }

  activateTiempo() {
    this.createProcessForm.controls['tiempoDuracion'].enable();
    this.createProcessForm.controls['tiempoDuracion'].setValue('');
    this.iconColor = 'lightgray';
    this.validateDataUNSPSC = 0;
  }

  validateDuracion(evento: any) {
    let duracion = this.createProcessForm.controls['duracionContrato'].value;
    let tiempoTotal;

    switch (duracion) {
      case 'Años':
        tiempoTotal = (evento.target.value * 12);
        this.validateMoney(tiempoTotal);
        break;
      case 'Dias':
        tiempoTotal = (evento.target.value / 30);
        this.validateMoney(tiempoTotal);
        break;
      case 'Horas':
        tiempoTotal = (evento.target.value / 720);
        this.validateMoney(tiempoTotal);
        break;
      case 'Meses':
        tiempoTotal = evento.target.value;
        this.validateMoney(tiempoTotal);
        break;
      case 'Semanas':
        tiempoTotal = (evento.target.value / 4.345);
        this.validateMoney(tiempoTotal);
        break;
      default:
        break;
    }
  }

  validateMoney(tiempoTotal: any) {
    //let salarioMinimo = 980000;
    let tipoIdentificacion = this.createProcessForm.controls['tipoIdentificacion'].value;
    let valorContrato = this.createProcessForm.controls['valorContrato'].value;

    if (tipoIdentificacion == 'Cédula' || tipoIdentificacion == 'Cédula de Extranjería') {
      if ((valorContrato / tiempoTotal) > this.maxSalary) {
        this.iconColor = 'lightgray';
        this.validateDataUNSPSC = 0;
        utils.showAlert('El valor excede los limites establecidos en la tabla de honorarios! ', 'error');
      } else {
        this.createProcessForm.controls['comite'].setValue('NO');
        // console.log(this.createProcessForm.controls['comite'].value);
        // console.log(this.createProcessForm.controls['cdp'].value);
        this.iconColor = 'lightgreen';
      }
    } else if (tipoIdentificacion == 'Nit') {
      // if ((valorContrato / tiempoTotal) > (salarioMinimo * 100)) {
      if (valorContrato > (this.minSalary * this.cantidadMaximaSalarios)) {
        // this.iconColor = 'lightgray';
        // console.log(salarioMinimo*100)
        this.iconColor = 'lightgreen';
        this.createProcessForm.controls['comite'].setValue('SI');
        // console.log(this.createProcessForm.controls['comite'].value);
        // utils.showAlert('El valor excede los limites establecidos en la tabla de honorarios! ', 'error');
      } else {
        this.iconColor = 'lightgreen';
        this.createProcessForm.controls['comite'].setValue('NO');
        // console.log(this.createProcessForm.controls['comite'].value);
      }
    }
  }

  changeTiempoDuracion() {
    this.iconColor = 'lightgray';
    this.validateDataUNSPSC = 0;
  }

  goDetail(row: any) {
    this.secopService.getSelectedProcess(this.token, row.CONS_PROCESO).subscribe((response: any) => {
      this.PROCESO = response.Values.ResultFields[0].CONS_PROCESO;
      this.CENTRO_GESTOR = response.Values.ResultFields[0].CENTRO_GESTOR;
      this.TIPO_PROCESO = response.Values.ResultFields[0].TIPO_PROCESO;
      this.TIPO_CONTRATO = response.Values.ResultFields[0].TIPO_CONTRATO;
      this.NOMBRE_PROCESO = response.Values.ResultFields[0].NOMBRE_PROCESO;
      this.DESCRIPCION_PROCESO = response.Values.ResultFields[0].DESCRIPCION_PROCESO;
      this.COD_PROV = response.Values.ResultFields[0].COD_PROV;
      this.NOM_PROV = response.Values.ResultFields[0].NOM_PROV;
      this.NACIMIENTO_PROV = response.Values.ResultFields[0].NACIMIENTO_PROV;
      this.CORREO_PROV = response.Values.ResultFields[0].CORREO_PROV;
      this.CELULAR_PROV = response.Values.ResultFields[0].CELULAR_PROV;
      this.TIP_IDEN_PROV = response.Values.ResultFields[0].TIP_IDEN_PROV;
      this.DPTO_PROV = response.Values.ResultFields[0].DPTO_PROV;
      this.CIUDAD_PROV = response.Values.ResultFields[0].CIUDAD_PROV;
      this.UBICACION_PROV = response.Values.ResultFields[0].UBICACION_PROV;
      this.CATE_CONTRATACION = response.Values.ResultFields[0].CATE_CONTRATACION;
      this.GENERO_PROV = response.Values.ResultFields[0].GENERO_PROV;
      this.PROFESION_PROV = response.Values.ResultFields[0].PROFESION_PROV;
      this.JUST_TIPO_PROCESO = response.Values.ResultFields[0].JUST_TIPO_PROCESO;
      this.EQUIPO_CONTRATACION = response.Values.ResultFields[0].EQUIPO_CONTRATACION;
      this.UNI_CONTRATACION = response.Values.ResultFields[0].UNI_CONTRATACION;
      this.DOCUMENTOS_TIPO = response.Values.ResultFields[0].DOCUMENTOS_TIPO;
      this.INTERADMINISTRATIVOS = response.Values.ResultFields[0].INTERADMINISTRATIVOS;
      this.DEFINIR_LOTES = response.Values.ResultFields[0].DEFINIR_LOTES;
      this.ESTADO = response.Values.ResultFields[0].ESTADO;

      this.CODIGO_RPC = response.Values.ResultFields[0].CODIGO_RPC;
      this.FECHA_INICIO = response.Values.ResultFields[0].FECHA_INICIO;
      this.FECHA_TERMINO = response.Values.ResultFields[0].FECHA_TERMINO;
      this.FIRMA_CONTRATO = response.Values.ResultFields[0].FIRMA_CONTRATO;
      this.PLAZO_EJECUCION = response.Values.ResultFields[0].PLAZO_EJECUCION;
      this.PLAN_PAGOS = response.Values.ResultFields[0].PLAN_PAGOS;
      this.VAL_OFERTA = response.Values.ResultFields[0].VAL_OFERTA;
      this.TIEMPO_DURACION_CONTRATO = response.Values.ResultFields[0].TIEMPO_DURACION_CONTRATO;
      this.DURACION_CONTRATO = response.Values.ResultFields[0].DURACION_CONTRATO;
    });
  }

  fillNombre() {
    let justificacion = this.createProcessForm.controls['justificacionTipoProceso'].value
    this.createProcessForm.controls['nombreProceso'].setValue(justificacion)
  }

  anularProceso(proceso: string) {
    this.secopService.updateProcess(proceso, this.ROL, this.entidad, this.codigoEntidad, this.username, 'anulado').subscribe((response: any) => {
      this.service.sendClickEvent();
      if (response.Status = 'Ok') {
        utils.showAlert('Se Anulo el proceso #' + proceso + '!', 'warning');
        this.getdataProcess();
      }
    });
  }

  getdataProcess() {
    this.secopService.getDataProcess('0001', 1, this.centroGestor).subscribe((data: any) => {
      this.info_process = data;
      this.infoProcess();
    });
  }

  validateData() {
    Swal.fire({
      title: 'Esta Seguro?',
      text: "Esta accion no se podrá revertir!",
      icon: 'warning',
      showCancelButton: true,
      allowOutsideClick: false,
      confirmButtonColor: 'var(--companyColor)',
      cancelButtonColor: '#E9ECEF',
      confirmButtonText: 'Si, crear proceso!',
      cancelButtonText: 'No, deseo revisar!',
      reverseButtons: true
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.createProcess();
      }
    })
  }

  ver() {
    console.log(this.createProcessForm.controls['codigoUNSPSC'].value);
    // let longitud = this.createProcessForm.controls['codigoUNSPSC'].value;
    // let dato = '';
    // for (let i = 0; i < longitud.length; i++) {
    //   dato = dato + longitud[i];
    //   if (i != longitud.length - 1){
    //     dato = dato + ',';
    //   }
    // }
    // console.log(dato);
    // this.createProcessForm.controls['codigoUNSPSC'].setValue(dato.toString());
  }

  createItem() {
    return this.fb.group({
      codigoUNSPSC: new FormControl({value: null, disabled: false}, [Validators.required]),
      proceso: new FormControl({value: '', disabled: false}),
      descripcion: new FormControl({value: '', disabled: false}, [Validators.required]),
      unidad: new FormControl({value: null, disabled: false}, [Validators.required]),
      cantidad: new FormControl({value: null, disabled: false}, [Validators.required]),
      precioUnitario: new FormControl({value: null, disabled: false}, [Validators.required]),
    })
  }

  createCdpItem() {
    return this.fb.group({
      cdp: new FormControl({value: null, disabled: false}, [Validators.required]),
      vigencia: new FormControl({value: null, disabled: false}, [Validators.required]),
      valor: new FormControl({value: null, disabled: false}, [Validators.required]),
      centroGestor: new FormControl(atob(localStorage.getItem('centroGestor')!)),
    })
  }

  addItem() {
    this.arr = this.myForm.get('arr') as FormArray;
    this.arr.push(this.createItem());
  }

  addCdpItem() {
    this.cdpArray = this.cdpForm.get('cdpArray') as FormArray;
    this.cdpArray.push(this.createCdpItem());
  }

  validateFieldsCdp(){
    console.log(this.cdpForm.controls['cdpArray'].value);
    let cdp = this.cdpForm.controls['cdpArray'].value[0].cdp;
    if(cdp == null || cdp == '' || cdp.length <= 0){
      this.cdpForm.controls['cdpArray'].get('0')?.setValue({'cdp':'','vigencia':'','valor':null,'centroGestor':atob(localStorage.getItem('centroGestor')!)});
    }
  }

  onSubmit() {
    let valor_contrato = this.createProcessForm.controls['valorContrato'].value;
    let tamanio = this.myForm.controls['arr'].value.length;
    let precioTotal = 0;
    let valorTotal = 0;
    for (let i = 0; i < tamanio; i++) {
      let cantidad = this.myForm.controls['arr'].value[i].cantidad;
      let precioUnitario = this.myForm.controls['arr'].value[i].precioUnitario;
      precioTotal = cantidad * precioUnitario;
      valorTotal += precioTotal;
    }
    if (valorTotal == valor_contrato) {
      this.codigoUNSPSC = this.myForm.value;
      this.validateDataUNSPSC = 1;
      utils.showAlert('Codigo(s) UNSPSC asociados correctamente!', 'success');
    } else {
      this.myForm.reset();
      this.validateDataUNSPSC = 0;
      utils.showAlert('El valor de los codigos UNSPSC debe ser igual al valor del contrato!', 'error');
    }
  }

  onSubmitCdp() {
    let valor_contrato = this.createProcessForm.controls['valorContrato'].value;
    let tamanio = this.cdpForm.controls['cdpArray'].value.length;
    let valorTotal = 0;
    for (let i = 0; i < tamanio; i++) {
      valorTotal += this.cdpForm.controls['cdpArray'].value[i].valor;
    }
    if (valorTotal == valor_contrato) {
      console.log(this.cdpForm.controls['cdpArray'].value);
      localStorage.setItem('dataCdp', JSON.stringify(this.cdpForm.controls['cdpArray'].value));
      this.onCloseCdp();
      this.cantidadErrorCdp = [];
      this.cdpError = [];
      this.getCdpMountValidate();
    } else {
      this.validateDataCdp = 0;
      this.color = false;
      // this.cdpForm.reset();
      utils.showAlert('El valor de los codigos CDP debe ser igual al valor del contrato!', 'error');
    }
  }

  trackByFn(index: any, item: any) {
    return index;
  }

  trackByFnCdp(index: any, item: any) {
    return index;
  }

  deleteItem(index: number) {
    const add = this.myForm.get('arr') as FormArray;
    add.removeAt(index);
  }

  deleteCdpItem(index: number) {
    const itemsArray = this.cdpForm.get('cdpArray') as FormArray;
    itemsArray.removeAt(index);
    // itemsArray.controls.forEach(c=>{
    //   c.setValue({
    //     cdp:'jojojo',vigencia:'',valor:''
    //   })
    // })
  }

  getUnidadesUnspsc() {
    this.secopService.getUnidadesUnspsc(this.token).subscribe((response: any) => {
      this.UNIDADESUNSPSC = response.Values.ResultFields;
    });
  }

  getCategoriaProfesion() {
    this.secopService.getCategoriaProfesion(this.token).subscribe((response: any) => {
      this.categoriasProfesion = response.Values.ResultFields;
    })
  }

  getProfesionByCategoria() {
    let categoriaProfesion = this.createProcessForm.controls['categoriaProfesion'].value;
    this.secopService.getProfesionByCategoria(this.token, categoriaProfesion).subscribe((response: any) => {
      this.createProcessForm.controls['profesion'].enable();
      this.categoriasSubProfesion = response.Values.ResultFields;
    })
  }

  public getPagosXRpc(proceso: any) {
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
              this.onOpen();
            }
          });
        } else {
          utils.showAlert('No se encontro un codigo Rpc asociado!', 'error');
        }
      }
    });
  }

  public onOpen() {
    this.openbutton.nativeElement.click();
  }

  public onOpenErroresCdp() {
    this.openbuttonErrorCdp.nativeElement.click();
  }

  generateReports() {
    func.generarReporte(this.infoPagos, this.locale, this.CENTRO_GESTOR, this.NOM_PROV, this.COD_PROV);
  }

  validateDuracionMasivo(duracion: string, tiempo: number, tipoIdentificacion: string, valorContrato: any) {
    let tiempoTotal;
    let dataReturn;

    switch (duracion) {
      case 'Años':
        tiempoTotal = (tiempo * 12);
        dataReturn = this.validateMoneyMasivo(tiempoTotal, tipoIdentificacion, valorContrato);
        break;
      case 'Dias':
        tiempoTotal = (tiempo / 30);
        dataReturn = this.validateMoneyMasivo(tiempoTotal, tipoIdentificacion, valorContrato);
        break;
      case 'Horas':
        tiempoTotal = (tiempo / 720);
        dataReturn = this.validateMoneyMasivo(tiempoTotal, tipoIdentificacion, valorContrato);
        break;
      case 'Meses':
        tiempoTotal = tiempo;
        dataReturn = this.validateMoneyMasivo(tiempoTotal, tipoIdentificacion, valorContrato);
        break;
      case 'Semanas':
        tiempoTotal = (tiempo / 4.345);
        dataReturn = this.validateMoneyMasivo(tiempoTotal, tipoIdentificacion, valorContrato);
        break;
      default:
        break;
    }
    return dataReturn;
  }

  validateMoneyMasivo(tiempoTotal: any, tipoIdentificacion: string, valorContrato: any) {

    if (tipoIdentificacion == 'Cédula' || tipoIdentificacion == 'Cédula de Extranjería') {
      if ((valorContrato / tiempoTotal) > this.maxSalary) {
        utils.showAlert('El valor excede los limites establecidos en la tabla de honorarios! ', 'error');
        return 0;
      } else {
        //TODO: comite: no
        return 1;
      }
    } else if (tipoIdentificacion == 'Nit') {
      if (valorContrato > (this.minSalary * this.cantidadMaximaSalarios)) {
        //TODO: comite: si
        return 2;
        //TODO:console.log('nit comite');
      } else {
        return 1;
        //TODO: console.log('nit no comite');
      }
    }
    return 0;
  }

  async readExcell(ev: any) {
    let workBook: any = null;
    let jsonData: any = null;
    const reader = new FileReader();
    const file = ev.target!.files[0];
    this.filename = file.name;
    this.procesosError = [];

    reader.onload = async (event) => {
      const data = reader.result;
      workBook = XLSX.read(data, {type: 'binary'});
      jsonData = workBook.SheetNames.reduce((initial: any, name: any) => {
        const sheet = workBook.Sheets[name];
        initial[name] = XLSX.utils.sheet_to_json(sheet);
        return initial;
      }, {});

      this.progressValueTotal = jsonData.Hoja1.length;
      for (let i = 0; i < jsonData.Hoja1.length; i++) {
        this.progressValue = Math.round((((i + 1) / this.progressValueTotal) * 100));
        let keyCount = Object.keys(jsonData.Hoja1[i]).length;
        let dataFormulario: any = [];
        await this.validateDataExcel(jsonData, keyCount, dataFormulario, i);//.then(console.log);
      }
      this.progressValue = 0;
      // console.log(this.procesosError);
      this.getdataProcess();
      this.cantidadError = this.procesosError.length;
      ev.target.value = '';
      this.filename = 'Seleccione un archivo';
      utils.showAlert('Proceso Terminado!', 'success');
    }
    reader.readAsBinaryString(file);
  }

  async validateDataExcel(jsonData: any, keyCount: number, dataFormulario: any, i: number) {
    //this.centroGestor = '1158';
    return await new Promise((resolve, reject) => {
      if (keyCount == 31) {
        let dataExcel = jsonData.Hoja1[i];
        let codigoUNSPSC: any = [];
        let dataExcelCodigo = jsonData.CODIGO;
        let valorAcomparar: number = 0;

        //*****************************************
        if (dataExcel.IDREGISTRO != null && !isNaN(Number(dataExcel.IDREGISTRO.toString()))) {
          if (dataExcel.CENTROGESTOR == this.centroGestor) {
            dataFormulario.push(this.token);
            dataFormulario.push(dataExcel.CENTROGESTOR);
            dataExcel.TIPOIDENTIFICACION = (dataExcel.TIPOIDENTIFICACION == 1) ? 'Cédula' :
              (dataExcel.TIPOIDENTIFICACION == 2) ? 'Cédula Extranjería' :
                (dataExcel.TIPOIDENTIFICACION == 3) ? 'Nit' : '';
            if (dataExcel.TIPOIDENTIFICACION.toString() == '') {
              this.procesosError.push('Proceso N°' + (i + 1) + ' - Tipo Identificación');
              resolve('error Tipo Identificación no existe ' + (i + 1));
            } else {
              if (dataExcel.IDENTIFICACION.toString().length <= 4) {
                this.procesosError.push('Proceso N°' + (i + 1) + ' - Identificación');
                resolve('error Identificación no existe ' + (i + 1));
              } else {
                this.secopService.searchDataSecop('nit', dataExcel.IDENTIFICACION).subscribe((response: any) => {
                  // console.log(response)
                  if (response != null && response.length != 0 && response[0].toString().length != 0) {
                    dataFormulario.push(dataExcel.TIPOIDENTIFICACION);
                    dataFormulario.push(dataExcel.IDENTIFICACION);
                    //dataFormulario.push(dataExcel.PROVEEDOR);
                    dataFormulario.push(response[0].nombre);
                    // dataFormulario.push(dataExcel.UBICACION);
                    dataFormulario.push(response[0].ubicacion);

                    if (moment(dataExcel.FECHANACIMIENTO, "YYYYMMDD").format().slice(0, -6) <= this.ValidarMayoriaEdad()) {
                      dataFormulario.push(moment(dataExcel.FECHANACIMIENTO, "YYYYMMDD").format().slice(0, -6));

                      if (dataExcel.TIPOIDENTIFICACION == 'Nit') {
                        dataExcel.GENERO = 'Indefinido';
                      }

                      dataExcel.GENERO = (dataExcel.GENERO == 1) ? 'Masculino' :
                        (dataExcel.GENERO == 2) ? 'Femenino' :
                          (dataExcel.GENERO.toString() == 'Indefinido') ? 'Indefinido' : '';

                      if (dataExcel.GENERO.toString() != '' || dataExcel.GENERO.toString().length != 0) {
                        dataFormulario.push(dataExcel.GENERO);
                        this.secopService.getDepartamento(dataExcel.DEPARTAMENTO).subscribe((response: any) => {
                          if (response.Status == 'Ok') {
                            dataFormulario.push(dataExcel.DEPARTAMENTO);
                            this.secopService.getMunicipio(dataExcel.MUNICIPIO).subscribe((response: any) => {
                              if (response.Status == 'Ok') {
                                dataFormulario.push(dataExcel.MUNICIPIO);
                                if (dataExcel.CELULAR.toString().length == 10 && Number.isInteger(dataExcel.CELULAR)) {
                                  dataFormulario.push(dataExcel.CELULAR);
                                  if (this.validateEmailMasivo(dataExcel.CORREO)) {
                                    dataFormulario.push(dataExcel.CORREO);
                                    dataExcel.CATCONTRATACION = (dataExcel.CATCONTRATACION == 1) ? 'Asesor' :
                                      (dataExcel.CATCONTRATACION == 2) ? 'Asistencial' :
                                        (dataExcel.CATCONTRATACION == 3) ? 'Profesional' :
                                          (dataExcel.CATCONTRATACION == 4) ? 'Profesional Especializado' :
                                            (dataExcel.CATCONTRATACION == 5) ? 'Tecnico' :
                                              (dataExcel.CATCONTRATACION == 6) ? 'Tecnologo' : '';

                                    if (dataExcel.CATCONTRATACION.toString() != '') {
                                      dataFormulario.push(dataExcel.CATCONTRATACION);
                                      this.secopService.getCatProfesion(dataExcel.CATPROFESION).subscribe((response: any) => {
                                          if (response.Status == 'Ok' && response.Values.ResultFields.length > 0) {
                                            dataFormulario.push(response.Values.ResultFields);
                                            this.secopService.getProfesion(dataExcel.PROFESION).subscribe((response: any) => {
                                              if (response.Status == 'Ok' && response.Values.ResultFields.length > 0) {
                                                dataFormulario.push(response.Values.ResultFields);
                                                this.secopService.getTipoProceso(dataExcel.TIPOPROCESO).subscribe((response: any) => {
                                                  if (response.Status == 'Ok' && response.Values.ResultFields.length > 0) {
                                                    dataFormulario.push(response.Values.ResultFields);
                                                    this.secopService.getTipoContrato(dataExcel.TIPOCONTRATO).subscribe((response: any) => {
                                                      if (response.Status == 'Ok' && response.Values.ResultFields.length > 0) {
                                                        dataFormulario.push(response.Values.ResultFields);
                                                        this.secopService.getJustificacionTipoProceso(dataExcel.JUSTIFICACIONTIPOPROCESO).subscribe((response: any) => {
                                                          if (response.Status == 'Ok' && response.Values.ResultFields.length > 0) {
                                                            dataFormulario.push(response.Values.ResultFields);
                                                            if (dataExcel.NOMBREPROCESO != null && dataExcel.NOMBREPROCESO.toString().length != 0) {
                                                              dataFormulario.push(dataExcel.NOMBREPROCESO);
                                                              this.secopService.validateUnidadContratacion(dataExcel.UNIDADCONTRATACION).subscribe((response: any) => {
                                                                if (response.Status == 'Ok') {
                                                                  dataFormulario.push(dataExcel.UNIDADCONTRATACION);
                                                                  this.secopService.validateEquipoContratacion(dataExcel.EQUIPOCONTRATACION).subscribe((response: any) => {
                                                                    if (response.Status == 'Ok') {
                                                                      // dataFormulario.push(dataExcel.EQUIPOCONTRATACION);
                                                                      dataFormulario.push(response.Values.ResultFields);
                                                                      if (dataExcel.OBJETOPROCESO != null && dataExcel.OBJETOPROCESO.toString().length != 0) {
                                                                        dataFormulario.push(dataExcel.OBJETOPROCESO);
                                                                        if (this.validarFirmasPosteriores(moment(dataExcel.FIRMACONTRATO, "YYYYMMDD").format().slice(0, -6)) == 1) {
                                                                          dataFormulario.push(moment(dataExcel.FIRMACONTRATO, "YYYYMMDD").format().slice(0, -6));
                                                                          if (this.validarFirmasPosteriores(moment(dataExcel.FECHAINICIO, "YYYYMMDD").format().slice(0, -6)) == 1) {
                                                                            dataFormulario.push(moment(dataExcel.FECHAINICIO, "YYYYMMDD").format().slice(0, -6));
                                                                            if (this.validarFirmasPosteriores(moment(dataExcel.FECHATERMINO, "YYYYMMDD").format().slice(0, -6)) == 1) {
                                                                              dataFormulario.push(moment(dataExcel.FECHATERMINO, "YYYYMMDD").format().slice(0, -6));
                                                                              if (this.validarFirmasPosteriores(moment(dataExcel.PLAZOEJECUCION, "YYYYMMDD").format().slice(0, -6)) == 1) {
                                                                                dataFormulario.push(moment(dataExcel.PLAZOEJECUCION, "YYYYMMDD").format().slice(0, -6));
                                                                                if (dataExcel.VALORESTIMADO != null && dataExcel.VALORESTIMADO.toString().length > 0 && !isNaN(Number(dataExcel.VALORESTIMADO)) && Number(dataExcel.VALORESTIMADO) > 0) {
                                                                                  dataFormulario.push(dataExcel.VALORESTIMADO);
                                                                                  if (dataExcel.CDP != null && dataExcel.CDP.toString().length == 10) {
                                                                                    dataFormulario.push(dataExcel.CDP);
                                                                                    if (dataExcel.VIGENCIA != null && dataExcel.VIGENCIA.toString().length == 4) {
                                                                                      dataFormulario.push(dataExcel.VIGENCIA);
                                                                                      this.secopService.getCdpMount(this.token, dataExcel.CENTROGESTOR, dataExcel.CDP, dataExcel.VALORESTIMADO, dataExcel.VIGENCIA).subscribe(async (response: any) => {
                                                                                        if (response.Status == 'Ok' && response.Values.ResultFields.length > 0) {
                                                                                          let valorCdp = response.Values.ResultFields;
                                                                                          if (valorCdp < dataExcel.VALORESTIMADO) {
                                                                                            this.procesosError.push('Proceso N°' + (i + 1) + ' - No hay Presupuesto sufiente para este contrato');
                                                                                            resolve('error cdp ' + (i + 1));
                                                                                          } else {
                                                                                            dataExcel.DURACIONCONTRATO = (dataExcel.DURACIONCONTRATO == 1) ? 'Años' :
                                                                                              (dataExcel.DURACIONCONTRATO == 2) ? 'Dias' :
                                                                                                (dataExcel.DURACIONCONTRATO == 3) ? 'Horas' :
                                                                                                  (dataExcel.DURACIONCONTRATO == 4) ? 'Meses' :
                                                                                                    (dataExcel.DURACIONCONTRATO == 5) ? 'Semanas' : '';

                                                                                            if (dataExcel.DURACIONCONTRATO.toString() != '') {
                                                                                              if (dataExcel.TIEMPOCONTRATO != null && dataExcel.TIEMPOCONTRATO.toString().length > 0 && !isNaN(Number(dataExcel.TIEMPOCONTRATO.toString())) && Number(dataExcel.TIEMPOCONTRATO.toString()) > 0) {
                                                                                                let responseDuracion = this.validateDuracionMasivo(dataExcel.DURACIONCONTRATO, dataExcel.TIEMPOCONTRATO, dataExcel.TIPOIDENTIFICACION, dataExcel.VALORESTIMADO);
                                                                                                let comite;
                                                                                                if (responseDuracion == 0) {
                                                                                                  this.procesosError.push('Proceso N°' + (i + 1) + ' - duracion contrato');
                                                                                                  resolve('error duracion contrato ' + (i + 1));
                                                                                                } else if (responseDuracion == 1) {
                                                                                                  //no comite
                                                                                                  comite = 'NO';
                                                                                                } else if (responseDuracion == 2) {
                                                                                                  //comite
                                                                                                  comite = 'SI';
                                                                                                }
                                                                                                dataFormulario.push(dataExcel.DURACIONCONTRATO);
                                                                                                dataFormulario.push(dataExcel.TIEMPOCONTRATO);
                                                                                                dataFormulario.push(this.username);
                                                                                                dataFormulario.push(comite);
                                                                                                this.secopService.insertProcessMassive(dataFormulario).toPromise().then(async (response: any) => {
                                                                                                  // console.log(response)
                                                                                                  if (response.Status == 'Ok' && response.Values.ResultFields.length > 0) {
                                                                                                    let r = await response.Values.ResultFields;
                                                                                                    if (r != null) {
                                                                                                      await this.functionInsertunspsc(dataExcelCodigo.length, dataExcelCodigo, dataExcel, response, i, valorAcomparar, codigoUNSPSC);
                                                                                                      resolve('-');
                                                                                                    } else {
                                                                                                      this.procesosError.push('Proceso N°' + (i + 1) + ' - insert process');
                                                                                                      resolve('error insert process ' + (i + 1));
                                                                                                    }
                                                                                                  } else {
                                                                                                    this.procesosError.push('Proceso N°' + (i + 1) + ' - insert process');
                                                                                                    resolve('error insert process ' + (i + 1));
                                                                                                  }
                                                                                                });
                                                                                              } else {
                                                                                                this.procesosError.push('Proceso N°' + (i + 1) + ' - tiempo contrato');
                                                                                                resolve('error tiempo contrato ' + (i + 1));
                                                                                              }
                                                                                            } else {
                                                                                              this.procesosError.push('Proceso N°' + (i + 1) + ' - duracion contrato');
                                                                                              resolve('error duracion contrato ' + (i + 1));
                                                                                            }
                                                                                          }
                                                                                        } else {
                                                                                          this.procesosError.push('Proceso N°' + (i + 1) + ' - cdp');
                                                                                          resolve('error cdp ' + (i + 1));
                                                                                        }
                                                                                      });
                                                                                    } else {
                                                                                      this.procesosError.push('Proceso N°' + (i + 1) + ' - vigencia');
                                                                                      resolve('error vigencia ' + (i + 1));
                                                                                    }
                                                                                  } else {
                                                                                    this.procesosError.push('Proceso N°' + (i + 1) + ' - CDP');
                                                                                    resolve('error CDP ' + (i + 1));
                                                                                  }
                                                                                } else {
                                                                                  this.procesosError.push('Proceso N°' + (i + 1) + ' - valor estimado');
                                                                                  resolve('error valor estimado ' + (i + 1));
                                                                                }
                                                                              } else {
                                                                                this.procesosError.push('Proceso N°' + (i + 1) + ' - plazo ejecucion');
                                                                                resolve('error plazo ejecucion ' + (i + 1));
                                                                              }
                                                                            } else {
                                                                              this.procesosError.push('Proceso N°' + (i + 1) + ' - fecha termino');
                                                                              resolve('error fecha termino ' + (i + 1));
                                                                            }
                                                                          } else {
                                                                            this.procesosError.push('Proceso N°' + (i + 1) + ' - fecha inicio');
                                                                            resolve('error fecha inicio ' + (i + 1));
                                                                          }
                                                                        } else {
                                                                          this.procesosError.push('Proceso N°' + (i + 1) + ' - firma contrato');
                                                                          resolve('error firma contrato ' + (i + 1));
                                                                        }
                                                                      } else {
                                                                        this.procesosError.push('Proceso N°' + (i + 1) + ' - objeto proceso');
                                                                        resolve('error objeto proceso ' + (i + 1));
                                                                      }
                                                                    } else {
                                                                      this.procesosError.push('Proceso N°' + (i + 1) + ' - equipo contratacion');
                                                                      resolve('error equipo contratacion ' + (i + 1));
                                                                    }
                                                                  });
                                                                } else {
                                                                  this.procesosError.push('Proceso N°' + (i + 1) + ' - unidad contratacion');
                                                                  resolve('error unidad contratacion ' + (i + 1));
                                                                }
                                                              });
                                                            } else {
                                                              this.procesosError.push('Proceso N°' + (i + 1) + ' - nombre proceso');
                                                              resolve('error nombre proceso ' + (i + 1));
                                                            }
                                                          } else {
                                                            this.procesosError.push('Proceso N°' + (i + 1) + ' - justificacion Proceso');
                                                            resolve('error justificacion Proceso ' + (i + 1));
                                                          }
                                                        });
                                                      } else {
                                                        this.procesosError.push('Proceso N°' + (i + 1) + ' - tipo Contrato');
                                                        resolve('error tipo Contrato ' + (i + 1));
                                                      }
                                                    });
                                                  } else {
                                                    this.procesosError.push('Proceso N°' + (i + 1) + ' - tipo Proceso');
                                                    resolve('error tipo Proceso ' + (i + 1));
                                                  }
                                                });
                                              } else {
                                                this.procesosError.push('Proceso N°' + (i + 1) + ' - profesion');
                                                resolve('error profesion ' + (i + 1));
                                              }
                                            });
                                          } else {
                                            this.procesosError.push('Proceso N°' + (i + 1) + ' - Categoria Profesion');
                                            resolve('error Categoria Profesion ' + (i + 1));
                                          }
                                        }
                                      );
                                    } else {
                                      this.procesosError.push('Proceso N°' + (i + 1) + ' - Categoria Contratacion');
                                      resolve('error Categoria Contratacion ' + (i + 1));
                                    }

                                  } else {
                                    this.procesosError.push('Proceso N°' + (i + 1) + ' - Correo');
                                    resolve('error Correo ' + (i + 1));
                                  }
                                } else {
                                  this.procesosError.push('Proceso N°' + (i + 1) + ' - Celular');
                                  resolve('error Celular ' + (i + 1));
                                }
                              } else {
                                this.procesosError.push('Proceso N°' + (i + 1) + ' - Municipio');
                                resolve('error Municipio ' + (i + 1));
                              }
                            });
                          } else {
                            this.procesosError.push('Proceso N°' + (i + 1) + ' - Departamento');
                            resolve('error Departamento ' + (i + 1));
                          }
                        });
                      } else {
                        this.procesosError.push('Proceso N°' + (i + 1) + ' - Genero');
                        resolve('error Genero ' + (i + 1));
                      }
                    } else {
                      this.procesosError.push('Proceso N°' + (i + 1) + ' - Fecha Nacimiento');
                      resolve('error Fecha Nacimiento ' + (i + 1));
                    }

                  } else {
                    this.procesosError.push('Proceso N°' + (i + 1) + ' - Identificación');
                    resolve('error no hay datos de Identificación ' + (i + 1));
                  }
                });
              }
            }
          } else {
            this.procesosError.push('Proceso N°' + (i + 1) + ' - Centro Gestor');
            resolve('error Centro Gestor ' + (i + 1));
          }
        } else {
          this.procesosError.push('Proceso N°' + (i + 1) + ' - Id Registro');
          resolve('error Id Registro ' + (i + 1));
        }
      } else {
        this.procesosError.push('Proceso N°' + (i + 1) + ' - Longitud de excel no configurado');
        resolve('error Longitud de excel no configurado ' + (i + 1));
      }
    });
  }

  WatchError() {
    if (this.verErrores) {
      this.verErrores = false;
    } else {
      this.verErrores = true;
    }
  }

  validarCelular(evento: any) {
    if (evento.target.value.length != 10) {
      this.validacionCelular = true;
    } else {
      this.validacionCelular = false;
    }
  }

  validarCorreo() {
    if (this.createProcessForm.controls['correo'].invalid) {
      this.validacionCorreo = true;
    } else {
      this.validacionCorreo = false;
    }
  }

  ValidarMayoriaEdad() {
    let currentDate = moment().toDate();
    let anioValido = currentDate.getFullYear() - 18;
    let mes = ((currentDate.getMonth() + 1).toString().length == 1) ? '0' + (currentDate.getMonth() + 1) : (currentDate.getMonth() + 1);
    let dia = (currentDate.getDate().toString().length == 1) ? '0' + currentDate.getDate().toString() : currentDate.getDate().toString();
    let hora = (currentDate.getHours().toString().length == 1) ? '0' + currentDate.getHours().toString() : currentDate.getHours().toString();
    let minutos = (currentDate.getMinutes().toString().length == 1) ? '0' + currentDate.getMinutes().toString() : currentDate.getMinutes().toString();
    let mayoriaEdad = anioValido.toString() + '-' + mes.toString() + '-' + dia.toString() + 'T' + hora + ':' + minutos;
    return mayoriaEdad;
  }

  WatchDescuento(infopago: any) {
    if (this.verDescuentos[infopago[0]]) {
      this.verDescuentos[infopago[0]] = false;
    } else {
      this.verDescuentos[infopago[0]] = true;
    }
  }

  validateEmailMasivo(email: any) {
    const patron = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
    return patron.test(email.toString().toLowerCase());
  }

  cerrarCargaMasivaContratos() {
    this.cantidadError = 0;
  }

  validarFirmasPosteriores(fecha: any) {
    let fechaProceso = new Date(fecha.toString());
    let currentDate = new Date();

    let dia = fechaProceso.getDate();
    let mes = fechaProceso.getMonth() + 1;
    let anio = fechaProceso.getFullYear();
    let hora = fechaProceso.getHours();

    let diaCurrent = currentDate.getDate();
    let mesCurrent = currentDate.getMonth() + 1;
    let anioCurrent = currentDate.getFullYear();
    let horaCurrent = currentDate.getHours();
    let resultado = 0;

    if (Number(anio) < Number(anioCurrent)) {
      resultado = 0;
    } else if (anio == anioCurrent) {
      if (mes < mesCurrent) {
        resultado = 0;
      } else if (mes == mesCurrent) {
        if (dia < diaCurrent) {
          resultado = 0;
        } else if (dia == diaCurrent) {
          resultado = 1;
        } else {
          resultado = 1;
        }
      } else {
        resultado = 1;
      }
    } else {
      resultado = 1;
    }
    return resultado;
  }

  wait(ms: any) {
    console.log('estamos esperando')
    let start = new Date().getTime();
    let end = start;
    while (end < start + ms) {
      end = new Date().getTime();
    }
  }

  async functionInsertunspsc(size: number, dataExcelCodigo: any, dataExcel: any, response: any, index: any, valorAcomparar: any, codigoUNSPSC: any) {
    for (let i = 0; i < size; i++) {
      if (dataExcelCodigo[i].IDREGISTRO == dataExcel.IDREGISTRO) {
        dataExcelCodigo[i].PROCESO = response.Values.ResultFields;
        if (dataExcelCodigo != null && dataExcelCodigo[i].CODIGOUNSPSC.toString().length == 8 && !isNaN(Number(dataExcelCodigo[i].CODIGOUNSPSC.toString()))) {
          if (dataExcelCodigo[i].DESCRIPCION != null && dataExcelCodigo[i].DESCRIPCION.toString().length > 0) {
            this.secopService.validateUnidadUNSPSC(dataExcelCodigo[i].UNIDAD).subscribe(async (r: any) => {
              let response = await r;
              if (response.Status == 'Ok') {
                if (dataExcelCodigo[i].CANTIDAD != null && dataExcelCodigo[i].CANTIDAD.toString().length > 0 && !isNaN(Number(dataExcelCodigo[i].CANTIDAD.toString())) && Number(dataExcelCodigo[i].CANTIDAD.toString()) > 0) {
                  if (dataExcelCodigo[i].PRECIOUNITARIO != null && dataExcelCodigo[i].PRECIOUNITARIO.toString().length > 0 && !isNaN(Number(dataExcelCodigo[i].PRECIOUNITARIO.toString()))) {
                    codigoUNSPSC.push(dataExcelCodigo[i]);
                    valorAcomparar += dataExcelCodigo[i].PRECIOUNITARIO;
                    if (Number(valorAcomparar) == Number(dataExcel.VALORESTIMADO)) {
                      await this.functionCrearProcesoSecop(valorAcomparar, dataExcel, index, codigoUNSPSC);
                    }
                  } else {
                    this.procesosError.push('Proceso N°' + (index + 1) + ' - Precio UNSPSC');
                  }
                } else {
                  this.procesosError.push('Proceso N°' + (index + 1) + ' - Cantidad UNSPSC');
                }
              } else {
                this.procesosError.push('Proceso N°' + (index + 1) + ' - Unidad UNSPSC');
              }
            });
          } else {
            this.procesosError.push('Proceso N°' + (index + 1) + ' - Descripción UNSPSC');
          }
        } else {
          this.procesosError.push('Proceso N°' + (index + 1) + ' - Codigo UNSPSC');
        }
      }
    }
  }

  async functionCrearProcesoSecop(valorAcomparar: any, dataExcel: any, index: any, codigoUNSPSC: any) {
    if (Number(valorAcomparar) != Number(dataExcel.VALORESTIMADO)) {
      this.procesosError.push('Proceso N°' + (index + 1) + ' - Los valores del codigo UNSPSC no coinciden');
    } else {
      this.secopService.insertUNSPSC(codigoUNSPSC).toPromise().then((response: any) => {
        if (response.proId != null) {
          let proId = response?.proId;
          if (proId != null && proId != undefined) {
            this.secopService.updateProcessMasive(proId).subscribe((response: any) => {
              console.log(this.procesosExitosos);
              this.procesosExitosos.push(proId);
            });
          }

          /*this.secopService.getSelectedProcess(this.token, proId).subscribe((response: any) => {
            if (response != null && response.hasOwnProperty('Values') && response.Values.hasOwnProperty('ResultFields')) {
              if (response.Values.ResultFields[0] != null) {
                let PROCESO_SELECCIONADO = response.Values.ResultFields[0];
                this.secopService.getUnspscData(this.token, proId).subscribe((response: any) => {
                  if (response != null && response.hasOwnProperty('Values') && response.Values.hasOwnProperty('ResultFields')) {
                    let arr: Array<any> = [];
                    let usuarioConect = atob(localStorage.getItem('usuarioConect')!);
                    let conectPw = atob(localStorage.getItem('conectPw')!);
                    arr.push(PROCESO_SELECCIONADO);
                    arr.push(response.Values.ResultFields);
                    arr.push({"USUARIO_CONNECT": usuarioConect});
                    arr.push({"PASSWORD_CONNECT": conectPw});
                    arr.push({"USC_CODIGO_ENTIDAD": this.codigoEntidad});
                    arr.push({"TOKEN": this.token});
                    this.secopService.createSoapProcess(arr).subscribe((response: any) => {
                      if (response.hasOwnProperty('proId')) {
                        if(response.proId[0].includes('CO1.PPI')){

                          this.secopService.updateProcessMasive(proId).subscribe((response:any)=>{
                            console.log(this.procesosExitosos);
                            this.procesosExitosos.push(proId);
                          });
                        }
                        else{
                          this.procesosError.push('Proceso N°' + (index + 1) + ' - Error en proceso soap');
                        }

                      } else {
                        this.procesosError.push('Proceso N°' + (index + 1) + ' - creacion soap');
                      }
                    });
                  } else {
                    this.procesosError.push('Proceso N°' + (index + 1) + ' - Get UNSPSC');
                  }
                });
              } else {
                this.procesosError.push('Proceso N°' + (index + 1) + ' - Selected process');
              }
            } else {
              this.procesosError.push('Proceso N°' + (index + 1) + ' - Selected process');
            }
          });*/
        } else {
          this.procesosError.push('Proceso N°' + (index + 1) + ' - insert unspsc');
        }
      });
    }
  }

  validarCamposUnspsc() {
    if (this.myForm.controls['arr'].invalid) {
      utils.showAlert('Por favor diligencie todos los campos!', 'error');
    } else {
      this.onCloseUNSPSC();
    }
  }

  validarCamposCdp() {
    if (this.cdpForm.controls['cdpArray'].invalid) {
      utils.showAlert('Por favor diligencie todos los campos!', 'error');
    } else {
      this.onSubmitCdp();
    }
  }

  onCloseUNSPSC() {
    this.closebuttonUNSPSC.nativeElement.click();
  }

  onCloseCdp() {
    this.closebuttonCdp.nativeElement.click();
  }

  fillModal(numProceso: any) {
    this.router.navigate(['home/autorizaciones-det/' + numProceso]);
  }

}
