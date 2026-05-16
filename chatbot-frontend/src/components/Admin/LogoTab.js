// src/components/Admin/LogoTab.js
import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';

const LogoTab = () => {
  const [logo, setLogo] = useState('');

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogo(URL.createObjectURL(file));
    }
  };

  const handleSave = () => {
    // Save the settings (you can connect this with your backend)
    // console.log('Logo Saved:', logo);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h6" gutterBottom>Upload Logo</Typography>

      <TextField
        label="Logo URL"
        variant="outlined"
        fullWidth
        value={logo}
        onChange={(e) => setLogo(e.target.value)}
        sx={{ mb: 2 }}
      />

      <Box sx={{ mb: 2 }}>
        <input type="file" accept="image/*" onChange={handleLogoUpload} />
      </Box>

      {logo && <img src={logo} alt="Chatbot Logo" style={{ maxWidth: '200px' }} />}

      <Button variant="contained" onClick={handleSave}>Save Logo</Button>
    </Box>
  );
};

export default LogoTab;
