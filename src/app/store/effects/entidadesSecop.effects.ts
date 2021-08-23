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
        this.authService.showTasks(action.username,action.password).pipe(
          // tap(entidades=>console.log(entidades)),
          map((data:any) => acciones.cargarEntidadesSuccess({ entidades: data })),
          catchError((err) => of(acciones.cargarEntidadesError({ payload: err })))
        )
      )
    )
  );
}
