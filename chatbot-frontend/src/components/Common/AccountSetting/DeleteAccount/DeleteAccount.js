import '../../../../pages/SetupPage/AdminSettings.css';
import { Typography, Button } from '@mui/material';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/dist/sweetalert2.min.css';
import axios from 'axios';

export default function DeleteAccount() {
    const handleDeleteAccount = async () => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'This action will permanently delete your account!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
        });

        if (result.isConfirmed) {
            try {
                const token = JSON.parse(localStorage.getItem("user"))?.token;
                console.log("token - ", token);

                const apiBase = process.env.REACT_APP_AUTH_API || "http://localhost:5000/api/auth";
                const response = await axios.delete(`${apiBase}/delete-account`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                // console.log("response - ", response);

                Swal.fire('Deleted!', 'Your account has been deleted.', 'success');

                localStorage.clear();
                window.location.href = '/login'; // Or navigate('/login') if using React Router
            } catch (error) {
                console.error('Error deleting account:', error);
                Swal.fire('Error', error?.response?.data?.message || 'Something went wrong!', 'error');
            }
        }
    };

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'start',
                gap: '21px',
                width: '100%',
                boxShadow: '0px 4px 20px #d8d8d8',
                borderRadius: '20px',
                borderRight: '1px solid #eee',
                overflowY: 'auto',
                padding: '20px',
            }}
        >
            <Typography variant="h5">
                <strong>Delete Account</strong>
            </Typography>

            <Typography variant="body1" color="error">
                Warning: Deleting your account is permanent and cannot be undone.
            </Typography>

            <Button
                variant="contained"
                color="error"
                onClick={handleDeleteAccount}
                style={{ maxWidth: '200px' }}
            >
                Delete My Account
            </Button>
        </div>
    );
}
