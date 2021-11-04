import {AfterViewInit, Component, HostListener, OnDestroy, OnInit, ViewChild,Inject,LOCALE_ID} from '@angular/core';
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
import {NavigationExtras} from "@angular/router";
import * as moment from 'moment';
import * as funciones from "../../utils/functions";
import * as func from "../../utils/functions";

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
  public tiposProceso: any;
  public tiposContrato: any;
  public tiposJustificacionContrato: any;
  public equipoContratacion: any;
  public iconColor: string = 'lightgray';
  public valorContrato: any;
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
  arr!: FormArray;
  colorBotonUNSPSC = '#0B9FA5FF';
  borderBotonUSNPSC = '#0B9FA5FF';
  fontcolorBotonUNSPSC = '#0B9FA5FF';
  validateDataUNSPSC: number = 0;
  UNIDADESUNSPSC!:any;
  categoriasProfesion!:any;
  categoriasSubProfesion!:any;
  @ViewChild('closebutton') closebutton:any;
  @ViewChild('openbutton') openbutton:any;
  CENTRO_GESTOR: any;

  constructor(
    private fb: FormBuilder,
    private secopService: SecopService,
    private service: ServicesService,
    private sapService: SapService,
    private authService: AuthService,
    private translate: TranslateService,
    private store: Store<AppState>,
    public dialog: MatDialog,
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
      identificacion: new FormControl({value: '11111', disabled: true}, [Validators.required]),
      proveedor: new FormControl({value: '11111', disabled: true}, [Validators.required]),
      ubicacion: new FormControl({value: '11111', disabled: true}, [Validators.required]),
      fechaNacimiento: new FormControl({value: '', disabled: false}, [Validators.required]),
      genero: new FormControl(null, [Validators.required]),
      departamento: new FormControl(null, [Validators.required]),
      municipio: new FormControl(null, [Validators.required]),
      categoriaContratacion: new FormControl(null, [Validators.required]),
      profesion: new FormControl({value: null, disabled: true}, [Validators.required]),
      correo: new FormControl('jegc9323@gmail.com', [Validators.required]),
      celular: new FormControl({value: '3134061994', disabled: false}, [Validators.required]),
      //****************************************************************************************************************
      tipoProceso: new FormControl(null, [Validators.required]),
      tipoContrato: new FormControl(null, [Validators.required]),
      justificacionTipoProceso: new FormControl(null, [Validators.required]),
      nombreProceso: new FormControl('new process', [Validators.required]),
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
      cdp: new FormControl({value: '', disabled: true}, [Validators.required]),
      categoriaProfesion: new FormControl({value: '', disabled: false}, [Validators.required]),
    });
    this.myForm = this.fb.group({
      arr: this.fb.array([this.createItem()])
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

  // formSearchSecop(): void {
  //   this.secopSearch = new FormGroup({
  //     COLUMN: new FormControl(null, [Validators.required]),
  //     PARAM: new FormControl(null, [Validators.required]),
  //   });
  // }

  // searchSecop(): void {
  //   if (this.secopSearch.valid) {
  //     var column = this.secopSearch.value.COLUMN;
  //     var param = this.secopSearch.value.PARAM;

  //     this.secopService.searchDataSecop(column, param).subscribe((data) => {
  //       // console.log(data);
  //       this.result = data;
  //     });
  //   }
  // }

  getChangeContractValue() {
    this.createProcessForm.controls['valorContrato'].valueChanges.subscribe((data) => {
      this.createProcessForm.controls['duracionContrato'].reset();
      this.createProcessForm.controls['duracionContrato'].disable();
      this.createProcessForm.controls['tiempoDuracion'].reset();
      this.createProcessForm.controls['tiempoDuracion'].disable();
      this.createProcessForm.controls['cdp'].reset();
      this.iconColor = 'lightgray';
      this.color = false;
      this.getColor();
    })
  }

  departmentsCont(): void {
    let token = atob(localStorage.getItem('token')!);
    // console.log('tkn init ', token);
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

  // fillEntidad() {
  //   let unidadesCount = localStorage.getItem('unidades')!;
  //   let equiposCount = localStorage.getItem('equipos')!;
  //
  //   // if(unidadesCount == null || unidadesCount == '' || equiposCount == null || equiposCount == ''){
  //   //   return;
  //   // }
  //
  //   if(unidadesCount != null && unidadesCount.includes(',')){
  //     this.unidades = unidadesCount.split(',');
  //   }
  //   else{
  //     let arr = [];
  //     arr.push(unidadesCount);
  //     this.unidades = arr;
  //   }
  //   if(equiposCount != null &&  equiposCount.includes(',')){
  //     this.equipos = equiposCount.split(',');
  //   }
  //   else{
  //     let arr = [];
  //     arr.push(equiposCount);
  //     this.equipos = arr;
  //   }
  //   // console.log(this.unidades);
  //   // console.log(this.equipos);
  //   /*let equipo = JSON.parse(localStorage.getItem('equipo')!);
  //   let resultArray = Object.keys(equipo).map((data) => {
  //     let person = equipo[data];
  //     return person;
  //   });*/
  // }

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
          this.color = false;
          utils.showAlert('Proceso creado correctamente!', 'success');
          this.secopService.getDataProcess('0001', 1).subscribe((data: any) => {
            this.info_process = data;
            this.infoProcess();
          });
          // console.log(this.myForm.controls['arr'].value);
          // console.log(this.myForm.controls['arr']);
          // console.log(data.proId);
          let tamanio = this.myForm.controls['arr'].value.length;
          for (let i = 0; i < tamanio; i++) {
            this.myForm.controls['arr'].value[i].proceso = data.proId;
          }
          // let unspscForm = Object.assign(this.myForm.controls['arr'].value);
          this.secopService.insertUNSPSC(this.myForm.controls['arr'].value).subscribe((response:any)=>{
            console.log(response);
          });
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
    this.createProcessForm.controls['cdp'].disable();
  }

  changeTipoIdentificacion(data: any) {
    this.createProcessForm.controls['identificacion'].enable();
    this.createProcessForm.controls['valorContrato'].enable();
    this.createProcessForm.controls['valorContrato'].setValue('');
    this.createProcessForm.controls['duracionContrato'].reset();
    this.iconColor = 'lightgray';
  }

  async getCdpMountValidate() {
    this.color = false;
    this.iconColor = 'lightgray';
    this.getColor();
    if (
      this.createProcessForm.controls['valorContrato'].value != null &&
      this.createProcessForm.controls['valorContrato'].value != '' &&
      this.createProcessForm.controls['valorContrato'].value >= 1
    ) {
      const {value: formValues} = await Swal.fire({
        title: 'Ingrese el número de CDP',
        showCloseButton: true,
        confirmButtonColor: '#007BFF',
        confirmButtonText: 'Continue',
        input: 'text',
        inputAttributes: {
          autocapitalize: 'off',
          maxlength: '10',
          minlength: '10'
        },
        allowOutsideClick: false,
        focusConfirm: false,
        // showLoaderOnConfirm: true,
        // inputLabel: 'Ingrese el número de CDP',
        // inputPlaceholder: 'Enter your email address'
        inputValidator: (value: any) => {
          return new Promise((resolve: any) => {
            if (value.length == 10) {
              resolve();
            } else {
              resolve('Por favor Ingrese 10 Digitos :)')
            }
          })
        }
      });

      // const {value: formValues} = await Swal.fire({
      //   // title: 'Multiple inputs',
      //   showCloseButton: true,
      //   confirmButtonColor: '#007BFF',
      //   confirmButtonText: 'Continue',
      //   allowOutsideClick: false,
      //   focusConfirm: false,
      //   html:
      //     '<label class="font-weight-bold" style="font-size: 22px">Ingrese el número de CDP</label><br/>' +
      //     '<a style="color: red;font-size: 14px">Digite un numero de 10 digitos *</a>' +
      //     '<input id="swal-input1" type="number" class="swal2-input" max="10" required><br/><br/>' +
      //     '<label class="font-weight-bold" style="font-size: 22px">Ingrese la posicion del CDP</label><br/>' +
      //     '<input id="swal-input2" type="number" class="swal2-input" required>',
      //   preConfirm: () => {
      //     return [
      //       $('#swal-input1').val(),
      //       $('#swal-input2').val()
      //     ]
      //   }
      // })
      if (formValues) {
        if (formValues!.toString().length != 10) {
          utils.showAlert('Por favor ingrese un CDP de 10 digitos!', 'error');
          return;
        } else {
          this.createProcessForm.controls['duracionContrato'].enable();
          this.centroGestor = '1158';
          this.createProcessForm.controls['cdp'].setValue(formValues);
          this.secopService.getCdpMount(this.token,this.centroGestor,this.createProcessForm.controls['cdp'].value).subscribe((response:any)=>{
            if(response.Status != 'Ok'){
                  this.color = false;
                  utils.showAlert('CDP no encontrado por favor intente de nuevo!','error');
                  this.createProcessForm.controls['cdp'].setValue('');
            }
            else{
              let monto = response.Values.ResultFields;
              if(monto != null && monto != '' && monto.length > 0 && parseFloat(monto) < this.createProcessForm.controls['valorContrato'].value){
                this.color = false;
                utils.showAlert('No hay fondos suficientes!','error');
                this.createProcessForm.controls['cdp'].setValue('');
              }
              else{
                this.color = true;
                this.createProcessForm.controls['cdp'].setValue(formValues);
                utils.showAlert('valor del contrato valido','success');
              }
            }
          });
        }
      }
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
    let minSalary = 985000; // traer salario minimo de la base de datos
    let validate;
    switch (tipoIdentificacion) {
      case 'Cédula':
        validate = (valorContrato / duracionContrato < 7000000) ? true : false;
        break;
      case 'Cédula de Extranjería':
        validate = (valorContrato / duracionContrato < 7000000) ? true : false;
        break;
      case 'Nit':
        validate = (valorContrato > (minSalary * 100)) ? false : true;
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

  test() {
    alert('jojojo')
    utils.sendSoapData([],'');
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
    let salarioMinimo = 980000;
    let tipoIdentificacion = this.createProcessForm.controls['tipoIdentificacion'].value;
    let valorContrato = this.createProcessForm.controls['valorContrato'].value;

    if (tipoIdentificacion == 'Cédula' || tipoIdentificacion == 'Cédula de Extranjería') {
      if ((valorContrato / tiempoTotal) > 7000000) {
        this.iconColor = 'lightgray';
        this.validateDataUNSPSC = 0;
        utils.showAlert('El valor excede los limites establecidos en la tabla de honorarios! ', 'error');
      } else {
        this.createProcessForm.controls['comite'].setValue('NO');
        console.log(this.createProcessForm.controls['comite'].value);
        this.iconColor = 'lightgreen';
      }
    } else if (tipoIdentificacion == 'Nit') {
      // if ((valorContrato / tiempoTotal) > (salarioMinimo * 100)) {
      if (valorContrato > (salarioMinimo * 100)) {
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
    this.secopService.getDataProcess('0001', 1).subscribe((data: any) => {
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
      confirmButtonColor: '#0b9fa5',
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
      proceso: new FormControl({value: '',disabled:false}),
      descripcion: new FormControl({value: '', disabled: false}, [Validators.required]),
      unidad: new FormControl({value: null, disabled: false}, [Validators.required]),
      cantidad: new FormControl({value: null, disabled: false}, [Validators.required]),
      precioUnitario: new FormControl({value: null, disabled: false}, [Validators.required]),
    })
  }

  addItem() {
    this.arr = this.myForm.get('arr') as FormArray;
    this.arr.push(this.createItem());
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
    if(valorTotal == valor_contrato){
      this.codigoUNSPSC = this.myForm.value;
      this.validateDataUNSPSC = 1;
      utils.showAlert('Codigo(s) UNSPSC asociados correctamente!','success');
    }
    else{
      this.myForm.reset();
      this.validateDataUNSPSC = 0;
      utils.showAlert('El valor de los codigos UNSPSC debe ser igual al valor del contrato!','error');
    }

  }

  trackByFn(index: any, item: any) {
    return index;
  }

  deleteItem(index: number) {
    const add = this.myForm.get('arr') as FormArray;
    add.removeAt(index)
  }

  getUnidadesUnspsc(){
    this.secopService.getUnidadesUnspsc(this.token).subscribe((response:any)=>{
      this.UNIDADESUNSPSC = response.Values.ResultFields;
    });
  }

  getCategoriaProfesion(){
    this.secopService.getCategoriaProfesion(this.token).subscribe((response:any)=>{
      this.categoriasProfesion = response.Values.ResultFields;
    })
  }

  getProfesionByCategoria(){
    let categoriaProfesion = this.createProcessForm.controls['categoriaProfesion'].value;
    this.secopService.getProfesionByCategoria(this.token,categoriaProfesion).subscribe((response:any)=>{
      this.createProcessForm.controls['profesion'].enable();
      this.categoriasSubProfesion = response.Values.ResultFields;
    })
  }

  public getPagosXRpc(){
    let rpc = this.CODIGO_RPC;

    if (rpc && rpc.length == 10 ) {
      this.secopService.getPagosXRpc(this.token,rpc).subscribe((response:any)=>{
        if(response.Status != 'Ok'){
          utils.showAlert('Rpc no encontrado, por favor intente de nuevo!','error');
        }
        else{
          this.infoPagos = response.Values.ResultFields;
          utils.showAlert('Consulta exitosa!','success');
          this.onOpen();
        }
      });
    }
    else{
      utils.showAlert('No se encontro un codigo Rpc asociado!','error');
    }
  }

  public onOpen(){
    this.openbutton.nativeElement.click();
  }

  generateReports() {
    func.generarReporte(this.infoPagos, this.locale,this.CENTRO_GESTOR,this.NOM_PROV,this.COD_PROV);
  }

}
