import React, { useState } from 'react';
import { Paragraph } from '../base/paragraph';
import { Avatar } from '../base/avatar';
import { CancelSvg } from '@/app/assets/svg/cancel';
import { ConfigStaffMember } from '@/app/src/types';
import CustomModal from '@/app/components/CustomModal';
import styles from "../Staff.module.scss";

type Props = {
  onClose: () => void,
  onDeleteModalOpen: () => void
  item? :ConfigStaffMember
}

const StaffView = (props: Props) => {

  const data=props.item
  return (
    <div className="bg-white shadow-lg rounded-lg h-full">
      {data&&(
      <div>
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
        <div className='shadow border border-gray-200 rounded'> 
          <div className='flex items-center justify-center border-b border-gray-200 py-4'>
              <div className='flex flex-col items-center gap-2'>
                  <div className='w-16 h-16 rounded-full bg-gray-200'>
                      {/* avatar */}
                  </div>
                  <p className="font-semibold  text-gray-800 text-base text-purple-700">Update Photo</p>
              </div>
          </div>
          <div className='flex flex-col'>
            <div className='p-4'>
                <Paragraph 
                  title='Personal Details'
                  content='Edit'
                  classOverride={{
                    container: 'flex-row justify-between mt-4 mb-2',
                    title: 'font-bold',
                    content: 'font-semibold text-purple-700'
                  }}
                  onClick={() => console.log('clicked')}
                />

                <div className="flex py-4">
                    <div className="flex-1 w-32">
                      <Paragraph 
                        title='First Name'
                        content={data.firstName}
                        classOverride={{
                          title: 'font-bold',
                          content: 'font-semibold'
                        }}
                      />
                    </div>
                    <div className="flex-1 w-32">
                      <Paragraph 
                          title='Last Name'
                          content={data.firstName}
                          classOverride={{
                            title: 'font-bold',
                            content: ''
                          }}
                        />

                    </div>
                </div>
                <div className="flex py-4">
                    <div className="flex-1 w-32">
                      <Paragraph 
                        title='Nick Name'
                        content={data.firstName}
                        classOverride={{
                          title: 'font-bold',
                          content: ' text-gray-800'
                        }}
                      />
                    </div>
                    <div className="flex-1 w-32">
                      <Paragraph 
                          title='Mobile'
                          content={'Not provided'}
                          classOverride={{
                            title: 'font-bold',
                            content: ' '
                          }}
                        />

                    </div>
                </div>
              
                <div className='flex py-4 pt-3'>
                      <Paragraph 
                          title='Email Address'
                          content={'Alfonso.Cassano@gmail.com'}
                          classOverride={{
                            title: 'font-bold',
                            content: ''
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
                  title: 'font-bold',
                  content: 'font-semibold text-purple-700'
                }}
                onClick={() => console.log('clicked')}
              />
              <p className='font-normal text-lg text-gray-800'>{data.roleName}</p>
            </div>
            <div className='flex flex-col gap-1 p-4 border-t border-gray-200'>
              <Paragraph 
                  title='POS Sign In Code'
                  content='Generate'
                  classOverride={{
                    container: 'flex-row justify-between',
                    title: 'font-bold',
                    content: 'font-semibold text-purple-700'
                  }}
                  onClick={() => console.log('clicked')}
                />
            
                <p className='pt-1 pr-3 pb-1 pl-3 font-base text-lg text-gray-900 rounded-2xl bg-purple-100 text-purple-700'>{data.passcode?data.passcode:'No Code Set'}</p>
            </div>
          </div>
        </div>
      </div>
      <div className='flex items-center justify-center'>
        <button className="text-rose-700 bg-rose-50 font-base pt-[10px] pr-[18px] pb-[10px] pl-[18px] rounded-lg" onClick={props.onDeleteModalOpen}>Delete Staff Member</button>
      </div>
      </div>
      )}
     
    </div>
  );
};

export default StaffView;
