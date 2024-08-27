"use client";

import React, { useState,useContext } from 'react';
import ImageUploading, { ImageListType } from 'react-images-uploading';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/firebase/config";
import { useKitchen } from "@/app/context/KitchenContext";
import { FormContext } from "@/app/context/StaffContext";
import { UploadSvg } from "@/app/assets/svg/upload"
import { twMerge } from 'tailwind-merge';
export const ImageUpload = function () {
  const [images, setImages] = useState<ImageListType>([]);
  const maxNumber = 1;
  const { state, dispatch } = useContext(FormContext)!;
  const { kitchen } = useKitchen();
  const kitchenId = kitchen?.kitchenId ?? null;

  const onChange = async (
    imageList: ImageListType,
    addUpdateIndex: number[] | undefined
  ) => {
    setImages(imageList);

    if (imageList.length > 0) {
      const imageFile = imageList[0].file;
      if (imageFile) {
        if (kitchenId) {
            const storageRef = ref(storage, `${kitchenId}/${imageFile.name}`);

            try {
              await uploadBytes(storageRef, imageFile);
              const url = await getDownloadURL(storageRef);
              dispatch({ type: 'SET_PROFILE_IMAGE_URL', payload: url });
              console.log("File Uploaded Successfully:", url);
            } catch (error) {
              console.error('Error uploading the file', error);
            }
        }
      }
    }
  };

  return (
    <div className="App">
      <ImageUploading
        multiple={false}
        value={images}
        onChange={onChange}
        maxNumber={maxNumber}
        dataURLKey="data_url"
      >
        {({
          imageList,
          onImageUpload,
          onImageUpdate,
          onImageRemove,
          isDragging,
          dragProps,
        }) => (
          <div className={twMerge(
            "flex flex-row upload__image-wrapper mt-6 justify-center items-center",
            images.length === 0 && 'justify-start'
          )}>
            {imageList.length === 0 &&
              <button
                className="flex flex-direction gap-2 font-semibold  text-[16px] leading-[24px]  bg-white text-gray-700 rounded-lg border-solid border border-gray-300 lg:px-5 lg:py-3 py-[10px] px-[18px] border-bottom hover:bg-gray-50 hover:text-gray-800"
                style={isDragging ? { color: 'red',boxShadow: '0 1px 2px 0 rgba(16, 24, 40, 0.05)' } : {boxShadow: '0 1px 2px 0 rgba(16, 24, 40, 0.05'}}
                onClick={onImageUpload}
                {...dragProps}
              >
                <UploadSvg />
                Upload (Optional)
              </button>
            }
            {imageList.map((image, index) => (
              <div key={index} className="image-item">
                <div className="rounded-xl">
                  <img
                    src={image['data_url']}
                    className="bg-emerald-100 rounded-full w-24 h-24"
                    alt=""
                    width="100"
                  />
                </div>
                <div className="image-item__btn-wrapper flex flex-col mt-2">
                  <button
                    className=" text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px] font-semibold bg-white text-gray-700 rounded-lg border-solid border border-gray-300 py-2 px-[14px] border-bottom hover:text-gray-800 hover:bg-gray-50"
                    style={{ boxShadow: '0 1px 2px 0 rgba(16, 24, 40, 0.05)' }}
                    onClick={() => onImageUpdate(index)}
                  >
                    Update
                  </button>
                  <button
                    className=" text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px] text-red-700 font-semibold py-2 px-[14px]"
                    onClick={() => onImageRemove(index)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </ImageUploading>
    </div>
  );
};

