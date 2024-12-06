import React from "react";
import Hero from "../components/Hero";
import Biography from "../components/Biography";
import ScrollPlayVideo from "../components/video";
const AboutUs = () => {
  return (
    <>
      <Hero
        title={"Learn More About Us | RGUKT Medical Institute"}
        imageUrl={"/learn.png"}
      />
      <ScrollPlayVideo/>
      <Biography imageUrl={"/whoweare.png"} />
    </>
  );
};

export default AboutUs;