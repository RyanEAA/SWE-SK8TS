import dotenv from 'dotenv';
dotenv.config();

// Menu options the bot will show
const helpOptions = ["Home", "Shop", "About Us", "Login", "Github", "Ask AI"];

var usersName = "";
const conversationHistory = []; // Track conversation history for context

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
      usersName = params.userInput;
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

        // Track user message
        conversationHistory.push({ role: "user", content: params.userInput });

        // Reset conversation if user exits
        if (["bye", "exit", "goodbye", "quit", "menu"].includes(userMessage)) {
          conversationHistory.length = 0;
          throw new Error("USER_EXIT");
        }

        // Get product list
        let products = [];
        try {
          const response = await fetch('https://sk8ts-shop.com/api/products');
          products = await response.json();
        } catch (e) {
          console.error("Couldn't fetch products:", e);
        }

        // Construct history text
        let historyText = "";
        for (const msg of conversationHistory) {
          historyText += `${msg.role === "user" ? "User" : "Ollie"}: ${msg.content}\n`;
        }

        // Prompt
        const preamble = `You are Ollie, the skateboard expert at SK8TS shop. 
Current user: ${usersName}.
Your goal is to help customers find their perfect skateboard from this list which are in the website:

${JSON.stringify(products)}


Response Rules:
1. Ask about skill level and type of skating if the user hasn't told you already
2. Suggest 1–2 specific products by name and price and don't try to bold words using **
3. Mention why they're good for the user's needs
4. Keep responses under 3 sentences
5. Keep discussions on the topic of skateboarding. You may give advice related to skateboarding`;

        const fullPrompt = `${preamble}\n\nConversation so far:\n${historyText}\n\nContinue the conversation.`;
        // const keyResponse = await fetch("/chat");
        // const keyData = await keyResponse.json();
        // const apiKey = keyData.key;
        // Send to Gemini
        const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    contents: [
      {
        parts: [{ text: fullPrompt }]
      }
    ]
  })
});

        const data = await geminiResponse.json();
        const aiMessage = data?.candidates?.[0]?.content?.parts?.[0]?.text;

        // Track bot reply
        if (aiMessage) {
          conversationHistory.push({ role: "bot", content: aiMessage });
        }

        return aiMessage || "Let me check our best options for you...";

      } catch (error) {
        if (error.message === "USER_EXIT") {
          return null;
        }
        console.error("Gemini AI Error:", error);
        return "My wheels stuck! Could you ask again?";
      }
    },
    path: (params) => {
      if (params.botMessage === null) return "prompt_again";
      return "chatgpt_query";
    }
  }
};

// Chat widget settings
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
