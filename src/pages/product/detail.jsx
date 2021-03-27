import React, {Component} from 'react'
import {
    Card, 
    List,
} from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'

import {BASE_IMG_URL } from '../../utils/constants'
import { reqGetCategoryById } from '../../api/index'

const Item = List.Item
/**
 * product的详情子路由
 */
export default class ProductDetail extends Component{

    state = {
        cName1: '',
        cName2: '',
    }

    async componentDidMount(){

        const {pCategoryId, categoryId } = this.props.location.state.product
        if(pCategoryId === '0'){
            const result = await reqGetCategoryById(categoryId)
            const cName1 = result.data.name
            this.setState({cName1})
        }else{
            /*
            // 通过多个await的方式，发送多个请求，可以得到效果但是效率太低
            const result1 = await reqGetCategoryById(pCategoryId)
            const result2 = await reqGetCategoryById(categoryId)
            const cName1 = result1.data.name
            const cName2 = result2.data.name
            this.setState({cName1,cName2})
            */

            // 需要一次性发送多个请求，只有都成功了，才正常处理
            const results = await Promise.all([reqGetCategoryById(pCategoryId), reqGetCategoryById(categoryId)])
            const cName1 = results[0].name
            const cName2 = results[1].name
            this.setState({cName1,cName2})
        }
    }

    render(){

        const {name, desc, price, detail, imgs  } = this.props.location.state.product
        const {cName1, cName2} = this.state

        const title = (
            <span>
                <ArrowLeftOutlined 
                    style={{color:'green', marginRight:15, fontSize:20, cursor: 'pointer'}}
                    onClick={() => this.props.history.goBack()}    
                />
                <span style={{fontSize:20}}>Product Detail</span>
            </span>
        )

        return(
            <Card title={title} className="product-detail">

                <List>
                    <Item>
                        <div className="left">Product Name:</div>
                        {name}
                    </Item>
                    <Item>
                        <span className="left">Product Description:</span>
                        {desc}
                    </Item>

                    <Item>
                        <span className="left">Product Price:</span>
                        ${price}
                    </Item>
                    <Item>
                        <span className="left">Product Categories:</span>
                        {cName1} {cName2 ? ' --> ' + cName2:null}
                    </Item>
                    <Item>
                        <div>
                            <span className="left">Product photos:</span>
                            
                            {/* 如果照片数组第一值为空值，那么该商品没有照片 */}
                            {imgs[0] !== '' ? 
                                (imgs.map((value, index) => {
                                    return <img className="product-img" src={BASE_IMG_URL + value} alt="productImg" key={index}/>
                                })):
                                ''
                            }
                        </div>
                    </Item>
                    <Item>
                        <div>
                            <span className="left">Product Detail:</span>
                            <span dangerouslySetInnerHTML={{__html: detail}}></span>
                        </div>
                    </Item>
                </List>
            </Card>
        )
    }
}