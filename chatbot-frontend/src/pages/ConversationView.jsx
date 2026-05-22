import { useEffect, useState } from "react";
import { fetchConversationById } from "../api/conversationApi";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box, Paper, Typography, Avatar, Chip, CircularProgress, IconButton, Button
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function ConversationView() {
  const { id } = useParams();
  const [convo, setConvo] = useState(null);
  const navigate = useNavigate();

  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setNotFound(false);
    fetchConversationById(id)
      .then(setConvo)
      .catch(() => setNotFound(true));
  }, [id]);

  if (!convo && !notFound) return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
      <CircularProgress />
    </Box>
  );

  if (notFound || !convo) return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh", flexDirection: "column", gap: 2 }}>
      <Typography variant="h6" color="text.secondary">Conversation not found</Typography>
      <Button variant="outlined" onClick={() => navigate('/app/conversations')}>Back to Conversations</Button>
    </Box>
  );

  return (
    <Box sx={{ p: 3, maxWidth: 700, mx: "auto" }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBackIcon />
        </IconButton>
        <Avatar sx={{ bgcolor: convo.userName ? "#1976d2" : "#9e9e9e" }}>
          {(convo.userName || "?")[0].toUpperCase()}
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Typography fontWeight={700}>{convo.userName || "Anonymous"}</Typography>
          <Typography variant="caption" color="text.secondary">
            Session: {convo.sessionId} • {new Date(convo.updatedAt).toLocaleString()}
          </Typography>
        </Box>
        <Chip label={convo.status} size="small" color={convo.status === "active" ? "success" : "default"} />
      </Box>

      <Paper elevation={2} sx={{ borderRadius: 3, p: 3, bgcolor: "#f8faff", minHeight: 200 }}>
        {convo.messages.length === 0 ? (
          <Typography color="text.secondary" align="center">No messages in this conversation.</Typography>
        ) : (
          convo.messages.map((m, i) => (
            <Box
              key={i}
              sx={{
                display: "flex",
                justifyContent: m.sender === "user" ? "flex-end" : "flex-start",
                mb: 1.5,
              }}
            >
              <Box
                sx={{
                  maxWidth: "75%",
                  px: 2, py: 1,
                  borderRadius: m.sender === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                  bgcolor: m.sender === "user" ? "#1976d2" : "#fff",
                  color: m.sender === "user" ? "#fff" : "#222",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                }}
              >
                <Typography variant="body2">{m.text}</Typography>
                {m.createdAt && (
                  <Typography variant="caption" sx={{ opacity: 0.7, display: "block", mt: 0.3 }}>
                    {new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </Typography>
                )}
              </Box>
            </Box>
          ))
        )}
      </Paper>
    </Box>
  );
}
