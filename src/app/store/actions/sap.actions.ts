import { createAction, props } from '@ngrx/store';

export const cargarSap = createAction(
  '[Sap] Cargar Sap',
  props<{ data: any }>()
);

export const cargarSapSuccess = createAction(
  '[Sap] Cargar Sap Success',
  props<{ sap: [] }>()
);

export const cargarSapError = createAction(
  '[Sap] Cargar Sap Error',
  props<{ payload: any }>()
);
