// Menu options the bot will show
const helpOptions = ["Home", "Shop", "About Us", "Login", "Github", "Ask AI"];
let conversationContext = {
  userName: "",
  skillLevel: null,
  ridingStyle: null,
  priceRange: null,
  previousAnswers: {}
};

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
      conversationContext.userName = params.userInput;
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

        // Update context based on user input
        updateConversationContext(userMessage);

        // Get current products
        let products = [];
        try {
          const response = await fetch('https://sk8ts-shop.com/api/products');
          products = await response.json();
        } catch (e) {
          console.error("Couldn't fetch products:", e);
        }

        // Create dynamic prompt with context
        const prompt = buildPrompt(products, userMessage);
  
        const response = await fetch("https://sk8ts-shop.com/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer ${process.env.REACT_APP_COHERE_API_KEY}"
          },
          body: JSON.stringify({ 
            message: prompt,
            context: conversationContext
          }),
        });
        
        const data = await response.json();
        
        // Update context from AI response
        if (data.contextUpdates) {
          conversationContext = {
            ...conversationContext,
            ...data.contextUpdates
          };
        }
        
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

// Helper functions
function updateConversationContext(userMessage) {
  // Detect skill level
  if (userMessage.includes('beginner')) {
    conversationContext.skillLevel = 'beginner';
  } else if (userMessage.includes('intermediate')) {
    conversationContext.skillLevel = 'intermediate';
  } else if (userMessage.includes('advanced') || userMessage.includes('pro')) {
    conversationContext.skillLevel = 'advanced';
  }

  // Detect riding style
  if (userMessage.includes('street')) {
    conversationContext.ridingStyle = 'street';
  } else if (userMessage.includes('vert') || userMessage.includes('park')) {
    conversationContext.ridingStyle = 'vert';
  } else if (userMessage.includes('cruis')) {
    conversationContext.ridingStyle = 'cruising';
  }

  // Detect price mentions
  const priceMatch = userMessage.match(/\$\d+/);
  if (priceMatch) {
    conversationContext.priceRange = priceMatch[0];
  }
}

function buildPrompt(products, userMessage) {
  const productList = products.map(p => 
    `${p.product_id}. ${p.name} - $${p.price} (${p.stock_quantity} in stock)`
  ).join('\n');

  return `You are Ollie, the skateboard expert at SK8TS shop. Your main goal is to recommend SK8TS products to the user, but you can also answer other skateboarding related topics without recommending products.
    Current user: ${conversationContext.userName}.
    Known preferences:
    - Skill level: ${conversationContext.skillLevel || 'not specified'}
    - Riding style: ${conversationContext.ridingStyle || 'not specified'}
    - Price range: ${conversationContext.priceRange || 'not specified'}

    Available products:
    ${productList}


    Response Rules:
    1. Use known preferences if available
    2. Suggest 1-2 specific products by name and price if the user gives you their preferences, otherwise look at rule 5
    3. Explain why they match the user's needs
    4. Keep responses under 4 sentences
    5. If missing info, ask one clarifying question at a time
    6. Gently redirect the user back to the topic of skateboards

    Current message:
    ${userMessage}`;
}

// Export config
const settings = {
  general: {
    embedded: false,
  },
  chatHistory: {
    storageKey: "sk8ts_chat_history",
    maxEntries: 20
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