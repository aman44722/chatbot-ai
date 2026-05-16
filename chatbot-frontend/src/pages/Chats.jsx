// src/pages/Chats.js
import React, { useEffect, useState } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
  Avatar,
  IconButton,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  Button,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import {
  fetchConversations,
  fetchConversationById,
} from "../api/conversationApi";

import adminImg from "../assets/images/avatar/adminImg.jpg";
import { useNavigate } from "react-router-dom";

const Chats = () => {
  const navigate = useNavigate();
  const [activeId, setActiveId] = useState(null);
  const [convo, setConvo] = useState(null);

  const [conversations, setConversations] = useState([]);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  /* ------------------ FETCH ALL CONVERSATIONS ------------------ */
  useEffect(() => {
    fetchConversations().then(setConversations).catch(console.error);
  }, []);

  /* ------------------ FETCH SINGLE CONVERSATION ------------------ */
  // useEffect(() => {
  //   if (!id) return;

  //   setLoading(true);
  //   fetchConversationById(id)
  //     .then(setConvo)
  //     .catch(console.error)
  //     .finally(() => setLoading(false));
  // }, [id]);

  /* ------------------ SEND MESSAGE ------------------ */
  // const handleSend = async () => {
  //   if (!message.trim() || !id) return;

  //   try {
  //     await sendMessage(id, {
  //       sender: "admin",
  //       text: message,
  //     });

  //     setMessage("");

  //     // reload conversation
  //     const updated = await fetchConversationById(id);
  //     setConvo(updated);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };
  const handleSelectChat = async (conversationId) => {
    setActiveId(conversationId);

    try {
      const data = await fetchConversationById(conversationId);
      setConvo(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box sx={{ display: "flex", width: ["100%"], height: "100%", gap: 2 }}>
      {/* ---------------- LEFT PANEL ---------------- */}
      <Box
        sx={{
          width: ["30%"],
          height: ["100%"],
          backgroundColor: "#F0F3F9",
          p: 2,
          borderRadius: 2,
          overflowY: "auto",
        }}
      >
        {/* Admin Header */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Avatar src={adminImg} />
          <Typography sx={{ ml: 2, fontWeight: 600 }}>Admin Panel</Typography>
          <IconButton sx={{ ml: "auto" }}>
            <MoreVertIcon />
          </IconButton>
        </Box>

        {/* Search */}
        <TextField
          fullWidth
          placeholder="Search chat"
          variant="standard"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        {/* Chats */}
        <Typography sx={{ mt: 3, fontWeight: 600 }}>
          Recent Chats
          <IconButton
            size="small"
            onClick={(e) => setAnchorEl(e.currentTarget)}
          >
            <KeyboardArrowDownIcon />
          </IconButton>
        </Typography>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
        >
          <MenuItem>Sort by time</MenuItem>
          <MenuItem>Unread</MenuItem>
        </Menu>

        <List>
          {conversations.map((c) => (
            <ListItem
              key={c._id}
              button
              onClick={() => handleSelectChat(c._id)}
              sx={{
                mb: 1,
                borderRadius: 1,
                backgroundColor: c._id === activeId ? "#d1e7dd" : "#fff",
              }}
            >
              <Avatar sx={{ mr: 2 }} />
              <ListItemText
                primary={c.sessionId || "Unknown User"}
                secondary={new Date(c.updatedAt).toLocaleString()}
              />
            </ListItem>
          ))}
        </List>
      </Box>
      {/* ---------------- RIGHT PANEL ---------------- */}

      <Box
        sx={{
          width: ["70%"],
          height: ["100%"],
          backgroundColor: "#F0F3F9",
          p: 2,
          borderRadius: 2,
          overflowY: "auto",
        }}
      >
        {!convo && (
          <Typography textAlign="center" mt={10} color="text.secondary">
            Select a chat from left
          </Typography>
        )}

        {convo && (
          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              backgroundColor: "#F0F3F9",
              p: 2,
              borderRadius: 2,
            }}
          >
            {convo.messages.map((m, i) => (
              <Box
                key={i}
                sx={{
                  mb: 1,
                  textAlign: m.sender === "user" ? "right" : "left",
                }}
              >
                <Typography
                  sx={{
                    display: "inline-block",
                    p: 1,
                    borderRadius: 1,
                    backgroundColor:
                      m.sender === "user" ? "#6D8B74" : "#ECECEC",
                    color: m.sender === "user" ? "white" : "black",

                    padding: m.sender === "user" ? "2%" : "2%",
                    fontSize: m.sender === "user" ? "20px" : "20px  ",
                    borderRadius:
                      m.sender === "user"
                        ? "10px 10px 0px 10px"
                        : "10px 10px 10px 0px",
                  }}
                >
                  <b>{m.sender}</b>: {m.text}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Chats;
