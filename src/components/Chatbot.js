import React, { useState, useEffect, useRef } from "react";

import { FaRobot, FaTimes, FaPaperPlane } from "react-icons/fa";

import "./Chatbot.css";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);

  const [messages, setMessages] = useState([]);

  const [input, setInput] = useState("");

  const [loading, setLoading] = useState(false);

  const messageEndRef = useRef(null);

  const quickReplies = [
    "Membership Plans",
    "Gym Location",
    "Workout Tips",
    "Nutrition",
  ];

  // RESET CHAT EVERY OPEN

  useEffect(() => {
    if (isOpen) {
      setMessages([
        {
          sender: "bot",
          text: "👋 Welcome to MiloFit Gym! Ask me anything about fitness, nutrition, workouts, or memberships.",
        },
      ]);
    }
  }, [isOpen]);

  // AUTO SCROLL

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [messages]);

  // AI SIMULATION

  const generateBotReply = (message) => {
    const text = message.toLowerCase();

    // MEMBERSHIP

    if (
      text.includes("price") ||
      text.includes("membership") ||
      text.includes("plan")
    ) {
      return `
💪 We offer flexible membership plans including monthly memberships, personal training, and boxing packages.

Visit MiloFit Gym for detailed pricing and special offers.
      `;
    }

    // LOCATION

    if (
      text.includes("location") ||
      text.includes("address") ||
      text.includes("where")
    ) {
      return `
📍 MiloFit Gym is located in Sidi Gabir, Alexandria, Egypt — near the tram station.
      `;
    }

    // HOURS

    if (
      text.includes("open") ||
      text.includes("time") ||
      text.includes("hours")
    ) {
      return `
🕒 MiloFit Gym is open daily from 8 AM to 12 AM, including weekends.
      `;
    }

    // WORKOUTS

    if (
      text.includes("workout") ||
      text.includes("exercise") ||
      text.includes("training")
    ) {
      return `
🏋️ For best results:

• Train consistently
• Focus on proper form
• Combine strength + cardio
• Sleep well
• Stay hydrated
      `;
    }

    // MUSCLE GAIN

    if (
      text.includes("muscle") ||
      text.includes("bulk") ||
      text.includes("gain")
    ) {
      return `
💥 To build muscle effectively:

• Progressive overload
• Enough protein
• Quality sleep
• Strength training
• Consistent nutrition
      `;
    }

    // WEIGHT LOSS

    if (
      text.includes("fat") ||
      text.includes("lose weight") ||
      text.includes("belly")
    ) {
      return `
🔥 Fat loss requires:

• Calorie deficit
• Regular cardio
• Strength workouts
• Healthy eating
• Patience and consistency
      `;
    }

    // NUTRITION

    if (
      text.includes("food") ||
      text.includes("diet") ||
      text.includes("protein") ||
      text.includes("nutrition")
    ) {
      return `
🥗 Nutrition Tips:

• Eat more protein
• Drink enough water
• Reduce processed sugar
• Include vegetables daily
• Stay consistent
      `;
    }

    // GREETING

    if (text.includes("hello") || text.includes("hi") || text.includes("hey")) {
      return `
👋 Hey! Welcome to MiloFit Gym. How can I help you today?
      `;
    }

    // DEFAULT

    return `
💪 MiloFit Gym is here to help you with:

• Fitness
• Nutrition
• Muscle Building
• Weight Loss
• Memberships
• Workout Guidance

Ask me anything!
    `;
  };

  const sendMessage = async (text) => {
    if (!text.trim()) return;

    const userMessage = {
      sender: "user",
      text,
    };

    setMessages((prev) => [...prev, userMessage]);

    setInput("");
    setLoading(true);

    setTimeout(() => {
      const botReply = generateBotReply(text);

      const botMessage = {
        sender: "bot",
        text: botReply,
      };

      setMessages((prev) => [...prev, botMessage]);

      setLoading(false);
    }, 700);
  };

  return (
    <>
      {/* TOGGLE BUTTON */}

      <button
        className={`chat-toggle ${isOpen ? "active" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <FaTimes /> : <FaRobot />}
      </button>

      {/* CHATBOT */}

      <div className={`chatbot ${isOpen ? "open" : ""}`}>
        {/* HEADER */}

        <div className="chat-header">
          <div className="chat-header-left">
            <div className="bot-avatar">
              <FaRobot />
            </div>

            <div>
              <h3>MiloFit AI</h3>
              <p>Online Fitness Assistant</p>
            </div>
          </div>
        </div>

        {/* CHAT BODY */}

        <div className="chat-body">
          {messages.map((msg, index) => (
            <div key={index} className={`chat-row ${msg.sender}`}>
              <div className={`chat-message ${msg.sender}`}>{msg.text}</div>
            </div>
          ))}

          {loading && (
            <div className="chat-row bot">
              <div className="chat-message bot typing">Typing...</div>
            </div>
          )}

          <div ref={messageEndRef} />
        </div>

        {/* QUICK REPLIES */}

        <div className="quick-replies">
          {quickReplies.map((item, index) => (
            <button key={index} onClick={() => sendMessage(item)}>
              {item}
            </button>
          ))}
        </div>

        {/* INPUT */}

        <div className="chat-input">
          <input
            type="text"
            placeholder="Ask anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
          />

          <button onClick={() => sendMessage(input)}>
            <FaPaperPlane />
          </button>
        </div>
      </div>
    </>
  );
};

export default Chatbot;
