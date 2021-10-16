import React, { Component } from "react";
import { EditorState, convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "./Editor.css";
import "../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import axios from "axios";

export default class ControlledEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
    };
  }

  onEditorStateChange = (editorState) => {
    this.setState({
      editorState,
    });
  };

  componentDidUpdate(prevProps, prevState) {
    const prevContentState = convertToRaw(
      prevState.editorState.getCurrentContent()
    );
    const currentContentState = convertToRaw(
      this.state.editorState.getCurrentContent()
    );

    const images = [];
    if (prevContentState.blocks.length !== currentContentState.blocks.length) {
      let i = 0;
      while (currentContentState.entityMap[i]) {
        if (currentContentState.entityMap[i].type === "IMAGE") {
          images.push(currentContentState.entityMap[i].data.src);
        }
        i++;
      }

      let j = 0;
      while (prevContentState.entityMap[j]) {
        if (!images.includes(prevContentState.entityMap[j].data.src)) {
          axios
            .delete(prevContentState.entityMap[j].data.src)
            .then((result) => {
              console.log(result);
            });
        }
        j++;
      }
      console.log(images);
    }
  }

  imageUpload = async (e) => {
    const formData = new FormData();
    formData.append("file", e);
    const { data } = await axios.post("http://localhost:5000/image", formData);
    return { data: { link: `http://localhost:5000/${data.imageUrl}` } };
  };

  render() {
    const { editorState } = this.state;
    return (
      <Editor
        editorState={editorState}
        wrapperClassName="demo-wrapper"
        editorClassName="editor"
        onEditorStateChange={this.onEditorStateChange}
        toolbar={{
          image: {
            defaultSize: {
              width: "100%",
            },
            uploadCallback: this.imageUpload,
          },
        }}
      />
    );
  }
}
