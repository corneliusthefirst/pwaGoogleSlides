import React, { useContext, useEffect, useState } from "react";
import storage from "./storage";

const AppStateContextDefault = {
  appState: {
    activeSlide: null,
    user: null,
    isLoggedIn: false,
  },
  setAppState: () => null,
  initializeApp: () => null,
};

export const AppStateContext = React.createContext(AppStateContextDefault);

const { Provider } = AppStateContext;

export const useAppState = () => {
  const state = useContext(AppStateContext);
  return state;
};

export const AppStateContextProvider = ({ children }) => {
  const [appState, setState] = useState({});

  const setAppState = (data) => {
    const state = { ...appState, ...data };
    setState(state);
    storage.setItem("appState", state);
  };

  const initializeApp = async () => {
    //do all the initialisation here and set the context
    const state = await storage.getItem("appState");
    setState(state);
    return state;
  };

  useEffect(() => {
    initializeApp();
  }, []);

  return (
    <Provider
      value={{
        appState,
        setAppState,
        initializeApp,
      }}
    >
      {children}
    </Provider>
  );
};
