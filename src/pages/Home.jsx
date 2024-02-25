import React, { useState } from "react";
import Hero from "../components/Hero/Hero";
import AboutUs from "../components/AboutUs/AboutUs";
import WhatYouDo from "../components/WhatYouDo/WhatYouDo";
import OurHandles from "../components/OurHandles/OurHandles";
import Services from "../components/Services/Services";
import Footer from "../components/Footer/Footer";

const Home = () => {
  return (
    <div>
      <div className="relative">
        <Hero />
        <Services />
        <WhatYouDo />
        <AboutUs />
        <OurHandles />
        <Footer />
      </div>
    </div>
  );
};

export default Home;
