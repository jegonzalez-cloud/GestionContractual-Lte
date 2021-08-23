import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, exhaustMap, map, mergeMap, tap } from 'rxjs/operators';
import { SapService } from 'src/app/services/sap/sap.service';
import { ServicesService } from 'src/app/services/services.service';
import * as acciones from '../actions';

@Injectable()
export class SapEffects {
  constructor(private actions$: Actions, private sapService: SapService) {}

  cargarSap$ = createEffect(() =>
    this.actions$.pipe(
      ofType(acciones.cargarSap),
      exhaustMap((action) =>
        this.sapService.getCdp().pipe(
          tap((data) => {
            let jsonString = JSON.stringify(Object.assign({}, data))
            let y = JSON.parse(JSON.stringify(Object.assign({}, data)))[0].cdp[action.data].monto
            let x = JSON.parse(jsonString)[0].cdp[action.data].monto
            console.log(x)
          }),
          map((data: any) => acciones.cargarSapSuccess({ sap: JSON.parse(JSON.stringify(Object.assign({}, data)))[0].cdp[action.data].monto })),
          catchError((err) => of(acciones.cargarSapError({ payload: err })))
        )
      )
    )
  );
}
