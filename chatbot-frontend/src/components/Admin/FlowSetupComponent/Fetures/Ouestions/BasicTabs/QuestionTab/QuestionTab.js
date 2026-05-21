import { Box, Switch, TextField, Typography } from "@mui/material";

const QuestionTab = ({ errorMessage, setErrorMessage, skipOption, setSkipOption, validations, setValidations }) => {

  const handleSwitchChange = (event) => {
    setSkipOption(event.target.checked);
  };

  return (
    <Box sx={{ mt: 1 }}>
      {/* Toggle Row */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
        <Switch
          checked={skipOption}
          onChange={handleSwitchChange}
          sx={{
            "& .MuiSwitch-switchBase.Mui-checked": {
              color: "#fff",
              transform: "translateX(16px)",
            },
            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
              backgroundColor: "#2563eb",
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

      {/* Validation Fields */}
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <TextField
          fullWidth label="Min Length"
          value={validations?.minLength ?? ""}
          onChange={(e) => setValidations({ ...validations, minLength: Number(e.target.value) || undefined })}
          size="small"
          sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px", backgroundColor: "#fff" } }}
        />
        <TextField
          fullWidth label="Max Length"
          value={validations?.maxLength ?? ""}
          onChange={(e) => setValidations({ ...validations, maxLength: Number(e.target.value) || undefined })}
          size="small"
          sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px", backgroundColor: "#fff" } }}
        />
      </Box>

      <TextField
        fullWidth label="Regex Pattern"
        placeholder="e.g. ^[a-zA-Z]+$"
        value={validations?.pattern ?? ""}
        onChange={(e) => setValidations({ ...validations, pattern: e.target.value || undefined })}
        size="small"
        sx={{ mb: 2, "& .MuiOutlinedInput-root": { borderRadius: "10px", backgroundColor: "#fff" } }}
      />

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

export default QuestionTab;
