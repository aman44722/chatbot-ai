import React, { useEffect, useState } from "react";
import {
  Box, Typography, Avatar, TextField, InputAdornment,
  List, ListItem, Chip, Divider, IconButton, CircularProgress
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import SendIcon from "@mui/icons-material/Send";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { fetchConversations, fetchConversationById } from "../api/conversationApi";

const PANEL_BG = "#f4f6fb";
const WHITE = "#ffffff";
const BLUE = "#5b5ea6";
const LIGHT_BLUE = "#eef0ff";

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function getInitial(name) {
  return (name || "?")[0].toUpperCase();
}

const avatarColors = ["#5b5ea6", "#f57c00", "#2e7d32", "#c62828", "#00838f", "#6a1b9a"];
function avatarColor(str) {
  str = str || "";
  let h = 0;
  for (let i = 0; i < str.length; i++) h = str.charCodeAt(i) + ((h << 5) - h);
  return avatarColors[Math.abs(h) % avatarColors.length];
}

export default function Chats() {
  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [convo, setConvo] = useState(null);
  const [search, setSearch] = useState("");
  const [loadingConvo, setLoadingConvo] = useState(false);
  const messagesEndRef = React.useRef(null);

  useEffect(() => {
    fetchConversations().then(setConversations).catch(console.error);
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [convo]);

  const handleSelect = async (id) => {
    setActiveId(id);
    setLoadingConvo(true);
    try {
      const data = await fetchConversationById(id);
      setConvo(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingConvo(false);
    }
  };

  const filtered = conversations.filter(c =>
    (c.userName || c.sessionId || "").toLowerCase().includes(search.toLowerCase())
  );

  const activeConvo = conversations.find(c => c._id === activeId);
  const userMessages = convo?.messages?.filter(m => m.sender === "user").length || 0;
  const botMessages = convo?.messages?.filter(m => m.sender === "bot").length || 0;

  return (
    <Box sx={{ display: "flex", height: "calc(100vh - 100px)", gap: 0, borderRadius: 3, overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>

      {/* ─── LEFT PANEL ─── */}
      <Box sx={{ width: 300, minWidth: 300, bgcolor: WHITE, display: "flex", flexDirection: "column", borderRight: "1px solid #eee" }}>
        {/* Header */}
        <Box sx={{ p: 2.5, pb: 1.5 }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <ChatBubbleOutlineIcon sx={{ color: BLUE, fontSize: 20 }} />
              <Typography fontWeight={700} fontSize={16}>Chats</Typography>
            </Box>
            <IconButton size="small" sx={{ bgcolor: LIGHT_BLUE, color: BLUE, "&:hover": { bgcolor: "#dde0ff" } }}>
              <AddIcon fontSize="small" />
            </IconButton>
          </Box>

          {/* Tabs */}
          <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
            {["All", "Active", "Closed"].map((tab, i) => (
              <Box
                key={tab}
                sx={{
                  px: 1.5, py: 0.5, borderRadius: 2, fontSize: 12, fontWeight: 600,
                  cursor: "pointer",
                  bgcolor: i === 0 ? BLUE : "transparent",
                  color: i === 0 ? "#fff" : "#888",
                  "&:hover": { bgcolor: i === 0 ? BLUE : LIGHT_BLUE }
                }}
              >
                {tab}
              </Box>
            ))}
          </Box>

          {/* Search */}
          <TextField
            size="small"
            fullWidth
            placeholder="Search chats..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            InputProps={{
              startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 18, color: "#aaa" }} /></InputAdornment>,
              sx: { borderRadius: 3, bgcolor: PANEL_BG, fontSize: 13 }
            }}
            sx={{ "& fieldset": { border: "none" } }}
          />
        </Box>

        <Typography variant="caption" color="text.secondary" sx={{ px: 2.5, mb: 1, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>
          Recent Chats
        </Typography>

        {/* User List */}
        <List disablePadding sx={{ overflowY: "auto", flex: 1, px: 1 }}>
          {filtered.length === 0 ? (
            <Box sx={{ p: 3, textAlign: "center" }}>
              <Typography variant="body2" color="text.secondary">No conversations yet.</Typography>
            </Box>
          ) : (
            filtered.map((c) => {
              const name = c.userName || `Session ${c.sessionId?.slice(-6)}`;
              const lastMsg = c.messages?.[c.messages.length - 1]?.text || "No messages";
              const isActive = c._id === activeId;
              return (
                <ListItem
                  key={c._id}
                  button
                  onClick={() => handleSelect(c._id)}
                  sx={{
                    borderRadius: 2.5, mb: 0.5, px: 1.5, py: 1.2,
                    bgcolor: isActive ? LIGHT_BLUE : "transparent",
                    "&:hover": { bgcolor: isActive ? LIGHT_BLUE : PANEL_BG },
                    transition: "background 0.15s",
                  }}
                >
                  <Avatar
                    sx={{ width: 42, height: 42, mr: 1.5, bgcolor: avatarColor(name), fontSize: 16, fontWeight: 700 }}
                  >
                    {getInitial(name)}
                  </Avatar>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Typography fontSize={13.5} fontWeight={isActive ? 700 : 600} noWrap sx={{ maxWidth: 120 }}>
                        {name}
                      </Typography>
                      <Typography fontSize={11} color="text.secondary">{timeAgo(c.updatedAt)}</Typography>
                    </Box>
                    <Typography fontSize={12} color="text.secondary" noWrap sx={{ maxWidth: 160 }}>
                      {lastMsg}
                    </Typography>
                  </Box>
                </ListItem>
              );
            })
          )}
        </List>
      </Box>

      {/* ─── CENTER PANEL ─── */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", bgcolor: PANEL_BG }}>
        {!convo && !loadingConvo ? (
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 2 }}>
            <ChatBubbleOutlineIcon sx={{ fontSize: 56, color: "#ccc" }} />
            <Typography color="text.secondary" fontWeight={500}>Select a conversation to view messages</Typography>
          </Box>
        ) : loadingConvo ? (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
            <CircularProgress size={32} />
          </Box>
        ) : (
          <>
            {/* Chat Header */}
            <Box sx={{ bgcolor: WHITE, px: 3, py: 2, display: "flex", alignItems: "center", gap: 2, borderBottom: "1px solid #eee" }}>
              <Avatar sx={{ bgcolor: avatarColor(activeConvo?.userName || ""), fontWeight: 700 }}>
                {getInitial(activeConvo?.userName)}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography fontWeight={700} fontSize={15}>
                  {activeConvo?.userName || `Session ${activeConvo?.sessionId?.slice(-6)}`}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Last active {timeAgo(activeConvo?.updatedAt)}
                </Typography>
              </Box>
              <Chip
                label={activeConvo?.status || "active"}
                size="small"
                color={activeConvo?.status === "active" ? "success" : "default"}
              />
            </Box>

            {/* Messages */}
            <Box sx={{ flex: 1, overflowY: "auto", px: 3, py: 2 }}>
              {convo.messages.length === 0 ? (
                <Typography textAlign="center" color="text.secondary" mt={4}>No messages in this conversation.</Typography>
              ) : (
                convo.messages.map((m, i) => {
                  const isUser = m.sender === "user";
                  return (
                    <Box key={i} sx={{ display: "flex", flexDirection: "column", alignItems: isUser ? "flex-end" : "flex-start", mb: 2 }}>
                      <Box sx={{ display: "flex", alignItems: "flex-end", gap: 1, flexDirection: isUser ? "row-reverse" : "row" }}>
                        <Avatar sx={{ width: 30, height: 30, fontSize: 13, bgcolor: isUser ? avatarColor(activeConvo?.userName) : BLUE }}>
                          {isUser ? getInitial(activeConvo?.userName) : "B"}
                        </Avatar>
                        <Box>
                          <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: "block", textAlign: isUser ? "right" : "left" }}>
                            {isUser ? (activeConvo?.userName || "User") : "Bot"}
                            {m.createdAt && ` • ${new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`}
                          </Typography>
                          <Box sx={{
                            px: 2, py: 1.2,
                            borderRadius: isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                            bgcolor: isUser ? BLUE : WHITE,
                            color: isUser ? "#fff" : "#222",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
                            maxWidth: 380,
                          }}>
                            <Typography fontSize={13.5} lineHeight={1.6}>{m.text}</Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </Box>

            {/* Input */}
            <Box sx={{ bgcolor: WHITE, px: 3, py: 2, borderTop: "1px solid #eee", display: "flex", alignItems: "center", gap: 1.5 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="This is a view-only chat — responses are automated by your flow."
                disabled
                InputProps={{ sx: { borderRadius: 3, bgcolor: PANEL_BG, fontSize: 13 } }}
                sx={{ "& fieldset": { border: "none" } }}
              />
              <IconButton sx={{ bgcolor: BLUE, color: "#fff", "&:hover": { bgcolor: "#4a4d8f" }, borderRadius: 2.5 }}>
                <SendIcon fontSize="small" />
              </IconButton>
            </Box>
          </>
        )}
      </Box>

      {/* ─── RIGHT PANEL ─── */}
      <Box sx={{ width: 260, minWidth: 260, bgcolor: WHITE, borderLeft: "1px solid #eee", p: 2.5, overflowY: "auto" }}>
        {convo ? (
          <>
            {/* User Info */}
            <Box sx={{ textAlign: "center", mb: 3 }}>
              <Avatar sx={{ width: 60, height: 60, mx: "auto", mb: 1.5, bgcolor: avatarColor(activeConvo?.userName || ""), fontSize: 24, fontWeight: 700 }}>
                {getInitial(activeConvo?.userName)}
              </Avatar>
              <Typography fontWeight={700} fontSize={15}>
                {activeConvo?.userName || "Anonymous"}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {activeConvo?.sessionId?.slice(-12)}
              </Typography>
              <Box sx={{ mt: 1 }}>
                <Chip label={activeConvo?.status} size="small" color={activeConvo?.status === "active" ? "success" : "default"} />
              </Box>
            </Box>

            <Divider sx={{ mb: 2 }} />

            {/* Stats */}
            <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ textTransform: "uppercase", letterSpacing: 0.5 }}>
              Conversation Info
            </Typography>
            {[
              { label: "Total Messages", value: convo.messages.length },
              { label: "User Answers", value: userMessages },
              { label: "Bot Questions", value: botMessages },
              { label: "Started", value: new Date(convo.createdAt || convo.updatedAt).toLocaleDateString() },
              { label: "Last Active", value: timeAgo(convo.updatedAt) },
            ].map((item) => (
              <Box key={item.label} sx={{ display: "flex", justifyContent: "space-between", py: 1, borderBottom: "1px solid #f5f5f5" }}>
                <Typography variant="body2" color="text.secondary">{item.label}</Typography>
                <Typography variant="body2" fontWeight={600}>{item.value}</Typography>
              </Box>
            ))}

            <Divider sx={{ my: 2 }} />

            {/* Messages Preview */}
            <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ textTransform: "uppercase", letterSpacing: 0.5 }}>
              Recent Answers
            </Typography>
            {convo.messages.filter(m => m.sender === "user").slice(-4).map((m, i) => (
              <Box key={i} sx={{ mt: 1.5, p: 1.5, bgcolor: PANEL_BG, borderRadius: 2 }}>
                <Typography fontSize={12} color="text.secondary" noWrap>{m.text}</Typography>
              </Box>
            ))}
          </>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 1 }}>
            <InfoOutlinedIcon sx={{ color: "#ccc", fontSize: 40 }} />
            <Typography variant="body2" color="text.secondary" textAlign="center">
              Select a chat to see details
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}
