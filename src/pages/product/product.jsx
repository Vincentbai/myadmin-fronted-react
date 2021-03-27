import React, {Component} from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'

import ProductHome from './home'
import ProductAddUpdate from './add-update'
import ProductDetail from './detail'

// 当父组件引用less时，其所有的子组件都可以引用到
import './product.less'

/**
 * 产品路由
 */
export default class Product extends Component{
    render(){
        return(

            <Switch>
                {/* 如果父路径有覆盖到其子路径的时候，需要加exact属性 */}
                <Route exact={true} path="/product" component={ProductHome}/> 
                <Route path="/product/addUpdate" component={ProductAddUpdate}/>
                <Route path="/product/detail" component={ProductDetail}/>
                <Redirect to='/product' />
            </Switch>
        )
    }
}