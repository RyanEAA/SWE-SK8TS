// chatbotConfig.js
import React from "react";
import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI("AIzaSyCE-ka79fmgB_w1JSMY83nUmhtRP4cUu1c");

const helpOptions = ["Home", "Shop", "About Us", "Login", "Github", "Ask AI"];
let usersName = "";

const flow = {
  // ... (keep all other flow states the same until chatgpt_query)

  chatgpt_query: {
    message: async (params) => {
      try {
        // 1. Safely handle user input
        const userInput = params && params.userInput ? params.userInput.toString() : "";
        const userMessage = userInput.trim().toLowerCase();
  
        // 2. Exit conditions
        if (!userMessage || ["bye", "exit", "goodbye", "quit", "menu"].includes(userMessage)) {
          throw new Error("USER_EXIT");
        }
  
        // 3. Initialize conversation state
        const conversationState = (params && params.conversationState) || {};
  
        // 4. Detect skill level
        if (typeof userMessage === 'string') {
          if (userMessage.includes('beginner')) conversationState.skillLevel = 'beginner';
          else if (userMessage.includes('intermediate')) conversationState.skillLevel = 'intermediate';
          else if (userMessage.includes('advanced') || userMessage.includes('pro')) {
            conversationState.skillLevel = 'advanced';
          }
        }
  
        // 5. Get products (if still needed)
        let products = [];
        try {
          const response = await fetch('https://sk8ts-shop.com/api/products');
          products = await response.json();
        } catch (error) {
          console.error("Failed to fetch products:", error);
        }
  
        // 6. Build the prompt for Gemini
        const prompt = `You are Ollie, a skateboard expert assistant.
          User: ${usersName || 'Guest'}
          Skill Level: ${conversationState.skillLevel || 'not specified'}
          
          ${products.length > 0 ? `Available Products:
          ${products.slice(0, 3).map(p => `${p.name} ($${p.price})`).join('\n')}` : ''}
          
          Please respond to: "${userInput}"`;
        
        // 7. Call Gemini API
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        return text || "Let me think about that for a moment...";
  
      } catch (error) {
        console.error("Chat error:", error);
        if (error.message === "USER_EXIT") {
          return "Returning to main menu...";
        }
        return "Sorry, I'm having trouble. Please try again.";
      }
    },
    path: (params) => {
      if (!params || !params.userInput || ["bye", "exit", "goodbye", "quit", "menu"].includes(params.userInput.trim().toLowerCase())) {
        return "prompt_again";
      }
      return "chatgpt_query";
    }
  }
};


const settings = {
  general: {
    embedded: false,
  },
  chatHistory: {
    storageKey: "conversations_summary",
  },
  tooltip: {
    mode: "CLOSE",
    text: "Need Help? 🛹",
  },
  chatButton: {
    icon: "chatBotIcon.svg",
  },
  header: {
    title: "Ollie",
    avatar: "chatBotIcon.svg",
  },
};

const styles = {};

export { flow, settings, styles };
