import { auth } from "../services/firebase";
import React, {  useState } from "react";
import { useNavigate } from "react-router-dom";
import UserAvatar from "react-user-avatar";
import CloseIcon from "@mui/icons-material/Close";
import { useAppState } from "../context/app-state-context";

const Header = ({user}) => {
  const [modal, isModal] = useState(false);
  let navigate = useNavigate();


  return (
    <div>
      <nav className="header bg-teal-300 shadow-md top-0 px-8 py-3 mb-4">
        <div className="flex flex-row w-full items-center justify-between flex-wrap">
          <div onClick={() => navigate("/presentation")}>
            <h1 className="text-xl font-medium">PWA Slider</h1>
          </div>
          <div>
            {user && (
              <button onClick={() => isModal((current) => !current)}>
                 <UserAvatar size="48" name={user.displayName.toUpperCase()} /*src={user?.photoURL} */ />
              </button>
            )}
          </div>
        </div>
        {modal ? (
          <Modals navigate={navigate} user={user} isModal={isModal} />
        ) : null}
      </nav>
    </div>
  );
};

const Modals = ({ user, navigate, isModal }) => {
  const {setAppState} = useAppState();
  const signOut = () => {
    auth.signOut();
    setAppState({user: null, isLoggedIn: false});
    isModal(false);
    navigate("/login");
  };
  return (
    <div className=" absolute mr-12 mt-2 top-8 right-0 z-50 ring-2 ring-gray-100 bg-white rounded drop-shadow-md lg:w-1/5 md:w-1/2 w-4/5 flex flex-col justify-center items-center p-4 space-y-4">
         <div
          className="cursor cursor-pointer flex w-full flex-row justify-end items-center"
          onClick={() => isModal(false)}
        >
          <CloseIcon />
        </div>
      <img className="rounded-full w-14 h-14" src={user?.photoURL} alt="" />
      <h2 className="text-sm font-medium">{user?.displayName}</h2>
      <p className="text-sm font-medium text-gray-400 ">{user?.email}</p>
      <button
        className="rounded border-2 border-gray w-full py-2 hover:bg-slate-50"
        onClick={signOut}
      >
        Logout
      </button>
    </div>
  );
};

export default Header;
