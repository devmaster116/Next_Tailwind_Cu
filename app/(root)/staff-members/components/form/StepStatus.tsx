import React from "react";
// @ts-ignore
import { ProgressBar, Step } from "react-step-progress-bar";
interface ProgressProps {
  value: number,
  stepIndex: number
}

export function StepStatus({ value, stepIndex }: ProgressProps) {
  return (
    <div className="flex flex-col mb-8 ">
            <ProgressBar
                filledBackground="#4CA30D"
                percent={value}
              >
                <Step transition="scale">
                  {({ accomplished, index }: { accomplished: boolean; index: number }) => (
                    <div
                      className={`transitionStep ${accomplished ? "accomplished" : ""}`}
                    >
                    </div>
                  )}
                </Step>
                <Step transition="scale">
                  {({ accomplished, index }: { accomplished: boolean; index: number }) => (
                    <div
                      className={`transitionStep ${accomplished ? "accomplished" : ""}`}
                    >
                      <div className="w-1 h-2 bg-white "></div>
                    </div>
                  )}
                </Step>
                <Step transition="scale">
                  {({ accomplished, index }: { accomplished: boolean; index: number }) => (
                    <div
                      className={`transitionStep ${accomplished ? "accomplished" : ""}`}
                    >
                    <div className="w-1 h-2 bg-white "></div>
                    </div>
                  )}
                </Step>
                <Step transition="scale">
                  {({ accomplished, index }: { accomplished: boolean; index: number }) => (
                    <div
                      className={`transitionStep ${accomplished ? "accomplished" : ""}`}
                    >
                  <div className="w-1 h-2 bg-white "></div>
                    </div>
                  )}
                </Step>
                <Step transition="scale">
                  {({ accomplished, index }: { accomplished: boolean; index: number }) => (
                    <div
                      className={`transitionStep ${accomplished ? "accomplished" : ""}`}
                    >
                      {/* <div className="w-2 h-2 bg-white "></div> */}
                    </div>
                  )}
                </Step>
              </ProgressBar>
      </div>
  )
} 