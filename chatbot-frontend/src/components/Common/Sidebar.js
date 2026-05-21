import React, { useState, useEffect } from 'react';

import './style.css';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  Badge,
} from '@mui/material';
import { fetchConversations } from '../../api/conversationApi';
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
import logo from "../../assets/images/bot-logo-blue.png";
import { useLocation, useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  const [openDropdown, setOpenDropdown] = useState(null);
  const [activeChatsCount, setActiveChatsCount] = useState(0);
  const [liveCount, setLiveCount] = useState(0);
  const prevLiveCount = React.useRef(0);

  useEffect(() => {
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    const load = () => {
      fetchConversations()
        .then(convos => {
          const active = convos.filter(c => c.status === "active").length;
          const live = convos.filter(c => c.status === "live_requested").length;
          setActiveChatsCount(active);
          setLiveCount(live);
          if (live > prevLiveCount.current && Notification.permission === "granted") {
            new Notification("🔴 Live Agent Requested", {
              body: `${live - prevLiveCount.current} user(s) want to chat with a live agent!`,
              icon: "/favicon.ico",
            });
          }
          prevLiveCount.current = live;
        })
        .catch(() => {});
    };
    load();
    const interval = setInterval(load, 15000);
    return () => clearInterval(interval);
  }, []);


  const toggleDropdown = (text) => {
    setOpenDropdown(openDropdown === text ? null : text);
  };

  const menuItems = [
    {
      text: 'Dashboard',
      icon: <DashboardIcon fontSize='10px' sx={{
        background: '#4F46E5', borderRadius: '20px', width: '20px', height: '20px', padding: '3px'
      }} />,
      path: '/dashboard',
    },
    {
      text: 'SetUp',
      icon: <BuildIcon fontSize='10px' sx={{
        background: '#4F46E5', borderRadius: '20px', width: '20px', height: '20px', padding: '3px'
      }} />,
      children: [
        {
          text: 'View Setup',
          icon: <VisibilityIcon fontSize='10px' sx={{
            background: '#4F46E5', borderRadius: '20px', width: '20px', height: '20px', padding: '3px'
          }} />,
          path: '/setup',
        },
        {
          text: 'Flow Setup',
          icon: <SwapCallsIcon fontSize='10px' sx={{
            background: '#4F46E5', borderRadius: '20px', width: '20px', height: '20px', padding: '3px'
          }} />,
          path: '/flow-setup',
        },
        {
          text: 'Install',
          icon: <DownloadIcon fontSize='10px' sx={{
            background: '#4F46E5', borderRadius: '20px', width: '20px', height: '20px', padding: '3px'
          }} />,
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
          <ChatIcon fontSize='10px' sx={{
            background: '#4F46E5', borderRadius: '20px', width: '20px', height: '20px', padding: '3px'
          }} />
        </Badge>
      ),
      path: '/chats',
    },
    {
      text: 'Users',
      icon: <PeopleIcon fontSize='10px' sx={{
        background: '#4F46E5', borderRadius: '20px', width: '20px', height: '20px', padding: '3px'
      }} />,
      path: '/users',
    },
    {
      text: 'Bot Answers',
      icon: <SmartToyIcon fontSize='10px' sx={{
        background: '#4F46E5', borderRadius: '20px', width: '20px', height: '20px', padding: '3px'
      }} />,
      path: '/answers',
    },
    {
      text: 'Leads',
      icon: <AssignmentIcon fontSize='10px' sx={{
        background: '#4F46E5', borderRadius: '20px', width: '20px', height: '20px', padding: '3px'
      }} />,
      path: '/leads',
    },
    {
      text: 'Analytics',
      icon: <BarChartIcon fontSize='10px' sx={{
        background: '#4F46E5', borderRadius: '20px', width: '20px', height: '20px', padding: '3px'
      }} />,
      path: '/analytics',
    },
    {
      text: 'Settings',
      icon: <SettingsIcon fontSize='10px' sx={{
        background: '#4F46E5', borderRadius: '20px', width: '20px', height: '20px', padding: '3px'
      }} />,
      path: '/settings',
    },
    {
      text: 'Logout',
      icon: <LogoutIcon fontSize='10px' sx={{
        background: '#4F46E5', borderRadius: '20px', width: '20px', height: '20px', padding: '3px'
      }} />,
      path: '/logout',
    },
  ];

  const location = useLocation();


  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        position: "fixed",
        width: 180,
        zIndex: '10000',
        textAlign: 'center',
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: ["18%"],
          boxSizing: 'border-box',
          backgroundColor: '#F6F9FF',
          border: "none",
          boxShadow: '2px 1px 0px #fff'
        },
      }}
    >
      <div className="logo">
        <img style={{ width: "100px", }} src={logo} alt="Smart Bot Logo" />
      </div>
      <List sx={{}}>
        {menuItems.map((item) => (
          <React.Fragment key={item.text}>
            <ListItem

              button
              onClick={() =>
                item.children
                  ? toggleDropdown(item.text)
                  : navigate(item.path)
              }
              sx={{
                cursor: 'pointer',
                transition: 'ease-in-out',
                borderLeft: location.pathname === item.path ? '3px solid #4F46E5' : 'transparent',
                color: location.pathname === item.path ? '#4F46E5' : '#000',
                '&:hover': {
                  backgroundColor: '#fff',
                },
              }}

            >
              <ListItemIcon sx={{
                color: '#fff',
              }}>{item.icon}</ListItemIcon>
              <ListItemText sx={{
                fontSize: '15px'
              }} primary={item.text} />
              {item.children &&
                (openDropdown === item.text ? <ExpandLess /> : <ExpandMore />)}
            </ListItem>

            {item.children && (
              <Collapse in={openDropdown === item.text} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {item.children.map((child) => (
                    <ListItem
                      button
                      key={child.text}
                      sx={{

                        pl: 4, cursor: 'pointer',
                        borderLeft: location.pathname === child.path ? '3px solid #4F46E5' : 'transparent',
                        '&:hover': {
                          backgroundColor: '#e0f7fa',
                        }, color: location.pathname === child.path ? '#4F46E5' : '#000',
                      }}
                      onClick={() => navigate(child.path)}
                    >
                      <ListItemIcon sx={{
                        color: '#fff'
                      }}>{child.icon}</ListItemIcon>
                      <ListItemText primary={child.text} />
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            )}
          </React.Fragment>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
