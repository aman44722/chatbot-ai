// src/components/Admin/LayoutTab.js
import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';

const LayoutTab = () => {
  const [chatWidth, setChatWidth] = useState('350px');
  const [chatHeight, setChatHeight] = useState('500px');

  const handleSave = () => {
    // Save the layout settings (you can connect this with your backend)
    // console.log('Layout Saved:', { chatWidth, chatHeight });
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h6" gutterBottom>Customize Chat Layout</Typography>

      <TextField
        label="Chat Width"
        variant="outlined"
        fullWidth
        value={chatWidth}
        onChange={(e) => setChatWidth(e.target.value)}
        sx={{ mb: 2 }}
      />

      <TextField
        label="Chat Height"
        variant="outlined"
        fullWidth
        value={chatHeight}
        onChange={(e) => setChatHeight(e.target.value)}
        sx={{ mb: 2 }}
      />

      <Button variant="contained" onClick={handleSave}>Save Layout</Button>
    </Box>
  );
};

export default LayoutTab;
