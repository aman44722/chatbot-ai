import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Button, Paper, CircularProgress, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Grid, IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import { getBots, createBot, deleteBot } from '../api/botApi';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

const Dashboard = () => {
  const [bots, setBots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openCreate, setOpenCreate] = useState(false);
  const [newBotName, setNewBotName] = useState('');
  const [creating, setCreating] = useState(false);
  const navigate = useNavigate();

  const loadBots = async () => {
    try {
      const data = await getBots();
      setBots(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadBots(); }, []);

  const handleCreate = async () => {
    if (!newBotName.trim()) return;
    setCreating(true);
    try {
      await createBot(newBotName.trim());
      toast.success('Bot created successfully!');
      setOpenCreate(false);
      setNewBotName('');
      loadBots();
    } catch (err) {
      toast.error(err);
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (botId, botName) => {
    if (!window.confirm(`Delete "${botName}"? This action cannot be undone.`)) return;
    try {
      await deleteBot(botId);
      toast.success('Bot deleted');
      loadBots();
    } catch (err) {
      toast.error(err);
    }
  };

  const handleBotClick = (botId) => {
    localStorage.setItem('selectedBotId', botId);
    navigate(`/app/bot/${botId}`);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, background: '#F6F9FF', minHeight: 'calc(100vh - 60px)' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>Bot Hub</Typography>
          <Typography variant="subtitle1" sx={{ color: 'gray' }}>
            Create and manage your chatbots
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenCreate(true)}
          sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, bgcolor: '#6366f1' }}
        >
          Create Bot
        </Button>
      </Box>

      {bots.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
          <SmartToyIcon sx={{ fontSize: 64, color: '#d1d5db', mb: 2 }} />
          <Typography variant="h6" sx={{ color: '#9ca3af', mb: 1 }}>No bots yet</Typography>
          <Typography variant="body2" sx={{ color: '#d1d5db', mb: 3 }}>
            Click "Create Bot" to get started
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={2.5}>
          {bots.map((bot) => (
            <Grid item xs={12} sm={6} md={4} key={bot._id}>
              <Paper
                sx={{
                  borderRadius: 3,
                  boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                  transition: 'box-shadow 0.25s, transform 0.2s',
                  cursor: 'pointer',
                  '&:hover': { boxShadow: '0 4px 16px rgba(99,102,241,0.12)', transform: 'translateY(-2px)' },
                  opacity: bot.status === 'inactive' ? 0.6 : 1,
                }}
                onClick={() => handleBotClick(bot._id)}
              >
                <Box sx={{ p: 2, pb: 1, display: 'flex', alignItems: 'center', gap: 1.5, borderBottom: '1px solid #f1f1f1' }}>
                  <Box
                    sx={{
                      width: 40, height: 40, borderRadius: '10px',
                      background: bot.status === 'active'
                        ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                        : '#e5e7eb',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    <SmartToyIcon sx={{ color: '#fff', fontSize: 22 }} />
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography sx={{ fontWeight: 600, fontSize: 14 }}>{bot.name}</Typography>
                    <Typography sx={{ fontSize: 11, color: '#9ca3af' }}>
                      Created {new Date(bot.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ px: 2, pb: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Typography sx={{ fontSize: 11, color: bot.status === 'active' ? '#6366f1' : '#9ca3af', fontWeight: 500 }}>
                      {bot.status === 'active' ? 'Active' : 'Inactive'}
                    </Typography>
                  </Box>
                  <IconButton
                    size="small"
                    onClick={(e) => { e.stopPropagation(); handleDelete(bot._id, bot.name); }}
                    sx={{ color: '#d1d5db', '&:hover': { color: '#ef4444' } }}
                  >
                    <DeleteIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={openCreate} onClose={() => setOpenCreate(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Create New Bot</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label="Bot Name"
            value={newBotName}
            onChange={(e) => setNewBotName(e.target.value)}
            sx={{ mt: 1 }}
            placeholder="Enter bot name"
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={() => setOpenCreate(false)} sx={{ textTransform: 'none', color: '#6b7280' }}>
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            variant="contained"
            disabled={!newBotName.trim() || creating}
            sx={{ textTransform: 'none', borderRadius: 2, bgcolor: '#6366f1' }}
          >
            {creating ? 'Creating...' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      <ToastContainer />
    </Box>
  );
};

export default Dashboard;
