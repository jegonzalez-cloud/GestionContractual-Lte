import { Action, createReducer, on, State } from '@ngrx/store';
import { cargarSap, cargarSapError, cargarSapSuccess } from '../actions';

export interface SapState {
  sap: [];
  loaded: boolean;
  loading: boolean;
  error: any;
}

export const SapInitialState: SapState = {
  sap: [],
  loaded: false,
  loading: false,
  error: null,
};

const _SapReducer = createReducer(
  SapInitialState,
  on(cargarSap, (state) => ({ ...state, loading: true })),

  on(cargarSapSuccess, (state, { sap }) => ({
    ...state,
    loading: false,
    loaded: true,
    sap: { ...sap },
  })),

  on(cargarSapError, (state, { payload }) => ({
    ...state,
    loading: false,
    loaded: false,
    error: payload,
  }))
);

export function SapReducer(state: any, action: Action) {
  return _SapReducer(state, action);
}
