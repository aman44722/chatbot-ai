import React, { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";

const options = [
  "row",   // Represents flexDirection: "column"
  "column", // Represents flexDirection: "row"

];

const ShowOptionsButtons = ({ flexDirection, setFlexDirection }) => {
  // Load the selected flexDirection from localStorage on initial render
  useEffect(() => {
    const savedDirection = localStorage.getItem("flexDirection");
    if (savedDirection) {
      setFlexDirection(savedDirection);  // Set the stored direction if available
    }
  }, [setFlexDirection]);

  const handleSelect = (label) => {
    setFlexDirection(label);  // Update the flexDirection state

    // Save the selected direction in localStorage
    localStorage.setItem("flexDirection", label);  // Store the selected option
  };

  return (
    <Box sx={{ mb: 2, boxShadow: '0px 4px 20px #d8d8d8', textAlign: 'center', padding: '10px', borderRadius: '10px' }}>
      <Typography sx={{ mb: '10px', fontSize: '14px' }}>Select Layout Direction</Typography>
      <div style={{
        display: 'flex',
        flexDirection: "row",
        justifyContent: 'center',
        gap: '4px'
      }}>
        {options.map((label) => (
          <Button
            key={label}
            variant={flexDirection === label ? "contained" : "outlined"}  // Active button gets "contained"
            size="small"
            style={{
              fontSize: '12px',
              marginBottom: '10px',
              backgroundColor: flexDirection === label ? "#2563eb" : "transparent",  // Active button background
              color: flexDirection === label ? "#fff" : "#000",  // Active button text color
              borderColor: flexDirection === label ? "#2563eb" : "#d3d3d3", // Border color change for active
            }}
            onClick={() => handleSelect(label)}  // Change flexDirection on button click
          >
            {label}
          </Button>
        ))}
      </div>

      {/* Render options based on flexDirection */}

    </Box>
  );
};

export default ShowOptionsButtons;
