import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  IconButton,
  InputAdornment,
  MenuItem,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../api/authApi";
import { useAuth } from "../context/AuthContext";

const countryCodes = [
  { code: "+91", label: "🇮🇳 India" },
  { code: "+1", label: "🇺🇸 USA" },
];

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    website: "",
    countryCode: "+91",
    termsAgreed: false,
  });

  const navigate = useNavigate();
  const { login } = useAuth();
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const toggleMode = () => {
    setIsLogin((prev) => !prev);
    setError("");
    setFormData({
      fullName: "",
      email: "",
      password: "",
      phone: "",
      website: "",
      countryCode: "+91",
      termsAgreed: false,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const payload = {
      email: formData.email,
      password: formData.password,
    };

    if (!isLogin) {
      if (!formData.termsAgreed) {
        setError("You must agree to Terms & Conditions.");
        return;
      }

      Object.assign(payload, {
        fullName: formData.fullName, // not 'name'
        website: formData.website,
        phone: `${formData.countryCode}${formData.phone}`,
        countryCode: formData.countryCode,
        termsAccepted: formData.termsAgreed, // backend expects 'termsAccepted'
      });
    }

    try {
      const response = isLogin ? await loginUser(payload) : await registerUser(payload);

      localStorage.setItem("userId", response.user._id);
      if (response.botId) localStorage.setItem("selectedBotId", response.botId);
      login(response);
      navigate("/app/dashboard");
    } catch (err) {
      setError(typeof err === "string" ? err : err?.message || "An error occurred");
    }
  };

  return (
    <Container maxWidth="xs">
      <Paper elevation={4} sx={{ padding: 4, mt: 8, borderRadius: 3 }}>
        <Typography
          variant="h6"
          align="center"
          color="primary"
          fontWeight={600}
        >
          {isLogin ? "Welcome Back" : "Sign Up for a 14-Day Free Trial."}
        </Typography>
        <Typography align="center" mt={1} mb={2} color="text.secondary">
          {isLogin ? "Please login to continue accessing your dashboard." : ""}
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="Company Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <TextField
            fullWidth
            margin="normal"
            label="Password"
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword((prev) => !prev)}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {!isLogin && (
            <>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 1 }}>
                {[
                  "8 Char",
                  "1 Lowercase",
                  "1 Uppercase",
                  "1 Special Char",
                  "1 Num",
                ].map((item, i) => (
                  <Box
                    key={i}
                    sx={{
                      fontSize: "12px",
                      background: "#e0e0e0",
                      px: 1,
                      py: 0.5,
                      borderRadius: "4px",
                    }}
                  >
                    {item}
                  </Box>
                ))}
              </Box>

              <TextField
                fullWidth
                margin="normal"
                label="Website URL"
                name="website"
                value={formData.website}
                onChange={handleChange}
                required
              />

              <TextField
                fullWidth
                margin="normal"
                label="Full Name"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
              />

              <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                <TextField
                  select
                  label="Country"
                  value={formData.countryCode}
                  name="countryCode"
                  onChange={handleChange}
                  sx={{ width: "30%" }}
                >
                  {countryCodes.map((option) => (
                    <MenuItem key={option.code} value={option.code}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  fullWidth
                  label="WhatsApp / Phone Number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </Box>

              <FormControlLabel
                control={
                  <Checkbox
                    name="termsAgreed"
                    checked={formData.termsAgreed}
                    onChange={handleChange}
                    required
                  />
                }
                label={
                  <Typography variant="body2">
                    I agree to{" "}
                    <a href="/terms" target="_blank" rel="noreferrer">
                      Terms & Conditions
                    </a>{" "}
                    and{" "}
                    <a href="/privacy" target="_blank" rel="noreferrer">
                      Privacy Policy
                    </a>
                    .
                  </Typography>
                }
              />
            </>
          )}

          {error && (
            <Typography color="error" align="center" mt={1}>
              {error}
            </Typography>
          )}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 2, py: 1.2 }}
          >
            {isLogin ? "Login To Dashboard" : "Send Code Via Email"}
          </Button>
        </form>

        <Typography align="center" mt={2}>
          {isLogin ? (
            <>
              Don't have an account?{" "}
              <Button variant="text" onClick={toggleMode}>
                Sign Up
              </Button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <Button variant="text" onClick={toggleMode}>
                Login
              </Button>
            </>
          )}
        </Typography>
      </Paper>
    </Container>
  );
};

export default AuthForm;
