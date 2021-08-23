import { Action, createReducer, on, State } from "@ngrx/store"
import { cargarIdioma,cargarIdiomaError} from '../actions';


export interface IdiomaState{
    idioma  :string,
    loaded :boolean,
    loading:boolean,
    error  :any
}

export const IdiomaInitialState: IdiomaState = {
    idioma  : 'es',
    loaded : false,
    loading: false,
    error  : null
}

const _idiomaReducer = createReducer(IdiomaInitialState,
    // on(cargarIdioma,state=>({ ...state, loading: true })),

    on(cargarIdioma, (state,{ idioma }) => ({ 
        ...state, 
        loading: false,
        loaded: true,
        idioma: idioma 
    })),

    on(cargarIdiomaError, (state,{ payload }) => ({ 
        ...state, 
        loading: false,
        loaded: false,
        error: payload
    })),

);


export function IdiomaReducer(state:any,action:Action){
    return _idiomaReducer(state,action);
}