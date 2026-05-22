import React from 'react';
import { Box, Typography } from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';

const Partners = () => (
  <Box sx={{ p: 3, minHeight: 'calc(100vh - 60px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
    <GroupIcon sx={{ fontSize: 64, color: '#d1d5db', mb: 2 }} />
    <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>Partners</Typography>
    <Typography sx={{ color: '#9ca3af' }}>Coming soon</Typography>
  </Box>
);

export default Partners;
