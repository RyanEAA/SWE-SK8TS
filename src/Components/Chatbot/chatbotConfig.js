// chatbotConfig.js
import React from "react";
import axios from "axios"; // If you're using ChatGPT integration

// Menu options the bot will show
const helpOptions = ["Home", "Shop", "About Us", "Login", "Github", "Ask AI"]; // ← Add "Ask AI" here
var usersName = ""
// Chat flow definition
const flow = {
  start: {
    message: "Hello, I am Ollie 👋! Welcome to SK8TS...",
    transition: { duration: 2000 },
    path: "askName",
  },
  askName: {
    message: "What is your name?",
    path: "end",
  },
  end: {
    message: (params) => {
      usersName = params.userInput; // Save the name to the variable
      return `Nice to meet you, ${params.userInput}!`;
    },
    chatDisabled: true,
    options: helpOptions,
    path: "process_options",
  },
  prompt_again: {
    message: "Do you need any other help?",
    options: helpOptions,
    path: "process_options",
  },
  process_options: {
    transition: { duration: 0 },
    chatDisabled: true,
    path: async (params) => {
      let link = "";
      switch (params.userInput) {
        case "Home":
          link = "https://sk8ts-shop.com/";
          break;
        case "Shop":
          link = "https://sk8ts-shop.com/Shop";
          break;
        case "About Us":
          link = "https://sk8ts-shop.com/AboutUs";
          break;
        case "Login":
          link = "https://sk8ts-shop.com/login";
          break;
        case "Github":
          link = "https://github.com/RyanEAA/SWE-SK8TS";
          break;
        case "Ask AI":
          return "chatgpt_query";
        default:
          return "unknown_input";
      }

      await params.injectMessage("Sit tight! I'll send you right there!");
      setTimeout(() => {
        window.open(link);
      }, 1000);
      return "repeat";
    },
  },
  chatgpt_query: {
    message: async (params) => {
      try {
        const userMessage = params.userInput.trim().toLowerCase();
        
        // Check for exit commands
        if (["bye", "exit", "goodbye", "quit"].includes(userMessage)) {
          // Throw a special error to exit the conversation
          throw new Error("USER_EXIT");
        }
  
        const response = await fetch("https://api.cohere.ai/v1/chat", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${process.env.REACT_APP_COHERE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "command-a-03-2025",
            message: params.userInput,
            // preamble: `You are Ollie, a friendly AI skateboard expert for SK8TS. 
            //         You know everything about decks, trucks, wheels, bearings, and skate culture. 
            //         Keep responses short, helpful, and focused on skateboarding. The user you will be
            //         helping is named ${usersName}.
            //         If asked unrelated questions, gently steer the conversation back to skating.`,
          }),
        });
  
        const data = await response.json();
        console.log("🧠 Cohere raw response:", data);
  
        return data.text || "Cohere didn't respond with anything.";
      } catch (error) {
        if (error.message === "USER_EXIT") {
          // Return null or undefined to prevent any message from showing
          return null; // This won't display anything in chat
        }
        console.error("❌ Cohere frontend error:", error);
        return "Oops, something went wrong with the AI!";
      }
    },
    path: (params) => {
      // If message is null (user exited), go back to menu
      if (params.botMessage === null) {
        return "prompt_again";
      }
      return "chatgpt_query";
    }
  }
  
  
  
};

// Export config
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
