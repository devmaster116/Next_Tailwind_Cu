"use client";
import React, { createContext, useReducer, useState } from "react";
import { Configs } from "../src/types";

export type PosConfigContextType = {
  state: Configs;
  currentPosConfig: Configs; // Add this to the context

  pageKey: number;
  setPageKey: (status: number) => void;

  bannerLabel: string;
  setBannerLabel: (status: string) => void;

  dispatch: React.Dispatch<FormAction>;
  loadPosConfigForEdit: (pos: Configs) => void; // Implement this

  updatePosRegisterScreenClicked: boolean;
  setUpdatePosRegisterScreenClicked: (_clicked: boolean) => void;

  updatePosOrderFlowClicked: boolean;
  setUpdatePosOrderFlowClicked: (_clicked: boolean) => void;

  updatePosOrderTypesClicked: boolean;
  setUpdatePosOrderTypesClicked: (_clicked: boolean) => void;

  updatePosSecurityClicked: boolean;
  setUpdatePosSecurityClicked: (_clicked: boolean) => void;

  updateServiceSurchargesClicked: boolean;
  setUpdateServiceSurchargesClicked: (_clicked: boolean) => void;

  addServiceSurchargesClicked: boolean;
  setAddServiceSurchargesClicked: (_clicked: boolean) => void;
};

const initialState: Configs = {
  isItemImagesHidden: false,
  isOpenCashDraw: false,
  isSplitPaymentsConfigEnabled: false,
  mandatoryPrepaymentConfig: false,
  markOrderCompletedConfig: false,
  markOrderReadyConfig: false,
  kitchenId: "",
  staffMemberConfigs: {
    enabled: false,
    idleTime: 0,
    passCodeEnabled: false,
    staffMembers: [],
  },
  surchargeConfigs: {
    customSurcharges: [],
    publicHolidaySurcharge: {
      enabled: true,
      value: 0,
    },
    saturdaySurcharge: {
      enabled: true,
      value: 0,
    },
    sundaySurcharge: {
      enabled: true,
      value: 0,
    },
  },
};

export type FormAction = {
  type: "SET_CURRENT_POS_CONFIG";
  payload: Configs | null;
};

export const PosConfigContext = createContext<PosConfigContextType>({
  state: initialState,
  currentPosConfig: initialState, // Add this to the initial context value
  dispatch: () => {},
  loadPosConfigForEdit: () => {},
  pageKey: 1,
  setPageKey: () => {},
  bannerLabel: "",
  setBannerLabel: () => {},
  updatePosRegisterScreenClicked: false,
  setUpdatePosRegisterScreenClicked: () => {},
  updatePosOrderFlowClicked: false,
  setUpdatePosOrderFlowClicked: () => {},
  updatePosOrderTypesClicked: false,
  setUpdatePosOrderTypesClicked: () => {},
  updatePosSecurityClicked: false,
  setUpdatePosSecurityClicked: () => {},
  updateServiceSurchargesClicked: false,
  setUpdateServiceSurchargesClicked: () => {},
  addServiceSurchargesClicked: false,
  setAddServiceSurchargesClicked: () => {},
});

export const PosConfigProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [updatePosRegisterScreenClicked, setUpdatePosRegisterScreenClicked] =
    useState(false);
  const [updatePosOrderFlowClicked, setUpdatePosOrderFlowClicked] =
    useState(false);
  const [updatePosOrderTypesClicked, setUpdatePosOrderTypesClicked] =
    useState(false);
  const [updatePosSecurityClicked, setUpdatePosSecurityClicked] =
    useState(false);
  const [addServiceSurchargesClicked, setAddServiceSurchargesClicked] =
    useState(false);
  const [updateServiceSurchargesClicked, setUpdateServiceSurchargesClicked] =
    useState(false);
  const [pageKey, setPageKey] = useState(1);
  const [bannerLabel, setBannerLabel] = useState("");

  const [state, dispatch] = useReducer(
    (prevState: Configs, action: FormAction) => {
      switch (action.type) {
        case "SET_CURRENT_POS_CONFIG":
          return { ...prevState, ...action.payload };
        default:
          return prevState;
      }
    },
    initialState
  );

  const loadPosConfigForEdit = (pos: Configs) => {
    dispatch({ type: "SET_CURRENT_POS_CONFIG", payload: pos });
  };

  return (
    <PosConfigContext.Provider
      value={{
        state,
        currentPosConfig: state, // Pass the state as currentPosConfig
        dispatch,
        loadPosConfigForEdit,
        pageKey,
        setPageKey,
        bannerLabel,
        setBannerLabel,
        updatePosRegisterScreenClicked,
        setUpdatePosRegisterScreenClicked,
        updatePosOrderFlowClicked,
        setUpdatePosOrderFlowClicked,
        updatePosOrderTypesClicked,
        setUpdatePosOrderTypesClicked,
        updatePosSecurityClicked,
        setUpdatePosSecurityClicked,

        updateServiceSurchargesClicked,
        setUpdateServiceSurchargesClicked,
        addServiceSurchargesClicked,
        setAddServiceSurchargesClicked,
      }}
    >
      {children}
    </PosConfigContext.Provider>
  );
};
