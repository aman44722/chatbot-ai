import React, { useState } from 'react';
import {
  Grid, Paper, Typography, Box, Button, MenuItem, Select, Divider, Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
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




const Analytics = () => {
  const [openInsights, setOpenInsights] = useState(false);

  return (
    <Box sx={{ padding: 3 }}>
      {/* Header Section */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'flex-start', md: 'center' },
          justifyContent: 'space-between',
          gap: 2,
          mb: 3,
        }}
      >
        <Select defaultValue={7} size="small">
          <MenuItem value={7}>Last 7 Days</MenuItem>
          <MenuItem value={30}>Last 30 Days</MenuItem>
          <MenuItem value={90}>Last 3 Months</MenuItem>
        </Select>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined">EXPORT REPORT</Button>
          <Button variant="contained" onClick={() => setOpenInsights(true)}>
            GENERATE INSIGHTS
          </Button>


        </Box>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={3} mb={3}>
        {[
          {
            title: 'Daily Chat Volume',
            value: '1,204',
            subtitle: 'Total Chats Today',
            icon: <InsertChartIcon fontSize="large" color="primary" />,
            color: '#e3f2fd',
          },
          {
            title: 'User Growth',
            value: '+48',
            subtitle: 'New Users This Week',
            icon: <GroupAddIcon fontSize="large" sx={{ color: 'purple' }} />,
            color: '#f3e5f5',
          },
          {
            title: 'Lead Conversion',
            value: '28%',
            subtitle: 'Converted from Chat',
            icon: <TrendingUpIcon fontSize="large" sx={{ color: 'green' }} />,
            color: '#e8f5e9',
          },
          {
            title: 'Top Users',
            value: 'Riya – 43 messages',
            subtitle: 'Amit – 39, Deep – 35',
            icon: <EmojiEventsIcon fontSize="large" sx={{ color: 'orange' }} />,
            color: '#fff3e0',
          },
        ].map((item, i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <Paper
              elevation={4}
              sx={{
                p: 2,
                height: '100%',
                borderRadius: 4,
                backgroundColor: item.color,
                transition: '0.3s',
                '&:hover': { transform: 'scale(1.03)' },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                {item.icon}
                <Typography variant="subtitle1" fontWeight="bold">
                  {item.title}
                </Typography>
              </Box>
              <Typography variant="h4" fontWeight="bold">
                {item.value}
              </Typography>
              <Typography color="text.secondary">{item.subtitle}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Charts Layout */}
      <Grid container spacing={3} mb={3}>
        {[
          {
            title: 'Message Trends',
            icon: <BarChartIcon color="primary" />,
            placeholder: 'Total Messages: 3,024\nPeak: 540 on Tuesday',
          },
          {
            title: 'Lead Source Breakdown',
            icon: <PieChartIcon color="secondary" />,
            placeholder: 'Website: 45%\nSocial Media: 35%\nReferrals: 20%',
          },
          {
            title: 'Session Duration',
            icon: <QueryStatsIcon color="success" />,
            placeholder: 'Avg Duration: 5 min\nLongest: 14 min',
          },
          {
            title: 'Hourly Chat Activity',
            icon: <AccessTimeIcon color="warning" />,
            placeholder: 'Peak Hours: 12PM-2PM\nLowest: 3AM-5AM',
          },
        ].map((chart, i) => (
          <Grid item xs={12} md={6} key={i}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 3, minHeight: 300 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                {chart.icon}
                <Typography variant="h6">{chart.title}</Typography>
              </Box>
              <Box
                sx={{
                  width: '100%',
                  height: 230,
                  border: '2px dashed #ccc',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  whiteSpace: 'pre-line',
                }}
              >
                <Typography color="text.secondary">{chart.placeholder}</Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Generate Insights */}
      <Paper elevation={4} sx={{ mt: 4, p: 3, borderRadius: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <InsightsIcon color="primary" />
          <Typography variant="h6">Generated Insights</Typography>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={2}>
          {[
            '📊 Tuesday had the highest engagement with 540 chats.',
            '📈 User count increased by 12% this week.',
            '🎯 Conversion improved from 24% to 28%.',
            '⚠️ Referral traffic has the lowest conversion (8%).',
            '⏱️ Peak chat hours: 12PM–2PM | Lowest: 3AM–5AM.',
            '🤖 Auto-response needed during low hours.',
            '🏆 Riya Mehta – Top user with 43 messages.',
            '📌 22% of users returned for repeat interaction.',
          ].map((text, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <Paper variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
                <Typography>{text}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>



      </Paper>
      <Dialog open={openInsights} onClose={() => setOpenInsights(false)} maxWidth="sm" fullWidth>
        <DialogTitle>📊 Generated Insights</DialogTitle>
        <DialogContent dividers>
          <ul style={{ lineHeight: '1.8', marginLeft: '1rem' }}>
            <li><strong>🔼 Chat Activity:</strong> Chats peaked on Tuesday with 540 messages.</li>
            <li><strong>🧑‍🤝‍🧑 User Growth:</strong> You gained 48 new users this week — 15% more than last week.</li>
            <li><strong>📈 Lead Conversion:</strong> Chat-to-lead conversion rate is currently at 28%.</li>
            <li><strong>🏆 Most Active User:</strong> Riya Mehta with 43 messages.</li>
            <li><strong>🕒 Chat Timing:</strong> Highest activity between 12PM – 2PM.</li>
          </ul>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenInsights(false)} variant="contained" color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default Analytics;
