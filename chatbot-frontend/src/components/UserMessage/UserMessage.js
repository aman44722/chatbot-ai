import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Box, TextField, Button, Typography, CircularProgress, Avatar, Divider, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ReplayIcon from '@mui/icons-material/Replay';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const AUTH_API = process.env.REACT_APP_AUTH_API || 'http://localhost:5000/api/auth';
const CONV_API = AUTH_API.replace('/api/auth', '/api/conversation');

const getOrCreateSid = (chatId) => {
  const key = `a2bot_sid_${chatId}`;
  let sid = localStorage.getItem(key);
  if (!sid) {
    sid = 'sess_' + Math.random().toString(36).slice(2) + Date.now();
    localStorage.setItem(key, sid);
  }
  return sid;
};
const saveState = (chatId, state) => {
  try { localStorage.setItem(`a2bot_state_${chatId}`, JSON.stringify(state)); } catch {}
};
const loadState = (chatId) => {
  try { return JSON.parse(localStorage.getItem(`a2bot_state_${chatId}`)) || null; } catch { return null; }
};
const clearSession = (chatId) => {
  localStorage.removeItem(`a2bot_sid_${chatId}`);
  localStorage.removeItem(`a2bot_state_${chatId}`);
};

const UserMessage = () => {
  const { chatId } = useParams();

  const sessionIdRef = useRef(null);
  if (!sessionIdRef.current) sessionIdRef.current = getOrCreateSid(chatId);
  const SESSION_ID = sessionIdRef.current;

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
  const [confirmClose, setConfirmClose] = useState(false);

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

        // Restore from localStorage only — no API call needed
        const saved = loadState(chatId);
        const flowList = user.flowSetupSetting?.question?.list || [];

        if (saved && saved.preChatDone) {
          // Restore ANY state where user already entered their name
          const validStep = Math.min(saved.step || 0, flowList.length);
          setMessages(saved.messages || []);
          setPreChatDone(true);
          setUserName(saved.userName || '');
          setStep(validStep);
          setDone(saved.done || false);
          setLiveRequested(saved.liveRequested || false);
          setChatClosed(saved.chatClosed || false);

          // Live agent mode: sync latest messages from API silently
          if (saved.liveRequested && !saved.chatClosed) {
            axios.get(`${CONV_API}/session/${chatId}/${sessionIdRef.current}`)
              .then(r => {
                if (r.data.ok) {
                  setMessages(r.data.messages || []);
                  if (r.data.status === 'closed') setChatClosed(true);
                }
              })
              .catch(() => {});
          }
        }
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

  // Persist full session state (including messages) to localStorage
  useEffect(() => {
    if (preChatDone) {
      saveState(chatId, { preChatDone, userName, step, done, liveRequested, chatClosed, messages });
    }
  }, [preChatDone, userName, step, done, liveRequested, chatClosed, messages, chatId]);

  // Cleanup all polling on unmount
  useEffect(() => {
    return () => {
      if (livePollingRef.current) clearInterval(livePollingRef.current);
      if (statusPollingRef.current) clearInterval(statusPollingRef.current);
    };
  }, []);

  const handleConfirmClose = () => {
    if (livePollingRef.current) clearInterval(livePollingRef.current);
    if (statusPollingRef.current) clearInterval(statusPollingRef.current);
    clearSession(chatId);
    const newSid = 'sess_' + Math.random().toString(36).slice(2) + Date.now();
    localStorage.setItem(`a2bot_sid_${chatId}`, newSid);
    sessionIdRef.current = newSid;
    setMessages([]);
    setPreChatDone(false);
    setUserName('');
    setNameInput('');
    setStep(0);
    setDone(false);
    setLiveRequested(false);
    setChatClosed(false);
    setReopening(false);
    setConfirmClose(false);
  };

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

  const handleOptionSelect = (optionText) => {
    if (done || liveRequested) return;
    const currentQ = flow[step];
    pushMessage('user', optionText, currentQ?.id);
    const nextStep = step + 1;
    setStep(nextStep);
    if (nextStep < flow.length) {
      setTimeout(() => {
        setMessages(prev => [...prev, { sender: 'bot', text: flow[nextStep].text, questionId: flow[nextStep].id }]);
      }, 600);
    } else {
      setTimeout(() => {
        setMessages(prev => [...prev, { sender: 'bot', text: "Thank you! We'll get back to you soon." }]);
        setDone(true);
      }, 600);
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
  const optionColor = colors.option || '#007bff';
  const optionBorderColor = colors.optionBorder || '#444c5c';
  const isLightQuestion = questionColor === '#ffffff' || questionColor === '#fff';
  const bubbleStyle = botSettings.selectedBubbleStyle || 'style1';
  const borderRadius = botSettings.borderRadius != null ? Number(botSettings.borderRadius) : 10;
  const textAlign = botSettings.textAlign || 'left';
  const fontSize = botSettings.fontSize || '14px';
  const overlayOpacity = botSettings.overlayOpacity || 0;
  const avatarUrl = botSettings.avatar || botSettings.companyLogo || '';

  const getBubbleRadius = (sender) => {
    switch (bubbleStyle) {
      case 'style2': return '20px';
      case 'style3': return sender === 'user' ? '12px 12px 0px 12px' : '12px 12px 12px 0px';
      case 'style4': return sender === 'user' ? '12px 12px 12px 0px' : '12px 12px 0px 12px';
      default: return sender === 'user' ? '8px 8px 0px 8px' : '8px 8px 8px 0px';
    }
  };

  const getOptionLabel = (opt) => typeof opt === 'string' ? opt : (opt?.label || opt?.value || String(opt));

  const currentQ = flow[step];
  const hasOptions = !done && !liveRequested && (currentQ?.options?.length > 0);

  return (
    <Box sx={{
      width: '100%', height: '100vh',
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
      fontFamily: botSettings.font || 'inherit',
      fontSize,
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
        <Box sx={{ flex: 1 }}>
          <Typography fontWeight={700} fontSize={15}>{botSettings.botName || 'Chatbot'}</Typography>
          {botSettings.description && (
            <Typography variant="caption" sx={{ opacity: 0.85 }}>{botSettings.description}</Typography>
          )}
        </Box>
        {preChatDone && userName && (
          <Typography fontSize={12} sx={{ opacity: 0.8, mr: 0.5 }}>{userName}</Typography>
        )}
        <Tooltip title="Minimize" placement="left">
          <Box
            onClick={() => window.parent.postMessage({ type: 'A2BOT_MINIMIZE' }, '*')}
            sx={{
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 30, height: 30, borderRadius: '50%',
              bgcolor: 'rgba(255,255,255,0.15)',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.28)' },
              flexShrink: 0,
            }}
          >
            <KeyboardArrowDownIcon sx={{ fontSize: 18, color: '#fff' }} />
          </Box>
        </Tooltip>
        <Tooltip title="Close Chat" placement="left">
          <Box
            onClick={() => setConfirmClose(true)}
            sx={{
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 30, height: 30, borderRadius: '50%',
              bgcolor: 'rgba(255,255,255,0.15)',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.28)' },
              flexShrink: 0,
            }}
          >
            <CloseIcon sx={{ fontSize: 16, color: '#fff' }} />
          </Box>
        </Tooltip>
      </Box>

      {/* Confirm close dialog */}
      <Dialog open={confirmClose} onClose={() => setConfirmClose(false)} PaperProps={{ sx: { borderRadius: 3, p: 1, minWidth: 280 } }}>
        <DialogTitle sx={{ fontWeight: 700, fontSize: 16, pb: 1 }}>Close this chat?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            Your chat history will be cleared and you'll start a new conversation. This cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 2, pb: 2, gap: 1 }}>
          <Button onClick={() => setConfirmClose(false)} variant="outlined" size="small" sx={{ borderRadius: 2, textTransform: 'none', flex: 1 }}>
            Cancel
          </Button>
          <Button onClick={handleConfirmClose} variant="contained" color="error" size="small" sx={{ borderRadius: 2, textTransform: 'none', flex: 1 }}>
            Close Chat
          </Button>
        </DialogActions>
      </Dialog>

      {/* ─── PRE-CHAT SCREEN ─── */}
      {!preChatDone ? (
        <Box sx={{ background: chatBg, p: 3, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
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
            sx={{
              flex: 1, overflowY: 'auto', p: 2, position: 'relative',
              background: chatBg,
              ...(overlayOpacity > 0 && {
                backgroundColor: `rgba(0,0,0,${overlayOpacity / 100})`,
                backgroundBlendMode: "overlay",
              }),
            }}
          >
            {messages.map((msg, i) => (
              <Box
                key={i}
                sx={{
                  display: 'flex',
                  justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  mb: 1.5,
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                {msg.sender === 'admin' && (
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', maxWidth: '75%' }}>
                    <Typography variant="caption" sx={{ fontSize: 10, color: '#e65100', fontWeight: 700, mb: 0.3, px: 1 }}>Support Agent</Typography>
                    <Box sx={{ px: 2, py: 1, borderRadius: getBubbleRadius('bot'), bgcolor: '#fff3e0', border: '1px solid #ffcc80', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
                      <Typography variant="body2" sx={{ lineHeight: 1.5, color: '#bf360c', fontSize }}>{msg.text}</Typography>
                    </Box>
                  </Box>
                )}
                {msg.sender !== 'admin' && (
                  <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 0.8, maxWidth: '75%' }}>
                    {msg.sender === 'bot' && avatarUrl && (
                      <img src={avatarUrl} alt="bot" style={{ width: 22, height: 22, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                    )}
                    <Box sx={{
                      px: 2, py: 1,
                      borderRadius: getBubbleRadius(msg.sender),
                      bgcolor: msg.sender === 'user' ? answerColor : questionColor,
                      color: msg.sender === 'user' ? '#fff' : (isLightQuestion ? '#222' : '#fff'),
                      boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                      border: isLightQuestion && msg.sender === 'bot' ? '1px solid #e0e0e0' : 'none',
                    }}>
                      <Typography variant="body2" sx={{ lineHeight: 1.5, fontSize }}>{msg.text}</Typography>
                    </Box>
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

              {/* Option buttons */}
              {hasOptions && (
                <Box sx={{ px: 2, pb: 1, pt: 0.5, background: chatBg, display: 'flex', flexWrap: 'wrap', gap: 1, borderTop: '1px solid #eee' }}>
                  {currentQ.options.map((opt, i) => (
                    <Button
                      key={i}
                      size="small"
                      onClick={() => handleOptionSelect(getOptionLabel(opt))}
                      sx={{
                        borderRadius: `${borderRadius}px`,
                        bgcolor: optionColor,
                        color: '#fff',
                        border: `2px solid ${optionBorderColor}`,
                        textAlign,
                        fontSize,
                        textTransform: 'none',
                        px: 2, py: 0.8,
                        '&:hover': { bgcolor: optionColor, filter: 'brightness(0.9)' },
                      }}
                    >
                      {getOptionLabel(opt)}
                    </Button>
                  ))}
                </Box>
              )}

              {/* Input */}
              <Box sx={{ p: 1.5, borderTop: liveRequested ? '2px solid #e65100' : '1px solid #eee', bgcolor: '#fff', display: 'flex', gap: 1 }}>
                <TextField
                  fullWidth
                  size="small"
                  value={text}
                  placeholder={liveRequested ? 'Reply to agent...' : done ? 'Flow complete ✓' : hasOptions ? 'Select an option above...' : 'Type your answer...'}
                  onChange={e => setText(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
                  disabled={(done && !liveRequested) || hasOptions}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                />
                <Button
                  variant="contained"
                  onClick={handleSend}
                  disabled={(done && !liveRequested) || !text.trim() || hasOptions}
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
