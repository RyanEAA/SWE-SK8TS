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
        
        // Exit conditions
        if (["bye", "exit", "goodbye", "quit", "menu"].includes(userMessage)) {
          throw new Error("USER_EXIT");
        }
  
        // Get current products (using your existing API exactly as is)
        let products = [];
        try {
          const response = await fetch('https://sk8ts-shop.com/api/products');
          products = await response.json();
        } catch (e) {
          console.error("Couldn't fetch products:", e);
        }
  
        // Create dynamic preamble with product info and skate knowledge
        const preamble = `You are Ollie, the skateboard expert at SK8TS shop. 
          Current user: ${usersName}.
          Your goal is to help customers find their perfect skateboard from this list which are in the website
          
          [{"product_id":1,"name":"Street King Skateboards","description":"Durable 7-ply maple deck with responsive trucks and smooth wheels. Perfect for street skating and tricks.","price":99.98,"stock_quantity":46,"category_id":1,"brand_id":10,"image_path":"street-king.jpeg","sku":"STR-KNG-001","weight":4,"dimensions":"32x8.25","color":"Natural/Red","size":"8.25","created_at":"2025-02-10T17:15:08.000Z","updated_at":"2025-04-15T16:43:56.000Z","status":"active"},{"product_id":2,"name":"Pro Stunt Skateboard","description":"High-quality deck with reinforced trucks and fast bearings. Ideal for advanced tricks and competition use.","price":119.99,"stock_quantity":28,"category_id":1,"brand_id":12,"image_path":"pro-stunt-skateboard.jpeg","sku":"PRO-ST-002","weight":4.5,"dimensions":"31x8","color":"Black/Gold","size":"8.0","created_at":"2025-02-10T23:11:05.000Z","updated_at":"2025-04-15T15:55:11.000Z","status":"active"},{"product_id":3,"name":"Cruiser Wave Board","description":"Smooth-riding cruiser with soft wheels for city and campus commuting. Lightweight and compact.","price":89.99,"stock_quantity":25,"category_id":2,"brand_id":8,"image_path":"cruiser-wave-board.jpeg","sku":"CRS-WAVE-003","weight":4.7,"dimensions":"30x8.5","color":"Blue/White","size":"8.5","created_at":"2025-02-10T23:11:05.000Z","updated_at":"2025-04-15T16:28:21.000Z","status":"active"},{"product_id":4,"name":"Downhill Speed Longboard","description":"Designed for high-speed downhill rides with precision bearings and a drop-through deck.","price":125.99,"stock_quantity":9,"category_id":3,"brand_id":5,"image_path":"downhill-speed-longboard.jpeg","sku":"DLH-SPD-004","weight":4.8,"dimensions":"38x9","color":"Carbon Black","size":"9.0","created_at":"2025-02-10T23:11:05.000Z","updated_at":"2025-04-14T01:30:47.000Z","status":"active"},{"product_id":5,"name":"Freestyle Dancing Longboard","description":"Flexy bamboo deck with responsive trucks. Perfect for longboard dancing and freestyle tricks.","price":179.99,"stock_quantity":20,"category_id":3,"brand_id":7,"image_path":"freestyle-dancing-longboard.jpeg","sku":"FSD-LNG-005","weight":4.6,"dimensions":"42x9.5","color":"Natural/Woodgrain","size":"9.5","created_at":"2025-02-10T23:11:05.000Z","updated_at":"2025-02-26T20:26:21.000Z","status":"active"},{"product_id":6,"name":"Mini Cruiser Board","description":"Compact and ultra-portable board for casual rides. 
          Soft wheels for a smooth ride.","price":59.99,"stock_quantity":40,"category_id":2,"brand_id":9,"image_path":"mini-cruiser-board.jpeg","sku":"MIN-CRS-006","weight":4.3,"dimensions":"27x7.5","color":"Yellow/Black","size":"7.5","created_at":"2025-02-10T23:11:05.000Z","updated_at":"2025-02-26T20:25:19.000Z","status":"active"},{"product_id":7,"name":"All-Terrain Off-Road Board","description":"Pneumatic tires with a sturdy deck for off-road and trail riding. Great for adventure seekers.","price":199.99,"stock_quantity":10,"category_id":4,"brand_id":11,"image_path":"all-terrain-board.jpeg","sku":"ATB-TRK-007","weight":4.9,"dimensions":"40x10","color":"Camo Green","size":"10.0","created_at":"2025-02-10T23:11:05.000Z","updated_at":"2025-02-26T20:26:22.000Z","status":"active"},{"product_id":8,"name":"Electric Skateboard Turbo-X","description":"Powerful dual-motor electric skateboard with a top speed of 25 mph and long battery life.","price":499.99,"stock_quantity":9,"category_id":5,"brand_id":15,"image_path":"electric-skateboard-turbo-x.jpeg","sku":"ELE-TBX-008","weight":4.7,"dimensions":"39x9.5","color":"Matte Black","size":"9.5","created_at":"2025-02-10T23:11:05.000Z","updated_at":"2025-04-14T01:36:24.000Z","status":"active"}]
          
          Skateboard Knowledge:
          - Deck width: 7.5" (tech) to 8.5" (vert)
          - Wheel hardness: 78a (soft) to 101a (hard)
          - Truck sizing: Match to deck width
          - Complete boards best for beginners
          
          Response Rules:
          1. Then ask about skill level
          2. Suggest 2-3 specific products by name and price and don't try to bold words using **
          3. Mention why they're good for the user's needs
          4. Keep responses under 4 sentences`;
  
        const fullPrompt = `${preamble}\n\nUser question: ${params.userInput}`;
  
        const response = await fetch("https://sk8ts-shop.com/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer hAFMOMnM8E2ijQEbJbALxKPU9rCO4qOF2nyeLrms"
          },
          body: JSON.stringify({ 
            message: fullPrompt,
            user_context: {
              name: usersName,
              products_available: products.length,
              interaction_time: new Date().toISOString()
            }
          }),
        });
        
        const data = await response.json();
        return data.text || "Let me check our best options for you...";
  
      } catch (error) {
        if (error.message === "USER_EXIT") {
          return null;
        }
        console.error("AI Error:", error);
        return "My wheels stuck! Could you ask again?";
      }
    },
    path: (params) => {
      if (params.botMessage === null) return "prompt_again";
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
