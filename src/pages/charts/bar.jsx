import React, {Component} from 'react'
import {Card, Button } from 'antd'
import ReactEcharts from 'echarts-for-react'

/**
 * 柱状图路由组件
 */
export default class Bar extends Component{

    state = {
        sales: [5, 20, 36, 10, 10, 20], // 销量数据
        stock: [50, 10, 25, 20, 15, 10], // 库存数组
    }

    update = () =>{
        this.setState(state => ({
            sales: state.sales.map(sale => sale + 1),
            stock: state.stock.reduce((pre, eachStock)=>{
                pre.push(eachStock-1)
                return pre

            }, []),
        }))
    }

    getOption = (sales, stores) => {
        return {
          title: {
            text: 'ECharts bar chart'
          },
          tooltip: {},
          legend: {
            data:['Sale', 'Stock']
          },
          xAxis: {
            data: ["TB038H-17188","TB038F-17188","TB039H-17188","TB038H-17188JK","BUD1500","CT7-1200"]
          },
          yAxis: {},
          series: [{
            name: 'Sale',
            type: 'bar',
            data: sales
          }, {
            name: 'Stock',
            type: 'bar',
            data: stores
          }]
        }
      }

    render(){

        const {sales, stock} = this.state

        return(
            <div> 
                <Card>
                    <Button type="primary" onClick={this.update}>Update</Button>
                </Card>

                <Card title="bar chart">
                    <ReactEcharts option={this.getOption(sales,stock)} />
                </Card>
            </div>
        )
    }
}