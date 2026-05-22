import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Box, TextField, Button, Typography, CircularProgress, Avatar, Divider, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SkipNextIcon from '@mui/icons-material/SkipNext';
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

  const [dropdownVal, setDropdownVal] = useState('');
  const [otherText, setOtherText] = useState('');

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
  const stepRef = useRef(step);
  const shuffledRef = useRef(null);

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

  const getValidationHint = (question) => {
    if (!question) return '';
    const { type, validations } = question;
    const hints = [];

    if (type === 'email_feild') hints.push('Valid email required (user@example.com)');
    if (type === 'number') hints.push('Numeric value only');
    if (type === 'mobile_number') hints.push('Digits only');
    if (validations?.minLength != null) hints.push(`Min ${validations.minLength}${type === 'number' ? ' value' : ' chars'}`);
    if (validations?.maxLength != null) hints.push(`Max ${validations.maxLength}${type === 'number' ? ' value' : ' chars'}`);
    if (validations?.pattern) hints.push('Custom pattern required');

    return hints.join(' · ');
  };

  const validateAnswer = (answer, question) => {
    if (!question) return { valid: true };
    const { type, validations } = question;
    const msg = question.errorMessage || 'Please enter a valid answer';

    if (type === 'email_feild') {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(answer)) {
        return { valid: false, error: msg };
      }
    }

    if (type === 'number') {
      if (answer.trim() === '' || isNaN(Number(answer))) {
        return { valid: false, error: msg };
      }
      const num = Number(answer);
      if (validations?.minLength != null && num < validations.minLength) {
        return { valid: false, error: msg };
      }
      if (validations?.maxLength != null && num > validations.maxLength) {
        return { valid: false, error: msg };
      }
    }

    if (type === 'mobile_number') {
      if (answer.replace(/\D/g, '') !== answer.trim()) {
        return { valid: false, error: msg };
      }
      if (validations?.minLength != null && answer.length < validations.minLength) {
        return { valid: false, error: msg };
      }
      if (validations?.maxLength != null && answer.length > validations.maxLength) {
        return { valid: false, error: msg };
      }
    }

    if (validations?.minLength != null && answer.length < validations.minLength) {
      return { valid: false, error: msg };
    }
    if (validations?.maxLength != null && answer.length > validations.maxLength) {
      return { valid: false, error: msg };
    }
    if (validations?.pattern) {
      try {
        if (!new RegExp(validations.pattern).test(answer)) {
          return { valid: false, error: msg };
        }
      } catch {}
    }

    return { valid: true };
  };

  const advanceStep = (nextStep) => {
    setDropdownVal('');
    setOtherText('');
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

  const handleOptionSelect = (optionText) => {
    if (done || liveRequested) return;
    const currentQ = flow[step];
    pushMessage('user', optionText, currentQ?.id);
    advanceStep(step + 1);
  };

  const handleSkip = () => {
    if (done || liveRequested) return;
    const currentQ = flow[step];
    pushMessage('user', '⏭️ Skipped', currentQ?.id);
    advanceStep(step + 1);
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
    const result = validateAnswer(userText, currentQ);
    if (!result.valid) {
      setMessages(prev => [...prev, {
        sender: 'bot',
        text: `❌ ${result.error}`,
        isError: true,
      }]);
      return;
    }
    pushMessage('user', userText, currentQ?.id);
    advanceStep(step + 1);
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

  const shuffleArray = (arr) => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  const currentQ = flow[step];
  if (stepRef.current !== step) {
    shuffledRef.current = null;
    stepRef.current = step;
  }
  if (currentQ?.shuffleOptions && !shuffledRef.current) {
    shuffledRef.current = shuffleArray(currentQ.options);
  }
  if (!currentQ?.shuffleOptions) shuffledRef.current = null;
  const displayOptions = shuffledRef.current || currentQ?.options || [];
  const hasOtherOption = currentQ?.otherOption;
  const isDropdown = currentQ?.style === 'dropdown';

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
            {messages.map((msg, i) => {
              const msgQuestion = msg.sender === 'bot' && msg.questionId ? flow.find(f => f.id === msg.questionId) : null;
              const msgMedia = msgQuestion?.media;
              return (
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
                    {msg.sender === 'bot' && !msg.isError && avatarUrl && (
                      <img src={avatarUrl} alt="bot" style={{ width: 22, height: 22, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                    )}
                    <Box>
                      {msgMedia && (
                        <Box sx={{
                          borderRadius: '8px 8px 0 0',
                          overflow: 'hidden',
                          border: isLightQuestion ? '1px solid #e0e0e0' : 'none',
                          borderBottom: 'none',
                        }}>
                          <img src={msgMedia} alt="media" style={{ width: '100%', maxHeight: 180, objectFit: 'cover', display: 'block' }} />
                        </Box>
                      )}
                      <Box sx={{
                        px: 2, py: 1,
                        borderTopLeftRadius: msgMedia ? 0 : undefined,
                        borderTopRightRadius: msgMedia ? 0 : undefined,
                        borderRadius: msgMedia ? '0 0 8px 8px' : getBubbleRadius(msg.sender),
                        bgcolor: msg.isError ? '#fef2f2' : (msg.sender === 'user' ? answerColor : questionColor),
                        color: msg.isError ? '#dc2626' : (msg.sender === 'user' ? '#fff' : (isLightQuestion ? '#222' : '#fff')),
                        boxShadow: msg.isError ? '0 1px 4px rgba(220,38,38,0.12)' : '0 1px 4px rgba(0,0,0,0.08)',
                        border: msg.isError ? '1px solid #fecaca' : (isLightQuestion && msg.sender === 'bot' ? '1px solid #e0e0e0' : 'none'),
                        fontSize: msg.isError ? 13 : undefined,
                      }}>
                        <Typography variant="body2" sx={{ lineHeight: 1.5, fontSize }}>{msg.text}</Typography>
                      </Box>
                    </Box>
                  </Box>
                )}
              </Box>
            );
            })}

              {hasOptions && (
                <Box sx={{ mb: 1.5, display: 'flex', justifyContent: 'flex-start' }}>
                  <Box sx={{ maxWidth: '85%' }}>
                    {isDropdown ? (
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, minWidth: 200 }}>
                        <FormControl size="small" fullWidth>
                          <InputLabel>Choose an option</InputLabel>
                          <Select
                            value={dropdownVal}
                            label="Choose an option"
                            onChange={(e) => setDropdownVal(e.target.value)}
                            sx={{ borderRadius: 2, bgcolor: '#fff' }}
                          >
                            {displayOptions.map((opt, i) => (
                              <MenuItem key={i} value={getOptionLabel(opt)}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  {currentQ.imageChoices?.[i]?.image && (
                                    <img src={currentQ.imageChoices[i].image} alt="" style={{ width: 24, height: 24, borderRadius: 4, objectFit: 'cover' }} />
                                  )}
                                  {getOptionLabel(opt)}
                                </Box>
                              </MenuItem>
                            ))}
                            {hasOtherOption && <MenuItem value="__other__">Other</MenuItem>}
                          </Select>
                        </FormControl>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button
                            variant="contained" size="small"
                            disabled={!dropdownVal || dropdownVal === '__other__'}
                            onClick={() => handleOptionSelect(dropdownVal)}
                            sx={{ flex: 1, borderRadius: 2, textTransform: 'none', bgcolor: headerColor, '&:hover': { bgcolor: headerColor, filter: 'brightness(0.9)' } }}
                          >
                            Submit
                          </Button>
                        </Box>
                      </Box>
                    ) : (
                      <Box>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {displayOptions.map((opt, i) => (
                            <Button
                              key={i}
                              onClick={() => handleOptionSelect(getOptionLabel(opt))}
                              sx={{
                                borderRadius: `${Math.max(borderRadius, 8)}px`,
                                background: `linear-gradient(135deg, ${optionColor}, ${optionColor}dd)`,
                                color: '#fff', border: 'none', textAlign: 'center',
                                fontSize: Math.max(parseFloat(fontSize) - 1, 12) + 'px',
                                textTransform: 'none', fontWeight: 600,
                                px: 2.5, py: 1, minWidth: 80, flex: '0 1 auto',
                                boxShadow: `0 3px 10px ${optionColor}30`,
                                transition: 'all 0.2s ease',
                                display: 'flex', alignItems: 'center', gap: 0.8,
                                '&:hover': {
                                  transform: 'translateY(-2px)',
                                  boxShadow: `0 6px 20px ${optionColor}50`,
                                  background: `linear-gradient(135deg, ${optionColor}, ${optionColor})`,
                                  filter: 'brightness(1.05)',
                                },
                                '&:active': { transform: 'translateY(0)' },
                              }}
                            >
                              {currentQ.imageChoices?.[i]?.image && (
                                <img src={currentQ.imageChoices[i].image} alt="" style={{ width: 20, height: 20, borderRadius: 4, objectFit: 'cover' }} />
                              )}
                              {getOptionLabel(opt)}
                            </Button>
                          ))}
                          {hasOtherOption && (
                            <Button
                              onClick={() => { setOtherText(''); setDropdownVal('__other__'); }}
                              sx={{
                                borderRadius: `${Math.max(borderRadius, 8)}px`,
                                color: '#888', border: '2px dashed #d0d0d0', textTransform: 'none',
                                fontSize: Math.max(parseFloat(fontSize) - 1, 12) + 'px',
                                fontWeight: 500, px: 2.5, py: 1, bgcolor: 'transparent',
                                transition: 'all 0.2s ease',
                                '&:hover': { borderColor: optionColor, color: optionColor, bgcolor: `${optionColor}08` },
                              }}
                            >
                              Other
                            </Button>
                          )}
                        </Box>
                        {hasOtherOption && dropdownVal === '__other__' && (
                          <Box sx={{ display: 'flex', gap: 1, mt: 1.5 }}>
                            <TextField
                              fullWidth size="small" placeholder="Type your answer..."
                              value={otherText}
                              onChange={(e) => setOtherText(e.target.value)}
                              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: '#fff' } }}
                            />
                            <Button
                              variant="contained" size="small"
                              disabled={!otherText.trim()}
                              onClick={() => handleOptionSelect(otherText.trim())}
                              sx={{ borderRadius: 2, textTransform: 'none', bgcolor: headerColor, whiteSpace: 'nowrap', '&:hover': { bgcolor: headerColor, filter: 'brightness(0.9)' } }}
                            >
                              Submit
                            </Button>
                          </Box>
                        )}
                      </Box>
                    )}
                    <Typography sx={{ mt: 1, color: '#aaa', fontSize: 11 }}>
                      {isDropdown ? 'Select and submit' : 'Tap an option to continue'}
                    </Typography>
                  </Box>
                </Box>
              )}
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

              {/* Input area */}
              <Box sx={{ p: 1.5, borderTop: liveRequested ? '2px solid #e65100' : '1px solid #eee', bgcolor: '#fff' }}>
                {hasOptions ? (
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    {currentQ?.skipOption && (
                      <Button
                        size="small"
                        startIcon={<SkipNextIcon fontSize="small" />}
                        onClick={handleSkip}
                        sx={{ borderRadius: 2, textTransform: 'none', color: '#aaa', fontWeight: 400, fontSize: 13, px: 2, '&:hover': { color: optionColor, bgcolor: `${optionColor}08` } }}
                      >
                        Skip this question
                      </Button>
                    )}
                  </Box>
                ) : (
                  <Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <TextField
                        fullWidth size="small"
                        value={text}
                        placeholder={liveRequested ? 'Reply to agent...' : done ? 'Flow complete ✓' : 'Type your answer...'}
                        onChange={e => setText(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
                        disabled={done && !liveRequested}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                      />
                      {!done && !liveRequested && currentQ?.skipOption && (
                        <Button
                          variant="outlined" size="small"
                          startIcon={<SkipNextIcon fontSize="small" />}
                          onClick={handleSkip}
                          sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 500, fontSize: 13, color: '#666', borderColor: '#ccc', whiteSpace: 'nowrap', '&:hover': { borderColor: '#999', bgcolor: '#f5f5f5' } }}
                        >
                          Skip
                        </Button>
                      )}
                      <Button
                        variant="contained"
                        onClick={handleSend}
                        disabled={(done && !liveRequested) || !text.trim()}
                        sx={{ borderRadius: 3, minWidth: 44, px: 1.5, bgcolor: liveRequested ? '#e65100' : headerColor, '&:hover': { bgcolor: liveRequested ? '#bf360c' : headerColor } }}
                      >
                        <SendIcon fontSize="small" />
                      </Button>
                    </Box>
                    {!done && !liveRequested && currentQ && (
                      <Box sx={{ mt: 0.8, display: 'flex', alignItems: 'center', gap: 0.8 }}>
                        <Typography sx={{ fontSize: 11, color: '#e67e22', fontWeight: 500 }}>
                          ⚠️ {getValidationHint(currentQ) || 'Required field'}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                )}
              </Box>
            </>
          )}
        </>
      )}
    </Box>
  );
};

export default UserMessage;
