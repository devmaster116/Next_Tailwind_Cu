import React, { useContext, useEffect, useState } from 'react';
import { Paragraph } from '../base/paragraph';
import { Avatar } from '../base/avatar';
import { CancelSvg } from '@/app/assets/svg/cancel';
import { ConfigStaffMember } from '@/app/src/types';
import { twMerge } from 'tailwind-merge';
import { HelpSvg } from '@/app/assets/svg/help';
import { FormContext } from '@/app/context/StaffContext';
import { EditImageUpload } from '../form/EditImageUpload';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Tooltip } from 'react-tooltip';
import { useFormStep } from '@/app/hooks/useFormStep';


type Props = {
  onClose: () => void,
  onDeleteModalOpen: () => void
  className?: string,
}

const StaffView = (props: Props) => {
  const router = useRouter()
  const pathName = usePathname()

  // 
  const [statusHideShow, setStatusHideShow] = useState(false);
  const showEditUserInfoStaffModal=(data:ConfigStaffMember)=>{
    router.push(`${pathName}?type=edit-staff`)
  }
  const showEditUserRoleStaffModal=(data:ConfigStaffMember)=>{
    router.push(`${pathName}?type=edit-role`)
  }
  const showEditUserSignCodeStaffModal=(data:ConfigStaffMember)=>{
    router.push(`${pathName}?type=edit-code`)
  }

  const { currentStaff } = useContext(FormContext)!;
  const [img, setImg] = useState<any>();
  const fetchImageFromFirebase = async () => {
      setImg(currentStaff?.displayImageURL)
  };

  useEffect(() => {
    fetchImageFromFirebase();
  }, []);

const showHideSignCode= () =>{
  setStatusHideShow(!statusHideShow)
}

  
  return (
    <div className={twMerge(
      " rounded-lg h-full",
      props?.className
    )}>
      {currentStaff&&(
          <div className='flex flex-col h-full '>
              <div className="relative flex items-center justify-center px-4 pt-4 py-4 pl-1 border-gray-100 border mb-5">
                <p className="font-semibold  text-gray-800 text-[18px] leading-[28px] lg:text-[20px] lg:leading-[30px]">{currentStaff.firstName+ " "+ currentStaff.lastName}</p>
                <Avatar 
                  icon={<CancelSvg />}
                  classOverride={{
                    container: 'absolute left-4 top-4',
                }}
                  onClick={props.onClose}
                />
            
              </div>
          <div className='px-4'>
            <div className=' border-gray-200 border rounded-lg mb-4 ' style={{ boxShadow: '0 1px 2px 0 rgba(16, 24, 40, 0.05)' }}> 
              <div className='flex items-center justify-center border-b border-gray-200 py-4'>
                  <div className='w-full flex flex-col items-center gap-2'>
                      <div className={twMerge(
                        'w-full flex items-center justify-center',
                      )}>

                          <EditImageUpload img={img} data={currentStaff}/>
                      </div>
                  </div>
              </div>
              <div className={twMerge('flex flex-col')} >
                <div className='p-4'>
                    <Paragraph 
                      title='Personal Details'
                      content='Edit'
                      classOverride={{
                        container: 'flex-row justify-between mb-2',
                        title: 'font-bold text-[16px] leading-[24px] lg:text-[18px] lg:leading-[28px]',
                        content: 'cursor-pointer font-semibold text-purple-700 text-[16px] leading-[24px] lg:text-[18px] lg:leading-[28px]'
                      }}
                      onClick={()=>showEditUserInfoStaffModal(currentStaff)}
                    />

                    <div className="flex py-[10px] lg:py-3">
                        <div className="flex-1 w-32">
                          <Paragraph 
                            title='First Name'
                            content={currentStaff.firstName}
                            classOverride={{
                                title: 'text-gray-800 font-semibold text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px]',
                                content: 'font-normal  text-[16px] leading-[24px] lg:text-[18px] lg:leading-[28px]'
                            }}
                          />
                        </div>
                        <div className="flex-1 w-32">
                          <Paragraph 
                              title='Last Name'
                              content={currentStaff.lastName}
                              classOverride={{
                              title: 'pl-4 text-gray-800 font-semibold text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px]',
                              content: 'pl-4 font-normal  text-[16px] leading-[24px] lg:text-[18px] lg:leading-[28px]'
                              }}
                            />

                        </div>
                    </div>
                    <div className="flex py-[10px] lg:py-3">
                        <div className="flex-1 w-32">
                          <Paragraph 
                            title='Nick Name'
                            content={currentStaff.displayName}
                            classOverride={{
                            title: 'text-gray-800 font-semibold text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px]',
                            content: 'font-normal  text-[16px] leading-[24px] lg:text-[18px] lg:leading-[28px]'
                            }}
                          />
                        </div>
                        <div className="flex-1 w-32">
                          <Paragraph 
                              title='Mobile'
                              content={currentStaff?.phoneNumber?currentStaff?.phoneNumber:'Not Provided'}
                              classOverride={{
                              title: 'pl-4 text-gray-800 font-semibold text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px]',
                              content: 'pl-4 text-gray-500 font-normal  text-[16px] leading-[24px] lg:text-[18px] lg:leading-[28px]'
                              }}
                            />

                        </div>
                    </div>
                  
                    <div className='flex pt-[10px] lg:pt-[12px] '>
                          <Paragraph 
                              title='Email Address'
                              content={currentStaff?.email}
                              classOverride={{
                                title: 'text-gray-800 font-semibold text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px]',
                                content: 'font-normal  text-[16px] leading-[24px] lg:text-[18px] lg:leading-[28px]'
                              }}
                            />
                    </div>
                </div>
                
                <div className='flex flex-col gap-1 p-4 border-t border-gray-200'>
                  <Paragraph 
                    title='Assigned Role'
                    content='Edit'
                    classOverride={{
                      container: 'flex-row justify-between',
                      title: 'font-bold text-[16px] leading-[24px] lg:text-[18px] lg:leading-[28px]',
                      content: 'cursor-pointer font-semibold text-purple-700 text-[16px] leading-[24px] lg:text-[18px] lg:leading-[28px]'
                    }}
                    onClick={()=>showEditUserRoleStaffModal(currentStaff)}
                  />
                    <div className='flex flex-row  ' >
                      <p className='  gap-1 font-normal text-[16px] leading-[24px] lg:text-[18px] lg:leading-[28px]  text-gray-800'>{currentStaff.roleName}</p>
                      <Avatar 
                      icon={<>
                          <a
                              data-tooltip-id="my-tooltip" 
                              data-tooltip-html={`<div><p>${currentStaff.roleName}</p><p>${currentStaff.description}</p></div>`}
                              className="truncate"
                            >
                              <HelpSvg />
                            </a>
                            <Tooltip 
                              id="my-tooltip" 
                              className="max-w-[320px]" 
                              place={"bottom"}
                              positionStrategy={'fixed'}
                            />
                      </>}
                    />
                    </div>
              
                </div>
                <div className='flex flex-col gap-1 p-4 border-t border-gray-200'>
                  <Paragraph 
                      title='POS Sign In Code'
                      content='Generate'
                      classOverride={{
                        container: 'flex-row justify-between',
                        title: 'font-bold text-[16px] leading-[24px] lg:text-[18px] lg:leading-[28px]',
                        content: 'cursor-pointer font-semibold text-purple-700 text-[16px] leading-[24px] lg:text-[18px] lg:leading-[28px]'
                      }}
                      onClick={()=>showEditUserSignCodeStaffModal(currentStaff)}

                    />
                    <div className='flex flex-row  ' >
                    {currentStaff.passcode&&(
                        <div className='flex flex-row'>
                          <div className='flex flex-direction '>
                              <p className='font-bold  text-[18px] leading-[28px] lg:text-[20px] lg:leading-[28px] text-gray-800 '>{statusHideShow?currentStaff.passcode:'****'}</p>
                          </div>
                          <div className='flex flex-direction' onClick={showHideSignCode}>
                              <p className='cursor-pointer flex items-center ml-1 font-bold text-lg leading-5 lg:text-base lg:leading-6 text-purple-700' >{statusHideShow?'Hide Code':'Show Code'}</p>
                          </div>
                        </div>
                    )}
                    {!currentStaff.passcode&&(<p className=' pt-1 pr-3 pb-1 pl-3 font-base  font-medium   rounded-2xl bg-purple-50 text-purple-700'>No Code Set</p>)}
                    </div>
                </div>
              </div>
            </div>
            <div className='flex items-center justify-center pb-4'>
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
