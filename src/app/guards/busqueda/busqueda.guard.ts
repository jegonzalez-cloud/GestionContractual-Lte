import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BusquedaGuard implements CanActivate {
  constructor(private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean{

    let rol:any = (localStorage.getItem('rol') !== null) ? atob(localStorage.getItem('rol')!) : '';
    console.log(rol);
    if(rol == '' || rol == null){
      localStorage.clear();
      this.router.navigate(['login']);
      return false;
    }
    else if(rol == 7){
      this.router.navigate(['configuracion']);
      return false;
    }
    else{
      return true;
    }

  }

}
