import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, exhaustMap, map, mergeMap, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth/auth.service';
import * as usuariosActions from '../actions';

@Injectable()
export class UsuariosEffects {
  constructor(private actions$: Actions, private authService: AuthService) {}

  cargarusuarios$ = createEffect(() =>
    this.actions$.pipe(
      ofType(usuariosActions.cargarUsuarios),
      exhaustMap((action) =>
        this.authService.getUserPermissions(action.token).pipe(
          map((data) =>
            usuariosActions.cargarUsuariosSuccess({ usuarios: data })
          ),
          catchError((err) =>
            of(usuariosActions.cargarUsuariosError({ payload: err }))
          )
        )
      )
    )
  );
}
