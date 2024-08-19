"use client";

import React, { useState,useContext } from 'react';
import ImageUploading, { ImageListType } from 'react-images-uploading';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/firebase/config";
import { useKitchen } from "@/app/context/KitchenContext";
import { FormContext } from "@/app/context/StaffContext";
import { UploadSvg } from "@/app/assets/svg/upload"
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
          <div className="flex flex-row upload__image-wrapper mt-6 justify-center items-center">
            {imageList.length === 0 &&
              <button
                className="flex flex-direction gap-2 font-semibold text-[14px] leading-[20px] md:text-[16px] md:leading-[24px]  bg-white text-gray-700 rounded-lg border-solid border border-gray-300 py-2 px-3.5 border-bottom"
                style={isDragging ? { color: 'red' } : undefined}
                onClick={onImageUpload}
                {...dragProps}
              >
                <UploadSvg />
                Upload(Optional)
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
                    className=" text-[14px] leading-[20px] md:text-[16px] md:leading-[24px] font-semibold bg-white text-gray-700 rounded-lg border-solid border border-gray-300 py-2 px-3.5 border-bottom"
                    onClick={() => onImageUpdate(index)}
                  >
                    Update
                  </button>
                  <button
                    className=" text-[14px] leading-[20px] md:text-[16px] md:leading-[24px] text-red-700 font-semibold py-2 px-3.5"
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

// "use client"

// import React ,{useState} from 'react';
// import ImageUploading, { ImageListType } from 'react-images-uploading';
// import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import { storage } from "@/firebase/config"
// export const  ImageUpload = function() {
//   const [images, setImages] = React.useState<ImageListType>([]);
//   const maxNumber = 1;

//   const onChange =async()=> (
//     imageList: ImageListType,
//     addUpdateIndex: number[] | undefined
//   ) => {
//     // data for submit
//     console.log(imageList, addUpdateIndex);
//     setImages(imageList);
//     const storageRef = ref(storage, `images/${imageList[0]?.name}`);
//     const [uploadedUrl, setUploadedUrl] = useState<string | null>(null); // State to store the uploaded image URL

//     // if (!file) return; // Return if no file is selected

//     // setUploading(true); // Set uploading state to true
//     // const storageRef = ref(storage, `images/${file?.name}`); // Create a reference to the file in Firebase Storage
//     try {
//       await uploadBytes(storageRef, imageList); // Upload the file to Firebase Storage
//       const url = await getDownloadURL(storageRef); // Get the download URL of the uploaded file
//       setUploadedUrl(url); // Set the uploaded image URL
//       console.log("File Uploaded Successfully");
//     } catch (error) {
//       console.error('Error uploading the file', error);
//     } finally {
//       // setUploading(false); // Set uploading state to false
//     }
//   };

//   return (
//     <div className="App">
//       <ImageUploading
//         multiple
//         value={images}
//         onChange={onChange}
//         maxNumber={maxNumber}
//         dataURLKey="data_url"
//       >
//         {({
//           imageList,
//           onImageUpload,
//           // onImageRemoveAll,
//           onImageUpdate,
//           onImageRemove,
//           isDragging,
//           dragProps,
//         }) => (
//           // write your building UI
//           <div className=" flex flex-row upload__image-wrapper  mt-6   justify-center items-center">
//             {imageList.length === 0 && 
//             <button className='bg-white text-gray-700  rounded-lg border-solid py-2 px-3.5 border-bottm'
//               style={isDragging ? { color: 'red' } : undefined}
//               onClick={onImageUpload}
//               {...dragProps}
//             >
//               Upload(Optional)
//             </button>
//             }
//             &nbsp;
//             {/* <button onClick={onImageRemoveAll}>Remove all images</button> */}
//             {imageList.map((image, index) => (
//               <div key={index} className="image-item ">
//                 <div className='rounded-xl'>
//                     <img src={image['data_url']} className='bg-emerald-100 rounded-full w-24 h-24' alt="" width="100" />
//                 </div>
//                 <div className="image-item__btn-wrapper flex flex-col  mt-2">
//                   <button className="bg-white text-gray-700 rounded-lg border-solid py-2 px-3.5 border-bottm" onClick={() => onImageUpdate(index)}>Update</button>
//                   <button className="text-red-700 font-semibold py-2 px-3.5" onClick={() => onImageRemove(index)}>Remove</button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </ImageUploading>
//     </div>
//   );
// }