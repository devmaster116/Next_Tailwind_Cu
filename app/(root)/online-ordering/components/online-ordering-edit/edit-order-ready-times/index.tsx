import { CustomRadio } from "../../../../../components/base/radio";

export const EditOrderReadyTimes = () => {
interface CurrentValue {
      label?:string;
      idleTime?:number
}
  const onChange = (value:string) => {
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
  let currentValue: CurrentValue | null = {
      idleTime: 0,
      label: 'a',
    };

  return (
        <div className="w-full">
              <p className="font-normal text-[16px] leading-[24px] md:text-[18px] md:leading-[28px] text-gray-800 ">
                  This setting determines what the user sees as the estimated time their order will be ready when they are ordering online.
              </p>
              <div className="mt-5 lg:mt-8">
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
