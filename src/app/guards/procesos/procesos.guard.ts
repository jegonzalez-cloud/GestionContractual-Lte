import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProcesosGuard implements CanActivate {

  constructor(private router:Router) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let rol:any = atob(localStorage.getItem('rol')!);
    if(rol != 39){
      this.router.navigate(['busqueda']);
      return false;
    }
    else{
      return true;
    }
  }

}
