import React from 'react';
import { Box, Typography } from '@mui/material';
import WidgetsIcon from '@mui/icons-material/Widgets';

const Templates = () => (
  <Box sx={{ p: 3, background: '#F6F9FF', minHeight: 'calc(100vh - 60px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
    <WidgetsIcon sx={{ fontSize: 64, color: '#d1d5db', mb: 2 }} />
    <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>Templates</Typography>
    <Typography sx={{ color: '#9ca3af' }}>Coming soon</Typography>
  </Box>
);

export default Templates;
