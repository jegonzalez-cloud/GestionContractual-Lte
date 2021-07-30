import { Action, createReducer, on, State } from "@ngrx/store"
import { UserModel } from "src/app/models/user/user.model";
import { cargarUsuarios,cargarUsuariosError,cargarUsuariosSuccess} from '../actions';


export interface UsuariosState{
    users  :UserModel[],
    loaded :boolean,
    loading:boolean,
    error  :any
}

export const usuariosInitialState: UsuariosState = {
    users  : [],
    loaded : false,
    loading: false,
    error  : null
}

const _UsuarioReducer = createReducer(usuariosInitialState,
    on(cargarUsuarios,state=>({ ...state, loading: true })),

    on(cargarUsuariosSuccess, (state,{ usuarios }) => ({ 
        ...state, 
        loading: false,
        loaded: true,
        users: { ...usuarios }
    })),

    on(cargarUsuariosError, (state,{ payload }) => ({ 
        ...state, 
        loading: false,
        loaded: false,
        error: payload
    })),

);


export function UsuarioReducer(state:any,action:Action){
    return _UsuarioReducer(state,action);
}