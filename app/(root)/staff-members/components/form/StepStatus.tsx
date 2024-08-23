import React from "react";
// @ts-ignore
//use @strict
import { ProgressBar, Step } from "react-step-progress-bar";
interface ProgressProps {
  stepIndex: number
}

export function StepStatus({ stepIndex }: ProgressProps) {
  return (
    <div className="flex flex-col mb-0 lg:mb-8">
            <ProgressBar
                filledBackground="#4CA30D"
                percent={stepIndex*25}
              >
                <Step transition="scale" transitionDuration="500">
                  {({ accomplished, index }: { accomplished: boolean; index: number }) => (
                    <div
                      className={`transitionStep ${accomplished ? "accomplished" : ""}`}
                    >
                    </div>
                  )}
                </Step>
                <Step transition="scale" transitionDuration="500">
                  {({ accomplished, index }: { accomplished: boolean; index: number }) => (
                    <div
                      className={`transitionStep ${accomplished ? "accomplished" : ""}`}
                    >
                      <div className="w-1 h-2 bg-white "></div>
                    </div>
                  )}
                </Step>
                <Step transition="scale" transitionDuration={500}>
                  {({ accomplished, index }: { accomplished: boolean; index: number }) => (
                    <div
                      className={`transitionStep ${accomplished ? "accomplished" : ""}`}
                    >
                    <div className="w-1 h-2 bg-white "></div>
                    </div>
                  )}
                </Step>
                <Step transition="scale" transitionDuration={500}>
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