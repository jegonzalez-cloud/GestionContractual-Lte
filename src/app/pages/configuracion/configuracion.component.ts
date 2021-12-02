import { Component, OnInit, ViewChild } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {SecopService} from "../../services/secop/secop.service";
import * as utils from "../../utils/functions";
import {AuthService} from 'src/app/services/auth/auth.service';
import {Router} from '@angular/router';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import { ServicesService } from 'src/app/services/services.service';

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.component.html',
  styleUrls: ['./configuracion.component.css']
})
export class ConfiguracionComponent implements OnInit {
  configForm!: FormGroup;
  keyword = 'name';
  registerRol!: FormGroup;
  registerEntity!: FormGroup;
  registerHiringTeams!: FormGroup;
  registerHiringUnit!: FormGroup;
  roles!: any;
  users!: any;
  entitys!: any;
  selectEntitys!: any[];
  show: boolean = false;
  indRegister:number = 0;
  titleModal:string = "";
  UsersConnection!: any[];
  tiposProceso: any;
  hiringTeams!: any[];
  hiringUnit!: any[];

  public dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  displayedColumns: string[] = ['Id','Usuario','Contraseña','CodigoEntidad','NombreEntidad','Gestor','Acciones'];
  
  public dataConnection!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginatorConnection!: MatPaginator;
  @ViewChild(MatSort) sortConnection!: MatSort;
  displayedColumnsConnection: string[] = ['Usuario','Entidad','Rol','Acciones'];

  public dataHiringTeams!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginatorHiringTeams!: MatPaginator;
  @ViewChild(MatSort) sortHiringTeams!: MatSort;
  displayedColumnsHiringTeams: string[] = ['Nombre EQ','Id Integración EQ','Nombre Tipo Proceso','Estado','Acciones'];

  public dataHiringUnit!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginatorHiringUnit!: MatPaginator;
  @ViewChild(MatSort) sortHiringUnit!: MatSort;
  displayedColumnsHiringUnit: string[] = ['USC_COD','UNI_NUMERO_PROCESO','UNI_NOMBRE_PROCESO','Acciones'];


  constructor(private fb: FormBuilder,private secopService:SecopService,private authService: AuthService,private router: Router,private service: ServicesService,) { }

  ngOnInit(): void {
    this.createForm();
    this.getInformation();
  }

  getInformation(){
    this.getRolxId();
    this.GetUsersLB();
    this.GetUsersConnect();
    this.getTiposProceso();
    this.GetUsersConnection(0);
    this.GetHiringTeams(0); 
    this.GetHiringUnit(0);
  }

  createForm() {
    this.configForm = this.fb.group({
      token: new FormControl(localStorage.getItem('token')!),
      color: new FormControl(atob(localStorage.getItem( 'color')!)),
      cdp: new FormControl(atob(localStorage.getItem('linkCdp')!)),
      pagos: new FormControl(atob(localStorage.getItem('linkPagos')!)),
      consultarProceso: new FormControl(atob(localStorage.getItem('linkProceso')!)),
      estadoContrato: new FormControl(atob(localStorage.getItem('estadoProceso')!)),
      identificacionSecop: new FormControl(atob(localStorage.getItem('identificacionSecop')!)),
      dataSecop: new FormControl(atob(localStorage.getItem('dataSecop')!)),
      salarioMinimo: new FormControl(atob(localStorage.getItem('salarioMinimo')!)),
      topeMaximo: new FormControl(atob(localStorage.getItem('topeMaximo')!)),
      cantidadSalarios: new FormControl(atob(localStorage.getItem('cantidadSalarios')!)),
    });

    this.registerRol = this.fb.group({
      usr_login: new FormControl('',[Validators.required]),
      usc_cod: new FormControl('',[Validators.required]),
      rol_id: new FormControl('',[Validators.required])
    });

    this.registerEntity = this.fb.group({
      usc_cod: new FormControl(''),
      usc_usuario: new FormControl('',[Validators.required]),
      usc_password: new FormControl('',[Validators.required]),
      usc_codigo_entidad: new FormControl('',[Validators.required]),
      usc_nombre_entidad: new FormControl('',[Validators.required]),
      usc_gestor: new FormControl('',[Validators.required])
    });

    this.registerHiringTeams = this.fb.group({
      eqc_cod: new FormControl(''),
      tpp_cod: new FormControl('',[Validators.required]),
      eqc_nombre: new FormControl('',[Validators.required]),
      eqc_estado: new FormControl('',[Validators.required]),
      eqc_id_integracion: new FormControl('',[Validators.required])
    });

    this.registerHiringUnit = this.fb.group({
      uni_cod: new FormControl(''),
      usc_cod: new FormControl('',[Validators.required]),
      uni_numero_proceso: new FormControl('',[Validators.required]),
      uni_nombre_proceso: new FormControl('',[Validators.required])
    });

    
    console.log(this.configForm.controls['color'].value);
  }

  saveColor(){
    let color = this.configForm.controls['color'].value;
    localStorage.setItem('color',btoa(color));
    let r:any = document.querySelector(':root');
    r.style.setProperty('--companyColor', color);
    let dataForm = Object.assign(this.configForm.value);
    this.secopService.updateConfigApp(dataForm).subscribe((response:any)=>{
      if(response.Values.ResultFields == 'Ok'){
        utils.showAlert('Configuración actualizada','success');
      }
      else{
        utils.showAlert('No se pudo actualizar la configuración','error');
      }
    });
  }

  getTiposProceso() {
    this.service.getTipoProceso().subscribe((data: any) => {
      this.tiposProceso = data.Values.ResultFields;
    })
  }

  getRolxId(){
    
    this.authService.getRolxId(atob(localStorage.getItem('token')!),20)
      .subscribe((data: any) => {
        this.roles = data.Values;
      }, (error) => utils.showAlert('Credenciales Incorrectas!', 'error'))
  }

  GetUsersLB(){
    
    this.authService.GetUsersLB(atob(localStorage.getItem('token')!))
      .subscribe((data: any) => {
        this.users = data.Values;
      }, (error) => utils.showAlert('Credenciales Incorrectas!', 'error'))
  }

  GetUsersConnect(){
    var jsonRetur:any = [];
    this.authService.GetUsersConnect(atob(localStorage.getItem('token')!))
      .subscribe((data: any) => {
        this.entitys = data.Values.ResultFields;
        let resultEntitys = data.Values.ResultFields;
        resultEntitys.forEach((value:any)=> {
          jsonRetur.push( 
            {
                "id":  value.USC_COD,
                "name":  value.USC_NOMBRE_ENTIDAD,
            }
          );
        });

        this.selectEntitys = jsonRetur;

        this.infoProcess();
      }, (error) => utils.showAlert('Credenciales Incorrectas!', 'error'))
  }

  GetUsersConnection(idUser:number){
    
    this.authService.GetUsersConnection(atob(localStorage.getItem('token')!),idUser)
      .subscribe((data: any) => {
        this.UsersConnection = data.Values.ResultFields;

        this.infoProcessConnection();
      }, (error) => utils.showAlert('Credenciales Incorrectas!', 'error'))
  }

  GetHiringTeams(eqcCod:number){
    
    this.authService.GetHiringTeams(atob(localStorage.getItem('token')!),eqcCod)
      .subscribe((data: any) => {
        this.hiringTeams = data.Values.ResultFields;

        this.infoProcessHiringTeams();
      }, (error) => utils.showAlert('Credenciales Incorrectas!', 'error'))
  }

  GetHiringUnit(usc_cod:number){
    
    this.authService.GetHiringUnit(atob(localStorage.getItem('token')!),usc_cod)
      .subscribe((data: any) => {
        this.hiringUnit = data.Values.ResultFields;

        this.infoProcessHiringUnit();
      }, (error) => utils.showAlert('Credenciales Incorrectas!', 'error'))
  }

  registerUserRol(){
    this.show = true;
    let json = {
      TOKEN: atob(localStorage.getItem('token')!),
      USR_LOGIN: this.registerRol.controls['usr_login'].value.id,
      USC_COD: this.registerRol.controls['usc_cod'].value.id,
      ROL_ID: this.registerRol.controls['rol_id'].value.id
    };
    this.authService.insertUserRol(json)
      .subscribe((data: any) => {
        utils.showAlert('Se Asigno Correctamente El Rol Al Usuario', 'success')
        this.show = false;
        //quitar
        window.location.reload(); 
      }, (error) =>{
        utils.showAlert('Credenciales Incorrectas!', 'error')
        this.show = false;
      });
  }

  onRegisterEntity(ind:number){
    this.indRegister = ind;
    if(this.indRegister != 0){
      this.titleModal = "Actualización de entidad";
      this.authService.getUserConectxId(atob(localStorage.getItem('token')!),this.indRegister)
      .subscribe((data: any) => {
        let result = data.Values.ResultFields;
        this.registerEntity.controls['usc_usuario'].setValue(result[0].USC_USUARIO);
        this.registerEntity.controls['usc_cod'].setValue(result[0].USC_COD);
        this.registerEntity.controls['usc_password'].setValue(result[0].USC_PASSWORD);
        this.registerEntity.controls['usc_codigo_entidad'].setValue(result[0].USC_CODIGO_ENTIDAD);
        this.registerEntity.controls['usc_nombre_entidad'].setValue(result[0].USC_NOMBRE_ENTIDAD);
        this.registerEntity.controls['usc_gestor'].setValue(result[0].USC_GESTOR);

      }, (error) => utils.showAlert('Credenciales Incorrectas!', 'error'))

    }else{
      this.titleModal = "Registro de entidad",
      this.registerEntity.reset();
    }

  }

  sendRegisterEntity(){
    this.show = true;
    let json = {
      TOKEN: atob(localStorage.getItem('token')!),
      USC_COD: this.registerEntity.controls['usc_cod'].value,
      USC_USUARIO: this.registerEntity.controls['usc_usuario'].value,
      USC_PASSWORD: this.registerEntity.controls['usc_password'].value,
      USC_CODIGO_ENTIDAD: this.registerEntity.controls['usc_codigo_entidad'].value,
      USC_NOMBRE_ENTIDAD: this.registerEntity.controls['usc_nombre_entidad'].value,
      USC_GESTOR: this.registerEntity.controls['usc_gestor'].value,
    };

    //ind => bandera para identificar si se va a registrar o actualizar
    if(this.indRegister != 0){
      //actualiza
      this.authService.updateUserConnect(json)
        .subscribe((data: any) => {
          this.show = false;
          utils.showAlert('Entidad Actualizada Correctamente!', 'success')
          this.getInformation();
        }, (error) =>{
          this.show = false;
          utils.showAlert('Credenciales Incorrectas!', 'error')
      });
    }else{
      //registra
      this.authService.insertUserConnect(json)
        .subscribe((data: any) => {
          this.show = false;
          utils.showAlert('Entidad Creada Correctamente!', 'success')
          this.getInformation();
        }, (error) =>{
          this.show = false;
          utils.showAlert('Credenciales Incorrectas!', 'error')
      });
    }
  }

  onRegisterHiringTeams(ind:number){
    this.indRegister = ind;
    this.show = true;
    if(this.indRegister != 0){
      this.titleModal = "Actualización Equipo Contratación";
      this.authService.GetHiringTeams(atob(localStorage.getItem('token')!),this.indRegister)
      .subscribe((data: any) => {
        let result = data.Values.ResultFields;
        let valTpp_cod =  this.tiposProceso.find((item: { TPP_COD: any; }) => item.TPP_COD == result[0].TPP_COD);
        this.registerHiringTeams.controls['eqc_cod'].setValue(result[0].EQC_COD);
        this.registerHiringTeams.controls['tpp_cod'].setValue(valTpp_cod.TPP_COD);
        this.registerHiringTeams.controls['eqc_nombre'].setValue(result[0].EQC_NOMBRE);
        this.registerHiringTeams.controls['eqc_id_integracion'].setValue(result[0].EQC_ID_INTEGRACION);
        this.registerHiringTeams.controls['eqc_estado'].setValue(result[0].EQC_ESTADO);
        this.show = false;
      }, (error) => {
        utils.showAlert('Credenciales Incorrectas!', 'error')
        this.show = false;
      });

    }else{
      this.titleModal = "Registro Equipo Contratación",
      this.registerHiringTeams.reset();
      this.registerHiringTeams.controls['eqc_estado'].setValue(1);
      this.show = false;
    }

  }

  sendRegisterHiringTeams(){
    this.show = true;
    let json = {
      TOKEN: atob(localStorage.getItem('token')!),
      EQC_COD: this.registerHiringTeams.controls['eqc_cod'].value,
      TPP_COD: this.registerHiringTeams.controls['tpp_cod'].value,
      EQC_NOMBRE: this.registerHiringTeams.controls['eqc_nombre'].value,
      EQC_ESTADO: this.registerHiringTeams.controls['eqc_estado'].value,
      EQC_ID_INTEGRACION: this.registerHiringTeams.controls['eqc_id_integracion'].value,
    };

    //ind => bandera para identificar si se va a registrar o actualizar
    if(this.indRegister != 0){
      //actualiza
      this.authService.updateHiringTeams(json)
        .subscribe((data: any) => {
          this.show = false;
          utils.showAlert('Equipo Contratación Actualizada Correctamente!', 'success')
          this.getInformation();
        }, (error) =>{
          this.show = false;
          utils.showAlert('Credenciales Incorrectas!', 'error')
      });
    }else{
      //registra
      this.authService.insertHiringTeams(json)
        .subscribe((data: any) => {
          this.show = false;
          utils.showAlert('Equipo Contratación Creada Correctamente!', 'success')
          this.getInformation();
        }, (error) =>{
          this.show = false;
          utils.showAlert('Credenciales Incorrectas!', 'error')
      });
    }
  }

  onRegisterHiringUnit(ind:number){
    this.indRegister = ind;
    if(this.indRegister != 0){
      this.titleModal = "Actualización Unidad De Contratación";
      this.authService.GetHiringUnit(atob(localStorage.getItem('token')!),this.indRegister)
      .subscribe((data: any) => {
        let result = data.Values.ResultFields;
        console.log(result)
        console.log(this.indRegister)
        let valUscCod = this.selectEntitys.find(x => x.id == result[0].USC_COD);
        this.registerHiringUnit.controls['usc_cod'].setValue(valUscCod);
        this.registerHiringUnit.controls['uni_cod'].setValue(result[0].UNI_COD);
        this.registerHiringUnit.controls['uni_numero_proceso'].setValue(result[0].UNI_NUMERO_PROCESO);
        this.registerHiringUnit.controls['uni_nombre_proceso'].setValue(result[0].UNI_NOMBRE_PROCESO);

      }, (error) => utils.showAlert('Credenciales Incorrectas!', 'error'))

    }else{
      this.titleModal = "Registro Unidad De Contratación",
      this.registerHiringUnit.reset();
    }

  }

  sendRegisterHiringUnit(){
    this.show = true;
    let json = {
      TOKEN: atob(localStorage.getItem('token')!),
      UNI_COD: this.registerHiringUnit.controls['uni_cod'].value,
      USC_COD: this.registerHiringUnit.controls['usc_cod'].value.id,
      UNI_NUMERO_PROCESO: this.registerHiringUnit.controls['uni_numero_proceso'].value,
      UNI_NOMBRE_PROCESO: this.registerHiringUnit.controls['uni_nombre_proceso'].value
    };

    //ind => bandera para identificar si se va a registrar o actualizar
    if(this.indRegister != 0){
      //actualiza
      this.authService.updateHiringUnit(json)
        .subscribe((data: any) => {
          this.show = false;
          utils.showAlert('Unidad De Contratación Actualizada Correctamente!', 'success')
          this.getInformation();
        }, (error) =>{
          this.show = false;
          utils.showAlert('Credenciales Incorrectas!', 'error')
      });
    }else{
      //registra
      this.authService.insertHiringUnit(json)
        .subscribe((data: any) => {
          this.show = false;
          utils.showAlert('Unidad De Contratación Creada Correctamente!', 'success')
          this.getInformation();
        }, (error) =>{
          this.show = false;
          utils.showAlert('Credenciales Incorrectas!', 'error')
      });
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  infoProcess(): void {
    if (this.entitys.length > 0) {
      this.dataSource = new MatTableDataSource(this.entitys!);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    } else {
      utils.showAlert('Error de información', 'error');
    }
  }

  applyFilterConnection(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataConnection.filter = filterValue.trim().toLowerCase();

    if (this.dataConnection.paginator) {
      this.dataConnection.paginator.firstPage();
    }
  }

  infoProcessConnection(): void {
    if (this.UsersConnection.length > 0) {
      this.dataConnection = new MatTableDataSource(this.UsersConnection!);
      this.dataConnection.paginator = this.paginatorConnection;
      this.dataConnection.sort = this.sortConnection;
    } else {
      utils.showAlert('Error de información', 'error');
    }
  }

  applyFilterHiringTeams(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataHiringTeams.filter = filterValue.trim().toLowerCase();

    if (this.dataHiringTeams.paginator) {
      this.dataHiringTeams.paginator.firstPage();
    }
  }

  infoProcessHiringTeams(): void {
    if (this.hiringTeams.length > 0) {
      this.dataHiringTeams = new MatTableDataSource(this.hiringTeams!);
      this.dataHiringTeams.paginator = this.paginatorConnection;
      this.dataHiringTeams.sort = this.sortConnection;
    } else {
      utils.showAlert('Error de información', 'error');
    }
  }

  applyFilterHiringUnit(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataHiringUnit.filter = filterValue.trim().toLowerCase();

    if (this.dataHiringUnit.paginator) {
      this.dataHiringUnit.paginator.firstPage();
    }
  }

  infoProcessHiringUnit(): void {
    if (this.hiringUnit.length > 0) {
      this.dataHiringUnit = new MatTableDataSource(this.hiringUnit!);
      this.dataHiringUnit.paginator = this.paginatorHiringUnit;
      this.dataHiringUnit.sort = this.sortHiringUnit;
    } else {
      utils.showAlert('Error de información', 'error');
    }
  }

  onRegisterConnection(ind:number){
    this.show = true;
    this.indRegister = ind;
    if(this.indRegister != 0){
      this.titleModal = "Actualización de rol a un usuario",
      this.authService.GetUsersConnection(atob(localStorage.getItem('token')!),this.indRegister)
      .subscribe((data: any) => {
        let result = data.Values.ResultFields;
        
        let valUscCod = this.selectEntitys.find(x => x.id == result[0].USC_COD);
        let valRolId =  this.roles.find((item: { id: any; }) => item.id == result[0].ROL_ID);
        
        this.registerRol.controls['usr_login'].setValue(result[0].USR_LOGIN);
        this.registerRol.controls['usc_cod'].setValue(valUscCod);
        this.registerRol.controls['rol_id'].setValue(valRolId);
        this.show = false;
      }, (error) => utils.showAlert('Credenciales Incorrectas!', 'error'))
      
    }else{
      this.titleModal = "Asignación de rol a un usuario",
      this.registerRol.reset();
      this.show = false;
    }
  
  }

}
