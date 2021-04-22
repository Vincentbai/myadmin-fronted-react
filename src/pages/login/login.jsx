import React, { Component } from 'react'
import { Form, Input, Button, message} from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'

import './login.less'
import { login } from '../../redux/actions'
import logo from '../../assets/images/logo.png'

/**
 * 非 redux 版
 */
// 默认暴露不需要写大括号
// import { reqLogin } from '../../api'
// import memoryUtils from '../../utils/memoryUtils'
// import storageUtils from '../../utils/storageUtils'


/**
 * 登录的路由组件
 */
class Login extends Component{

    render(){

        // 如果用户已经登录就自动跳转到主页面   
        // const user = memoryUtils.user

        // redux version
        const user = this.props.user
        
        if(user && user._id){

            return <Redirect to='/' />

        }

        const errorMsg = user.errorMsg

        const onFinish = async (values) => {

            const {username, password} = values
          
            // reqLogin(username, password).then(response => {
                
            //     console.log("success", response.data)

            // }).catch(error =>{
                
            //     console.log("error!", error)

            /**
             * 非react-redux版本
             */
            // const result = await reqLogin(username, password)

            // console.log(result)

            // if(result.status === 0){

            //     const user = result.data

            //     // 保存到内存
            //     memoryUtils.user = user
                
            //     // 保存到local中去
            //     storageUtils.saveUser(user)
                
            //     message.success('Welcome ' + user.username)

            //     // 路由跳转，所有的路由组件都接受三个特殊属性
            //     // push() 和 replace() 的区别，不需要会退回来就使用replace
            //     // history 就像一个访问历史的栈结构
            //     this.props.history.replace('/')


            // }else{
            //     message.error(result.msg)
            // }


            /**
             * 调用分发异步action的函数
             */
            this.props.login(username,password)

        }

        const onFinishFailed = (errorInfo) => {
            console.log('Validation Failed:', errorInfo)
        }

        return(
            <div className="login">
                <header className="login-header">
                    <img src={logo} alt="logo"/>
                    <h1> ETB Admin System</h1>
                </header>
                <section className="login-content">
                    <div className={user.errorMsg? 'error-msg show' : 'error-msg'}>{errorMsg}</div>
                    <h2>Staff Login</h2>
                    <Form
                        name="normal_login"
                        className="login-form"
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        >

                        <Form.Item
                            name="username"
                            // 声明式验证
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your Username!',
                                },
                                {
                                    min: 4,
                                    message: 'At least 4 characters!',
                                },
                                {
                                    pattern: /^[a-zA-Z0-9_]+$/,
                                    message: 'Username only contains letters, numbers and underscore!',
                                },
                            ]}
                        >
                            <Input 
                                prefix={<UserOutlined style={{color: 'rgba(0,0,0,.25)'}} />} 
                                placeholder="Username" 
                            />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please confirm your password!',
                                },

                                // validator for the match passowrd
                                // ({ getFieldValue }) => ({
                                //     validator(_, value) {
                                //       if ( value.length > 4) {
                                //         return Promise.resolve()
                                //       }
                        
                                //       return Promise.reject(new Error('at least 4 charactors!'))
                                //     },
                                //   }),

                                // validator for the checkbox
                                //   {
                                //     validator: (_, value) => 
                                //       value ? Promise.resolve() : Promise.reject(new Error('Should accept agreement')),
                                //   },

                                {
                                    validator(_, value) {
                                        if (value !== undefined){
                                            if ( value.length > 4) {
                                            return Promise.resolve()
                                            }
                                        }
                                        return Promise.reject(new Error('at least 4 charactors!'))
                                    },
                                }
                            ]}
                        >
                            <Input.Password
                            prefix={<LockOutlined style={{color: 'rgba(0,0,0,.25)'}} />}
                            placeholder="Password"
                            />
                        </Form.Item>
                        
                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                            Log in
                            </Button>
                        </Form.Item>
                    </Form>
                </section>
            </div>
        )
    }
}

export default connect(
    state => ({user: state.user}),
    {login}
)(Login)


