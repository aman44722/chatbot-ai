import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Box, TextField, Button, Typography, CircularProgress, Avatar, Divider } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ReplayIcon from '@mui/icons-material/Replay';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const AUTH_API = process.env.REACT_APP_AUTH_API || 'http://localhost:5000/api/auth';
const CONV_API = AUTH_API.replace('/api/auth', '/api/conversation');
const SESSION_ID = 'sess_' + Math.random().toString(36).slice(2) + Date.now();

const UserMessage = () => {
  const { chatId } = useParams();
  const [botSettings, setBotSettings] = useState({});
  const [flow, setFlow] = useState([]);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [done, setDone] = useState(false);
  const [liveRequested, setLiveRequested] = useState(false);
  const [liveLoading, setLiveLoading] = useState(false);
  const [chatClosed, setChatClosed] = useState(false);
  const [reopening, setReopening] = useState(false);

  // Pre-chat state
  const [preChatDone, setPreChatDone] = useState(false);
  const [userName, setUserName] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [nameError, setNameError] = useState('');
  const [startingChat, setStartingChat] = useState(false);

  const chatBodyRef = useRef(null);
  const initializedRef = useRef(false);
  const nameInputRef = useRef(null);
  const livePollingRef = useRef(null);
  const statusPollingRef = useRef(null);

  // Load bot settings on mount
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const loadSettings = async () => {
      try {
        const res = await axios.get(`${AUTH_API}/user/${chatId}`);
        const user = res.data;
        setBotSettings(user.botSettings || {});
        setFlow(user.flowSetupSetting?.question?.list || []);
      } catch (err) {
        console.error('Widget load error:', err);
        setBotSettings({});
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, [chatId]);

  // Auto-scroll to latest message
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  // Focus name input on pre-chat screen
  useEffect(() => {
    if (!loading && !preChatDone && nameInputRef.current) {
      setTimeout(() => nameInputRef.current?.focus(), 300);
    }
  }, [loading, preChatDone]);

  // Poll status when chat is active (not live) — detect if admin closed the chat
  useEffect(() => {
    if (statusPollingRef.current) clearInterval(statusPollingRef.current);
    if (!preChatDone || liveRequested || chatClosed) return;

    statusPollingRef.current = setInterval(async () => {
      try {
        const res = await axios.get(`${CONV_API}/session/${chatId}/${SESSION_ID}`);
        if (res.data.ok && res.data.status === 'closed') {
          setChatClosed(true);
          setMessages(prev => [...prev, {
            sender: 'bot',
            text: '🔒 This conversation has been closed by the support team.',
          }]);
        }
      } catch { /* silent */ }
    }, 8000);

    return () => clearInterval(statusPollingRef.current);
  }, [preChatDone, liveRequested, chatClosed, chatId]);

  // Cleanup all polling on unmount
  useEffect(() => {
    return () => {
      if (livePollingRef.current) clearInterval(livePollingRef.current);
      if (statusPollingRef.current) clearInterval(statusPollingRef.current);
    };
  }, []);

  const pushMessage = useCallback((sender, msgText, questionId = null) => {
    setMessages(prev => [...prev, { sender, text: msgText, questionId }]);
    axios.post(`${CONV_API}/message`, {
      chatbotId: chatId,
      sessionId: SESSION_ID,
      sender,
      text: msgText,
      questionId,
    }).catch(console.error);
  }, [chatId]);

  const handleStartChat = async () => {
    const name = nameInput.trim();
    if (!name) {
      setNameError('Please enter your name to continue.');
      return;
    }
    setNameError('');
    setStartingChat(true);

    try {
      await axios.post(`${CONV_API}/init`, {
        chatbotId: chatId,
        sessionId: SESSION_ID,
        flow,
        userName: name,
      });

      setUserName(name);
      setPreChatDone(true);

      const welcome = botSettings.welcomeText || `Hi ${name}! How can I help you?`;
      setMessages([{ sender: 'bot', text: welcome }]);

      if (flow.length > 0) {
        setTimeout(() => {
          setMessages(prev => [...prev, { sender: 'bot', text: flow[0].text, questionId: flow[0].id }]);
        }, 700);
      }
    } catch (err) {
      console.error('Chat start error:', err);
      setNameError('Something went wrong. Please try again.');
    } finally {
      setStartingChat(false);
    }
  };

  const handleRequestLive = async () => {
    setLiveLoading(true);
    try {
      await axios.post(`${CONV_API}/request-live`, {
        chatbotId: chatId,
        sessionId: SESSION_ID,
      });
      setLiveRequested(true);
      setMessages(prev => [...prev, {
        sender: 'bot',
        text: "✅ A live agent has been notified. We'll connect you shortly!",
      }]);

      // Poll for admin messages — also detects closure
      livePollingRef.current = setInterval(async () => {
        try {
          const res = await axios.get(`${CONV_API}/session/${chatId}/${SESSION_ID}`);
          if (res.data.ok) {
            // Admin closed the chat
            if (res.data.status === 'closed') {
              setChatClosed(true);
              setMessages(prev => [...prev, {
                sender: 'bot',
                text: '🔒 This conversation has been closed by the support team.',
              }]);
              clearInterval(livePollingRef.current);
              return;
            }

            // Append only new admin messages
            const adminMsgs = res.data.messages.filter(m => m.sender === 'admin');
            setMessages(prev => {
              const existingAdminCount = prev.filter(m => m.sender === 'admin').length;
              const newAdminMsgs = adminMsgs.slice(existingAdminCount);
              if (newAdminMsgs.length === 0) return prev;
              return [...prev, ...newAdminMsgs];
            });
          }
        } catch { /* silent */ }
      }, 4000);
    } catch (err) {
      console.error('Live request error:', err);
    } finally {
      setLiveLoading(false);
    }
  };

  const handleReopen = async () => {
    setReopening(true);
    try {
      await axios.post(`${CONV_API}/reopen`, {
        chatbotId: chatId,
        sessionId: SESSION_ID,
      });
      setChatClosed(false);
      setLiveRequested(false);
      if (livePollingRef.current) clearInterval(livePollingRef.current);
      setMessages(prev => [...prev, {
        sender: 'bot',
        text: '✅ Chat has been reopened. Feel free to connect with a live agent again.',
      }]);
    } catch (err) {
      console.error('Reopen error:', err);
    } finally {
      setReopening(false);
    }
  };

  const handleSend = async () => {
    if (!text.trim()) return;
    const userText = text.trim();
    setText('');

    // Live mode — user replying to admin
    if (liveRequested && !chatClosed) {
      setMessages(prev => [...prev, { sender: 'user', text: userText }]);
      axios.post(`${CONV_API}/message`, {
        chatbotId: chatId,
        sessionId: SESSION_ID,
        sender: 'user',
        text: userText,
      }).catch(console.error);
      return;
    }

    if (done) return;

    const currentQ = flow[step];
    pushMessage('user', userText, currentQ?.id);

    const nextStep = step + 1;
    setStep(nextStep);

    if (nextStep < flow.length) {
      setTimeout(() => {
        const nextQ = flow[nextStep];
        setMessages(prev => [...prev, { sender: 'bot', text: nextQ.text, questionId: nextQ.id }]);
      }, 600);
    } else {
      setTimeout(() => {
        setMessages(prev => [...prev, { sender: 'bot', text: "Thank you! We'll get back to you soon." }]);
        setDone(true);
      }, 600);
    }
  };

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <CircularProgress />
    </Box>
  );

  const colors = botSettings.themeColors || {};
  const headerColor = colors.header || '#006C74';
  const answerColor = colors.answer || '#007bff';
  const questionColor = colors.question || '#ffffff';
  const chatBg = colors.chatBackground || '#f5f5f5';
  const isLightQuestion = questionColor === '#ffffff' || questionColor === '#fff';

  return (
    <Box sx={{
      maxWidth: 480, mx: 'auto', mt: 4,
      borderRadius: 3, overflow: 'hidden',
      boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
      fontFamily: botSettings.font || 'inherit',
    }}>
      {/* Header */}
      <Box sx={{ bgcolor: headerColor, color: '#fff', p: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        {botSettings.companyLogo ? (
          <img
            src={botSettings.companyLogo}
            alt="logo"
            style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }}
          />
        ) : (
          <Avatar sx={{ width: 40, height: 40, bgcolor: 'rgba(255,255,255,0.2)', fontSize: 18, fontWeight: 700 }}>
            {(botSettings.botName || 'C')[0].toUpperCase()}
          </Avatar>
        )}
        <Box>
          <Typography fontWeight={700} fontSize={15}>{botSettings.botName || 'Chatbot'}</Typography>
          {botSettings.description && (
            <Typography variant="caption" sx={{ opacity: 0.85 }}>{botSettings.description}</Typography>
          )}
        </Box>
        {preChatDone && userName && (
          <Box sx={{ ml: 'auto', textAlign: 'right' }}>
            <Typography variant="caption" sx={{ opacity: 0.75, fontSize: 11 }}>Chatting as</Typography>
            <Typography fontSize={13} fontWeight={600}>{userName}</Typography>
          </Box>
        )}
      </Box>

      {/* ─── PRE-CHAT SCREEN ─── */}
      {!preChatDone ? (
        <Box sx={{ bgcolor: chatBg, p: 3, minHeight: 380, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Avatar sx={{ width: 64, height: 64, mx: 'auto', mb: 2, bgcolor: headerColor, fontSize: 28, fontWeight: 700 }}>
              {(botSettings.botName || 'C')[0].toUpperCase()}
            </Avatar>
            <Typography fontWeight={700} fontSize={18} mb={0.5}>
              {botSettings.botName || 'Chat with us'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {botSettings.description || 'We usually reply instantly'}
            </Typography>
          </Box>

          <Box sx={{ bgcolor: '#fff', borderRadius: 2.5, p: 2.5, boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
            <Typography fontWeight={600} fontSize={14} mb={1.5}>
              Before we start, what's your name?
            </Typography>
            <TextField
              inputRef={nameInputRef}
              fullWidth
              size="small"
              placeholder="Enter your name..."
              value={nameInput}
              onChange={e => { setNameInput(e.target.value); setNameError(''); }}
              onKeyDown={e => e.key === 'Enter' && handleStartChat()}
              error={!!nameError}
              helperText={nameError}
              sx={{ mb: 1.5, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
            <Button
              fullWidth
              variant="contained"
              onClick={handleStartChat}
              disabled={startingChat || !nameInput.trim()}
              endIcon={startingChat ? <CircularProgress size={16} color="inherit" /> : <ArrowForwardIcon />}
              sx={{
                borderRadius: 2, py: 1.2, fontWeight: 700, fontSize: 14,
                bgcolor: headerColor, '&:hover': { bgcolor: headerColor, filter: 'brightness(0.9)' },
                textTransform: 'none',
              }}
            >
              {startingChat ? 'Starting...' : 'Start Chat'}
            </Button>
          </Box>
        </Box>
      ) : (
        <>
          {/* Messages */}
          <Box
            ref={chatBodyRef}
            sx={{ height: 380, overflowY: 'auto', p: 2, bgcolor: chatBg }}
          >
            {messages.map((msg, i) => (
              <Box
                key={i}
                sx={{
                  display: 'flex',
                  justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  mb: 1.5,
                }}
              >
                {msg.sender === 'admin' && (
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', maxWidth: '75%' }}>
                    <Typography variant="caption" sx={{ fontSize: 10, color: '#e65100', fontWeight: 700, mb: 0.3, px: 1 }}>Support Agent</Typography>
                    <Box sx={{ px: 2, py: 1, borderRadius: '18px 18px 18px 4px', bgcolor: '#fff3e0', border: '1px solid #ffcc80', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
                      <Typography variant="body2" sx={{ lineHeight: 1.5, color: '#bf360c' }}>{msg.text}</Typography>
                    </Box>
                  </Box>
                )}
                {msg.sender !== 'admin' && (
                  <Box sx={{
                    maxWidth: '75%', px: 2, py: 1,
                    borderRadius: msg.sender === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    bgcolor: msg.sender === 'user' ? answerColor : questionColor,
                    color: msg.sender === 'user' ? '#fff' : (isLightQuestion ? '#222' : '#fff'),
                    boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                    border: isLightQuestion && msg.sender === 'bot' ? '1px solid #e0e0e0' : 'none',
                  }}>
                    <Typography variant="body2" sx={{ lineHeight: 1.5 }}>{msg.text}</Typography>
                  </Box>
                )}
              </Box>
            ))}
          </Box>

          {/* ─── CHAT CLOSED STATE ─── */}
          {chatClosed ? (
            <Box sx={{ px: 2, pb: 2, pt: 1.5, bgcolor: '#fff' }}>
              <Divider sx={{ mb: 1.5 }} />
              <Box sx={{ p: 2, bgcolor: '#fafafa', borderRadius: 2.5, border: '1px solid #e0e0e0', textAlign: 'center' }}>
                <LockOutlinedIcon sx={{ fontSize: 28, color: '#bbb', mb: 0.5 }} />
                <Typography fontSize={13} fontWeight={700} color="text.secondary" mb={0.5}>
                  Conversation Closed
                </Typography>
                <Typography fontSize={12} color="text.secondary" mb={1.5}>
                  This chat has been closed by the support team.
                </Typography>
                <Button
                  fullWidth
                  variant="outlined"
                  size="small"
                  startIcon={reopening ? <CircularProgress size={14} color="inherit" /> : <ReplayIcon />}
                  onClick={handleReopen}
                  disabled={reopening}
                  sx={{
                    borderRadius: 2, textTransform: 'none', fontWeight: 700, fontSize: 13,
                    borderColor: headerColor, color: headerColor,
                    '&:hover': { bgcolor: `${headerColor}11`, borderColor: headerColor },
                  }}
                >
                  {reopening ? 'Reopening...' : 'Reopen Chat'}
                </Button>
              </Box>
            </Box>
          ) : (
            <>
              {/* Live Agent Card — shows after flow is done */}
              {done && (
                <Box sx={{ px: 2, pb: 1.5, bgcolor: '#fff' }}>
                  <Divider sx={{ mb: 1.5 }} />
                  {liveRequested ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5, bgcolor: '#e8f5e9', borderRadius: 2 }}>
                      <CheckCircleOutlineIcon sx={{ color: '#2e7d32', fontSize: 22 }} />
                      <Box>
                        <Typography fontSize={13} fontWeight={700} color="#2e7d32">Agent Notified!</Typography>
                        <Typography fontSize={12} color="text.secondary">We'll connect you shortly.</Typography>
                      </Box>
                    </Box>
                  ) : (
                    <Box sx={{ p: 1.5, bgcolor: '#f4f6fb', borderRadius: 2 }}>
                      <Typography fontSize={12} color="text.secondary" mb={1}>
                        Need more help? Connect with a live agent.
                      </Typography>
                      <Button
                        fullWidth
                        variant="contained"
                        size="small"
                        startIcon={liveLoading ? <CircularProgress size={14} color="inherit" /> : <SupportAgentIcon fontSize="small" />}
                        onClick={handleRequestLive}
                        disabled={liveLoading}
                        sx={{
                          borderRadius: 2, textTransform: 'none', fontWeight: 700, fontSize: 13,
                          bgcolor: headerColor, '&:hover': { bgcolor: headerColor, filter: 'brightness(0.9)' },
                        }}
                      >
                        {liveLoading ? 'Requesting...' : 'Chat with Live Agent'}
                      </Button>
                    </Box>
                  )}
                </Box>
              )}

              {/* Input */}
              <Box sx={{ p: 1.5, borderTop: liveRequested ? '2px solid #e65100' : '1px solid #eee', bgcolor: '#fff', display: 'flex', gap: 1 }}>
                <TextField
                  fullWidth
                  size="small"
                  value={text}
                  placeholder={liveRequested ? 'Reply to agent...' : done ? 'Flow complete ✓' : 'Type your answer...'}
                  onChange={e => setText(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
                  disabled={done && !liveRequested}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                />
                <Button
                  variant="contained"
                  onClick={handleSend}
                  disabled={(done && !liveRequested) || !text.trim()}
                  sx={{ borderRadius: 3, minWidth: 44, px: 1.5, bgcolor: liveRequested ? '#e65100' : headerColor, '&:hover': { bgcolor: liveRequested ? '#bf360c' : headerColor } }}
                >
                  <SendIcon fontSize="small" />
                </Button>
              </Box>
            </>
          )}
        </>
      )}
    </Box>
  );
};

export default UserMessage;
