import React, { useEffect, useState } from 'react';
import {
  Box, Paper, Typography, Accordion, AccordionSummary, AccordionDetails,
  Chip, CircularProgress, Avatar, Divider, TextField, InputAdornment
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import { fetchConversations } from '../api/conversationApi';

const Answers = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchConversations()
      .then(setConversations)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const withAnswers = conversations
    .filter(c => c.messages && c.messages.some(m => m.sender === 'user'))
    .filter(c =>
      search === '' ||
      (c.userName || '').toLowerCase().includes(search.toLowerCase()) ||
      c.messages.some(m => (m.text || '').toLowerCase().includes(search.toLowerCase()))
    );

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
      <CircularProgress />
    </Box>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight={700} mb={0.5}>Answers</Typography>
      <Typography color="text.secondary" mb={3}>
        User responses collected from all chatbot conversations
      </Typography>

      <TextField
        placeholder="Search in answers..."
        size="small"
        fullWidth
        sx={{ mb: 3 }}
        value={search}
        onChange={e => setSearch(e.target.value)}
        InputProps={{
          startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>
        }}
      />

      {withAnswers.length === 0 ? (
        <Paper sx={{ p: 5, textAlign: 'center', borderRadius: 3 }}>
          <Typography color="text.secondary">
            No answers yet. They'll appear here when users respond to your chatbot questions.
          </Typography>
        </Paper>
      ) : (
        withAnswers.map((c) => (
          <Accordion
            key={c._id}
            sx={{
              mb: 1.5, borderRadius: '12px !important',
              '&:before': { display: 'none' },
              boxShadow: '0 2px 8px rgba(0,0,0,0.07)'
            }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ borderRadius: '12px' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%', pr: 1 }}>
                <Avatar sx={{ width: 34, height: 34, fontSize: 14, bgcolor: c.userName ? '#1976d2' : '#9e9e9e' }}>
                  {(c.userName || '?')[0].toUpperCase()}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography fontWeight={600}>{c.userName || 'Anonymous'}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {c.messages.filter(m => m.sender === 'user').length} answers •{' '}
                    {new Date(c.updatedAt).toLocaleDateString()}
                  </Typography>
                </Box>
                <Chip
                  label={c.status}
                  size="small"
                  color={c.status === 'active' ? 'success' : 'default'}
                />
              </Box>
            </AccordionSummary>

            <AccordionDetails sx={{ pt: 0, px: 3 }}>
              {c.messages.map((msg, i) => (
                <Box key={i}>
                  <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start', py: 1 }}>
                    <Chip
                      label={msg.sender === 'bot' ? 'Bot' : 'User'}
                      size="small"
                      color={msg.sender === 'bot' ? 'primary' : 'success'}
                      sx={{ mt: 0.2, minWidth: 44 }}
                    />
                    <Typography variant="body2" sx={{ pt: 0.3, lineHeight: 1.6 }}>
                      {msg.text || <em style={{ color: '#bbb' }}>empty</em>}
                    </Typography>
                  </Box>
                  {i < c.messages.length - 1 && <Divider />}
                </Box>
              ))}
            </AccordionDetails>
          </Accordion>
        ))
      )}
    </Box>
  );
};

export default Answers;
