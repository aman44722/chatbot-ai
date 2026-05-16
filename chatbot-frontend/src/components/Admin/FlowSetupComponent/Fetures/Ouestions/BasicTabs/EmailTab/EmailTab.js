import { Box, Switch, TextField, Typography } from "@mui/material";
import { useState, useEffect } from "react";

const EmailTab = ({ errorMessage, setErrorMessage, skipOption, setSkipOption }) => {

    const handleSwitchChange = (event) => {
        setSkipOption(event.target.checked); // Ensures the state is updated properly with boolean value
    };

    return (
        <Box sx={{ mt: 1 }}>
            {/* Toggle Row */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
                <Switch
                    checked={skipOption}
                    onChange={handleSwitchChange} // Handle switch change
                    sx={{
                        "& .MuiSwitch-switchBase.Mui-checked": {
                            color: "#fff",
                            transform: "translateX(16px)",
                        },
                        "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                            backgroundColor: "#2563eb", // Blue when checked
                            opacity: 1,
                        },
                        "& .MuiSwitch-track": {
                            backgroundColor: "#ddd",
                        },
                    }}
                />
                <Typography sx={{ fontWeight: 500, color: "#6b7280" }}>
                    {skipOption ? "Give Skip Option" : "Do Not Give Skip Option"}
                </Typography>
            </Box>

            {/* Error message input */}
            <Typography sx={{ fontWeight: 500, mb: 1 }}>
                Enter the error message here.
            </Typography>

            <TextField
                fullWidth
                placeholder="Please enter a valid answer"
                value={errorMessage}
                onChange={(e) => setErrorMessage(e.target.value)}
                size="small"
                sx={{
                    "& .MuiOutlinedInput-root": {
                        borderRadius: "10px",
                        backgroundColor: "#fff",
                    },
                }}
            />
        </Box>
    );
};

export default EmailTab;
