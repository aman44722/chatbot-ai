import { Box, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import {
    Person, Lock, Group, Email, WhatsApp, Delete,
} from '@mui/icons-material';

const menuItems = [
    { text: 'Your Profile', icon: <Person /> },
    { text: 'Change Password', icon: <Lock /> },
    { text: 'Create Department', icon: <Group /> },
    { text: 'Create User', icon: <Group /> },
    { text: 'Email Server Credentials', icon: <Email /> },
    { text: 'Live Chat WhatsApp Notification', icon: <WhatsApp /> },
    { text: 'Delete Account', icon: <Delete /> },
];

export default function AccountSettingSidebar({ setSelected }) {
    return (
        <Box
            className="custom-scrollbar"
            sx={{
                width: '30%',
                boxShadow: '0px 4px 20px #d8d8d8',
                borderRadius: '20px',
                borderRight: '1px solid #eee',
                overflowY: 'auto',
                background: '#f9fbfd',
            }}
        >
            {menuItems.map((item) => (
                <ListItem
                    button
                    key={item.text}
                    // selected={selected === item.text}
                    onClick={() => setSelected(item.text)}
                >
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.text} />
                </ListItem>
            ))}
        </Box>
    );
}
