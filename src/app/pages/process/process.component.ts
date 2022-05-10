import {
  AfterViewInit,
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
  Inject,
  LOCALE_ID,
  ElementRef, Renderer2
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup, MaxValidator,
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
import {ModalProcessComponent} from "../../shared/modal/modal-process/modal-process.component";
import {ModalService} from "../../services/modal/modal.service";
import {async, Subscription} from "rxjs";

@Component({
  selector: 'app-process',
  templateUrl: './process.component.html',
  styleUrls: ['./process.component.css']
})
export class ProcessComponent implements OnDestroy, OnInit, AfterViewInit {

  private idioma!: string;
  createProcessForm!: FormGroup;
  usuarioSapForm!: FormGroup;
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
  @ViewChild('openFormularioSap') openFormularioSap: any;
  @ViewChild('mydiv', { static: false }) mydiv: ElementRef | any;
  // @ViewChild("myDiv") divView: ElementRef;
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
  public allProfesions: any;
  public CDPFIELDS: any;
  public UNSPSCFIELDS: any;
  public EDITPROCESS: any = 0;
  public keyword = 'id';
  public clasificacionBienes: any;
  public clasificacionBienesAlmacenado: any;
  public modalidad: any;
  public dataPrueba!: string;
  public modalData!: any;
  public dataArrayParams!: any;
  private clickEventSubscription!: Subscription;
  public tipoIdentificacionSap!: any[];
  public tipoPersonaSap!: any[];
  public tratamientoPersonaSap!: any[];
  public claseImpuestoSap!: any[];
  public numberPattern : any = /^[0-9]+$/;

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
    private renderer: Renderer2,
    private modal: ModalService,
    @Inject(LOCALE_ID) public locale: string
  ) {
    this.store.select('idioma').subscribe(({idioma}) => {
      this.idioma = idioma;
      this.translate.use(idioma);
    });

    this.modalidad = true
  }

  ngAfterViewInit() {
    this.secopService.sendGetDataSecop().subscribe((data: any) => {
      this.result = data;
      this.dataSourceSecop = new MatTableDataSource(this.result);
      this.dataSourceSecop.paginator = this.paginatorSecop;
      this.dataSourceSecop.sort = this.sortSecop;
    });
    this.clickEventSubscription = this.modal.getClickEventGetDataProcess().subscribe(() => {
      this.getdataProcess();
    });
    this.clickEventSubscription = this.modal.getClickEventsubjectFillFields().subscribe(async () => {
      this.onFocus();
      this.setFieldsToEdit();
    });

  }

  ngOnDestroy(): void {
    this.clickEventSubscription.unsubscribe();
  }

  ngOnInit(): void {
    let parametros = JSON.parse(atob(localStorage.getItem('Parametros')!));
    this.dataArrayParams = utils.validarParametros(parametros);
    let username = atob(localStorage.getItem('username')!);
    this.minSalary = atob(localStorage.getItem('salarioMinimo')!);//985000; // traer salario minimo de la base de datos
    this.maxSalary = atob(localStorage.getItem('topeMaximo')!);//985000; // traer salario minimo de la base de datos
    this.cantidadMaximaSalarios = atob(localStorage.getItem('cantidadSalarios')!);//TODO: cantidad de maxima de salarios
    // let token = atob(localStorage.getItem('token')!);
    let codigoEntidad = atob(localStorage.getItem('codigoEntidad')!);
    this.service.getUnidadesContratacion(username, codigoEntidad).subscribe((data: any) => {
      this.unidades = data.Values.ResultFields;
    });

    this.formularioProceso();

    this.myForm = this.fb.group({
      arr: this.fb.array([this.createItem()])
    });

    this.cdpForm = this.fb.group({
      cdpArray: this.fb.array([this.createCdpItem()])
    });

    this.usuarioSapForm = this.fb.group({
      razonSocial : new FormControl({value: '', disabled: false}, ),
      indicativo : new FormControl({value: '', disabled: false}, ),
      nit : new FormControl({value: '', disabled: false}, ),
      nombreProveedor: new FormControl({value: '', disabled: false}, [Validators.minLength(3),Validators.required]),
      apellidoProveedor: new FormControl({value: '', disabled: false}, [Validators.minLength(3),Validators.required]),
      tipoIdentificacion : new FormControl({value: null, disabled: false}, [Validators.required]),
      identificacion: new FormControl({value: '', disabled: false}, [Validators.minLength(6),Validators.required]),
      digitoVerificacion: new FormControl({value: '-', disabled: true}, [Validators.required,Validators.maxLength(1)]),
      tipoPersona: new FormControl({value: null, disabled: false}, [Validators.required]),
      tratamientoPersona: new FormControl({value: null, disabled: false}, [Validators.required]),
      direccion: new FormControl({value: '', disabled: false}, [Validators.minLength(8),Validators.required]),
      departamento: new FormControl({value: null, disabled: false}, [Validators.required]),
      municipio: new FormControl({value: null, disabled: false}, [Validators.required]),
      telefono: new FormControl({value: null, disabled: false}, [Validators.minLength(10),Validators.required]),
      celular: new FormControl({value: null, disabled: false}, [Validators.minLength(10),Validators.required]),
      correo: new FormControl({value: null, disabled: false}, [Validators.required,Validators.email]),
      claseImpuesto: new FormControl({value: null, disabled: false}, [Validators.required]),
      actividadEconomica: new FormControl({value: '', disabled: false}, [Validators.minLength(3),Validators.required]),
    });
    //*************** TABLAS PROCESOS ********************
    this.getdataProcess();
    //****************************************************
    this.getChangeContractValue();
    this.getTiposProceso();
    this.departmentsCont();
    this.getUserData();
    this.getDepartamentos();
    this.getClasificacionBienes();
    this.getUnidadesUnspsc();
    this.getAllProfesions();
    //this.getTipoIdentificacionSap();
    // this.getCategoriaProfesion();
    // this.fillEntidad();
  }

  infoProcess(): void {
    if (this.info_process.Status === 'Ok') {
      this.info_process = this.info_process.Values[0];
      this.dataSource = new MatTableDataSource(this.info_process);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    } else {
      utils.showAlert('Error de información', 'warning');
    }
  }

  getChangeContractValue() {
    this.createProcessForm.controls['valorContrato'].valueChanges.subscribe((data: number) => {
      this.cdpForm.reset();
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

  onClickHonorarios() {
    this.createProcessForm.controls['duracionContrato'].reset();
    this.createProcessForm.controls['duracionContrato'].disable();
    this.createProcessForm.controls['tiempoDuracion'].reset();
    this.createProcessForm.controls['tiempoDuracion'].disable();
    this.iconColor = 'lightgray';
    this.color = false;
    this.getColor();
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
    });
  }

 onKeydownEvent(event: HTMLInputElement | any): void {
    let search_item = event.value.length;
    let search_value = event.value;

    if (search_item > 4) {
      this.secopService.getDataInfoProveedor(search_value, 'GVAL').subscribe(async(response: any) => {
        if (response.Status == 'Ok') {
          if (response.Values.ResultFields != 'El proveedor no existe') {
            //console.log(response.Values.ResultFields);
            this.createProcessForm.controls['proveedor'].setValue(response.Values.ResultFields.Name);
            this.createProcessForm.controls['ubicacion'].setValue(response.Values.ResultFields.Direccion);
            this.createProcessForm.controls['correo'].setValue(response.Values.ResultFields.Correo);
            this.createProcessForm.controls['celular'].setValue(response.Values.ResultFields.Celular);
            await this.secopService.getDepartamentoPorNombre(response.Values.ResultFields.Departamento).subscribe(async(r:any)=>{
              let departamento = await r.Values.ResultFields;
              this.createProcessForm.controls['departamento'].setValue(departamento);
              await this.getMunicipios();

              //TODO: {{ isNaN(response.Values.ResultFields.Ciudad) }}
              // Se crea la siguiente  validacion para determinar cuando la
              // respuesta del servicio getDataInfoProveedor en el campo ciudad
              // nos retorna un codigo o el nombre de la ciudad

              if(isNaN(response.Values.ResultFields.Ciudad)){
                await this.secopService.getMunicipioPorNombre(response.Values.ResultFields.Ciudad).subscribe(async(r:any)=>{
                  let municipio = r.Values.ResultFields;
                  await this.createProcessForm.controls['municipio'].setValue(municipio);
                });
              }
              else{
                setTimeout(()=>{
                  this.createProcessForm.controls['municipio'].setValue(response.Values.ResultFields.Ciudad);
                },100);
              }
            });
          } else {
            utils.showAlert('El contratista no existe', 'warning');
            this.createProcessForm.controls['proveedor'].setValue(null);
            this.createProcessForm.controls['ubicacion'].setValue(null);
            this.createProcessForm.controls['correo'].setValue(null);
            this.createProcessForm.controls['celular'].setValue(null);
            setTimeout(()=>{
              // utils.showAlert('Error consultando datos', 'warning');
              Swal.close();
              Swal.fire({
                title: '¿Desea crear el Contratista?',
                icon: 'question',
                showCancelButton: true,
                allowOutsideClick: false,
                showCloseButton: true,
                confirmButtonColor: '#022b6b',
                confirmButtonText: 'Si, crear',
                cancelButtonText: 'Cancelar',
              }).then((result) => {
                if (result.isConfirmed) {
                  this.usuarioSapForm.reset();
                  this.openFormularioSap.nativeElement.click();
                  this.getTipoIdentificacionSap();
                  this.getTipoPersonaSap();
                  this.getTratamientoPersonaSap();
                  this.getClaseImpuestoSap();
                  this.usuarioSapForm.get('identificacion')?.setValue(this.createProcessForm.get('identificacion')?.value);
                }
              })
            },1500);
          }
        } else {


        }

      },(error:any)=>{
        console.log(error)
      });
      // this.secopService
      //   .searchDataSecop('nit', search_value)
      //   .subscribe((data) => {
      //     this.userDataFromSecop = data;
      //     if (this.userDataFromSecop.length > 0) {
      //       this.createProcessForm.controls['proveedor'].setValue(this.userDataFromSecop[0].nombre)
      //       this.createProcessForm.controls['ubicacion'].setValue(this.userDataFromSecop[0].ubicacion)
      //       // this.camposSecop = [];1
      //       // this.camposSecop.push(this.userDataFromSecop[0].nombre);
      //       // this.camposSecop.push(this.userDataFromSecop[0].ubicacion);
      //     } else {
      //       utils.showAlert("El N° de identificacion no se encontro!", "warning");
      //       this.camposSecop = [];
      //       return;
      //     }
      //   });
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
        icon: 'warning',
        title: 'El valor a insertar debe ser mayor a 4 digitos!',
      });
      return;
    }
  }

  async createProcess() {
    if (this.createProcessForm.invalid) {
      return;
    }
    let dataCdp = localStorage.getItem('dataCdp');
    if (dataCdp != null) {
      let dato = JSON.parse(dataCdp);
      let size = dato.length;
      for (let i = 0; i < size; i++) {
        dato[i].proceso = '';
      }
      await this.secopService.insertCdp(dato).subscribe((response: any) => {
        this.cdpForm.reset();
        localStorage.removeItem('dataCdp');
      });
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
          this.isJuridico = null;
          this.disableFields();
          this.createProcessForm.controls['valorContrato'].setValue('');
          this.createProcessForm.controls['valorContrato'].disable();
          this.createProcessForm.controls['tiempoDuracion'].disable();
          this.createProcessForm.controls['acuerdos'].setValue('NO');
          this.createProcessForm.controls['indDuracionContrato'].setValue(true);
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
          this.createProcessForm.controls['indDuracionContrato'].setValue(true);
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
            this.createProcessForm.reset();
            this.cdpForm.reset();
            this.myForm.controls['arr'].reset();
            this.myForm.reset();
          });
        }
      }, (error: any) => {
        this.createProcessForm.reset();
        utils.showAlert('Proceso creado incorrectamente!', 'warning');
        // console.log('error ==> ' + error);
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
    let tipoIdentificacion = data;
    if (this.EDITPROCESS != 1) {
      tipoIdentificacion = data.value;
    }
    if (tipoIdentificacion == 'Nit') {
      this.isJuridico = true;
      this.fechaMinimaNacimiento = '';
      this.createProcessForm.controls['genero'].setValue('Indefinido');
    } else {
      this.isJuridico = false;
      this.createProcessForm.get('indDuracionContrato')!.setValue(true);
      this.createProcessForm.controls['genero'].setValue('');
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
        let res = await this.secopService.getCdpMount(this.token, this.centroGestor, cdp, valor, vigencia).toPromise().then((response: any) => {
          if (response.Status != 'Ok') {
            this.color = false;
            this.createProcessForm.controls['duracionContrato'].setValue('');
            this.createProcessForm.controls['tiempoDuracion'].setValue('');
            this.createProcessForm.controls['duracionContrato'].disable();
            this.createProcessForm.controls['tiempoDuracion'].disable();
            this.cdpError.push({
              posicion: 'Cdp N°' + (i + 1),
              cdp: cdp,
              vigencia: vigencia,
              valor: valor,
              error: response.Values.Error
            });
          } else {
            if (response.Values.ResultFields < valor) {
              this.cdpError.push({
                posicion: 'Cdp N°' + (i + 1),
                cdp: cdp,
                vigencia: vigencia,
                valor: valor,
                error: 'Valor mayor a monto Cdp'
              });
            }
          }
        }).catch((error: any) => {
          // console.log(error);
          utils.showAlert(error,'warning');
        });
        if (i == longitud - 1) {
          this.verificarErroresCdp(this.cdpError.length);
        }
      }
    }
  }

  verificarErroresCdp(errores: any) {
    if (errores != null && errores != 0) {
      localStorage.removeItem('dataCdp');
      this.cantidadErrorCdp = errores;
      utils.showAlert('Por favor revise los Cdp ingresados', 'warning');
      this.onOpenErroresCdp();
      this.validateDataCdp = 0;
    } else {
      this.validateDataCdp = 1;
      this.color = true;
      this.createProcessForm.controls['duracionContrato'].enable();
      utils.showAlert('Codigos CDP validos exitosamente', 'success');
    }
  }

  getColor() {
    let validColor = (this.color === true) ? 'lightgreen' : 'lightgray';
    return validColor;
  }

  formatDate(data: string, campo: string) {
    let result = moment(data).format().slice(0, -6);
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
      if (this.EDITPROCESS == 1) {
        this.createProcessForm.controls['tipoContrato'].setValue(this.TIPO_CONTRATO);
      } else {
        this.createProcessForm.controls['tipoContrato'].setValue('');
      }
    });
  }

  async getTiposJustificacionContrato() {
    await this.service.getTiposJustificacionContrato(this.createProcessForm.controls['tipoContrato'].value).subscribe((data: any) => {
      this.tiposJustificacionContrato = data.Values.ResultFields;
      if (this.EDITPROCESS == 1) {
        setTimeout(()=>{
          this.createProcessForm.controls['tipoContrato'].setValue(this.TIPO_CONTRATO);
          this.createProcessForm.controls['justificacionTipoProceso'].setValue(this.JUST_TIPO_PROCESO);
        },10);
      } else {
        this.createProcessForm.controls['justificacionTipoProceso'].setValue('');
      }
      this.fillNombre();
    })
  }

  async getEquipoContratacion() {
    await this.service.getEquipoContratacion(this.createProcessForm.controls['tipoProceso'].value, this.centroGestor).subscribe((data: any) => {
      this.equipoContratacion = data.Values.ResultFields;
      this.createProcessForm.controls['equipo'].reset();
      if (this.EDITPROCESS == 1) {
        // console.log(this.equipoContratacion)
        // console.log(this.EQUIPO_CONTRATACION)
        // console.log(this.equipoContratacion[0].EQC_ID_INTEGRACION)
        // console.log(this.equipoContratacion[0].EQC_NOMBRE)
        // console.log(this.equipoContratacion[0].EQC_ID_INTEGRACION)
        // this.createProcessForm.controls['equipo'].setValue(this.equipoContratacion[0].EQC_NOMBRE);
        setTimeout(()=>{
          this.createProcessForm.controls['equipo'].setValue(this.equipoContratacion[0].EQC_ID_INTEGRACION);
        },10);
      } else {
        this.createProcessForm.controls['equipo'].setValue('');
      }
    });
  }

  getDepartamentos() {
    this.service.getDepartamentos('1').subscribe((data: any) => {
      this.departamentos = data.Values.ResultFields;
    });
  }

  async getMunicipios() {
    let dpto = this.createProcessForm.controls['departamento'].value
    await this.service.getMunicipios(dpto).subscribe(async (data: any) => {
      this.municipios = await data.Values.ResultFields;
      this.createProcessForm.controls['municipio'].setValue('');
    });
  }

  async getMunicipiosSap() {
    let dpto = this.usuarioSapForm.controls['departamento'].value
    this.service.getMunicipios(dpto).subscribe(async (data: any) => {
      this.municipios = await data.Values.ResultFields;
      this.usuarioSapForm.controls['municipio'].setValue('');
    });
  }

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
    let tipoIdentificacion = this.createProcessForm.controls['tipoIdentificacion'].value;
    let valorContrato = this.createProcessForm.controls['valorContrato'].value;
    if (tipoIdentificacion == 'Cédula' || tipoIdentificacion == 'Cédula de Extranjería') {
      if (this.createProcessForm.controls['indDuracionContrato'].value) {
        if ((valorContrato / tiempoTotal) > this.maxSalary) {
          this.iconColor = 'lightgray';
          this.validateDataUNSPSC = 0;
          utils.showAlert('El valor excede los limites establecidos en la tabla de honorarios! ', 'error');
        } else {
          this.createProcessForm.controls['comite'].setValue('NO');
          this.iconColor = 'lightgreen';
        }
      } else {
        this.createProcessForm.controls['comite'].setValue('NO');
        this.iconColor = 'lightgreen';
      }

    } else if (tipoIdentificacion == 'Nit') {
      if (valorContrato > (this.minSalary * this.cantidadMaximaSalarios)) {
        this.iconColor = 'lightgreen';
        this.createProcessForm.controls['comite'].setValue('SI');
      } else {
        this.iconColor = 'lightgreen';
        this.createProcessForm.controls['comite'].setValue('NO');
      }
    }
  }

  changeTiempoDuracion() {
    this.iconColor = 'lightgray';
    this.validateDataUNSPSC = 0;
  }

  setFieldsToEdit() {
    // this.createProcessForm.controls['tipoIdentificacion'].(this.TIP_IDEN_PROV);
    this.formularioProceso();
    this.disableFields();
    this.myForm.get('arr')!.reset();
    this.cdpForm.get('cdpArray')!.reset();
    this.myForm.reset();
    this.cdpForm.reset();
    this.iconColor = 'lightgray';
    this.color = false;
    this.deleteCdpItem(1);
    this.deleteItem(1);
    this.EDITPROCESS = 1;
    this.valorContrato = false;
    this.enableFields();
    this.createProcessForm.controls['codigoEntidad'].setValue(atob(localStorage.getItem('codigoEntidad')!));
    this.createProcessForm.controls['centroGestor'].setValue(atob(localStorage.getItem('centroGestor')!));
    this.createProcessForm.controls['token'].setValue(atob(localStorage.getItem('token')!));
    this.createProcessForm.controls['username'].setValue(atob(localStorage.getItem('username')!));
    this.createProcessForm.controls['documentosTipo'].setValue('NO');
    this.createProcessForm.controls['proceso'].setValue(this.PROCESO);
    this.createProcessForm.controls['tipoIdentificacion'].setValue(this.TIP_IDEN_PROV);
    this.changeTipoIdentificacion(this.TIP_IDEN_PROV);
    // console.log(this.GENERO_PROV);
    this.createProcessForm.controls['identificacion'].setValue(this.COD_PROV);
    this.createProcessForm.controls['proveedor'].setValue(this.NOM_PROV);
    this.createProcessForm.controls['ubicacion'].setValue(this.UBICACION_PROV);
    this.createProcessForm.controls['fechaNacimiento'].setValue(this.NACIMIENTO_PROV);
    // this.getDepartamentos();
    // this.createProcessForm.controls['genero'].setValue(this.GENERO_PROV);
    // this.createProcessForm.controls['genero'].setValue('Indefinido');
    this.createProcessForm.controls['departamento'].setValue(this.DPTO_PROV);
    this.getMunicipios();
    // this.createProcessForm.controls['municipio'].setValue(this.CIUDAD_PROV);
    this.createProcessForm.controls['correo'].setValue(this.CORREO_PROV);
    this.createProcessForm.controls['celular'].setValue(this.CELULAR_PROV);
    this.createProcessForm.controls['categoriaContratacion'].setValue(this.CATE_CONTRATACION);
    this.createProcessForm.controls['profesion'].setValue(this.PROFESION_PROV);
    this.createProcessForm.controls['tipoProceso'].setValue(this.TIPO_PROCESO);
    this.service.getTiposContrato(this.createProcessForm.controls['tipoProceso'].value).subscribe(async (data: any) => {
      this.tiposContrato = await data.Values.ResultFields;
      this.createProcessForm.controls['tipoContrato'].setValue(this.TIPO_CONTRATO);
      await this.getEquipoContratacion();
      await this.getTiposJustificacionContrato();
    });
    // alert(this.UNI_CONTRATACION);
    this.reSetFields();
    // console.log('sample')
    this.createProcessForm.controls['equipo'].setValue('Equipo de contratación directa');
    // this.createProcessForm.controls['equipo'].setValue('CO1.PROC_TEAM.204101');
    this.createProcessForm.controls['unidad'].setValue(this.UNI_CONTRATACION);
    this.createProcessForm.controls['objeto'].setValue(this.DESCRIPCION_PROCESO);
    this.createProcessForm.controls['fechaInicio'].setValue(this.FECHA_INICIO);
    this.createProcessForm.controls['fechaTermino'].setValue(this.FECHA_TERMINO);
    this.createProcessForm.controls['firmaContrato'].setValue(this.FIRMA_CONTRATO);
    this.createProcessForm.controls['plazoEjecucion'].setValue(this.PLAZO_EJECUCION);
    this.createProcessForm.controls['valorContrato'].setValue(this.VAL_OFERTA);
    this.valorAcomparar = this.VAL_OFERTA;

    setTimeout(() => {
      this.cdpForm.reset();
      this.cdpForm.get('cdpArray')!.reset();
      this.deleteCdpItem(1);
      this.ff();
    }), 200;
  }

  ff() {
    for (let i = 0; i < this.CDPFIELDS.length; i++) {
      this.cdpForm.controls['cdpArray'].get(i.toString())?.setValue({
        'cdp': this.CDPFIELDS[i].CDP_NUMBER,
        'vigencia': this.CDPFIELDS[i].CDP_VIGENCIA,
        'valor': this.CDPFIELDS[i].CDP_VALOR,
        'centroGestor': atob(localStorage.getItem('centroGestor')!)
      });
      if (i != this.CDPFIELDS.length - 1) {
        this.addCdpItem();
      }
    }

    for (let j = 0; j < this.UNSPSCFIELDS.length; j++) {
      this.myForm.controls['arr'].get(j.toString())?.setValue({
        'codigoUNSPSC': this.UNSPSCFIELDS[j].UNS_CODIGO,
        'proceso': this.PROCESO,
        'descripcion': this.UNSPSCFIELDS[j].UNS_DESCRIPCION,
        'unidad': this.UNSPSCFIELDS[j].UNS_UNIDAD,
        'cantidad': this.UNSPSCFIELDS[j].UNS_CANTIDAD,
        'precioUnitario': this.UNSPSCFIELDS[j].UNS_PRECIO_UNITARIO,
        'centroGestor': this.UNSPSCFIELDS[j].UNS_CENTRO_GESTOR,
      });
      if (j != this.UNSPSCFIELDS.length - 1) {
        this.addItem();
      }
    }
  }

  goDetail(row: any) {
    this.secopService.getSelectedProcess(this.token, row.CONS_PROCESO).subscribe((response: any) => {
      localStorage.setItem('modalData', JSON.stringify(Object.assign({}, response.Values.ResultFields[0][0])));
      this.modalData = response.Values.ResultFields[0][0];
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
      this.CDPFIELDS = response.Values.ResultFields[1];
      this.UNSPSCFIELDS = response.Values.ResultFields[2];
      this.modal.sendClickEvent();
    });
  }

  fillNombre() {
    let justificacion = this.createProcessForm.controls['justificacionTipoProceso'].value
    this.createProcessForm.controls['nombreProceso'].setValue(justificacion)
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
      confirmButtonColor: 'primary',
      // cancelButtonColor: '#E9ECEF',
      cancelButtonColor: 'dark',
      confirmButtonText: 'Si, crear proceso!',
      cancelButtonText: 'No, deseo revisar!',
      reverseButtons: true
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.createProcess();
      }
    });
  }

  createItem() {
    return this.fb.group({
      codigoUNSPSC: new FormControl({
        value: '',
        disabled: false
      }, [Validators.pattern(/^[0-9]+$/), Validators.required]),
      proceso: new FormControl({value: null, disabled: false}),
      descripcion: new FormControl({value: '', disabled: false}, [Validators.required]),
      unidad: new FormControl({value: null, disabled: false}, [Validators.required]),
      cantidad: new FormControl({value: null, disabled: false}, [Validators.required]),
      precioUnitario: new FormControl({value: null, disabled: false}, [Validators.required]),
      centroGestor: new FormControl(atob(localStorage.getItem('centroGestor')!)),
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

  validateFieldsCdp() {
    this.valorAcomparar = this.createProcessForm.get('valorContrato')?.value;
    let cdp = this.cdpForm.controls['cdpArray'].value[0].cdp;
    if (cdp == null || cdp == '' || cdp.length <= 0) {
      this.cdpForm.controls['cdpArray'].get('0')?.setValue({
        'cdp': '',
        'vigencia': '',
        'valor': null,
        'centroGestor': atob(localStorage.getItem('centroGestor')!)
      });
    }
  }

  onSubmit() {
    let valor_contrato = this.createProcessForm.controls['valorContrato'].value;
    let tamanio = this.myForm.controls['arr'].value.length;
    let precioTotal = 0;
    let valorTotal = 0;
    for (let i = 0; i < tamanio; i++) {
      this.myForm.controls['arr'].value[i].centroGestor = this.centroGestor;
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
      utils.showAlert('El valor de los codigos UNSPSC debe ser igual al valor del contrato!', 'warning');
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
      localStorage.setItem('dataCdp', JSON.stringify(this.cdpForm.controls['cdpArray'].value));
      this.onCloseCdp();
      this.cantidadErrorCdp = [];
      this.cdpError = [];
      this.getCdpMountValidate();
    } else {
      this.validateDataCdp = 0;
      this.color = false;
      utils.showAlert('El valor de los codigos CDP debe ser igual al valor del contrato!', 'warning');
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
  }

  getUnidadesUnspsc() {
    this.secopService.getUnidadesUnspsc(this.token).subscribe((response: any) => {
      this.UNIDADESUNSPSC = response.Values.ResultFields;
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

      this.progressValueTotal = jsonData.DATA.length;
      for (let i = 0; i < jsonData.DATA.length; i++) {
        this.progressValue = Math.round((((i + 1) / this.progressValueTotal) * 100));
        let keyCount = Object.keys(jsonData.DATA[i]).length;
        let dataFormulario: any = [];
        await this.validateDataExcel(jsonData, keyCount, dataFormulario, i);//.then(console.log);
      }
      this.progressValue = 0;
      this.getdataProcess();
      this.cantidadError = this.procesosError.length;
      ev.target.value = '';
      this.filename = 'Seleccione un archivo';
      utils.showAlert('Proceso Terminado!', 'success');
    }
    reader.readAsBinaryString(file);
  }

  async validateDataExcel(jsonData: any, keyCount: number, dataFormulario: any, i: number) {
    return await new Promise((resolve, reject) => {
      if (keyCount == 23) {
        let dataExcel = jsonData.DATA[i];
        let codigoUNSPSC: any = [];
        let dataExcelCodigo = jsonData.UNSPSC;
        let dataExcelCdp = jsonData.CDP;
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
                this.secopService.getDataInfoProveedor(dataExcel.IDENTIFICACION, 'GVAL').subscribe((response: any) => {
                  if (response.Status == 'Ok') {
                    if (response.Values.ResultFields != 'El proveedor no existe') {
                      dataFormulario.push(dataExcel.TIPOIDENTIFICACION);
                      dataFormulario.push(dataExcel.IDENTIFICACION);
                      dataFormulario.push(response.Values.ResultFields.Name);
                      dataFormulario.push(response.Values.ResultFields.Direccion);

                      if (response.Values.ResultFields.Celular.toString().length == 10 && Number.isInteger(parseInt(response.Values.ResultFields.Celular))) {
                        dataFormulario.push(response.Values.ResultFields.Celular);
                        if (this.validateEmailMasivo(response.Values.ResultFields.Correo)) {
                          dataFormulario.push(response.Values.ResultFields.Correo);

                          let fechaNacimiento = moment(dataExcel.FECHANACIMIENTO.replaceAll('/', '-'), 'DD-MM-YYYY');
                          let diaNacimiento = fechaNacimiento.date();
                          let mesNacimiento = fechaNacimiento.month() + 1;
                          let añoNacimiento = fechaNacimiento.year();
                          let formato = añoNacimiento.toString() + mesNacimiento.toString() + diaNacimiento.toString();

                          if (formato <= this.ValidarMayoriaEdad()) {
                            dataFormulario.push(dataExcel.FECHANACIMIENTO);

                            if (dataExcel.TIPOIDENTIFICACION == 'Nit') {
                              dataExcel.GENERO = 'Indefinido';
                            }

                            dataExcel.GENERO = (dataExcel.GENERO == 1) ? 'Masculino' :
                              (dataExcel.GENERO == 2) ? 'Femenino' :
                                (dataExcel.GENERO == 3) ? 'Indefinido' :
                                  (dataExcel.GENERO.toString() == 'Indefinido') ? 'Indefinido' : '';

                            if (dataExcel.GENERO.toString() != '' || dataExcel.GENERO.toString().length != 0) {
                              dataFormulario.push(dataExcel.GENERO);
                              this.secopService.getDepartamento(dataExcel.DEPARTAMENTO).subscribe((response: any) => {
                                if (response.Status == 'Ok') {
                                  dataFormulario.push(dataExcel.DEPARTAMENTO);
                                  this.secopService.getMunicipio(dataExcel.MUNICIPIO).subscribe((response: any) => {
                                    if (response.Status == 'Ok') {
                                      dataFormulario.push(dataExcel.MUNICIPIO);

                                      dataExcel.CATCONTRATACION = (dataExcel.CATCONTRATACION == 1) ? 'Asesor' :
                                        (dataExcel.CATCONTRATACION == 2) ? 'Asistencial' :
                                          (dataExcel.CATCONTRATACION == 3) ? 'Profesional' :
                                            (dataExcel.CATCONTRATACION == 4) ? 'Profesional Especializado' :
                                              (dataExcel.CATCONTRATACION == 5) ? 'Técnico' :
                                                (dataExcel.CATCONTRATACION == 6) ? 'Tecnólogo' : '';

                                      if (dataExcel.CATCONTRATACION.toString() != '') {
                                        dataFormulario.push(dataExcel.CATCONTRATACION);
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
                                                        //if (dataExcel.NOMBREPROCESO != null && dataExcel.NOMBREPROCESO.toString().length != 0) {
                                                        //if (true) {
                                                          dataFormulario.push(dataExcel.NOMBREPROCESO);
                                                          this.secopService.validateUnidadContratacion(dataExcel.UNIDADCONTRATACION,this.centroGestor).subscribe((response: any) => {
                                                            if (response.Status == 'Ok') {
                                                              dataFormulario.push(dataExcel.UNIDADCONTRATACION);
                                                              this.secopService.validateEquipoContratacion(dataExcel.EQUIPOCONTRATACION,this.centroGestor).subscribe(async (response: any) => {
                                                                if (response.Status == 'Ok') {
                                                                  // dataFormulario.push(dataExcel.EQUIPOCONTRATACION);
                                                                  dataFormulario.push(response.Values.ResultFields);
                                                                  if (dataExcel.OBJETOPROCESO != null && dataExcel.OBJETOPROCESO.toString().length != 0) {
                                                                    dataFormulario.push(dataExcel.OBJETOPROCESO);
                                                                    // if (this.validarFirmasPosteriores(moment(dataExcel.FIRMACONTRATO, "YYYYMMDD").format().slice(0, -6)) == 1) {
                                                                    if (this.validarFirmasPosteriores(dataExcel.FIRMACONTRATO) == 1) {
                                                                      // dataFormulario.push(moment(dataExcel.FIRMACONTRATO, "YYYYMMDD").format().slice(0, -6));
                                                                      dataFormulario.push(dataExcel.FIRMACONTRATO);
                                                                      if (this.validarFirmasPosteriores(dataExcel.FECHAINICIO) == 1) {
                                                                        dataFormulario.push(dataExcel.FECHAINICIO);
                                                                        if (this.validarFirmasPosteriores(dataExcel.FECHATERMINO) == 1) {
                                                                          dataFormulario.push(dataExcel.FECHATERMINO);
                                                                          if (this.validarFirmasPosteriores(dataExcel.PLAZOEJECUCION) == 1) {
                                                                            dataFormulario.push(dataExcel.PLAZOEJECUCION);
                                                                            if (dataExcel.VALORESTIMADO != null && dataExcel.VALORESTIMADO.toString().length > 0 && !isNaN(Number(dataExcel.VALORESTIMADO)) && Number(dataExcel.VALORESTIMADO) > 0) {
                                                                              dataFormulario.push(dataExcel.VALORESTIMADO);
                                                                              // if (dataExcel.CDP != null && dataExcel.CDP.toString().length == 10) {
                                                                              //   dataFormulario.push(dataExcel.CDP);
                                                                              //   if (dataExcel.VIGENCIA != null && dataExcel.VIGENCIA.toString().length == 4) {
                                                                              //     dataFormulario.push(dataExcel.VIGENCIA);
                                                                              //     this.secopService.getCdpMount(this.token, dataExcel.CENTROGESTOR, dataExcel.CDP, dataExcel.VALORESTIMADO, dataExcel.VIGENCIA).subscribe(async (response: any) => {
                                                                              //       if (response.Status == 'Ok' && response.Values.ResultFields.length > 0) {
                                                                              //         let valorCdp = response.Values.ResultFields;
                                                                              //         if (valorCdp < dataExcel.VALORESTIMADO) {
                                                                              //           this.procesosError.push('Proceso N°' + (i + 1) + ' - No hay Presupuesto sufiente para este contrato');
                                                                              //           resolve('error cdp ' + (i + 1));
                                                                              //         } else {

                                                                              const responseValidacion = await this.validarCdp(dataExcel, dataExcelCdp, i);
                                                                              // console.log(responseValidacion, this.procesosError);
                                                                              if (responseValidacion != 0) {
                                                                                resolve('Error en validacion CDP');
                                                                                return;
                                                                              }
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
                                                                                    // console.log('comite:No');
                                                                                    comite = 'NO';
                                                                                  } else if (responseDuracion == 2) {
                                                                                    //comite
                                                                                    // console.log('comite:Si');
                                                                                    comite = 'SI';
                                                                                  }
                                                                                  dataFormulario.push(dataExcel.DURACIONCONTRATO);
                                                                                  dataFormulario.push(dataExcel.TIEMPOCONTRATO);
                                                                                  dataFormulario.push(this.username);
                                                                                  dataFormulario.push(comite);

                                                                                  const valUnspsc = await this.validateLongitudUnspsc(dataExcelCodigo.length, dataExcelCodigo, dataExcel, i);
                                                                                  if (valUnspsc != null && valUnspsc > 0) {
                                                                                    resolve('error UNSPSC ' + (i + 1));
                                                                                  } else {
                                                                                    await this.secopService.insertProcessMassive(dataFormulario).toPromise().then(async (response: any) => {
                                                                                      if (response.Status == 'Ok' && response.Values.ResultFields.length > 0) {
                                                                                        let r = await response.Values.ResultFields;
                                                                                        if (r != null) {
                                                                                          await this.functionInsertunspsc(dataExcelCodigo.length, dataExcelCodigo, dataExcel, response, i, valorAcomparar, codigoUNSPSC, dataExcelCdp);
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
                                                                                  }
                                                                                } else {
                                                                                  this.procesosError.push('Proceso N°' + (i + 1) + ' - tiempo contrato');
                                                                                  resolve('error tiempo contrato ' + (i + 1));
                                                                                }
                                                                              } else {
                                                                                this.procesosError.push('Proceso N°' + (i + 1) + ' - duracion contrato');
                                                                                resolve('error duracion contrato ' + (i + 1));
                                                                              }
                                                                              // }
                                                                              //   } else {
                                                                              //     this.procesosError.push('Proceso N°' + (i + 1) + ' - cdp');
                                                                              //     resolve('error cdp ' + (i + 1));
                                                                              //   }
                                                                              // });
                                                                              // } else {
                                                                              //   this.procesosError.push('Proceso N°' + (i + 1) + ' - vigencia');
                                                                              //   resolve('error vigencia ' + (i + 1));
                                                                              // }
                                                                              // } else {
                                                                              //   this.procesosError.push('Proceso N°' + (i + 1) + ' - CDP');
                                                                              //   resolve('error CDP ' + (i + 1));
                                                                              // }
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
                                                        /*} else {
                                                          this.procesosError.push('Proceso N°' + (i + 1) + ' - `nombre proceso`');
                                                          resolve('error nombre proceso ' + (i + 1));
                                                        }*/
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
                                        this.procesosError.push('Proceso N°' + (i + 1) + ' - Categoria Contratacion');
                                        resolve('error Categoria Contratacion ' + (i + 1));
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
                        }
                      }
                    } else {
                      this.procesosError.push('Proceso N°' + (i + 1) + ' - El proveedor no existe en Sap');
                      resolve('error Proveedor ' + (i + 1));
                    }
                  } else {
                    this.procesosError.push('Proceso N°' + (i + 1) + ' - El proveedor no existe en Sap');
                    resolve('error Proveedor ' + (i + 1));
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

  validarCorreoSap() {
    if (this.usuarioSapForm.controls['correo'].invalid) {
      //console.log('invalid');
      return false
    }
    //console.log('valid');
    return;
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

  async functionInsertunspsc(size: number, dataExcelCodigo: any, dataExcel: any, response: any, index: any, valorAcomparar: any, codigoUNSPSC: any, dataExcelCdp: any) {
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
                    dataExcelCodigo[i].CENTROGESTOR = atob(localStorage.getItem('centroGestor')!);
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
                this.procesosError.push('Proceso N°' + (index + 1) + ' - Unidad UNSPSC1');
                return this.procesosError.length;
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
    // await this.lumpi(dataExcel,dataExcelCdp,response.Values.ResultFields,index);
  }

  async insertarCdp(dataExcel: any, dataExcelCdp: any, index: any) {
    for (let j = 0; j < dataExcelCdp.length; j++) {
      if (dataExcelCdp[j].IDREGISTRO == dataExcel.IDREGISTRO) {
        dataExcelCdp[j].PROCESO = '';
        if (this.dataArrayParams.includes('VALIDAR_CDP')) {
          await this.secopService.getCdpMount(this.token, this.centroGestor, dataExcelCdp[j].CDP_NUMERO, dataExcelCdp[j].CDP_VALOR, dataExcelCdp[j].CDP_VIGENCIA).toPromise().then((response: any) => {
            if (response.Status != 'Ok') {
              this.color = false;
              this.procesosError.push('Proceso N°' + (index + 1) + ' ' + response.Values.Error);
              return this.procesosError.length;
            } else {
              if (response.Values.ResultFields < dataExcelCdp[j].CDP_VALOR) {
                this.procesosError.push('Proceso N° ' + (index + 1) + ' - No hay Presupuesto sufiente para este contrato');
                return this.procesosError.length;
              } else {
                let arrayExcelCdp = [];
                let jsonExcelCdp = {
                  cdp: dataExcelCdp[j].CDP_NUMERO,
                  vigencia: dataExcelCdp[j].CDP_VIGENCIA,
                  valor: dataExcelCdp[j].CDP_VALOR,
                  centroGestor: atob(localStorage.getItem('centroGestor')!),
                  proceso: dataExcelCdp[j].PROCESO,
                  // sociedad: dataExcelCdp[j].CDP_SOCIEDAD
                  sociedad: atob(localStorage.getItem('sociedad')!),
                }
                arrayExcelCdp.push(jsonExcelCdp);
                this.secopService.insertCdp(arrayExcelCdp).subscribe((response: any) => {
                  this.createProcessForm.reset();
                  this.myForm.reset();
                  this.cdpForm.reset();
                });
              }
            }
          }).catch((error: any) => {
            // console.log(error);
            utils.showAlert(error,'warning');
          });
        } else {
          let arrayExcelCdp = [];
          let jsonExcelCdp = {
            cdp: dataExcelCdp[j].CDP_NUMERO,
            vigencia: dataExcelCdp[j].CDP_VIGENCIA,
            valor: dataExcelCdp[j].CDP_VALOR,
            centroGestor: atob(localStorage.getItem('centroGestor')!),
            proceso: dataExcelCdp[j].PROCESO,
            // sociedad: dataExcelCdp[j].CDP_SOCIEDAD
            sociedad: atob(localStorage.getItem('sociedad')!),
          }
          arrayExcelCdp.push(jsonExcelCdp);
          this.secopService.insertCdp(arrayExcelCdp).subscribe((response: any) => {
            this.createProcessForm.reset();
            this.myForm.reset();
            this.cdpForm.reset();
          });
        }
      }
    }
  }

  async validarCdp(dataExcel: any, dataExcelCdp: any, index: any) {
    let sumaValoresCdp = 0;
    for (let i = 0; i < dataExcelCdp.length; i++) {
      if (dataExcelCdp[i].IDREGISTRO == index + 1) {
        // console.log(dataExcelCdp[i].CDP_NUMERO,dataExcelCdp[i].CDP_NUMERO.toString().length);
        if (dataExcelCdp[i].CDP_NUMERO.toString().length == 10) {
          sumaValoresCdp += dataExcelCdp[i].CDP_VALOR;
        } else {
          this.procesosError.push('Proceso N°' + (index + 1) + ' - error en longitud cdp!');
          return this.procesosError.length;
        }
      }
      if (i == dataExcelCdp.length - 1) {
        // console.log(dataExcel.VALORESTIMADO,sumaValoresCdp);
        if (dataExcel.VALORESTIMADO == sumaValoresCdp) {
          await this.insertarCdp(dataExcel, dataExcelCdp, index);
        } else {
          this.procesosError.push('Proceso N°' + (index + 1) + ' - El valor del proceso difiere de la suma de los cdp!');
          return this.procesosError.length;
        }
      }
    }
    return this.procesosError.length;
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
              // console.log(this.procesosExitosos);
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
      utils.showAlert('Por favor diligencie todos los campos!', 'warning');
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

  getAllProfesions() {
    this.secopService.getAllProfesions(this.token).subscribe((response: any) => {
      this.allProfesions = response.Values.ResultFields;
    });
  }

  async modifyProcess() {
    this.createProcessForm.controls['proveedor'].enable();
    this.createProcessForm.controls['ubicacion'].enable();
    let dataForm = Object.assign(this.createProcessForm.value);
    let dataCdp = localStorage.getItem('dataCdp');
    if (dataCdp != null) {
      let dato = JSON.parse(dataCdp);
      let size = dato.length;
      for (let i = 0; i < size; i++) {
        dato[i].proceso = this.PROCESO;
      }
      this.secopService.updateProcessComplete(dataForm).subscribe(async (response: any) => {
        // this.createProcessForm.enable();
        if (response.Status == 'Ok') {
          await this.secopService.insertCdp(dato).subscribe(async (response: any) => {
            // this.cdpForm.reset();
            // console.log(this.myForm.controls['arr'].value.length);
            if (response.Status == 'Ok') {
              for (let i = 0; i < this.myForm.controls['arr'].value.length; i++) {
                // console.log('entramos por aqui');
                this.myForm.controls['arr'].value[i].proceso = this.PROCESO;
                if (i == this.myForm.controls['arr'].value.length - 1) {
                  await this.secopService.insertUNSPSC(this.myForm.controls['arr'].value).subscribe((response: any) => {
                    if (response.Status == 'Ok') {
                      this.iconColor = 'lightgray';
                      this.color = false;
                      this.createProcessForm.reset();
                      this.createProcessForm.controls['valorContrato'].disable();
                      this.createProcessForm.controls['duracionContrato'].disable();
                      this.createProcessForm.controls['tiempoDuracion'].disable();
                      this.createProcessForm.controls['proveedor'].disable();
                      this.createProcessForm.controls['ubicacion'].disable();
                      this.cdpForm.controls['cdpArray'].reset();
                      this.cdpForm.reset();
                      this.myForm.controls['arr'].reset();
                      this.myForm.reset();
                      this.deleteCdpItem(1);
                      this.deleteItem(1);
                      this.EDITPROCESS = 0;
                      utils.showAlert('Proceso actualizado correctamente!', 'success');
                    } else {
                      utils.showAlert('Proceso no pudo ser actualizado!', 'warning');
                    }

                  });
                }
              }
            }
            localStorage.removeItem('dataCdp');
          });
        }
      });
    }
  }

  async getClasificacionBienes() {
    this.secopService.getClasificacionBienes(this.token, 'null').subscribe((response: any) => {
      let jsonRetur: any = [];
      this.clasificacionBienes = response.Values.ResultFields;
      this.clasificacionBienesAlmacenado = response.Values.ResultFields;
    });
  }

  getCodigosUnspsc(data: any) {
    if (data.target.value.length >= 6 && data.target.value.length <= 8) {
      this.secopService.getClasificacionBienes(this.token, data.target.value).subscribe((response: any) => {
        this.clasificacionBienes = response.Values.ResultFields;
      });
    } else if (data.target.value.length == 0) {
      this.clasificacionBienes = this.clasificacionBienesAlmacenado;
    }
  }

  procesoManual() {
    this.modalidad = false;
  }

  downloadFormat() {
    let link = document.createElement("a");
    link.download = "filename";
    link.href = "./assets/images/excel-homologacion-gestion-prueba.xlsx";
    link.click();
  }

  backModalidad() {
    this.modalidad = true;
  }

  onBlurFields(event: any) {
    event.target.blur();
  }

  resetFieldsProcess() {
    this.EDITPROCESS = 0;
    this.deleteCdpItem(1);
    this.deleteItem(1);
    this.iconColor = 'lightgray';
    this.color = false;
    this.formularioProceso();
    this.myForm.get('arr')!.reset();
    this.cdpForm.get('cdpArray')!.reset();
    this.myForm.reset();
    this.cdpForm.reset();
    localStorage.removeItem('dataCdp');
    this.createProcessForm.get('municipio')?.setValue(null);
    this.createProcessForm.controls['acuerdos'].setValue('NO');
    this.createProcessForm.controls['documentosTipo'].setValue('NO');
    this.createProcessForm.controls['interadministrativos'].setValue('NO');
    this.createProcessForm.controls['acuerdoPaz'].setValue('NO');
    this.createProcessForm.controls['definirPagos'].setValue('NO');
    this.createProcessForm.controls['definirLotes'].setValue('NO');
    this.disableFields();
  }


  disableFields() {
    setTimeout(() => {
      this.createProcessForm.controls['duracionContrato'].disable();
      this.createProcessForm.controls['tiempoDuracion'].disable();
      this.createProcessForm.controls['valorContrato'].disable();
    }, 100);
  }

  reSetFields() {
    setTimeout(() => {
      this.createProcessForm.get('genero')?.setValue(this.GENERO_PROV);
      this.createProcessForm.get('municipio')?.setValue(this.CIUDAD_PROV);
      this.createProcessForm.get('equipo')?.setValue(this.EQUIPO_CONTRATACION);
      this.createProcessForm.controls['tipoContrato'].setValue(this.TIPO_CONTRATO);
      this.createProcessForm.controls['justificacionTipoProceso'].setValue(this.JUST_TIPO_PROCESO);
    }, 100);
  }

  formularioProceso() {
    this.createProcessForm = this.fb.group({
      token: new FormControl(atob(localStorage.getItem('token')!)),
      proceso: this.PROCESO,
      username: new FormControl(atob(localStorage.getItem('username')!)),
      codigoEntidad: new FormControl(atob(localStorage.getItem('codigoEntidad')!)),
      centroGestor: new FormControl(atob(localStorage.getItem('centroGestor')!)),
      //*****************************************************************************************************************
      tipoIdentificacion: new FormControl(null, [Validators.required]),
      identificacion: new FormControl({value: '', disabled: false}, [Validators.required]),
      proveedor: new FormControl({value: '', disabled: false}, [Validators.required]),
      ubicacion: new FormControl({value: '', disabled: false}, [Validators.required]),
      fechaNacimiento: new FormControl({value: '', disabled: true}, [Validators.required]),
      genero: new FormControl(null, [Validators.required]),
      departamento: new FormControl(null, [Validators.required]),
      municipio: new FormControl(null, [Validators.required]),
      categoriaContratacion: new FormControl(null, [Validators.required]),
      profesion: new FormControl({value: null, disabled: false}, [Validators.required]),
      correo: new FormControl('', [Validators.required, Validators.email]),
      celular: new FormControl({
        value: '',
        disabled: false
      }, [Validators.required, Validators.minLength(10), Validators.maxLength(10)]),
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
      indDuracionContrato: new FormControl({value: true, disabled: false}),
      tiempoDuracion: new FormControl({value: '', disabled: true}, [Validators.required]),
      comite: new FormControl({value: '', disabled: false}, [Validators.required]),
      // cdp: new FormControl({value: '', disabled: true}, [Validators.required]),
      // categoriaProfesion: new FormControl({value: '', disabled: false}, [Validators.required]),
    });
  }

  enableFields() {
    setTimeout(() => {
      this.createProcessForm.controls['valorContrato'].enable();
      this.createProcessForm.controls['justificacionTipoProceso'].enable();
      this.createProcessForm.controls['equipo'].enable();
    }, 100);
  }

  onFocus() {
    this.renderer.selectRootElement('#celular').focus();
  }

  async validateLongitudUnspsc(size: number, dataExcelCodigo: any, dataExcel: any, index: any) {
    for (let i = 0; i < size; i++) {
      if (dataExcelCodigo[i].IDREGISTRO == dataExcel.IDREGISTRO) {
        if (dataExcelCodigo[i].UNIDAD != null && dataExcelCodigo[i].UNIDAD.length >= 11) {
          return await this.secopService.validateUnidadUNSPSC(dataExcelCodigo[i].UNIDAD).toPromise().then((response: any) => {
            if (response.Status != 'Ok') {
              this.procesosError.push('Proceso N°' + (index + 1) + ' - Unidad UNSPSC');
            }
            if (i == size - 1) {
              return this.procesosError.length;
            }
          });
        } else {
          this.procesosError.push('Proceso N°' + (index + 1) + ' - Longitud Unidad UNSPSC');
          return this.procesosError.length;
        }
      }
    }
  }

  createContratistaSap(){
    this.usuarioSapForm.get('razonSocial')?.setValue(this.usuarioSapForm.get('nombreProveedor')?.value+' '+this.usuarioSapForm.get('apellidoProveedor')?.value);
    this.usuarioSapForm.get('indicativo')?.setValue('');
    this.usuarioSapForm.get('nit')?.setValue(this.usuarioSapForm.get('identificacion')?.value);
    this.getExistenciaProveedorSap(this.usuarioSapForm.get('identificacion')?.value);
  }

  changeTipoIdentificacionSap(event:any){
    this.usuarioSapForm.get('digitoVerificacion')?.reset();
    this.usuarioSapForm.get('digitoVerificacion')?.disable();
    if(event.value == '31'){
      this.usuarioSapForm.get('digitoVerificacion')?.enable();
    }
  }

  getTipoIdentificacionSap(){
    this.sapService.getTipoIdentificacionSap(this.token).subscribe((response:any)=>{
      //console.log(response.Values.ResultFields);
      this.tipoIdentificacionSap = response.Values.ResultFields;
    });
  }

  getTipoPersonaSap(){
    this.sapService.getTipoPersonaSap(this.token).subscribe((response:any)=>{
      //console.log(response.Values.ResultFields);
      this.tipoPersonaSap = response.Values.ResultFields;
    });
  }

  getTratamientoPersonaSap(){
    this.sapService.getTratamientoPersonaSap(this.token).subscribe((response:any)=>{
      //console.log(response.Values.ResultFields);
      this.tratamientoPersonaSap = response.Values.ResultFields;
    });
  }

  getClaseImpuestoSap(){
    this.sapService.getClaseImpuestoSap(this.token).subscribe((response:any)=>{
      //console.log(response.Values.ResultFields);
      this.claseImpuestoSap = response.Values.ResultFields;
    });
  }

  numberValidation(evento: any,longitud:number) {
    //console.log(this.usuarioSapForm.get('celular')?.invalid);
    if (isNaN(evento.key) || evento.target.value.length == longitud || evento.key == '.' || evento.key == ',') {
      return false;
    }
    return;
  }

  getExistenciaProveedorSap(identificacion:any){
    this.sapService.getExistenciaProveedorSap(this.token,identificacion).subscribe((response:any)=>{
      //console.log(response)
      if(response.Status == 'Ok' && response.Values.ResultFields[0].CANTIDAD == '0'){
        this.sapService.createProveedorSap(Object.assign({}, this.usuarioSapForm.value)).subscribe((response:any)=>{
          if(response.Status == 'Ok' && response.Values == '200'){
            utils.showAlert('Usuario creado exitosamente','success');
            let identificacion = {value:this.createProcessForm.get('identificacion')?.value.toString()};
            this.onKeydownEvent(identificacion);
          }
          else{
            utils.showAlert('No se pudo crear el usuario','warning');
          }
        });
      }
      else{
        utils.showAlert('El usuario ya existe','warning');
      }
    });
  }

}
