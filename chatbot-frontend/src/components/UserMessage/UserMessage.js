// src/pages/UserMessage.js
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom'; // Use this hook to access chatId from URL
import { db } from '../../firebase/firebaseConfig';
import { collection, addDoc, serverTimestamp, onSnapshot, query, orderBy } from 'firebase/firestore';
import { Box, TextField, Button, Typography, Paper } from '@mui/material';

const UserMessage = () => {
  const { chatId } = useParams(); // Access chatId from the URL
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const chatBodyRef = useRef(null);

  // Fetch chat messages in real-time
  useEffect(() => {
    const q = query(collection(db, `chats/${chatId}/messages`), orderBy("timestamp"));
    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => doc.data());
      setMessages(data);
    });
    return () => unsub();
  }, [chatId]);

  const handleSend = async () => {
    if (!text.trim()) return;

    // Save user message to Firestore
    await addDoc(collection(db, `chats/${chatId}/messages`), {
      sender: "user",
      text,
      timestamp: serverTimestamp(),
    });

    setText('');
  };

  useEffect(() => {
    // Scroll to bottom every time new message arrives
    setTimeout(() => {
      if (chatBodyRef.current) {
        chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
      }
    }, 100);
  }, [messages]);

  return (
    <div className="chatbot-popup" style={{ maxWidth: 600, margin: "30px auto" }}>
      <div className="chat-body" ref={chatBodyRef} style={{ height: "400px", overflowY: "auto", padding: 10 }}>
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.sender === "user" ? "user-message" : "bot-message"}`}>
            <div className="message">{msg.text}</div>
          </div>
        ))}
      </div>

      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
        <TextField
          fullWidth
          value={text}
          placeholder="Type your message..."
          onChange={(e) => setText(e.target.value)}
        />
        <Button variant="contained" onClick={handleSend}>Send</Button>
      </Box>
    </div>
  );
};

export default UserMessage;
