import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SecopInterceptorService implements HttpInterceptor {

  token:any;

  constructor(){
    this.token = localStorage.getItem('token')!;
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (this.token) {
      request = request.clone({
        setHeaders: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
          'Access-Control-Allow-Headers': 'X-PINGOTHER, Content-Type',
          'x-user': this.token
        }
      });
    }
    return next.handle(request);
  }
}
