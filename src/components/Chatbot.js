import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FaRobot } from "react-icons/fa";
import "./Chatbot.css";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem("chatbotMessages");
    return saved ? JSON.parse(saved) : [{ sender: "bot", text: "Hello! How can I help you today? 😊" }];
  });
  const [input, setInput] = useState("");
  const [showDefaults, setShowDefaults] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const messageEndRef = useRef(null);

  const defaultMessages = [
    { text: "What services do you offer?" },
    { text: "How can I join a gym?" },
    { text: "What are the pricing plans?" },
  ];

  const sendMessage = async (messageText) => {
    if (!messageText.trim()) return;

    const userMessage = { sender: "user", text: messageText };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setShowDefaults(false);
    setIsTyping(true);

    try {
      const response = await axios.post("http://localhost:5000/api/chat", {
        message: messageText,
      });

      const botMessage = {
        sender: "bot",
        text: response.data.response ,
      };

      setTimeout(() => {
        setMessages((prev) => [...prev, botMessage]);
        setIsTyping(false);
      }, 1000);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Sorry, something went wrong. 😓" },
      ]);
      setIsTyping(false);
    }
  };

  const handleInputSend = () => sendMessage(input);

  useEffect(() => {
    localStorage.setItem("chatbotMessages", JSON.stringify(messages));
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Restore quick replies after delay
  useEffect(() => {
    if (!showDefaults) {
      const timer = setTimeout(() => setShowDefaults(true), 20000);
      return () => clearTimeout(timer);
    }
  }, [showDefaults]);

  return (
    <div>
      <div className="chatbot-icon" onClick={() => setIsOpen(!isOpen)}>
        <FaRobot size={40} color="white" />
      </div>

      {isOpen && (
        <div className="chatbot-container">
          <div className="chatbot-header">
            <span>Milo AI Chat</span>
          </div>

          {showDefaults && (
            <div className="default-messages">
              {defaultMessages.map((msg, index) => (
                <button
                  key={index}
                  className="default-message-btn"
                  onClick={() => sendMessage(msg.text)}
                >
                  {msg.text}
                </button>
              ))}
            </div>
          )}

          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
            {isTyping && (
              <div className="message bot typing-indicator">
                Bot is typing<span className="dots">...</span>
              </div>
            )}
            <div ref={messageEndRef} />
          </div>

          <div className="chatbot-input">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              onKeyDown={(e) => e.key === "Enter" && handleInputSend()}
            />
            <button onClick={handleInputSend}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
