import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, CanLoad, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable, of} from 'rxjs';
import {AuthService} from "../services/auth/auth.service";
import {catchError, map, take} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private authService: AuthService) {
    // console.log('Auth')
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    let rol: any = (localStorage.getItem('rol') !== null) ? atob(localStorage.getItem('rol')!) : '';
    if (rol == '' || rol == null) {
      this.router.navigate(['login']);
      localStorage.clear();
      return false;
    } else if (rol == 7) {
      this.router.navigate(['configuracion']);
      return true;
    }
    return true;
  }

  // canLoad() {
  //   // return this.authServ.isLogin().subscribe((data:any)=>{
  //   //   console.log('nice')
  //   //   return true;
  //   // },error => {
  //   //   console.log(error)
  //   //   return false;
  //   // })
  //   return this.authServ.isLogin().pipe(
  //     map((data: any) => {
  //       if (data.Status != "Ok" && data != "" && data.length != 0) {
  //         localStorage.clear();
  //         this.router.navigate(['/login']);
  //         return false;
  //       } else {
  //         return true;
  //       }
  //     }, take(1)), catchError((err: any) => {
  //       console.log(err)
  //       return of(false)
  //     }));
  // }
}
