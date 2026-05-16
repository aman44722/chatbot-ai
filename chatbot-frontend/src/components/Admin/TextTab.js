// src/components/Admin/TextTab.js
import React, { useState } from 'react';
import { TextField, Typography, Box, Button } from '@mui/material';

const TextTab = () => {
  const [botName, setBotName] = useState('Chatbot');
  const [welcomeText, setWelcomeText] = useState('Hey there! How can I help you today?');
  const [fontSize, setFontSize] = useState('14px');

  const handleSave = () => {
    // Save the settings (you can connect this with your backend)
    // console.log('Settings Saved:', { botName, welcomeText, fontSize });
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h6" gutterBottom>Customize Bot Text</Typography>

      <TextField
        label="Bot Name"
        variant="outlined"
        fullWidth
        value={botName}
        onChange={(e) => setBotName(e.target.value)}
        sx={{ mb: 2 }}
      />

      <TextField
        label="Welcome Text"
        variant="outlined"
        fullWidth
        value={welcomeText}
        onChange={(e) => setWelcomeText(e.target.value)}
        sx={{ mb: 2 }}
      />

      <TextField
        label="Font Size"
        variant="outlined"
        fullWidth
        value={fontSize}
        onChange={(e) => setFontSize(e.target.value)}
        sx={{ mb: 2 }}
      />

      <Button variant="contained" onClick={handleSave}>Save Settings</Button>
    </Box>
  );
};

export default TextTab;
