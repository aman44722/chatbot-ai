import React, { useEffect, useState } from "react";
import { Box, Button, IconButton, TextField, Tooltip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const getValue = (opt) => typeof opt === 'string' ? opt : (opt?.value || opt?.label || '');
const isHidden = (opt) => typeof opt === 'object' && opt?.hidden === true;

const OptionInputRow = ({ value, onChange }) => {
  const [options, setOptions] = useState(() => {
    if (typeof value === "string") {
      return value.split(',').map(item => item.trim());
    } else if (Array.isArray(value)) {
      return value;
    }
    return [];
  });

  useEffect(() => {
    if (Array.isArray(value)) {
      setOptions(value);
    }
  }, [value]);

  const addOption = () => {
    const updatedOptions = [...options, ""];
    setOptions(updatedOptions);
    onChange(updatedOptions);
  };

  const handleOptionChange = (index, newOption) => {
    const updatedOptions = [...options];
    const existing = options[index];
    if (typeof existing === 'object' && existing !== null) {
      updatedOptions[index] = { ...existing, value: newOption.trim(), label: newOption.trim() };
    } else {
      updatedOptions[index] = newOption.trim();
    }
    setOptions(updatedOptions);
    onChange(updatedOptions);
  };

  const deleteOption = (index) => {
    const updatedOptions = options.filter((_, i) => i !== index);
    setOptions(updatedOptions);
    onChange(updatedOptions);
  };

  const toggleHidden = (index) => {
    const updatedOptions = [...options];
    const opt = options[index];
    if (isHidden(opt)) {
      const val = getValue(opt);
      updatedOptions[index] = val || '';
    } else {
      const val = getValue(opt);
      updatedOptions[index] = { value: val, label: val, hidden: true };
    }
    setOptions(updatedOptions);
    onChange(updatedOptions);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderRadius: "6px", backgroundColor: "#fff", marginBottom: "16px" }}>
        {options.map((option, index) => {
          const hidden = isHidden(option);
          return (
          <Box key={index} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', opacity: hidden ? 0.45 : 1 }}>
            <TextField
              value={getValue(option)}
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
                  "& fieldset": { borderColor: hidden ? "#fbbf24" : "#d1d5db" },
                  "&:hover fieldset": { borderColor: "#2563eb" },
                  "&.Mui-focused fieldset": { borderColor: "#2563eb", boxShadow: "0 0 0 1px #2563eb" },
                },
              }}
            />
            <Tooltip title={hidden ? 'Hidden from users' : 'Visible to users'}>
              <IconButton onClick={() => toggleHidden(index)} sx={{ marginLeft: 0.5, height: '40px', width: '40px', color: hidden ? '#f59e0b' : '#6b7280', marginBottom: "18px" }}>
                {hidden ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </IconButton>
            </Tooltip>
            <IconButton onClick={() => deleteOption(index)} sx={{ marginLeft: 0.5, height: '40px', width: '40px', color: 'red', marginBottom: "18px" }}>
              <DeleteIcon />
            </IconButton>
          </Box>
          );
        })}
      </Box>

      <Button onClick={addOption} variant="outlined" sx={{ marginTop: 2 }}>
        Add Option
      </Button>
    </Box >
  );
};

export default OptionInputRow;
