import React, { useRef, useState } from "react";
import { BiArrowToRight, BiCamera } from "react-icons/bi";
import { FaCamera } from "react-icons/fa";
import { FaUserLarge } from "react-icons/fa6";
import { IoIosArrowForward } from "react-icons/io";
import { IoArrowForward } from "react-icons/io5";
import { storage } from "../../config/firebase.config";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

const UploadProfilePic = ({ setActivePage, image, setImage }) => {
  const fileInputRef = useRef();
  const [imageError, setImageError] = useState(null);
  const [imagePercentage, setImagePercentage] = useState(null);

  // Selects Profile Picture
  const selectProfilePic = () => {
    fileInputRef.current.click();
  };

  // Handles File Input
  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    return uploadProfilePic(file);
  };

  // Upload Profile Picture
  const uploadProfilePic = (image) => {
    setImagePercentage(null);
    setImageError(null);
    const fileName = new Date().getTime() + image.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, image);

    // Returns the progress of the image
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setImagePercentage(progress);
      },
      (error) => {
        setImagePercentage(null);
        return setImageError(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
          setImage(downloadUrl);
          setImageError(null);
        });
      }
    );
    return;
  };

  return (
    <div
      className="font-primary mx-3 mt-3 mb-20 flex flex-col justify-center"
      style={{ maxWidth: "400px" }}
    >
      <div className="bg-white rounded flex flex-col shadow-2xl overflow-hidden">
        <span className="flex justify-between items-center px-3 py-2 border-b text-sm">
          <h2 className="font-bold">More About You</h2>{" "}
          <button
            onClick={() => setActivePage("bank-details")}
            className="text-white bg-green-500 px-5 py-2 rounded-full flex items-center gap-1"
          >
            <span>SKIP</span>
            <IoIosArrowForward size={15} className="font-bold" />
          </button>
        </span>

        <div className="p-3 flex flex-col gap-2">
          <div className="flex flex-col gap-2 py-0">
            <button
              onClick={() => setActivePage("location")}
              className="bg-gray-400 flex items-center justify-center gap-1 text-white p-2 w-fit rounded"
            >
              <span>Back</span>
              <span>
                <IoArrowForward />
              </span>
            </button>
            <div className="flex justify-center items-center mt-5">
              <FaCamera size={70} className="text-green-500" />
            </div>
            <h1 className="text-center text-xl font-extrabold">
              You are almost done!
            </h1>
            <p className="text-center font-semibold text-xs">
              You are almost done with setting up your account, Simply upload a
              profile picture to enable people recognise and connect with you
              faster.
            </p>
          </div>
        </div>
        <span className="text-center">
          {imageError && (
            <h1 className="text-sm font-bold self-center mx-0 my-auto text-red-500">
              Error Uploading. File size must be less than 2mb
            </h1>
          )}
        </span>
        <div className="flex justify-center pt-1 pb-5">
          <div
            className="relative bg-green-200 w-fit p-5 rounded-full"
            onClick={selectProfilePic}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileInputChange}
              accept="image/*"
              style={{ display: "none" }}
            />
            {imagePercentage == 100 ? (
              <img
                src={image}
                className="w-44 h-44 object-cover rounded-full"
                alt="User Profile Picture"
              />
            ) : (
              <FaUserLarge size={120} className="text-green-500 rounded-full" />
            )}
            {imagePercentage && imagePercentage < 100 ? (
              <div className="flex flex-col items-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white">
                <h1 className="font-bold text-5xl  text-slate-100">100</h1>
                <span className="text-sm font-bold text-nowrap text-slate-50">
                  Uploading Image....
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white">
                <BiCamera size={30} className="text-white" />
                <span className="text-nowrap">Click to Upload</span>
              </div>
            )}
          </div>
        </div>

        {image && (
          <button
            onClick={() => setActivePage("bank-details")}
            className="flex items-center justify-center gap-1 text-green-500 bg-green-200 capitalize px-5 py-3 font-bold"
          >
            <span>Use and continue</span>
            <span>
              <BiArrowToRight size={25} />
            </span>
          </button>
        )}
      </div>
    </div>
  );
};

export default UploadProfilePic;
