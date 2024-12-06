import React from "react";

const Biography = ({imageUrl}) => {
  return (
    <>
      <div className="container biography">
        <div className="banner">
          <img src={imageUrl} alt="whoweare" />
        </div>
        <div className="banner">
         
          <h3>Who We Are</h3>
          <p>
          The medical staff is available 24 hrs in the campus. Housekeeping staff maintains strict cleanliness in the hospital. Ambulance services are provided by the Institute to attend to emergency cases and also in case more critical cases need to be taken to secondary or tertiary medical centres.
          </p>
          <p>We are all in 2024!</p>
          
          <p>
          A hospital is a healthcare institution providing patient treatment with specialized health science and auxiliary healthcare staff and medical equipment.[1] The best-known type of hospital is the general hospital, which typically has an emergency department to treat urgent health problems ranging from fire and accident victims to a sudden illness. A district hospital typically is the major health care facility in its region, with many beds for intensive care and additional beds for patients who need long-term care.
          </p>
          
        </div>
      </div>
    </>
  );
};

export default Biography;