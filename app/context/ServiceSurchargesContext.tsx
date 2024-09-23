"use client";
import React, { createContext, useReducer, useState } from "react";
import { OnlineOrderConfig } from "../src/types";

export type ServiceSurchargesContextType = {
  state: OnlineOrderConfig;
  currentOnlineOrderConfig: OnlineOrderConfig; // Add this to the context

  dispatch: React.Dispatch<FormAction>;
  loadOnlineOrderForEdit: (pos: OnlineOrderConfig) => void; // Implement this
  
  updatePosOrderTypesClicked: boolean;
  setUpdatePosOrderTypesClicked: (_clicked: boolean) => void;

};

const initialState: OnlineOrderConfig = {
  dineInEnabled:false,
  takeAwayEnabled:false,
  cardFeePercent:0,
  isTyroLocationIdValid:false,
  onlineOrderingPaused:false,
  orderReadyTime:0,
  tyroLocationId:''
};

export type FormAction = { type: "SET_CURRENT_ONLINE_ORDER"; payload: OnlineOrderConfig | null };

export const ServiceSurchargesContext = createContext<ServiceSurchargesContextType>({
  state: initialState,
  currentOnlineOrderConfig: initialState, // Add this to the initial context value
  dispatch: () => {},
  loadOnlineOrderForEdit: () => {},
  updatePosOrderTypesClicked: false,
  setUpdatePosOrderTypesClicked: () => {},
  
});

export const ServiceSurchargesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [updatePosOrderTypesClicked, setUpdatePosOrderTypesClicked] = useState(false);
  const [state, dispatch] = useReducer((prevState: OnlineOrderConfig, action: FormAction) => {
    switch (action.type) {
      case "SET_CURRENT_ONLINE_ORDER":
        return { ...prevState, ...action.payload };
      default:
        return prevState;
    }
  }, initialState);

  const loadOnlineOrderForEdit = (pos: OnlineOrderConfig) => {
    dispatch({ type: "SET_CURRENT_ONLINE_ORDER", payload: pos });
  };

  return (
    <ServiceSurchargesContext.Provider
      value={{
        state,
        currentOnlineOrderConfig: state, // Pass the state as currentPosConfig
        dispatch,
        loadOnlineOrderForEdit,
        updatePosOrderTypesClicked,
        setUpdatePosOrderTypesClicked,
      }}
    >
      {children}
    </ServiceSurchargesContext.Provider>
  );
};
