import React, { useEffect, useState } from 'react';
import {
  Grid, Paper, Typography, Box, Button, MenuItem, Select, CircularProgress
} from '@mui/material';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import DownloadIcon from '@mui/icons-material/Download';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import PeopleIcon from '@mui/icons-material/People';
import ForumIcon from '@mui/icons-material/Forum';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import RefreshIcon from '@mui/icons-material/Refresh';
import axios from 'axios';
import '../styles/analytics.css';

const API = (process.env.REACT_APP_AUTH_API || 'http://localhost:5000/api/auth').replace('/api/auth', '/api/analytics');
const getToken = () => { try { const u = localStorage.getItem('user'); return u ? JSON.parse(u)?.token : null; } catch { return null; } };

const COLORS = ['#6366f1', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#ec4899'];
const STATUS_COLORS = { active: '#10b981', closed: '#6b7280', live_requested: '#f59e0b' };

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(7);

  const fetchAnalytics = async (d) => {
    setLoading(true);
    try {
      const botId = localStorage.getItem('selectedBotId') || '';
      let url = `${API}/overview?days=${d}`;
      if (botId) url += `&botId=${botId}`;
      const res = await axios.get(url, { headers: { Authorization: `Bearer ${getToken()}` } });
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAnalytics(days); }, [days]);

  const total = data?.totalConversations || 0;
  const msgs = data?.totalMessages || 0;
  const active = data?.statusBreakdown?.active || 0;
  const closed = data?.statusBreakdown?.closed || 0;
  const live = data?.statusBreakdown?.live_requested || 0;
  const topUsers = data?.topUsers || [];
  const daily = data?.dailyConversations || { labels: [], values: [] };

  const dailyChartData = daily.labels.map((l, i) => ({ date: l.slice(5), conversations: daily.values[i] }));

  const statusPieData = [
    { name: 'Active', value: active, color: STATUS_COLORS.active },
    { name: 'Closed', value: closed, color: STATUS_COLORS.closed },
    { name: 'Live Requested', value: live, color: STATUS_COLORS.live_requested },
  ].filter(d => d.value > 0);

  const msgAvg = total > 0 ? (msgs / total).toFixed(1) : '0';
  const closedRate = total > 0 ? ((closed / total) * 100).toFixed(0) : '0';

  const kpis = [
    { label: 'Total Conversations', value: total.toLocaleString(), sub: `In last ${days} days`, icon: <ForumIcon />, color: '#6366f1', gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)' },
    { label: 'Total Messages', value: msgs.toLocaleString(), sub: `${msgAvg} avg per conversation`, icon: <AutoGraphIcon />, color: '#f59e0b', gradient: 'linear-gradient(135deg, #f59e0b, #f97316)' },
    { label: 'Active Chats', value: active.toLocaleString(), sub: `${closedRate}% closed rate`, icon: <PeopleIcon />, color: '#10b981', gradient: 'linear-gradient(135deg, #10b981, #34d399)' },
    { label: 'Top User', value: topUsers[0]?.name || '—', sub: topUsers[0] ? `${topUsers[0].messages} messages` : 'No data', icon: <EmojiEventsIcon />, color: '#ec4899', gradient: 'linear-gradient(135deg, #ec4899, #f472b6)' },
  ];

  return (
    <Box className="analytics-water-bg" sx={{ minHeight: '100%', p: 3 }}>
      <Box className="analytics-content">
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Analytics Dashboard</Typography>
            <Typography color="text.secondary" sx={{ mt: 0.5 }}>Real-time insights from your conversations</Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
            <Select value={days} onChange={(e) => setDays(e.target.value)} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(10px)', borderRadius: 2, '& fieldset': { border: 'none' }, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <MenuItem value={7}>Last 7 Days</MenuItem>
              <MenuItem value={30}>Last 30 Days</MenuItem>
              <MenuItem value={90}>Last 3 Months</MenuItem>
            </Select>
            <Button variant="contained" startIcon={<RefreshIcon />} onClick={() => fetchAnalytics(days)} sx={{ borderRadius: 2, textTransform: 'none', bgcolor: '#6366f1', boxShadow: '0 4px 14px rgba(99,102,241,0.3)' }}>Refresh</Button>
            <Button variant="outlined" startIcon={<DownloadIcon />} onClick={() => { const e = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }); const a = document.createElement('a'); a.href = URL.createObjectURL(e); a.download = `analytics-${days}d.json`; a.click(); }} sx={{ borderRadius: 2, textTransform: 'none', borderColor: '#6366f1', color: '#6366f1' }}>Export</Button>
          </Box>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 15 }}><CircularProgress size={48} sx={{ color: '#6366f1' }} /></Box>
        ) : (
          <>
            {/* KPI Cards */}
            <Grid container spacing={2.5} mb={3}>
              {kpis.map((k, i) => (
                <Grid item xs={12} sm={6} md={3} key={i}>
                  <Paper className="analytics-kpi-card" sx={{ p: 2.5, borderRadius: 3, background: k.gradient, color: '#fff', position: 'relative', overflow: 'hidden', '&::after': { content: '""', position: 'absolute', top: '-50%', right: '-50%', width: '100%', height: '100%', background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)', pointerEvents: 'none' } }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5, opacity: 0.9 }}>{React.cloneElement(k.icon, { sx: { fontSize: 22 } })}<Typography fontSize={13} fontWeight={600}>{k.label}</Typography></Box>
                    <Typography variant="h3" sx={{ fontWeight: 800, lineHeight: 1.2 }}>{k.value}</Typography>
                    <Typography sx={{ mt: 0.5, opacity: 0.8, fontSize: 13 }}>{k.sub}</Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>

            {/* Charts Row 1 */}
            <Grid container spacing={2.5} mb={3}>
              <Grid item xs={12} md={7}>
                <Paper className="analytics-glass-card" sx={{ p: 3, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(20px)', boxShadow: '0 8px 32px rgba(0,0,0,0.06)' }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 4, height: 20, borderRadius: 2, background: 'linear-gradient(180deg, #6366f1, #8b5cf6)' }} />
                    Conversations Trend
                  </Typography>
                  {dailyChartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={280}>
                      <AreaChart data={dailyChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#6366f1" stopOpacity={0.3} />
                            <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} />
                        <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                        <Area type="monotone" dataKey="conversations" stroke="#6366f1" strokeWidth={2.5} fill="url(#areaGrad)" dot={{ r: 3, fill: '#6366f1', stroke: '#fff', strokeWidth: 2 }} activeDot={{ r: 6, fill: '#6366f1', stroke: '#fff', strokeWidth: 2 }} />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : <Box sx={{ height: 280, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Typography color="text.secondary">No data</Typography></Box>}
                </Paper>
              </Grid>
              <Grid item xs={12} md={5}>
                <Paper className="analytics-glass-card" sx={{ p: 3, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(20px)', boxShadow: '0 8px 32px rgba(0,0,0,0.06)' }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 4, height: 20, borderRadius: 2, background: 'linear-gradient(180deg, #f59e0b, #f97316)' }} />
                    Status Breakdown
                  </Typography>
                  {statusPieData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={280}>
                      <PieChart>
                        <Pie data={statusPieData} cx="50%" cy="50%" innerRadius={65} outerRadius={100} paddingAngle={4} dataKey="value" stroke="none">
                          {statusPieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                        </Pie>
                        <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : <Box sx={{ height: 280, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Typography color="text.secondary">No data</Typography></Box>}
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 1 }}>
                    {statusPieData.map(s => (
                      <Box key={s.name} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: s.color }} />
                        <Typography fontSize={12} color="text.secondary">{s.name} ({s.value})</Typography>
                      </Box>
                    ))}
                  </Box>
                </Paper>
              </Grid>
            </Grid>

            {/* Charts Row 2 */}
            <Grid container spacing={2.5} mb={3}>
              <Grid item xs={12} md={6}>
                <Paper className="analytics-glass-card" sx={{ p: 3, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(20px)', boxShadow: '0 8px 32px rgba(0,0,0,0.06)' }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 4, height: 20, borderRadius: 2, background: 'linear-gradient(180deg, #10b981, #34d399)' }} />
                    Messages per Conversation
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 4, justifyContent: 'center', alignItems: 'center', py: 3 }}>
                    {[
                      { label: 'Total Messages', value: msgs.toLocaleString(), color: '#6366f1' },
                      { label: 'Avg / Chat', value: msgAvg, color: '#f59e0b' },
                      { label: 'Closed Rate', value: `${closedRate}%`, color: '#10b981' },
                    ].map((s, i) => (
                      <Box key={i} sx={{ textAlign: 'center' }}>
                        <Box sx={{ width: 80, height: 80, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 1, background: `conic-gradient(${s.color} ${parseInt(s.value)}%, #f3f4f6 ${parseInt(s.value)}%)`, position: 'relative', '&::after': { content: '""', position: 'absolute', width: 60, height: 60, borderRadius: '50%', bgcolor: '#fff' } }}>
                          <Typography sx={{ position: 'relative', zIndex: 1, fontWeight: 800, fontSize: 16, color: s.color }}>{s.value}</Typography>
                        </Box>
                        <Typography fontSize={12} color="text.secondary">{s.label}</Typography>
                      </Box>
                    ))}
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper className="analytics-glass-card" sx={{ p: 3, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(20px)', boxShadow: '0 8px 32px rgba(0,0,0,0.06)' }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 4, height: 20, borderRadius: 2, background: 'linear-gradient(180deg, #ec4899, #f472b6)' }} />
                    Top Users
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    {topUsers.length > 0 ? topUsers.map((u, i) => (
                      <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.2, borderRadius: 2, bgcolor: i % 2 === 0 ? 'rgba(99,102,241,0.04)' : 'transparent' }}>
                        <Box sx={{ width: 32, height: 32, borderRadius: '50%', background: COLORS[i], color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, boxShadow: `0 4px 10px ${COLORS[i]}40` }}>{u.name[0]}</Box>
                        <Box sx={{ flex: 1 }}><Typography fontWeight={600} fontSize={14}>{u.name}</Typography></Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box sx={{ width: 80, height: 6, borderRadius: 3, bgcolor: '#f3f4f6', overflow: 'hidden' }}>
                            <Box sx={{ height: '100%', borderRadius: 3, background: `linear-gradient(90deg, ${COLORS[i]}, ${COLORS[i]}88)`, width: `${(u.messages / Math.max(topUsers[0].messages, 1)) * 100}%`, transition: 'width 0.5s' }} />
                          </Box>
                          <Typography fontSize={12} color="text.secondary" sx={{ minWidth: 60, textAlign: 'right' }}>{u.messages} msgs</Typography>
                        </Box>
                      </Box>
                    )) : <Box sx={{ py: 6, textAlign: 'center' }}><Typography color="text.secondary">No user data</Typography></Box>}
                  </Box>
                </Paper>
              </Grid>
            </Grid>

            {/* Insights */}
            {(() => {
              const insights = [
                total > 0 && `📊 Total ${total} conversations with ${msgs} messages in the last ${days} days.`,
                active > 0 && `💬 ${active} conversations are currently active.`,
                live > 0 && `🔴 ${live} conversations awaiting live agent.`,
                closed > 0 && `✅ ${closed} conversations closed (${closedRate}% closure rate).`,
                topUsers.length > 0 && `🏆 ${topUsers[0].name} is the most active user with ${topUsers[0].messages} messages.`,
                dailyChartData.length > 0 && `📈 Peak day: ${dailyChartData.reduce((a, b) => a.conversations > b.conversations ? a : b).date} with ${Math.max(...daily.values)} conversations.`,
              ].filter(Boolean);
              return insights.length > 0 ? (
                <Paper className="analytics-glass-card" sx={{ p: 3, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(20px)', boxShadow: '0 8px 32px rgba(0,0,0,0.06)' }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 4, height: 20, borderRadius: 2, background: 'linear-gradient(180deg, #8b5cf6, #6366f1)' }} />
                    Insights
                  </Typography>
                  <Grid container spacing={1.5}>
                    {insights.map((text, i) => (
                      <Grid item xs={12} sm={6} key={i}>
                        <Paper sx={{ p: 1.5, borderRadius: 2, bgcolor: 'rgba(99,102,241,0.04)', border: '1px solid rgba(99,102,241,0.1)' }}>
                          <Typography fontSize={13}>{text}</Typography>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </Paper>
              ) : null;
            })()}
          </>
        )}
      </Box>
    </Box>
  );
};

export default Analytics;
