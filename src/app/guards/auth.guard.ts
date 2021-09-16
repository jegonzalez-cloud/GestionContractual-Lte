import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, CanLoad, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable, of} from 'rxjs';
import {AuthService} from "../services/auth/auth.service";
import {catchError, map, take} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {

  constructor(private router: Router, private authServ: AuthService) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) {
    return this.authServ.isLogin().pipe(
      map((data: any) => {
        if (data.Status != 'Ok' && data != '' && data.length != 0) {
          localStorage.clear();
          this.router.navigate(['/login']);
          return false;
        } else {
          return true;
        }
      }), catchError((err: any) => {
        return of(false)
      }));
  }

  canLoad() {
    // return this.authServ.isLogin().subscribe((data:any)=>{
    //   console.log('nice')
    //   return true;
    // },error => {
    //   console.log(error)
    //   return false;
    // })
    return this.authServ.isLogin().pipe(
      map((data: any) => {
        if (data.Status != "Ok" && data != "" && data.length != 0) {
          localStorage.clear();
          this.router.navigate(['/login']);
          return false;
        } else {
          return true;
        }
      }, take(1)), catchError((err: any) => {
        console.log(err)
        return of(false)
      }));
  }
}
