import {CurrencyPipe} from '@angular/common';
import {Component, OnDestroy, OnInit} from '@angular/core';
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
import * as $ from 'jquery';
import 'datatables.net';
import 'datatables.net-bs4';


@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
})
export class LayoutComponent implements OnDestroy, OnInit {

ngOnDestroy(): void {
  }
//
  ngOnInit(): void {


  }
//   private idioma!: string;
//   createProcessForm!: FormGroup;
//   departments: any = [];
//   info_process: any = [];
//   page: number = 0;
//   result: any = [];
//   secopSearch: any = [];
//   userDataFromSecop: any = [];
//   camposEntidad: any[] = [];
//   camposSecop: any[] = [];
//   validadorTipoIdentidad: boolean = true;
//   CodigoUNSPSC: string = '49101601'
//   dtOptions: DataTables.Settings = {};
//   data:any;
//
//   // We use this trigger because fetching the list of persons can be quite long,
//   // thus we ensure the data is fetched before rendering
//   dtTrigger: Subject<any> = new Subject<any>();
//
//   constructor(
//     private fb: FormBuilder,
//     private secopService: SecopService,
//     private sapService: SapService,
//     private authService: AuthService,
//     private translate: TranslateService,
//     private store: Store<AppState>,
//     private http: HttpClient
//   ) {
//     this.store.select('idioma').subscribe(({idioma}) => {
//       this.idioma = idioma;
//       this.translate.use(idioma);
//     });
//
//
//     // this.createProcessForm.valueChanges.subscribe(form => {
//     //     if(form.valorcontrato){
//     //       this.createProcessForm.patchValue({
//     //         valorcontrato: this.currency.transform(form.valorcontrato.replace(/\D/g, '').replace(/^0+/, ''), 'USD', 'symbol', '1.0-0')
//     //       },{emitEvent:false})
//     //     }
//     // })
//   }
//
//
//
//   setIdioma() {
//     if (this.idioma === 'en') {
//       this.idioma = 'es';
//     } else {
//       this.idioma = 'en';
//     }
//     this.store.dispatch(cargarIdioma({idioma: this.idioma}));
//   }
//
//   infoProcess(): void {
//     if (this.info_process.Status === 'Ok') {
//       this.info_process = this.info_process.Values[0];
//       console.log(this.info_process);
//     } else {
//       alert('Error de información');
//     }
//   }
//
//   formSearchSecop(): void {
//     this.secopSearch = new FormGroup({
//       COLUMN: new FormControl(null, [Validators.required]),
//       PARAM: new FormControl(null, [Validators.required]),
//     });
//   }
//
//   // searchSecop(): void {
//   //   if (this.secopSearch.valid) {
//   //     var column = this.secopSearch.value.COLUMN;
//   //     var param = this.secopSearch.value.PARAM;
//
//   //     this.secopService.searchDataSecop(column, param).subscribe((data) => {
//   //       // console.log(data);
//   //       this.result = data;
//   //     });
//   //   }
//   // }
//
//   departmentsCont(): void {
//     let token = localStorage.getItem('token');
//     // console.log('tkn init ', token);
//     this.secopService.getDepartmentsCont(token).subscribe((data) => {
//       this.departments = data;
//       this.departments = this.departments.Values;
//     });
//   }
//
//   getUserData() {
//     let token = localStorage.getItem('token');
//     let username = localStorage.getItem('username');
//     this.authService.getDept(token, username).subscribe((data) => {
//       // console.log(data);
//     });
//   }
//
//   fillEntidad() {
//     // this.camposEntidad.push(localStorage.getItem('tipoEntidad')!);
//     this.camposEntidad.push(localStorage.getItem('entidad')!);
//     /*let equipo = JSON.parse(localStorage.getItem('equipo')!);
//     let resultArray = Object.keys(equipo).map((data) => {
//       let person = equipo[data];
//       return person;
//     });
//     this.camposEntidad.push(resultArray);*/
//     this.camposEntidad.push(localStorage.getItem('unidadContratacion')!);
//     console.log(this.camposEntidad);
//   }
//
//   onKeydownEvent(event: HTMLInputElement): void {
//     let search_item = event.value.length;
//     let search_value = event.value;
//     // console.log(search_value);
//
//     if (search_item > 4) {
//       this.secopService
//         // .searchDataSecop('nit','tipo_empresa',tipoIdValue, search_value)
//         .searchDataSecop('nit', search_value)
//         .subscribe((data) => {
//           this.userDataFromSecop = data;
//           if (this.userDataFromSecop.length > 0) {
//             this.camposSecop = [];
//             this.camposSecop.push(this.userDataFromSecop[0].nombre);
//             this.camposSecop.push(this.userDataFromSecop[0].ubicacion);
//           } else {
//             utils.showAlert("El N° de identificacion no se encontro!", "error");
//             this.camposSecop = [];
//             return;
//           }
//         });
//     }
//   }
//
//   changeTipoIdentificacion(data: any) {
//     console.log(this.validadorTipoIdentidad);
//     if (data.value === 'Seleccione...') {
//       this.createProcessForm.controls['identificacion'].disable();
//       this.createProcessForm.controls['identificacion'].reset();
//       return;
//     }
//     this.createProcessForm.controls['identificacion'].enable();
//   }
//
//   getCdpMount() {
//     if (
//       this.createProcessForm.controls['valorcontrato'].value != null &&
//       this.createProcessForm.controls['valorcontrato'].value != '' &&
//       this.createProcessForm.controls['valorcontrato'].value >= 1
//     ) {
//       // alert(this.createProcessForm.controls['valorcontrato'].value);
//       // this.store.dispatch(cargarSap({data:'jojo'}));
//       // this.transformAmount(this.createProcessForm.controls['valorcontrato'].value)
//       alert("jojojo")
//       console.log(this.createProcessForm.controls['valorcontrato'].value);
//
//       Swal.fire({
//         title: 'Ingrese el número de CDP',
//         input: 'text',
//         // inputLabel: 'Ingrese el # de CDP',
//         // inputValue: "inputValue",
//         // showCancelButton: true,
//
//         confirmButtonColor: '#007BFF',
//         confirmButtonText: 'Confirmar',
//         showCloseButton: true,
//         inputAttributes: {maxLength: '10'},
//         inputValidator: (value) => {
//           return new Promise((resolve: any) => {
//             if (value.length == 10) {
//               resolve();
//               this.sapService.getCdp().subscribe((data) => {
//                 let jsonString = JSON.stringify(Object.assign({}, data));
//                 let datoVerificado = JSON.parse(jsonString)[0].cdp[value];
//                 if (datoVerificado !== null && datoVerificado !== undefined) {
//
//                   if (this.createProcessForm.controls['valorcontrato'].value > datoVerificado.monto) {
//                     utils.showAlert('El valor del contrato excede el monto del CDP!', 'error');
//                   } else {
//                     alert('buenardo')
//                   }
//                 } else {
//                   utils.showAlert('El número de CDP no existe!', 'error');
//                 }
//                 // let datoVerificado = JSON.parse(jsonString)[0].cdp[value].monto;
//               });
//               // this.store.dispatch(cargarSap({data:value}))
//             } else {
//               resolve('Por favor ingrese 10 digitos!');
//             }
//           });
//         },
//       });
//     }
//   }
//
//   changeEscolaridad() {
//     if (
//       this.createProcessForm.controls['escolaridad'].value !== 'Selecione...'
//     ) {
//       alert(this.createProcessForm.controls['escolaridad'].value);
//       this.createProcessForm.controls['profesion'].enable();
//     } else {
//       this.createProcessForm.controls['profesion'].disable();
//     }
//   }

}
