"use client";
import React from "react";
import {
  functions,
  httpsCallable,
} from "@/environments/staging/firebaseConfig";

interface KitchenData {
  kitchen: string;
  kitchenId: string;
  // Add other properties if necessary
}

const Statistics = () => {
  const callAdvancedReporting = async () => {
    const advancedReports = httpsCallable(functions, "advancedReporting");
    advancedReports({
      kitchenId: "73stfjzxk3ocfxvqxnrhhcflhtet",
      fromReportDate: "2024-01-01",
      toReportDate: "2025-01-01",
    })
      .then(result => {
        // Read result of the Cloud Function.
        /** @type {any} */
        const data = result.data as KitchenData;
        console.log("kitchen ==>", data);
      })
      .catch(error => {
        console.log(error);
      });
  };

  return (
    <div>
      <h1>Statistics</h1>
      <button onClick={callAdvancedReporting}>Get Advanced Report</button>
    </div>
  );
};

export default Statistics;
