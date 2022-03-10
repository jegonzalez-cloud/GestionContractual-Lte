import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthService} from "../../services/auth/auth.service";

@Injectable({
  providedIn: 'root'
})
export class DashboardGuard implements CanActivate {

  constructor(private router: Router, private authService: AuthService) {
    // console.log('dashboard Guard');
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    let rol: any = (localStorage.getItem('rol') !== null) ? atob(localStorage.getItem('rol')!) : '';
    if (rol == '' || (rol != 4 && rol != 3)) {
      this.router.navigate(['busqueda']);
      return false;
    }
    return true;
  }
}
