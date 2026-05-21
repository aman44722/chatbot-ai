import React, { useEffect, useState, useCallback } from "react";
import {
  Box, Typography, Avatar, TextField, InputAdornment,
  List, ListItem, Chip, Divider, IconButton, CircularProgress,
  Badge, Button, Tooltip, Skeleton
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import SendIcon from "@mui/icons-material/Send";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ReplayIcon from "@mui/icons-material/Replay";
import RefreshIcon from "@mui/icons-material/Refresh";
import { fetchConversations, fetchConversationById, updateConversationStatus } from "../api/conversationApi";

const PANEL_BG = "#f4f6fb";
const WHITE = "#ffffff";
const BLUE = "#5b5ea6";
const LIGHT_BLUE = "#eef0ff";
const GREEN = "#2e7d32";
const TABS = ["All", "Live", "Active", "Closed"];
const ORANGE = "#e65100";

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
  const messagesEndRef = React.useRef(null);

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

  const handleStatusToggle = async () => {
    if (!activeId || !convo) return;
    const newStatus = convo.status === "active" ? "closed" : "active";
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
              {activeCount > 0 && (
                <Chip
                  label={activeCount}
                  size="small"
                  sx={{ bgcolor: "#e8f5e9", color: GREEN, fontWeight: 700, height: 20, fontSize: 11 }}
                />
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
                {tab === "Active" ? "No active chats." : tab === "Closed" ? "No closed chats." : "No conversations yet."}
              </Typography>
            </Box>
          ) : (
            filtered.map((c) => {
              const name = c.userName || `Session ${c.sessionId?.slice(-6)}`;
              const lastMsg = c.messages?.[c.messages.length - 1]?.text || "No messages";
              const isActive = c._id === activeId;
              const isLoading = isActive && loadingConvo;
              const isClosed = c.status === "closed";
              const isLive = c.status === "live_requested";
              return (
                <ListItem
                  key={c._id}
                  button
                  onClick={() => handleSelect(c._id)}
                  sx={{
                    borderRadius: 2.5, mb: 0.5, px: 1.5, py: 1.2,
                    bgcolor: isLive ? "#fff3e0" : isActive ? LIGHT_BLUE : "transparent",
                    borderLeft: isLive ? `3px solid ${ORANGE}` : "3px solid transparent",
                    "&:hover": { bgcolor: isLive ? "#ffe0b2" : isActive ? LIGHT_BLUE : PANEL_BG },
                    transition: "background 0.15s",
                    opacity: isClosed ? 0.65 : 1,
                  }}
                >
                  <Box sx={{ position: "relative", mr: 1.5, flexShrink: 0 }}>
                    <Badge
                      variant="dot"
                      color="success"
                      invisible={isClosed || isLoading}
                      overlap="circular"
                      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    >
                      <Avatar
                        sx={{ width: 42, height: 42, bgcolor: avatarColor(name), fontSize: 16, fontWeight: 700, opacity: isLoading ? 0.5 : 1, transition: "opacity 0.2s" }}
                      >
                        {getInitial(name)}
                      </Avatar>
                    </Badge>
                    {isLoading && (
                      <CircularProgress
                        size={46}
                        thickness={2.5}
                        sx={{ color: BLUE, position: "absolute", top: -2, left: -2, zIndex: 1 }}
                      />
                    )}
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Typography fontSize={13.5} fontWeight={isActive ? 700 : 600} noWrap sx={{ maxWidth: 120 }}>
                        {name}
                      </Typography>
                      <Typography fontSize={11} color="text.secondary">{timeAgo(c.updatedAt)}</Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      {isClosed && (
                        <Chip label="closed" size="small" sx={{ height: 14, fontSize: 9, px: 0.3, color: "#888", bgcolor: "#f0f0f0" }} />
                      )}
                      {isLive && (
                        <Chip label="🔴 Live" size="small" sx={{ height: 14, fontSize: 9, px: 0.3, color: ORANGE, bgcolor: "#fff3e0", fontWeight: 700 }} />
                      )}
                      <Typography fontSize={12} color="text.secondary" noWrap sx={{ maxWidth: 150 }}>
                        {lastMsg}
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
            {/* Chat Header — instant from list data */}
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
              {loadingConvo ? (
                <Skeleton variant="rounded" width={60} height={24} />
              ) : (
                <>
                  <Chip
                    label={convo?.status || "active"}
                    size="small"
                    color={convo?.status === "active" ? "success" : "default"}
                  />
                  <Tooltip title={convo?.status === "active" ? "Close conversation" : "Reopen conversation"}>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={convo?.status === "active" ? <CheckCircleIcon /> : <ReplayIcon />}
                      onClick={handleStatusToggle}
                      disabled={statusUpdating}
                      sx={{
                        textTransform: "none", fontSize: 12,
                        borderColor: convo?.status === "active" ? "#c62828" : GREEN,
                        color: convo?.status === "active" ? "#c62828" : GREEN,
                        "&:hover": {
                          bgcolor: convo?.status === "active" ? "#ffebee" : "#e8f5e9",
                          borderColor: convo?.status === "active" ? "#c62828" : GREEN,
                        }
                      }}
                    >
                      {statusUpdating ? "..." : convo?.status === "active" ? "Close" : "Reopen"}
                    </Button>
                  </Tooltip>
                </>
              )}
            </Box>

            {/* Messages */}
            <Box sx={{ flex: 1, overflowY: "auto", px: 3, py: 2 }}>
              {loadingConvo ? (
                <MessageSkeleton />
              ) : convo?.messages?.length === 0 ? (
                <Typography textAlign="center" color="text.secondary" mt={4}>No messages in this conversation.</Typography>
              ) : (
                <Box sx={{ opacity: 1, animation: "fadeIn 0.25s ease", "@keyframes fadeIn": { from: { opacity: 0, transform: "translateY(6px)" }, to: { opacity: 1, transform: "translateY(0)" } } }}>
                  {convo.messages.map((m, i) => {
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
                              {m.createdAt && ` · ${new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`}
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
                  })}
                  <div ref={messagesEndRef} />
                </Box>
              )}
            </Box>

            {/* Input */}
            <Box sx={{ bgcolor: WHITE, px: 3, py: 2, borderTop: "1px solid #eee", display: "flex", alignItems: "center", gap: 1.5 }}>
              <TextField
                fullWidth
                size="small"
                placeholder={
                  convo?.status === "closed"
                    ? "Conversation is closed."
                    : "This is a view-only chat — responses are automated by your flow."
                }
                disabled
                InputProps={{ sx: { borderRadius: 3, bgcolor: PANEL_BG, fontSize: 13 } }}
                sx={{ "& fieldset": { border: "none" } }}
              />
              <IconButton sx={{ bgcolor: convo?.status === "closed" ? "#eee" : BLUE, color: convo?.status === "closed" ? "#aaa" : "#fff", "&:hover": { bgcolor: convo?.status === "closed" ? "#eee" : "#4a4d8f" }, borderRadius: 2.5 }} disabled={convo?.status === "closed"}>
                <SendIcon fontSize="small" />
              </IconButton>
            </Box>
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
                  label={convo?.status}
                  size="small"
                  color={convo?.status === "active" ? "success" : "default"}
                />
              </Box>
            </Box>

            <Divider sx={{ mb: 2 }} />

            {/* Action Buttons */}
            <Box sx={{ mb: 2 }}>
              <Button
                fullWidth
                variant={convo?.status === "active" ? "outlined" : "contained"}
                color={convo?.status === "active" ? "error" : "success"}
                size="small"
                startIcon={convo?.status === "active" ? <CheckCircleIcon /> : <ReplayIcon />}
                onClick={handleStatusToggle}
                disabled={statusUpdating}
                sx={{ textTransform: "none", borderRadius: 2, mb: 1 }}
              >
                {statusUpdating
                  ? "Updating..."
                  : convo?.status === "active"
                  ? "Close Conversation"
                  : "Reopen Conversation"}
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
              { label: "Status", value: convo.status },
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
