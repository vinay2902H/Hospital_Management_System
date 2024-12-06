import React, { useContext } from "react";
import Hero from "../components/Hero";
import Biography from "../components/Biography";
import MessageForm from "../components/MessageForm";
import Departments from "../components/Departments";
import ChatbotFrame from "./Chat";
import Prescription from "../components/Prescription";
const Home = () => {
  return (
    <>
      <Hero
        title={
          "Welcome to RGUKT Medical Institute | Your Trusted Healthcare Provider"
        }
        imageUrl={"/doc1.png"}
      />
      <Biography imageUrl={"/hos.png"} />
      <Departments />
      <MessageForm />
       <ChatbotFrame/>
    </>
  );
};

export default Home;