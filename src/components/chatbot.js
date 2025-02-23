import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { motion } from "framer-motion";
import { X, Send, Robot, ChatRightText, MicFill } from "react-bootstrap-icons";
import chatBg from '../assets/back1.jpeg';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hello! How can I assist you?", sender: "bot", timestamp: new Date().toLocaleTimeString() }
  ]);
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState(null);
  const chatRef = useRef(null);
  const recognitionRef = useRef(null);


  useEffect(() => {
    const newSessionId = crypto.randomUUID();
    setSessionId(newSessionId);
    localStorage.setItem("chatSessionId", newSessionId); 
  }, []);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (input.trim() === "") return;

    const newMessage = { text: input, sender: "user", timestamp: new Date().toLocaleTimeString() };
    setMessages(prev => [...prev, newMessage]);
    setInput("");

    try {
      const response = await axios.post("https://sbi-back-dh35.onrender.com/api/chat", { session_id: sessionId, message: input }, {
        headers: { "Content-Type": "application/json" }
      });

      const botMessage = { text: response.data.response || "No response received", sender: "bot", timestamp: new Date().toLocaleTimeString() };
      setMessages(prev => [...prev, botMessage]);
      speak(botMessage.text);
    } catch (error) {
      console.error("Error:", error);
      setMessages(prev => [...prev, { text: "Error connecting to the server.", sender: "bot", timestamp: new Date().toLocaleTimeString() }]);
    }
  };


  const speak = (text) => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    synth.speak(utterance);
  };


  const startListening = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Your browser does not support speech recognition.");
      return;
    }
    

    recognitionRef.current = new webkitSpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = "en-US";

    recognitionRef.current.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };

    recognitionRef.current.start();
  };

  return (
    <div>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        style={{
          background: 'transparent',
          border: 'none',
          borderRadius: '50%',
          position: 'fixed',
          bottom: '2rem',
          right: '2.5rem',
          padding: '1.2rem',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          color: 'black',
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
          borderRadius: '12px 12px 12px 12px',
          width: '350px',
          height: '80vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
        }}
      >

        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'linear-gradient(to right, rgb(104,29,67), rgb(43,21,95))', color: 'white',borderRadius: '12px 12px 0 0', }}>
          <div className="d-flex align-items-center">
            <Robot size={24} className="me-2" />
            <span>AI Chatbot</span>
          </div>
          <X style={{ cursor: "pointer" }} onClick={() => setIsOpen(false)} />
        </div>
      

        <div ref={chatRef} style={{ flexGrow: 1, padding: '0.75rem', overflowY: 'auto' }}>
          {messages.map((msg, index) => (
            <motion.div key={index} style={{ display: "flex", justifyContent: msg.sender === "user" ? "flex-end" : "flex-start", marginBottom: "10px" }}>
              <div style={{ maxWidth: "70%", padding: "10px 15px", borderRadius: "15px", fontSize: "14px", color: msg.sender === "user" ? "#fff" : "#000", background: msg.sender === "user" ? "#1976D2" : "#e0e0e0" }}>
                {msg.text}
              </div>
            </motion.div>
          ))}
        </div>
      

        <div style={{ display: 'flex', alignItems: 'center', padding: '0.75rem', background: 'linear-gradient(to right, rgb(104,29,67), rgb(43,21,95))', borderTop: '1px solid #ccc' , borderRadius: '0 0 12px 12px'}}>
          <button className="btn btn-outline-warning me-2" onClick={startListening}><MicFill size={16} /></button>
          <input type="text" className="form-control" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} placeholder="Type a message..." />
          <button className="btn btn-outline-warning ms-2" onClick={handleSendMessage}><Send size={16} /></button>
        </div>
      </motion.div>
            )}
    </div>
  );
};

export default Chatbot;
