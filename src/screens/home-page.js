import React, { useState, useEffect } from "react";
import { addDoc, collection, onSnapshot } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import defaultPresentationBkg from "../assets/images/slide_background.jpeg";
import useWindowDimensions from "../components/useWindowDimentions";
import PresentationModal from "../components/create-presentation-modal";
import { useModal } from "../context/modal-context/modal-context";
import ChatIcon from '@mui/icons-material/Chat';
import { toast } from "react-toastify";
import {getConnectStatus} from "../services/firebase";

export default function Home({ database, user }) {
  let navigate = useNavigate();
  const [presentationList, setPresentationList] = useState([]);
  const screenDimensions = useWindowDimensions();
  const collectionRef = collection(database, "presentation");
  const slidesRef = collection(database, "slideList");
  const modal = useModal();

  const addPresentation = (body) => {

    addDoc(collectionRef, {
      id_user: user.uid,
      editors: [],
      title: body.title,
      content: body.content,
      presentation_background: body.presentationBkg,
      lightContent: body.lightContent,
    })
      .then(() => {    
//offline 
      if(getConnectStatus === false){
        toast.success("Presentation Added");
        modal.hideModal();
      }
    //onLine
        toast.success("Presentation Added");
        modal.hideModal();
      })
      .catch(() => {
       toast.error("Cannot add Presentation");
      });
  };

  useEffect(() => {
    const getData = () => {
      onSnapshot(collectionRef, (data) => {
        const list =   data.docs?.map((doc) => {
          return { ...doc.data(), id: doc.id };
        }) || []
        setPresentationList(list.filter((_presentation) => _presentation.id_user === user.uid || 
        _presentation.editors.filter((_editor) => _editor.uid === user.uid).length > 0));
      });
    };
    getData();
  }, [collectionRef]);

  const gotoPresentation = (presentation, presentation_background, styles) => {
    navigate(`/presentation/${presentation.id}`, {
      state: {
        presentation: presentation,
        presentation_background: presentation_background,
        styles: styles,
      },
    });
  };

  const gotoReveal = (presentation, presentation_background, styles) => {
    onSnapshot(slidesRef, (data) => {
      const slides = data.docs.reduce((acc, doc) => {
        const slide = { ...doc.data(), id: doc.id };
        if (slide?.presentation_id === presentation.id) {
          return [...acc, slide];
        }
        return acc;
      }, []);
      navigate(`/presentation/reveal/${presentation.id}`, {
        state: {
          slideList: slides,
          presentation_background: presentation_background,
          styles: styles,
        },
      });
    });
  };
  const gotoChat = (presentation, presentation_background, styles) => {
    navigate(`/presentation/chat/${presentation.id}`, {
      state: {
        presentation: presentation,
        presentation_background: presentation_background,
        styles: styles,
      },
    });
  };
  const openAddPresentation = () => {
    modal.showModal(
      <PresentationModal
        addPresentation={addPresentation}
      />
    );
  };

  return (
    <div className="docs-main">
      <button className="add-docs" onClick={openAddPresentation}>
        Add a Presentation
      </button>

      <div className="grid-main">
        {presentationList.map((doc, index) => {
          const presentation_background =
            doc?.presentation_background || defaultPresentationBkg;
          const styles = doc?.lightContent
            ? {
                isLight: true,
                primary: "text-white",
                secondary: "text-gray-100",
              }
            : {
                isLight: false,
                primary: "text-black",
                secondary: "text-gray-700",
              };

          return (
            <div
              key={index}
              className="grid-child mt-4"
              style={{
                width:
                  screenDimensions.width < 600
                    ? screenDimensions.width - 20
                    : 420,
                backgroundImage: `url(${presentation_background})`,
              }}
            >
              <div
               
                className={`w-full  ${styles.primary} flex flex-row justify-between items-center`}
              >
                <div  onClick={() => gotoReveal(doc, presentation_background, styles)}>
                <VisibilityIcon />
                </div>
                <div  onClick={() => gotoChat(doc, presentation_background, styles)}>
                <ChatIcon />
                </div>
              </div>
              <div
                onClick={() =>
                  gotoPresentation(doc, presentation_background, styles)
                }
              >
                <p className={`font-bold text-xl py-2 ${styles.primary}`}>
                  {doc.title.charAt(0).toUpperCase() + doc.title.slice(1)}
                </p>
                <div
                  className={`text-xs ${styles.secondary}`}
                  dangerouslySetInnerHTML={{ __html: doc.content }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
