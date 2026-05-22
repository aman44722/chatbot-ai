import React, { useState, useEffect, useRef } from 'react';

import './style.css';
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Badge,
  Box,
  Select,
  MenuItem,
  FormControl,
  Typography,
} from '@mui/material';
import { fetchConversations } from '../../api/conversationApi';
import { connectSocket } from '../../api/socket';
import { getBots } from '../../api/botApi';
import ChatIcon from '@mui/icons-material/Chat';
import PeopleIcon from '@mui/icons-material/People';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import AssignmentIcon from '@mui/icons-material/Assignment';
import BarChartIcon from '@mui/icons-material/BarChart';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import BuildIcon from '@mui/icons-material/Build';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SwapCallsIcon from '@mui/icons-material/SwapCalls';
import DownloadIcon from '@mui/icons-material/Download';
import DnsIcon from '@mui/icons-material/Dns';
import logo from "../../assets/images/bot-logo-blue.png";
import { useLocation, useNavigate } from 'react-router-dom';

const ITEM_COLORS = {
  Dashboard: "#6366f1",
  Bots: "#8b5cf6",
  SetUp: "#f59e0b",
  Chats: "#ec4899",
  Users: "#10b981",
  "Bot Answers": "#8b5cf6",
  Leads: "#06b6d4",
  Analytics: "#f97316",
  Settings: "#6366f1",
  Logout: "#ef4444",
};

const CHILD_COLORS = {
  "View Setup": "#10b981",
  "Flow Setup": "#8b5cf6",
  Install: "#06b6d4",
};

const Sidebar = () => {
  const navigate = useNavigate();
  const [openDropdown, setOpenDropdown] = useState(null);
  const [activeChatsCount, setActiveChatsCount] = useState(0);
  const [liveCount, setLiveCount] = useState(0);
  const [bots, setBots] = useState([]);
  const [selectedBot, setSelectedBot] = useState(localStorage.getItem('selectedBotId') || '');
  const prevLiveCount = React.useRef(0);

  useEffect(() => {
    getBots()
      .then(setBots)
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (selectedBot) {
      localStorage.setItem('selectedBotId', selectedBot);
    }
  }, [selectedBot]);

  const handleBotChange = (event) => {
    const botId = event.target.value;
    setSelectedBot(botId);
    localStorage.setItem('selectedBotId', botId);
  };

  useEffect(() => {
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  // Initial fetch + polling fallback + real-time updates via WebSocket
  useEffect(() => {
    const load = () => {
      fetchConversations()
        .then(convos => {
          const active = convos.filter(c => c.status === "active").length;
          const live = convos.filter(c => c.status === "live_requested").length;
          setActiveChatsCount(active);
          setLiveCount(live);
          if (live > prevLiveCount.current && Notification.permission === "granted") {
            new Notification("Live Agent Requested", {
              body: `${live - prevLiveCount.current} user(s) want to chat with a live agent!`,
              icon: "/favicon.ico",
            });
          }
          prevLiveCount.current = live;
        })
        .catch(() => {});
    };
    load();

    // Polling fallback every 30s
    const interval = setInterval(load, 30000);

    const socket = connectSocket();
    const handleLiveRequest = () => load();
    const handleStatusUpdate = () => load();

    if (socket?.connected) {
      socket.on("live-request", handleLiveRequest);
      socket.on("status-updated", handleStatusUpdate);
      socket.on("reopen-conversation", handleLiveRequest);
    }

    return () => {
      clearInterval(interval);
      if (socket?.connected) {
        socket.off("live-request", handleLiveRequest);
        socket.off("status-updated", handleStatusUpdate);
        socket.off("reopen-conversation", handleLiveRequest);
      }
    };
  }, []);

  const toggleDropdown = (text) => {
    setOpenDropdown(openDropdown === text ? null : text);
  };

  const menuItems = [
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/dashboard',
    },
    {
      text: 'Bots',
      icon: <DnsIcon />,
      path: '/bots',
    },
    {
      text: 'SetUp',
      icon: <BuildIcon />,
      children: [
        {
          text: 'View Setup',
          icon: <VisibilityIcon />,
          path: '/setup',
        },
        {
          text: 'Flow Setup',
          icon: <SwapCallsIcon />,
          path: '/flow-setup',
        },
        {
          text: 'Install',
          icon: <DownloadIcon />,
          path: '/install',
        },
      ],
    },
    {
      text: 'Chats',
      icon: (
        <Badge
          badgeContent={liveCount > 0 ? liveCount : activeChatsCount}
          color={liveCount > 0 ? "warning" : "error"}
          max={99}
          sx={{ '& .MuiBadge-badge': { fontSize: 9, minWidth: 16, height: 16 } }}
        >
          <ChatIcon />
        </Badge>
      ),
      path: '/chats',
    },
    {
      text: 'Users',
      icon: <PeopleIcon />,
      path: '/users',
    },
    {
      text: 'Bot Answers',
      icon: <SmartToyIcon />,
      path: '/answers',
    },
    {
      text: 'Leads',
      icon: <AssignmentIcon />,
      path: '/leads',
    },
    {
      text: 'Analytics',
      icon: <BarChartIcon />,
      path: '/analytics',
    },
    {
      text: 'Settings',
      icon: <SettingsIcon />,
      path: '/settings',
    },
    {
      text: 'Logout',
      icon: <LogoutIcon />,
      path: '/logout',
    },
  ];

  const location = useLocation();

  const isActive = (path) => {
    if (!path) return false;
    const fullPath = `/app${path}`;
    return location.pathname === fullPath || location.pathname === path;
  };
  const isParentActive = (item) =>
    item.children
      ? item.children.some((c) => isActive(c.path)) || isActive(item.path)
      : isActive(item.path);

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        position: "fixed",
        width: 200,
        zIndex: 10000,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 200,
          boxSizing: 'border-box',
          background: "linear-gradient(180deg, #f8faff 0%, #f0f4ff 40%, #faf5ff 100%)",
          borderRight: "1px solid rgba(229,231,235,0.5)",
          boxShadow: "2px 0 20px rgba(0,0,0,0.04)",
        },
      }}
    >
      <Box sx={{
        display: "flex", alignItems: "center", justifyContent: "center",
        py: 2.5, px: 2, borderBottom: "1px solid rgba(243,244,246,0.8)",
      }}>
        <img style={{ width: "100px", filter: "drop-shadow(0 2px 4px rgba(79,70,229,0.15))" }} src={logo} alt="Smart Bot Logo" />
      </Box>

      {bots.length > 0 && (
        <Box sx={{ px: 1.5, py: 1 }}>
          <Typography sx={{ fontSize: 11, fontWeight: 600, color: '#9ca3af', mb: 0.5, px: 0.5 }}>
            ACTIVE BOT
          </Typography>
          <FormControl fullWidth size="small">
            <Select
              value={selectedBot}
              onChange={handleBotChange}
              displayEmpty
              sx={{
                height: 32, fontSize: 12, borderRadius: 1.5,
                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e5e7eb' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#6366f1' },
                bgcolor: selectedBot ? '#f0f4ff' : 'transparent',
              }}
            >
              {bots.map((bot) => (
                <MenuItem key={bot._id} value={bot._id} sx={{ fontSize: 13 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <SmartToyIcon sx={{ fontSize: 15, color: '#6366f1' }} />
                    {bot.name}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      )}

      <List sx={{ px: 1, pt: 1 }}>
        {menuItems.map((item) => {
          const sel = isParentActive(item);
          const color = ITEM_COLORS[item.text] || "#6366f1";
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
                  position: "relative", overflow: "hidden",
                  transition: "all 0.3s",
                  "&::before": sel && !item.children ? {
                    content: '""',
                    position: "absolute", left: 0, top: "50%",
                    transform: "translateY(-50%)",
                    width: 3, height: "60%",
                    borderRadius: "0 3px 3px 0",
                    bgcolor: color,
                    animation: "slideIn 0.3s ease-out",
                  } : {},
                  "&.Mui-selected": {
                    background: `linear-gradient(90deg, ${color}12 0%, ${color}06 100%)`,
                    "&:hover": { background: `linear-gradient(90deg, ${color}18 0%, ${color}0a 100%)` },
                  },
                  "&:hover": { bgcolor: "rgba(99,102,241,0.06)" },
                  "@keyframes slideIn": {
                    from: { height: 0, opacity: 0 },
                    to: { height: "60%", opacity: 1 },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 36, color: sel ? color : "#6b7280", justifyContent: "center" }}>
                  <Box sx={{
                    width: 30, height: 30, borderRadius: "9px",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    bgcolor: sel ? `${color}14` : "transparent",
                    transition: "all 0.3s",
                    transform: sel ? "scale(1.05)" : "scale(1)",
                    fontSize: 18,
                    boxShadow: sel ? `0 2px 8px ${color}30` : "none",
                  }}>
                    {item.icon}
                  </Box>
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontSize: 13, fontWeight: sel ? 700 : 500,
                    color: sel ? color : "#374151",
                  }}
                />
                {item.children && (
                  isOpen ? <ExpandLess sx={{ fontSize: 18, color: "#9ca3af" }} /> : <ExpandMore sx={{ fontSize: 18, color: "#9ca3af" }} />
                )}
              </ListItemButton>

              {item.children && (
                <Collapse in={isOpen} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding sx={{ pl: 0.5 }}>
                    {item.children.map((child) => {
                      const childSel = isActive(child.path);
                      const childColor = CHILD_COLORS[child.text] || "#6366f1";
                      return (
                        <ListItemButton
                          key={child.text}
                          onClick={() => navigate(child.path)}
                          selected={childSel}
                          sx={{
                            borderRadius: 1.5, mb: 0.2, pl: 3.5, py: 0.5,
                            position: "relative", overflow: "hidden",
                            transition: "all 0.3s",
                            "&::before": childSel ? {
                              content: '""',
                              position: "absolute", left: 0, top: "50%",
                              transform: "translateY(-50%)",
                              width: 2.5, height: "50%",
                              borderRadius: "0 3px 3px 0",
                              bgcolor: childColor,
                              animation: "slideIn 0.3s ease-out",
                            } : {},
                            "&.Mui-selected": {
                              background: `linear-gradient(90deg, ${childColor}0e 0%, ${childColor}04 100%)`,
                              "&:hover": { background: `linear-gradient(90deg, ${childColor}14 0%, ${childColor}08 100%)` },
                            },
                            "&:hover": { bgcolor: "rgba(99,102,241,0.05)" },
                          }}
                        >
                          <ListItemIcon sx={{
                            minWidth: 28, color: childSel ? childColor : "#9ca3af",
                            justifyContent: "center", fontSize: 15,
                          }}>
                            <Box sx={{
                              width: 24, height: 24, borderRadius: "7px",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              bgcolor: childSel ? `${childColor}14` : "transparent",
                              fontSize: 14,
                              transition: "all 0.3s",
                              transform: childSel ? "scale(1.08)" : "scale(1)",
                              boxShadow: childSel ? `0 2px 6px ${childColor}28` : "none",
                            }}>
                              {child.icon}
                            </Box>
                          </ListItemIcon>
                          <ListItemText
                            primary={child.text}
                            primaryTypographyProps={{
                              fontSize: 12, fontWeight: childSel ? 700 : 500,
                              color: childSel ? childColor : "#4b5563",
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
        })}
      </List>
    </Drawer>
  );
};

export default Sidebar;
