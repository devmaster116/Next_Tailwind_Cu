import React, { useContext, useEffect, useState } from "react";
import { Paragraph } from "../../../../components/base/paragraph";
import { Avatar } from "../../../../components/base/avatar";
import { ConfigStaffMember } from "@/app/src/types";
import { twMerge } from "tailwind-merge";
import { HelpSvg } from "@/app/assets/svg/help";
import { FormContext } from "@/app/context/StaffContext";
import { EditImageUpload } from "../form/EditImageUpload";
import { usePathname, useRouter } from "next/navigation";
import { Tooltip as ReactTooltip } from "react-tooltip";

type Props = {
  onClose: () => void;
  onDeleteModalOpen: () => void;
  className?: string;
};

const StaffView = (props: Props) => {
  const router = useRouter();
  const pathName = usePathname();
  const [statusHideShow, setStatusHideShow] = useState(false);
  const showEditUserInfoStaffModal = (data: ConfigStaffMember) => {
    router.push(`${pathName}?type=edit-staff`);
  };
  const showEditUserRoleStaffModal = (data: ConfigStaffMember) => {
    router.push(`${pathName}?type=edit-role`);
  };
  const showEditUserSignCodeStaffModal = (data: ConfigStaffMember) => {
    router.push(`${pathName}?type=edit-code`);
  };

  const { currentStaff } = useContext(FormContext)!;
  const [img, setImg] = useState<any>();
  const fetchImageFromFirebase = async () => {
    setImg(currentStaff?.displayImageURL);
  };

  useEffect(() => {
    fetchImageFromFirebase();
  }, [currentStaff]);

  const showHideSignCode = () => {
    setStatusHideShow(!statusHideShow);
  };

  return (
    <div className={twMerge(" rounded-lg h-full", props?.className)}>
      {currentStaff && (
        <div className="flex flex-col h-full ">
          <div className="px-4">
            <div
              className=" border-gray-200 border rounded-lg mb-4 "
              style={{ boxShadow: "0 1px 2px 0 rgba(16, 24, 40, 0.05)" }}
            >
              <div className="flex items-center justify-center border-b border-gray-200 py-4">
                <div className="w-full flex flex-col items-center gap-2">
                  <div
                    className={twMerge(
                      "w-full flex items-center justify-center"
                    )}
                  >
                    <EditImageUpload img={img} data={currentStaff} />
                  </div>
                </div>
              </div>
              <div className={twMerge("flex flex-col")}>
                <div className="p-4">
                  <div className="flex flex-row justify-between mb-2">
                    <p className="text-gray-900 font-bold text-[16px] leading-[24px] lg:text-[18px] lg:leading-[28px]">
                      Personal Details
                    </p>
                    <button
                      className="cursor-pointer font-semibold text-purple-700 text-[16px] leading-[24px] lg:text-[18px] lg:leading-[28px]"
                      onClick={() => showEditUserInfoStaffModal(currentStaff)}
                    >
                      Edit
                    </button>
                  </div>

                  <div className="flex py-[10px] lg:py-3">
                    <div className="flex-1 w-32">
                      <Paragraph
                        title="First Name"
                        content={currentStaff.firstName}
                        classOverride={{
                          title:
                            "text-gray-800 font-semibold text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px]",
                          content:
                            "font-normal  text-[16px] leading-[24px] lg:text-[18px] lg:leading-[28px]",
                        }}
                      />
                    </div>
                    <div className="flex-1 w-32">
                      <Paragraph
                        title="Last Name"
                        content={currentStaff.lastName}
                        classOverride={{
                          title:
                            "pl-4 text-gray-800 font-semibold text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px]",
                          content:
                            "pl-4 font-normal  text-[16px] leading-[24px] lg:text-[18px] lg:leading-[28px]",
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex py-[10px] lg:py-3">
                    <div className="flex-1 w-32">
                      <Paragraph
                        title="Nick Name"
                        content={currentStaff.displayName}
                        classOverride={{
                          title:
                            "text-gray-800 font-semibold text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px]",
                          content:
                            "font-normal  text-[16px] leading-[24px] lg:text-[18px] lg:leading-[28px]",
                        }}
                      />
                    </div>
                    <div className="flex-1 w-32">
                      <Paragraph
                        title="Mobile"
                        content={
                          currentStaff?.phoneNumber
                            ? currentStaff?.phoneNumber
                            : "Not Provided"
                        }
                        classOverride={{
                          title:
                            "pl-4 text-gray-800 font-semibold text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px]",
                          content: `${
                            currentStaff?.phoneNumber
                              ? "text-gray-800"
                              : "text-gray-500"
                          } pl-4 font-normal text-[16px] leading-[24px] lg:text-[18px] lg:leading-[28px]`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex pt-[10px] lg:pt-[12px] ">
                    <Paragraph
                      title="Email Address"
                      content={currentStaff?.email}
                      classOverride={{
                        title:
                          "text-gray-800 font-semibold text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px]",
                        content:
                          "font-normal  text-[16px] leading-[24px] lg:text-[18px] lg:leading-[28px]",
                      }}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1 p-4 border-t border-gray-200">
                  <div className="flex flex-row justify-between">
                    <p className="text-gray-900 font-bold text-[16px] leading-[24px] lg:text-[18px] lg:leading-[28px]">
                      Assigned Role
                    </p>
                    <button
                      className="cursor-pointer font-semibold text-purple-700 text-[16px] leading-[24px] lg:text-[18px] lg:leading-[28px]"
                      onClick={() => showEditUserRoleStaffModal(currentStaff)}
                    >
                      Edit
                    </button>
                  </div>
                  <div className="flex flex-row">
                    <p className="gap-1 font-normal text-[16px] leading-[24px] lg:text-[18px] lg:leading-[28px] text-gray-800">
                      {currentStaff.roleName}
                    </p>
                    <Avatar
                      icon={
                        <>
                          <a data-tooltip-id="my-tooltip" className="truncate">
                            <HelpSvg />
                          </a>
                          <ReactTooltip
                            id="my-tooltip"
                            className="max-w-[320px] !rounded-lg"
                            place="bottom"
                            positionStrategy="fixed"
                          >
                            <div>
                              <p className="text-white text-xs font-semibold">
                                {currentStaff.roleName}
                              </p>
                              <p className="text-white text-xs font-normal">
                                {currentStaff.description}
                              </p>
                            </div>
                          </ReactTooltip>
                        </>
                      }
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1 p-4 border-t border-gray-200">
                  <div className="flex flex-row justify-between ">
                    <p className="text-gray-900 font-bold text-[16px] leading-[24px] lg:text-[18px] lg:leading-[28px]">
                      POS Sign In Code
                    </p>
                    <button
                      className="cursor-pointer font-semibold text-purple-700 text-[16px] leading-[24px] lg:text-[18px] lg:leading-[28px]"
                      onClick={() =>
                        showEditUserSignCodeStaffModal(currentStaff)
                      }
                    >
                      {`${currentStaff.passcode ? "Reset" : "Generate"}`}
                    </button>
                  </div>
                  <div className="flex flex-row  ">
                    {currentStaff.passcode && (
                      <div className="flex flex-row">
                        <div className="flex flex-direction ">
                          <p className="font-bold  text-[18px] leading-[28px] lg:text-[20px] lg:leading-[28px] text-gray-800 ">
                            {statusHideShow ? currentStaff.passcode : "****"}
                          </p>
                        </div>
                        <button
                          className="flex flex-direction"
                          onClick={showHideSignCode}
                        >
                          <p className="cursor-pointer flex items-center ml-1 font-bold text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px] text-purple-700">
                            {statusHideShow ? "Hide Code" : "Show Code"}
                          </p>
                        </button>
                      </div>
                    )}
                    {!currentStaff.passcode && (
                      <p className=" pt-1 pr-3 pb-1 pl-3 font-base  font-medium   rounded-2xl bg-purple-50 text-purple-700">
                        No Code Set
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center pb-4">
              <button
                className="font-semibold hover:text-rose-800 text-rose-700 bg-rose-50 text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px] px-4 !py-[10px] rounded-lg hover:bg-rose-100"
                onClick={props.onDeleteModalOpen}
              >
                Delete Staff Member
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffView;
