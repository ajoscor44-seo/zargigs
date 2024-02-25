import React, { useState } from "react";
import Hero from "../components/Hero/Hero";
import AboutUs from "../components/AboutUs/AboutUs";
import WhatYouDo from "../components/WhatYouDo/WhatYouDo";
import Teams from "../components/Teams/Teams";
import ContactUs from "../components/ContactUs/ContactUs";
import OurHandles from "../components/OurHandles/OurHandles";
import Services from "../components/Services/Services";

const Home = () => {
  return (
    <div>
      <div className="relative">
        <Hero />
        <Services />
        <WhatYouDo />
        {/* <Teams /> */}
        <AboutUs />
        {/* <ContactUs /> */}
        <OurHandles />
      </div>
    </div>
  );
};

export default Home;
