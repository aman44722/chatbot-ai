// src/pages/Users.js
import React, { useState } from 'react';
import { db } from '../firebase/firebaseConfig';
import { setDoc, doc, serverTimestamp,addDoc,collection } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirect

const Users = () => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
  });

  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Generate a unique chatId for each new user
    const chatId = `chat_${Date.now()}`; // Unique chatId, can also be based on email/phone

    // Save user details in Firestore under the chat document
    await setDoc(doc(db, 'chats', chatId), {
      ...userData,
      createdAt: serverTimestamp(),
    });

    // Send a default welcome message to the user's chat
    await addDoc(collection(db, `chats/${chatId}/messages`), {
      sender: "admin",
      text: "👋 Hello! Welcome to A2 Digital. How can we assist you today?",
      timestamp: serverTimestamp(),
    });

    // Redirect the user to their unique chat page
    navigate(`/usertest/${chatId}`); // Redirect to dynamic chatId route
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Name"
        value={userData.name}
        onChange={(e) => setUserData({ ...userData, name: e.target.value })}
      />
      <input
        type="email"
        placeholder="Email"
        value={userData.email}
        onChange={(e) => setUserData({ ...userData, email: e.target.value })}
      />
      <button type="submit">Register</button>
    </form>
  );
};

export default Users;
