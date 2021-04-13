import { message } from 'antd'
import jsonp from 'jsonp'
import ajax from './ajax'

// export function reqLogin(username, password){
//     return ajax('/login', {username, password}, 'POST')
// }

let BASE = 'http://localhost:3000'

export const reqLogin = (username,password) => ajax(BASE + '/login', {username, password}, 'POST')

export const reqAddUser = (user) => ajax(BASE + '/manage/user/add', user, 'POST')

/**
 * jsonp封装， 处理跨域get请求, 返回promise对象
 */
export const reqWeather = (city) => {

    return new Promise((resolve, reject)=>{
        const url = 'http://api.openweathermap.org/data/2.5/weather?q='+encodeURIComponent(city)+',au&appid=7b793389d783d57bb6f6b0bcd5b37ba9&units=metric'
        jsonp(url, {}, (err, data) =>{
            if(!err && data.cod === 200){
                const weather = data.weather[0].main
                const iconUrl = 'http://openweathermap.org/img/wn/' + data.weather[0].icon + '@2x.png' 
                const temp = parseInt(data.main.temp)
                resolve({weather,iconUrl, temp})
            }else{
                message.error("Can't get weather info")
            } 
        })
    })
}


/** 
 * 商品分类接口函数
 * */ 
// 获取一级，二级分类的列表
export const reqGetCategoryListByParentId = (parentId) => ajax(BASE + '/manage/category/list', {parentId})

// 添加分类
export const reqAddCategory = (parentId, categoryName) => ajax(BASE + '/manage/category/add', {categoryName, parentId}, 'POST')

// 更新分类
export const reqUpdateCategory = (categoryId, categoryName) => ajax(BASE + '/manage/category/update', {categoryId, categoryName}, 'POST')

// 根据分类id获取分类信息
export const reqGetCategoryById = (categoryId) => ajax(BASE + '/manage/category/info', {categoryId})

/**
 * 商品接口函数
 * */ 
// 获取产品列表 get
export const reqGetProductList = (pageNum, pageSize) => ajax(BASE + '/manage/product/list', {pageNum, pageSize})

// 搜索商品分页列表
// searchType的值是 productName/proudctDesc (其中[]的值为是将searchType的值传递到请求中)
export const reqSearchProducts = ({pageNum ,pageSize, searchType,searchKeywords}) => ajax(BASE + '/manage/product/search', {
    pageNum,
    pageSize,
    [searchType]: searchKeywords
})

// 更新商品的状态，1：已上架 2：已下架
export const reqUpdateStatus =  (productId, status) => ajax(BASE + '/manage/product/updateStatus', {productId, status}, 'POST')

// 删除商品照片
export const reqDeleteImgByImgName = (name) => ajax(BASE + '/manage/img/delete', {name}, 'POST')

/**
 * 角色接口函数
 */
// 获取角色列表
export const reqGetRoles = () => ajax(BASE + '/manage/role/list')

// 添加角色(这个方法的形参不能随便的定义， 需要和接口文档上的名字保持一致)
export const reqAddRole = (roleName) => ajax(BASE + '/manage/role/add', {roleName},'POST')

// 更新角色(这个方法的形参不能随便的定义， 需要和接口文档上的名字保持一致)
export const reqUpdateRole = (role) => ajax(BASE + '/manage/role/update', role, 'POST')