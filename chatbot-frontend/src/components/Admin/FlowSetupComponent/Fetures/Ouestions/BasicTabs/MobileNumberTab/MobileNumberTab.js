import { Box, Switch, TextField, Typography } from '@mui/material'
import React from 'react'

const MobileNumberTab = ({ skipOption, setSkipOption }) => {
    const handleSwitchChange = (event) => {
        setSkipOption(event.target.checked);
    };

    return (
        <>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: 2,
                    gap: 2,
                }}
            >
                <Typography>{skipOption ? "Give Skip Option" : "Do Not Give Skip Option"}</Typography>
                <Switch checked={skipOption} onChange={handleSwitchChange} />
            </Box>

            <Box sx={{ display: "flex", gap: 2 }}>
                <TextField fullWidth label="Minimum Value" />
                <TextField fullWidth label="Maximum Value" />
            </Box>
        </>
    )
}

export default MobileNumberTab
