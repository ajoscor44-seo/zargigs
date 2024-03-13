import React, { useState } from "react";
import BackNav from "../components/BackNav/BackNav";
import { useParams } from "react-router-dom/cjs/react-router-dom";
import waysToCreateAdvertTasks from "../data/waysToCreateAdvertsTasks";
import PricingWay from "../components/PricingWay/PricingWay";
import ClientMenuBar from "../components/ClientMenuBar/ClientMenuBar";
import FormInput from "../components/FormInput/FormInput";
import PayAmountBar from "../components/PayAmountBar/PayAmountBar";
import { FcAddImage } from "react-icons/fc";
import { FaVideo } from "react-icons/fa6";
import allStates from "../data/states";
import religions from "../data/religions";

const CreateAdvert = () => {
  const [activeMediaUploadTab, setActiveMediaUploadTab] = useState("photo");
  const params = useParams();
  const slug = params.slug;

  const wayToCreateAdvert = waysToCreateAdvertTasks.find(
    (wayToCreateAdvertTasks) => {
      return wayToCreateAdvertTasks.pathToPage == "/advertise/" + slug;
    }
  );

  return (
    <div>
      <BackNav
        pageName={"Post Advert on " + wayToCreateAdvert.platformName}
        usePath={true}
        pathToGo={"/advertise"}
      />
      <div className="underBackNav font-primary mb-28">
        <PricingWay
          way={wayToCreateAdvert}
          wayDescription={wayToCreateAdvert.description}
        />
        <div className="p-4 border-t flex flex-col gap-3">
          <FormInput
            type={"number"}
            fullRounded={true}
            placeholder={"No. Of Whatsapp Status Advert Posts"}
            label={"Number of Whatsapp Status Advert Posts You Want"}
            note={
              "This is the desired Number of Whatsapp Status Advert Posts you want us to get for you."
            }
            errorMsg={"Please input a valid number"}
            isError={false}
          />
          <FormInput
            label={"Select Gender"}
            placeholder={"Select Gender"}
            useSelect={true}
            selections={["Select Gender", "Male", "Female"]}
            note={
              "You can select the kind of gender whether male or female that you want to see your task. For example, if you are selling women fashion items, you can select the Female gender so your task will be shown to only females. Select 'All Gender' if you want to target all genders"
            }
            errorMsg={"Please select a gender category"}
            isError={false}
          />
          <FormInput
            label={"Select Location"}
            placeholder={"Select Location"}
            useSelect={true}
            selections={["Select Location", "All Nigeria", ...allStates]}
            note={
              "You can target and select a particular location where your task or advert will be mostly shown. Select 'All Nigeria' if you want to target every location in Nigeria"
            }
            errorMsg={"Please select a location"}
            isError={false}
          />
          <FormInput
            label={"Select Religion"}
            placeholder={"Select Religion"}
            useSelect={true}
            selections={["Select Religion", "All Religions", ...religions]}
            note={
              "You can target people of a particular religion or belief. Your advert and task will be shown to the particular religion you select. Select 'All Religion' if you want to target all religion."
            }
            errorMsg={"Please select a religion"}
            isError={false}
          />
          <FormInput
            label={"Enter Advert Text or Caption"}
            placeholder={""}
            useTextArea={true}
            note={
              "Please enter the advert text or caption. The advert text or caption should be well detailed. You can also include a link to your site, a phone number for people to contact you or any information you want people to see on your advert."
            }
            errorMsg={"Please select a religion"}
            isError={false}
          />
        </div>

        <div className="px-4 pb-6">
          <h2 className="text-xs font-semibold mb-2">
            Choose one of the Advert Media Upload Below:
          </h2>
          <div className="flex">
            <div
              className={
                "uploadAdvertMediaTab " +
                (activeMediaUploadTab === "photo" && "active")
              }
              onClick={() => setActiveMediaUploadTab("photo")}
            >
              Upload Photo Advert
            </div>
            <div
              className={
                "uploadAdvertMediaTab " +
                (activeMediaUploadTab === "video" && "active")
              }
              onClick={() => setActiveMediaUploadTab("video")}
            >
              Upload Video Advert
            </div>
          </div>
          <p className="methodNote leading-1 mt-2">
            Upload a {activeMediaUploadTab.toUpperCase()} of the Advert You want
            people to post on their social media post accounts like Whatsapp,
            Facebook, Instagram, Twitter, Tiktok etc.
          </p>
          <div className="flex flex-col items-center bg-gray-100 py-10 mx-3 rounded-sm mt-2 cursor-pointer border">
            <div>
              {activeMediaUploadTab == "photo" ? (
                <FcAddImage size={30} />
              ) : (
                <FaVideo className="text-gray-600" size={30} />
              )}
            </div>
            <span className="capitalize text-xs font-semibold mt-1">
              Upload {activeMediaUploadTab}
            </span>
          </div>
        </div>
      </div>

      <PayAmountBar
        feeTitle={"You will pay"}
        fee={0}
        btnText={"Submit and Make Payment"}
      />
      <ClientMenuBar />
    </div>
  );
};

export default CreateAdvert;
