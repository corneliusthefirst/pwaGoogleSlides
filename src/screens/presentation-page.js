import React, { useState, useEffect } from "react";
import { addDoc, collection, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { useLocation } from "react-router-dom";
import SlideModal from "../components/create-slide-modal";
import EditSlide from "./edit-slide-page";
import { useAppState } from "../context/app-state-context";
import useWindowDimensions from "../components/useWindowDimentions";
import InviteFriendsModal from "../components/invite-friends-modal";
import { useModal } from "../context/modal-context/modal-context";
import { toast } from "react-toastify";

var truncate = require("html-truncate");

const defaultMsg = {
  title: ".",
  description: ".",
  id: ".",
};

export default function Presentation({ database, user }) {
  const { appState, setAppState } = useAppState();
  const { activeSlide } = appState;
  const [slideList, setSlideList] = useState([]);
  const location = useLocation();
  const { presentation, presentation_background, styles} = location.state;
  const screenDimensions = useWindowDimensions();
  const isMobile = screenDimensions.width < 600;
  const collectionRef = collection(database, "slideList");
  const presentationRef = collection(database, "presentation");
  const modal = useModal();

  const addData = (state) => {
    addDoc(collectionRef, {
      title: state.title,
      description: state.description,
      presentation_id: presentation.id,
    })
      .then(() => {
        toast.success("Slide Added");
        modal.hideModal();
      })
      .catch(() => {
        toast.error("Cannot add data");
      });
  };

  const setActiveSlide = (slide) => {
    setAppState({ activeSlide: slide });
  };

  useEffect(() => {
    const getData = () => {
      onSnapshot(collectionRef, (data) => {
        const slides =
          data.docs.reduce((acc, doc) => {
            const slide = { ...doc.data(), id: doc.id };
            if (slide?.presentation_id === presentation.id) {
              return [...acc, slide];
            }
            return acc;
          }, []) || [];

        setSlideList(slides);
      });
    };

    getData();
  }, [collectionRef, presentation.id, setSlideList]);

  const renderMobile = () => {
    return (
      <div className="flex flex-col justify-center">
        <div className="w-full overflow-x-scroll my-8  flex flex-row  items-center border-2 border-gray-300 px-2">
          {slideList?.map((doc, index) => {
            return (
              <div
                key={index}
                className={`h-full p-2 m-2 ${
                  activeSlide?.id === doc.id ||
                  (slideList?.[0]?.id === doc.id && !activeSlide)
                    ? "bg-teal-300"
                    : ""
                }`}
                style={{
                  maxWidth: screenDimensions.width - 40,
                  minWidth: 0.7 * screenDimensions.width,
                }}
              >
                <div
                  key={index}
                  className="grid-child bg-white h-40 "
                  onClick={() => setActiveSlide(doc)}
                >
                  <p className="font-bold text-xl py-2">
                    {doc.title.charAt(0).toUpperCase() + doc.title.slice(1)}
                  </p>
                  <div
                    className="text-gray-500"
                    style={{ maxHeight: 100 }}
                    dangerouslySetInnerHTML={{
                      __html: truncate(doc.description, 100),
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div
          className={`border-2 mt-8 mb-16 border-gray-200 ${
            isMobile ? "" : " px-8"
          }`}
          style={{
            backgroundImage: `url(${presentation_background})`,
          }}
        >
          <div className=" mt-4">
            <EditSlide
              styles={styles}
              presentation_background={presentation_background}
              slide={activeSlide || slideList?.[0] || defaultMsg}
            />
          </div>
        </div>
      </div>
    );
  };

  const renderDesktop = () => {
    return (
      <div className="flex flex-row justify-center min-h-screen mb-8 ">
        <div className="mr-8 border-2 border-gray-300  px-2">
          {screenDimensions.width > 600 &&
            slideList?.map((doc, index) => {
              return (
                <div
                  key={index}
                  className={`p-2 mt-2 ${
                    activeSlide?.id === doc.id ||
                    (slideList?.[0]?.id === doc.id && !activeSlide)
                      ? "bg-teal-300"
                      : ""
                  }`}
                >
                  <div
                    key={index}
                    className="grid-child bg-white h-44"
                    style={{
                      width: 220,
                    }}
                    onClick={() => setActiveSlide(doc)}
                  >
                    <p className="font-bold text-xl py-2">
                      {doc.title.charAt(0).toUpperCase() + doc.title.slice(1)}
                    </p>
                    <div
                      className="text-gray-500"
                      style={{ maxHeight: 100 }}
                      dangerouslySetInnerHTML={{
                        __html: truncate(doc.description, 100),
                      }}
                    />
                  </div>
                </div>
              );
            })}
        </div>
        <div className="border-2 border-gray-200 px-8">
          <div
            className="grid-child my-4"
            style={{
              backgroundImage: `url(${presentation_background})`,
            }}
          >
            <EditSlide styles={styles} slide={activeSlide || slideList?.[0] || defaultMsg} />
          </div>
        </div>
      </div>
    );
  };

  const updateEditors = (users) => {
    const document = doc(presentationRef, presentation.id);
    updateDoc(document, {
      ...presentation,
      editors: users,
    })
      .then(() => {
        toast.success("Editors added successfully");
      })
      .catch(() => {
        alert("Cannot add data");
      });
  };
  const openInvite = () => {
    const canEdit = user?.uid === presentation.id_user;
    if(canEdit){
    modal.showModal(<InviteFriendsModal updateEditors={updateEditors} presentation={presentation}/>);
    }else{
      toast.success("Only the creator of the presentation can add new editors");
    }
  };

  const addSlide = () => {
    modal.showModal(
      <SlideModal
        addData={addData}
      />
    );
  };
  return (
    <div className="docs-main">
      <div
        className={`flex ${
          isMobile ? "flex-col items-center" : "flex-row justify-center "
        }`}
      >
        <button className="add-docs mb-8" onClick={addSlide}>
          Add a Slide
        </button>
        <button
          className={`invite mb-8 ${isMobile ? "" : "ml-8"}`}
          onClick={openInvite}
        >
          Invite a Friend
        </button>
      </div>
      {slideList.length > 0 && (isMobile ? renderMobile() : renderDesktop())}
    </div>
  );
}
