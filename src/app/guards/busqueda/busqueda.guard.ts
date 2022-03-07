import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, CanLoad, Router,Route, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthService} from "../../services/auth/auth.service";

@Injectable({
  providedIn: 'root'
})
export class BusquedaGuard implements CanActivate {
  constructor(private router: Router,private authService: AuthService) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    let rol: any = (localStorage.getItem('rol') !== null) ? atob(localStorage.getItem('rol')!) : '';
    this.authService.isLogin().subscribe((response: any) => {
      if (response.Status == 'Fail') {
        this.router.navigate(['login']);
        localStorage.clear();
        return false;
      }
      else{
        if (rol == '' || rol == null) {
          this.router.navigate(['login']);
          localStorage.clear();
          return false;
        } else if (rol == 7) {
          this.router.navigate(['configuracion']);
          return true;
        } else {
          return true;
        }
      }
    });
    return true;
  }
}
