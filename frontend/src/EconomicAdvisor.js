import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

// Fade-in variant for chat container and messages
const chatFadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const EconomicAdvisor = () => {
  const [conversation, setConversation] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Auto-scroll to bottom on conversation update
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
      // Dummy response for now – later replace with LLM integration
      const dummyResponse = `על סמך הנתונים, אם תשקיעו בסך '${currentInput}' שקלים, צפויה תשואה נאה. (זוהי תשובה דמה)`;
      const botMessage = { sender: "bot", text: dummyResponse };
      setConversation((prev) => [...prev, botMessage]);
    } catch (error) {
      const botMessage = { sender: "bot", text: "מצטער, אירעה שגיאה. אנא נסה שוב." };
      setConversation((prev) => [...prev, botMessage]);
    } finally {
      setLoading(false);
    }
  };

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
        padding: "40px",
        maxWidth: "900px",
        margin: "40px auto",
        borderRadius: "12px",
        background: "linear-gradient(135deg, #ffffff, #f7f7f7)",
        boxShadow: "0 6px 16px rgba(0,0,0,0.2)",
        textAlign: "center",
        color: "#333"
      }}
    >
      <h2 style={{ marginBottom: "15px", fontSize: "1.8rem" }}>יועץ קרנות AI</h2>
      <p style={{ fontSize: "0.9rem", color: "#666", marginBottom: "20px" }}>
        שימו לב: המידע כאן לצורך הדגמה בלבד.
      </p>
      <div
        style={{
          maxHeight: "450px",
          overflowY: "auto",
          margin: "25px 0",
          padding: "20px",
          background: "#fff",
          borderRadius: "10px",
          boxShadow: "inset 0 3px 8px rgba(0,0,0,0.15)"
        }}
      >
        {conversation.map((msg, idx) => (
          <motion.div
            key={idx}
            initial="hidden"
            animate="visible"
            variants={chatFadeIn}
            style={{
              marginBottom: "14px",
              display: "flex",
              justifyContent: msg.sender === "user" ? "flex-end" : "flex-start"
            }}
          >
            <div
              style={{
                maxWidth: "80%",
                padding: "12px 18px",
                borderRadius: "20px",
                background:
                  msg.sender === "user"
                    ? "linear-gradient(135deg, #007bff, #0056b3)"
                    : "#e0e0e0",
                color: msg.sender === "user" ? "#fff" : "#333",
                boxShadow: "0 3px 6px rgba(0,0,0,0.1)"
              }}
            >
              <strong>{msg.sender === "user" ? "אתה:" : "היועץ:"}</strong> {msg.text}
            </div>
          </motion.div>
        ))}
        <div ref={chatEndRef} />
        {loading && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ textAlign: "center", color: "#666" }}
          >
            טוען תשובה...
          </motion.p>
        )}
      </div>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="הקלד את שאלתך..."
          style={{
            flexGrow: 1,
            padding: "14px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            marginRight: "12px",
            fontSize: "1rem"
          }}
        />
        <motion.button
          onClick={handleSend}
          whileHover={{ scale: 1.1 }}
          style={{
            padding: "14px 28px",
            borderRadius: "6px",
            border: "none",
            background: "linear-gradient(135deg, #007bff, #0056b3)",
            color: "#fff",
            cursor: "pointer",
            fontSize: "1rem"
          }}
        >
          שלח
        </motion.button>
      </div>
    </motion.div>
  );
};

export default EconomicAdvisor;
