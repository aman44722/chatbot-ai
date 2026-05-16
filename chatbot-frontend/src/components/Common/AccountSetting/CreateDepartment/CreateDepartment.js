import '../../../../pages/SetupPage/AdminSettings.css';
import { Typography } from '@mui/material';

export default function CreateDepartment() {
    return (
        <div

            style={{
                display: 'flex',
                justifyContent: 'start',
                gap: '40px',
                width: '100%',
                boxShadow: '0px 4px 20px #d8d8d8',
                borderRadius: '20px',
                borderRight: '1px solid #eee',
                overflowY: 'auto',
                width: '100%',
                padding: "20px"

            }}

        >
            <Typography variant='h5'><strong> Create Department</strong></Typography>

        </div >
    );
}
