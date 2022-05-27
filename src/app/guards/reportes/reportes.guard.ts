import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import { Observable } from 'rxjs';
import {AuthService} from "../../services/auth/auth.service";

@Injectable({
  providedIn: 'root'
})
export class ReportesGuard implements CanActivate {
  constructor(private router: Router) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    const rol: any = (localStorage.getItem('rol') !== null) ? atob(localStorage.getItem('rol')!) : '';
    console.log(rol);
    if (rol == '' || rol == null) {
      this.router.navigate(['login']);
      localStorage.clear();
      return false;
    } else if (rol == 7 || rol == 8) {
      this.router.navigate(['configuracion']);
      return true;
    }
    return true;
  }

}
