import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import FormInput from "../FormInput/FormInput";
import axios from "axios";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../../config/firebase.config";
import PayAmountBar from "../PayAmountBar/PayAmountBar";

const CreateAdvertisement = ({ setCreatingAdvert }) => {
  const [imagePercentage, setImagePercentage] = useState(0);
  const [imageError, setImageError] = useState(null);
  const [advertData, setAdvertData] = useState({
    name: "",
    description: "",
    duration: 1,
    banner: "",
    link: "",
  });
  const amountToPay = advertData.duration * 1500;

  const handleChange = (e) => {
    const isFile = e.target.type === "file";

    if (isFile) {
      return handleFileInputChange(e);
    }
    return setAdvertData({
      ...advertData,
      [e.target.name]: e.target.value,
    });
  };

  // Handles File Input
  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    if (!file) {
      alert("No file chosen.");
      return;
    }

    if (file.type.startsWith("image") && file.size > 2097152) {
      // 2 MB for images
      return alert("The photo is too large. Maximum size is 2 MB.");
    } else if (file.type.startsWith("video")) {
      // No video allowed
      return alert("Video is not allowed as media type.");
    } else {
      alert("File is accepted.");
      // Handle the file upload process here
      return uploadMedia(file);
    }
  };

  // Upload Profile Picture
  const uploadMedia = (image) => {
    setImagePercentage(null);
    setImageError(null);
    const fileName = new Date().getTime() + image.name;
    const storageRef = ref(storage, "advertisments/" + fileName);
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
          setImageError(null);
          console.log(downloadUrl);
          return setAdvertData({
            ...advertData,
            banner: downloadUrl,
          });
        });
      }
    );
    return;
  };

  const createAdvertisement = async () => {
    try {
      if (
        !advertData.banner ||
        !advertData.name ||
        !advertData.description ||
        !advertData.duration ||
        !advertData.link
      ) {
        return alert("Incomplete data for advertisement");
      }
      const response = await axios.post("/api/v1/advertisements", advertData);

      alert(`${response.data.message}. Thanks for choosing Gigsflix!`);
      return setCreatingAdvert(false);
    } catch (error) {
      console.error(error);
      alert(error.response.data.message || "Oops an error occurred!");
    }
  };

  return (
    <div>
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
          label={"Advert Destination"}
          placeholder={"https://your-contact-link"}
          isError={false}
          type={"text"}
          name={"link"}
          handleChange={handleChange}
          note={
            "This can be the link to your whatsapp chat or customer support."
          }
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
        <p className="w-full">
          {imageError ? (
            <span className="text-red-500 text-center text-sm w-full">
              Oops an error occurred
            </span>
          ) : imagePercentage ? (
            <span className="text-green-500 text-center text-sm w-full">
              {imagePercentage}
            </span>
          ) : (
            <span></span>
          )}
        </p>
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
      <PayAmountBar
        feeTitle={"Advertisement Fee:"}
        fee={amountToPay}
        disable={
          !advertData.banner ||
          !advertData.name ||
          !advertData.description ||
          !advertData.duration ||
          !advertData.link
        }
        btnText={"Pay For Advert"}
        handleClick={createAdvertisement}
      />
    </div>
  );
};

export default CreateAdvertisement;
