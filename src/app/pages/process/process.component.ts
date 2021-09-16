import {AfterViewInit, Component, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {
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
import {MatSort} from "@angular/material/sort";


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
  //Numeración	ID Secop	Nombre del Proceso	Dependencia	Unidad	Equipo	Valor oferta
  public dataSource!: MatTableDataSource<any>;
  public dataSourceSecop!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  // @ViewChild(MatPaginator) paginatorSecop!: MatPaginator;
  @ViewChild('paginatorSecop', { static: true }) paginatorSecop!: MatPaginator;
  // @ViewChild('sortSecop', { static: true }) sortSecop!: MatSort;
  @ViewChild(MatSort) sortSecop!: MatSort;

  constructor(
    private fb: FormBuilder,
    private secopService: SecopService,
    private service: ServicesService,
    private sapService: SapService,
    private authService: AuthService,
    private translate: TranslateService,
    private store: Store<AppState>
  ) {
    this.store.select('idioma').subscribe(({idioma}) => {
      this.idioma = idioma;
      this.translate.use(idioma);
    });
  }

  ngAfterViewInit() {
    this.secopService.sendGetDataSecop().subscribe((data:any) => {
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
      //*****************************************************************************************************************
      tipoIdentificacion: new FormControl(null, [Validators.required]),
      identificacion: new FormControl({value: '11111', disabled: true}, [Validators.required]),
      proveedor: new FormControl({value: '11111', disabled: true}, [Validators.required]),
      ubicacion: new FormControl({value: '11111', disabled: true}, [Validators.required]),
      fechaNacimiento: new FormControl({value: '', disabled: false}, [Validators.required]),
      genero: new FormControl(null, [Validators.required]),
      departamento: new FormControl(null, [Validators.required]),
      municipio: new FormControl(null, [Validators.required]),
      categoríaContratacion: new FormControl(null, [Validators.required]),
      profesion: new FormControl({value: 'ADSI', disabled: false}, [Validators.required]),
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
      documentosTipo: new FormControl({value: 'NO', disabled: true}, [Validators.required]),
      codigoUNSPSC: new FormControl({value: '49101601', disabled: true}, [Validators.required]),
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
    });

    //*************** TABLAS PROCESOS ********************
    this.secopService.getDataProcess('0001', 1).subscribe((data: any) => {
      this.info_process = data;
      this.infoProcess();
    });

    //****************************************************
    this.getChangeContractValue()
    this.getTiposProceso();
    this.departmentsCont();
    this.getUserData();
    this.getDepartamentos();
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
    this.formatDate(this.createProcessForm.controls['fechaNacimiento'].value, 'fechaNacimiento');
    this.formatDate(this.createProcessForm.controls['firmaContrato'].value, 'firmaContrato');
    this.formatDate(this.createProcessForm.controls['fechaInicio'].value, 'fechaInicio');
    this.formatDate(this.createProcessForm.controls['plazoEjecucion'].value, 'plazoEjecucion');
    this.createProcessForm.enable();
    this.createProcessForm.controls['duracionContrato'].setValue(duracion);
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
          this.createProcessForm.controls['codigoUNSPSC'].setValue('49101601');
          this.createProcessForm.controls['interadministrativos'].setValue('NO');
          this.createProcessForm.controls['acuerdoPaz'].setValue('NO');
          this.createProcessForm.controls['definirPagos'].setValue('NO');
          this.createProcessForm.controls['definirLotes'].setValue('NO');
          this.color = false;
          utils.showAlert('Proceso creado correctamente!', 'success');
          this.secopService.getDataProcess('0001', 1).subscribe((data) => {
            this.info_process = data;
            this.infoProcess();
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
  }

  changeTipoIdentificacion(data: any) {
    this.createProcessForm.controls['identificacion'].enable();
    this.createProcessForm.controls['valorContrato'].enable();
    this.createProcessForm.controls['valorContrato'].setValue('');
    this.createProcessForm.controls['duracionContrato'].reset();
    this.iconColor = 'lightgray';
  }

  async getCdpMount() {
    if (
      this.createProcessForm.controls['valorContrato'].value != null &&
      this.createProcessForm.controls['valorContrato'].value != '' &&
      this.createProcessForm.controls['valorContrato'].value >= 1
    ) {
      const { value: formValues } = await Swal.fire({
        title: 'Ingrese el número de CDP',
        showCloseButton: true,
        confirmButtonColor: '#007BFF',
        confirmButtonText: 'Continue',
        input: 'text',
        inputAttributes: {
          autocapitalize: 'off',
          maxlength:'10',
          minlength:'10'
        },
        allowOutsideClick: false,
        focusConfirm: false,
        showLoaderOnConfirm: true,
        // inputLabel: 'Ingrese el número de CDP',
        // inputPlaceholder: 'Enter your email address'
        inputValidator: (value:any) => {
          return new Promise((resolve:any) => {
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
          // Swal.fire(JSON.stringify(formValues))
          this.color = true;
        }
      }
    }
  }

  changeEscolaridad() {
    if (
      this.createProcessForm.controls['escolaridad'].value !== 'Selecione...'
    ) {
      alert(this.createProcessForm.controls['escolaridad'].value);
      this.createProcessForm.controls['profesion'].enable();
    } else {
      this.createProcessForm.controls['profesion'].disable();
    }
  }

  getColor() {
    let validColor = (this.color === true) ? 'lightgreen' : 'lightgray';
    return validColor;
  }

  formatDate(data: string, campo: string) {
    let d = new Date(data);
    let dia = (d.getDate().toString().length == 1) ? '0' + d.getDate().toString() : d.getDate().toString();
    let mes = ((d.getMonth() + 1).toString().length == 1) ? '0' + (d.getMonth() + 1).toString() : (d.getMonth() + 1).toString();
    let anio = d.getFullYear();
    let hora = d.getHours();
    let minutos = d.getMinutes();
    return this.createProcessForm.controls[campo].setValue(anio + '-' + mes + '-' + dia + ' ' + hora + ':' + minutos);
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
      // console.log(data.Values.ResultFields)
      this.tiposProceso = data.Values.ResultFields;
    })
  }

  getTiposContrato() {
    // console.log(this.createProcessForm.controls['tipoProceso'].value)
    this.tiposJustificacionContrato = null;
    this.service.getTiposContrato(this.createProcessForm.controls['tipoProceso'].value).subscribe((data: any) => {
      // console.log(data.Values.ResultFields)
      this.tiposContrato = data.Values.ResultFields;
    })
  }

  getTiposJustificacionContrato() {
    this.service.getTiposJustificacionContrato(this.createProcessForm.controls['tipoContrato'].value).subscribe((data: any) => {
      // console.log(data.Values.ResultFields)
      this.tiposJustificacionContrato = data.Values.ResultFields;
    })
  }

  getEquipoContratacion() {
    this.service.getEquipoContratacion(this.createProcessForm.controls['tipoProceso'].value).subscribe((data: any) => {
      // console.log(data.Values.ResultFields)
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
    utils.sendSoapData()
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
        utils.showAlert('El valor excede los limites establecidos en la tabla de honorarios! ', 'error');
      } else {
        this.iconColor = 'lightgreen';
      }
    } else if (tipoIdentificacion == 'Nit') {
      if ((valorContrato / tiempoTotal) > (salarioMinimo * 100)) {
        this.iconColor = 'lightgray';
        utils.showAlert('El valor excede los limites establecidos en la tabla de honorarios! ', 'error');
      } else {
        this.iconColor = 'lightgreen';
      }
    }
  }

  changeTiempoDuracion(){
    this.iconColor = 'lightgray';
  }

}
