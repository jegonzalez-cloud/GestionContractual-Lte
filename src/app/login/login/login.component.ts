import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, Validators, FormGroup} from '@angular/forms';
import {ServicesService} from '../../services/services.service';
import Swal from 'sweetalert2';
import {UserModel} from 'src/app/models/user/user.model';
import {AppState} from 'src/app/store/app.reducers';
import {Store} from '@ngrx/store';
import * as acciones from '../../store/actions';
import {TokenModel} from 'src/app/models/token/token.model';
import {Subscription} from 'rxjs';
import {CredentialsModel} from 'src/app/models/credentials/credentials.model';
import {Router} from '@angular/router';
import {EntidadesModel} from 'src/app/models/entidades/entidades.model';
import {cargarEntidades, cargarIdioma} from '../../store/actions';
import {TranslateService} from '@ngx-translate/core';
import {AuthService} from 'src/app/services/auth/auth.service';
import * as utils from '../../utils/functions'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {
  validador: boolean = true;
  loginForm!: FormGroup;
  entityValue: string = '';
  resultEntity: any = [];
  loading: boolean = false;
  show: boolean = false;

  //MODELOS
  usuarios: UserModel[] = [];
  token: TokenModel = {Token: '', Status: ''};
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
    private store: Store<AppState>,
    private authService: AuthService,
    private service: ServicesService
  ) {
    this.loginForm = this.fb.group({
      usuario: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.store.select('idioma').subscribe(({idioma}) => {
      this.translate.use(idioma);
    });
  }

  ngOnDestroy() {
  }

  getLogin() {
    if (this.loginForm.invalid) {
      return;
    }
    this.loading = true;
    this.show = true;
    const {usuario, password} = this.loginForm.value;
    let dataCredential: CredentialsModel = {
      Username: usuario,
      Password: password,
    };
    this.authService.login(dataCredential)
      .subscribe((data: any) => {
        if (data.Token != '-1') {
          this.getBasicinformation(dataCredential.Username, dataCredential.Password, data.Token);
          this.show = false;
          this.loading = false;
        } else {
          utils.showAlert('Credenciales Incorrectas!', 'warning');
          this.show = false;
          this.loading = false;
        }
      }, (error) => {
        utils.showAlert('Credenciales Incorrectas!', 'warning');
        this.show = false;
        this.loading = false;
      })

  }

  getBasicinformation(user: string, password: string, token: string) {
    this.authService.getUserPermissions(token).subscribe((data) => {
      this.loading = false;
      let fullName = data.Values.UserInfo.Name + " " + data.Values.UserInfo.LastName;
      let userImage = data.Values.UserInfo.UserImageFull;
      this.getEntities(user, token, fullName, userImage);
    }, (error) => console.error(error));
  }

  getEntities(user: string, token: string, fullName: string, userImage: string) {
    this.authService.getEntidades(user).subscribe((data: any) => {
      let dataEntities = data.Values.ResultFields;
      if (dataEntities == undefined || dataEntities.length == null || dataEntities.length == 0) {
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
        this.loading = false;
        return;
      }

      Swal.fire({
        title: 'Seleccione una entidad',
        input: 'select',
        inputOptions: {
          Entidades: dataEntities.map((datos: any) => datos.USC_NOMBRE_ENTIDAD),
        },
        // inputPlaceholder: 'Seleccione una Entidad',
        allowOutsideClick: false,
        showCloseButton: true,
        showCancelButton: false,
        confirmButtonColor: '#007BFF',
        confirmButtonText: 'Continue',
        inputValidator: (value) => {
          return new Promise(async (resolve: any) => {
            if (value.replace(/\s/g, "") !== '') {
              resolve();

              this.authService.getUsuarioConnect(user, dataEntities[value].USC_GESTOR).subscribe((response:any)=>{
                if(response != null && response['Values'].length > 0){
                  localStorage.setItem("username", btoa(user));
                  localStorage.setItem('token', btoa(token));
                  localStorage.setItem("name", btoa(fullName));
                  localStorage.setItem("userImage", btoa(userImage));
                  localStorage.setItem('entidad', btoa(dataEntities[value].USC_NOMBRE_ENTIDAD));
                  localStorage.setItem('codigoEntidad', btoa(dataEntities[value].USC_CODIGO_ENTIDAD));
                  localStorage.setItem('conectPw', btoa(dataEntities[value].USC_PASSWORD));
                  localStorage.setItem('userCodeSecop', btoa(response['Values']));
                  localStorage.setItem('centroGestor', btoa(dataEntities[value].USC_GESTOR));
                  localStorage.setItem('rol', btoa(dataEntities[value].ROL_ID));
                  localStorage.setItem('usuarioConect', btoa(dataEntities[value].USC_USUARIO));
                  this.goHome(btoa(token),dataEntities[value].ROL_ID);
                }
              },(error:any) => {
                console.log(error);
              })
            } else {
              resolve('Por favor seleccione una Entidad!');
            }
          });
        },
      });
    });
  }

  async getUsuarios() {
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
      if (this.loginForm.invalid) {
        return;
      }
      const {usuario, password} = this.loginForm.value;
      await this.store.dispatch(cargarEntidades({username: btoa(usuario), password: btoa(password)}));
    }
  }

  goHome(token: any,rol:any) {
    this.authService.getConfigApp(token).subscribe((response: any) => {
      localStorage.setItem("color", btoa(response.Values.ResultFields[0].CON_COLOR));
      localStorage.setItem("linkCdp", btoa(response.Values.ResultFields[0].CON_LINK_CDP));
      localStorage.setItem("linkPagos", btoa(response.Values.ResultFields[0].CON_LINK_PAGOS));
      localStorage.setItem("linkProceso", btoa(response.Values.ResultFields[0].CON_LINK_CREARPROCESO));
      localStorage.setItem("estadoProceso", btoa(response.Values.ResultFields[0].CON_LINK_CONSULTARESTADOPROCESO));
      localStorage.setItem("salarioMinimo", btoa(response.Values.ResultFields[0].CON_SALARIO_MINIMO));
      localStorage.setItem("topeMaximo", btoa(response.Values.ResultFields[0].CON_TOPE_MAXIMO));
      localStorage.setItem("cantidadSalarios", btoa(response.Values.ResultFields[0].CON_CANTIDAD_SALARIOS));
      localStorage.setItem("identificacionSap", btoa(response.Values.ResultFields[0].CON_LINK_IDENTIFICACIONSAP));
      localStorage.setItem("dataSecop", btoa(response.Values.ResultFields[0].CON_LINK_SECOP));
      localStorage.setItem("sociedad", btoa(response.Values.ResultFields[0].CON_SOCIEDAD));
      this.getParametros(token,rol);
      // this.router.navigate(['home']);
    });
  }

  setIdioma(idioma: string) {
    let useIdioma = 'es';
    if (idioma !== 'Español') {
      useIdioma = 'en';
    }
    localStorage.setItem('lang', useIdioma);
    this.store.dispatch(cargarIdioma({idioma: useIdioma}));
  }

  getParametros(token: any,rol:any){
    this.authService.getParametros(token,rol)
      .subscribe((data: any) => {
        if(data.Status == 'Ok'){
          localStorage.setItem("Parametros", btoa(JSON.stringify(data.Values.ResultFields)));
          this.router.navigate(['home']);
        }
        else{
          utils.showAlert('no se lograron cargar los parametros','warning');
        }
      }, (error) => utils.showAlert('Credenciales Incorrectas!', 'error'))
  }
}
