import { createAction, props } from '@ngrx/store';

export const cargarIdioma = createAction(
  '[Idioma] Cargar Idioma',
  props<{idioma: string}>()
  );

export const cargarIdiomaError = createAction(
    '[Idioma] Cargar Idioma Error',
    props<{ payload: any }>()
  );