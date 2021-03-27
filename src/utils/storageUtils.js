/**
 * 进行local数据存储管理工具模块
 * store是跨浏览器的优化的localStorage的库
 */
import store from 'store'

const USER_KEY = 'user_key'

const storageUtils = {

    /**
     *  保存user
     */
    saveUser(user){
        //localStorage.setItem(USER_KEY, JSON.stringify(user))
        store.set(USER_KEY, user);
    },

    /**
     *  读取user
     */
    getUser(){

        // 如果user_key是null，为了不报错，如果是null就parse ‘{}’ 空对象
        //return JSON.parse(localStorage.getItem(USER_KEY) || '{}')
        return store.get(USER_KEY) || {}
    },

    /**
     *  删除user
     */
    removeUser(){
        //localStorage.removeItem(USER_KEY)
        store.remove(USER_KEY)
    }
}

export default storageUtils