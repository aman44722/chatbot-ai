// src/components/Admin/ChatMessageEditor.js (or UserMessage.js)
import React, { useState } from 'react';
import { Box, Typography, Button, TextField, FormControlLabel, Checkbox, Paper } from '@mui/material';

const ChatMessageEditor = () => {
  const [message, setMessage] = useState('');
  const [userMessage, setUserMessage] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('+91-7207897336');
  const [selectedOption, setSelectedOption] = useState('');
  const [options] = useState(['Option 1', 'Option 2']);
  
  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const handleUserMessageChange = (event) => {
    setUserMessage(event.target.value);
  };

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleConfirm = () => {
    alert(`Option selected: ${selectedOption}`);
  };

  return (
    <Paper sx={{ padding: 3 }}>
      {/* Chatbot Question */}
      <Box sx={{ marginBottom: 2, display: 'flex', alignItems: 'center' }}>
        <Box sx={{ backgroundColor: '#d1e7dd', padding: 2, borderRadius: 2, maxWidth: '70%' }}>
          <Typography variant="body1">Bot question here</Typography>
        </Box>
      </Box>

      {/* User Answer */}
      <Box sx={{ marginBottom: 2, display: 'flex', alignItems: 'center' }}>
        <Box sx={{ backgroundColor: '#e8f5e9', padding: 2, borderRadius: 2, maxWidth: '70%' }}>
          <Typography variant="body1">{userMessage || 'Visitor answer here'}</Typography>
        </Box>
      </Box>

      {/* Visitor Phone Number */}
      <Box sx={{ marginBottom: 2, display: 'flex', alignItems: 'center' }}>
        <Box sx={{ backgroundColor: '#e8f5e9', padding: 2, borderRadius: 2, maxWidth: '70%' }}>
          <Typography variant="body1">{phoneNumber}</Typography>
        </Box>
      </Box>

      {/* Sample Options */}
      <Box sx={{ marginBottom: 2 }}>
        <Typography variant="body2">Sample options and button will look like this</Typography>
        {options.map((option, idx) => (
          <FormControlLabel
            key={idx}
            control={
              <Checkbox
                value={option}
                checked={selectedOption === option}
                onChange={handleOptionChange}
                color="primary"
              />
            }
            label={option}
          />
        ))}
      </Box>

      {/* Confirm Button */}
      <Box sx={{ marginTop: 2 }}>
        <Button variant="contained" color="primary" onClick={handleConfirm}>
          Confirm
        </Button>
      </Box>
    </Paper>
  );
};

export default ChatMessageEditor;
