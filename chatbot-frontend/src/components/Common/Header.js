import React, { useEffect, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  FormControlLabel,
  Radio,
  RadioGroup,
  Divider,
  Badge,
  InputBase,
} from '@mui/material';
import {
  KeyboardArrowDown,
  SmartToy,
  AccountCircleOutlined,
  CreditCardOutlined,
  HelpOutlineOutlined,
  PlayCircleOutlineOutlined,
  LogoutOutlined,
  SearchOutlined,
  NotificationsOutlined,
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { fetchUserById } from '../../api/authApi';
import SmartToyIcon from '@mui/icons-material/SmartToy';

const Header = () => {
  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [status, setStatus] = useState('Online');
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    const fetchUser = async () => {
      try {
        const userData = await fetchUserById(userId);
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, []);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };

  const menuItems = [
    { label: 'Account', icon: <AccountCircleOutlined sx={{ fontSize: 18 }} />, to: '/account' },
    { label: 'Billing', icon: <CreditCardOutlined sx={{ fontSize: 18 }} /> },
    { label: 'Help', icon: <HelpOutlineOutlined sx={{ fontSize: 18 }} /> },
    { label: 'Video Guide', icon: <PlayCircleOutlineOutlined sx={{ fontSize: 18 }} /> },
  ];

  return (
    <AppBar
      position="static"
      sx={{
        height: '64px',
        background: 'linear-gradient(135deg, #ffffff 0%, #F6F9FF 50%, #FAFAFF 100%)',
        backgroundSize: '200% 200%',
        animation: 'gradientShift 8s ease-in-out infinite',
        width: '100%',
        zIndex: (theme) => theme.zIndex.drawer + 1,
        boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)',
        borderBottom: '1px solid rgba(229,231,235,0.6)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', height: '64px', px: { xs: 2, md: 3 } }}>
        {/* Left: Logo + Brand */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            onClick={() => navigate('/app/dashboard')}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              cursor: 'pointer',
              '&:hover': { opacity: 0.85 },
              transition: 'opacity 0.2s',
            }}
          >
            <Box
              sx={{
                width: 34,
                height: 34,
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(79,70,229,0.3)',
                animation: 'pulseGlow 3s ease-in-out infinite',
              }}
            >
              <SmartToyIcon sx={{ color: '#fff', fontSize: 18 }} />
            </Box>
            <Typography sx={{ fontWeight: 800, fontSize: 17, color: '#1f2937', letterSpacing: '-0.3px' }}>
              BotForge
            </Typography>
          </Box>

          {/* Search bar */}
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              bgcolor: 'rgba(243,244,246,0.8)',
              borderRadius: 2,
              px: 1.5,
              py: 0.5,
              ml: 3,
              border: '1px solid rgba(229,231,235,0.5)',
              transition: 'all 0.3s',
              '&:focus-within': {
                bgcolor: '#fff',
                borderColor: '#4F46E5',
                boxShadow: '0 0 0 3px rgba(79,70,229,0.1)',
              },
            }}
          >
            <SearchOutlined sx={{ fontSize: 18, color: '#9CA3AF', mr: 1 }} />
            <InputBase
              placeholder="Search conversations, bots..."
              sx={{ fontSize: 13, color: '#374151', '& .MuiInputBase-input': { py: 0.5 }, width: 200 }}
            />
          </Box>
        </Box>

        {/* Right: Notifications + User */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {/* Notification bell */}
          <IconButton
            sx={{
              width: 36,
              height: 36,
              bgcolor: 'rgba(243,244,246,0.8)',
              borderRadius: 2,
              '&:hover': { bgcolor: '#EEF2FF' },
            }}
          >
            <Badge badgeContent={3} color="primary" sx={{ '& .MuiBadge-badge': { fontSize: 9, fontWeight: 700, minWidth: 16, height: 16 } }}>
              <NotificationsOutlined sx={{ fontSize: 20, color: '#6B7280' }} />
            </Badge>
          </IconButton>

          {user && (
            <>
              <Box
                onClick={handleMenuOpen}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  cursor: 'pointer',
                  px: 1.5,
                  py: 0.8,
                  borderRadius: 2,
                  transition: 'all 0.2s',
                  '&:hover': { bgcolor: 'rgba(79,70,229,0.06)' },
                }}
              >
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  badgeContent={
                    <Box
                      sx={{
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        bgcolor: status === 'Online' ? '#10B981' : '#F59E0B',
                        border: '2px solid #fff',
                        boxShadow: '0 0 0 1px rgba(0,0,0,0.05)',
                      }}
                    />
                  }
                >
                  <Avatar
                    sx={{
                      bgcolor: '#4F46E5',
                      width: 36,
                      height: 36,
                      fontWeight: 700,
                      fontSize: 14,
                      background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
                    }}
                  >
                    {user.fullName?.charAt(0).toUpperCase() || 'A'}
                  </Avatar>
                </Badge>
                <Box sx={{ lineHeight: 1, display: { xs: 'none', sm: 'block' } }}>
                  <Typography fontWeight={600} fontSize="13px" color="#1f2937" sx={{ lineHeight: 1.3 }}>
                    {user.fullName || 'Admin'}
                  </Typography>
                  <Typography fontSize="11px" color="#9CA3AF" sx={{ lineHeight: 1.3, mt: 0.2 }}>
                    {status === 'Online' ? '● Online' : '○ Away'}
                  </Typography>
                </Box>
                <KeyboardArrowDown sx={{ color: '#9CA3AF', fontSize: 18 }} />
              </Box>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                PaperProps={{
                  sx: {
                    mt: 1,
                    borderRadius: 2.5,
                    boxShadow: '0 10px 40px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.04)',
                    border: '1px solid rgba(229,231,235,0.5)',
                    minWidth: 220,
                    overflow: 'visible',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: -6,
                      right: 20,
                      width: 12,
                      height: 12,
                      bgcolor: '#fff',
                      transform: 'rotate(45deg)',
                      borderLeft: '1px solid rgba(229,231,235,0.5)',
                      borderTop: '1px solid rgba(229,231,235,0.5)',
                    },
                  },
                }}
              >
                {/* User card */}
                <Box sx={{ px: 2, py: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Avatar
                    sx={{
                      bgcolor: '#4F46E5',
                      width: 40,
                      height: 40,
                      fontWeight: 700,
                      fontSize: 16,
                      background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
                    }}
                  >
                    {user.fullName?.charAt(0).toUpperCase() || 'A'}
                  </Avatar>
                  <Box>
                    <Typography fontWeight={700} fontSize="14px" color="#1f2937">
                      {user.fullName || 'Admin'}
                    </Typography>
                    <Typography fontSize="12px" color="#9CA3AF">
                      {user.email}
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ mx: 1.5 }} />

                {/* Live Chat Status */}
                <Box sx={{ px: 2, pt: 1.5, pb: 0.5 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, fontSize: 12, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Live Chat Status
                  </Typography>
                </Box>
                <Box sx={{ px: 1 }}>
                  <RadioGroup row value={status} onChange={handleStatusChange} sx={{ gap: 0 }}>
                    {['Online', 'Away'].map((option) => (
                      <FormControlLabel
                        key={option}
                        value={option}
                        control={<Radio size="small" sx={{ '&.Mui-checked': { color: option === 'Online' ? '#10B981' : '#F59E0B' } }} />}
                        label={option}
                        sx={{ '& .MuiTypography-root': { fontSize: 13, fontWeight: 500 }, flex: 1 }}
                      />
                    ))}
                  </RadioGroup>
                </Box>

                <Divider sx={{ mx: 1.5 }} />

                {/* Menu Items */}
                {menuItems.map((item, i) => (
                  <MenuItem
                    key={item.label}
                    component={item.to ? Link : 'div'}
                    to={item.to}
                    onClick={handleMenuClose}
                    sx={{
                      mx: 1,
                      borderRadius: 1.5,
                      py: 0.8,
                      gap: 1.5,
                      '&:hover': { bgcolor: 'rgba(79,70,229,0.06)' },
                      fontSize: 13,
                      color: '#374151',
                    }}
                  >
                    <Box sx={{ color: '#9CA3AF', display: 'flex', alignItems: 'center' }}>{item.icon}</Box>
                    {item.label}
                  </MenuItem>
                ))}

                <Divider sx={{ mx: 1.5 }} />

                {/* Plan */}
                <Box sx={{ px: 2, pt: 1.5, pb: 0.5 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, fontSize: 12, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Plan
                  </Typography>
                </Box>
                <Box sx={{ px: 2, pb: 1 }}>
                  <Box
                    sx={{
                      bgcolor: '#EEF2FF',
                      borderRadius: 2,
                      px: 1.5,
                      py: 1,
                      border: '1px solid rgba(79,70,229,0.1)',
                    }}
                  >
                    <Typography fontSize={13} fontWeight={600} color="#4F46E5">
                      {user.plan || 'PRO - TRIAL'}
                    </Typography>
                    <Typography fontSize={11} color="#6B7280">
                      6 days remaining
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ mx: 1.5 }} />

                {/* Logout */}
                <MenuItem
                  onClick={handleLogout}
                  sx={{
                    mx: 1,
                    borderRadius: 1.5,
                    py: 0.8,
                    gap: 1.5,
                    color: '#EF4444',
                    '&:hover': { bgcolor: 'rgba(239,68,68,0.06)' },
                    fontSize: 13,
                    fontWeight: 500,
                  }}
                >
                  <LogoutOutlined sx={{ fontSize: 18 }} />
                  Logout
                </MenuItem>

                <Box sx={{ px: 2, py: 1 }}>
                  <Typography fontSize={11} color="#D1D5DB" textAlign="center">
                    BotForge v2.0
                  </Typography>
                </Box>
              </Menu>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
