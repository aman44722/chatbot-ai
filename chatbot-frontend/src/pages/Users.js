import React, { useEffect, useState, useMemo } from 'react';
import {
  Box, Paper, Typography, Avatar, Chip, TextField, InputAdornment,
  CircularProgress, Grid
} from '@mui/material';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';
import SearchIcon from '@mui/icons-material/Search';
import PeopleIcon from '@mui/icons-material/People';
import ForumIcon from '@mui/icons-material/Forum';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import MessageIcon from '@mui/icons-material/Message';
import { fetchConversations } from '../api/conversationApi';
import { useNavigate } from 'react-router-dom';

const COLORS = ['#6366f1', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#ec4899', '#0ea5e9'];
const STATUS_COLORS = { active: '#10b981', live_requested: '#f59e0b', closed: '#6b7280' };

function AnimatedCount({ value }) {
  const [display, setDisplay] = useState('0');
  useEffect(() => {
    const target = parseInt(value) || 0;
    if (target === 0) { setDisplay('0'); return; }
    const duration = 1000;
    const start = performance.now();
    const raf = () => {
      const elapsed = performance.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.floor(eased * target).toLocaleString());
      if (progress < 1) requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }, [value]);
  return <span>{display}</span>;
}

const Users = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const botId = localStorage.getItem('selectedBotId');

  useEffect(() => {
    setLoading(true);
    fetchConversations(1, 50, botId)
      .then(setConversations)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [botId]);

  const filtered = useMemo(() =>
    conversations.filter(c =>
      (c.userName || c.sessionId).toLowerCase().includes(search.toLowerCase())
    ), [conversations, search]);

  const totalConvs = conversations.length;
  const totalMsgs = conversations.reduce((s, c) => s + (c.messages?.length || 0), 0);
  const activeConvs = conversations.filter(c => c.status === 'active').length;
  const avgMsgs = totalConvs > 0 ? (totalMsgs / totalConvs).toFixed(1) : '0';

  const dailyChartData = useMemo(() => {
    const map = {};
    conversations.forEach(c => {
      const d = new Date(c.updatedAt || c.createdAt).toISOString().slice(0, 10);
      map[d] = (map[d] || 0) + 1;
    });
    return Object.entries(map)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-14)
      .map(([date, count]) => ({ date: date.slice(5), conversations: count }));
  }, [conversations]);

  const topUsers = useMemo(() =>
    [...conversations]
      .filter(c => c.userName)
      .sort((a, b) => (b.messages?.length || 0) - (a.messages?.length || 0))
      .slice(0, 5),
  [conversations]);

  const kpis = [
    { label: 'Total Users', value: totalConvs, icon: <PeopleIcon />, gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)', chartColor: '#6366f1' },
    { label: 'Active Chats', value: activeConvs, icon: <AccessTimeIcon />, gradient: 'linear-gradient(135deg, #10b981, #34d399)', chartColor: '#10b981' },
    { label: 'Total Messages', value: totalMsgs, icon: <ForumIcon />, gradient: 'linear-gradient(135deg, #f59e0b, #f97316)', chartColor: '#f59e0b' },
    { label: 'Avg per User', value: avgMsgs, icon: <MessageIcon />, gradient: 'linear-gradient(135deg, #ec4899, #f472b6)', chartColor: '#ec4899' },
  ];

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', flexDirection: 'column', gap: 2 }}>
      <CircularProgress size={56} sx={{ color: '#6366f1' }} />
      <Typography sx={{ color: '#9ca3af', animation: 'pulse 2s ease-in-out infinite' }}>Loading users...</Typography>
    </Box>
  );

  return (
    <Box sx={{
      position: 'relative', minHeight: '100%', p: { xs: 2, md: 3 },
      '&::before': {
        content: '""', position: 'absolute', inset: 0,
        background: `
          radial-gradient(600px circle at 0% 20%, rgba(79,70,229,0.06) 0%, transparent 70%),
          radial-gradient(500px circle at 80% 80%, rgba(16,185,129,0.05) 0%, transparent 70%),
          radial-gradient(400px circle at 50% 50%, rgba(99,102,241,0.03) 0%, transparent 70%)
        `,
        animation: 'waterFlow 12s ease-in-out infinite',
        pointerEvents: 'none',
      },
      '&::after': {
        content: '""', position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, #f8faff 0%, #f0f4ff 50%, #faf5ff 100%)',
        opacity: 0.7, pointerEvents: 'none',
      },
      '@keyframes waterFlow': {
        '0%,100%': { backgroundPosition: '0% 0%' },
        '50%': { backgroundPosition: '100% 100%' },
      },
    }}>
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <Paper sx={{
          p: { xs: 2, md: 3 }, mb: 3, borderRadius: 3.5,
          bgcolor: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(16px)',
          border: '1px solid rgba(229,231,235,0.3)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.04)',
          position: 'relative', overflow: 'hidden',
          '&::before': {
            content: '""', position: 'absolute', top: 0, left: 0, right: 0, height: 3,
            background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #10b981, #f59e0b)',
          },
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography sx={{
                fontSize: 24, fontWeight: 800, letterSpacing: '-0.5px',
                background: 'linear-gradient(135deg, #1f2937, #6366f1)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>
                Users
              </Typography>
              <Typography sx={{ fontSize: 14, color: '#6b7280', mt: 0.3 }}>
                {totalConvs} users who interacted with your chatbot
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
              {[
                { label: 'Active', count: activeConvs, color: '#10b981' },
                { label: 'Closed', count: conversations.filter(c => c.status === 'closed').length, color: '#6b7280' },
              ].map(s => (
                <Chip key={s.label}
                  label={<span><strong>{s.count}</strong> {s.label}</span>}
                  size="small"
                  sx={{
                    borderRadius: 2, fontWeight: 500, fontSize: 12,
                    bgcolor: `${s.color}10`, color: s.color,
                    border: `1px solid ${s.color}25`,
                    '& strong': { fontWeight: 700 },
                  }}
                />
              ))}
            </Box>
          </Box>

          {/* Search */}
          <TextField
            placeholder="Search users by name or session..."
            size="small"
            fullWidth
            value={search}
            onChange={e => setSearch(e.target.value)}
            sx={{
              mt: 2.5,
              '& .MuiOutlinedInput-root': {
                borderRadius: '11px', bgcolor: '#f9fafb',
                transition: 'all 0.2s',
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#6366f1' },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#6366f1', borderWidth: 2 },
              },
            }}
            InputProps={{
              startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#9ca3af', fontSize: 20 }} /></InputAdornment>,
            }}
          />
        </Paper>

        {/* KPI Cards */}
        <Grid container spacing={2.5} mb={3}>
          {kpis.map((k, i) => (
            <Grid item xs={6} md={3} key={i}>
              <Paper sx={{
                p: 2.5, borderRadius: 3, background: k.gradient, color: '#fff',
                position: 'relative', overflow: 'hidden', minHeight: 110,
                transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                '&:hover': { transform: 'translateY(-2px)', boxShadow: `0 12px 40px ${k.chartColor}40` },
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                  <Typography fontSize={12} fontWeight={600} sx={{ opacity: 0.9 }}>{k.label}</Typography>
                  {React.cloneElement(k.icon, { sx: { fontSize: 20, opacity: 0.8 } })}
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 800, fontSize: { xs: 24, md: 28 }, lineHeight: 1.1 }}>
                  {typeof k.value === 'number' ? <AnimatedCount value={k.value} /> : k.value}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Chart + Users */}
        <Grid container spacing={2.5} mb={3}>
          <Grid item xs={12} md={7}>
            <Paper sx={{
              p: 3, borderRadius: 3,
              bgcolor: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(16px)',
              border: '1px solid rgba(229,231,235,0.3)',
              boxShadow: '0 4px 24px rgba(0,0,0,0.04)',
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography sx={{ fontWeight: 700, fontSize: 15, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 4, height: 22, borderRadius: 2, background: 'linear-gradient(180deg, #6366f1, #8b5cf6)' }} />
                  User Activity
                </Typography>
                <Chip label={`${dailyChartData.reduce((a, b) => a + b.conversations, 0)} conversations`}
                  size="small" sx={{ bgcolor: '#eef2ff', color: '#6366f1', fontWeight: 600, fontSize: 11 }} />
              </Box>
              {dailyChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={260}>
                  <AreaChart data={dailyChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="userAreaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#6366f1" stopOpacity={0.25} />
                        <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} allowDecimals={false} />
                    <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 8px 30px rgba(0,0,0,0.12)' }} />
                    <Area type="monotone" dataKey="conversations" stroke="#6366f1" strokeWidth={3} fill="url(#userAreaGrad)" dot={{ r: 4, fill: '#6366f1', stroke: '#fff', strokeWidth: 2 }} activeDot={{ r: 7, fill: '#6366f1', stroke: '#fff', strokeWidth: 2 }} />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <Box sx={{ height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography sx={{ color: '#9ca3af' }}>No activity data yet</Typography>
                </Box>
              )}
            </Paper>
          </Grid>

          {/* Top Users */}
          <Grid item xs={12} md={5}>
            <Paper sx={{
              p: 3, borderRadius: 3,
              bgcolor: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(16px)',
              border: '1px solid rgba(229,231,235,0.3)',
              boxShadow: '0 4px 24px rgba(0,0,0,0.04)',
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography sx={{ fontWeight: 700, fontSize: 15, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 4, height: 22, borderRadius: 2, background: 'linear-gradient(180deg, #ec4899, #f472b6)' }} />
                  Top Users
                </Typography>
                <Chip label={`${topUsers.length} users`} size="small" sx={{ bgcolor: '#fdf2f8', color: '#ec4899', fontWeight: 600, fontSize: 11 }} />
              </Box>
              {topUsers.length > 0 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  {topUsers.map((u, i) => {
                    const maxMsg = topUsers[0]?.messages?.length || 1;
                    const barW = ((u.messages?.length || 0) / maxMsg) * 100;
                    return (
                      <Box key={u._id}
                        onClick={() => navigate(`/app/conversations/${u._id}`)}
                        sx={{
                          display: 'flex', alignItems: 'center', gap: 1.5, p: 1.2, borderRadius: 2,
                          cursor: 'pointer', transition: 'all 0.2s',
                          bgcolor: i % 2 === 0 ? 'rgba(99,102,241,0.03)' : 'transparent',
                          '&:hover': { bgcolor: `${COLORS[i]}08`, transform: 'translateX(3px)' },
                        }}>
                        <Box sx={{
                          width: 36, height: 36, borderRadius: '50%',
                          background: `linear-gradient(135deg, ${COLORS[i]}, ${COLORS[i]}bb)`,
                          color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 15, fontWeight: 700, flexShrink: 0,
                          boxShadow: `0 4px 12px ${COLORS[i]}50`,
                        }}>
                          {(u.userName || '?')[0].toUpperCase()}
                        </Box>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography fontWeight={600} fontSize={14} noWrap sx={{ color: '#1f2937' }}>
                            {u.userName || `Anonymous (${u.sessionId.slice(-8)})`}
                          </Typography>
                          <Box sx={{ width: '100%', height: 5, borderRadius: 3, bgcolor: '#f3f4f6', overflow: 'hidden', mt: 0.4 }}>
                            <Box sx={{
                              height: '100%', borderRadius: 3,
                              background: `linear-gradient(90deg, ${COLORS[i]}, ${COLORS[i]}88)`,
                              width: `${Math.max(barW, 5)}%`,
                              transition: 'width 1s ease',
                            }} />
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexShrink: 0 }}>
                          <Typography fontSize={14} fontWeight={700} color={COLORS[i]}>
                            {u.messages?.length || 0}
                          </Typography>
                          <Typography fontSize={11} color='#9ca3af'>msgs</Typography>
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              ) : (
                <Box sx={{ py: 5, textAlign: 'center' }}>
                  <PeopleIcon sx={{ fontSize: 40, color: '#d1d5db', mb: 1 }} />
                  <Typography sx={{ color: '#9ca3af', fontSize: 13 }}>No named users yet</Typography>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>

        {/* All Users List */}
        <Paper sx={{
          borderRadius: 3.5, overflow: 'hidden',
          bgcolor: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(16px)',
          border: '1px solid rgba(229,231,235,0.3)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.04)',
        }}>
          <Box sx={{
            px: 3, py: 2,
            borderBottom: '1px solid rgba(229,231,235,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <Typography sx={{ fontWeight: 700, fontSize: 15, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 4, height: 22, borderRadius: 2, background: 'linear-gradient(180deg, #6366f1, #8b5cf6)' }} />
              All Conversations
            </Typography>
            <Typography fontSize={13} color='#9ca3af'>{filtered.length} of {totalConvs}</Typography>
          </Box>
          {filtered.length === 0 ? (
            <Box sx={{ p: 6, textAlign: 'center' }}>
              <SearchIcon sx={{ fontSize: 48, color: '#d1d5db', mb: 1.5 }} />
              <Typography sx={{ color: '#9ca3af', fontSize: 14 }}>
                {search ? `No users matching "${search}"` : 'No conversations yet'}
              </Typography>
            </Box>
          ) : (
            <Box>
              {filtered.map((c, i) => {
                const msgCount = c.messages?.length || 0;
                const daysAgo = Math.floor((Date.now() - new Date(c.updatedAt).getTime()) / 86400000);
                const timeLabel = daysAgo === 0 ? 'Today' : daysAgo === 1 ? 'Yesterday' : `${daysAgo}d ago`;
                const statusColor = STATUS_COLORS[c.status] || '#9ca3af';
                return (
                  <Box key={c._id}
                    onClick={() => navigate(`/app/conversations/${c._id}`)}
                    sx={{
                      display: 'flex', alignItems: 'center', gap: 2, px: 3, py: 2,
                      cursor: 'pointer', transition: 'all 0.2s',
                      borderBottom: i < filtered.length - 1 ? '1px solid rgba(229,231,235,0.4)' : 'none',
                      '&:hover': { bgcolor: 'rgba(99,102,241,0.04)' },
                    }}>
                    <Avatar sx={{
                      width: 44, height: 44,
                      background: c.userName
                        ? `linear-gradient(135deg, ${COLORS[i % COLORS.length]}, ${COLORS[(i + 1) % COLORS.length]}bb)`
                        : '#e5e7eb',
                      fontWeight: 700, fontSize: 16, color: c.userName ? '#fff' : '#9ca3af',
                    }}>
                      {(c.userName || '?')[0].toUpperCase()}
                    </Avatar>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography fontWeight={600} fontSize={14} noWrap sx={{ color: '#1f2937' }}>
                        {c.userName || `Anonymous (${c.sessionId.slice(-8)})`}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 0.3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <MessageIcon sx={{ fontSize: 13, color: '#9ca3af' }} />
                          <Typography fontSize={12} color='#9ca3af'>{msgCount} messages</Typography>
                        </Box>
                        <Box sx={{ width: 3, height: 3, borderRadius: '50%', bgcolor: '#d1d5db' }} />
                        <Typography fontSize={12} color='#9ca3af'>{timeLabel}</Typography>
                        {c.botName && (
                          <>
                            <Box sx={{ width: 3, height: 3, borderRadius: '50%', bgcolor: '#d1d5db' }} />
                            <Typography fontSize={12} color='#9ca3af'>{c.botName}</Typography>
                          </>
                        )}
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexShrink: 0 }}>
                      <Box sx={{
                        display: 'flex', alignItems: 'center', gap: 1,
                        px: 1.2, py: 0.3, borderRadius: '20px',
                        bgcolor: `${statusColor}10`, border: `1px solid ${statusColor}20`,
                      }}>
                        <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: statusColor, boxShadow: `0 0 6px ${statusColor}60` }} />
                        <Typography fontSize={12} fontWeight={600} sx={{ color: statusColor, textTransform: 'capitalize' }}>
                          {c.status === 'live_requested' ? 'Live' : c.status}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default Users;
