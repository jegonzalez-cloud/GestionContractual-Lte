import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ServicesService } from '../../services/services.service';
import Swal from 'sweetalert2';
import { UserModel } from 'src/app/models/user/user.model';
import { AppState } from 'src/app/store/app.reducers';
import { Store } from '@ngrx/store';
import * as acciones from '../../store/actions';
import { TokenModel } from 'src/app/models/token/token.model';
import { Subscription } from 'rxjs';
import { CredentialsModel } from 'src/app/models/credentials/credentials.model';
import { Router } from '@angular/router';
import { EntidadesModel } from 'src/app/models/entidades/entidades.model';
import { cargarEntidades } from '../../store/actions';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  validador: boolean = true;
  loginForm!: FormGroup;
  entityValue: string = '';
  resultEntity: any = [];

  //MODELOS
  usuarios: UserModel[] = [];
  token: TokenModel = { Token: '', Status: '' };
  entidades: EntidadesModel[] = [
    { usuario: '', documento: '', entidad: '', equipo: '', unidad: '' },
  ];
  //LOADING
  loadingUsuarios: boolean = false;
  loadingToken: boolean = false;
  loadingEntidades: boolean = false;
  //ERROR
  errorUsuarios: any;
  errorToken: any;
  errorEntidades: any;

  tokenSubscription!: Subscription;

  constructor(
    private router:Router,
    private fb: FormBuilder,
    private service: ServicesService,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      usuario: ['', Validators.required],
      password: ['', Validators.required],
    });
    this.tokenSubscription = this.store
      .select('token')
      .subscribe(({ token, loading, error }) => {
        this.token = token;
        this.loadingToken = loading;
        this.errorToken = error;
      });
    this.store.select('usuarios').subscribe(({ users, loading, error }) => {
      this.usuarios = users;
      this.loadingUsuarios = loading;
      this.errorUsuarios = error;
    });
    this.store
      .select('entidades')
      .subscribe(({ entidades, loading, error }) => {
        this.entidades = entidades;
        this.loadingEntidades = loading;
        this.errorEntidades = error;
      });
  }

  setEntity(value: any) {
    this.entityValue = value;
  }

  BuscarEntidades() {
    if (this.loginForm.invalid) {
      return;
    }
    const { usuario } = this.loginForm.value;
    console.log(this.usuarios.values)
    this.store.dispatch(cargarEntidades({ data: usuario }));

    setTimeout(() => {
      Swal.fire({
        title: 'Seleccione una Entidad',
        input: 'select',
        inputOptions: {
          Entidades: this.entidades[0].entidad,
        },
        inputPlaceholder: 'Seleccione una Entidad',
        showCancelButton: true,
        inputValidator: (value) => {
          return new Promise((resolve: any) => {
            if (value !== '') {                          
              resolve();              
              this.goHome();
            } else {
              resolve('Por favor seleccione una Entidad!');
            }
          });
        },
      });
    }, 700);
    // this.service.showTasks(usuario).subscribe((data: any) => {
    //   this.validador = data.length === 0 ? false : true;
    //   if (!this.validador) {
    //     const Toast = Swal.mixin({
    //       toast: true,
    //       position: 'top-end',
    //       showConfirmButton: false,
    //       timer: 3000,
    //       timerProgressBar: true,
    //       didOpen: (toast) => {
    //         toast.addEventListener('mouseenter', Swal.stopTimer);
    //         toast.addEventListener('mouseleave', Swal.resumeTimer);
    //       },
    //     });
    //     Toast.fire({
    //       icon: 'error',
    //       title: 'No tienes Entidades Relacionadas!',
    //     });
    //     return;
    //   }
    //   // console.log("==> "+this.validador)
    //   this.resultEntity = data;
    // });
  }

  login() {}

  // login() {
  //   if (this.loginForm.invalid) {
  //     return;
  //   }
  //   const { usuario, password } = this.loginForm.value;
  //   let dataCredential: CredentialsModel = {
  //     Username: usuario,
  //     Password: password,
  //   };
  //   this.store.dispatch(acciones.cargarToken({ data: dataCredential }));
  //   setTimeout(() => {
  //     const { Token, Status } = this.token;
  //     if (Token.length == 0 && Status != 'Ok') {
  //       return;
  //     }
  //     // console.log('2 => ' + this.token.Token);
  //     this.store.dispatch(acciones.cargarUsuarios({ token: this.token.Token }));
  //   }, 300);
  //   setTimeout(() => {
  //     if (this.usuarios != []) {
  //       this.router.navigate(['home']);
  //     }
  //   }, 600);
  // }

  getDocument() {
    if (this.loginForm.invalid) {
      return;
    }
    const { usuario, password } = this.loginForm.value;
    let dataCredential: CredentialsModel = {
      Username: usuario,
      Password: password,
    };
    this.store.dispatch(acciones.cargarToken({ data: dataCredential }));
    setTimeout(() => {
      const { Token, Status } = this.token;
      if (Token.length == 0 && Status != 'Ok') {
        return;
      }
      console.log('2 => ' + this.token.Token);
      this.store.dispatch(acciones.cargarUsuarios({ token: this.token.Token }));
    }, 700);

    setTimeout(() => {
      console.log(this.usuarios.values.prototype);
      if (this.usuarios.length === 0) {
        // Swal.fire({
        //   title: 'Warning!',
        //   text: 'Credenciales Incorrectas!',
        //   icon: 'error',
        //   confirmButtonText: 'Continuar',
        // });
        const Toast = Swal.mixin({
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
          title: 'Credenciales Incorrectas!',
        });
        return;
      } else {
        this.BuscarEntidades();
      }
    }, 1200);
  }

  goHome() {
    this.router.navigate(['home']);
  }
}
