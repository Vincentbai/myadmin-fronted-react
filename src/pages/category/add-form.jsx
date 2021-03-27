import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
    Form,
    Select,
    Input,
} from 'antd'

// 只是为了方便下面的书写
const Item = Form.Item
const Option = Select.Option

// 添加分类的form组件
export default class AddForm extends Component{

    static propTypes = {
        level1Categories: PropTypes.array.isRequired,
        parentId: PropTypes.string.isRequired

    }

    formRef = React.createRef()

    componentDidMount() {
        this.formRef.current.setFieldsValue({
            parentCategoryName: this.props.parentId,
        });
    }
    
    componentDidUpdate() {
        this.formRef.current.setFieldsValue({
            parentCategoryName: this.props.parentId,
        });     
    }

    render(){

        const {level1Categories} = this.props

        return(
            <Form ref={this.formRef}>

                <span>Parent category:</span>
                <Item name="parentCategoryName">
                    <Select>
                        <Option value='0'>Level 1 category</Option>
                        {
                            level1Categories.map(item=><Option key={item._id} value={item._id}>{item.name}</Option>)
                        }
                    </Select>
                </Item>

                <span>New category's name:</span>
                <Item 
                    name="newCategoryName"
                    rules={[{
                        required: true
                    }]}
                >
                    <Input placeholder="Please enter the new category's name" />
                </Item>
            </Form>
        )
    }
}