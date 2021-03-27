import React, { Component } from 'react'
import { EditorState, convertToRaw, ContentState} from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import PropTypes from 'prop-types'


export default class RichTextEditor extends Component {

    static propTypes = {
        productDetail: PropTypes.string
    }

    constructor(props) {
        super(props);
        const html = this.props.productDetail;

        // 如果有值就初始化，如果没有就创建一个空对象
        if(html){
            const contentBlock = htmlToDraft(html);
            if (contentBlock) {
              const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
              const editorState = EditorState.createWithContent(contentState);
              this.state = {
                editorState,
              };
            }
        }else{
            this.state = {
                editorState: EditorState.createEmpty(),
            }
        }
    }

    // 输入过程中实时的回调，存储最新的内容状态
    onEditorStateChange = (editorState) => {
        this.setState({
        editorState,
        })
    }

    getProductDetail = () =>{
        return draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
    }

    render() {
        const { editorState } = this.state
        return (
            <Editor
            editorState={editorState}
            editorStyle={{border: '1px solid Gainsboro', height: 200, paddingLeft: 10}}
            onEditorStateChange={this.onEditorStateChange}
            />
        )
    }
}