import { CustomRadio } from "../../../../../components/base/radio";
interface CurrentValue {
  idleTime?: number; // Optional property
  label?: string; // Optional property
}
export const EditOnlinePaymentSurcharge = () => {

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
              Online payment fee is 1.9% + 11¢ per transaction.
              <br></br>
              <br></br>
              Below you have the option to pass part or all of the fee to the customer
          </p>
          
        <div className="mt-5 lg:mt-8">
                   <div className="w-full mb-3">
                      <CustomRadio
                          label={"Don't pass on a fee"}
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
                  <div className="w-full">
                      <CustomRadio
                          label={"Don't pass on a fee"}
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
        </div>
      </div>
  );
};
