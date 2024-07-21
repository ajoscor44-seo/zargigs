import React, { useEffect, useState } from "react";
import banner from "../../assets/images/post_advert_banner.jpg";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { Link } from "react-router-dom/cjs/react-router-dom";

const Advertisements = () => {
  const defaultImageIndex = 0;
  const [currentIndex, setCurrentIndex] = useState(defaultImageIndex);
  const [advertisements, setAdvertisements] = useState([
    {
      name: "Sale Offer",
      description: "Join the moving train.....",
      link: "/advertisements",
      default: true,
    },
  ]);

  const carouselInterval = setInterval(() => {
    const randomIndex = () => {
      let index;
      do {
        index = Math.floor(Math.random() * advertisements.length);
      } while (index === defaultImageIndex);
      return index;
    };

    setCurrentIndex(randomIndex());

    return clearInterval(carouselInterval);
  }, 5000);

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
    getAdvertisements();
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
        {advertisements.length && !advertisements[currentIndex].default ? (
          <Link to={advertisements[currentIndex].link}>
            <img
              src={banner}
              alt={"Gigsflix advert banner"}
              className="w-full h-28 object-cover"
            />
          </Link>
        ) : !advertisements.length ? (
          <Link to={advertisements[currentIndex].link}>
            <img
              src={banner}
              alt={"Gigsflix advert banner"}
              className="w-full h-28 object-cover"
            />
          </Link>
        ) : (
          <a href={advertisements[currentIndex].link}>
            <img
              src={advertisements[currentIndex].banner}
              alt={`Slide ${currentIndex + 1}`}
              className="w-full h-28 object-cover"
            />
          </a>
        )}
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
