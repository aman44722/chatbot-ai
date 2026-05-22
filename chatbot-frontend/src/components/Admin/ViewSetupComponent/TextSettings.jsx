import React from "react";
import { Box, TextField, Typography, Select, MenuItem, FormControl } from "@mui/material";

const SectionCard = ({ title, desc, children }) => (
  <Box sx={{
    bgcolor: "#f9fafb", borderRadius: 2.5, p: 1.5, mb: 1.5,
    border: "1px solid #f3f4f6",
  }}>
    <Typography sx={{ fontWeight: 700, fontSize: 13, color: "#111827", mb: 0.1 }}>{title}</Typography>
    {desc && <Typography sx={{ fontSize: 11, color: "#9ca3af", mb: 1 }}>{desc}</Typography>}
    {children}
  </Box>
);

const FormRow = ({ label, children }) => (
  <Box sx={{ mb: 1 }}>
    <Typography sx={{ fontWeight: 600, fontSize: 12, color: "#374151", mb: 0.3 }}>{label}</Typography>
    {children}
  </Box>
);

const TextSettings = ({ botName, setBotName, welcomeText, setWelcomeText, description, setDescription, font, setFont, fontSize, setFontSize }) => (
  <div>
    <SectionCard title="Bot Identity" desc="Configure your bot's name, greeting, and description.">
      <FormRow label="Bot Name">
        <TextField size="small" value={botName} onChange={(e) => setBotName(e.target.value)}
          placeholder="My Chatbot" fullWidth
          sx={inputSx} />
      </FormRow>
      <FormRow label="Welcome Text">
        <TextField size="small" value={welcomeText} onChange={(e) => setWelcomeText(e.target.value)}
          placeholder="Hi! How can I help you?" fullWidth
          sx={inputSx} />
      </FormRow>
      <FormRow label="Bot Description">
        <TextField size="small" value={description} onChange={(e) => setDescription(e.target.value)}
          placeholder="I'm your virtual assistant" fullWidth multiline minRows={2}
          sx={inputSx} />
      </FormRow>
    </SectionCard>

    <SectionCard title="Typography" desc="Choose font family and size.">
      <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 1 }}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <FormRow label="Font Family">
            <TextField size="small" value={font} onChange={(e) => setFont(e.target.value)}
              placeholder="Arial, sans-serif" fullWidth sx={inputSx} />
          </FormRow>
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <FormRow label="Font Size">
            <FormControl fullWidth size="small">
              <Select value={fontSize} onChange={(e) => setFontSize(e.target.value)}
                sx={selectSx}>
                <MenuItem value="14px">14px</MenuItem>
                <MenuItem value="16px">16px</MenuItem>
                <MenuItem value="18px">18px</MenuItem>
              </Select>
            </FormControl>
          </FormRow>
        </Box>
      </Box>
    </SectionCard>
  </div>
);

const inputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px", bgcolor: "#fff", fontSize: 12,
    "& fieldset": { borderColor: "#e5e7eb" },
    "&:hover fieldset": { borderColor: "#c7d2fe" },
    "&.Mui-focused fieldset": { borderColor: "#6366f1" },
  },
};

const selectSx = {
  borderRadius: "8px", bgcolor: "#fff", fontSize: 12,
  "& fieldset": { borderColor: "#e5e7eb" },
};

export default TextSettings;
