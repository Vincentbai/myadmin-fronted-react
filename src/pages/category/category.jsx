import React, {Component} from 'react'
import {Card, Table, Button, Space, message, Modal} from 'antd'
import { PlusOutlined, EditOutlined, SearchOutlined, ArrowRightOutlined} from '@ant-design/icons'

import { reqGetCategoryListByParentId, reqAddCategory, reqUpdateCategory} from '../../api/index'
import LinkButton from '../../components/link-button/index'
import AddForm from './add-form'
import UpdateForm from './update-form'
import {PAGE_SIZE} from '../../utils/constants'


/**
 * 商品分类
 */
export default class Category extends Component{

    // 为了获取子组件的ref
    formRef = React.createRef();
    addFromRef = React.createRef();

    constructor(props){

        super(props)

        this.state = {
            loading: false, // 是否正在获取数据中
            level1Categories:[], // 一级分类列表
            level2Categories: [], // 二级分类列表
            parentId: '0', // 默认获取一级分类列表，当前需要显示的分类列表的parentId
            parentName: '', // 当前需要显示分类列表的父分类名称，需要显示在表头
            showStatus: 0, // 标识添加和更新框是否显示，0：两个都不显示；1：显示添加框；2：显示更新框;
        }

        // 初始化列的数组
        this.initColums()
    }

    initColums = () =>{
        this.columns = [
            {
              title: 'Name',
              dataIndex: 'name',
            },
            {
              title: 'Action',
              width: 200,
              render: (category) => (
                <Space size="middle">
                    {/* 如果要向onclick中传递参数，需要加()=>{} */}
                    {/* 如何向事件回调函数传递参数，先定义一个函数，再将该函数传入到事件回调函数中并传入数据 */}
                    {this.state.parentId === '0' ? 
                    <Button type="primary" icon={<SearchOutlined />} onClick={()=>this.showChildCategories(category)}>View</Button>
                    : null}
                   
                   <Button type="default" icon={<EditOutlined />} onClick={()=>this.showUpdateModal(category)}>Edit</Button>
                </Space>
              ),
            },
        ]
    }

    getCategories = async () =>{
        // 在发请求前，显示loading
        this.setState({loading: true})

        const {parentId} = this.state

        const result = await reqGetCategoryListByParentId(parentId)

        // 在发送请求后，关闭loading
        this.setState({loading: false})

        if(result.status === 0){
            // result.data中不一定只是一级分类列表的数据，也有可能是二级的
            const level1Categories = result.data

            // 需要判断parentId的数据来确定是更新的一级分类还是二级分类
            if(parentId === '0'){
                this.setState({
                    level1Categories
                })
            }else{
                this.setState({
                    level2Categories: level1Categories
                })
            }
        }else {
            message.error('Get Category data error!')
        }
    }

    // 事件回调函数, 展示二级分类列表
    showChildCategories = (category) =>{
        // 先更新状态，状态更新是异步操作, 所以下面直接调用的化
        this.setState({
            parentId: category._id,
            parentName: category.name,
        }, ()=>{ // 该回调函数是再state 更新和render()页面刷新后执行
            // 获取二级分类列表
            this.getCategories()
        })
    }

    // 展示一级分类列表
    showCategories = () =>{
        this.setState({
            parentId: '0',
            parentName: '',
            level2Categories: [],
        },()=>{
            this.getCategories()
        })
    }

    // 点击取消：隐藏确定框
    closeModal = ()=>{
        this.setState({
            showStatus: 0
        })
    }

    // 显示添加
    showAddModal = () =>{
        this.setState({
            showStatus: 1
        })
    }

    // 显示更新
    showUpdateModal = (category) =>{

        this.category = category

        this.setState({
            showStatus: 2
        })
    }

    // 添加分类
    addCategory = async () =>{

        // 验证表单是否通过
        const result = await this.addFromRef.current.formRef.current.validateFields()

        if(result){
            // 1. 关闭弹窗
            this.setState({
                showStatus: 0,
            })
    
            // 2. 发送添加请求
            const parentId = this.addFromRef.current.formRef.current.getFieldValue('parentCategoryName')
    
            const newCategoryName = this.addFromRef.current.formRef.current.getFieldValue('newCategoryName')
    
            const result = await reqAddCategory(parentId, newCategoryName)
    
            // 3. 更新列表
            if(result.status === 0){
                if(parentId === this.state.parentId){
                    this.getCategories()
                }
                // else if(parentId === '0'){
                //     // 如果在二级列表中添加一级分类，更新state中level1Category的内容，但是不显示一级列表
                //     // 如果设置了parentId等于0，就会显示一级列表，所以只更行level1Category中的数据
                //     // this.setState({parentId: '0'},()=>{
                //     //     this.getCategories()
                //     // })
                // }
            }else{
                message.error('Add new category error')
            }
    
            // 4. 清除输入框中之前的内容
    
            this.addFromRef.current.formRef.current.setFieldsValue({
                newCategoryName:''
            })
        }


    }
    
    // 更新分类
    updateCategory = async () =>{

        const result = await this.formRef.current.formRef.current.validateFields()

        if(result){
            /**
             * 1. 关闭弹窗
             */
            this.setState({
                showStatus: 0,
                
            })
    
            //2. 发送更新请求 (准备数据)
            const categoryId = this.category._id
    
            const categoryName = this.formRef.current.formRef.current.getFieldValue('categoryName')
    
            console.log(this.formRef)
    
            const result = await reqUpdateCategory(categoryId,categoryName)
    
            if(result.status === 0){
                //3. 刷新category列表
                this.getCategories()
            }else{
                message.error('Update categroy error')
            }
        }
    }


    componentDidMount(){

        this.getCategories()
    }

    render(){
        // 读取状态数据
        const { level1Categories, loading, level2Categories, parentId, parentName, showStatus} = this.state
        // 读取指定分类
        const category = this.category || {} // 如果没有值，就传入一个空对象
        
        // card的左侧title
        const title = parentId ==='0'? 'Main Category':(
            <span>
                <LinkButton onClick={this.showCategories}>Main Category</LinkButton>
                <ArrowRightOutlined style={{marginRight: 10}}/>
                <span>{parentName}</span>
            </span>
        )

        const extra = (
            <Button type="primary" icon={<PlusOutlined/>} onClick={this.showAddModal}>Add</Button>
        )

        return(
            <Card title={title} extra={extra} >
                <Table 
                  columns={this.columns} 
                  dataSource={parentId === '0'? level1Categories: level2Categories}
                  bordered = {true}
                  rowKey = '_id'
                  pagination = {{defaultPageSize:PAGE_SIZE, showQuickJumper: true}}
                  loading = {loading}
                /> 

                <Modal 
                    title="Add new category" 
                    visible={showStatus === 1} 
                    onOk={this.addCategory} 
                    onCancel={this.closeModal}
                >
                    <AddForm 
                        level1Categories={level1Categories} 
                        parentId={parentId}
                        ref={this.addFromRef}
                    />

                </Modal>

                <Modal 
                    title="Update category" 
                    visible={showStatus === 2} 
                    onOk={this.updateCategory} 
                    onCancel={this.closeModal}
                >
                    <UpdateForm 
                        categoryName={JSON.stringify(category) === '{}'?'':category.name}
                        // 将该ref传递个子组件
                        ref={this.formRef}
                        />

                </Modal>

            </Card>
        )
    }
}