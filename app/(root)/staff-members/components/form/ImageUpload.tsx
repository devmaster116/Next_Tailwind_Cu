"use client";

import React, { useState, useContext, useRef, useEffect } from "react";
import ImageUploading, { ImageListType } from "react-images-uploading";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/firebase/config";
import { useKitchen } from "@/app/context/KitchenContext";
import { FormContext } from "@/app/context/StaffContext";
import { UploadSvg } from "@/app/assets/svg/upload";
import { twMerge } from "tailwind-merge";

export const ImageUpload = function () {
  const [forceRenderKey, setForceRenderKey] = useState<number>(0); // Key for forcing re-render
  const fileInputRef = useRef<HTMLInputElement>(null); // Ref for file input
  const maxNumber = 1;
  const { state, dispatch } = useContext(FormContext)!;
  const { kitchen } = useKitchen();
  const kitchenId = kitchen?.kitchenId ?? null;
  const [images, setImages] = useState<ImageListType>(
    state.displayImageURL ? [{ data_url: state.displayImageURL }] : []
  );

  useEffect(() => {
    if (state.displayImageURL) {
      setImages([{ data_url: state.displayImageURL }]);
    }
  }, [state.displayImageURL]);

  
  const uploadImage = async (imageFile: File) => {
    if (imageFile && kitchenId) {
      const storageRef = ref(storage, `${kitchenId}/${imageFile.name}`);
      try {
        await uploadBytes(storageRef, imageFile);
        const url = await getDownloadURL(storageRef);
        dispatch({ type: "SET_PROFILE_IMAGE_URL", payload: url });
        console.log("File Uploaded Successfully:", url);
        return url;
      } catch (error) {
        console.error("Error uploading the file", error);
      }
    }
  };

  const onChange = async (imageList: ImageListType) => {
    setImages(imageList);

    if (imageList.length > 0) {
      const imageFile = imageList[0].file;
      if (imageFile) {
        await uploadImage(imageFile);
      }
    }
  };

  const onImageUpdate = async (index: number) => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Open the file input dialog
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const newImageUrl = await uploadImage(file);

      // Update the image in the state
      setImages([{ data_url: newImageUrl, file }]);
      
      // Force re-render to ensure the new image is displayed
      setForceRenderKey((prevKey) => prevKey + 1);
    }
  };

  const onImageRemove = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);

    // Clear the image URL when the image is removed
    dispatch({ type: "SET_PROFILE_IMAGE_URL", payload: "" });
  };

  return (
    <div className="App" key={forceRenderKey}>
      <input
        type="file"
        ref={fileInputRef} // Use the file input ref to trigger click
        style={{ display: "none" }}
        accept="image/*"
        onChange={handleFileChange}
      />
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
          isDragging,
          dragProps,
        }) => (
          <div
            className={twMerge(
              "flex flex-row upload__image-wrapper mt-6 justify-center items-center",
              images.length === 0 && "justify-start"
            )}
          >
            {imageList.length === 0 && (
              <button
                className="flex flex-direction gap-2 font-semibold  text-[16px] leading-[24px]  bg-white text-gray-700 rounded-lg border-solid border border-gray-300 lg:px-5 lg:py-3 py-[10px] px-[18px] border-bottom hover:bg-gray-50 hover:text-gray-800"
                style={
                  isDragging
                    ? {
                        color: "red",
                        boxShadow: "0 1px 2px 0 rgba(16, 24, 40, 0.05)",
                      }
                    : { boxShadow: "0 1px 2px 0 rgba(16, 24, 40, 0.05" }
                }
                onClick={onImageUpload}
                {...dragProps}
              >
                <UploadSvg />
                Upload (Optional)
              </button>
            )}
            {imageList.map((image, index) => (
              <div key={index} className="image-item">
                <div className="rounded-xl">
                  <img
                    src={image["data_url"]}
                    className="bg-emerald-100 rounded-full w-24 h-24"
                    alt=""
                    width="100"
                  />
                </div>
                <div className="image-item__btn-wrapper flex flex-col mt-2">
                  <button
                    className=" text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px] font-semibold bg-white text-gray-700 rounded-lg border-solid border border-gray-300 py-2 px-[14px] border-bottom hover:text-gray-800 hover:bg-gray-50"
                    onClick={() => onImageUpdate(index)} // Open the file input for updating the image
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