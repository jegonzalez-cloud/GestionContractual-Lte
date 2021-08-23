import { ActionReducerMap} from "@ngrx/store"
import * as reducers from './reducers';


export interface AppState{
    usuarios: reducers.UsuariosState,
    token:reducers.TokenState,
    entidades:reducers.EntidadesState,   
    idioma: reducers.IdiomaState
}

export const appReducers: ActionReducerMap<AppState> = {
    usuarios: reducers.UsuarioReducer,
    token: reducers.TokenReducer,
    entidades: reducers.EntidadesReducer,    
    idioma:reducers.IdiomaReducer
};