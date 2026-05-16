import React, { useEffect, useState } from "react";
import { Box, Button, IconButton, Input, TextField } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const OptionInputRow = ({ value, onChange }) => {
  const [options, setOptions] = useState(() => {
    // Ensure that value is a string before attempting to split it
    if (typeof value === "string") {
      // Split the string by commas and remove any extra spaces
      return value.split(',').map(item => item.trim());
    } else if (Array.isArray(value)) {
      // If value is already an array, use it directly
      return value;
    }
    return []; // Return an empty array if the value is neither string nor array
  });

  // Add a new option
  const addOption = () => {
    const addNewOption = "new option"; // Default to "new option" or a dynamic value
    const updatedOptions = [...options, addNewOption];
    setOptions(updatedOptions); // Directly set as an array
    onChange(updatedOptions); // Pass updated options as an array
  };

  // Handle option text change
  const handleOptionChange = (index, newOption) => {
    const updatedOptions = [...options];
    updatedOptions[index] = newOption.trim(); // Update the option as a string and trim it
    setOptions(updatedOptions); // Update options
    onChange(updatedOptions); // Update options in parent
  };

  // Delete option logic
  const deleteOption = (index) => {
    const updatedOptions = options.filter((_, i) => i !== index);
    setOptions(updatedOptions); // Update options
    onChange(updatedOptions); // Pass updated options as an array
  };

  return (
    <Box sx={{ width: "100%" }}>
      {/* Render existing options */}
      <Box sx={{ borderRadius: "6px", backgroundColor: "#fff", marginBottom: "16px" }}>
        {options.map((option, index) => (
          <Box key={index} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
            <TextField
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              fullWidth
              placeholder={`Option ${index + 1}`}
              size="small"
              variant="outlined"
              sx={{
                marginBottom: "10px",
                borderRadius: "8px",
                backgroundColor: "#f9fafb",
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#d1d5db", // Tailwind's gray-300
                  },
                  "&:hover fieldset": {
                    borderColor: "#2563eb", // Hover blue
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#2563eb", // Focus blue
                    boxShadow: "0 0 0 1px #2563eb",
                  },
                },
              }}
            />
            <IconButton onClick={() => deleteOption(index)} sx={{ marginLeft: 1, height: '40px', width: '40px', color: 'red', marginBottom: "18px" }}>
              <DeleteIcon />
            </IconButton>
          </Box>
        ))}
      </Box>

      {/* Add new option button */}
      <Button onClick={addOption} variant="outlined" sx={{ marginTop: 2 }}>
        Add Option
      </Button>
    </Box >
  );
};

export default OptionInputRow;
