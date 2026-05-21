import { Box, Switch, TextField, Typography } from '@mui/material'
import React from 'react'

const NumberTab = ({ skipOption, setSkipOption, errorMessage, setErrorMessage, validations, setValidations }) => {
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
                <Switch checked={skipOption} onChange={handleSwitchChange} />
                <Typography sx={{ fontWeight: 500, color: "#6b7280" }}>
                  {skipOption ? "Give Skip Option" : "Do Not Give Skip Option"}
                </Typography>
            </Box>

            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                <TextField
                  fullWidth label="Minimum Value"
                  value={validations?.minLength ?? ""}
                  onChange={(e) => setValidations({ ...validations, minLength: Number(e.target.value) || undefined })}
                />
                <TextField
                  fullWidth label="Maximum Value"
                  value={validations?.maxLength ?? ""}
                  onChange={(e) => setValidations({ ...validations, maxLength: Number(e.target.value) || undefined })}
                />
            </Box>

            <Typography sx={{ fontWeight: 500, mb: 1 }}>
              Enter the error message here.
            </Typography>
            <TextField
              fullWidth placeholder="Please enter a valid answer"
              value={errorMessage}
              onChange={(e) => setErrorMessage(e.target.value)}
              size="small"
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px", backgroundColor: "#fff" } }}
            />
        </>
  )
}

export default NumberTab
