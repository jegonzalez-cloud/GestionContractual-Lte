import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, exhaustMap, map, mergeMap, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth/auth.service';
import * as usuariosActions from '../actions';
import {LoginComponent} from "../../login/login/login.component";
import * as utils from "../../utils/functions";

@Injectable()
export class UsuariosEffects {
  constructor(private actions$: Actions, private authService: AuthService) {}

  cargarUsuarios$ = createEffect(() =>
    this.actions$.pipe(
      ofType(usuariosActions.cargarUsuarios),
      exhaustMap((action) =>
        this.authService.getUserPermissions(action.token).pipe(
          tap((data:any)=>{
            // console.log(data.Values);
            // console.log(data.Values.UserInfo.Name);
            localStorage.setItem("name",btoa(data.Values.UserInfo.Name+" "+data.Values.UserInfo.LastName));
            localStorage.setItem("userImage",data.Values.UserInfo.UserImageFull);
          }),
          map((data) =>
            usuariosActions.cargarUsuariosSuccess({ usuarios: data.Values})
          ),
          catchError((err) =>
            of(usuariosActions.cargarUsuariosError({ payload: err }))
          )
        )
      )
    )
  );

}
