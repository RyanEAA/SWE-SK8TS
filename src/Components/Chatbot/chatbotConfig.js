//chatbotConfig.js
import React from "react";

// conversation pattern
const helpOptions = ["Home", "Shop", "About Us", "Login", "Github"];


const flow = {
  // starting chat
  start: {
    message: "Hello, I am Ollie 👋! Welcome to SK8TS, I'm excited that you are using our site 🙌!",
    transition: { duration: 2000 },
    path: "askName", // Move to the next step
  },
  askName: {
    message: "What is your name?",
    path: "end", // Move to the final step
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
  repeat: {
    transition: { duration: 3000 },
    path: "prompt_again",
  },
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
    avatar: "chatBotIcon.svg"
  }
}
const styles = {
}


export { flow, settings, styles };