import React, {Component} from 'react'
import {
    Card,
    Select,
    Button,
    Input,
    Table,
    message,
} from 'antd'
import { PlusOutlined } from '@ant-design/icons'

import { reqGetProductList, reqSearchProducts, reqUpdateStatus} from '../../api/index'
import { PAGE_SIZE } from '../../utils/constants'

const Option = Select.Option
// const Item = Form.Item

/**
 * product的子路由
 */
export default class ProductHome extends Component{
    constructor(props){

        super(props)
 
        this.state = {
            pageNum: 1, // 初始的pageNum都是1
            productList: [], // 商品数组
            total: 0, // 商品的总数量
            loading: false,
            searchType: 'productName',
            searchKeywords: ''
        }

        this.initProductTableColums()
    }

    componentDidMount(){

        const { pageNum } = this.state

        this.getProductList(pageNum)
    }

    // 之所以要传入pageNum，是因为产品分页时需要使用，当点击第二页时，分页组件的回调函数就会将pageNum传递到该函数中
    getProductList = async (pageNum) =>{

        // 将当前页码保存起来，让其他函数使用
        this.pageNum = pageNum

        this.setState({loading: true})

        const {searchType, searchKeywords} = this.state

        let result

        if(searchKeywords){

            result = await reqSearchProducts({pageNum, pageSize:PAGE_SIZE, searchType, searchKeywords})

        }else{

            result = await reqGetProductList(pageNum, PAGE_SIZE)
        }

        this.setState({loading: false})

        if(result.status === 0){
            const {total, list} = result.data
            this.setState({
                total,
                productList: list
            })
        }else{
            message.error('Get product list error!')
        }
    }

    initProductTableColums = () =>{

        this.columns = [
            {
                title: 'Product Name',
                dataIndex: 'name',
            },
            {
                title: 'Description',
                dataIndex: 'desc',
            },
            {
                title: 'Price',
                dataIndex: 'price', // 当指定了某个属性，传入的就是该属性值，不是product的所有属性
                render:(price) =>'$' + price
                
            },
            {
                title: 'Status',
                width: 170,
                //dataIndex: 'status', // 当指定了某个属性，传入的就是该属性值，不是product的所有属性
                render:(product) =>{
                    const {status, _id} = product
                    return(
                        <span>
                            <span>{product.status === 1 ? 'Active' : 'Inactive'}</span>
                            <Button 
                                type="primary" 
                                onClick={()=>this.updateProductStatus(_id, status===1?2:1)}
                                style={{float:'right'}}
                            >
                                    {product.status === 1? 'Inactive': 'Active'}
                            </Button>
                        </span>
                    )
                }
                
            },
            {
                title: 'Operation',
                width: 160,
                render:(product) =>{
                    
                    return(
                        <div>
                            <Button 
                                type="primary" 
                                style={{marginRight:10}} 
                                // 将product对象使用state传递给目标路由组件
                                // 目标路由组件读取携带过来的数据，this.props.location.state 来获取
                                onClick={()=>this.props.history.push('/product/detail',{product})}
                            >View</Button>
                            <Button onClick={()=>this.props.history.push('/product/addUpdate', product)} type="edit">Edit</Button>
                        </div>
                    )

                }
            },
        ];

    }

    updateProductStatus = async (productId, newStatus) =>{
        const result = await reqUpdateStatus(productId, newStatus)
        if(result.status === 0){
            message.success("Update product status success!")
            this.getProductList(this.pageNum)
        }else{
            message.error("Update product status error!")
        }
    }

    render(){

        const { total, productList, loading, searchType, searchKeywords} = this.state

        const title = (
            <span>
                <Select 
                    value={searchType} 
                    style={{width:190}} 
                    onChange={value => this.setState({searchType: value})}
                >
                    <Option value="productName">Search By Name</Option>
                    <Option value="productDesc">Search By Description</Option>
                </Select>
                <Input 
                    placeholder="Keywords" 
                    style={{width:300, margin: '0 15px'}} 
                    value={searchKeywords}
                    onChange={e => this.setState({searchKeywords:e.target.value})}
                />

                {/* getProductList(1) 这个1 是pageNum*/}
                <Button type="primary" onClick={()=>this.getProductList(1)}>Search</Button>
            </span>
        )

        const extra = (
           <Button type="primary" onClick={()=>this.props.history.push('/product/addUpdate')}>
               <PlusOutlined />
               New Product
           </Button>
        )

        return(
            <Card title={title} extra={extra}>

                <Table
                    bordered
                    dataSource={productList} 
                    columns={this.columns} 
                    rowKey='_id'
                    pagination={{
                        defaultPageSize: PAGE_SIZE, 
                        showQuickJumper: true, 
                        total:total,

                        // 虽然没有设置形参，但是已经将点击的pageNum传递到该函数中
                        onChange: this.getProductList
                    }}
                    loading={loading}
                />
            </Card>
        )
    }
}