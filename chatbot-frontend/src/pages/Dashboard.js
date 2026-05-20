import React, { useEffect, useState } from 'react';
import {
  Box, Grid, Paper, Typography, List, ListItem, ListItemText,
  Divider, Chip, Avatar, CircularProgress
} from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import PeopleIcon from '@mui/icons-material/People';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { fetchConversations } from '../api/conversationApi';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchConversations()
      .then(setConversations)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const totalChats = conversations.length;
  const totalLeads = conversations.filter(c => c.userName).length;
  const totalUsers = new Set(conversations.map(c => c.sessionId)).size;
  const activeChats = conversations.filter(c => c.status === 'active').length;
  const recentChats = [...conversations]
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 6);
  const namedUsers = conversations.filter(c => c.userName).slice(0, 4);

  const stats = [
    { title: 'Total Chats', value: totalChats, color: '#3ca344', icon: <ChatIcon fontSize="large" /> },
    { title: 'Total Users', value: totalUsers, color: '#1976d2', icon: <PeopleIcon fontSize="large" /> },
    { title: 'Total Leads', value: totalLeads, color: '#f57c00', icon: <AssignmentIndIcon fontSize="large" /> },
    { title: 'Active Now', value: activeChats, color: '#9c27b0', icon: <TrendingUpIcon fontSize="large" /> },
  ];

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
      <CircularProgress />
    </Box>
  );

  return (
    <Box sx={{ background: '#F6F9FF', padding: '20px', borderRadius: '10px' }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
        Welcome, {user?.user?.fullName || 'Admin'} 👋
      </Typography>
      <Typography variant="subtitle1" gutterBottom sx={{ color: 'gray' }}>
        Here's a quick summary of your chatbot performance.
      </Typography>

      <Grid container spacing={3} mt={2}>
        {stats.map((item, i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <Paper elevation={4} sx={{
              p: 3, display: 'flex', alignItems: 'center', gap: 2,
              borderRadius: 3, color: '#fff', backgroundColor: item.color,
              transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.03)' }
            }}>
              <Avatar sx={{ bgcolor: '#fff', color: item.color }}>{item.icon}</Avatar>
              <Box>
                <Typography variant="subtitle2">{item.title}</Typography>
                <Typography variant="h5" fontWeight={700}>{item.value}</Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} mt={3}>
        <Grid item xs={12} md={7}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" gutterBottom>📩 Recent Conversations</Typography>
            {recentChats.length === 0 ? (
              <Typography color="text.secondary" py={2}>
                No conversations yet. Share your chatbot link to get started.
              </Typography>
            ) : (
              <List dense disablePadding>
                {recentChats.map((c, i) => (
                  <React.Fragment key={c._id}>
                    <ListItem
                      button
                      onClick={() => navigate(`/app/conversations/${c._id}`)}
                      sx={{ borderRadius: 2, py: 1.5, '&:hover': { bgcolor: '#f0f4ff' } }}
                    >
                      <Avatar sx={{ mr: 2, bgcolor: '#1976d2', width: 36, height: 36, fontSize: 15 }}>
                        {(c.userName || 'A')[0].toUpperCase()}
                      </Avatar>
                      <ListItemText
                        primary={c.userName || `Anonymous (${c.sessionId.slice(-6)})`}
                        secondary={`${c.messages?.length || 0} messages • ${new Date(c.updatedAt).toLocaleDateString()}`}
                      />
                      <Chip
                        label={c.status}
                        size="small"
                        color={c.status === 'active' ? 'success' : 'default'}
                      />
                    </ListItem>
                    {i < recentChats.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={5}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 3, mb: 2 }}>
            <Typography variant="h6" gutterBottom>📈 Lead Summary</Typography>
            <Typography variant="body1" mb={1}>Total Leads: <b>{totalLeads}</b></Typography>
            <Typography variant="body1" mb={1}>Total Conversations: <b>{totalChats}</b></Typography>
            <Divider sx={{ my: 2 }} />
            <Chip
              label={`Conversion: ${totalChats > 0 ? Math.round((totalLeads / totalChats) * 100) : 0}%`}
              color="success"
              variant="outlined"
            />
          </Paper>

          <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" gutterBottom>👥 Named Users</Typography>
            {namedUsers.length === 0 ? (
              <Typography color="text.secondary" variant="body2" py={1}>
                No named users yet.
              </Typography>
            ) : (
              <List dense disablePadding>
                {namedUsers.map((c, i) => (
                  <ListItem key={i} sx={{ px: 0 }}>
                    <Avatar sx={{ mr: 1.5, width: 30, height: 30, fontSize: 13, bgcolor: '#f57c00' }}>
                      {c.userName[0].toUpperCase()}
                    </Avatar>
                    <ListItemText
                      primary={c.userName}
                      secondary={new Date(c.updatedAt).toLocaleDateString()}
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
