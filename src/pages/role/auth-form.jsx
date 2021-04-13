import React, {Component} from 'react'
import {
    Form,
    Input,
    Tree,
} from 'antd'
import PropTyes from 'prop-types'
import menuList from '../../config/menuConfig'

const Item = Form.Item

const treeData = [
    {
      title: 'All Authorization',
      key: 'all',
      children: menuList,
    },
];

export default class AuthForm extends Component{

    static propTypes = {
        role:PropTyes.object
    }

    constructor(props){
        super(props)

        const {menus} = props.role
        this.state={
            checkedKeys: menus,
            ownUpdate: false
        }
    }

    // infinite loops
    // componentDidUpdate(){
    //     const {menus} = this.props.role
    //     this.setState({
    //         checkedKeys: menus
    //     })
    // }

    // shouldComponentUpdate(nextProps, nextState) {
    //     return this.state.checkedKeys !== nextState.checkedKeys;
    // }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (prevState.ownUpdate) {
            return {
                checkedKeys: prevState.checkedKeys,
                ownUpdate:false
            }
        }else if (nextProps.role.menus !== prevState.checkedKeys) {
          return ({ checkedKeys: nextProps.role.menus }) // <- this is setState equivalent
        }
        return null
    }

    // 父组件获取最新menus的方法
    getMenus = () => this.state.checkedKeys

    render(){

        const {role} = this.props
        const { checkedKeys } = this.state

        const onCheck = (checkedKeys) => {
            this.setState({
                checkedKeys,
                ownUpdate: true
            })
        }

        return(
            <div>
                <Form>
                    <Item 
                        label = 'Role Name'
                    >
                        <Input value={role.name} disabled/>
                    </Item>
                </Form>
                <Tree
                    checkable
                    defaultExpandAll='true'
                    checkedKeys={checkedKeys}
                    onCheck={onCheck}
                    treeData={treeData}
                />
            </div>
        )
    }
}