import React, {Component}  from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import { Layout } from 'antd'
import { connect } from 'react-redux'

import memoryUtils from '../../utils/memoryUtils'
import LeftNav from '../../components/left-nav'
import Header from '../../components/header'

import Home from '../home/home'
import Category from '../category/category'
import Product from '../product/product'
import Role from '../role/role'
import User from '../user/user'
import Bar from '../charts/bar'
import Line from '../charts/line'
import Pie from '../charts/pie'

const { Footer, Sider, Content } = Layout

/**
 * 
 * 后台管理的路由组件
 */
 class Admin extends Component{

    render(){

        const user = this.props.user

        // 如果内存中没有user就表明当前没有登录
        if(!user || !user._id){
            //自动跳转到登录页面（在render()中和 js (事件回调函数) 中的跳转方式不一样）
            return <Redirect to='/login' />
        }

        return(
            <Layout style={{height:'100%'}}>
                <Sider width='237px' style={{overflowY:'scroll'}}>
                    <LeftNav />
                </Sider>
                <Layout style={{overflow:'auto'}}>
                    <Header></Header>
                    <Content style={{backgroundColor:'#fff',marginTop:20, marginLeft:20, marginRight:20}}>
                        <Switch>
                            <Route path='/home' component={Home} />
                            <Route path='/category' component={Category} />
                            <Route path='/product' component={Product} />
                            <Route path='/role' component={Role} />
                            <Route path='/user' component={User} />
                            <Route path='/charts/bar' component={Bar} />
                            <Route path='/charts/line' component={Line} />
                            <Route path='/charts/pie' component={Pie} />
                            {/* 如果上面的路径配置不上，就执行下面的redirect */} 
                            <Redirect to='/home' />
                        </Switch>
                    </Content>
                    <Footer style={{textAlign:'center', color:'#aaaaaa'}}>&#169;EZTOOLBOX 2021</Footer>
                </Layout>
            </Layout>
        )
    }
}

export default connect(
    state => ({user: state.user}),
    {}
)(Admin)