import React, {Component} from 'react'
import {
    Form,
    Input,
} from 'antd'

const Item = Form.Item

export default class AddForm extends Component{

    formRef = React.createRef()

    render(){
        return(
            <Form ref={this.formRef}>
                <Item 
                    label = 'Role Name'
                    name="newRoleName"
                    rules={[{
                        required: true,
                        message: 'Please input your the new role name!',
                    }]}
                >
                    <Input placeholder="Please enter the new role's name" />
                </Item>
            </Form>
        )
    }
}