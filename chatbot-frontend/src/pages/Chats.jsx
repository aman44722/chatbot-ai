import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  Box, Typography, Avatar, TextField, InputAdornment,
  List, ListItem, Chip, Divider, IconButton, CircularProgress,
  Badge, Button, Tooltip, Skeleton, Collapse, Fab
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import SendIcon from "@mui/icons-material/Send";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ReplayIcon from "@mui/icons-material/Replay";
import RefreshIcon from "@mui/icons-material/Refresh";
import DownloadIcon from "@mui/icons-material/Download";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import { fetchConversations, fetchConversationById, updateConversationStatus, sendAdminMessage, fetchMessagesBySession } from "../api/conversationApi";
import { connectSocket, joinConversation, leaveConversation } from "../api/socket";

const PANEL_BG = "#f4f6fb";
const WHITE = "#ffffff";
const BLUE = "#5b5ea6";
const LIGHT_BLUE = "#eef0ff";
const GREEN = "#2e7d32";
const TABS = ["All", "Live", "Active", "Closed"];
const ORANGE = "#e65100";

const CANNED_REPLIES = [
  "I'll look into this right away!",
  "Please hold on a moment.",
  "Can you provide more details?",
  "Thank you for your patience.",
  "Is there anything else I can help you with?",
];

function playNotification() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1100, ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.18, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.35);
  } catch (e) { /* silent */ }
}

function exportConversation(convo, userName) {
  const name = userName || `Session_${convo.sessionId?.slice(-6)}`;
  const lines = [
    `Conversation Export`,
    `User: ${name}`,
    `Status: ${convo.status}`,
    `Date: ${new Date(convo.createdAt || convo.updatedAt).toLocaleString()}`,
    `Session: ${convo.sessionId}`,
    "─────────────────────────────",
    ...convo.messages.map(m => {
      const time = m.createdAt
        ? new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        : "";
      const sender = m.sender === "admin" ? "Admin" : m.sender === "user" ? name : "Bot";
      return `[${time}] ${sender}: ${m.text}`;
    }),
  ];
  const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `chat_${name}_${new Date().toISOString().slice(0, 10)}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

function MessageSkeleton() {
  const rows = [
    { align: "flex-start", w: 220 },
    { align: "flex-end", w: 160 },
    { align: "flex-start", w: 280 },
    { align: "flex-end", w: 200 },
    { align: "flex-start", w: 180 },
    { align: "flex-end", w: 240 },
  ];
  return (
    <Box>
      {rows.map((r, i) => (
        <Box key={i} sx={{ display: "flex", justifyContent: r.align, mb: 2, gap: 1, alignItems: "flex-end" }}>
          {r.align === "flex-start" && <Skeleton variant="circular" width={30} height={30} />}
          <Skeleton variant="rounded" width={r.w} height={38} sx={{ borderRadius: r.align === "flex-end" ? "18px 18px 4px 18px" : "18px 18px 18px 4px" }} />
          {r.align === "flex-end" && <Skeleton variant="circular" width={30} height={30} />}
        </Box>
      ))}
    </Box>
  );
}

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

function getLastMsgPreview(c) {
  const msg = c.messages?.[c.messages.length - 1];
  if (!msg) return "No messages";
  const prefix = msg.sender === "admin" ? "You: " : msg.sender === "bot" ? "Bot: " : "";
  return prefix + (msg.text?.slice(0, 38) || "");
}

export default function Chats() {
  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [convo, setConvo] = useState(null);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("All");
  const [loadingConvo, setLoadingConvo] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingList, setLoadingList] = useState(true);
  const [adminText, setAdminText] = useState("");
  const [sending, setSending] = useState(false);
  const [showCanned, setShowCanned] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  const messagesEndRef = useRef(null);
  const livePollingRef = useRef(null);
  const listRefreshRef = useRef(null);
  const activeIdRef = useRef(null);
  const prevMsgCountRef = useRef(0);
  const scrollBoxRef = useRef(null);
  const socketRef = useRef(null);

  const loadConversations = useCallback(async (silent = false) => {
    if (!silent) setRefreshing(true);
    try {
      const data = await fetchConversations();
      setConversations(data);
    } catch (err) {
      console.error(err);
    } finally {
      setRefreshing(false);
      setLoadingList(false);
    }
  }, []);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  // Auto-refresh list every 30s to catch new live requests
  useEffect(() => {
    listRefreshRef.current = setInterval(() => loadConversations(true), 30000);
    return () => clearInterval(listRefreshRef.current);
  }, [loadConversations]);

  useEffect(() => {
    activeIdRef.current = activeId;
  }, [activeId]);

  // Poll messages for live conversations (fallback when WebSocket unavailable)
  useEffect(() => {
    if (livePollingRef.current) clearInterval(livePollingRef.current);
    if (!convo || convo.status !== "live_requested") return;
    prevMsgCountRef.current = convo.messages?.length || 0;

    livePollingRef.current = setInterval(async () => {
      if (!convo?.chatbotId || !convo?.sessionId) return;
      try {
        const res = await fetchMessagesBySession(convo.chatbotId, convo.sessionId);
        if (res.ok) {
          const newLen = res.messages.length;
          if (newLen > prevMsgCountRef.current) {
            const newMsgs = res.messages.slice(prevMsgCountRef.current);
            if (newMsgs.some(m => m.sender === "user")) {
              playNotification();
            }
            prevMsgCountRef.current = newLen;
          }
          setConvo(prev => prev ? { ...prev, messages: res.messages, status: res.status } : prev);
        }
      } catch { /* silent */ }
    }, 4000);

    return () => clearInterval(livePollingRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [convo?.status, convo?._id]);

  // Connect socket and listen for live updates (supplement to polling)
  useEffect(() => {
    const socket = connectSocket();
    socketRef.current = socket;

    if (socket?.connected && convo?.chatbotId && convo?.sessionId) {
      joinConversation(convo.chatbotId, convo.sessionId);
    }

    if (!socket?.connected) return;

    const handleMessageUpdate = async ({ chatbotId, sessionId }) => {
      if (convo?.chatbotId === chatbotId && convo?.sessionId === sessionId) {
        try {
          const res = await fetchMessagesBySession(chatbotId, sessionId);
          if (res.ok) {
            const prevLen = prevMsgCountRef.current;
            const newLen = res.messages.length;
            if (newLen > prevLen && res.messages.slice(prevLen).some(m => m.sender === "user")) {
              playNotification();
            }
            prevMsgCountRef.current = newLen;
            setConvo(prev => prev ? { ...prev, messages: res.messages, status: res.status } : prev);
          }
        } catch { /* silent */ }
      }
    };

    const handleStatusUpdate = ({ chatbotId, sessionId, status }) => {
      if (convo?.chatbotId === chatbotId && convo?.sessionId === sessionId) {
        setConvo(prev => prev ? { ...prev, status } : prev);
      }
      setConversations(prev =>
        prev.map(c => c.chatbotId === chatbotId && c.sessionId === sessionId ? { ...c, status } : c)
      );
    };

    const handleLiveRequest = () => loadConversations(true);

    socket.on("message-update", handleMessageUpdate);
    socket.on("status-updated", handleStatusUpdate);
    socket.on("live-request", handleLiveRequest);

    return () => {
      if (convo?.chatbotId && convo?.sessionId) {
        leaveConversation(convo.chatbotId, convo.sessionId);
      }
      socket.off("message-update", handleMessageUpdate);
      socket.off("status-updated", handleStatusUpdate);
      socket.off("live-request", handleLiveRequest);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [convo?.chatbotId, convo?.sessionId, convo?._id]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [convo?.messages?.length]);

  const handleScroll = useCallback(() => {
    const box = scrollBoxRef.current;
    if (!box) return;
    setShowScrollBtn(box.scrollHeight - box.scrollTop - box.clientHeight > 120);
  }, []);

  const handleSelect = async (id) => {
    setActiveId(id);
    setAdminText("");
    setShowCanned(false);
    setLoadingConvo(true);
    if (livePollingRef.current) clearInterval(livePollingRef.current);
    try {
      const data = await fetchConversationById(id);
      setConvo(data);
      prevMsgCountRef.current = data.messages?.length || 0;
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingConvo(false);
    }
  };

  const handleAdminSend = async () => {
    if (!adminText.trim() || !convo || sending) return;
    const text = adminText.trim();
    setAdminText("");
    setShowCanned(false);
    setSending(true);
    const optimistic = { sender: "admin", text, createdAt: new Date().toISOString() };
    setConvo(prev => ({ ...prev, messages: [...prev.messages, optimistic] }));
    prevMsgCountRef.current += 1;
    try {
      await sendAdminMessage(convo.chatbotId, convo.sessionId, text);
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  const handleStatusToggle = async () => {
    if (!activeId || !convo) return;
    const newStatus = convo.status !== "closed" ? "closed" : "active";
    setStatusUpdating(true);
    try {
      await updateConversationStatus(activeId, newStatus);
      setConvo(prev => ({ ...prev, status: newStatus }));
      setConversations(prev =>
        prev.map(c => c._id === activeId ? { ...c, status: newStatus } : c)
      );
    } catch (err) {
      console.error(err);
    } finally {
      setStatusUpdating(false);
    }
  };

  const activeCount = conversations.filter(c => c.status === "active").length;
  const closedCount = conversations.filter(c => c.status === "closed").length;
  const liveCount = conversations.filter(c => c.status === "live_requested").length;

  const filtered = conversations
    .filter(c => {
      if (tab === "Active") return c.status === "active";
      if (tab === "Closed") return c.status === "closed";
      if (tab === "Live") return c.status === "live_requested";
      return true;
    })
    .filter(c =>
      (c.userName || c.sessionId || "").toLowerCase().includes(search.toLowerCase())
    );

  const activeConvo = conversations.find(c => c._id === activeId);
  const userMessages = convo?.messages?.filter(m => m.sender === "user").length || 0;
  const botMessages = convo?.messages?.filter(m => m.sender === "bot").length || 0;
  const isLive = convo?.status === "live_requested";

  return (
    <Box sx={{ display: "flex", height: "calc(100vh - 100px)", gap: 0, borderRadius: 3, overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>

      {/* ─── LEFT PANEL ─── */}
      <Box sx={{ width: 300, minWidth: 300, bgcolor: WHITE, display: "flex", flexDirection: "column", borderRight: "1px solid #eee" }}>
        <Box sx={{ p: 2.5, pb: 1.5 }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <ChatBubbleOutlineIcon sx={{ color: BLUE, fontSize: 20 }} />
              <Typography fontWeight={700} fontSize={16}>Chats</Typography>
              {activeCount > 0 && (
                <Chip label={activeCount} size="small" sx={{ bgcolor: "#e8f5e9", color: GREEN, fontWeight: 700, height: 20, fontSize: 11 }} />
              )}
            </Box>
            <Tooltip title="Refresh">
              <IconButton size="small" onClick={() => loadConversations()} disabled={refreshing}>
                <RefreshIcon fontSize="small" sx={{ color: BLUE, animation: refreshing ? "spin 1s linear infinite" : "none" }} />
              </IconButton>
            </Tooltip>
          </Box>

          {/* Tabs */}
          <Box sx={{ display: "flex", gap: 0.5, mb: 2, bgcolor: PANEL_BG, borderRadius: 2, p: 0.5 }}>
            {TABS.map((t) => {
              const count = t === "Active" ? activeCount : t === "Closed" ? closedCount : t === "Live" ? liveCount : conversations.length;
              return (
                <Box
                  key={t}
                  onClick={() => setTab(t)}
                  sx={{
                    flex: 1, textAlign: "center",
                    px: 1, py: 0.6, borderRadius: 1.5, fontSize: 12, fontWeight: 600,
                    cursor: "pointer",
                    bgcolor: tab === t ? WHITE : t === "Live" && liveCount > 0 ? "#fff3e0" : "transparent",
                    color: tab === t ? (t === "Live" ? ORANGE : BLUE) : t === "Live" && liveCount > 0 ? ORANGE : "#888",
                    boxShadow: tab === t ? "0 1px 4px rgba(0,0,0,0.1)" : "none",
                    animation: t === "Live" && liveCount > 0 && tab !== "Live" ? "pulse 1.5s ease infinite" : "none",
                    "@keyframes pulse": { "0%,100%": { opacity: 1 }, "50%": { opacity: 0.55 } },
                    transition: "all 0.15s",
                  }}
                >
                  {t}
                  {count > 0 && (
                    <Box component="span" sx={{ ml: 0.5, fontSize: 10, opacity: 0.7, color: t === "Live" ? ORANGE : "inherit" }}>({count})</Box>
                  )}
                </Box>
              );
            })}
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
          {loadingList ? <Skeleton variant="text" width={80} /> : `${tab} · ${filtered.length}`}
        </Typography>

        {/* User List */}
        <List disablePadding sx={{ overflowY: "auto", flex: 1, px: 1 }}>
          {loadingList ? (
            [...Array(6)].map((_, i) => (
              <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 1.5, px: 1.5, py: 1.2, mb: 0.5 }}>
                <Skeleton variant="circular" width={42} height={42} sx={{ flexShrink: 0 }} />
                <Box sx={{ flex: 1 }}>
                  <Skeleton variant="text" width="60%" height={16} sx={{ mb: 0.5 }} />
                  <Skeleton variant="text" width="85%" height={13} />
                </Box>
                <Skeleton variant="text" width={28} height={12} />
              </Box>
            ))
          ) : filtered.length === 0 ? (
            <Box sx={{ p: 3, textAlign: "center" }}>
              <Typography variant="body2" color="text.secondary">
                {tab === "Active" ? "No active chats." : tab === "Closed" ? "No closed chats." : tab === "Live" ? "No live requests." : "No conversations yet."}
              </Typography>
            </Box>
          ) : (
            filtered.map((c) => {
              const name = c.userName || `Session ${c.sessionId?.slice(-6)}`;
              const preview = getLastMsgPreview(c);
              const isSelected = c._id === activeId;
              const isItemLoading = isSelected && loadingConvo;
              const isClosed = c.status === "closed";
              const isItemLive = c.status === "live_requested";
              return (
                <ListItem
                  key={c._id}
                  button
                  onClick={() => handleSelect(c._id)}
                  sx={{
                    borderRadius: 2.5, mb: 0.5, px: 1.5, py: 1.2,
                    bgcolor: isItemLive ? "#fff3e0" : isSelected ? LIGHT_BLUE : "transparent",
                    borderLeft: isItemLive ? `3px solid ${ORANGE}` : "3px solid transparent",
                    "&:hover": { bgcolor: isItemLive ? "#ffe0b2" : isSelected ? LIGHT_BLUE : PANEL_BG },
                    transition: "background 0.15s",
                    opacity: isClosed ? 0.65 : 1,
                  }}
                >
                  <Box sx={{ position: "relative", mr: 1.5, flexShrink: 0 }}>
                    <Badge
                      variant="dot"
                      color={isItemLive ? "warning" : "success"}
                      invisible={isClosed || isItemLoading}
                      overlap="circular"
                      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    >
                      <Avatar sx={{ width: 42, height: 42, bgcolor: avatarColor(name), fontSize: 16, fontWeight: 700, opacity: isItemLoading ? 0.5 : 1, transition: "opacity 0.2s" }}>
                        {getInitial(name)}
                      </Avatar>
                    </Badge>
                    {isItemLoading && (
                      <CircularProgress size={46} thickness={2.5} sx={{ color: BLUE, position: "absolute", top: -2, left: -2, zIndex: 1 }} />
                    )}
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Typography fontSize={13.5} fontWeight={isSelected ? 700 : 600} noWrap sx={{ maxWidth: 120 }}>
                        {name}
                      </Typography>
                      <Typography fontSize={11} color="text.secondary">{timeAgo(c.updatedAt)}</Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      {isClosed && <Chip label="closed" size="small" sx={{ height: 14, fontSize: 9, px: 0.3, color: "#888", bgcolor: "#f0f0f0" }} />}
                      {isItemLive && <Chip label="🔴 Live" size="small" sx={{ height: 14, fontSize: 9, px: 0.3, color: ORANGE, bgcolor: "#fff3e0", fontWeight: 700 }} />}
                      <Typography fontSize={12} color="text.secondary" noWrap sx={{ maxWidth: 150 }}>
                        {preview}
                      </Typography>
                    </Box>
                  </Box>
                </ListItem>
              );
            })
          )}
        </List>
      </Box>

      {/* ─── CENTER PANEL ─── */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", bgcolor: PANEL_BG }}>
        {!activeId ? (
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 2 }}>
            <ChatBubbleOutlineIcon sx={{ fontSize: 56, color: "#ccc" }} />
            <Typography color="text.secondary" fontWeight={500}>Select a conversation to view messages</Typography>
          </Box>
        ) : (
          <>
            {/* Chat Header */}
            <Box sx={{ bgcolor: WHITE, px: 3, py: 2, display: "flex", alignItems: "center", gap: 2, borderBottom: `2px solid ${isLive ? ORANGE : "#eee"}` }}>
              <Avatar sx={{ bgcolor: avatarColor(activeConvo?.userName || ""), fontWeight: 700 }}>
                {getInitial(activeConvo?.userName)}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography fontWeight={700} fontSize={15}>
                  {activeConvo?.userName || `Session ${activeConvo?.sessionId?.slice(-6)}`}
                </Typography>
                <Typography variant="caption" color={isLive ? ORANGE : "text.secondary"} fontWeight={isLive ? 700 : 400}>
                  {isLive ? "🔴 Live chat in progress" : `Last active ${timeAgo(activeConvo?.updatedAt)}`}
                </Typography>
              </Box>
              {loadingConvo ? (
                <Skeleton variant="rounded" width={60} height={24} />
              ) : (
                <>
                  <Chip
                    label={isLive ? "Live" : convo?.status || "active"}
                    size="small"
                    sx={{
                      bgcolor: isLive ? "#fff3e0" : convo?.status === "active" ? "#e8f5e9" : "#f0f0f0",
                      color: isLive ? ORANGE : convo?.status === "active" ? GREEN : "#888",
                      fontWeight: 700,
                    }}
                  />
                  <Tooltip title={convo?.status !== "closed" ? "Close conversation" : "Reopen conversation"}>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={convo?.status !== "closed" ? <CheckCircleIcon /> : <ReplayIcon />}
                      onClick={handleStatusToggle}
                      disabled={statusUpdating}
                      sx={{
                        textTransform: "none", fontSize: 12,
                        borderColor: convo?.status !== "closed" ? "#c62828" : GREEN,
                        color: convo?.status !== "closed" ? "#c62828" : GREEN,
                        "&:hover": {
                          bgcolor: convo?.status !== "closed" ? "#ffebee" : "#e8f5e9",
                          borderColor: convo?.status !== "closed" ? "#c62828" : GREEN,
                        }
                      }}
                    >
                      {statusUpdating ? "..." : convo?.status !== "closed" ? "Close" : "Reopen"}
                    </Button>
                  </Tooltip>
                </>
              )}
            </Box>

            {/* Messages Area */}
            <Box
              ref={scrollBoxRef}
              onScroll={handleScroll}
              sx={{ flex: 1, overflowY: "auto", px: 3, py: 2, position: "relative" }}
            >
              {loadingConvo ? (
                <MessageSkeleton />
              ) : convo?.messages?.length === 0 ? (
                <Typography textAlign="center" color="text.secondary" mt={4}>No messages in this conversation.</Typography>
              ) : (
                <Box sx={{ animation: "fadeIn 0.25s ease", "@keyframes fadeIn": { from: { opacity: 0, transform: "translateY(6px)" }, to: { opacity: 1, transform: "translateY(0)" } } }}>
                  {convo.messages.map((m, i) => {
                    const isUser = m.sender === "user";
                    const isAdmin = m.sender === "admin";
                    const alignRight = isUser || isAdmin;
                    return (
                      <Box key={i} sx={{ display: "flex", flexDirection: "column", alignItems: alignRight ? "flex-end" : "flex-start", mb: 2 }}>
                        <Box sx={{ display: "flex", alignItems: "flex-end", gap: 1, flexDirection: alignRight ? "row-reverse" : "row" }}>
                          <Avatar sx={{ width: 30, height: 30, fontSize: 13, bgcolor: isAdmin ? ORANGE : isUser ? avatarColor(activeConvo?.userName) : BLUE }}>
                            {isAdmin ? "A" : isUser ? getInitial(activeConvo?.userName) : "B"}
                          </Avatar>
                          <Box>
                            <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: "block", textAlign: alignRight ? "right" : "left" }}>
                              {isAdmin ? "You (Admin)" : isUser ? (activeConvo?.userName || "User") : "Bot"}
                              {m.createdAt && ` · ${new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`}
                            </Typography>
                            <Box sx={{
                              px: 2, py: 1.2,
                              borderRadius: alignRight ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                              bgcolor: isAdmin ? ORANGE : isUser ? BLUE : WHITE,
                              color: alignRight ? "#fff" : "#222",
                              boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
                              maxWidth: 380,
                            }}>
                              <Typography fontSize={13.5} lineHeight={1.6}>{m.text}</Typography>
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </Box>
              )}
            </Box>

            {/* Scroll to bottom FAB */}
            {showScrollBtn && (
              <Box sx={{ position: "absolute", bottom: isLive ? 140 : 90, left: "calc(300px + (100% - 560px) / 2)", zIndex: 10 }}>
                <Fab
                  size="small"
                  onClick={() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })}
                  sx={{ bgcolor: BLUE, color: "#fff", boxShadow: "0 3px 10px rgba(0,0,0,0.2)", "&:hover": { bgcolor: "#4a4d8a" } }}
                >
                  <KeyboardArrowDownIcon />
                </Fab>
              </Box>
            )}

            {/* Canned Replies */}
            {isLive && (
              <Collapse in={showCanned}>
                <Box sx={{ bgcolor: "#fff8f0", px: 2, py: 1.5, borderTop: "1px solid #ffe0b2", display: "flex", flexWrap: "wrap", gap: 0.8 }}>
                  {CANNED_REPLIES.map((r, i) => (
                    <Chip
                      key={i}
                      label={r}
                      size="small"
                      onClick={() => { setAdminText(r); setShowCanned(false); }}
                      sx={{ fontSize: 11.5, cursor: "pointer", bgcolor: WHITE, border: `1px solid #ffcc80`, "&:hover": { bgcolor: "#fff3e0" }, transition: "all 0.1s" }}
                    />
                  ))}
                </Box>
              </Collapse>
            )}

            {/* Input */}
            {isLive ? (
              <Box sx={{ bgcolor: WHITE, px: 2, py: 1.5, borderTop: `2px solid ${ORANGE}`, display: "flex", alignItems: "center", gap: 1 }}>
                <Tooltip title={showCanned ? "Hide quick replies" : "Quick replies"}>
                  <IconButton
                    size="small"
                    onClick={() => setShowCanned(p => !p)}
                    sx={{ color: showCanned ? ORANGE : "#bbb", "&:hover": { color: ORANGE }, transition: "color 0.15s" }}
                  >
                    <FlashOnIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Reply to user..."
                  value={adminText}
                  onChange={e => setAdminText(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleAdminSend()}
                  disabled={sending}
                  autoFocus
                  InputProps={{ sx: { borderRadius: 3, fontSize: 13 } }}
                />
                <IconButton
                  onClick={handleAdminSend}
                  disabled={!adminText.trim() || sending}
                  sx={{ bgcolor: ORANGE, color: "#fff", "&:hover": { bgcolor: "#bf360c" }, "&.Mui-disabled": { bgcolor: "#eee" }, borderRadius: 2.5 }}
                >
                  {sending ? <CircularProgress size={18} color="inherit" /> : <SendIcon fontSize="small" />}
                </IconButton>
              </Box>
            ) : (
              <Box sx={{ bgcolor: WHITE, px: 3, py: 2, borderTop: "1px solid #eee", display: "flex", alignItems: "center", gap: 1.5 }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder={convo?.status === "closed" ? "Conversation is closed." : "View-only — responses are automated by your flow."}
                  disabled
                  InputProps={{ sx: { borderRadius: 3, bgcolor: PANEL_BG, fontSize: 13 } }}
                  sx={{ "& fieldset": { border: "none" } }}
                />
                <IconButton disabled sx={{ bgcolor: "#eee", color: "#aaa", borderRadius: 2.5 }}>
                  <SendIcon fontSize="small" />
                </IconButton>
              </Box>
            )}
          </>
        )}
      </Box>

      {/* ─── RIGHT PANEL ─── */}
      <Box sx={{ width: 260, minWidth: 260, bgcolor: WHITE, borderLeft: "1px solid #eee", p: 2.5, overflowY: "auto" }}>
        {loadingConvo && activeId ? (
          <Box sx={{ pt: 1 }}>
            <Skeleton variant="circular" width={60} height={60} sx={{ mx: "auto", mb: 1.5 }} />
            <Skeleton variant="text" width="60%" sx={{ mx: "auto", mb: 0.5 }} />
            <Skeleton variant="text" width="40%" sx={{ mx: "auto", mb: 2 }} />
            <Divider sx={{ mb: 2 }} />
            {[...Array(5)].map((_, i) => (
              <Box key={i} sx={{ display: "flex", justifyContent: "space-between", py: 1 }}>
                <Skeleton variant="text" width="45%" />
                <Skeleton variant="text" width="30%" />
              </Box>
            ))}
          </Box>
        ) : convo ? (
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
                <Chip
                  label={isLive ? "Live" : convo?.status}
                  size="small"
                  sx={{
                    bgcolor: isLive ? "#fff3e0" : convo?.status === "active" ? "#e8f5e9" : "#f0f0f0",
                    color: isLive ? ORANGE : convo?.status === "active" ? GREEN : "#888",
                    fontWeight: 700,
                  }}
                />
              </Box>
            </Box>

            <Divider sx={{ mb: 2 }} />

            {/* Action Buttons */}
            <Box sx={{ mb: 2, display: "flex", flexDirection: "column", gap: 1 }}>
              <Button
                fullWidth
                variant={convo?.status !== "closed" ? "outlined" : "contained"}
                color={convo?.status !== "closed" ? "error" : "success"}
                size="small"
                startIcon={convo?.status !== "closed" ? <CheckCircleIcon /> : <ReplayIcon />}
                onClick={handleStatusToggle}
                disabled={statusUpdating}
                sx={{ textTransform: "none", borderRadius: 2 }}
              >
                {statusUpdating ? "Updating..." : convo?.status !== "closed" ? "Close Conversation" : "Reopen Conversation"}
              </Button>
              <Button
                fullWidth
                variant="outlined"
                size="small"
                startIcon={<DownloadIcon />}
                onClick={() => exportConversation(convo, activeConvo?.userName)}
                sx={{ textTransform: "none", borderRadius: 2, borderColor: BLUE, color: BLUE, "&:hover": { bgcolor: LIGHT_BLUE, borderColor: BLUE } }}
              >
                Export Chat
              </Button>
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
              { label: "Status", value: isLive ? "Live" : convo.status },
            ].map((item) => (
              <Box key={item.label} sx={{ display: "flex", justifyContent: "space-between", py: 1, borderBottom: "1px solid #f5f5f5" }}>
                <Typography variant="body2" color="text.secondary">{item.label}</Typography>
                <Typography variant="body2" fontWeight={600}>{item.value}</Typography>
              </Box>
            ))}

            <Divider sx={{ my: 2 }} />

            {/* Recent Answers */}
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
