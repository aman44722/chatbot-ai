import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, IconButton,
  Chip, CircularProgress, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import { getBots, createBot, deleteBot } from '../api/botApi';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

const Bots = () => {
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

  const handleEdit = (botId) => {
    localStorage.setItem('selectedBotId', botId);
    navigate('/app/setup');
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
        <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ background: '#f8faff' }}>
                <TableCell sx={{ fontWeight: 600 }}>Bot Name</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Created</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Updated</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bots.map((bot) => (
                <TableRow key={bot._id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <SmartToyIcon sx={{ color: '#6366f1', fontSize: 20 }} />
                      <Typography sx={{ fontWeight: 500 }}>{bot.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={bot.status}
                      size="small"
                      color={bot.status === 'active' ? 'success' : 'default'}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>{new Date(bot.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(bot.updatedAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Tooltip title="Edit Bot">
                      <IconButton onClick={() => handleEdit(bot._id)} size="small" sx={{ color: '#6366f1' }}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Bot">
                      <IconButton onClick={() => handleDelete(bot._id, bot.name)} size="small" sx={{ color: '#ef4444' }}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Create Bot Dialog */}
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

export default Bots;
