import React, { useState, useEffect } from 'react';
import './style.css';
import {
  Drawer, List, ListItemButton, ListItemIcon, ListItemText,
  Collapse, Box, Select, MenuItem, FormControl, Typography, Divider, IconButton, Tooltip,
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
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import SettingsIcon from '@mui/icons-material/Settings';
import PeopleIcon from '@mui/icons-material/People';
import ChatIcon from '@mui/icons-material/Chat';
import LogoutIcon from '@mui/icons-material/Logout';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import DnsIcon from '@mui/icons-material/Dns';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import MenuIcon from '@mui/icons-material/Menu';
import { useLocation, useNavigate } from 'react-router-dom';

const PRIMARY_COLOR = '#6366f1';

const COLLAPSED_W = 72;
const EXPANDED_W = 240;

const Sidebar = ({ collapsed, onToggle }) => {
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

  useEffect(() => {
    const stored = localStorage.getItem('selectedBotId');
    if (stored !== selectedBot) {
      setSelectedBot(stored || '');
    }
  }, [location.pathname]);

  const handleBotChange = (event) => {
    const botId = event.target.value;
    setSelectedBot(botId);
    localStorage.setItem('selectedBotId', botId);
    navigate('/app/dashboard');
  };

  const handleMode1Click = (path) => {
    setSelectedBot('');
    localStorage.removeItem('selectedBotId');
    navigate(path);
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
    { text: 'Plans', icon: <WorkspacePremiumIcon />, path: '/app/plans' },
    { text: 'Partners', icon: <GroupIcon />, path: '/app/partners' },
    { text: 'Referral', icon: <ShareIcon />, path: '/app/referral' },
    ...(isAdmin ? [{ text: 'User Management', icon: <AdminPanelSettingsIcon />, path: '/app/users/manage' }] : []),
  ];

  const mode2Items = [
    {
      text: 'Setup',
      icon: <BuildIcon />,
      children: [
        { text: 'View Setup', icon: <VisibilityIcon />, path: '/app/setup' },
        { text: 'Flow Setup', icon: <SwapCallsIcon />, path: '/app/flow-setup' },
        { text: 'Install', icon: <DownloadIcon />, path: '/app/install' },
      ],
    },
    { text: 'Chats', icon: <ChatIcon />, path: '/app/chats' },
    { text: 'Users', icon: <PeopleIcon />, path: '/app/users' },
    { text: 'Leads', icon: <ContactMailIcon />, path: '/app/leads' },
    { text: 'Analytics', icon: <BarChartIcon />, path: '/app/analytics' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/app/settings' },
    { text: 'Logout', icon: <LogoutIcon />, path: '/app/logout' },
  ];

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user?.role === 'admin';

  const isMode1Item = (item) => !item.children && mode1Items.some(m => m.path === item.path);

  const renderItem = (item) => {
    const sel = item.children
      ? item.children.some(c => isActive(c.path))
      : isActive(item.path);
    const isOpen = openDropdown === item.text;

    if (collapsed) {
      return (
        <React.Fragment key={item.text}>
          <Tooltip title={item.text} placement="right" arrow
            slotProps={{ popper: { sx: { '& .MuiTooltip-tooltip': { bgcolor: '#1f2937', fontSize: 12, fontWeight: 600, px: 1.5, py: 0.8, borderRadius: 1.5 } } } }}
          >
            <ListItemButton
              onClick={() => item.children ? toggleDropdown(item.text) : isMode1Item(item) ? handleMode1Click(item.path) : navigate(item.path)}
              selected={sel && !item.children}
              sx={{
                borderRadius: 2, mb: 0.3, px: 1, py: 0.8, justifyContent: 'center',
                '&.Mui-selected': { background: `${PRIMARY_COLOR}18` },
                '&:hover': { bgcolor: 'rgba(99,102,241,0.1)' },
              }}
            >
              <ListItemIcon sx={{ minWidth: 0, color: sel ? PRIMARY_COLOR : '#6b7280', justifyContent: 'center' }}>
                <Box sx={{
                  width: 32, height: 32, borderRadius: '9px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  bgcolor: sel ? `${PRIMARY_COLOR}18` : 'transparent',
                }}>
                  {item.icon}
                </Box>
              </ListItemIcon>
            </ListItemButton>
          </Tooltip>
          {item.children && (
            <Collapse in={isOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {item.children.map((child) => {
                  const childSel = isActive(child.path);
                  return (
                    <Tooltip key={child.text} title={child.text} placement="right" arrow
                      slotProps={{ popper: { sx: { '& .MuiTooltip-tooltip': { bgcolor: '#1f2937', fontSize: 12, fontWeight: 600, px: 1.5, py: 0.8, borderRadius: 1.5 } } } }}
                    >
                      <ListItemButton
                        onClick={() => navigate(child.path)}
                        selected={childSel}
                        sx={{
                          borderRadius: 1.5, mb: 0.2, px: 1, py: 0.5, justifyContent: 'center',
                          '&.Mui-selected': { background: `${PRIMARY_COLOR}18` },
                          '&:hover': { bgcolor: 'rgba(99,102,241,0.08)' },
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 0, color: childSel ? PRIMARY_COLOR : '#9ca3af', justifyContent: 'center' }}>
                          <Box sx={{
                            width: 26, height: 26, borderRadius: '7px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            bgcolor: childSel ? `${PRIMARY_COLOR}18` : 'transparent',
                          }}>
                            {child.icon}
                          </Box>
                        </ListItemIcon>
                      </ListItemButton>
                    </Tooltip>
                  );
                })}
              </List>
            </Collapse>
          )}
        </React.Fragment>
      );
    }

    return (
      <React.Fragment key={item.text}>
        <ListItemButton
          onClick={() =>
            item.children
              ? toggleDropdown(item.text)
              : isMode1Item(item)
                ? handleMode1Click(item.path)
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
                    {!collapsed && (
                      <ListItemText
                        primary={child.text}
                        primaryTypographyProps={{
                          fontSize: 12, fontWeight: childSel ? 700 : 500,
                          color: childSel ? PRIMARY_COLOR : '#4b5563',
                        }}
                      />
                    )}
                  </ListItemButton>
                );
              })}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    );
  };

  const w = collapsed ? COLLAPSED_W : EXPANDED_W;

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        position: 'fixed', width: w, zIndex: 10000, flexShrink: 0,
        transition: 'width 0.3s ease',
        '& .MuiDrawer-paper': {
          width: w, boxSizing: 'border-box',
          transition: 'width 0.3s ease',
          background: `linear-gradient(180deg, #f8faff 0%, #f0f4ff 60%, #faf5ff 100%)`,
          borderRight: '1px solid rgba(229,231,235,0.5)',
          boxShadow: collapsed ? 'none' : '2px 0 24px rgba(0,0,0,0.06)',
          overflowX: 'hidden',
        },
      }}
    >
      <Box className="sidebar-water-bg" sx={{ height: '100%', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <Box className="sidebar-content" sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          {/* BotForge Logo + Toggle */}
          <Box sx={{
            display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'space-between',
            py: 1.5, px: collapsed ? 0 : 1.5, minHeight: 56, gap: 1,
            borderBottom: '1px solid rgba(243,244,246,0.8)',
          }}>
            {!collapsed && (
              <Box onClick={() => navigate('/app/dashboard')} sx={{ display: 'flex', alignItems: 'center', gap: 1.2, cursor: 'pointer' }}>
                <Box sx={{
                  width: 30, height: 30, borderRadius: '8px',
                  background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 4px 10px rgba(79,70,229,0.3)',
                }}>
                  <SmartToyIcon sx={{ color: '#fff', fontSize: 16 }} />
                </Box>
                <Typography sx={{ fontWeight: 800, fontSize: 16, color: '#1f2937', letterSpacing: '-0.3px' }}>
                  BotForge
                </Typography>
              </Box>
            )}
            <IconButton
              onClick={onToggle}
              size="small"
              sx={{
                color: '#6b7280', p: 0.8,
                '&:hover': { bgcolor: 'rgba(99,102,241,0.1)', color: PRIMARY_COLOR },
              }}
            >
              {collapsed ? <MenuIcon fontSize="small" /> : <MenuOpenIcon fontSize="small" />}
            </IconButton>
          </Box>

          {/* Bot selector */}
          {bots.length > 0 && !collapsed && (
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
                        <Typography sx={{ fontSize: 12, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{bot?.name}</Typography>
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

          {/* Collapsed bot selector — just icon */}
          {bots.length > 0 && collapsed && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 1 }}>
              <SmartToyIcon sx={{ fontSize: 22, color: selectedBot ? PRIMARY_COLOR : '#d1d5db' }} />
            </Box>
          )}

          {/* Nav items */}
          <Box sx={{ flex: 1, overflowY: 'auto', minHeight: 0, px: collapsed ? 0.5 : 1, py: 0.5 }}>
            <List sx={{ px: collapsed ? 0 : 0.5 }}>
              {mode1Items.map(renderItem)}
            </List>

            {selectedBot && (
              <>
                <Divider sx={{ mx: collapsed ? 1 : 2, my: 1 }} />
                {!collapsed && (
                  <Typography sx={{ fontSize: 11, fontWeight: 600, color: '#9ca3af', px: 2, pb: 0.5, pt: 0.5 }}>
                    MODEL 2
                  </Typography>
                )}
                <List sx={{ px: collapsed ? 0 : 0.5 }}>
                  {mode2Items.map(renderItem)}
                </List>
              </>
            )}
          </Box>

          {!collapsed && (
            <Box sx={{ px: 2, py: 1.5, borderTop: '1px solid rgba(243,244,246,0.8)' }}>
              <Box
                onClick={() => navigate('/app/plans')}
                sx={{
                  display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer',
                  bgcolor: '#f0f4ff', borderRadius: 2, px: 1.5, py: 1,
                  '&:hover': { bgcolor: '#e0e7ff' },
                }}
              >
                <WorkspacePremiumIcon sx={{ fontSize: 18, color: '#6366f1' }} />
                <Box>
                  <Typography sx={{ fontSize: 11, fontWeight: 700, color: '#6366f1', lineHeight: 1.2 }}>
                    {JSON.parse(localStorage.getItem('user') || '{}')?.plan || 'Free'}
                  </Typography>
                  <Typography sx={{ fontSize: 10, color: '#94a3b8', lineHeight: 1.2 }}>
                    Manage Plan
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
