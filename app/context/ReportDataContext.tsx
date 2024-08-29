"use client";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";
import {
  Categories,
  DishByOrderType,
  Dishes,
  SelectedVariantsForDishData,
  Dishes,
  OrderHourData,
  OrderMultiDayData,
  SelectedVariantsForDishData,
  Totals,
} from "../src/types";

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
  selectedVariants: SelectedVariantsForDishData[];
  setSelectedVariants: Dispatch<SetStateAction<SelectedVariantsForDishData[]>>;
  dishByOrderType: DishByOrderType[];
  setDishByOrderType: Dispatch<React.SetStateAction<DishByOrderType[]>>;
  hourlyDataForTakeAwayAndDineIn: OrderHourData[] | undefined;
  setHourlyDataForTakeAwayAndDineIn: Dispatch<SetStateAction<OrderHourData[]>>;
  multiDayDataForTakeAwayAndDineIn: OrderMultiDayData[] | undefined;
  setMultiDayDataForTakeAwayAndDineIn: Dispatch<
    SetStateAction<OrderMultiDayData[] | undefined>
  >;
  dineInTakeAwayTotals: Totals | null;
  setDineInTakeAwayTotals: Dispatch<React.SetStateAction<Totals | null>>;
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
  const [selectedVariants, setSelectedVariants] = useState<
    SelectedVariantsForDishData[]
  >([]);
  const [dishByOrderType, setDishByOrderType] = useState<DishByOrderType[]>([]);
  const [hourlyDataForTakeAwayAndDineIn, setHourlyDataForTakeAwayAndDineIn] =
    useState<OrderHourData[]>([]);
  const [
    multiDayDataForTakeAwayAndDineIn,
    setMultiDayDataForTakeAwayAndDineIn,
  ] = useState<OrderMultiDayData[]>();
  const [dineInTakeAwayTotals, setDineInTakeAwayTotals] =
    useState<Totals | null>(null);

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
        selectedVariants,
        setSelectedVariants,
        dishByOrderType,
        setDishByOrderType,
        hourlyDataForTakeAwayAndDineIn,
        setHourlyDataForTakeAwayAndDineIn,
        multiDayDataForTakeAwayAndDineIn,
        setMultiDayDataForTakeAwayAndDineIn,
        dineInTakeAwayTotals,
        setDineInTakeAwayTotals,
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
