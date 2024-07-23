import React, { useEffect, useState } from "react";
import "./Advertisements.css";
import banner from "../../assets/images/post_advert_banner.jpg";
import banner1 from "../../assets/images/gigsflix_advert_banner.png";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { Link } from "react-router-dom/cjs/react-router-dom";

const Advertisements = () => {
  const [loading, setLoading] = useState(true);
  const [advertisements, setAdvertisements] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const carouselInfiniteScroll = () => {
    if (currentIndex === advertisements.length - 1) {
      return setCurrentIndex(0);
    }
    return setCurrentIndex(currentIndex + 1);
  };

  const nextImage = () => {
    setCurrentIndex((currentIndex + 1) % advertisements.length);
  };

  const prevImage = () => {
    setCurrentIndex(
      (currentIndex - 1 + advertisements.length) % advertisements.length
    );
  };

  const getAdvertisements = () => {
    try {
      //
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      carouselInfiniteScroll();
    }, 3000);

    return () => clearInterval(interval);
  });

  useEffect(() => {
    return getAdvertisements();
  }, []);

  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-2xl mx-auto relative">
        <button
          onClick={prevImage}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 text-gray-500 px-4 py-2 rounded-md"
        >
          <FaAngleLeft size={25} />
        </button>
        <div className="border">
          <Link to="/advertisements">
            <img
              src={banner}
              alt={"Advertisement"}
              className="w-full h-28 object-cover"
            />
          </Link>
        </div>
        <button
          onClick={nextImage}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-500 px-4 py-2 rounded-md"
        >
          <FaAngleRight size={25} />
        </button>
      </div>
    </div>
  );
};

export default Advertisements;
