import React from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  Avatar,
  Stack
} from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import PeopleIcon from '@mui/icons-material/People';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import BarChartIcon from '@mui/icons-material/BarChart';
import SettingsIcon from '@mui/icons-material/Settings';


const Dashboard = () => {
  return (
    <Box sx={{ background: '#F6F9FF', padding: '20px', borderRadius: '10px', }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
        Welcome, Admin 👋
      </Typography>
      <Typography variant="subtitle1" gutterBottom sx={{ color: 'gray' }}>
        Here’s a quick summary of your chatbot performance.
      </Typography>

      {/* 🟢 Summary Cards with Icons */}
      <Grid container spacing={3} mt={2}>
        {[
          {
            title: 'Total Chats',
            value: '1,204',
            color: '#3ca344',
            icon: <ChatIcon fontSize="large" />
          },
          {
            title: 'Total Users',
            value: '865',
            color: '#1976d2',
            icon: <PeopleIcon fontSize="large" />
          },
          {
            title: 'Total Leads',
            value: '147',
            color: '#f57c00',
            icon: <AssignmentIndIcon fontSize="large" />
          },
          {
            title: 'Analytics',
            value: '4 Graphs',
            color: '#9c27b0',
            icon: <BarChartIcon fontSize="large" />
          },
          {
            title: 'Settings',
            value: '4 Modules',
            color: '#607d8b',
            icon: <SettingsIcon fontSize="large" />
          }
        ].map((item, i) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
            <Paper
              elevation={4}
              sx={{
                p: 3,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                borderRadius: 3,
                color: '#fff',
                backgroundColor: item.color,
                transition: 'transform 0.2s ease-in-out',
                '&:hover': { transform: 'scale(1.03)' }
              }}
            >
              <Avatar sx={{ bgcolor: '#fff', color: item.color }}>{item.icon}</Avatar>
              <Box>
                <Typography variant="subtitle2">{item.title}</Typography>
                <Typography variant="h5" fontWeight={700}>
                  {item.value}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>


      {/* 🔄 Middle Section */}
      <Grid container spacing={3} mt={4}>
        {/* 📩 Recent Chats */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" gutterBottom>
              📩 Recent Chats
            </Typography>
            <List dense>
              {['Amit Sharma', 'Riya Mehta', 'Deep Patel', 'Sneha Verma'].map((name, i) => (
                <ListItem key={i}>
                  <ListItemText
                    primary={name}
                    secondary="Hi, I need help with your chatbot..."
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* 📊 Lead Overview */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" gutterBottom>
              📈 Lead Capture Overview
            </Typography>
            <Typography variant="body1" mb={1}>This Month: <b>52</b> new leads</Typography>
            <Typography variant="body1">Last Month: <b>38</b></Typography>
            <Divider sx={{ my: 2 }} />
            <Chip label="Conversion Rate: 23%" color="success" variant="outlined" />
          </Paper>
        </Grid>
      </Grid>

      {/* 🔽 Bottom Section */}
      <Grid container spacing={3} mt={3}>
        {/* 👥 Top Active Users */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6">👥 Top Active Users</Typography>
            <List dense>
              {['Prakash D.', 'Sonal P.', 'Zaid Khan'].map((user, i) => (
                <ListItem key={i}>
                  <ListItemText primary={user} secondary="Active in last 24 hours" />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* 🛠 System Logs */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6">🛠 System Logs</Typography>
            <List dense>
              {[
                '✅ New user added: amit@gmail.com',
                '✏️ Admin updated chatbot response',
                '💾 System backup completed'
              ].map((log, i) => (
                <ListItem key={i}>
                  <ListItemText primary={log} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* 🚧 Coming Soon */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6">🚧 Upcoming Features</Typography>
            <List dense>
              <ListItem><ListItemText primary="✅ Chat Filters & Search" /></ListItem>
              <ListItem><ListItemText primary="✅ Firebase Login" /></ListItem>
              <ListItem><ListItemText primary="✅ Export Leads to CSV" /></ListItem>
              <ListItem><ListItemText primary="✅ Notification Alerts" /></ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
