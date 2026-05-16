import { Box, Switch, TextField, Typography } from '@mui/material'
import React from 'react'

const MultipleChoiceTab = () => {
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
                <Typography>MultipleChoiceTab</Typography>
                <Switch />
            </Box>

            <Box sx={{ display: "flex", gap: 2 }}>
                <TextField fullWidth label="Minimum Value" />
                <TextField fullWidth label="Maximum Value" />
            </Box>
        </>
    )
}

export default MultipleChoiceTab
