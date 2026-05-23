import { useEffect, useState } from "react";
import { fetchConversations } from "../api/conversationApi";
import { useNavigate } from "react-router-dom";
import {
  Box, Paper, Typography, List, ListItem, ListItemAvatar, ListItemText,
  Avatar, Chip, TextField, InputAdornment, CircularProgress, Divider
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import SmartToyIcon from "@mui/icons-material/SmartToy";

export default function Conversations() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const loadConversations = async (silent = false) => {
    if (!silent) setLoading(true);
    const botId = localStorage.getItem('selectedBotId') || '';
    try {
      const data = await fetchConversations(1, 50, botId);
      setList(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConversations();
  }, []);

  // Re-fetch when selectedBotId changes
  useEffect(() => {
    let lastBotId = localStorage.getItem('selectedBotId');
    const checkBotId = () => {
      const current = localStorage.getItem('selectedBotId');
      if (current !== lastBotId) { lastBotId = current; loadConversations(true); }
    };
    window.addEventListener('focus', checkBotId);
    window.addEventListener('visibilitychange', () => { if (!document.hidden) checkBotId(); });
    return () => {
      window.removeEventListener('focus', checkBotId);
      window.removeEventListener('visibilitychange', checkBotId);
    };
  }, []);

  const filtered = list.filter(c =>
    (c.userName || c.sessionId).toLowerCase().includes(search.toLowerCase())
  );

  const selectedBotId = localStorage.getItem('selectedBotId');

  if (loading) return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
      <CircularProgress />
    </Box>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight={700} mb={0.5}>Conversations</Typography>
      <Typography color="text.secondary" mb={3}>
        {list.length} total {selectedBotId ? `(filtered by selected bot)` : `(all bots — select a bot in sidebar to filter)`}
      </Typography>

      <TextField
        placeholder="Search conversations..."
        size="small"
        fullWidth
        sx={{ mb: 3 }}
        value={search}
        onChange={e => setSearch(e.target.value)}
        InputProps={{
          startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>
        }}
      />

      <Paper elevation={2} sx={{ borderRadius: 3 }}>
        {filtered.length === 0 ? (
          <Box sx={{ p: 5, textAlign: "center" }}>
            <Typography color="text.secondary">No conversations yet.</Typography>
          </Box>
        ) : (
          <List disablePadding>
            {filtered.map((c, i) => (
              <div key={c._id}>
                <ListItem
                  button
                  onClick={() => navigate(`/app/conversations/${c._id}`)}
                  sx={{ py: 1.5, "&:hover": { bgcolor: "#f5f7ff" } }}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: c.userName ? "#1976d2" : "#9e9e9e" }}>
                      {(c.userName || "?")[0].toUpperCase()}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography fontWeight={500}>
                        {c.userName || `Anonymous (${c.sessionId.slice(-8)})`}
                      </Typography>
                    }
                    secondary={
                      <Box component="span" sx={{ display: "flex", alignItems: "center", gap: 0.5, flexWrap: "wrap" }}>
                        {c.botName && (
                          <Chip
                            icon={<SmartToyIcon sx={{ fontSize: 12 }} />}
                            label={c.botName}
                            size="small"
                            sx={{ height: 20, fontSize: 10, "& .MuiChip-icon": { ml: 0.5 } }}
                          />
                        )}
                        <span>{`${c.messages?.length || 0} messages • ${new Date(c.updatedAt).toLocaleString()}`}</span>
                      </Box>
                    }
                  />
                  <Chip
                    label={c.status}
                    size="small"
                    color={c.status === "active" ? "success" : "default"}
                  />
                </ListItem>
                {i < filtered.length - 1 && <Divider />}
              </div>
            ))}
          </List>
        )}
      </Paper>
    </Box>
  );
}
