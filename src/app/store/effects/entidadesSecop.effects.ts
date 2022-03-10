import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, exhaustMap, map, mergeMap, tap } from 'rxjs/operators';
import { ServicesService } from 'src/app/services/services.service';
import * as acciones from '../actions';

@Injectable()
export class EntidadesSecopEffects {
  constructor(private actions$: Actions, private authService: ServicesService) {}

  cargarEntidades$ = createEffect(() =>
    this.actions$.pipe(
      ofType(acciones.cargarEntidades),
      exhaustMap((action) =>
        this.authService.getDependencias(action.username,action.password).pipe(
          map((data:any) => acciones.cargarEntidadesSuccess({ entidades: data })),
          catchError((err) => of(acciones.cargarEntidadesError({ payload: err })))
        )
      )
    )
  );

  cargarDataSecop$ = createEffect(() =>
     this.actions$.pipe(
       ofType(acciones.cargarDataSecop),
       exhaustMap((action) =>
         this.authService.getDataSecop(action.username,action.password).pipe(
           map((data:any) => acciones.cargarEntidadesSuccess({ entidades: data })),
           tap((data:any) => {
            let arrayUnidades:any = [];
            let arrayEquipos:any = [];
            // console.log(data)
            data.entidades.DATA.forEach((value:any)=> {
              if(localStorage.getItem('unidades') != value.UNIDAD_CONTRATACION){
                arrayUnidades.push(value.UNIDAD_CONTRATACION);
                localStorage.setItem('unidades',arrayUnidades);
              }
              if(localStorage.getItem('equipos') != value.EQUIPO_CONTRATACION){
                arrayEquipos.push(value.EQUIPO_CONTRATACION);
                localStorage.setItem('equipos',arrayEquipos);
              }
              if(localStorage.getItem('usuarioConnect') != value.USUARIO_CONNECT){
                localStorage.setItem('usuarioConnect',btoa(value.USUARIO_CONNECT));
              }
              if(localStorage.getItem('passwordConnect') != value.PASSWORD_CONNECT){
                localStorage.setItem('passwordConnect',btoa(value.PASSWORD_CONNECT));
              }
              if(localStorage.getItem('codigoEntidad') != value.CODIGO_ENTIDAD){
                localStorage.setItem('codigoEntidad',btoa(value.CODIGO_ENTIDAD));
              }
            });
           }),
           catchError((err) => of(acciones.cargarEntidadesError({ payload: err })))
         )
       )
     )
  );
}
