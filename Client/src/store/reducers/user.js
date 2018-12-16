let defaultState = {
    loading: false,
    error: false,
    errorMsg: '',
    uid: '',
    name: '',
    email: ''
}

const loginReducer = (state = defaultState, action) => {    
    switch (action.type) {
        case 'LOGIN_SUCCESS' : 
            return {
                ...state,
                uid: action.payload.uid,
                name: action.payload.name,
                email: action.payload.email,
                loading: false,
                error: false,
                errorMsg: ''
            }
        case 'LOGIN_LOADING' :
            return {
                ...state,
                loading: true,
                error: false,
                errorMsg: ''
            }
        case 'LOGIN_ERROR' :
            return {
                ...state,
                loading: false,
                error: true,
                errorMsg: String(action.payload)
            }
        case 'LOGOUT' :
            return {
                ...state,
                loading: false,
                error: false,
                errorMsg: '',
                uid: '',
                email: '',
                name: ''
            }
        case 'REGISTER_SUCCESS' : 
            return {
                ...state,
                loading: false,
                error: false,
                errorMsg: ''
            }
        case 'REGISTER_LOADING' :
            return {
                ...state,
                loading: true,
                error: false,
                errorMsg: ''
            }
        case 'REGISTER_ERROR' :
            return {
                ...state,
                loading: false,
                error: true,
                errorMsg: String(action.payload)
            }

        default: 
        return state
    }
}

export default loginReducer;