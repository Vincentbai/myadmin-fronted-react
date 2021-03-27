/**
 * 能发异步ajax请求的函数模块
 * 封装axios库
 * 函数的返回值是promise对象
 * 1. 优化： 统一处理请求异常，
 *  在外层包一个自己的创建的promise对象
 *  在请求出错时不去reject，而是加上自己的错误处理
 * 2. 优化2：返回 reponse data
 */

 import axios from 'axios'
 import {message} from 'antd'

 export default function ajax(url, data={}, type='GET'){

    return new Promise((resolve, reject)=>{

        let promise
    
        if(type === 'GET'){
            promise = axios.get(url,{ //配置对象
                params:data // 指定请求参数
            });
        }else{
            promise = axios.post(url, data)
        }
    
        promise.then(response=>{
            resolve(response.data)
        }).catch(error=>{
            message.error('Request Error! ' + error.message)
        })
    })

 }