import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import FormInput from "../FormInput/FormInput";
import axios from "axios";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../../config/firebase.config";

const CreateAdvertisement = ({
  advertData,
  setAdvertData,
  setCreatingAdvert,
}) => {
  const [image, setImage] = useState(null);
  const [imagePercentage, setImagePercentage] = useState(0);
  const [imageError, setImageError] = useState(null);

  const handleChange = (e) => {
    const isFile = e.target.type === "file";

    if (isFile) {
      handleFileInputChange(e);
      return setAdvertData({
        ...advertData,
        [e.target.name]: image,
      });
    }
    return setAdvertData({
      ...advertData,
      [e.target.name]: e.target.value,
    });
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
    const storageRef = ref(storage, "profile_pics/" + fileName);
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

  const createAdvertisement = async () => {
    try {
      const response = await axios.post("/api/v1/advertisements", advertData);

      return console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="shadow-2xl border flex flex-col w-full px-5 gap-3 py-5">
      <div className="flex items-center justify-between">
        <h2 className="font-bold">Advert Setup</h2>
        <button
          className="border rounded-full p-1"
          onClick={() => setCreatingAdvert(false)}
        >
          <IoClose size={20} className="text-red-500" />
        </button>
      </div>
      <FormInput
        label={"Name Your Advert"}
        placeholder={"Advert Name"}
        isError={false}
        type={"text"}
        name={"name"}
        handleChange={handleChange}
      />
      <FormInput
        label={"Advert Link"}
        placeholder={"https://www.example.com/link-to-advert"}
        isError={false}
        type={"text"}
        name={"link"}
        handleChange={handleChange}
      />
      <FormInput
        label={"Description"}
        placeholder={"Describe Your Advert"}
        isError={false}
        type={"text"}
        name={"description"}
        handleChange={handleChange}
        useTextArea={true}
      />
      <FormInput
        label={"Upload Banner"}
        placeholder={"Describe Your Advert"}
        isError={false}
        type={"file"}
        name={"banner"}
        handleChange={handleChange}
      />
      <FormInput
        label={"Duration (in Days)"}
        placeholder={"Number of days you want your advert to use on gigsflix"}
        isError={false}
        type={"number"}
        name={"duration"}
        handleChange={handleChange}
      />
    </div>
  );
};

export default CreateAdvertisement;
