/**
 * 包含多个 action creator 函数
 * 同步action： 对象
 * 异步action： 函数 dispatch =>{}
 */
import { SET_HEADER_TITLE, RECEIVE_USER, SHOW_ERROR_MSG, RESET_USER} from './action-types'

import { reqLogin } from '../api/index'
import storageUtils from '../utils/storageUtils'

// 设置头部标题的同步action
export const setHeaderTitle = (headerTitle) =>({
    type: SET_HEADER_TITLE,
    data: headerTitle,
})

// 接受用户的同步action
export const receiveUser = (user) => ({
    type: RECEIVE_USER,
    user
})

// 显示错误信息的同步action
export const showErrorMsg = (errorMsg) =>({
    type: SHOW_ERROR_MSG,
    errorMsg,
})

// 重置user的同步action
export const logoutAction = () => {
    // 在localStorage中删除user
    storageUtils.removeUser()

    return {
        type: RESET_USER
    }

}

// 异步登录的action
export const login = (username, password) =>{
    return async dispatch =>{

        // 1. 执行异步ajax请求
        const result = await reqLogin(username, password)
        // 2.1 如果成功了， 分发一个成功的同步action
        if(result.status === 0){
            const user = result.data
            // 保存到localstorage中
            storageUtils.saveUser(user)
            // 分发接受用户的同步action
            dispatch(receiveUser(user))
        }else{
            const msg = result.msg
            dispatch(showErrorMsg(msg))
        }
        // 2.2 如果失败了， 分发一个失败的同步action
    }
}