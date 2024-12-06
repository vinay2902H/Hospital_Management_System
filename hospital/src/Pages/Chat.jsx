import React, { useState } from 'react';
import './Chat.css'; // Import the CSS styles
import { FaComments } from 'react-icons/fa'; // Using react-icons for message icon
import { FiMessageCircle } from "react-icons/fi";

const ChatbotFrame = () => {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  const toggleChatbot = () => {
    setIsChatbotOpen(!isChatbotOpen);
  };

  return (
    <>
      {/* Chatbot Container */}
      <div className={`chatbot-iframe-container ${isChatbotOpen ? 'open' : ''}`}>
        {/* "Hello" Text */}
        <div className="hello-text">INSTANT TREATMENT</div>
        <iframe
          src="https://www.chatbase.co/chatbot-iframe/p0qO2lBQpj8BP5HCXmzE1"
          title="Chatbot"
        ></iframe>
        <h3 className="bottilt">Instant treatment</h3>
        <button className="close-chatbot-btn" onClick={toggleChatbot}>
          Close
        </button>
      </div>

      {/* Floating Message Icon Button */}
      <div className="chatbot-btn-container">
      <button className="open-chatbot-btn" onClick={toggleChatbot}>
        <FiMessageCircle size={25} />
        <span className="tooltip">Open Chatbot</span>
      </button>
    </div>
    </>
  );
};

export default ChatbotFrame;
