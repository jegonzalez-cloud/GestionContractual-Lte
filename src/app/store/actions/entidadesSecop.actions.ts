import { createAction, props } from '@ngrx/store';
import { EntidadesModel } from 'src/app/models/entidades/entidades.model';

export const cargarEntidades = createAction(
  '[Entidades] Cargar Entidades',
  props<{data: string}>()
  );

export const cargarEntidadesSuccess = createAction(
  '[Entidades] Cargar Entidades Success',
  props<{ entidades: EntidadesModel[] }>()
);

export const cargarEntidadesError = createAction(
    '[Entidades] Cargar Entidades Error',
    props<{ payload: any }>()
  );