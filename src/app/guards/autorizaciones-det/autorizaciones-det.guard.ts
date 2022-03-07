import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import { Observable } from 'rxjs';
import {AuthService} from "../../services/auth/auth.service";

@Injectable({
  providedIn: 'root'
})
export class AutorizacionesDetGuard implements CanActivate {

  constructor(private router: Router,private authService:AuthService) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean{

    let rol:any = (localStorage.getItem('rol') !== null) ? atob(localStorage.getItem('rol')!) : '';
    this.authService.isLogin().subscribe((response:any)=>{
      if(response.Status == 'Fail'){
        this.router.navigate(['login']);
        localStorage.clear();
        return false;
      }
      else{
        if(rol == ''){
          this.router.navigate(['busqueda']);
          return false;
        }
        else if(rol == 7){
          this.router.navigate(['configuracion']);
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
