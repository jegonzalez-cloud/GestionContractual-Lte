import { Action, createReducer, on, State } from "@ngrx/store"
import { TokenModel } from "src/app/models/token/token.model";
import { cargarToken,cargarTokenError,cargarTokenSuccess} from '../actions';


export interface TokenState{
    token  :TokenModel,
    loaded :boolean,
    loading:boolean,
    error  :any
}

export const tokenInitialState: TokenState = {
    token  : {Token:"",Status:""},
    loaded : false,
    loading: false,
    error  : null
}

const _TokenReducer = createReducer(tokenInitialState,
    on(cargarToken,state=>({ ...state, loading: true })),

    on(cargarTokenSuccess, (state,{ token }) => ({ 
        ...state, 
        loading: false,
        loaded: true,
        token: { ...token }
    })),

    on(cargarTokenError, (state,{ payload }) => ({ 
        ...state, 
        loading: false,
        loaded: false,
        error: payload
    })),

);


export function TokenReducer(state:any,action:Action){
    return _TokenReducer(state,action);
}