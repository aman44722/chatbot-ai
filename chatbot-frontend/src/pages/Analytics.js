import React, { useEffect, useState, useRef, useMemo } from 'react';
import {
  Grid, Paper, Typography, Box, Button, MenuItem, Select, CircularProgress, Chip
} from '@mui/material';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import DownloadIcon from '@mui/icons-material/Download';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import PeopleIcon from '@mui/icons-material/People';
import ForumIcon from '@mui/icons-material/Forum';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import RefreshIcon from '@mui/icons-material/Refresh';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ScheduleIcon from '@mui/icons-material/Schedule';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import axios from 'axios';
import '../styles/analytics.css';

const API = (process.env.REACT_APP_AUTH_API || 'http://localhost:5000/api/auth').replace('/api/auth', '/api/analytics');
const getToken = () => { try { const u = localStorage.getItem('user'); return u ? JSON.parse(u)?.token : null; } catch { return null; } };

const COLORS = ['#6366f1', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#ec4899', '#0ea5e9'];

function AnimatedCount({ value, suffix = '', prefix = '' }) {
  const [display, setDisplay] = useState('0');
  const ref = useRef(null);

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

  return <span ref={ref}>{prefix}{display}{suffix}</span>;
}

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
  const topUsers = useMemo(() => data?.topUsers || [], [data]);
  const daily = useMemo(() => data?.dailyConversations || { labels: [], values: [] }, [data]);

  const dailyChartData = useMemo(() => daily.labels.map((l, i) => ({ date: l.slice(5), conversations: daily.values[i] })), [daily]);

  const statusPieData = useMemo(() => [
    { name: 'Active', value: active, color: '#10b981' },
    { name: 'Closed', value: closed, color: '#6b7280' },
    { name: 'Live Requested', value: live, color: '#f59e0b' },
  ].filter(d => d.value > 0), [active, closed, live]);

  const msgAvg = total > 0 ? (msgs / total).toFixed(1) : '0';
  const closedRate = total > 0 ? ((closed / total) * 100).toFixed(0) : '0';

  const kpis = useMemo(() => [
    { label: 'Total Conversations', value: total, sub: `In last ${days} days`, icon: <ForumIcon />, gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)', dark: '#4f46e5', light: '#eef2ff', chartColor: '#6366f1', chartData: dailyChartData.slice(-7) },
    { label: 'Total Messages', value: msgs, sub: `${msgAvg} avg per chat`, icon: <AutoGraphIcon />, gradient: 'linear-gradient(135deg, #f59e0b, #f97316)', dark: '#d97706', light: '#fffbeb', chartColor: '#f59e0b', chartData: null },
    { label: 'Active Chats', value: active, sub: `${closedRate}% closure rate`, icon: <PeopleIcon />, gradient: 'linear-gradient(135deg, #10b981, #34d399)', dark: '#059669', light: '#ecfdf5', chartColor: '#10b981', chartData: null },
    { label: 'Top User', value: topUsers[0]?.messages || 0, sub: topUsers[0]?.name || 'No data', icon: <EmojiEventsIcon />, gradient: 'linear-gradient(135deg, #ec4899, #f472b6)', dark: '#db2777', light: '#fdf2f8', chartColor: '#ec4899', chartData: null },
  ], [total, msgs, active, closedRate, days, topUsers, dailyChartData, msgAvg]);

  const statusBar = [
    { label: 'Active', value: active, total, color: '#10b981', icon: <CheckCircleIcon sx={{ fontSize: 16 }} /> },
    { label: 'Live', value: live, total, color: '#f59e0b', icon: <ScheduleIcon sx={{ fontSize: 16 }} /> },
    { label: 'Closed', value: closed, total, color: '#6b7280', icon: <CheckCircleIcon sx={{ fontSize: 16 }} /> },
  ];

  return (
    <Box className="analytics-water-bg" sx={{ minHeight: '100%', p: { xs: 2, md: 3 } }}>
      <Box className="analytics-water-bg" sx={{ position: 'absolute', inset: 0, zIndex: 0, '&::before': { display: 'none' } }}>
        <Box className="analytics-orb" sx={{ width: 300, height: 300, background: 'radial-gradient(circle, rgba(99,102,241,0.12), transparent)', top: '-5%', right: '10%' }} />
        <Box className="analytics-orb" sx={{ width: 250, height: 250, background: 'radial-gradient(circle, rgba(139,92,246,0.1), transparent)', bottom: '10%', left: '5%' }} />
        <Box className="analytics-orb" sx={{ width: 200, height: 200, background: 'radial-gradient(circle, rgba(236,72,153,0.08), transparent)', top: '40%', left: '50%' }} />
      </Box>

      <Box className="analytics-content">
        {/* Top Status Bar */}
        <Paper sx={{ p: 2, mb: 3, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
            <Typography sx={{ fontWeight: 700, fontSize: 15, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#6366f1', animation: 'analyticsPulse 2s ease-in-out infinite' }} />
              Live Status
            </Typography>
            {statusBar.map(s => (
              <Box key={s.label} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box className="analytics-status-dot" sx={{ bgcolor: s.color }} />
                <Typography fontSize={13} color="text.secondary">{s.label}: <strong>{s.value}</strong></Typography>
              </Box>
            ))}
          </Box>
          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
            <Select value={days} onChange={(e) => setDays(e.target.value)} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.8)', borderRadius: 2, '& fieldset': { border: 'none' }, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', fontSize: 13 }}>
              <MenuItem value={7}>Last 7 Days</MenuItem>
              <MenuItem value={30}>Last 30 Days</MenuItem>
              <MenuItem value={90}>Last 3 Months</MenuItem>
            </Select>
            <Button variant="contained" size="small" startIcon={<RefreshIcon />} onClick={() => fetchAnalytics(days)} sx={{ borderRadius: 2, textTransform: 'none', bgcolor: '#6366f1', boxShadow: '0 4px 14px rgba(99,102,241,0.3)', fontSize: 13 }}>Refresh</Button>
            <Button variant="outlined" size="small" startIcon={<DownloadIcon />} onClick={() => { const e = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }); const a = document.createElement('a'); a.href = URL.createObjectURL(e); a.download = `analytics-${days}d.json`; a.click(); }} sx={{ borderRadius: 2, textTransform: 'none', borderColor: '#6366f1', color: '#6366f1', fontSize: 13 }}>Export</Button>
          </Box>
        </Paper>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 15, flexDirection: 'column', gap: 2 }}>
            <CircularProgress size={56} sx={{ color: '#6366f1' }} />
            <Typography color="text.secondary" sx={{ animation: 'analyticsPulse 2s ease-in-out infinite' }}>Loading analytics...</Typography>
          </Box>
        ) : (
          <>
            {/* Gradient KPIs with Mini Charts */}
            <Grid container spacing={2.5} mb={3}>
              {kpis.map((k, i) => (
                <Grid item xs={12} sm={6} md={3} key={i}>
                  <Paper className={`analytics-kpi-card analytics-count-in`} sx={{ p: 2.5, borderRadius: 3, background: k.gradient, color: '#fff', position: 'relative', overflow: 'hidden', minHeight: 140 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, opacity: 0.9 }}>
                        {React.cloneElement(k.icon, { sx: { fontSize: 20 } })}
                        <Typography fontSize={12} fontWeight={600}>{k.label}</Typography>
                      </Box>
                      <Chip label={days + 'd'} size="small" sx={{ height: 18, fontSize: 9, bgcolor: 'rgba(255,255,255,0.2)', color: '#fff', fontWeight: 700 }} />
                    </Box>
                    <Typography variant="h3" sx={{ fontWeight: 800, lineHeight: 1.1, fontSize: { xs: 28, md: 32 } }}>
                      {i === 3 ? (
                        <span>{topUsers[0]?.name || '—'}</span>
                      ) : (
                        <AnimatedCount value={k.value} />
                      )}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                      <TrendingUpIcon sx={{ fontSize: 14, opacity: 0.8 }} />
                      <Typography sx={{ opacity: 0.85, fontSize: 12 }}>{k.sub}</Typography>
                    </Box>
                    {k.chartData && k.chartData.length > 1 && (
                      <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 40, opacity: 0.15 }}>
                        <ResponsiveContainer width="100%" height={40}>
                          <AreaChart data={k.chartData}>
                            <Area type="monotone" dataKey="conversations" stroke="#fff" strokeWidth={2} fill="#fff" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </Box>
                    )}
                  </Paper>
                </Grid>
              ))}
            </Grid>

            {/* Charts Row 1 */}
            <Grid container spacing={2.5} mb={3}>
              <Grid item xs={12} md={7}>
                <Paper className="analytics-glass-card" sx={{ p: 3, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.5)' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 4, height: 22, borderRadius: 2, background: 'linear-gradient(180deg, #6366f1, #8b5cf6)' }} />
                      Conversations Trend
                    </Typography>
                    <Chip label={`${dailyChartData.reduce((a, b) => a + b.conversations, 0)} total`} size="small" sx={{ bgcolor: '#eef2ff', color: '#6366f1', fontWeight: 600, fontSize: 11 }} />
                  </Box>
                  {dailyChartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={dailyChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#6366f1" stopOpacity={0.25} />
                            <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} />
                        <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 8px 30px rgba(0,0,0,0.12)' }} />
                        <Area type="monotone" dataKey="conversations" stroke="#6366f1" strokeWidth={3} fill="url(#areaGrad)" dot={{ r: 4, fill: '#6366f1', stroke: '#fff', strokeWidth: 2 }} activeDot={{ r: 7, fill: '#6366f1', stroke: '#fff', strokeWidth: 2 }} />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Typography color="text.secondary">No conversation data yet</Typography></Box>}
                </Paper>
              </Grid>
              <Grid item xs={12} md={5}>
                <Paper className="analytics-glass-card" sx={{ p: 3, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.5)' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 4, height: 22, borderRadius: 2, background: 'linear-gradient(180deg, #f59e0b, #f97316)' }} />
                      Status Breakdown
                    </Typography>
                    <Chip label={`${total} total`} size="small" sx={{ bgcolor: '#fffbeb', color: '#f59e0b', fontWeight: 600, fontSize: 11 }} />
                  </Box>
                  {statusPieData.length > 0 ? (
                    <>
                      <ResponsiveContainer width="100%" height={260}>
                        <PieChart>
                          <Pie data={statusPieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3} dataKey="value" stroke="none">
                            {statusPieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                          </Pie>
                          <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 8px 30px rgba(0,0,0,0.12)' }} />
                        </PieChart>
                      </ResponsiveContainer>
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2.5, mt: 0.5 }}>
                        {statusPieData.map(s => (
                          <Box key={s.name} sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                            <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: s.color, boxShadow: `0 0 8px ${s.color}60` }} />
                            <Typography fontSize={12} color="text.secondary">{s.name}</Typography>
                            <Typography fontSize={12} fontWeight={700}>{s.value}</Typography>
                          </Box>
                        ))}
                      </Box>
                    </>
                  ) : <Box sx={{ height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Typography color="text.secondary">No status data yet</Typography></Box>}
                </Paper>
              </Grid>
            </Grid>

            {/* Charts Row 2 */}
            <Grid container spacing={2.5} mb={3}>
              <Grid item xs={12} md={6}>
                <Paper className="analytics-glass-card" sx={{ p: 3, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.5)' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 4, height: 22, borderRadius: 2, background: 'linear-gradient(180deg, #10b981, #34d399)' }} />
                      Message Metrics
                    </Typography>
                  </Box>
                  <Grid container spacing={2}>
                    {[
                      { label: 'Total Messages', value: msgs, color: '#6366f1', pct: Math.min(msgs / Math.max(total, 1) * 10, 100) },
                      { label: 'Avg per Chat', value: parseFloat(msgAvg), color: '#f59e0b', pct: Math.min(parseFloat(msgAvg) * 20, 100) },
                      { label: 'Closed Rate', value: parseInt(closedRate), suffix: '%', color: '#10b981', pct: parseInt(closedRate) },
                    ].map((s, i) => (
                      <Grid item xs={4} key={i}>
                        <Box sx={{ textAlign: 'center', p: 1.5, bgcolor: `${s.color}08`, borderRadius: 2 }}>
                          <Box sx={{ width: 64, height: 64, borderRadius: '50%', mx: 'auto', mb: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg width="64" height="64" viewBox="0 0 64 64" style={{ position: 'absolute' }}>
                              <circle cx="32" cy="32" r="28" fill="none" stroke="#f3f4f6" strokeWidth="4" />
                              <circle cx="32" cy="32" r="28" fill="none" stroke={s.color} strokeWidth="4" strokeDasharray={`${(s.pct / 100) * 176} 176`} strokeLinecap="round" transform="rotate(-90 32 32)" style={{ transition: 'stroke-dasharray 1s ease' }} />
                            </svg>
                            <Typography sx={{ fontWeight: 800, fontSize: 16, color: s.color, zIndex: 1 }}>
                              {typeof s.value === 'number' ? <AnimatedCount value={s.value} suffix={s.suffix || ''} /> : s.value}
                            </Typography>
                          </Box>
                          <Typography fontSize={11} color="text.secondary">{s.label}</Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper className="analytics-glass-card" sx={{ p: 3, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.5)' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 4, height: 22, borderRadius: 2, background: 'linear-gradient(180deg, #ec4899, #f472b6)' }} />
                      Top Users
                    </Typography>
                    <Chip label={`${topUsers.length} users`} size="small" sx={{ bgcolor: '#fdf2f8', color: '#ec4899', fontWeight: 600, fontSize: 11 }} />
                  </Box>
                  {topUsers.length > 0 ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      {topUsers.map((u, i) => {
                        const barW = (u.messages / Math.max(topUsers[0].messages, 1)) * 100;
                        return (
                          <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.2, borderRadius: 2, bgcolor: i % 2 === 0 ? 'rgba(99,102,241,0.03)' : 'transparent' }}>
                            <Box sx={{ width: 34, height: 34, borderRadius: '50%', background: `linear-gradient(135deg, ${COLORS[i]}, ${COLORS[i]}cc)`, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, boxShadow: `0 4px 12px ${COLORS[i]}50`, flexShrink: 0 }}>{u.name[0]}</Box>
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                              <Typography fontWeight={600} fontSize={14} noWrap>{u.name}</Typography>
                              <Box sx={{ width: '100%', height: 5, borderRadius: 3, bgcolor: '#f3f4f6', overflow: 'hidden', mt: 0.3 }}>
                                <Box sx={{ height: '100%', borderRadius: 3, background: `linear-gradient(90deg, ${COLORS[i]}, ${COLORS[i]}88)`, width: `${barW}%`, transition: 'width 1s ease' }} />
                              </Box>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexShrink: 0 }}>
                              <Typography fontSize={13} fontWeight={700} color={COLORS[i]}>{u.messages}</Typography>
                              <Typography fontSize={11} color="text.secondary">msgs</Typography>
                            </Box>
                          </Box>
                        );
                      })}
                    </Box>
                  ) : <Box sx={{ py: 6, textAlign: 'center' }}><Typography color="text.secondary">No user activity yet</Typography></Box>}
                </Paper>
              </Grid>
            </Grid>

            {/* Insights */}
            {(() => {
              const insights = [
                total > 0 && { icon: '📊', text: `${total} conversations generated ${msgs} messages in ${days} days.` },
                active > 0 && { icon: '💬', text: `${active} conversations are currently active and awaiting responses.` },
                live > 0 && { icon: '🔴', text: `${live} users are currently waiting for a live agent.` },
                closed > 0 && { icon: '✅', text: `${closed} conversations closed (${closedRate}% closure rate).` },
                topUsers.length > 0 && { icon: '🏆', text: `${topUsers[0].name} is the most active with ${topUsers[0].messages} messages.` },
                dailyChartData.length > 0 && (() => {
                  const peak = dailyChartData.reduce((a, b) => a.conversations > b.conversations ? a : b);
                  return { icon: '📈', text: `Peak on ${peak.date} with ${peak.conversations} conversations.` };
                })(),
              ].filter(Boolean);
              return insights.length > 0 ? (
                <Paper className="analytics-glass-card" sx={{ p: 3, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.5)' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}>
                    <Box sx={{ width: 4, height: 22, borderRadius: 2, background: 'linear-gradient(180deg, #8b5cf6, #6366f1)' }} />
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>AI Insights</Typography>
                    <Chip label="Auto-generated" size="small" sx={{ bgcolor: '#f3e8ff', color: '#8b5cf6', fontWeight: 600, fontSize: 10, height: 20 }} />
                  </Box>
                  <Grid container spacing={1.5}>
                    {insights.map((item, i) => (
                      <Grid item xs={12} sm={6} key={i}>
                        <Paper sx={{ p: 1.8, borderRadius: 2, bgcolor: 'rgba(99,102,241,0.03)', border: '1px solid rgba(99,102,241,0.08)', display: 'flex', alignItems: 'flex-start', gap: 1.2 }}>
                          <Typography sx={{ fontSize: 18, lineHeight: 1.4 }}>{item.icon}</Typography>
                          <Typography fontSize={13} color="text.secondary" sx={{ lineHeight: 1.5 }}>{item.text}</Typography>
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
