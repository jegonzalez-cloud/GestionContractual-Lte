import {Component, OnInit} from '@angular/core';
import {NavigationExtras, Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {cargarIdioma} from 'src/app/store/actions';
import {AppState} from 'src/app/store/app.reducers';
import {AuthService} from "../../services/auth/auth.service";
import Swal from "sweetalert2";
import {SecopService} from "../../services/secop/secop.service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  public lenguaje: string = 'es';
  public cantidadAutorizaciones: any;
  public autorizaciones: any;
  private username: string = atob(localStorage.getItem('username')!);
  private entidad: string = atob(localStorage.getItem('entidad')!);
  private codigoEntidad: string = atob(localStorage.getItem('codigoEntidad')!);

  constructor(private router: Router, private store: Store<AppState>, private authService: AuthService, private secopService: SecopService) {
  }

  ngOnInit(): void {
    this.getAutorizaciones()
    this.store.select('idioma').subscribe(({idioma}) => {
      this.lenguaje = idioma;
    });


    // this.cantidadAutorizaciones = 0;
  }

  setIdioma() {
    if (this.lenguaje === 'es') {
      this.lenguaje = 'en';
    } else if (this.lenguaje === 'en') {
      this.lenguaje = 'es';
    }
    localStorage.setItem('lang', this.lenguaje)
    this.store.dispatch(cargarIdioma({idioma: this.lenguaje}));
  }

  async logOut() {
    let token = localStorage.getItem('token')!;
    // this.authService.logout(token);
    Swal.fire({
      title: 'Loading...'
    });
    Swal.showLoading();

    this.authService.logout(token).subscribe((data) => {
      Swal.close();
      Swal.fire({
        title: '¿Esta seguro de cerrar la sesion?',
        // text: "No podrás revertir esto!",
        icon: 'warning',
        showCancelButton: false,
        allowOutsideClick: false,
        showCloseButton: true,
        confirmButtonColor: '#3085d6',
        // cancelButtonColor: '#828282',
        // cancelButtonText: 'Cancelar',
        confirmButtonText: 'ACEPTAR!'
      }).then((result) => {
        if (result.isConfirmed) {
          localStorage.clear();
          this.router.navigate(['login']);
        }
      })
    });
  }

  getAutorizaciones() {
    this.secopService.getAutorizaciones(this.username, this.codigoEntidad, this.entidad,'').subscribe((response: any) => {
      console.log(response.Values.ResultFields);
      this.cantidadAutorizaciones = response.Values.ResultFields.length;
      this.autorizaciones = response.Values.ResultFields;
      localStorage.setItem('autorizaciones',JSON.stringify(response.Values.ResultFields))
    })
    setInterval(() => {
      this.secopService.getAutorizaciones(this.username, this.codigoEntidad, this.entidad,'').subscribe((response: any) => {
        console.log(response.Values.ResultFields)
        this.cantidadAutorizaciones = response.Values.ResultFields.length
        this.autorizaciones = response.Values.ResultFields;
        localStorage.setItem('autorizaciones',JSON.stringify(response.Values.ResultFields))
      })
    }, 100000)
  }

  goDetail(row:any){
    // console.log(row.CONS_PROCESO);
    // let row = evento.target.closest('tr').childNodes.item(0).innerHTML
    // alert('elpupy')
    console.log(row)

    this.router.navigate(['home/autorizaciones-det/'+row]);
    // this.router.navigate([route], { queryParams: { id: contact.id } });
    // this.router.navigate(['process']);
  }
}
