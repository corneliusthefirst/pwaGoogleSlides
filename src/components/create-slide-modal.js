import React, { useState } from "react";
import Box from "@mui/material/Box";
import CloseIcon from "@mui/icons-material/Close";
import useWindowDimensions from "./useWindowDimentions";
import TextEditor from "./TextEditor";
import { useModal } from "../context/modal-context/modal-context";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 5,
};

export default function SlideModal({
  addData,
}) {
  const screenDimensions = useWindowDimensions();
  const modal = useModal();
  const { hideModal } = modal;
  const [state, setState] = useState({
    title: "",
    description: "",
  });


  const onChangeTitle = (event) => {
    setState({...state, title: event.target.value});
  };

  const onChangeDescription = (val) => {
    setState({...state, description: val});
  };

  const addSlide = () => {
    addData(state);
    hideModal();
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
          onClick={hideModal}
        >
          <CloseIcon />
        </div>

        <input
          placeholder="Add the Title"
          className="add-input"
          onChange={onChangeTitle}
          value={state.title}
          style={{ marginBottom: 20 }}
        />
        <div
          className="createSlide-inner overflow-y-scroll"
          style={{
            height:
              screenDimensions.height < 800
                ? 0.6 * screenDimensions.height
                : 550,
          }}
        >
          <TextEditor
            description={state.description}
            onChange={onChangeDescription}
            handleImage
          />
        </div>

        <div className="button-container">
          <button className="add-docs" onClick={addSlide}>
            Add
          </button>
        </div>
      </Box>
    </div>
  );
}
