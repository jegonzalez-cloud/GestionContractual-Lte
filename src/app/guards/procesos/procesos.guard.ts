import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import { Observable } from 'rxjs';
import {AuthService} from "../../services/auth/auth.service";

@Injectable({
  providedIn: 'root'
})
export class ProcesosGuard implements CanActivate {

  constructor(private router:Router,private authService:AuthService) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let rol:any = atob(localStorage.getItem('rol')!);
    this.authService.isLogin().subscribe((response:any)=>{
      if(response.Status == 'Fail'){
        this.router.navigate(['login']);
        localStorage.clear();
        return false;
      }
      else{
        if(rol != 1){
          this.router.navigate(['busqueda']);
          return false;
        }
        else{
          return true;
        }
      }
    });
    return true;
  }

}
