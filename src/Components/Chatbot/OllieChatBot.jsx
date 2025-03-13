import React from "react";
import ChatBot from "react-chatbotify";
import { flow, settings, styles } from "./chatbotConfig.js";


function OllieChatBot() {
    return (
        <ChatBot
        flow={flow}
        settings={settings}
        styles={styles}
        />
    );
}
export default OllieChatBot;