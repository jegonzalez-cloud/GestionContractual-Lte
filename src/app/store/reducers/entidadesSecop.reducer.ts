import { Action, createReducer, on, State } from "@ngrx/store"
import { EntidadesModel } from "src/app/models/entidades/entidades.model";
import { cargarEntidades,cargarEntidadesError,cargarEntidadesSuccess} from '../actions';


export interface EntidadesState{
    entidades  :EntidadesModel[],
    loaded     :boolean,
    loading    :boolean,
    error      :any
}

export const EntidadesInitialState: EntidadesState = {
    entidades   : [],
    loaded      : false,
    loading     : false,
    error       : null
}

const _EntidadesReducer = createReducer(EntidadesInitialState,
    on(cargarEntidades,state=>({ ...state, loading: true })),

    on(cargarEntidadesSuccess, (state,{ entidades }) => ({ 
        ...state, 
        loading: false,
        loaded: true,
        entidades: { ...entidades }
    })),

    on(cargarEntidadesError, (state,{ payload }) => ({ 
        ...state, 
        loading: false,
        loaded: false,
        error: payload
    })),

);


export function EntidadesReducer(state:any,action:Action){
    return _EntidadesReducer(state,action);
}