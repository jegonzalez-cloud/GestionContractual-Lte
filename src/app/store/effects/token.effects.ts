import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, exhaustMap, map, mergeMap, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth/auth.service';
import * as acciones from '../actions';
import * as utils from '../../utils/functions'

@Injectable()
export class TokenEffects {
  constructor(private actions$: Actions, private authService: AuthService,private store:Store) {}

  cargarToken$ = createEffect(() =>
    this.actions$.pipe(
      ofType(acciones.cargarToken),
      exhaustMap((action) =>
        this.authService.login(action.data).pipe(
          map((data) => acciones.cargarTokenSuccess({ token: data })),
          tap((data => {
            if(data.token.Token != '-1'){
              localStorage.setItem('token',data.token.Token);
              // console.log('Dispatch ===> CargarUsuarios' + data.token.Token);
              this.store.dispatch(acciones.cargarUsuarios({ token: data.token.Token }));
            }
            else{
              utils.showAlert('Credenciales Incorrectas!','error');
            }
          })),
          catchError((err) => of(acciones.cargarTokenError({ payload: err })))
        )
      )
    )
  );
}
