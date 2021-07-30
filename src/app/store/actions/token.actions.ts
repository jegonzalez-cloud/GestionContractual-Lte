import { createAction, props } from '@ngrx/store';
import { CredentialsModel } from 'src/app/models/credentials/credentials.model';
import { TokenModel } from 'src/app/models/token/token.model';

export const cargarToken = createAction(
  '[Token] Cargar Token',
  props<{data: CredentialsModel}>()
  );

export const cargarTokenSuccess = createAction(
  '[Token] Cargar Token Success',
  props<{ token: TokenModel }>()
);

export const cargarTokenError = createAction(
    '[Token] Cargar Token Error',
    props<{ payload: any }>()
  );