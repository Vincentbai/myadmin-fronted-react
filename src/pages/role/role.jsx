import React, {Component} from 'react'
import {Card, Button, Table, Modal, message} from 'antd'
import { PlusOutlined, EditOutlined} from '@ant-design/icons'

import { PAGE_SIZE } from '../../utils/constants'
import { reqGetRoles, reqAddRole, reqUpdateRole} from '../../api'
import AddForm from './add-form'
import AuthForm from './auth-form'

/**
 * 角色路由
 */
export default class Role extends Component{

    addFromRef = React.createRef()

    constructor(props){

        super(props)

        this.authFormRef = React.createRef()

        this.state = {
            roles: [], // 所有的角色
            role:{}, // 选中的角色
            isShowAdd: false,
            isShowAuth: false,
        }

        this.initColumn()
    }

    initColumn = () =>{

        this.columns = [
            {
                title: 'Role Name',
                dataIndex: 'name',
            },
            {
                title: 'Create Time',
                dataIndex: 'create_time',
            },
            {
                title: 'Authorized Time',
                dataIndex: 'auth_time',
            },
            {
                title: 'Authorizer',
                dataIndex: 'auth_name',
            },
        ]

    }

    onRow = (record) =>{
        return {
            onClick:event => {
                this.setState({
                    role: record
                })
            },
        }
    }

    getRoles = async () =>{

        const result = await reqGetRoles()

        if(result.status === 0){
            this.setState({
                roles: result.data
            })
        }
    }

    addRole = async() =>{

        // 搜集收入数据, 父组件中负责子组件的form中的值，通过双ref的方式
        const result = await this.addFromRef.current.formRef.current.validateFields(['newRoleName'])
        
        if(result.newRoleName){
            // 请求添加
            const reqResult = await reqAddRole(result.newRoleName)

            if(reqResult.status === 0){
                // 根据结果提示/更新列表
                message.success('Add new role successfully!')
                this.addFromRef.current.formRef.current.resetFields()
                // 不用下面的去重新发送请求，浪费资源，因为添加后会返回这个新添加的role，所以直接push到roles数组里就可以了
                // 尽量不要直接赋值和修改state中和数值
                
                // 更加简洁的写法
                this.setState(state => ({
                    roles: [...state.roles, reqResult.data],
                    isShowAdd: false,
                }))

                // 正确的写法
                // this.setState((oldState) => {
                //     const newRoles = [...oldState.roles]
                //     newRoles.push(reqResult.data)
                //     return { 
                //         roles: newRoles,
                //         isShowAdd: false,
                //     }
                // })

                // 页面不能刷新，尽量不要直接去更新状态数据
                // const roles = this.state.roles
                // roles.push(reqResult.data)
                // this.setState({
                //     roles,
                //     isShowAdd:false,
                // })

                // 可以实现功能，但是会多发送一次请求
                // this.getRoles()
            }else{
                message.error('Add new role failure!')
            }
        }
    }

    updateRole = async () =>{

        this.setState({
            isShowAuth: false
        })

        const role = this.state.role

        const menus = this.authFormRef.current.getMenus()

        role.menus = menus

        const result = await reqUpdateRole(role)

        if(result.status === 0){
            message.success("Update the role succesfully!")
            
        }else {
            message.error("Update the role failure!")
            
        }
    }

    componentDidMount(){
        this.getRoles()
    }

    render(){

        const {roles, role, isShowAdd, isShowAuth} = this.state

        const title = (
            <span>
                <Button type="primary" icon={<PlusOutlined/>} onClick={()=>{this.setState({isShowAdd:true})}}>New Role</Button> &nbsp;&nbsp;
                <Button type="primary" icon={<EditOutlined/>} onClick={()=>{this.setState({isShowAuth:true})}} disabled={!role._id}>Role Authorization</Button>
            </span>
        )

        return(
            <Card title={title}>
                <Table 
                  columns={this.columns} 
                  dataSource={roles}
                  bordered = {true}
                  rowKey = '_id'
                  pagination = {{defaultPageSize:PAGE_SIZE}}
                  rowSelection={{
                      type:'radio', 
                      // 根据 role._id 来显示被选中的内容
                      selectedRowKeys: [role._id],
                      onSelect:(role)=>{
                        this.setState({
                            role
                        })
                      }
                    }}
                  onRow={this.onRow}
                />

                <Modal 
                    title="Add new role" 
                    visible={isShowAdd} 
                    onOk={this.addRole} 
                    onCancel={()=>{
                        this.addFromRef.current.formRef.current.resetFields()
                        this.setState({
                            isShowAdd:false
                        })
                    }}
                >
                    <AddForm
                        ref={this.addFromRef}
                    />

                </Modal>

                <Modal
                    title="Authorize the role" 
                    visible={isShowAuth} 
                    onOk={this.updateRole} 
                    onCancel={()=>{
                        this.setState({
                            isShowAuth:false
                        })
                    }}
                >
                    <AuthForm ref={this.authFormRef} role={this.state.role}
                    
                    />
                    
                </Modal>

            </Card>
        )
    }
}