import React, { useEffect, useState } from 'react';
import {
  Grid, Paper, Typography, Box, Button, MenuItem, Select, Divider, Dialog,
  DialogTitle, DialogContent, DialogActions, CircularProgress
} from '@mui/material';
import InsertChartIcon from '@mui/icons-material/InsertChart';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import BarChartIcon from '@mui/icons-material/BarChart';
import PieChartIcon from '@mui/icons-material/PieChart';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import InsightsIcon from '@mui/icons-material/Insights';
import axios from 'axios';

const API = (process.env.REACT_APP_AUTH_API || 'http://localhost:5000/api/auth').replace('/api/auth', '/api/analytics');
const getToken = () => { try { const u = localStorage.getItem('user'); return u ? JSON.parse(u)?.token : null; } catch { return null; } };

function SimpleBar({ data, labels, color = '#6366f1', height = 180 }) {
  const max = Math.max(...data, 1);
  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 0.6, height, px: 1 }}>
      {data.map((v, i) => (
        <Box key={i} sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.3 }}>
          <Typography fontSize={10} color="text.secondary">{v}</Typography>
          <Box sx={{ width: '100%', bgcolor: color, borderRadius: '4px 4px 0 0', transition: 'height 0.3s', height: `${(v / max) * (height - 40)}px`, minHeight: v > 0 ? 4 : 0 }} />
          <Typography fontSize={9} color="text.secondary" sx={{ writingMode: 'vertical-lr', textOrientation: 'mixed', fontSize: 8 }}>{labels[i].slice(5)}</Typography>
        </Box>
      ))}
    </Box>
  );
}

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(7);
  const [openInsights, setOpenInsights] = useState(false);

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

  const handleDaysChange = (e) => { setDays(e.target.value); };

  const total = data?.totalConversations || 0;
  const msgs = data?.totalMessages || 0;
  const active = data?.statusBreakdown?.active || 0;
  const closed = data?.statusBreakdown?.closed || 0;
  const live = data?.statusBreakdown?.live_requested || 0;
  const topUsers = data?.topUsers || [];
  const daily = data?.dailyConversations || { labels: [], values: [] };

  const insights = [
    total > 0 && `📊 Total ${total} conversations in the last ${days} days with ${msgs} messages.`,
    active > 0 && `💬 ${active} conversations are currently active.`,
    live > 0 && `🔴 ${live} conversations are requesting live agent.`,
    closed > 0 && `✅ ${closed} conversations have been closed.`,
    topUsers.length > 0 && `🏆 Top user: ${topUsers[0].name} with ${topUsers[0].messages} messages.`,
    daily.values.length > 0 && `📈 Peak day: ${daily.labels[daily.values.indexOf(Math.max(...daily.values))]} with ${Math.max(...daily.values)} conversations.`,
  ].filter(Boolean);

  return (
    <Box sx={{ padding: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { xs: 'flex-start', md: 'center' }, justifyContent: 'space-between', gap: 2, mb: 3 }}>
        <Select value={days} onChange={handleDaysChange} size="small">
          <MenuItem value={7}>Last 7 Days</MenuItem>
          <MenuItem value={30}>Last 30 Days</MenuItem>
          <MenuItem value={90}>Last 3 Months</MenuItem>
        </Select>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" onClick={() => { const e = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }); const a = document.createElement('a'); a.href = URL.createObjectURL(e); a.download = `analytics-${days}d.json`; a.click(); }}>EXPORT REPORT</Button>
          <Button variant="contained" onClick={() => setOpenInsights(true)}>GENERATE INSIGHTS</Button>
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress /></Box>
      ) : (
        <>
          {/* KPI Cards */}
          <Grid container spacing={3} mb={3}>
            {[
              { title: 'Total Conversations', value: total.toLocaleString(), subtitle: `In last ${days} days`, icon: <InsertChartIcon fontSize="large" color="primary" />, color: '#e3f2fd' },
              { title: 'Total Messages', value: msgs.toLocaleString(), subtitle: `${(msgs / Math.max(total, 1)).toFixed(1)} avg per conversation`, icon: <GroupAddIcon fontSize="large" sx={{ color: 'purple' }} />, color: '#f3e5f5' },
              { title: 'Active Chats', value: active.toLocaleString(), subtitle: `${((active / Math.max(total, 1)) * 100).toFixed(0)}% of total`, icon: <TrendingUpIcon fontSize="large" sx={{ color: 'green' }} />, color: '#e8f5e9' },
              { title: 'Top User', value: topUsers[0]?.name || '—', subtitle: topUsers[0] ? `${topUsers[0].messages} messages` : 'No data', icon: <EmojiEventsIcon fontSize="large" sx={{ color: 'orange' }} />, color: '#fff3e0' },
            ].map((item, i) => (
              <Grid item xs={12} sm={6} md={3} key={i}>
                <Paper elevation={4} sx={{ p: 2, height: '100%', borderRadius: 4, backgroundColor: item.color, transition: '0.3s', '&:hover': { transform: 'scale(1.03)' } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>{item.icon}<Typography variant="subtitle1" fontWeight="bold">{item.title}</Typography></Box>
                  <Typography variant="h4" fontWeight="bold">{item.value}</Typography>
                  <Typography color="text.secondary">{item.subtitle}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>

          {/* Charts */}
          <Grid container spacing={3} mb={3}>
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}><BarChartIcon color="primary" /><Typography variant="h6">Conversations per Day</Typography></Box>
                {daily.values.length > 0 ? <SimpleBar data={daily.values} labels={daily.labels} /> : <Box sx={{ height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Typography color="text.secondary">No data</Typography></Box>}
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}><PieChartIcon color="secondary" /><Typography variant="h6">Status Breakdown</Typography></Box>
                <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', alignItems: 'center', height: 180 }}>
                  {[
                    { label: 'Active', value: active, color: '#4caf50' },
                    { label: 'Closed', value: closed, color: '#9e9e9e' },
                    { label: 'Live Requested', value: live, color: '#ff9800' },
                  ].filter(s => s.value > 0).map(s => {
                    const pct = ((s.value / Math.max(total, 1)) * 100).toFixed(0);
                    return (
                      <Box key={s.label} sx={{ textAlign: 'center' }}>
                        <Box sx={{ width: 64, height: 64, borderRadius: '50%', border: `6px solid ${s.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 1 }}>
                          <Typography fontWeight={700} fontSize={18}>{pct}%</Typography>
                        </Box>
                        <Typography fontSize={12} fontWeight={600}>{s.label}</Typography>
                        <Typography fontSize={11} color="text.secondary">{s.value}</Typography>
                      </Box>
                    );
                  })}
                  {total === 0 && <Typography color="text.secondary">No data</Typography>}
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}><QueryStatsIcon color="success" /><Typography variant="h6">Message Stats</Typography></Box>
                <Box sx={{ height: 180, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 2, px: 3 }}>
                  <Box><Typography color="text.secondary" fontSize={13}>Total Messages</Typography><Typography variant="h5" fontWeight={700}>{msgs.toLocaleString()}</Typography></Box>
                  <Box><Typography color="text.secondary" fontSize={13}>Messages per Conversation</Typography><Typography variant="h5" fontWeight={700}>{(msgs / Math.max(total, 1)).toFixed(1)}</Typography></Box>
                  <Box><Typography color="text.secondary" fontSize={13}>Closed Rate</Typography><Typography variant="h5" fontWeight={700}>{((closed / Math.max(total, 1)) * 100).toFixed(0)}%</Typography></Box>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}><AccessTimeIcon color="warning" /><Typography variant="h6">Top Users</Typography></Box>
                <Box sx={{ height: 180, overflowY: 'auto' }}>
                  {topUsers.length > 0 ? topUsers.map((u, i) => (
                    <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 0.8, px: 1, borderBottom: '1px solid #f0f0f0' }}>
                      <Box sx={{ width: 28, height: 28, borderRadius: '50%', bgcolor: ['#6366f1', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6'][i], color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>{u.name[0]}</Box>
                      <Box sx={{ flex: 1 }}><Typography fontSize={13} fontWeight={600}>{u.name}</Typography></Box>
                      <Typography fontSize={12} color="text.secondary">{u.messages} msgs</Typography>
                    </Box>
                  )) : <Typography color="text.secondary" sx={{ textAlign: 'center', py: 6 }}>No user data</Typography>}
                </Box>
              </Paper>
            </Grid>
          </Grid>

          {/* Generated Insights */}
          {insights.length > 0 && (
            <Paper elevation={4} sx={{ mt: 4, p: 3, borderRadius: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}><InsightsIcon color="primary" /><Typography variant="h6">Generated Insights</Typography></Box>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                {insights.map((text, i) => (
                  <Grid item xs={12} sm={6} key={i}>
                    <Paper variant="outlined" sx={{ p: 2, borderRadius: 3 }}><Typography>{text}</Typography></Paper>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          )}
        </>
      )}

      {/* Insights Dialog */}
      <Dialog open={openInsights} onClose={() => setOpenInsights(false)} maxWidth="sm" fullWidth>
        <DialogTitle>📊 Analytics Insights</DialogTitle>
        <DialogContent dividers>
          <ul style={{ lineHeight: '1.8', marginLeft: '1rem' }}>
            {insights.map((text, i) => <li key={i}>{text}</li>)}
            {insights.length === 0 && <li>No data available for insights.</li>}
          </ul>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenInsights(false)} variant="contained" color="primary">Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Analytics;
