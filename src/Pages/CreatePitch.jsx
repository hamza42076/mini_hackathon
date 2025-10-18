import React, { useState, useEffect, useRef } from "react";
import { db } from "../firebaseConfig";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export default function GeminiChat() {
  const { currentUser } = useAuth();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const messagesRef = collection(db, "chats", currentUser.uid, "messages");

  // Real-time fetch messages
  useEffect(() => {
    const q = query(messagesRef, orderBy("timestamp", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return unsubscribe;
  }, [messagesRef]);

  // Auto-scroll
  useEffect(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, 100); // ensure DOM is updated
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userInput = input;
    setInput("");
    setLoading(true);
    setTyping(true);

    try {
      // Save user message
      await addDoc(messagesRef, {
        text: userInput,
        sender: "user",
        timestamp: serverTimestamp(),
      });

      // Gemini AI response
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });
      const result = await model.generateContent(userInput);
      const reply = result.response?.text() || "Sorry, no response.";

      // Save AI reply
      await addDoc(messagesRef, {
        text: reply,
        sender: "gemini",
        timestamp: serverTimestamp(),
      });
    } catch (err) {
      console.error("Error:", err);
    }

    setLoading(false);
    setTyping(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-indigo-600 via-purple-700 to-pink-600 text-white p-4">
      {/* Messages container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-900 rounded-2xl shadow-inner max-h-[80vh]">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-3 rounded-xl break-words ${
              msg.sender === "user"
                ? "ml-auto bg-blue-600 text-white"
                : "mr-auto bg-gray-700 text-white"
            }`}
            style={{ maxWidth: "70%" }} // max-width for bubbles
          >
            <p>{msg.text}</p>
            <span className="text-xs text-gray-300 mt-1 block">
              {msg.timestamp?.toDate ? msg.timestamp.toDate().toLocaleTimeString() : ""}
            </span>
          </div>
        ))}

        {typing && (
          <div className="mr-auto bg-gray-700 p-3 rounded-xl max-w-[70%] animate-pulse">
            Gemini is typing...
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="flex mt-4 gap-2">
        <input
          className="flex-1 p-3 rounded-xl text-black outline-none"
          placeholder={loading ? "Waiting for AI..." : "Type your message..."}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          disabled={loading}
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className={`px-4 py-3 rounded-xl font-semibold ${
            loading ? "bg-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Thinking..." : "Send"}
        </button>
      </div>
    </div>
  );
}
