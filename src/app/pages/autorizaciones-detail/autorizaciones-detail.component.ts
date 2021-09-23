import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {SecopService} from "../../services/secop/secop.service";
import {PdfService} from "../../services/pdf/pdf.service";
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
// pdfMake.vfs = pdfFonts.pdfMake.vfs;
import * as utils from "../../utils/functions";
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-autorizaciones-detail',
  templateUrl: './autorizaciones-detail.component.html',
  styleUrls: ['./autorizaciones-detail.component.css']
})
export class AutorizacionesDetailComponent implements OnInit {
  public status_hist_res: any;
  public res_hist_pro: any;
  myParam!: string;
  numeroProceso!: string;
  username!: string;
  nombre!: string;
  valor!: string;
  duracion!: string;
  tipoContrato!: string;
  estado!: string;
  created!: string;
  response!: any;
  ROL: any = atob(localStorage.getItem('rol')!);
  REFERENCIAS:any;
  ASOCIACION:any;
  prueba:boolean=false;
  tablaForm!: FormGroup;


  constructor(private route: ActivatedRoute, private secopService: SecopService,private fb: FormBuilder,) {
  }

  ngOnInit(): void {
    this.getAutorizacionesXProceso();
    this.getReferencias();
    this.getAsociacion();
    this.tablaForm = this.fb.group({
      referencia: new FormControl({value: null, disabled: false}, [Validators.required]),
      asociacion: new FormControl({value: null, disabled: false}, [Validators.required])
    });
  }

  checkHistoryAuth() {

  }

  printAction(something: any) {
  }

  getAutorizacionesXProceso() {
    this.route.params.subscribe((params: Params) => {
      this.myParam = params['id'];
      // console.log(this.myParam)
      let username = atob(localStorage.getItem('username')!);
      this.secopService.getAutorizacionesXProceso(this.myParam).subscribe((response: any) => {
        // console.log(response);
        this.response = response.Values.ResultFields;
      })
    });
  }

  getReferencias(){
    if(this.ROL == 41){
      this.secopService.getReferencias().subscribe((response:any)=>{
        console.log(response);
        this.REFERENCIAS = response.Values.ResultFields;
      })
    }
  }

  getAsociacion(){
    if(this.ROL == 41){
      this.secopService.getAsociacion().subscribe((response:any)=>{
        console.log(response);
        this.ASOCIACION = response.Values.ResultFields;
      })
    }
  }

  generatePdf() {
    let R1 = this.response[0];
    let R2;
    let estado2;
    if(this.response.length >1){
      R2 = this.response[1];
      console.log(R2);
      estado2 = (R2.AUTORIZACION_ESTADO != 0) ? 'autorizó' : 'rechazó';
    }

    let estado1 = (R1.AUTORIZACION_ESTADO != 0) ? 'autorizó' : 'rechazó';

    let entidad = atob(localStorage.getItem('entidad')!);
    if (this.response.length == 2) {
      let docDefinition = {
        watermark: { text: 'LegalBase', color: 'blue', opacity: 0.1, bold: true, italics: false },
        content: [
          {text: 'Historial de autorizaciones', style: 'header'},
          {qr: 'proceso # '+R1.CONS_PROCESO+'\n entidad: '+entidad},
          {text: R1.CREATED, style: 'date'},
          {text: 'El usuario ' + R1.USR_LOGIN.toString().toUpperCase() + ' correspondiente a ' + R1.NOMBRE_USUARIO},
          {text: estado1 + ' el proceso número ' + R1.CONS_PROCESO},
          {text: ' relacionado a la ' + R1.TIPO_CONTRATO + 'con plazo ' + R1.TIEMPO_DURACION_CONTRATO + ' ' + R1.DURACION_CONTRATO + ' y valor $' + R1.VAL_OFERTA},
          {text: ' Correspondiente a la política ' + R1.TIPO_PROCESO + '', style: 'final'},

          {text: ''},
          {text: R2.CREATED, style: 'date'},
          {text: 'El usuario ' + R2.USR_LOGIN.toString().toUpperCase() + ' correspondiente a ' + R2.NOMBRE_USUARIO},
          {text: estado2 + ' el proceso número ' + R2.CONS_PROCESO},
          {text: ' relacionado a la ' + R2.TIPO_CONTRATO + 'con plazo ' + R2.TIEMPO_DURACION_CONTRATO + ' ' + R2.DURACION_CONTRATO + ' y valor $' + R2.VAL_OFERTA},
          {text: ' Correspondiente a la política ' + R2.TIPO_PROCESO + '', style: 'final'},
        ],
        footer: {

          columns: [
            { text: '' },
            // {snow: 'https://helppeoplecloud.com/wp-content/uploads/2020/12/cropped-Logo-para-menu-2.png'},
            { text: 'helppeople cloud',link: 'https://helppeoplecloud.com/sitio/',style:'marca' }
          ]
        },
        styles: {
          header: {
            fontSize: 26,
            bold: true,
            color: '#545cd8',
            marginBottom: 20
          },
          date: {
            fontSize: 16,
            bold: true,
            color: '#000000',
            marginTop: 20,
            marginBottom: 10
          },
          marca:{
            italics:true,
            fontSize:16,
            color: '#545cd8'
          }
        }
      };
      // pdfMake.createPdf(docDefinition).open();
      pdfMake.createPdf(docDefinition).download('AUTORIZACION_'+R1.CONS_PROCESO+'.pdf');
    } else {
      let docDefinition = {
        watermark: { text: 'LegalBase', color: 'blue', opacity: 0.1, bold: true, italics: false },
        content: [
          {text: 'Historial de autorizaciones', style: 'header'},
          {qr: 'proceso # '+R1.CONS_PROCESO+'\n entidad: '+entidad},
          {text: R1.CREATED, style: 'date'},
          {text: 'El usuario ' + R1.USR_LOGIN.toString().toUpperCase() + ' correspondiente a ' + R1.NOMBRE_USUARIO},
          {text: estado1 + ' el proceso número ' + R1.CONS_PROCESO},
          {text: ' relacionado a la ' + R1.TIPO_CONTRATO + 'con plazo ' + R1.TIEMPO_DURACION_CONTRATO + ' ' + R1.DURACION_CONTRATO + ' y valor $' + R1.VAL_OFERTA},
          {text: ' Correspondiente a la política ' + R1.TIPO_PROCESO + '', style: 'final'},
        ],
        footer: {

          columns: [
            { text: '' },
            // {snow: 'https://helppeoplecloud.com/wp-content/uploads/2020/12/cropped-Logo-para-menu-2.png'},
            { text: 'helppeople cloud',link: 'https://helppeoplecloud.com/sitio/',style:'marca' }
          ]
        },
        styles: {
          header: {
            fontSize: 24,
            bold: true,
            color: '#545cd8'
          },
          date: {
            fontSize: 16,
            bold: true,
            color: '#000000',
            marginTop: 20,
            marginBottom: 10
          }
        }
      };
      pdfMake.createPdf(docDefinition).download('AUTORIZACION_'+R1.CONS_PROCESO+'.pdf');
    }

    // pdfMake.createPdf(docDefinition).open();
    //   const documentDefinition = { content: 'This is an sample PDF printed with pdfMake' };
    //   this.pdfmake.createPdf(documentDefinition).open();
  }

  updateTabla(){
    let referencia = this.tablaForm.controls['referencia'].value;
    let asociacion = this.tablaForm.controls['asociacion'].value;
    let username = atob(localStorage.getItem('username')!);
    if(referencia == null || referencia == 'Referencia'){
      utils.showAlert('Por favor seleccione una referencia!','error');
      return;
    }
    if(asociacion == null || asociacion == 'Asociación'){
      utils.showAlert('Por favor seleccione una asociación!','error');
      return;
    }
    // alert(referencia+'---'+asociacion+'---'+this.myParam);
    this.secopService.updateTabla(referencia,asociacion,this.myParam,username).subscribe((response:any)=>{
      console.log(response)
      if(response.Status == 'Ok'){
        utils.showAlert('Proceso actualizado correctamente!','success');
      }
    })
  }
}
