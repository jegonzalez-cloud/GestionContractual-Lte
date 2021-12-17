import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, CanLoad, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import { Observable } from 'rxjs';
import {state} from "@angular/animations";

@Injectable({
  providedIn: 'root'
})
export class ConfiguracionGuard implements CanActivate,CanLoad {

  constructor(private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean{

    let rol:any = (localStorage.getItem('rol') !== null) ? atob(localStorage.getItem('rol')!) : '';
    // console.log(rol);
    // if(rol == '' || (rol != 42 && rol != 41) ){
    if(rol == '' || (rol != 7) ){
      this.router.navigate(['busqueda']);
      return false;
    }
    else{
      return true;
    }
  }

  canLoad(){
      let rol:any = (localStorage.getItem('rol') !== null) ? atob(localStorage.getItem('rol')!) : '';
      // console.log(rol);
      // if(rol == '' || (rol != 42 && rol != 41) ){
      if(rol == '' || (rol != 7) ){
        this.router.navigate(['busqueda']);
        return false;
      }
      else{
        return true;
      }
  }

}
