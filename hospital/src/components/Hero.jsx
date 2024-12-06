import React from "react";

const Hero = ({ title, imageUrl }) => {
  return (
    <>
      <div className="hero">
        <div className="banner">
          <h1>{title}</h1>
          <p>
          RGUKT provides its students and staff with primary health facilities and basic medical support. A medical centre with the required facilities is available within the campus. The centre consists of: 30 beds 5 doctors
           5 nurses and other medical staff like pharmacist, medical assistants etc.Pharmacy Dispensary Mini operation theatre

          </p>
        </div>
        <div className="banner">
          <img src={imageUrl} alt="hero" className="animated-image" />
          <span>
            <img src="bg2.png" alt="vector" className="home-image"  />
            </span>
        </div>
      </div>
    </>
  );
};

export default Hero;