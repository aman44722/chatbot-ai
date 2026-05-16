import React, { useState } from 'react';
import { Typography, Button, TextField } from '@mui/material';
import Swal from 'sweetalert2';
import { changePassword } from '../../../../api/authApi';

export default function ChangePassword() {
    const [passwordData, setPasswordData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
        newPassword: '',
    });

    const [message, setMessage] = useState('');
    const [messageColor, setMessageColor] = useState('green');

    const handleChange = (e) => {
        setPasswordData({
            ...passwordData,
            [e.target.name]: e.target.value,
        });
    };

    const handleUpdate = async () => {
        const { oldPassword, newPassword, confirmPassword } = passwordData;

        // Validation: Check all fields filled
        if (!oldPassword || !newPassword || !confirmPassword) {
            setMessageColor('red');
            return setMessage('Please fill in all fields.');
        }

        // Validation: Password match
        if (newPassword !== confirmPassword) {
            setMessageColor('red');
            return setMessage('New password and confirm password do not match.');
        }

        try {
            console.log(`oldPassword - ${oldPassword}, newPassword - ${newPassword}`)
            const response = await changePassword(oldPassword, newPassword);

            // Show success alert and refresh after confirmation
            Swal.fire({
                icon: 'success',
                title: 'Password Changed Successfully',
                text: response.message || 'Your password has been updated.',
                confirmButtonText: 'OK',
            }).then(() => {
                window.location.reload(); // Refresh page
            });

        } catch (error) {
            console.error('Error changing password:', error);
            setMessageColor('red');
            setMessage(error?.message || 'Something went wrong. Please try again.');
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
            <Typography variant="h5" gutterBottom>
                Change Password
            </Typography>

            <TextField
                label="Old Password"
                type="password"
                name="oldPassword"
                value={passwordData.oldPassword}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />

            <TextField
                label="New Password"
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />

            <TextField
                label="Confirm New Password"
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />

            {message && (
                <Typography style={{ color: messageColor, marginTop: '10px' }}>
                    {message}
                </Typography>
            )}

            <Button
                variant="contained"
                color="primary"
                onClick={handleUpdate}
                style={{ marginTop: '20px' }}
                fullWidth
            >
                Update Password
            </Button>
        </div>
    );
}
