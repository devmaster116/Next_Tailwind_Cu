"use client";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";
import { Categories, Dishes } from "../src/types";

interface ReportDataContextType {
  allCategories: Categories[];
  setAllCategories: Dispatch<SetStateAction<Categories[]>>;
  allDishes: Dishes[];
  setAllDishes: Dispatch<SetStateAction<Dishes[]>>;
  ordersData: any;
  setOrdersData: Dispatch<SetStateAction<any>>;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  error: boolean;
  setError: Dispatch<SetStateAction<boolean>>;
  advancedReportingError: boolean;
  setAdvancedReportingError: Dispatch<SetStateAction<boolean>>;
  overviewReportFunctionError: boolean;
  setOverviewReportFunctionError: Dispatch<SetStateAction<boolean>>;
  customDate?: string;
  setCustomDate: Dispatch<SetStateAction<string | undefined>>;
}

const ReportDataContext = createContext<ReportDataContextType | undefined>(
  undefined
);

export const ReportDataProvider = ({ children }: { children: ReactNode }) => {
  const [allCategories, setAllCategories] = useState<Categories[]>([]);
  const [allDishes, setAllDishes] = useState<Dishes[]>([]);
  const [ordersData, setOrdersData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [advancedReportingError, setAdvancedReportingError] = useState(false);
  const [overviewReportFunctionError, setOverviewReportFunctionError] =
    useState(false);
  const [customDate, setCustomDate] = useState<string | undefined>();

  // console.log("ORders data report data context -==>", ordersData);
  return (
    <ReportDataContext.Provider
      value={{
        allCategories,
        setAllCategories,
        allDishes,
        setAllDishes,
        ordersData,
        setOrdersData,
        loading,
        setLoading,
        error,
        setError,
        advancedReportingError,
        setAdvancedReportingError,
        overviewReportFunctionError,
        setOverviewReportFunctionError,
        customDate,
        setCustomDate,
      }}
    >
      {children}
    </ReportDataContext.Provider>
  );
};

export const useReportDataContext = (): ReportDataContextType => {
  const context = useContext(ReportDataContext);
  if (!context) {
    throw new Error(
      "useReportDataContext must be used within a ReportDataProvider"
    );
  }
  return context;
};
