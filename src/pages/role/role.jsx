import React, {Component} from 'react'
import {Card, Button, Table} from 'antd'
import { PlusOutlined, EditOutlined} from '@ant-design/icons'


import {PAGE_SIZE} from '../../utils/constants'

/**
 * 角色路由
 */
export default class Role extends Component{


    render(){

        const title = (
            <span>
                <Button type="primary" icon={<PlusOutlined/>}>New Roles</Button> &nbsp;&nbsp;
                <Button type="primary" icon={<EditOutlined/>} disabled>Role Authorization</Button>
            </span>
        )

        return(
            <Card title={title}>
                <Table 
                  columns={this.columns} 
                  dataSource={''}
                  bordered = {true}
                  rowKey = '_id'
                  pagination = {{defaultPageSize:PAGE_SIZE, showQuickJumper: true}}
                />

            </Card>
        )
    }
}