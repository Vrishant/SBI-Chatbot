import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { motion } from "framer-motion";
import { X, Send, Robot, ChatRightText, Mic, Translate} from "react-bootstrap-icons";
import { Dropdown } from "bootstrap"; 
import chatBg from '../assets/back1.jpeg';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ text: "Hello! How can I assist you?", sender: "bot", timestamp: new Date().toLocaleTimeString() }]);
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const [language, setLanguage] = useState("en");
  const [suggestiveMessages] = useState([
    "How can I help you?", 
    "Tell me a joke", 
    "What's the weather like?"
  ]);
  const recognitionRef = useRef(null);
  const chatRef = useRef(null);

  const languages = {
    en: "English",
    es: "Spanish",
    hi: "Hindi",
    fr: "French",
  };

  const handleSendMessage = (msg = input) => {
    if (msg.trim() === "") return;

    const newMessage = { text: msg, sender: "user", timestamp: new Date().toLocaleTimeString() };
    setMessages((prev) => [...prev, newMessage]);

    setTimeout(() => {
      const botReply = { text: "This is a sample bot reply.", sender: "bot", timestamp: new Date().toLocaleTimeString() };
      setMessages((prev) => [...prev, botReply]);
    }, 1000);

    setInput("");
  };

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const dropdownElement = document.getElementById("languageDropdownButton");
    if (dropdownElement) {
      new Dropdown(dropdownElement);
    }
  }, []);
  

  const startListening = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Speech recognition not supported in this browser.");
      return;
    }
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = language;
    recognition.continuous = false;
    recognition.interimResults = false;
    recognitionRef.current = recognition;
    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };
    recognition.start();
  };

  return (
    <div>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1, filter: "drop-shadow(0 0 10px rgba(255, 165, 0, 0.8))" }}
        whileTap={{ scale: 0.9 }}
        style={{
          background: 'linear-gradient(to right, rgba(255, 255, 255, 1), rgba(240, 240, 240, 1))',
          border: 'none',
          borderRadius: '50%',
          position: 'fixed',
          bottom: '2rem',
          right: '2.5rem',
          padding: '1.2rem',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          color: 'black',
          background: 'transparent',
          backdropFilter: 'blur(10px)', 
        }}
      >
        <ChatRightText size={24} className="chat-icon" />
      </motion.button>

      {isOpen && (
        <motion.div
          style={{
            position: 'fixed',
            bottom: '7rem',
            right: '2rem',
            backgroundImage: `url(${chatBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            color: '#000',
            borderRadius: '12px',
            overflow: 'hidden',
            minWidth: '27vw',
            minHeight: '80vh',
            maxHeight: '80vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
          }}
        >
          {/* Chat Header */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            padding: '0.75rem', 
            background: 'linear-gradient(to right, rgb(104,29,67), rgb(43,21,95))',
            color: 'white',
            fontWeight: 'bold',
          }}>
            <div className="d-flex align-items-center">
              <Robot size={24} className="me-2" />
              <span>AI Chatbot</span>

              <div className="dropdown" style={{ marginLeft: '1rem' }}>
                <label className="dropdown-toggle" id="languageDropdownButton" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style={{ cursor: 'pointer' }}>
                  <Translate size={16} className="me-2" />
                </label>
                <div className="dropdown-menu" aria-labelledby="languageDropdownButton">
                  {Object.entries(languages).map(([key, value]) => (
                    <a className="dropdown-item" key={key} href="#" onClick={(e) => { e.preventDefault(); setLanguage(key); }}>{value}</a>
                  ))}
                </div>
              </div>
            </div>
            <X className="cursor-pointer" style={{ cursor: "pointer" }} onClick={() => setIsOpen(false)} />
          </div>

          <div ref={chatRef} style={{ flexGrow: 1, padding: '0.75rem', overflowY: 'auto' }}>
            {messages.map((msg, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                style={{ 
                  display: "flex",
                  justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
                  marginBottom: "10px",
                }}
              >
                <div 
                  style={{ 
                    maxWidth: "70%",
                    padding: "10px 15px",
                    borderRadius: "15px",
                    fontSize: "14px",
                    color: msg.sender === "user" ? "#fff" : "#000",
                    background: msg.sender === "user" 
                      ? "linear-gradient(to right, #2196F3, #1976D2)" 
                      : "linear-gradient(to right, #f1f1f1, #e0e0e0)",
                    boxShadow: msg.sender === "bot" ? "0px 0px 10px rgba(0, 0, 0, 0.1)" : "none",
                    position: "relative",
                  }}
                >
                  {msg.text}
                  <div style={{ fontSize: "10px", marginTop: "5px", textAlign: "right", opacity: 0.6 }}>
                    {msg.timestamp}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Suggestive Messages */}
          <div style={{ 
            display: 'flex', 
            gap: '8px', 
            padding: '8px',
            // background: 'rgba(255, 255, 255, 0.2)',
            background: 'transparent',
            backdropFilter: 'blur(5px)'
          }}>
            {suggestiveMessages.map((msg, index) => (
              <div key={index} 
                    onClick={() => {
                      setInput(msg);
                      setTimeout(handleSendMessage(msg),1000);
                    }}
                    className="suggestive-message">
                {msg}
              </div>
            ))}
          </div>

          {/* Input Section */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            padding: '0.75rem', 
            background: 'linear-gradient(to right, rgb(104,29,67), rgb(43,21,95))', 
            borderTop: '1px solid #ccc' 
          }}>
            {/* <input
              type="text"
              className="form-control bg-light text-dark border-secondary"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              style={{ flex: 1, borderRadius: "20px", padding: "10px" }}
            /> */}
            <input
            type="text"
            className="form-control bg-light text-dark border-secondary"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSendMessage();
              }
            }}
            placeholder="Type a message..."
            style={{ flex: 1, borderRadius: "20px", padding: "10px" }}
          />
            <button className="btn btn-outline-warning" onClick={handleSendMessage} style={{ marginLeft: "5px", borderRadius: "30%", padding: "8px 12px" }}>
              <Send size={16} />
            </button>
            <button className="btn btn-outline-info" onClick={startListening} style={{ marginLeft: "5px", borderRadius: "50%", padding: "8px 12px" }}>
              <Mic size={16} />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Chatbot;