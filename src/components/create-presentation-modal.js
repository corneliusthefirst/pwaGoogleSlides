import React, { useRef, useState } from "react";
import Box from "@mui/material/Box";
import ReactQuill from "react-quill";
import CloseIcon from "@mui/icons-material/Close";
import { Upload } from "upload-js";
import AddIcon from "@mui/icons-material/Add";
import useWindowDimensions from "./useWindowDimentions";
import { useModal } from "../context/modal-context/modal-context";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 5,
};

export default function PresentationModal({
  addPresentation,
}) {
  const screenDimensions = useWindowDimensions();
  const inputRef = useRef();
  var upload = new Upload({ apiKey: process.env.REACT_APP_UPLOAD_API });
  const modal = useModal();
  const [state, setState] = useState({
    title: "",
    content: "",
    presentationBkg: null,
    lightContent: false,
  });


  const uploadFile = upload.createFileInputHandler({
    onUploaded: ({ fileUrl, fileId }) => {
      setState({...state, presentationBkg: fileUrl});
    },
  });

  const onUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      uploadFile(e);
    }
  };
  const uploadBkg = () => {
    inputRef?.current?.click();
  };

  const setStateTitle = (e) => {
    setState({...state, title: e.target.value});
  }

  const setStateContent = (val) => {
    setState({...state, content: val});
  }
  const setStateLightContent = () => {
    setState({...state, lightContent: !state.lightContent});
  }

  return (
    <div>
      <Box
        sx={[
          style,
          {
            width:
              screenDimensions.width < 600 ? screenDimensions.width - 20 : 420,
          },
        ]}
      >
        <div
          style={{
            marginBottom: 30,
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "flex-end",
          }}
          onClick={modal.hideModal}
        >
          <CloseIcon />
        </div>

        <input
          placeholder="Add the Title"
          className="add-input"
          onChange={setStateTitle}
          value={state.title}
          style={{ marginBottom: 20 }}
        />
        <div
          style={{
            height:
              screenDimensions.height < 800
                ? 0.3 * screenDimensions.height
                : 300,
          }}
          className="presentation-inner overflow-y-scroll"
        >
          <ReactQuill
            className="react-quill"
            value={state.content}
            onChange={setStateContent}
            placeholder="Add your presentation  content here"
          />
        </div>

        <div className="flex flex-col">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            placeholder="Add Presentation Background"
            multiple={false}
            onChange={onUpload}
            className="hidden"
          />
          <div className="flex flex-row items-center justify-between mt-4">
            <div
              onClick={uploadBkg}
              className="cursor flex flex-row items-cente text-sm font-bold"
            >
              <AddIcon />
              <p>Background Image</p>
            </div>
            <label
              className="flex items-center"
              onClick={setStateLightContent}
            >
              <input
                type="radio"
                value={state.lightContent}
                checked={state.lightContent}
                name="dark-content"
                className="text-red-500 mr-1"
              />
              Light Content
            </label>
          </div>
          {state.presentationBkg && (
            <img src={state.presentationBkg} alt="presentation background" />
          )}
        </div>

        <div className="button-container">
          <button className="add-docs" onClick={() => addPresentation(state)}>
            Add
          </button>
        </div>
      </Box>
    </div>
  );
}
