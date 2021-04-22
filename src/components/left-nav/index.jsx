import React, {Component} from 'react'
import { Link, withRouter} from 'react-router-dom'
import { Menu, Badge } from 'antd'
import {connect} from 'react-redux'

import logo from '../../assets/images/logo.png'
import './index.less'
import menuList from '../../config/menuConfig'
import { setHeaderTitle } from  '../../redux/actions'

const { SubMenu } = Menu;

class LeftNav extends Component{

    // 根据menu的数据数组生成menu的标签数组，一般使用 map() + 递归
    getMenuNodes_map = (menuList) =>{
        const path = this.props.location.pathname

        return menuList.map(item =>{

            if(!item.children){

                // 检查是否是对应的item，防止刷新的时候显示初始值
                if(item.key === path || path.indexOf(item.key) === 0){
                    // 如果是对应的值就更新redux中title的值
                    this.props.setHeaderTitle(item.title)
                }

                if(item.icon === ''){
                    return(
                        <Menu.Item key={item.key}>
                            <Link to={item.key} onClick={()=> this.props.setHeaderTitle(item.title)}>
                                <span>{item.title}</span>
                                <Badge size="small" className="sider-badge" count={item.count} />
                            </Link>
                        </Menu.Item>
                    )
                }else{
                    return(
                        <Menu.Item key={item.key} icon={<item.icon />}>
                            <Link to={item.key} onClick={()=> this.props.setHeaderTitle(item.title)}>
                                <span>{item.title}</span>
                                <Badge size="small" className="sider-badge" count={item.count} />
                            </Link>
                        </Menu.Item>
                    )
                }
            } else{
                // 使用find方法查找是否有一个child的key和当前请求路径的pathname一样，如果一样就要展开这个父路径
                const cItem = item.children.find(cItem => path.indexOf(cItem.key) === 0)
                // 如果cItem 不是空置，就创建openKey
                if(cItem){
                    this.openKey = item.key
                }

                if(item.icon === ''){
                    return(
                        <SubMenu key={item.key} title={item.title}>
                            {this.getMenuNodes_map(item.children)}
                        </SubMenu>
                    )
                            
                }else{
                    return(
                        <SubMenu key={item.key} icon={<item.icon />} title={item.title}>
                            {this.getMenuNodes_map(item.children)}
                        </SubMenu>
                    )
                }
            }
        })
    }

    // 根据menu的数据数组生成menu的标签数组，一般使用 reduce() + 递归
    getMenuNodes_reduce = (menuList) =>{
        menuList.reduce((pre,item)=>{
            // 向pre中添加<Menu.Item>
            if(!item.children){
                if(item.icon === ''){
                    pre.push((
                        <Menu.Item key={item.key}>
                            <Link to={item.key}>
                                <span>{item.title}</span>
                            </Link>
                        </Menu.Item>
                    ))
                }else{
                    pre.push((
                        <Menu.Item key={item.key} icon={<item.icon />}>
                            <Link to={item.key}>
                                <span>{item.title}</span>
                            </Link>
                        </Menu.Item>
                    ))
                }
            }else{
                // 向pre中添加<SubMenu> 
                pre.push((
                    <SubMenu key={item.key} icon={<item.icon />} title={item.title}>
                        {this.getMenuNodes_reduce(item.children)}
                    </SubMenu>
                ))
            }
            return pre
        },[])
    }

    state = {
        collapsed: false,
    };
    
    toggleCollapsed = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    };

    render(){

        this.menuNodes = this.getMenuNodes_map(menuList)

        // 得到当前请求的路由路径
        let path = this.props.location.pathname

        if(path.indexOf('/product') === 0){
            path = '/product'
        }
        
        const openKey = this.openKey

        return(
            <div className="left-nav">

                <Link to='/' className="left-nav-header">
                    <img src={logo} alt="logo" />
                </Link>

                <div>
                    <Menu
                        // 默认选中key为home的item
                        // defaultSelectedKeys={[path]}
                        selectedKeys={[path]}
                        defaultOpenKeys={[openKey]}
                        mode="inline"
                        theme="dark"
                    >
                       
                        {this.menuNodes}

                    </Menu>
                </div>
            </div>
        )

    }

}

// withRouter 是高阶组件， 包装非路由组件，返回一个的新的组件
// 新的组件向非路由组件传递三个属性：history/location/match
export default connect(
    state => ({}),
    {setHeaderTitle}
)(withRouter(LeftNav))