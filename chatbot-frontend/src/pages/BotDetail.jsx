import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Typography, Button, Paper, Switch, CircularProgress, TextField, Dialog, DialogTitle, DialogContent, DialogActions, IconButton,
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import SwapCallsIcon from '@mui/icons-material/SwapCalls';
import DownloadIcon from '@mui/icons-material/Download';
import ChatIcon from '@mui/icons-material/Chat';
import BarChartIcon from '@mui/icons-material/BarChart';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import EditIcon from '@mui/icons-material/Edit';
import { getBotById, updateBot, deleteBot } from '../api/botApi';
import { toast, ToastContainer } from 'react-toastify';

const actions = [
  { key: 'setup', label: 'Setup', icon: <SettingsIcon />, path: '/app/setup' },
  { key: 'flow', label: 'Flow', icon: <SwapCallsIcon />, path: '/app/flow-setup' },
  { key: 'install', label: 'Install', icon: <DownloadIcon />, path: '/app/install' },
  { key: 'chats', label: 'Chats', icon: <ChatIcon />, path: '/app/conversations' },
  { key: 'analytics', label: 'Analytics', icon: <BarChartIcon />, path: '/app/analytics' },
];

const BotDetail = () => {
  const { botId } = useParams();
  const navigate = useNavigate();
  const [bot, setBot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [renameOpen, setRenameOpen] = useState(false);
  const [renameName, setRenameName] = useState('');
  const [renaming, setRenaming] = useState(false);

  useEffect(() => {
    if (botId) {
      localStorage.setItem('selectedBotId', botId);
      getBotById(botId)
        .then(setBot)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [botId]);

  const handleToggleStatus = async () => {
    try {
      const newStatus = bot.status === 'active' ? 'inactive' : 'active';
      await updateBot(botId, { status: newStatus });
      setBot({ ...bot, status: newStatus });
      toast.success(`Bot ${newStatus === 'active' ? 'activated' : 'deactivated'}`);
    } catch (err) {
      toast.error(err);
    }
  };

  const handleRenameOpen = () => {
    setRenameName(bot.name);
    setRenameOpen(true);
  };

  const handleRename = async () => {
    if (!renameName.trim()) return;
    setRenaming(true);
    try {
      const res = await updateBot(botId, { name: renameName.trim() });
      setBot(res.bot || { ...bot, name: renameName.trim() });
      toast.success('Bot renamed successfully!');
      setRenameOpen(false);
    } catch (err) {
      toast.error(err);
    } finally {
      setRenaming(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${bot.name}"? This action cannot be undone.`)) return;
    try {
      await deleteBot(botId);
      toast.success('Bot deleted');
      navigate('/app/dashboard');
    } catch (err) {
      toast.error(err);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!bot) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Bot not found</Typography>
        <Button onClick={() => navigate('/app/dashboard')}>Back to Dashboard</Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, minHeight: 'calc(100vh - 60px)' }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/app/dashboard')}
        sx={{ mb: 2, textTransform: 'none', color: '#6366f1' }}
      >
        Back to Dashboard
      </Button>

      <Paper sx={{ p: 3, borderRadius: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              width: 56, height: 56, borderRadius: '14px',
              background: bot.status === 'active'
                ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                : '#e5e7eb',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <SmartToyIcon sx={{ color: '#fff', fontSize: 30 }} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>{bot.name}</Typography>
              <IconButton size="small" onClick={handleRenameOpen} sx={{ color: '#9ca3af', '&:hover': { color: '#6366f1' } }}>
                <EditIcon fontSize="small" />
              </IconButton>
            </Box>
            <Typography sx={{ color: '#9ca3af' }}>
              Created {new Date(bot.createdAt).toLocaleDateString()}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography sx={{ fontSize: 13, color: bot.status === 'active' ? '#6366f1' : '#9ca3af', fontWeight: 500 }}>
              {bot.status === 'active' ? 'Active' : 'Inactive'}
            </Typography>
            <Switch
              checked={bot.status === 'active'}
              onChange={handleToggleStatus}
              sx={{
                '& .MuiSwitch-switchBase.Mui-checked': { color: '#6366f1' },
                '& .MuiSwitch-switchBase.Mui-checked+.MuiSwitch-track': { bgcolor: '#6366f1' },
              }}
            />
            <Button
              variant="outlined"
              color="error"
              onClick={handleDelete}
              sx={{ ml: 2, textTransform: 'none', borderRadius: 2 }}
            >
              Delete
            </Button>
          </Box>
        </Box>
      </Paper>

      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Bot Actions</Typography>
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        {actions.map((act) => (
          <Paper
            key={act.key}
            sx={{
              p: 3, borderRadius: 3, cursor: 'pointer', flex: '1 1 140px',
              textAlign: 'center', transition: 'all 0.2s',
              '&:hover': { boxShadow: '0 4px 16px rgba(99,102,241,0.15)', transform: 'translateY(-2px)' },
            }}
            onClick={() => navigate(act.path)}
          >
            <Box sx={{ color: '#6366f1', mb: 1 }}>{act.icon}</Box>
            <Typography sx={{ fontWeight: 600, fontSize: 14 }}>{act.label}</Typography>
          </Paper>
        ))}
      </Box>

      <Dialog open={renameOpen} onClose={() => setRenameOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Rename Bot</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label="Bot Name"
            value={renameName}
            onChange={(e) => setRenameName(e.target.value)}
            sx={{ mt: 1 }}
            placeholder="Enter new bot name"
            onKeyDown={(e) => e.key === 'Enter' && handleRename()}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={() => setRenameOpen(false)} sx={{ textTransform: 'none', color: '#6b7280' }}>
            Cancel
          </Button>
          <Button
            onClick={handleRename}
            variant="contained"
            disabled={!renameName.trim() || renaming}
            sx={{ textTransform: 'none', borderRadius: 2, bgcolor: '#6366f1' }}
          >
            {renaming ? 'Renaming...' : 'Rename'}
          </Button>
        </DialogActions>
      </Dialog>

      <ToastContainer />
    </Box>
  );
};

export default BotDetail;
