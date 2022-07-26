import { createContext, useContext, useState } from "react";
import ReactDOM from "react-dom";
import "./modal.css";

const defaultValues = {
  visible: false,
  showModal: () => {},
  hideModal: () => {},
  modalContent: <div />,
};

const ModalContext = createContext(defaultValues);

export const useModal = () => {
  const state = useContext(ModalContext);
  return state;
};

function Modal() {
  const { modalContent, visible } = useContext(ModalContext);
  return visible
    ? ReactDOM.createPortal(
        <div className="modal-overlay">{modalContent}</div>,
        document.querySelector("#modal-root") || document.body
      )
    : null;
}

const { Provider } = ModalContext;

function ModalProvider({ children }) {
  const [visible, setVisible] = useState(false);
  const [modalContent, setModalContent] = useState();
  function showModal(body) {
    setVisible(true);
    if (body) {
      setModalContent(body);
    }
  }
  function hideModal() {
    setVisible(false);
  }

  return (
    <Provider value={{ visible, showModal, hideModal, modalContent }}>
      <Modal />
      {children}
    </Provider>
  );
}

export { ModalContext, ModalProvider, Modal };
