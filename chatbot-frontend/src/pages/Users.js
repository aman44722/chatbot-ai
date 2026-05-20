import React, { useEffect, useState } from 'react';
import {
  Box, Paper, Typography, List, ListItem, ListItemAvatar, ListItemText,
  Avatar, Chip, TextField, InputAdornment, CircularProgress, Divider
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { fetchConversations } from '../api/conversationApi';
import { useNavigate } from 'react-router-dom';

const Users = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchConversations()
      .then(setConversations)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = conversations.filter(c =>
    (c.userName || c.sessionId).toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
      <CircularProgress />
    </Box>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight={700} mb={0.5}>Users</Typography>
      <Typography color="text.secondary" mb={3}>
        {conversations.length} total users who interacted with your chatbot
      </Typography>

      <TextField
        placeholder="Search users..."
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
          <Box sx={{ p: 5, textAlign: 'center' }}>
            <Typography color="text.secondary">No users yet.</Typography>
          </Box>
        ) : (
          <List disablePadding>
            {filtered.map((c, i) => (
              <React.Fragment key={c._id}>
                <ListItem
                  button
                  onClick={() => navigate(`/app/conversations/${c._id}`)}
                  sx={{ py: 1.5, '&:hover': { bgcolor: '#f5f7ff' } }}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: c.userName ? '#1976d2' : '#9e9e9e' }}>
                      {(c.userName || '?')[0].toUpperCase()}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography fontWeight={500}>
                        {c.userName || `Anonymous (${c.sessionId.slice(-8)})`}
                      </Typography>
                    }
                    secondary={`${c.messages?.length || 0} messages • ${new Date(c.updatedAt).toLocaleString()}`}
                  />
                  <Chip
                    label={c.status}
                    size="small"
                    color={c.status === 'active' ? 'success' : 'default'}
                  />
                </ListItem>
                {i < filtered.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>
    </Box>
  );
};

export default Users;
