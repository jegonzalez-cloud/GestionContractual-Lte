import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, exhaustMap, map, mergeMap, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth/auth.service';
import * as acciones from '../actions';

@Injectable()
export class TokenEffects {
  constructor(private actions$: Actions, private authService: AuthService) {}

  cargarToken$ = createEffect(() =>
    this.actions$.pipe(
      ofType(acciones.cargarToken),
      exhaustMap((action) =>
        this.authService.login(action.data).pipe(
          map((data) => acciones.cargarTokenSuccess({ token: data })),
          catchError((err) => of(acciones.cargarTokenError({ payload: err })))
        )
      )
    )
  );
}
