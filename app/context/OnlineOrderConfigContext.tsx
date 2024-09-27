"use client";
import React, { createContext, useReducer, useState } from "react";
import { OnlineOrderConfig } from "../src/types";

export type OnlineOrderContextType = {
  state: OnlineOrderConfig;
  currentOnlineOrderConfig: OnlineOrderConfig; // Add this to the context
  pageKey: number;
  setPageKey: (status: number) => void;

  dispatch: React.Dispatch<FormAction>;
  loadOnlineOrderForEdit: (pos: OnlineOrderConfig) => void; // Implement this
  updateOrderReadyTimesClicked: boolean;
  setUpdateOrderReadyTimesClicked: (_clicked: boolean) => void;
  updateTyroLocationIdClicked: boolean;
  setUpdateTyroLocationIdClicked: (_clicked: boolean) => void;
  setUpdateOnlinePaymentSurchargeClicked: (_clicked: boolean) => void;
  updateOnlinePaymentSurchargeClicked: boolean;
  setAddTyroLocationIdClicked: (_clicked: boolean) => void;
  addTyroLocationIdClicked: boolean;
  updatePosOrderTypesClicked: boolean;
  setUpdatePosOrderTypesClicked: (_clicked: boolean) => void;
};

const initialState: OnlineOrderConfig = {
  dineInEnabled: false,
  takeAwayEnabled: false,
  cardFeePercent: 1.9,
  cardFeeFixedCharge: 9,
  isTyroLocationIdValid: false,
  onlineOrderingPaused: false,
  orderReadyTime: 15,
  tyroLocationId: "",
};

export type FormAction = {
  type: "SET_CURRENT_ONLINE_ORDER";
  payload: OnlineOrderConfig | null;
};

export const OnlineOrderConfigContext = createContext<OnlineOrderContextType>({
  state: initialState,
  currentOnlineOrderConfig: initialState,
  pageKey: 1,
  setPageKey: () => {},
  dispatch: () => {},
  loadOnlineOrderForEdit: () => {},
  updatePosOrderTypesClicked: false,
  setUpdatePosOrderTypesClicked: () => {},
  updateOrderReadyTimesClicked: false,
  setUpdateOrderReadyTimesClicked: () => {},
  updateTyroLocationIdClicked: false,
  setUpdateTyroLocationIdClicked: () => {},
  addTyroLocationIdClicked: false,
  setUpdateOnlinePaymentSurchargeClicked: () => {},
  updateOnlinePaymentSurchargeClicked: false,
  setAddTyroLocationIdClicked: () => {},
});

export const OnlineOrderConfigProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [updatePosOrderTypesClicked, setUpdatePosOrderTypesClicked] =
    useState(false);
  const [updateOrderReadyTimesClicked, setUpdateOrderReadyTimesClicked] =
    useState(false);
  const [updateTyroLocationIdClicked, setUpdateTyroLocationIdClicked] =
    useState(false);
  const [
    updateOnlinePaymentSurchargeClicked,
    setUpdateOnlinePaymentSurchargeClicked,
  ] = useState(false);
  const [addTyroLocationIdClicked, setAddTyroLocationIdClicked] =
    useState(false);
  const [pageKey, setPageKey] = useState(1);

  const [state, dispatch] = useReducer(
    (prevState: OnlineOrderConfig, action: FormAction) => {
      switch (action.type) {
        case "SET_CURRENT_ONLINE_ORDER":
          return { ...prevState, ...action.payload };
        default:
          return prevState;
      }
    },
    initialState
  );

  const loadOnlineOrderForEdit = (pos: OnlineOrderConfig) => {
    dispatch({ type: "SET_CURRENT_ONLINE_ORDER", payload: pos });
  };

  return (
    <OnlineOrderConfigContext.Provider
      value={{
        state,
        pageKey,
        setPageKey,
        currentOnlineOrderConfig: state, // Pass the state as currentPosConfig
        dispatch,
        loadOnlineOrderForEdit,
        updatePosOrderTypesClicked,
        setUpdatePosOrderTypesClicked,
        updateOrderReadyTimesClicked,
        setUpdateOrderReadyTimesClicked,
        updateTyroLocationIdClicked,
        setUpdateTyroLocationIdClicked,
        setUpdateOnlinePaymentSurchargeClicked,
        updateOnlinePaymentSurchargeClicked,
        setAddTyroLocationIdClicked,
        addTyroLocationIdClicked,
      }}
    >
      {children}
    </OnlineOrderConfigContext.Provider>
  );
};
