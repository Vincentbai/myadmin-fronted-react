import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'

import App from './App'
// import storageUtils from './utils/storageUtils'
// import memoryUtils from './utils/memoryUtils'
import store from './redux/store'

/**
 * 使用了redux后，不在需要保存用户
 */
// 读取local中保存user，保存到内存中
// const user = storageUtils.getUser();
// memoryUtils.user = user;

// 将App组件渲染到index页面的id为root的标签中
ReactDOM.render((
    <Provider store={store}>
        <App />
    </Provider>
), document.getElementById('root'))