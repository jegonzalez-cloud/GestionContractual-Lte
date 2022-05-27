import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, CanLoad, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {state} from "@angular/animations";
import {AuthService} from "../../services/auth/auth.service";

@Injectable({
  providedIn: 'root'
})
export class ConfiguracionGuard implements CanActivate {

  constructor(private router: Router, private authService: AuthService) {
    // console.log('configuracion')
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {

    const rol: any = (localStorage.getItem('rol') !== null) ? atob(localStorage.getItem('rol')!) : '';
    if (rol != 7 && rol != 8) {
      this.router.navigate(['busqueda']);
      return false;
    }
    return true;
  }

  // canLoad() {
  //   this.authService.isLogin().subscribe((response: any) => {
  //     if (response.Status == 'Fail') {
  //       this.router.navigate(['login']);
  //       localStorage.clear();
  //       return false;
  //     } else {
  //       if (this.rol == '' || (this.rol != 7)) {
  //         this.router.navigate(['busqueda']);
  //         return false;
  //       } else {
  //         return true;
  //       }
  //     }
  //   });
  //   return true;
  // }
}
