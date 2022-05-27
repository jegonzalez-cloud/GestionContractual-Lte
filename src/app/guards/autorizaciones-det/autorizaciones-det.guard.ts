import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import { Observable } from 'rxjs';
import {AuthService} from "../../services/auth/auth.service";

@Injectable({
  providedIn: 'root'
})
export class AutorizacionesDetGuard implements CanActivate {

  constructor(private router: Router,private authService:AuthService) {
    // console.log('Autorizaciones')
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean{

    let rol:any = (localStorage.getItem('rol') !== null) ? atob(localStorage.getItem('rol')!) : '';
    if(rol == ''){
      this.router.navigate(['busqueda']);
      return false;
    }
    else if(rol == 7 || rol == 8){
      this.router.navigate(['configuracion']);
      return false;
    }
    return true;
  }

}
