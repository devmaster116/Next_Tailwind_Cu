import { CustomRadio } from "../../../../../components/base/radio";

export const EditPosSecurity = () => {

  const onChange = (value) => {
    // const selectedRole = roles?.find((role: RoleInfo) => role.name === value);
    // if (selectedRole) {
    //   dispatch({ type: "SET_USER_ROLE", payload: selectedRole.name });
    //   dispatch({ type: "SET_USER_ROLE_ID", payload: selectedRole.id });
    //   dispatch({
    //     type: "SET_USER_ROLE_DESCRIPTION",
    //     payload: selectedRole.description,
    //   });
    // }
  };
  const currentValue = [
    {
      label: 'No Time Out',
      idleTime:0
    },
   
  ];
  return (
     <div className="w-full">
        <p className="font-normal text-[16px] leading-[24px] md:text-[18px] md:leading-[28px] text-gray-800 ">
            Configure your security settings to track staff activity and control access levels
        </p>
        <div className="mt-5 lg:mt-8">
                <div className="border-b border-gray-200">
                    <div className="flex mb-4 lg:mb-5 gap-5 justify-between">
                          <div className="flex flex-col  gap-1 ">
                            <p className="text-gray-700 font-semibold text-[16px] leading-[24px] lg:text-[18px] lg:leading-[28px]">
                              Staff Member Mode
                            </p>
                            <p className="font-normal text-gray-600 text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px]">
                                Track staff actions and set role-based permissions to limit access.
                            </p>
                          </div>

                          <div className="flex flex-col">
                            <label class="inline-flex items-center cursor-pointer">
                              <input type="checkbox" value="" class="sr-only peer" ></input>
                              <div class="relative w-11 lg:w-14 h-6 lg:h-7 bg-gray-200 rounded-full    dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full lg:after:h-6 after:h-5 lg:after:w-6 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
                            </label>
                          </div>
                    </div>
                </div>
                <div className="border-b border-gray-200">
                      <div className="flex my-4 lg:my-5 gap-5 justify-between">
                                <div className="flex flex-col  gap-1 ">
                                  <p className="text-gray-700 font-semibold text-[16px] leading-[24px] lg:text-[18px] lg:leading-[28px]">
                                    Staff Sign in Code
                                  </p>
                                  <p className="font-normal text-gray-600 text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px]">
                                      Require staff to enter a passcode before using the POS.
                                  </p>
                                </div>

                                <div className="flex flex-col">
                                  <label class="inline-flex items-center cursor-pointer">
                                    <input type="checkbox" value="" class="sr-only peer" ></input>
                                    <div class="relative w-11 lg:w-14 h-6 lg:h-7 bg-gray-200 rounded-full    dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full lg:after:h-6 after:h-5 lg:after:w-6 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
                                  </label>
                                </div>
                      </div>
                </div>

                <div className="my-4 lg:my-5 ">
                      <div className="flex  gap-1 ">
                          <p className="text-gray-700 font-semibold text-[16px] leading-[24px] lg:text-[18px] lg:leading-[28px]">
                          Inactivity Timeout
                          </p>
                        </div>
                        <div className="flex  ">
                          <p className="font-normal text-gray-600 text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px]">
                              Automatically lock the POS after inactivity,requiring a passcode to resume use.
                          </p>
                      </div>
                </div>
              <div className="flex w-full gap-3 mb-3">
                  <div className="flex flex-col  w-1/2 ">
                      <CustomRadio
                          label={'No Time Out'}
                          checked={true}
                          onChange={() => onChange('No Time Out')}
                        
                          classOverride={{
                            labelContainer:
                              "text-[16px] leading-[24px] lg:text-[18px] lg:leading-[28px] font-semibold text-gray-700",
                            container:
                              currentValue?.idleTime === 0
                                ? "border-purple-700 border-2"
                                : "border-gray-300",
                            radioStyle:
                              currentValue?.idleTime === 0
                                ? "border-purple-700 border-2"
                                : "border-gray-300",
                            innerRadioStyle:
                              currentValue?.idleTime !== 0
                                ? "bg-white"
                                : "bg-purple-700 border-2",
                          }}
                      />
                  </div>
                  <div className="flex flex-col w-1/2 ">
                      <CustomRadio
                          label={'2 Minutes'}
                          checked={true}
                          onChange={() => onChange('2 Minutes')}
                        
                          classOverride={{
                            labelContainer:
                              "text-[16px] leading-[24px] lg:text-[18px] lg:leading-[28px] font-semibold text-gray-700",
                            container:
                              currentValue?.idleTime === 2
                                ? "border-purple-700 border-2"
                                : "border-gray-300",
                            radioStyle:
                              currentValue?.idleTime === 2
                                ? "border-purple-700 border-2"
                                : "border-gray-300",
                            innerRadioStyle:
                              currentValue?.idleTime !== 2
                                ? "bg-white"
                                : "bg-purple-700 border-2",
                          }}
                      />
                  </div>
              </div>  
              <div className="flex w-full gap-3 mb-3">
                  <div className="flex flex-col  w-1/2 ">
                      <CustomRadio
                          label={'5 Minutes'}
                          checked={true}
                          onChange={() => onChange('5')}
                        
                          classOverride={{
                            labelContainer:
                              "text-[16px] leading-[24px] lg:text-[18px] lg:leading-[28px] font-semibold text-gray-700",
                            container:
                              currentValue?.idleTime === 5
                                ? "border-purple-700 border-2"
                                : "border-gray-300",
                            radioStyle:
                              currentValue?.idleTime === 5
                                ? "border-purple-700 border-2"
                                : "border-gray-300",
                            innerRadioStyle:
                              currentValue?.idleTime !== 5
                                ? "bg-white"
                                : "bg-purple-700 border-2",
                          }}
                      />
                  </div>
                  <div className="flex flex-col w-1/2 ">
                      <CustomRadio
                          label={'8 Minutes'}
                          checked={true}
                          onChange={() => onChange('8 Minutes')}
                        
                          classOverride={{
                            labelContainer:
                              "text-[16px] leading-[24px] lg:text-[18px] lg:leading-[28px] font-semibold text-gray-700",
                            container:
                              currentValue?.idleTime === 8
                                ? "border-purple-700 border-2"
                                : "border-gray-300",
                            radioStyle:
                              currentValue?.idleTime === 8
                                ? "border-purple-700 border-2"
                                : "border-gray-300",
                            innerRadioStyle:
                              currentValue?.idleTime !== 8
                                ? "bg-white"
                                : "bg-purple-700 border-2",
                          }}
                      />
                  </div>
              </div>  
              <div className="flex w-full gap-3 mb-3">
                  <div className="flex flex-col  w-1/2 ">
                      <CustomRadio
                          label={'12 Minutes'}
                          checked={true}
                          onChange={() => onChange('12')}
                        
                          classOverride={{
                            labelContainer:
                              "text-[16px] leading-[24px] lg:text-[18px] lg:leading-[28px] font-semibold text-gray-700",
                            container:
                              currentValue?.idleTime === 12
                                ? "border-purple-700 border-2"
                                : "border-gray-300",
                            radioStyle:
                              currentValue?.idleTime === 12
                                ? "border-purple-700 border-2"
                                : "border-gray-300",
                            innerRadioStyle:
                              currentValue?.idleTime !== 12
                                ? "bg-white"
                                : "bg-purple-700 border-2",
                          }}
                      />
                  </div>
                  <div className="flex flex-col w-1/2 ">
                      <CustomRadio
                          label={'20 Minutes'}
                          checked={true}
                          onChange={() => onChange('20 Minutes')}
                        
                          classOverride={{
                            labelContainer:
                              "text-[16px] leading-[24px] lg:text-[18px] lg:leading-[28px] font-semibold text-gray-700",
                            container:
                              currentValue?.idleTime === 20
                                ? "border-purple-700 border-2"
                                : "border-gray-300",
                            radioStyle:
                              currentValue?.idleTime === 20
                                ? "border-purple-700 border-2"
                                : "border-gray-300",
                            innerRadioStyle:
                              currentValue?.idleTime !== 20
                                ? "bg-white"
                                : "bg-purple-700 border-2",
                          }}
                      />
                  </div>
              </div>  
              <div className="flex w-full gap-3 mb-[26px]">
                  <div className="flex flex-col  w-1/2 ">
                      <CustomRadio
                          label={'30 Minutes'}
                          checked={true}
                          onChange={() => onChange('30')}
                        
                          classOverride={{
                            labelContainer:
                              "text-[16px] leading-[24px] lg:text-[18px] lg:leading-[28px] font-semibold text-gray-700",
                            container:
                              currentValue?.idleTime === 30
                                ? "border-purple-700 border-2"
                                : "border-gray-300",
                            radioStyle:
                              currentValue?.idleTime === 30
                                ? "border-purple-700 border-2"
                                : "border-gray-300",
                            innerRadioStyle:
                              currentValue?.idleTime !== 30
                                ? "bg-white"
                                : "bg-purple-700 border-2",
                          }}
                      />
                  </div>
                  <div className="flex   w-1/2 ">
                   
                  </div>
              </div>  
        </div>
      </div>
  );
};
