import React, {Component} from 'react'
import { Upload, Modal, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import {PropTypes} from 'prop-types'

import { reqDeleteImgByImgName } from '../../api'
import { BASE_IMG_URL } from '../../utils/constants'

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })
}

export default class PicturesWall extends Component {

    constructor(props){

      super(props)        

      this.state = {
        previewVisible: false,
        previewImage: '',
        previewTitle: '',
        fileList: [],
      }
    }
      
    componentDidMount(){
        
      const {imgs} = this.props

      if(imgs && imgs.length >0){
          let fileList = imgs.map((img,index) =>({
              uid: -index,
              name: img,
              status: 'done',
              url: BASE_IMG_URL + img,
          }))
          console.log(fileList)
          this.setState({fileList})
      }
    }

    static propTypes = {
        imgs: PropTypes.array
    } 

    getImgNames(){
        return this.state.fileList.map(file => file.name)
    }

    handleCancel = () => this.setState({ previewVisible: false })

    handlePreview = async file => {
        if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj)
        }

        this.setState({
        previewImage: file.url || file.preview,
        previewVisible: true,
        previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
        })
    }

  handleChange = async ({file, fileList }) => {

    console.log('change()', file)
    if(file.status === 'done'){
        const result = file.response
        if(result.status === 0){
            message.success('Image uploaded successfully!')
            const {name, url} = result.data
            file = fileList[fileList.length - 1]
            file.name = name
            file.url = url
        }else {
            message.error('Image uploaded error!')
        }
    }else if(file.status === 'removed'){

        const result = await reqDeleteImgByImgName(file.name)

        if(result.status === 0){
            message.success('Image deleted successfully!')
        }else{
            message.success('Image deleted error!')
        }
    }
    this.setState({ fileList })

  }

  render() {
    const { previewVisible, previewImage, fileList, previewTitle } = this.state
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
    )
    return (
      <>
        <Upload
          action="/manage/img/upload"
          listType="picture-card"
          accept="image/*"
          name="image"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length >= 5 ? null : uploadButton}
        </Upload>

        <Modal
          visible={previewVisible}
          title={previewTitle}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img alt="product image" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </>
    )
  }
}
