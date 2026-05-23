import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Button, Paper, CircularProgress, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Switch, IconButton, Grid,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SettingsIcon from '@mui/icons-material/Settings';
import SwapCallsIcon from '@mui/icons-material/SwapCalls';
import DownloadIcon from '@mui/icons-material/Download';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import ChatIcon from '@mui/icons-material/Chat';
import BarChartIcon from '@mui/icons-material/BarChart';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { getBots, createBot, deleteBot, updateBot } from '../api/botApi';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import DeleteBotDialog from '../components/Common/DeleteBotDialog';

const iconMap = {
  setup: <SettingsIcon sx={{ fontSize: 18 }} />,
  flow: <SwapCallsIcon sx={{ fontSize: 18 }} />,
  install: <DownloadIcon sx={{ fontSize: 18 }} />,
  chats: <ChatIcon sx={{ fontSize: 18 }} />,
  analytics: <BarChartIcon sx={{ fontSize: 18 }} />,
};

const actions = [
  { key: 'setup', label: 'Setup', tab: 'setup' },
  { key: 'flow', label: 'Flow', tab: 'flow-setup' },
  { key: 'install', label: 'Install', tab: 'install' },
  { key: 'chats', label: 'Chats', tab: 'conversations' },
  { key: 'analytics', label: 'Analytics', tab: 'analytics' },
];

const Bots = () => {
  const [bots, setBots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openCreate, setOpenCreate] = useState(false);
  const [newBotName, setNewBotName] = useState('');
  const [creating, setCreating] = useState(false);
  const [menuOpen, setMenuOpen] = useState(null);
  const [renameBot, setRenameBot] = useState(null);
  const [renameName, setRenameName] = useState('');
  const [renaming, setRenaming] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
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
    setDeleteTarget({ botId, botName });
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteBot(deleteTarget.botId);
      toast.success('Bot deleted');
      setDeleteTarget(null);
      loadBots();
    } catch (err) {
      toast.error(err);
    } finally {
      setDeleting(false);
    }
  };

  const handleToggleStatus = async (bot) => {
    try {
      const newStatus = bot.status === 'active' ? 'inactive' : 'active';
      await updateBot(bot._id, { status: newStatus });
      toast.success(`Bot ${newStatus === 'active' ? 'activated' : 'deactivated'}`);
      loadBots();
    } catch (err) {
      toast.error(err);
    }
  };

  const handleRenameOpen = (bot) => {
    setRenameBot(bot);
    setRenameName(bot.name);
    setMenuOpen(null);
  };

  const handleRename = async () => {
    if (!renameName.trim() || !renameBot) return;
    setRenaming(true);
    try {
      await updateBot(renameBot._id, { name: renameName.trim() });
      toast.success('Bot renamed successfully!');
      setRenameBot(null);
      setRenameName('');
      loadBots();
    } catch (err) {
      toast.error(err);
    } finally {
      setRenaming(false);
    }
  };

  const handleNavigate = (botId, tab) => {
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
    <Box sx={{ p: 3, minHeight: 'calc(100vh - 60px)' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>Bot Manager</Typography>
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
                  '&:hover': { boxShadow: '0 4px 16px rgba(99,102,241,0.12)', transform: 'translateY(-2px)' },
                  opacity: bot.status === 'inactive' ? 0.6 : 1,
                }}
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
                  <Box sx={{ position: 'relative' }}>
                    <IconButton size="small" onClick={() => setMenuOpen(menuOpen === bot._id ? null : bot._id)}>
                      <MoreVertIcon sx={{ fontSize: 18, color: '#6b7280' }} />
                    </IconButton>
                    {menuOpen === bot._id && (
                      <Paper
                        sx={{
                          position: 'absolute', right: 0, top: 32, zIndex: 10,
                          minWidth: 140, borderRadius: 2, boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                        }}
                        onClick={() => setMenuOpen(null)}
                      >
                        <Box
                          sx={{ px: 2, py: 1, cursor: 'pointer', '&:hover': { bgcolor: '#f5f5f5' }, borderRadius: '8px 8px 0 0', display: 'flex', alignItems: 'center', gap: 1 }}
                          onClick={() => handleRenameOpen(bot)}
                        >
                          <EditIcon sx={{ fontSize: 16, color: '#6366f1' }} />
                          <Typography sx={{ fontSize: 13, color: '#374151' }}>Rename</Typography>
                        </Box>
                        <Box
                          sx={{ px: 2, py: 1, cursor: 'pointer', '&:hover': { bgcolor: '#f5f5f5' }, borderRadius: '0 0 8px 8px', display: 'flex', alignItems: 'center', gap: 1 }}
                          onClick={() => handleDelete(bot._id, bot.name)}
                        >
                          <DeleteIcon sx={{ fontSize: 16, color: '#ef4444' }} />
                          <Typography sx={{ fontSize: 13, color: '#ef4444' }}>Delete</Typography>
                        </Box>
                      </Paper>
                    )}
                  </Box>
                </Box>

                <Box sx={{ p: 2, pb: 1 }}>
                  <Grid container spacing={1}>
                    {actions.map((act) => (
                      <Grid item xs={2.4} key={act.key}>
                        <Button
                          fullWidth
                          onClick={() => handleNavigate(bot._id, act.tab)}
                          sx={{
                            flexDirection: 'column', gap: 0.3, textTransform: 'none',
                            borderRadius: 2, py: 0.8, minWidth: 0,
                            color: '#6b7280', fontSize: 10, fontWeight: 500,
                            bgcolor: '#f8faff',
                            '&:hover': { bgcolor: '#eef2ff', color: '#6366f1' },
                          }}
                        >
                          {iconMap[act.key]}
                          {act.label}
                        </Button>
                      </Grid>
                    ))}
                  </Grid>
                </Box>

                <Box sx={{ px: 2, pb: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Switch
                      size="small"
                      checked={bot.status === 'active'}
                      onChange={() => handleToggleStatus(bot)}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': { color: '#6366f1' },
                        '& .MuiSwitch-switchBase.Mui-checked+.MuiSwitch-track': { bgcolor: '#6366f1' },
                      }}
                    />
                    <Typography sx={{ fontSize: 11, color: bot.status === 'active' ? '#6366f1' : '#9ca3af', fontWeight: 500 }}>
                      {bot.status === 'active' ? 'Active' : 'Inactive'}
                    </Typography>
                  </Box>
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(bot._id, bot.name)}
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

      <Dialog open={!!renameBot} onClose={() => setRenameBot(null)} maxWidth="sm" fullWidth>
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
          <Button onClick={() => setRenameBot(null)} sx={{ textTransform: 'none', color: '#6b7280' }}>
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

      <DeleteBotDialog
        open={!!deleteTarget}
        botName={deleteTarget?.botName}
        deleting={deleting}
        onClose={() => { if (!deleting) setDeleteTarget(null); }}
        onConfirm={confirmDelete}
      />
    </Box>
  );
};

export default Bots;
