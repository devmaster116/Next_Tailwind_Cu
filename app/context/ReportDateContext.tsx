"use client";
import { createContext, useState, ReactNode, useContext, useMemo } from "react";
import { DateRangeOptions } from "../(root)/overview/components/utils/DateRangeSelectorModal";

interface ReportDateContextType {
  reportStartDate: Date;
  setReportStartDate: (date: Date) => void;
  reportEndDate: Date;
  setReportEndDate: (date: Date) => void;
  selectedOption: string;
  setSelectedOption: (option: string) => void;
}

const ReportDateContext = createContext<ReportDateContextType | undefined>(
  undefined
);

export const ReportDateProvider = ({ children }: { children: ReactNode }) => {
  const [reportStartDate, setReportStartDate] = useState<Date>(new Date());
  const [reportEndDate, setReportEndDate] = useState<Date>(new Date());
  const [selectedOption, setSelectedOption] = useState<string>(
    DateRangeOptions.Today
  );

  const contextValue = useMemo(
    () => ({
      reportStartDate,
      setReportStartDate,
      reportEndDate,
      setReportEndDate,
      selectedOption,
      setSelectedOption,
    }),
    [reportStartDate, reportEndDate, selectedOption]
  );

  return (
    <ReportDateContext.Provider value={contextValue}>
      {children}
    </ReportDateContext.Provider>
  );
};

export const useReportDate = () => {
  const context = useContext(ReportDateContext);
  if (context === undefined) {
    throw new Error(
      "useReport must be used within a ReportDateContextProvider"
    );
  }
  return context;
};
