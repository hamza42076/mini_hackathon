import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export default function Chat() {
  const { currentUser } = useAuth();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  // Firebase collection reference
  const messagesRef = collection(db, "chats", currentUser.uid, "messages");

  // Fetch messages in real-time
  useEffect(() => {
    const q = query(messagesRef, orderBy("timestamp", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      // Include document id for key
      setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return unsubscribe;
  }, [messagesRef]);

  // Send message function
  const sendMessage = async () => {
    if (!input.trim()) return;

    const userInput = input;
    setInput("");

    try {
      // Save user message
      await addDoc(messagesRef, {
        text: userInput,
        sender: "user",
        timestamp: serverTimestamp(),
      });

      // Generate Gemini AI reply
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-pro" });
      const result = await model.generateContent(userInput);
      const reply = result.response?.text() || "Sorry, I couldn't generate a reply.";

      // Save AI reply
      await addDoc(messagesRef, {
        text: reply,
        sender: "gemini",
        timestamp: serverTimestamp(),
      });
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      {/* Messages container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-3 rounded-lg max-w-xs ${
              msg.sender === "user" ? "ml-auto bg-blue-600" : "mr-auto bg-gray-700"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      {/* Input box */}
      <div className="p-4 bg-gray-800 flex">
        <input
          className="flex-1 p-2 rounded-lg text-black"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="ml-2 bg-blue-600 px-4 py-2 rounded-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
}
