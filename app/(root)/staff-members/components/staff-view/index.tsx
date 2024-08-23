import React, { useContext, useState } from 'react';
import { Paragraph } from '../base/paragraph';
import { Avatar } from '../base/avatar';
import { CancelSvg } from '@/app/assets/svg/cancel';
import { ConfigStaffMember } from '@/app/src/types';
import styles from "../Staff.module.scss";
import { twMerge } from 'tailwind-merge';
import { HelpSvg } from '@/app/assets/svg/help';
import { FormContext, FormContextType } from '@/app/context/StaffContext';
import { useFormStep } from '@/app/hooks/useFormStep';
import { EditImageUpload } from '../form/EditImageUpload';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

type Props = {
  onClose: () => void,
  onDeleteModalOpen: () => void
  className?: string,
  item? :ConfigStaffMember
}

const StaffView = (props: Props) => {
  const router = useRouter()
  const pathName = usePathname()
  // const searchParams = useSearchParams()
  const { loadStaffForEdit } = useContext(FormContext) as FormContextType;

  const [statusHideShow, setStatusHideShow] = useState(false);
  const showEditUserInfoStaffModal=(data:ConfigStaffMember)=>{
    loadStaffForEdit(data)
    // props.onClose()
    router.push(`${pathName}?type=edit-staff`)
    // setEditUserInfoStatusModal(true)
  }
  const showEditUserRoleStaffModal=(data:ConfigStaffMember)=>{
    loadStaffForEdit(data)
    router.push(`${pathName}?type=edit-role`)

  }
  const showEditUserSignCodeStaffModal=(data:ConfigStaffMember)=>{
    loadStaffForEdit(data)
    router.push(`${pathName}?type=edit-code`)

  }
const showHideSignCode= () =>{
  setStatusHideShow(!statusHideShow)
}

  const data=props.item
  return (
    <div className={twMerge(
      " rounded-lg h-full",
      props?.className
    )}>
      {data&&(
          <div className='flex flex-col h-full '>
              <div className="relative flex items-center justify-center px-4 pt-4 py-4 pl-1 border-gray-100 border mb-5">
                <p className="font-semibold  text-gray-800 text-[18px] leading-[28px] lg:text-[20px] lg:leading-[30px]">{data.firstName+ " "+ data.lastName}</p>
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
                  <div className='flex flex-col items-center gap-2'>
                      <div className='w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center'>
                          <EditImageUpload />
                          {/* <span className='text-2xl font-medium text-gray-600'>GC</span> */}
                      </div>
                      {/* <p className="font-semibold  text-gray-800 text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px] text-purple-700">Update Photo</p> */}
                  </div>
              </div>
              <div className={twMerge('flex flex-col')} >
              {/* <div className= {twMerge('flex flex-col', styles['box-shadow: 0 1px 2px 0 rgba(16, 24, 40, 0.05)'])}> */}
                <div className='p-4'>
                    <Paragraph 
                      title='Personal Details'
                      content='Edit'
                      classOverride={{
                        container: 'flex-row justify-between mb-2',
                        title: 'font-bold text-[16px] leading-[24px] lg:text-[18px] lg:leading-[28px]',
                        content: 'cursor-pointer font-semibold text-purple-700 text-[16px] leading-[24px] lg:text-[18px] lg:leading-[28px]'
                      }}
                      onClick={()=>showEditUserInfoStaffModal(data)}
                    />

                    <div className="flex py-[10px] lg:py-3">
                        <div className="flex-1 w-32">
                          <Paragraph 
                            title='First Name'
                            content={data.firstName}
                            classOverride={{
                                title: 'text-gray-800 font-semibold text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px]',
                                content: 'font-normal  text-[16px] leading-[24px] lg:text-[18px] lg:leading-[28px]'
                            }}
                          />
                        </div>
                        <div className="flex-1 w-32">
                          <Paragraph 
                              title='Last Name'
                              content={data.lastName}
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
                            content={data.displayName}
                            classOverride={{
                            title: 'text-gray-800 font-semibold text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px]',
                            content: 'font-normal  text-[16px] leading-[24px] lg:text-[18px] lg:leading-[28px]'
                            }}
                          />
                        </div>
                        <div className="flex-1 w-32">
                          <Paragraph 
                              title='Mobile'
                              content={data?.phoneNumber?data?.phoneNumber:'Not Provided'}
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
                              content={data?.email}
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
                    onClick={()=>showEditUserRoleStaffModal(data)}
                  />
                    <div className='flex flex-row  ' >
                      <p className='  gap-1 font-normal text-[16px] leading-[24px] lg:text-[18px] lg:leading-[28px]  text-gray-800'>{data.roleName}</p>
                      <Avatar 
                      icon={<HelpSvg />}
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
                      onClick={()=>showEditUserSignCodeStaffModal(data)}

                    />
                    <div className='flex flex-row  ' >
                    {data.passcode&&(
                        <div className='flex flex-row'>
                          <div className='flex flex-direction '>
                              <p className='font-bold  text-[18px] leading-[28px] lg:text-[20px] lg:leading-[28px] text-gray-800 '>{statusHideShow?data.passcode:'****'}</p>
                          </div>
                          <div className='flex flex-direction' onClick={showHideSignCode}>
                              <p className='cursor-pointer flex items-center ml-1 font-bold text-lg leading-5 lg:text-base lg:leading-6 text-purple-700' >{statusHideShow?'Hide Code':'Show Code'}</p>
                          </div>
                        </div>
                    )}
                    {!data.passcode&&(<p className=' pt-1 pr-3 pb-1 pl-3 font-base  font-medium   rounded-2xl bg-purple-50 text-purple-700'>No Code Set</p>)}
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
