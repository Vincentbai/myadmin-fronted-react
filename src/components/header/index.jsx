import React, {Component} from 'react'
import { withRouter } from 'react-router-dom'
import { Modal } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons';

import './index.less'
import {formateTime, formateDate, formateDay} from '../../utils/dateUtils'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import { reqWeather } from '../../api/index'
import menuList from '../../config/menuConfig'
import LinkButton from '../link-button'

class Header extends Component{

    state= {
        currentTime: formateTime(Date.now()),
        currentDate: formateDate(Date.now()) + ' ' + formateDay(),
        weather: '',
        iconUrl: '',
        temp: '',
    }

    getTime = () =>{
        this.intervalId = setInterval(()=>{
            const currentTime = formateTime(Date.now())
            this.setState({currentTime})
        },1000)

    }

    getWeather = async () => {

        const {weather, iconUrl, temp} = await reqWeather('Melbourne')

        this.setState({weather, iconUrl, temp})
    }

    getTitle = () =>{
        const path = this.props.location.pathname

        let title

        // 不是使用find来找，因为有二级目录, 所以得用foreach遍历
        menuList.forEach(item => {
            if(item.key === path){
                title = item.title
            } else if(item.children){
                // 在子item中查找匹配的
                const cItem = item.children.find(cItem => cItem.key === path)
                if(cItem){
                    title = cItem.title
                }
            }
        })

        return title
    }

    logout = () =>{
        //显示确认框
        Modal.confirm({
            title: 'Continue logout?',
            icon: <ExclamationCircleOutlined />,
            content: '',
            okText: 'OK',
            cancelText: 'Cancel',

            // 使用箭头函数，可以使用外部的this
            onOk:() => {
                // 删除保存的user数据
                storageUtils.removeUser()
                memoryUtils.user = {}

                // 跳转到login界面
                this.props.history.replace('/login')
            }
        });
    }

    /**
     *第一次render()之后执行一次
     一般在此执行异步请求：发送ajax请求/启动定时器
     */
    componentDidMount(){

        this.getTime()
          
        this.getWeather()
    }

    /**
     * 当前组件卸载之前调用
     */
    componentWillUnmount(){
        // 清楚定时器
        clearInterval(this.intervalId)

    }

    render(){

        const {currentTime, currentDate, weather, iconUrl, temp} = this.state

        const username = memoryUtils.user.username

        // 每次render刷新的时候执行，如果放到didmount中只能执行一次
        const title = this.getTitle()
        
        return(
            <div className="header">
                <div className="header-top">
                    Welcome, <span> {username} </span>
                    <LinkButton onClick={this.logout}>Logout</LinkButton>
                </div>
                <div className="header-bottom">
                    <div className="header-bottom-left"> {title} </div>
                    <div className="header-bottom-right">
                        <span className="header-bottom-right-time"><b>Time</b>: {currentTime} <b>Date</b>: {currentDate}</span>
                        <span><b>Weather</b>: <img src={iconUrl} alt="weatherIcon"/> {weather} {temp}&#8451;  </span>
                    </div>
                </div>
            </div>

        )
    }
}

export default withRouter(Header)