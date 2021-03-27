import React, { useState, forwardRef, useImperativeHandle, useEffect } from 'react'
import { message, Upload } from 'antd'
import ImgCrop from 'antd-img-crop'
import PropTypes from 'prop-types'

import { reqDeleteImgByImgName } from '../../api/index'
import { BASE_IMG_URL } from '../../utils/constants'

const ImageUploader = forwardRef((props, ref) => {

  // 如果是修改商品，则根据product.imgs初始化fileList数据
  useEffect(() => {
    let fileList = []
    const {imgs} = props
    console.log(imgs)
    if(imgs && imgs.length>0){
      fileList = imgs.map((img, index)=>({
        uid: -index,
        name: img,
        status: 'done',
        url: BASE_IMG_URL + img,
      }))
    }
  })

  const [fileList, setFileList] = useState([
    
  ])

  // 该函数是为了让父组件调用, 获取file names
  /**
   * 子组件如何调用父组件的方法: 父组件将方法以函数属性的方式传递给子组件, 子组件就可以调用了
   * 父组件如何调用子组件的方法: 在父组件中通过ref来获取子组件的标签对象（也就是组件对象），然后调用其方法
   */
  useImperativeHandle(ref, ()=>({
    getImgNames(){
      return fileList.map(file => file.name)
    }
  }))

  // 当图片上传后系统会给文件重命名，将新名字返回回来
  const onChange = async ({file, fileList: newFileList }) => {

    // 上传图片后修改图片对象name和添加url属性, 因为原本的name是文件名, 
    // 但是当上传上系统后就会被重命名,新的文件名和url会被返回到response中
    // 当点击删除时，file状态变为 removed，fileList已经将被删除的照片删除
    if(file.status === 'done'){
      const result = file.response
      if(result.status === 0){
        message.success('Image uploaded successfully')
        const {name, url} = result.data
        file = newFileList[newFileList.length - 1]
        file.name = name
        file.url = url
      }else{
        message.error('Image uploaded Failure')
      }
    }else if(file.status === 'removed'){
      const result = await reqDeleteImgByImgName(file.name)
      if(result.status === 0){
        message.success('Image deleted successfully!')
      }else{
        message.error('Image deleted fail!')
      }
    }

    setFileList(newFileList);
  };

  const onPreview = async file => {
    let src = file.url;
    if (!src) {
      src = await new Promise(resolve => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow.document.write(image.outerHTML);
  };

  return (
    <ImgCrop rotate>
      <Upload
        action="/manage/img/upload"
        listType="picture-card" 
        name='image'
        fileList={fileList}
        onChange={onChange}
        onPreview={onPreview}
      >
        {fileList.length < 5 && '+ Upload'}
      </Upload>
    </ImgCrop>
  )
})

ImageUploader.propTypes = {
  imgs: PropTypes.array
}

export default ImageUploader