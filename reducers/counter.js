import { counterAction } from '../actions/counter';

const initialState = {
    count : 0
}

export default (state = initialState, action) => {
    switch (action.type) {
        case counterAction.INCREASE : {
            return {
                ...state,
                count : state.count + action.payload
            }
        }
        case counterAction.DECREASE : {
            return {
                ...state,
                count : state.count - action.payload
            }
        }
        default :
            return state;
    }
}