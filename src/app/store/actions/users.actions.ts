import { createAction, props } from '@ngrx/store';
import { UserModel } from 'src/app/models/user/user.model';

export const cargarUsuarios = createAction(
  '[Usuarios] Cargar Usuarios',
  props<{ token : any }>()
  );

export const cargarUsuariosSuccess = createAction(
  '[Usuarios] Cargar Usuarios Success',
  props<{ usuarios: UserModel[] }>()
);

export const cargarUsuariosError = createAction(
    '[Usuarios] Cargar Usuarios Error',
    props<{ payload: any }>()
  );
  
