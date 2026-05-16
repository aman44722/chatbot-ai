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
} from '@mui/material';
import { KeyboardArrowDown } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { fetchUserById } from '../../api/authApi';
import logo from "../../assets/images/bot-logo-white.png";
// Importing the new fetch function

const Header = () => {
  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [status, setStatus] = useState('Online'); // Live chat status
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    const fetchUser = async () => {
      try {
        const userData = await fetchUserById(userId);  // Fetching user data via the API
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

  return (
    <AppBar

      position="fixed"
      sx={{
        height: '60px',
        background: '#F6F9FF',
        marginLeft: '2px',
        width: '100%',
        zIndex: (theme) => theme.zIndex.drawer + 1,
        boxShadow: '2px 1px 0px #F1f1f1'
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'end' }}>


        {user && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar
              sx={{
                bgcolor: '#4F46E5',
                width: 40,
                height: 40,
                fontWeight: 600,
              }}
            >
              <MenuItem component={Link} to="/account">
                {user.fullName?.charAt(0).toUpperCase() || 'A'}
              </MenuItem>
            </Avatar>
            <Box sx={{ lineHeight: 1 }}>
              <Typography fontWeight={600} fontSize="14px" color="#000">
                {user.fullName || 'Admin'}
              </Typography>
              <Typography fontSize="12px" color="#5e5e5eff">
                {user.email}
              </Typography>
            </Box>
            <IconButton onClick={handleMenuOpen}>
              <KeyboardArrowDown sx={{ color: '#5e5e5eff' }} />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              {/* Live Chat Status */}
              <MenuItem>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Live Chat Status
                </Typography>
              </MenuItem>
              <MenuItem>
                <RadioGroup
                  row
                  value={status}
                  onChange={handleStatusChange}
                >
                  <FormControlLabel value="Online" control={<Radio />} label="Online" />
                  <FormControlLabel value="Away" control={<Radio />} label="Away" />
                </RadioGroup>
              </MenuItem>

              {/* Account and Plan */}
              <MenuItem component={Link} to="/account">
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Account
                </Typography>
              </MenuItem>
              <MenuItem >
                <Typography variant="body2">
                  Billing
                </Typography>
              </MenuItem>
              <MenuItem >
                <Typography variant="body2">
                  Help
                </Typography>
              </MenuItem>
              <MenuItem >
                <Typography variant="body2">
                  Video Guide
                </Typography>
              </MenuItem>

              {/* Plan Info */}
              <MenuItem>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Plan
                </Typography>
              </MenuItem>
              <MenuItem>
                <Typography variant="body2">
                  {user.plan || 'PRO - TRIAL'} <br />
                  {user.plan ? `Ends in 6 days` : `No active plan`}
                </Typography>
              </MenuItem>

              {/* Logout */}
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
