"use client";

import React, { useState, useContext, useEffect } from "react";
import ImageUploading, { ImageListType } from "react-images-uploading";
import { ref, uploadBytes, getDownloadURL, getStorage } from "firebase/storage";

import { storage } from "@/firebase/config";
import { useKitchen } from "@/app/context/KitchenContext";
import { FormContext } from "@/app/context/StaffContext";
import { UploadSvg } from "@/app/assets/svg/upload";
import { twMerge } from "tailwind-merge";
import { getShrinkName } from "@/app/utils";
import { ConfigStaffMember } from "@/app/src/types";
import { editImageUploadDB } from "../../data-fetching";

export const EditImageUpload = function ({
  img,
  data,
}: {
  img: string;
  data: ConfigStaffMember;
}) {
  const [images, setImages] = useState<ImageListType>([]);
  const maxNumber = 1;
  const {
    state,
    dispatch,
    currentStaff,
    loadStaffForEdit,
    updateStaffInFirebase,
  } = useContext(FormContext)!;
  const { kitchen } = useKitchen();
  const kitchenId = kitchen?.kitchenId ?? null;
  const [firebaseImageUrl, setFirebaseImageUrl] = useState<string | null>(null);
  const onChange = async (
    imageList: ImageListType,
    addUpdateIndex: number[] | undefined
  ) => {
    setImages(imageList);

    if (imageList.length > 0) {
      const imageFile = imageList[0].file;
      if (imageFile && kitchenId) {
        const storageRef = ref(storage, `${kitchenId}/${imageFile.name}`);
        try {
          await uploadBytes(storageRef, imageFile);
          const url = await getDownloadURL(storageRef);

          console.log("File Uploaded Successfully:", url);

          if (currentStaff) {
            const updatedStaff = {
              ...currentStaff, // Keep all existing values
              displayImageURL: url, // Overwrite with the new user info
            };
            loadStaffForEdit(updatedStaff);
            try {
              // Update staff member in the db
              await updateStaffInFirebase(updatedStaff, kitchenId);
            } catch (error) {
              console.error("Error updating staff:", error);
            }
          }
        } catch (error) {
          console.error("Error uploading the file", error);
        }
      }
    }
  };

  return (
    <ImageUploading
      value={images}
      onChange={onChange}
      maxNumber={maxNumber}
      dataURLKey="data_url"
    >
      {({ imageList, onImageUpload, onImageUpdate, isDragging, dragProps }) => (
        <div
          className={twMerge(
            "flex flex-col upload__image-wrapper justify-center items-center"
          )}
        >
          {imageList.length < 1 && (
            <div className="">
              {img ? (
                <div className="rounded-xl flex flex-col justify-center items-center">
                  <img
                    src={img}
                    className="rounded-full w-16 h-16 rounded-full"
                    alt="Uploaded"
                    width="100"
                  />
                  <button
                    className="flex flex-direction mt-2 font-semibold text-gray-800 text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px] text-purple-700"
                    style={isDragging ? { color: "red" } : undefined}
                    onClick={onImageUpload}
                    {...dragProps}
                  >
                    Update Photo
                  </button>
                </div>
              ) : (
                <div className="flex flex-col justify-center items-center">
                  <div className="flex w-16 h-16 bg-gray-200 rounded-full justify-center items-center">
                    <span className="text-2xl font-medium text-gray-600">
                      {data?.firstName && data?.lastName
                        ? getShrinkName(data.firstName, data.lastName)
                        : "GC"}
                    </span>
                  </div>
                  <button
                    className="flex flex-direction mt-2 font-semibold text-gray-800 text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px] text-purple-700"
                    style={isDragging ? { color: "red" } : undefined}
                    onClick={onImageUpload}
                    {...dragProps}
                  >
                    Add Photo
                  </button>
                </div>
              )}
            </div>
          )}
          {imageList.map((image, index) => (
            <div
              key={index}
              className="flex flex-col justify-center items-center"
            >
              <div className="rounded-xl">
                <img
                  src={image.data_url}
                  className="rounded-full w-16 h-16"
                  alt="Uploaded"
                  width="100"
                />
              </div>
              <div className="image-item__btn-wrapper flex flex-col mt-2">
                <button
                  className="font-semibold text-gray-800 text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px] text-purple-700"
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
