"use client";

import React, { useState,useContext } from 'react';
import ImageUploading, { ImageListType } from 'react-images-uploading';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/firebase/config";
import { useKitchen } from "@/app/context/KitchenContext";
import { FormContext } from "@/app/context/StaffContext";
import { UploadSvg } from "@/app/assets/svg/upload"
import { twMerge } from 'tailwind-merge';
export const EditImageUpload = function () {
  const [images, setImages] = useState<ImageListType>([]);
  const maxNumber = 1;
  const { state, dispatch } = useContext(FormContext)!;
  const { kitchen } = useKitchen();
  const kitchenId = kitchen?.kitchenId ?? null;

  const onChange = async (
    imageList: ImageListType,
    addUpdateIndex: number[] | undefined
  ) => {
    console.log(imageList, addUpdateIndex);
    setImages(imageList);

    if (imageList.length > 0) {
      const imageFile = imageList[0].file;
      if (imageFile) {
        if (kitchenId) {
            const storageRef = ref(storage, `${kitchenId}/${imageFile.name}`);

            try {
              await uploadBytes(storageRef, imageFile);
              const url = await getDownloadURL(storageRef);
              dispatch({ type: 'SET_PROFILE_IMAGE_URL', payload: imageFile.name });
              console.log("File Uploaded Successfully:", url);
            } catch (error) {
              console.error('Error uploading the file', error);
            }
        }
      }
    }
  };

  return (
  
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
          isDragging,
          dragProps,
        }) => (
          <div className={twMerge(
            "flex flex-row upload__image-wrapper mt-6 justify-center items-center"
          )}>
            {imageList.length === 0 &&
              <button
                className="flex flex-direction font-semibold  text-gray-800 text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px] text-purple-700"
                style={isDragging ? { color: 'red' } : undefined}
                onClick={onImageUpload}
                {...dragProps}
              >
             
               Add Photo
              </button>
            }
            {imageList.map((image, index) => (
              <div key={index} className="image-item">
                <div className="rounded-xl">
                  <img
                    src={image['data_url']}
                    className="rounded-full w-16 h-16"
                    alt=""
                    width="100"
                  />
                </div>
                <div className="image-item__btn-wrapper flex flex-col ">
                  <button
                    className=" font-semibold  text-gray-800 text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px] text-purple-700"
                    onClick={() => onImageUpdate(index)}
                  >
                    Update Photo
                  </button>
           
                </div>
              </div>
            ))}
          </div>
        )}
      </ImageUploading>
  
  );
};

