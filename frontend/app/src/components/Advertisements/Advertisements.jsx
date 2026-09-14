import React, { useEffect, useState } from "react";
import "./Advertisements.css";
import banner from "../../assets/images/post_advert_banner.jpg";
import { FaAngleLeft, FaAngleRight, FaSpinner } from "react-icons/fa6";
import { Link } from "react-router-dom/cjs/react-router-dom";
import axios from "axios";

const Advertisements = () => {
  const [loading, setLoading] = useState(true);
  const [advertisements, setAdvertisements] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const carouselInfiniteScroll = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % advertisements.length);
  };

  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % advertisements.length);
  };

  const prevImage = () => {
    setCurrentIndex(
      (prevIndex) =>
        (prevIndex - 1 + advertisements.length) % advertisements.length
    );
  };

  const getAdvertisements = async () => {
    try {
      const response = await axios.get("/api/v1/advertisements");

      const advertisementsData = [
        {
          default: true,
          description: "Place your advert on DocsZar today!",
          link: "/advertisements",
          name: "DocsZar advert",
          banner: banner,
        },
        ...response.data.data,
      ];
      setAdvertisements(advertisementsData);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAdvertisements();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      carouselInfiniteScroll();
    }, 3000);

    return () => clearInterval(interval);
  }, [advertisements.length]);

  return (
    <div className="advertisement-container">
      {loading ? (
        <p className="flex justify-center items-center h-28">
          <FaSpinner size={20} color="green" />
        </p>
      ) : (
        <div
          className="advertisement-slide"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {advertisements.map((ad, index) => (
            <div className="advertisement" key={index}>
              {ad.default ? (
                <Link to={ad.link}>
                  <img src={ad.banner} alt="Advertisement" />
                </Link>
              ) : (
                <a target="_blank" href={ad.link} rel="noopener noreferrer">
                  <img src={ad.banner} alt="Advertisement" />
                </a>
              )}
            </div>
          ))}
        </div>
      )}
      <button onClick={prevImage} className="arrow-button left">
        <FaAngleLeft size={25} />
      </button>
      <button onClick={nextImage} className="arrow-button right">
        <FaAngleRight size={25} />
      </button>
    </div>
  );
};

export default Advertisements;
