import React, {PureComponent } from 'react'
import {
    Card,
    Form,
    Input,
    Cascader,
    Button,
} from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'

import { reqGetCategoryListByParentId } from '../../api/index'
import PictureWall from './picture-wall'
import RichTextEditor from './rich-text-editor'



const {Item} = Form
const {TextArea} = Input

/**
 * product的子路由
 */
export default class ProductAddUpdate extends PureComponent{


    constructor(props){
        
        super(props)
        
        // 创建用来保存ref标识的标签对象的容器
        this.formRef = React.createRef()

        this.imageUploaderRef = React.createRef()
    
        this.richTextEditorRef = React.createRef()

        // 如果路由有把product传递过来，就是update
        const product = this.props.location.state
    
        // 如果有product，this.product就是true，如果没有就是false
        this.isUpdate = !!product

        // 如果product没有值就赋值个空对象，避免报错
        this.product = product || {}

        const { pCategoryId, categoryId } = this.product

        this.categoryIds = []

        if(this.isUpdate){
            if(pCategoryId === '0'){
                this.categoryIds.push(categoryId)
            }else {
                this.categoryIds.push(pCategoryId)
                this.categoryIds.push(categoryId)
            }
        }

        
    }

    state = {
        options:[],
    }

    initOptions = async (categoryList) =>{
        // 根据categories数据生成option数据，相当于adapter
        const options = categoryList.map(c =>({
            value: c._id,
            label: c.name,
            isLeaf: false,
        }))

        // 如果是一个二级分类列表的更新呢
        const { isUpdate, product} = this
        const { pCategoryId} = product

        // 获取二级分类列表
        if(isUpdate && pCategoryId !== '0'){

            const subCategories = await this.getCategoryListByParentId(pCategoryId)
            const childOptions = subCategories.map(c=>({
                value: c._id,
                label: c.name,
                isLeaf: true,
            }))

            // 将二级分类列表绑定到该父类option上，找到该父类option
            const targetOption = options.find(option => option.value === pCategoryId)
    
            targetOption.children = childOptions
        }
        // 更新options的状态
        this.setState({
            options
        })
    }

    /**
     * 获取一级/二级分类列表
     * async 修饰的函数返回的是一个新的promise 对象
     */
    getCategoryListByParentId = async (parentId) =>{
        const result = await reqGetCategoryListByParentId(parentId)
        if(result.status === 0){
            const categoryList = result.data

            // 判断列表是一级还是二级
            if(parentId === '0'){
                this.initOptions(categoryList)
            }else{
                // 如果是二级列表就是直接通过新生成的promise返回，调用函数进行下一步处理
                return categoryList
            }
        }
    }

    loadData = async (selectedOptions) => {
        
        const targetOption = selectedOptions[selectedOptions.length - 1]
        targetOption.loading = true
        
        // 更新选中的值获取二级分类列表
        const subCategories = await this.getCategoryListByParentId(targetOption.value)

        targetOption.loading = false

        if(subCategories && subCategories.length>0){

            const subOptions = subCategories.map(c=>({
                value: c._id,
                label: c.name,
            }))

            targetOption.children = subOptions

        }else{ // 没有二级子分类
            targetOption.isLeaf = true
        }

        this.setState({
            options: [...this.state.options],
        })
    }

    componentDidMount(){
        
        this.getCategoryListByParentId('0')

        this.formRef.current.setFieldsValue({
            productName: this.product.name,
            productDesc: this.product.desc,
            productPrice: this.product.price,
            prductCategories: this.categoryIds,
        })
    }

    render(){

        const { isUpdate } = this

        const { imgs, detail} = this.product

        const title=(
            <div>
                <ArrowLeftOutlined 
                    style={{color:'green', marginRight:15, fontSize:20, cursor: 'pointer'}}
                    onClick={()=>this.props.history.goBack()}
                />
                <span>{isUpdate? 'Update Product':'Add New Product'}</span>
            </div>
        )

        // 指定item的布局对象
        const formItemLayout = {
            labelCol:{span:8}, // 指定左侧label的宽度
            wrapperCol:{span: 8}, // 指定右侧的宽度
        }

        const onFinish = (values) =>{
            console.log(values.prductCategories[0])
            // console.log(this.imageUploaderRef.current.getImgNames())
            console.log(this.richTextEditorRef.current.getProductDetail())
        }

        return(
            <Card title={title}>
                <Form 
                    {...formItemLayout}
                    ref={this.formRef}
                    onFinish={onFinish}    
                >
                    <Item
                        name="productName"
                        label="Product Name:"
                        rules={[{
                            required: true,
                            message: 'Please input the product name!' }
                            ]}
                    >
                        <Input placeholder="Please input the product's name"/>
                    </Item>
                    <Item
                        name="productDesc"
                        label="Product Description:"
                        rules={[{required: true, message: 'Please input the product description!' }]}
                    >
                        <TextArea placeholder="Please input the product's description" autoSize={{minRows: 2, maxRows: 6}}/>
                    </Item>
                    <Item 
                        name="productPrice"
                        label="Product Price:"
                        rules={[
                            {
                                required: true, 
                                message: 'Please input the product price!',
                            },
                            () => ({
                                validator(_, value) {
                                  if (!value || value>0) {
                                    return Promise.resolve();
                                  }
                                  return Promise.reject(new Error('Please input the right price'));
                                },
                            }),
                        ]}
                    >
                        <Input type="number" placeholder="" addonBefore="$"/>
                    </Item>
                    <Item
                        name="prductCategories"
                        label="Product Category:"
                        rules={[{required: true, message: 'Please select the product categories!' }]}>
                        <Cascader options={this.state.options} loadData={this.loadData} changeOnSelect/>
                    </Item>
                    <Item label="Product Photos:">
                        {/* <ImageUploader ref={this.childRef} imgs={imgs}/> */}
                        <PictureWall imgs={imgs} ref={this.imageUploaderRef}/>
                    </Item>
                    <Item label="Product Detail:" labelCol={{span:8}} wrapperCol={{span: 10}}>
                        <RichTextEditor ref={this.richTextEditorRef} productDetail={detail} />
                    </Item>
                    <div style={{textAlign:'center'}}>
                        <Button type="primary" htmlType="submit">Submit</Button>
                    </div>
                </Form>
            </Card>
        )
    }
}