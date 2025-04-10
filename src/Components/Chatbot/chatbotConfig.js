// chatbotConfig.js
import React from "react";
import axios from "axios"; // If you're using ChatGPT integration

// Menu options the bot will show
const helpOptions = ["Home", "Shop", "About Us", "Login", "Github", "Ask AI"]; // ← Add "Ask AI" here

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
    message: (params) => `Nice to meet you, ${params.userInput}!`,
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
        const response = await axios.post(
          "https://api.openai.com/v1/chat/completions",
          {
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: params.userInput }],
            temperature: 0.7,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `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`, // Replace with env var in production
            },
          }
        );

        return response.data.choices[0].message.content;
      } catch (error) {
        console.error("OpenAI error:", error);
        return "Hmm, something went wrong. Try again later!";
      }
    },
    path: "prompt_again",
  },
  repeat: {
    transition: { duration: 3000 },
    path: "prompt_again",
  },
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
