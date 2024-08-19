import React, { useState } from 'react';
import { Paragraph } from '../base/paragraph';
import { Avatar } from '../base/avatar';
import { CancelSvg } from '@/app/assets/svg/cancel';
import { ConfigStaffMember } from '@/app/src/types';
import CustomModal from '@/app/components/CustomModal';
import styles from "../Staff.module.scss";
import { ImageUpload } from '../form/ImageUpload';
import { twMerge } from 'tailwind-merge';
import { HelpSvg } from '@/app/assets/svg/help';

type Props = {
  onClose: () => void,
  onDeleteModalOpen: () => void
  className?: string,
  item? :ConfigStaffMember
}

const StaffView = (props: Props) => {

  const data=props.item
  return (
    <div className={twMerge(
      "bg-white rounded-lg h-full",
      props?.className
    )}>
      {data&&(
      <div className='flex flex-col h-full'>
          <div className="relative flex items-center justify-center px-4 pt-4 py-4 pl-1 border-gray-100 border ">
            <p className="font-semibold text-xl text-gray-800">{data.firstName+ " "+ data.lastName}</p>
            <Avatar 
              icon={<CancelSvg />}
              classOverride={{
                container: 'absolute left-4 top-4',
            }}
              onClick={props.onClose}
            />
        
          </div>
      <div className='p-4'>
        <div className='shadow border-lg border-gray-200 rounded'> 
          <div className='flex items-center justify-center border-b border-gray-200 py-4'>
              <div className='flex flex-col items-center gap-2'>
                  <div className='w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center'>
                      <span className='text-2xl font-medium text-gray-600'>GC</span>
                  </div>
                  <p className="font-semibold  text-gray-800 text-[14px] leading-[20px] md:text-[16px] md:leading-[24px] text-purple-700">Update Photo</p>
              </div>
          </div>
          <div className='flex flex-col'>
            <div className='p-4'>
                <Paragraph 
                  title='Personal Details'
                  content='Edit'
                  classOverride={{
                    container: 'flex-row justify-between mt-4 mb-2',
                    title: 'font-bold text-[16px] leading-[24px] md:text-[18px] md:leading-[28px]',
                    content: 'font-semibold text-purple-700 text-[16px] leading-[24px] md:text-[18px] md:leading-[28px]'
                  }}
                  onClick={() => console.log('clicked')}
                />

                <div className="flex py-4">
                    <div className="flex-1 w-32">
                      <Paragraph 
                        title='First Name'
                        content={data.firstName}
                        classOverride={{
                             title: 'text-gray-800 font-semibold text-[14px] leading-[20px] md:text-[16px] md:leading-[24px]',
                             content: 'font-normal  text-[14px] leading-[20px] md:text-[16px] md:leading-[24px]'
                        }}
                      />
                    </div>
                    <div className="flex-1 w-32">
                      <Paragraph 
                          title='Last Name'
                          content={data.lastName}
                          classOverride={{
                           title: 'text-gray-800 font-semibold text-[14px] leading-[20px] md:text-[16px] md:leading-[24px]',
                           content: 'font-normal  text-[16px] leading-[24px] md:text-[18px] md:leading-[28px]'
                          }}
                        />

                    </div>
                </div>
                <div className="flex py-4">
                    <div className="flex-1 w-32">
                      <Paragraph 
                        title='Nick Name'
                        content={data.displayName}
                        classOverride={{
                        title: 'text-gray-800 font-semibold text-[14px] leading-[20px] md:text-[16px] md:leading-[24px]',
                        content: 'font-normal  text-[16px] leading-[24px] md:text-[18px] md:leading-[28px]'
                        }}
                      />
                    </div>
                    <div className="flex-1 w-32">
                      <Paragraph 
                          title='Mobile'
                          content={data?.phoneNumber}
                          classOverride={{
                           title: 'text-gray-800 font-semibold text-[14px] leading-[20px] md:text-[16px] md:leading-[24px]',
                           content: 'font-normal  text-[16px] leading-[24px] md:text-[18px] md:leading-[28px]'
                          }}
                        />

                    </div>
                </div>
              
                <div className='flex py-4 pt-3'>
                      <Paragraph 
                          title='Email Address'
                          content={'Alfonso.Cassano@gmail.com'}
                          classOverride={{
                            title: 'text-gray-800 font-semibold text-[14px] leading-[20px] md:text-[16px] md:leading-[24px]',
                            content: 'font-normal  text-[16px] leading-[24px] md:text-[18px] md:leading-[28px]'
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
                  title: 'font-bold text-[16px] leading-[24px] md:text-[18px] md:leading-[28px]',
                  content: 'font-semibold text-purple-700 text-[16px] leading-[24px] md:text-[18px] md:leading-[28px]'
                }}
                onClick={() => console.log('clicked')}
              />
                <div className='flex flex-row  ' >
                  <p className='  gap-1 font-normal text-lg text-gray-800'>{data.roleName}</p>
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
                    title: 'font-bold text-[16px] leading-[24px] md:text-[18px] md:leading-[28px]',
                    content: 'font-semibold text-purple-700 text-[16px] leading-[24px] md:text-[18px] md:leading-[28px]'
                  }}
                  onClick={() => console.log('clicked')}
                />
                <div className='flex flex-row  ' >
                <p className=' pt-1 pr-3 pb-1 pl-3 font-base  font-medium   rounded-2xl bg-purple-50 text-purple-700'>{data.passcode?data.passcode:'No Code Set'}</p>
                </div>
            </div>
          </div>
        </div>
      </div>
      <div className='flex items-center justify-center pb-4'>
        <button className="hover:text-white text-rose-700 bg-rose-50 font-base pt-[10px] pr-[18px] pb-[10px] pl-[18px] rounded-lg hover:bg-rose-600" onClick={props.onDeleteModalOpen}>Delete Staff Member</button>
      </div>
      </div>
      )}
     
    </div>
  );
};

export default StaffView;
