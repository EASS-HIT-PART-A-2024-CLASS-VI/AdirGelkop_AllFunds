import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

// Fade-in variant for chat component animations
const chatFadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const FinancialAdvisor = () => {
  const [conversation, setConversation] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Scroll to bottom when conversation changes
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversation]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = { sender: "user", text: input };
    setConversation((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput("");
    setLoading(true);
    try {
      // Call external API (e.g., OpenAI GPT) to get bot response
      const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: currentInput }),
      });
      const data = await response.json();
      // If no response, use a default message
      const botText = data.response && data.response.trim() !== ""
        ? data.response
        : "מצטער, לא הצלחתי לקבל תשובה. נסה שוב מאוחר יותר.";
      const botMessage = { sender: "bot", text: botText };
      setConversation((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = { sender: "bot", text: "מצטער, אירעה שגיאה בעת עיבוד הבקשה." };
      setConversation((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  // Handler for key press (Enter sends the message)
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={chatFadeIn}
      style={{
        padding: "20px",
        maxWidth: "600px",
        margin: "20px auto",
        textAlign: "center",
        border: "1px solid #ccc",
        borderRadius: "10px",
        background: "#fff",
        color: "#000"
      }}
    >
      <h2>יועץ כלכלי</h2>
      <p style={{ fontSize: "0.9rem", color: "#555" }}>
        שימו לב: המידע המוצג כאן הוא לצורך מידע בלבד ואינו מהווה המלצה פיננסית.
      </p>
      <div
        style={{
          maxHeight: "300px",
          overflowY: "auto",
          textAlign: "left",
          margin: "20px 0",
          padding: "10px",
          background: "#f9f9f9",
          borderRadius: "5px"
        }}
      >
        {conversation.map((msg, idx) => (
          <div key={idx} style={{ marginBottom: "10px", textAlign: msg.sender === "user" ? "right" : "left" }}>
            <strong>{msg.sender === "user" ? "אתה:" : "היועץ:"}</strong> {msg.text}
          </div>
        ))}
        <div ref={chatEndRef} />
        {loading && <p>טוען תשובה...</p>}
      </div>
      <div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="הקלד את שאלתך..."
          style={{
            width: "80%",
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc"
          }}
        />
        <button
          onClick={handleSend}
          style={{
            padding: "10px 20px",
            marginLeft: "10px",
            borderRadius: "5px",
            border: "none",
            background: "linear-gradient(135deg, #007bff, #0056b3)",
            color: "#fff"
          }}
        >
          שלח
        </button>
      </div>
    </motion.div>
  );
};

export default FinancialAdvisor;
