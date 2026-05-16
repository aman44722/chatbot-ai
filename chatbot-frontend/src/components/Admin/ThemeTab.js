// src/components/Admin/ThemeTab.js
import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';

const ThemeTab = () => {
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [textColor, setTextColor] = useState('#000000');

  const handleSave = () => {
    // Save the theme settings (you can connect this with your backend)
    // console.log('Theme Saved:', { backgroundColor, textColor });
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h6" gutterBottom>Customize Chat Theme</Typography>

      <TextField
        label="Background Color"
        variant="outlined"
        fullWidth
        value={backgroundColor}
        onChange={(e) => setBackgroundColor(e.target.value)}
        sx={{ mb: 2 }}
      />

      <TextField
        label="Text Color"
        variant="outlined"
        fullWidth
        value={textColor}
        onChange={(e) => setTextColor(e.target.value)}
        sx={{ mb: 2 }}
      />

      <Button variant="contained" onClick={handleSave}>Save Theme</Button>
    </Box>
  );
};

export default ThemeTab;
