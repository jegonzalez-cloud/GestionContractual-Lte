import { createAction, props } from '@ngrx/store';
import { EntidadesModel } from 'src/app/models/entidades/entidades.model';

export const cargarEntidades = createAction(
  '[Entidades] Cargar Entidades',
  props<{username: string,password:string}>()
  );

export const cargarEntidadesSuccess = createAction(
  '[Entidades] Cargar Entidades Success',
  //props<{ entidades: EntidadesModel[] }>()
  props<{ entidades: [] }>()
);

export const cargarEntidadesError = createAction(
    '[Entidades] Cargar Entidades Error',
    props<{ payload: any }>()
  );

//******************************************************

export const cargarDataSecop = createAction(
  '[Entidades] Cargar Data Secop',
  props<{username: string,password:string}>()
  );

export const cargarDataSecopSuccess = createAction(
  '[Entidades] Cargar Data Secop Success',
  //props<{ entidades: EntidadesModel[] }>()
  props<{ entidades: [] }>()
);

export const cargarDataSecopError = createAction(
    '[Entidades] Cargar Data Secop Error',
    props<{ payload: any }>()
  );
