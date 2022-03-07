import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthService} from "../../services/auth/auth.service";

@Injectable({
  providedIn: 'root'
})
export class DashboardGuard implements CanActivate {

  constructor(private router: Router, private authService: AuthService) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    console.log('dashboard Guard');
    let rol: any = (localStorage.getItem('rol') !== null) ? atob(localStorage.getItem('rol')!) : '';
    this.authService.isLogin().subscribe((response: any) => {
      if (response.Status == 'Fail') {
        this.router.navigate(['login']);
        localStorage.clear();
        return false;
      } else {
        if (rol == '' || (rol != 4 && rol != 3)) {
          this.router.navigate(['busqueda']);
          localStorage.clear();
          return false;
        } else {
          return true;
        }
      }
    });
    return false;
  }
}
