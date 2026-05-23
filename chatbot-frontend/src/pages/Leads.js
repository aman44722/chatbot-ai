import React, { useEffect, useState } from 'react';
import {
  Box, Paper, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Chip, TextField, InputAdornment, CircularProgress,
  Avatar, Button
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DownloadIcon from '@mui/icons-material/Download';
import { fetchConversations } from '../api/conversationApi';

const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
const phoneRegex = /^[\+]?[\d\s\-]{10,15}$/;

const extractContact = (messages = []) => {
  let email = null;
  let phone = null;
  for (const msg of messages) {
    if (msg.sender !== 'user') continue;
    const text = (msg.text || '').trim();
    if (!email && emailRegex.test(text)) email = text.match(emailRegex)[0];
    if (!phone && phoneRegex.test(text)) phone = text;
  }
  return { email, phone };
};

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const botId = localStorage.getItem('selectedBotId');

  useEffect(() => {
    setLoading(true);
    fetchConversations(1, 50, botId)
      .then((convos) => {
        const extracted = convos.map(c => {
          const { email, phone } = extractContact(c.messages);
          return {
            _id: c._id,
            name: c.userName || 'Anonymous',
            email,
            phone,
            date: c.updatedAt,
            msgCount: c.messages?.length || 0,
            status: c.status,
          };
        });
        setLeads(extracted);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [botId]);

  const filtered = leads.filter(l =>
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    (l.email || '').toLowerCase().includes(search.toLowerCase()) ||
    (l.phone || '').includes(search)
  );

  const downloadCSV = () => {
    const header = 'Name,Email,Phone,Messages,Date\n';
    const rows = filtered.map(l =>
      `${l.name},${l.email || ''},${l.phone || ''},${l.msgCount},${new Date(l.date).toLocaleDateString()}`
    ).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'leads.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
      <CircularProgress />
    </Box>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h5" fontWeight={700}>Leads</Typography>
          <Typography color="text.secondary">{leads.length} total leads captured</Typography>
        </Box>
        <Button variant="outlined" startIcon={<DownloadIcon />} onClick={downloadCSV}>
          Export CSV
        </Button>
      </Box>

      <TextField
        placeholder="Search by name, email or phone..."
        size="small"
        fullWidth
        sx={{ mb: 3 }}
        value={search}
        onChange={e => setSearch(e.target.value)}
        InputProps={{
          startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>
        }}
      />

      <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 3 }}>
        <Table>
          <TableHead sx={{ bgcolor: '#f5f7ff' }}>
            <TableRow>
              <TableCell><b>Name</b></TableCell>
              <TableCell><b>Email</b></TableCell>
              <TableCell><b>Phone</b></TableCell>
              <TableCell><b>Messages</b></TableCell>
              <TableCell><b>Date</b></TableCell>
              <TableCell><b>Status</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography color="text.secondary" py={5}>
                    No leads yet. Leads appear here when users interact with your chatbot.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((lead) => (
                <TableRow key={lead._id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar sx={{ width: 32, height: 32, fontSize: 14, bgcolor: lead.name === 'Anonymous' ? '#9e9e9e' : '#f57c00' }}>
                        {lead.name[0].toUpperCase()}
                      </Avatar>
                      <Typography variant="body2" fontWeight={500}>{lead.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{lead.email || <span style={{ color: '#bbb' }}>—</span>}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{lead.phone || <span style={{ color: '#bbb' }}>—</span>}</Typography>
                  </TableCell>
                  <TableCell>{lead.msgCount}</TableCell>
                  <TableCell>
                    <Typography variant="body2">{new Date(lead.date).toLocaleDateString()}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={lead.status} size="small" color={lead.status === 'active' ? 'success' : 'default'} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Leads;
