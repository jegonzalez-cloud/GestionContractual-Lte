import {CurrencyPipe} from '@angular/common';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
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
import {cargarIdioma, cargarSap} from 'src/app/store/actions';
import {AppState} from 'src/app/store/app.reducers';
import Swal from 'sweetalert2';
import * as utils from '../../utils/functions'
import {Subject} from "rxjs";
import {HttpClient} from "@angular/common/http";
// import * as $ from 'jquery';
import 'datatables.net';
import 'datatables.net-bs4';

@Component({
  selector: 'app-process',
  templateUrl: './process.component.html',
  styleUrls: ['./process.component.css']
})
export class ProcessComponent implements OnDestroy, OnInit {
  private idioma!: string;
  createProcessForm!: FormGroup;
  departments: any = [];
  info_process: any = [];
  page: number = 0;
  result: any = [];
  secopSearch: any = [];
  userDataFromSecop: any = [];
  camposEntidad: any[] = [];
  camposSecop: any[] = [];
  validadorTipoIdentidad: boolean = true;
  CodigoUNSPSC: string = '49101601'
  dtOptions: DataTables.Settings = {};
  data:any;
  dtTrigger: Subject<any> = new Subject<any>();

  constructor(
    private fb: FormBuilder,
    private secopService: SecopService,
    private sapService: SapService,
    private authService: AuthService,
    private translate: TranslateService,
    private store: Store<AppState>,
    private http: HttpClient
  ) {
    this.store.select('idioma').subscribe(({idioma}) => {
      this.idioma = idioma;
      this.translate.use(idioma);
    });


    // this.createProcessForm.valueChanges.subscribe(form => {
    //     if(form.valorcontrato){
    //       this.createProcessForm.patchValue({
    //         valorcontrato: this.currency.transform(form.valorcontrato.replace(/\D/g, '').replace(/^0+/, ''), 'USD', 'symbol', '1.0-0')
    //       },{emitEvent:false})
    //     }
    // })
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  ngOnInit(): void {

    // const xmlStr = '<a id="a"><b id="b">hey!</b></a>';
    // const parser = new DOMParser();
    // const dom = parser.parseFromString(xmlStr, "application/xml");
    // print the name of the root element or error message
    // console.log(dom.documentElement.getElementsByTagName("b")[0].childNodes[0].nodeValue);

    // this.http.get('https://dummy.restapiexample.com/api/v1/employees').subscribe((data:any) => {
    //   this.data = data.data;
    //   this.dtTrigger.next();
    // })

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      language: {
        url:'//cdn.datatables.net/plug-ins/1.10.25/i18n/Spanish.json'
      }
    };
    this.createProcessForm = this.fb.group({
      tipoProceso: ['Seleccione...', Validators.required],
      tipoIdentificacion: ['Seleccione...', Validators.required],
      identificacion: [{value: '', disabled: true}, Validators.required],
      proveedor: [{value: '', disabled: true}, Validators.required],
      objeto: [{value: '', disabled: false}, Validators.required],
      valorcontrato: [{value: '', disabled: false}, Validators.required],
      escolaridad: [
        {value: 'Seleccione...', disabled: false},
        Validators.required,
      ],
      profesion: [
        {value: 'Seleccione...', disabled: true},
        Validators.required,
      ],
    });
    this.secopService.getDataProcess(100, 1).subscribe((data) => {
      this.info_process = data;
      this.infoProcess();
      // this.dtTrigger.next();
    });
    this.secopService.sendGetDataSecop().subscribe((data) => {
      this.result = data;
      console.log(data);
      // this.dtTrigger.next();
    });
    this.departmentsCont();
    this.getUserData();
    this.fillEntidad();
  }

  setIdioma() {
    if (this.idioma === 'en') {
      this.idioma = 'es';
    } else {
      this.idioma = 'en';
    }
    this.store.dispatch(cargarIdioma({idioma: this.idioma}));
  }

  infoProcess(): void {
    if (this.info_process.Status === 'Ok') {
      this.info_process = this.info_process.Values[0];
      console.log(this.info_process);
    } else {
      alert('Error de información');
    }
  }

  formSearchSecop(): void {
    this.secopSearch = new FormGroup({
      COLUMN: new FormControl(null, [Validators.required]),
      PARAM: new FormControl(null, [Validators.required]),
    });
  }

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

  departmentsCont(): void {
    let token = localStorage.getItem('token');
    // console.log('tkn init ', token);
    this.secopService.getDepartmentsCont(token).subscribe((data) => {
      this.departments = data;
      this.departments = this.departments.Values;
    });
  }

  getUserData() {
    let token = localStorage.getItem('token');
    let username = localStorage.getItem('username');
    this.authService.getDept(token, username).subscribe((data) => {
      // console.log(data);
    });
  }

  fillEntidad() {
    // this.camposEntidad.push(localStorage.getItem('tipoEntidad')!);
    this.camposEntidad.push(localStorage.getItem('entidad')!);
    /*let equipo = JSON.parse(localStorage.getItem('equipo')!);
    let resultArray = Object.keys(equipo).map((data) => {
      let person = equipo[data];
      return person;
    });
    this.camposEntidad.push(resultArray);*/
    this.camposEntidad.push(localStorage.getItem('unidadContratacion')!);
    console.log(this.camposEntidad);
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
            this.camposSecop = [];
            this.camposSecop.push(this.userDataFromSecop[0].nombre);
            this.camposSecop.push(this.userDataFromSecop[0].ubicacion);
          } else {
            utils.showAlert("El N° de identificacion no se encontro!", "error");
            this.camposSecop = [];
            return;
          }
        });
    }
  }

  changeTipoIdentificacion(data: any) {
    console.log(this.validadorTipoIdentidad);
    if (data.value === 'Seleccione...') {
      this.createProcessForm.controls['identificacion'].disable();
      this.createProcessForm.controls['identificacion'].reset();
      return;
    }
    this.createProcessForm.controls['identificacion'].enable();
  }

  getCdpMount() {
    if (
      this.createProcessForm.controls['valorcontrato'].value != null &&
      this.createProcessForm.controls['valorcontrato'].value != '' &&
      this.createProcessForm.controls['valorcontrato'].value >= 1
    ) {
      // alert(this.createProcessForm.controls['valorcontrato'].value);
      // this.store.dispatch(cargarSap({data:'jojo'}));
      // this.transformAmount(this.createProcessForm.controls['valorcontrato'].value)
      alert("jojojo")
      console.log(this.createProcessForm.controls['valorcontrato'].value);

      Swal.fire({
        title: 'Ingrese el número de CDP',
        input: 'text',
        // inputLabel: 'Ingrese el # de CDP',
        // inputValue: "inputValue",
        // showCancelButton: true,

        confirmButtonColor: '#007BFF',
        confirmButtonText: 'Confirmar',
        showCloseButton: true,
        inputAttributes: {maxLength: '10'},
        inputValidator: (value) => {
          return new Promise((resolve: any) => {
            if (value.length == 10) {
              resolve();
              this.sapService.getCdp().subscribe((data) => {
                let jsonString = JSON.stringify(Object.assign({}, data));
                let datoVerificado = JSON.parse(jsonString)[0].cdp[value];
                if (datoVerificado !== null && datoVerificado !== undefined) {

                  if (this.createProcessForm.controls['valorcontrato'].value > datoVerificado.monto) {
                    utils.showAlert('El valor del contrato excede el monto del CDP!', 'error');
                  } else {
                    alert('buenardo')
                  }
                } else {
                  utils.showAlert('El número de CDP no existe!', 'error');
                }
                // let datoVerificado = JSON.parse(jsonString)[0].cdp[value].monto;
              });
              // this.store.dispatch(cargarSap({data:value}))
            } else {
              resolve('Por favor ingrese 10 digitos!');
            }
          });
        },
      });
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

}
