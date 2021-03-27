import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
    Form,
    Input,
} from 'antd'

const Item = Form.Item

// 添加分类的form组件
export default class UpdateForm extends Component{

    static propTypes = {
        categoryName: PropTypes.string.isRequired,
    }

    formRef = React.createRef()

    // 坑
    componentDidMount() {
        this.formRef.current.setFieldsValue({
            categoryName: this.props.categoryName,
        });
    }

    componentDidUpdate() {
        this.formRef.current.setFieldsValue({
            categoryName: this.props.categoryName,
        });
    }

    render(){
    
        const onFinish = (values) => {
            console.log('Received values of form: ', values);
        };

        return(
            <Form
                ref={this.formRef}
                name="upgradeForm"
                onFinish={onFinish}
            >
                
                <Item 
                    name="categoryName"
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