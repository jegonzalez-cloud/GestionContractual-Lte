import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, CanLoad, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {state} from "@angular/animations";
import {AuthService} from "../../services/auth/auth.service";

@Injectable({
  providedIn: 'root'
})
export class ConfiguracionGuard implements CanActivate {

  rol: any = (localStorage.getItem('rol') !== null) ? atob(localStorage.getItem('rol')!) : '';

  constructor(private router: Router, private authService: AuthService) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    setTimeout(()=>{
      this.authService.isLogin().subscribe((response: any) => {
        if (response.Status == 'Fail') {
          this.router.navigate(['login']);
          localStorage.clear();
          return false;
        } else {
          if (this.rol == '' || (this.rol != 7)) {
            this.router.navigate(['busqueda']);
            return false;
          } else {
            return true;
          }
        }
      });
    },10);
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
