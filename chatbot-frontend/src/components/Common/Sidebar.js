import React, { useState, useEffect } from 'react';
import './style.css';
import {
  Drawer, List, ListItemButton, ListItemIcon, ListItemText,
  Collapse, Box, Select, MenuItem, FormControl, Typography, Divider,
} from '@mui/material';
import { getBots } from '../../api/botApi';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import WidgetsIcon from '@mui/icons-material/Widgets';
import GroupIcon from '@mui/icons-material/Group';
import ShareIcon from '@mui/icons-material/Share';
import BuildIcon from '@mui/icons-material/Build';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SwapCallsIcon from '@mui/icons-material/SwapCalls';
import DownloadIcon from '@mui/icons-material/Download';
import BarChartIcon from '@mui/icons-material/BarChart';
import SettingsIcon from '@mui/icons-material/Settings';
import PeopleIcon from '@mui/icons-material/People';
import ChatIcon from '@mui/icons-material/Chat';
import AssignmentIcon from '@mui/icons-material/Assignment';
import LogoutIcon from '@mui/icons-material/Logout';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import DnsIcon from '@mui/icons-material/Dns';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import logo from "../../assets/images/bot-logo-blue.png";
import { useLocation, useNavigate } from 'react-router-dom';

const PRIMARY_COLOR = '#6366f1';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openDropdown, setOpenDropdown] = useState(null);
  const [bots, setBots] = useState([]);
  const [selectedBot, setSelectedBot] = useState(localStorage.getItem('selectedBotId') || '');

  useEffect(() => {
    getBots()
      .then(setBots)
      .catch(() => {});
  }, []);

  useEffect(() => {
    localStorage.setItem('selectedBotId', selectedBot || '');
  }, [selectedBot]);

  const handleBotChange = (event) => {
    const botId = event.target.value;
    setSelectedBot(botId);
  };

  const toggleDropdown = (text) => {
    setOpenDropdown(openDropdown === text ? null : text);
  };

  const isActive = (path) => {
    const fullPath = path.startsWith('/app') ? path : `/app${path}`;
    return location.pathname === fullPath;
  };

  const mode1Items = [
    { text: 'Bot', icon: <DnsIcon />, path: '/app/dashboard' },
    { text: 'AI Agents', icon: <SmartToyIcon />, path: '/app/ai-agents' },
    { text: 'Templates', icon: <WidgetsIcon />, path: '/app/templates' },
    { text: 'Partners', icon: <GroupIcon />, path: '/app/partners' },
    { text: 'Referral', icon: <ShareIcon />, path: '/app/referral' },
  ];

  const mode2Items = [
    {
      text: 'Setups',
      icon: <BuildIcon />,
      children: [
        { text: 'View Setup', icon: <VisibilityIcon />, path: '/app/setup' },
        { text: 'Flow Setup', icon: <SwapCallsIcon />, path: '/app/flow-setup' },
        { text: 'Install', icon: <DownloadIcon />, path: '/app/install' },
      ],
    },
    { text: 'Analytics', icon: <BarChartIcon />, path: '/app/analytics' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/app/settings' },
    { text: 'Users', icon: <PeopleIcon />, path: '/app/users' },
    { text: 'Chats', icon: <ChatIcon />, path: '/app/chats' },
    { text: 'Bot Answers', icon: <AssignmentIcon />, path: '/app/answers' },
    { text: 'Leads', icon: <ContactMailIcon />, path: '/app/leads' },
    { text: 'Logout', icon: <LogoutIcon />, path: '/app/logout' },
  ];

  const renderItem = (item) => {
    const sel = item.children
      ? item.children.some(c => isActive(c.path))
      : isActive(item.path);
    const isOpen = openDropdown === item.text;

    return (
      <React.Fragment key={item.text}>
        <ListItemButton
          onClick={() =>
            item.children
              ? toggleDropdown(item.text)
              : navigate(item.path)
          }
          selected={sel && !item.children}
          sx={{
            borderRadius: 2, mb: 0.3, px: 1.5, py: 0.8,
            '&.Mui-selected': {
              background: `linear-gradient(90deg, ${PRIMARY_COLOR}12 0%, ${PRIMARY_COLOR}06 100%)`,
            },
            '&:hover': { bgcolor: 'rgba(99,102,241,0.06)' },
          }}
        >
          <ListItemIcon sx={{ minWidth: 36, color: sel ? PRIMARY_COLOR : '#6b7280' }}>
            <Box sx={{
              width: 30, height: 30, borderRadius: '9px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              bgcolor: sel ? `${PRIMARY_COLOR}14` : 'transparent',
            }}>
              {item.icon}
            </Box>
          </ListItemIcon>
          <ListItemText
            primary={item.text}
            primaryTypographyProps={{
              fontSize: 13, fontWeight: sel ? 700 : 500,
              color: sel ? PRIMARY_COLOR : '#374151',
            }}
          />
          {item.children && (isOpen ? <ExpandLess sx={{ fontSize: 18, color: '#9ca3af' }} /> : <ExpandMore sx={{ fontSize: 18, color: '#9ca3af' }} />)}
        </ListItemButton>
        {item.children && (
          <Collapse in={isOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding sx={{ pl: 0.5 }}>
              {item.children.map((child) => {
                const childSel = isActive(child.path);
                return (
                  <ListItemButton
                    key={child.text}
                    onClick={() => navigate(child.path)}
                    selected={childSel}
                    sx={{
                      borderRadius: 1.5, mb: 0.2, pl: 3.5, py: 0.5,
                      '&.Mui-selected': { background: `linear-gradient(90deg, ${PRIMARY_COLOR}0e 0%, ${PRIMARY_COLOR}04 100%)` },
                      '&:hover': { bgcolor: 'rgba(99,102,241,0.05)' },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 28, color: childSel ? PRIMARY_COLOR : '#9ca3af' }}>
                      <Box sx={{
                        width: 24, height: 24, borderRadius: '7px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        bgcolor: childSel ? `${PRIMARY_COLOR}14` : 'transparent',
                      }}>
                        {child.icon}
                      </Box>
                    </ListItemIcon>
                    <ListItemText
                      primary={child.text}
                      primaryTypographyProps={{
                        fontSize: 12, fontWeight: childSel ? 700 : 500,
                        color: childSel ? PRIMARY_COLOR : '#4b5563',
                      }}
                    />
                  </ListItemButton>
                );
              })}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    );
  };

  const selectedBotName = bots.find(b => b._id === selectedBot)?.name || '';

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        position: 'fixed', width: 200, zIndex: 10000, flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 200, boxSizing: 'border-box',
          background: 'linear-gradient(180deg, #f8faff 0%, #f0f4ff 40%, #faf5ff 100%)',
          borderRight: '1px solid rgba(229,231,235,0.5)',
          boxShadow: '2px 0 20px rgba(0,0,0,0.04)',
        },
      }}
    >
      <Box sx={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        py: 2.5, px: 2, borderBottom: '1px solid rgba(243,244,246,0.8)',
      }}>
        <img style={{ width: '100px', filter: 'drop-shadow(0 2px 4px rgba(79,70,229,0.15))' }} src={logo} alt="Smart Bot Logo" />
      </Box>

      {bots.length > 0 && (
        <Box sx={{ px: 1.5, py: 1 }}>
          <Typography sx={{ fontSize: 11, fontWeight: 600, color: '#9ca3af', mb: 0.5, px: 0.5 }}>
            {selectedBot ? 'ACTIVE BOT' : 'SELECT BOT'}
          </Typography>
          <FormControl fullWidth size="small">
            <Select
              value={selectedBot}
              onChange={handleBotChange}
              displayEmpty
              renderValue={(val) => {
                if (!val) return <Typography sx={{ fontSize: 12, color: '#9ca3af' }}>Select a bot...</Typography>;
                const bot = bots.find(b => b._id === val);
                return (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <SmartToyIcon sx={{ fontSize: 15, color: PRIMARY_COLOR }} />
                    <Typography sx={{ fontSize: 12, fontWeight: 600 }}>{bot?.name}</Typography>
                  </Box>
                );
              }}
              sx={{
                height: 32, fontSize: 12, borderRadius: 1.5,
                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e5e7eb' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: PRIMARY_COLOR },
                bgcolor: selectedBot ? '#f0f4ff' : 'transparent',
              }}
            >
              {bots.map((bot) => (
                <MenuItem key={bot._id} value={bot._id} sx={{ fontSize: 13 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <SmartToyIcon sx={{ fontSize: 15, color: PRIMARY_COLOR }} />
                    {bot.name}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      )}

      {selectedBot ? (
        <List sx={{ px: 1, pt: 1 }}>
          {mode2Items.map(renderItem)}
        </List>
      ) : (
        <List sx={{ px: 1, pt: 1 }}>
          {mode1Items.map(renderItem)}
        </List>
      )}
    </Drawer>
  );
};

export default Sidebar;
