import {combineReducers} from 'redux' 

import storageUtils from '../utils/storageUtils'
import { SET_HEADER_TITLE, RECEIVE_USER, SHOW_ERROR_MSG, RESET_USER} from './action-types'

const initHeaderTitle = 'Dashboard'

function headerTitle(state = initHeaderTitle, action){

    switch(action.type){
        case SET_HEADER_TITLE:
            return action.data
        default:
            return state
    }
}

const initUser = storageUtils.getUser()

function user(state = initUser, action){

    switch(action.type){
        case RECEIVE_USER:
            return action.user
        case SHOW_ERROR_MSG:
            const errorMsg = action.errorMsg
            return {...state, errorMsg}
        case RESET_USER:
            return {}
        default:
            return state
    }
}

/**
 * 管理的总的state的结构：
 * {
 *   headerTitle: headerTitle,
 *   user: user,
 * }
 */
export default combineReducers({
    headerTitle,
    user,
})

