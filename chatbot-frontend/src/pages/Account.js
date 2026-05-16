import { Box } from '@mui/material';
import { useState } from 'react';

import AccountSettingSidebar from '../components/Common/AccountSetting/AccountSettingSidebar';
import ProfileDetails from '../components/Common/AccountSetting/AccountProfile/ProfileDetails';

import ChangePassword from '../components/Common/AccountSetting/ChangePassword/ChangePassword';
import CreateDepartment from '../components/Common/AccountSetting/CreateDepartment/CreateDepartment';
import CreateUser from '../components/Common/AccountSetting/CreateUser/CreateUser';
import EmailServerCredentials from '../components/Common/AccountSetting/EmailServerCredentials/EmailServerCredentials';
import LiveChatWhatsAppNotification from '../components/Common/AccountSetting/LiveChatWhatsAppNotification/LiveChatWhatsAppNotification';
import DeleteAccount from '../components/Common/AccountSetting/DeleteAccount/DeleteAccount';

export default function Account() {
    const [selected, setSelected] = useState('Your Profile');

    return (
        <Box
            sx={{
                display: 'flex',
                height: '84vh',
                padding: '10px',
                width: '100%',
                gap: '10px',
            }}
        >
            <AccountSettingSidebar selected={selected} setSelected={setSelected} />
            <Box>
                {selected === 'Your Profile' && <ProfileDetails />}
                {selected === 'Change Password' && <ChangePassword />}
                {selected === 'Create Department' && <CreateDepartment />}
                {selected === 'Create User' && <CreateUser />}
                {selected === 'Email Server Credentials' && <EmailServerCredentials />}
                {selected === 'Live Chat WhatsApp Notification' && <LiveChatWhatsAppNotification />}
                {selected === 'Delete Account' && <DeleteAccount />}
            </Box>
        </Box>
    );
}
