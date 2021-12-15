import  { USER_LOGGED_IN, USER_LOGGED_OUT, USER_UPDATED} from "../../types";


export default function user(state ={}, action = {}) {
    switch(action.type){
        case USER_LOGGED_IN:
            return action.user;
        case USER_LOGGED_OUT:
            return {};
        case USER_UPDATED:
            return action.user;
        default: return state;
    }
}

export const userSelector = (state) => state.user;
