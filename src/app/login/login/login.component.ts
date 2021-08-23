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
import { cargarEntidades, cargarIdioma } from '../../store/actions';
import { TranslateService } from '@ngx-translate/core';

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
    {
      usuario: '',
      documento: '',
      entidad: '',
      equipo: '',
      unidad: '',
      tipoEntidad: '',
      codigoEntidad: '',
    },
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
  usuarioSubscription!: Subscription;
  entidadesSubscription!: Subscription;

  constructor(
    private translate: TranslateService,
    private router: Router,
    private fb: FormBuilder,
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
    this.usuarioSubscription = this.store
      .select('usuarios')
      .subscribe(({ users, loading, error }) => {
        // let x = new UserModel(users);
//         console.log(users);
        // this.usuarios = new UserModel(users);
        this.usuarios = users;
        this.loadingUsuarios = loading;
        this.errorUsuarios = error;
      });
    this.entidadesSubscription = this.store
      .select('entidades')
      .subscribe(({ entidades, loading, error }) => {
        this.entidades = entidades;
        this.loadingEntidades = loading;
        this.errorEntidades = error;
      });
    this.store.select('idioma').subscribe(({ idioma }) => {
      this.translate.use(idioma);
    });
  }

  BuscarEntidades() {
    if (this.loginForm.invalid) {
      return;
    }
    const { usuario, password } = this.loginForm.value;

    this.store.dispatch(cargarEntidades({ username: btoa(usuario), password:btoa(password)}));

    setTimeout(() => {
      //console.log(this.entidades);
      let jsonString = JSON.stringify(Object.assign({}, this.entidades));
      let DATA = JSON.parse(jsonString)["DATA"];
      console.log(DATA)

      if (DATA.length == undefined || DATA.length == null || DATA.length == 0) {
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
          title: 'No tienes entidades asociadas!',
        });
        return;
      }

      Swal.fire({
        title: 'Seleccione una entidad',
        input: 'select',
        inputOptions: {
          Entidades: DATA.map((datos:any)=> datos.NOMBRE_DEPENDENCIA),
        },
        // inputPlaceholder: 'Seleccione una Entidad',
        allowOutsideClick: false,
        showCloseButton: true,
        showCancelButton: false,
        confirmButtonColor: '#007BFF',
        confirmButtonText: 'Continue',
        inputValidator: (value) => {
          return new Promise((resolve: any) => {
            if (value.replace(/\s/g, "") !== '') {
              resolve();
              // localStorage.setItem('tipoEntidad', this.entidades[0].tipoEntidad);
//               localStorage.setItem('entidad', DATA[value].CODIGO_ENTIDAD);
              // localStorage.setItem('equipo', JSON.stringify(this.entidades[0].equipo));

              localStorage.setItem('dependencia', DATA[value].NOMBRE_DEPENDENCIA);
              this.store.dispatch(acciones.cargarDataSecop({ username: btoa(usuario), password:btoa(password)}));
              this.goHome();
            } else {
              resolve('Por favor seleccione una Entidad!');
            }
          });
        },
      });
    }, 500);
  }

  getDocument() {
    if (this.loginForm.invalid) {
      return;
    }

    const { usuario, password, idioma } = this.loginForm.value;
    let dataCredential: CredentialsModel = {
      Username: usuario,
      Password: password,
    };
    this.store.dispatch(acciones.cargarToken({ data: dataCredential }));

    setTimeout(() => {
      const { Token, Status } = this.token;
      if (Token.length === 0 && Status !== 'Ok') {
        return;
      }
      localStorage.setItem('username', usuario);
      this.store.dispatch(acciones.cargarUsuarios({ token: this.token.Token }));
      this.getUsuarios();
    }, 800);
  }

  getUsuarios() {
    setTimeout(() => {

      if (this.usuarios === undefined || this.usuarios === null || this.usuarios.length === 0) {
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
    }, 1050);
  }

  goHome() {
    this.router.navigate(['home']);
  }

  setIdioma(idioma: string) {
    let useIdioma = 'es';
    if (idioma !== 'Español') {
      useIdioma = 'en';
    }
    localStorage.setItem('lang', useIdioma);
    this.store.dispatch(cargarIdioma({ idioma: useIdioma }));
  }
}
