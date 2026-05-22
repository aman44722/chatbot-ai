import React from 'react';
import { Box, Typography } from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';

const AIAgents = () => (
  <Box sx={{ p: 3, background: '#F6F9FF', minHeight: 'calc(100vh - 60px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
    <SmartToyIcon sx={{ fontSize: 64, color: '#d1d5db', mb: 2 }} />
    <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>AI Agents</Typography>
    <Typography sx={{ color: '#9ca3af' }}>Coming soon</Typography>
  </Box>
);

export default AIAgents;
