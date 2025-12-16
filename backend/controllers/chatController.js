const axios = require("axios");
require("dotenv").config();

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY; // Ensure it's in .env

// Predefined responses for common questions
const chatResponses = {
    "What services do you offer?": "We offer personal training, group classes, workout plans and nutrition plans.",
    "How can I join a gym?": "You can subscribe on our website or visit our gym in person.",
    "What are the pricing plans?": "Our membership plans start at 1500 egp/month, with premium options available.",
};

exports.getChatbotResponse = async (req, res) => {
    try {
        const userMessage = req.body.message?.trim();

        if (!userMessage) {
            return res.status(400).json({ error: "Message is required" });
        }

        // 🔥 Check predefined responses first
        if (chatResponses[userMessage]) {
            return res.json({ response: chatResponses[userMessage] });
        }

        // Call OpenRouter AI if no predefined response exists
        const response = await axios.post(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                model: "mistralai/mistral-7b-instruct",
                messages: [{ role: "user", content: userMessage }],
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${OPENROUTER_API_KEY}`,
                },
            }
        );

        console.log("Chatbot Response:", response.data);

        res.json({ response: response.data.choices[0]?.message?.content || "No response from chatbot" });
    } catch (error) {
        console.error("Chatbot Error:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to get chatbot response" });
    }
};



