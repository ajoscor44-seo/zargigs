import React from "react";
import banner from "../../assets/images/gigsflix_advert_banner.png";

const Advertisements = () => {
  return (
    <div className="border rounded-sm mx-4 px-2 py-3">
      <img
        className="w-full h-20 object-cover"
        src={banner}
        alt="Advert banner"
      />
    </div>
  );
};

export default Advertisements;
