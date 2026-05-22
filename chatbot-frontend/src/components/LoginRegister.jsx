import React, { useState, useEffect } from "react";
import {
  Box, Button, TextField, Typography, Paper, IconButton,
  InputAdornment, MenuItem, Checkbox, FormControlLabel,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../api/authApi";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import SpeedIcon from "@mui/icons-material/Speed";
import SecurityIcon from "@mui/icons-material/Security";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import chatgptAiImg from "../assets/images/chatgpt+ai.webp";
import getStartedImg from "../assets/images/get-started.webp";

const countryCodes = [
  { code: "+91", label: "🇮🇳 +91" },
  { code: "+1", label: "🇺🇸 +1" },
];

const contentFeatures = [
  { icon: <AutoAwesomeIcon />, text: "AI-powered chatbots in minutes" },
  { icon: <SpeedIcon />, text: "No coding required" },
  { icon: <SupportAgentIcon />, text: "Live chat handoff" },
  { icon: <SecurityIcon />, text: "Enterprise-grade security" },
];

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    fullName: "", email: "", password: "", phone: "",
    website: "", countryCode: "+91", termsAgreed: false,
  });

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const toggleMode = () => {
    setIsLogin((prev) => !prev);
    setError("");
    setFormData({ fullName: "", email: "", password: "", phone: "", website: "", countryCode: "+91", termsAgreed: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const payload = { email: formData.email, password: formData.password };

    if (!isLogin) {
      if (!formData.termsAgreed) { setError("You must agree to Terms & Conditions."); return; }
      Object.assign(payload, {
        fullName: formData.fullName,
        website: formData.website,
        phone: `${formData.countryCode}${formData.phone}`,
        countryCode: formData.countryCode,
        termsAccepted: formData.termsAgreed,
      });
    }

    try {
      const response = isLogin ? await loginUser(payload) : await registerUser(payload);
      localStorage.setItem("userId", response.user._id);
      login(response);
      navigate("/app/dashboard");
    } catch (err) {
      setError(typeof err === "string" ? err : err?.message || "An error occurred");
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", fontFamily: "'Poppins', sans-serif", bgcolor: "#F9FAFB" }}>
      {/* ===== LEFT: ANIMATED CONTENT ===== */}
      <Box sx={{
        flex: "0 0 55%",
        display: { xs: "none", md: "flex" },
        flexDirection: "column",
        background: "linear-gradient(135deg, #EEF2FF 0%, #FAF5FF 50%, #F0FDF4 100%)",
        position: "relative",
        overflow: "hidden",
        p: 6,
      }}>
        {/* Animated orbs */}
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          style={{ position: "absolute", top: "8%", left: "5%", width: 350, height: 350, borderRadius: "50%", background: "radial-gradient(circle, rgba(79,70,229,0.08) 0%, transparent 70%)", pointerEvents: "none" }}
        />
        <motion.div
          animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          style={{ position: "absolute", bottom: "10%", right: "8%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 70%)", pointerEvents: "none" }}
        />
        <motion.div
          animate={{ x: [0, 15, 0], y: [0, -15, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          style={{ position: "absolute", top: "50%", left: "60%", width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(16,185,129,0.05) 0%, transparent 70%)", pointerEvents: "none" }}
        />

        {/* Content */}
        <Box sx={{ position: "relative", zIndex: 1, flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", maxWidth: 540, mx: "auto" }}>
          {/* Brand badge */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1, px: 2, py: 0.6, borderRadius: "20px", bgcolor: "rgba(79,70,229,0.08)", border: "1px solid rgba(79,70,229,0.15)", mb: 3 }}>
              <SmartToyIcon sx={{ fontSize: 14, color: "#4F46E5" }} />
              <Typography sx={{ fontSize: 11, fontWeight: 700, color: "#4F46E5", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                BotForge Platform
              </Typography>
            </Box>
          </motion.div>

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <Typography sx={{ fontSize: { md: 34, lg: 40 }, fontWeight: 800, lineHeight: 1.15, color: "#111827", mb: 2, letterSpacing: "-1px" }}>
              Build Smarter{" "}
              <Box component="span" sx={{ background: "linear-gradient(135deg, #4F46E5, #7C3AED)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Chatbots
              </Box>{" "}
              in Minutes
            </Typography>
          </motion.div>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <Typography sx={{ fontSize: 14, color: "#6B7280", lineHeight: 1.7, mb: 3 }}>
              Create intelligent chatbots, automate conversations, and deliver instant support — all from one dashboard. No coding required.
            </Typography>
          </motion.div>

          {/* Feature bullets */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mb: 4 }}>
              {contentFeatures.map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + i * 0.1, duration: 0.4 }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Box sx={{ width: 30, height: 30, borderRadius: "8px", bgcolor: "rgba(79,70,229,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#4F46E5", fontSize: 15 }}>
                      {f.icon}
                    </Box>
                    <Typography sx={{ fontSize: 13, fontWeight: 500, color: "#374151" }}>{f.text}</Typography>
                  </Box>
                </motion.div>
              ))}
            </Box>
          </motion.div>

          {/* Image showcase */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
          >
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <Box
                component="img"
                src={chatgptAiImg}
                alt="AI Chatbot"
                sx={{ width: "48%", borderRadius: 2.5, boxShadow: "0 8px 30px rgba(0,0,0,0.08)", border: "1px solid rgba(229,231,235,0.4)", animation: "float 4s ease-in-out infinite" }}
              />
              <Box
                component="img"
                src={getStartedImg}
                alt="Get Started"
                sx={{ width: "48%", borderRadius: 2.5, boxShadow: "0 8px 30px rgba(0,0,0,0.08)", border: "1px solid rgba(229,231,235,0.4)", animation: "float 4s ease-in-out infinite", animationDelay: "2s" }}
              />
            </Box>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
          >
            <Box sx={{ display: "flex", gap: 4, mt: 3, pt: 3, borderTop: "1px solid rgba(229,231,235,0.5)" }}>
              {[
                { value: "5K+", label: "Bots Created" },
                { value: "500K+", label: "Conversations" },
                { value: "99.9%", label: "Uptime" },
                { value: "4.8★", label: "Rating" },
              ].map((s) => (
                <Box key={s.label} sx={{ textAlign: "center" }}>
                  <Typography sx={{ fontSize: 18, fontWeight: 800, color: "#4F46E5" }}>{s.value}</Typography>
                  <Typography sx={{ fontSize: 10, color: "#9CA3AF", fontWeight: 500 }}>{s.label}</Typography>
                </Box>
              ))}
            </Box>
          </motion.div>
        </Box>
      </Box>

      {/* ===== RIGHT: FORM ===== */}
      <Box sx={{
        flex: { xs: 1, md: "0 0 45%" },
        display: "flex", alignItems: "center", justifyContent: "center",
        p: { xs: 1.5, md: 2 },
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Background decoration */}
        <Box sx={{ position: "absolute", top: "-20%", left: "-10%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(79,70,229,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />
        <Box sx={{ position: "absolute", bottom: "-10%", right: "-10%", width: 250, height: 250, borderRadius: "50%", background: "radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{ width: "100%", maxWidth: 420 }}
        >
          <Paper elevation={0} sx={{
            p: 2, borderRadius: 4,
            bgcolor: "rgba(255,255,255,0.85)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(229,231,235,0.5)",
            boxShadow: "0 4px 24px rgba(0,0,0,0.04)",
          }}>
            {/* Logo + Welcome */}
            <Box sx={{ textAlign: "center", mb: 1.5 }}>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
              >
                <Box sx={{
                  width: 36, height: 36, borderRadius: "10px",
                  background: "linear-gradient(135deg, #4F46E5, #7C3AED)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 8px 24px rgba(79,70,229,0.3)", mx: "auto", mb: 1,
                }}>
                  <SmartToyIcon sx={{ color: "#fff", fontSize: 24 }} />
                </Box>
              </motion.div>
              <Typography sx={{ fontWeight: 700, fontSize: 16, color: "#111827", lineHeight: 1.2 }}>
                Welcome Back
              </Typography>
              <Typography sx={{ fontSize: 12, color: "#6B7280", mt: 0.3 }}>
                Please login to continue accessing your dashboard.
              </Typography>
            </Box>

            {/* Tabs */}
            <Box sx={{ display: "flex", bgcolor: "#F3F4F6", borderRadius: 2, p: 0.3, mb: 1 }}>
              {["Log In", "Sign Up"].map((tab, i) => {
                const active = (i === 0) === isLogin;
                return (
                  <Box
                    key={tab}
                    onClick={() => { if ((i === 0) !== isLogin) toggleMode(); }}
                    sx={{
                      flex: 1, textAlign: "center", py: 0.8, borderRadius: 1.5,
                      cursor: "pointer", fontWeight: 700, fontSize: 13,
                      bgcolor: active ? "#fff" : "transparent",
                      color: active ? "#4F46E5" : "#6B7280",
                      boxShadow: active ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                      transition: "all 0.2s",
                    }}
                  >
                    {tab}
                  </Box>
                );
              })}
            </Box>

            <AnimatePresence mode="wait">
              <motion.form
                key={isLogin ? "login" : "signup"}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                onSubmit={handleSubmit}
              >
                {!isLogin && (
                  <TextField
                    fullWidth margin="none" size="small"
                    label="Full Name"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    sx={{ mb: 2, "& .MuiOutlinedInput-root": { borderRadius: 2, bgcolor: "#FAFAFA" } }}
                  />
                )}

                <TextField
                  fullWidth margin="none" size="small"
                  label="Company Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  sx={{ mb: 2, "& .MuiOutlinedInput-root": { borderRadius: 2, bgcolor: "#FAFAFA" } }}
                />

                <TextField
                  fullWidth margin="none" size="small"
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  sx={{ mb: 2, "& .MuiOutlinedInput-root": { borderRadius: 2, bgcolor: "#FAFAFA" } }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword((prev) => !prev)} size="small">
                          {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                {!isLogin && (
                  <>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: 2 }}>
                      {["8+ Char", "1 Lower", "1 Upper", "1 Special", "1 Num"].map((item) => (
                        <Box key={item} sx={{ fontSize: "10px", bgcolor: "#F3F4F6", color: "#6B7280", px: 1, py: 0.3, borderRadius: "4px", fontWeight: 500 }}>
                          {item}
                        </Box>
                      ))}
                    </Box>

                    <TextField
                      fullWidth margin="none" size="small"
                      label="Website URL"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      required
                      sx={{ mb: 2, "& .MuiOutlinedInput-root": { borderRadius: 2, bgcolor: "#FAFAFA" } }}
                    />

                    <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                      <TextField
                        select size="small"
                        label="Code"
                        value={formData.countryCode}
                        name="countryCode"
                        onChange={handleChange}
                        sx={{ width: "30%", "& .MuiOutlinedInput-root": { borderRadius: 2, bgcolor: "#FAFAFA" } }}
                      >
                        {countryCodes.map((opt) => (
                          <MenuItem key={opt.code} value={opt.code}>{opt.label}</MenuItem>
                        ))}
                      </TextField>
                      <TextField
                        fullWidth size="small"
                        label="Phone Number"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2, bgcolor: "#FAFAFA" } }}
                      />
                    </Box>

                    <FormControlLabel
                      control={<Checkbox name="termsAgreed" checked={formData.termsAgreed} onChange={handleChange} size="small" sx={{ "&.Mui-checked": { color: "#4F46E5" } }} />}
                      label={<Typography variant="body2" sx={{ fontSize: 11, color: "#6B7280" }}>
                        I agree to <a href="/terms" target="_blank" rel="noreferrer" style={{ color: "#4F46E5", fontWeight: 600 }}>Terms</a> & <a href="/privacy" target="_blank" rel="noreferrer" style={{ color: "#4F46E5", fontWeight: 600 }}>Privacy</a>
                      </Typography>}
                      sx={{ mb: 2 }}
                    />
                  </>
                )}

                {error && (
                  <Typography color="error" align="center" mt={0.5} sx={{ fontSize: 12 }}>{error}</Typography>
                )}

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    mt: 2, py: 1.1, borderRadius: 2, textTransform: "none", fontWeight: 700, fontSize: 14,
                    background: "linear-gradient(135deg, #4F46E5, #7C3AED)",
                    boxShadow: "0 4px 16px rgba(79,70,229,0.3)",
                    "&:hover": { boxShadow: "0 8px 24px rgba(79,70,229,0.4)" },
                  }}
                >
                  {isLogin ? "Login to Dashboard" : "Create Free Account"}
                </Button>

                <Typography align="center" mt={2} sx={{ fontSize: 12, color: "#6B7280" }}>
                  {isLogin ? (
                    <>Don't have an account?{" "}
                      <Button variant="text" onClick={toggleMode} sx={{ textTransform: "none", fontWeight: 700, fontSize: 12, color: "#4F46E5", p: 0, minWidth: "auto" }}>
                        Sign Up
                      </Button>
                    </>
                  ) : (
                    <>Already have an account?{" "}
                      <Button variant="text" onClick={toggleMode} sx={{ textTransform: "none", fontWeight: 700, fontSize: 12, color: "#4F46E5", p: 0, minWidth: "auto" }}>
                        Log In
                      </Button>
                    </>
                  )}
                </Typography>
              </motion.form>
            </AnimatePresence>
          </Paper>
        </motion.div>
      </Box>
    </Box>
  );
};

export default AuthForm;
