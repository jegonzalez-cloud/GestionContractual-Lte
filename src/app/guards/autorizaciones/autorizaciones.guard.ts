import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AutorizacionesGuard implements CanActivate {

  constructor(private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean{

    let rol:any = atob(localStorage.getItem('rol')!);
    if(rol == 39){
      this.router.navigate(['home/dashboard']);
      return false;
    }
    else{
      return true;
    }

  }

}
