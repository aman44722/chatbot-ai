import React from 'react';
import { Box, Typography } from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';

const Referral = () => (
  <Box sx={{ p: 3, background: '#F6F9FF', minHeight: 'calc(100vh - 60px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
    <ShareIcon sx={{ fontSize: 64, color: '#d1d5db', mb: 2 }} />
    <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>Referral</Typography>
    <Typography sx={{ color: '#9ca3af' }}>Coming soon</Typography>
  </Box>
);

export default Referral;
