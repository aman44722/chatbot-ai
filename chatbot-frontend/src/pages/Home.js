import React, { useState, useEffect } from "react";
import { Box, Button, Typography, Container, Grid, Card, CardContent, Avatar, TextField } from "@mui/material";
import { motion, useScroll, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import SpeedIcon from "@mui/icons-material/Speed";
import SecurityIcon from "@mui/icons-material/Security";
import BarChartIcon from "@mui/icons-material/BarChart";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

const fadeUp = {
  initial: { opacity: 0, y: 60 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.7, ease: "easeOut" },
};

const stagger = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, ease: "easeOut" },
};

const features = [
  { icon: <SpeedIcon sx={{ fontSize: 32 }} />, title: "Lightning Fast", desc: "Deploy your chatbot in minutes with zero coding. Get started instantly." },
  { icon: <SmartToyIcon sx={{ fontSize: 32 }} />, title: "AI-Powered", desc: "Smart responses powered by advanced AI that learns from every conversation." },
  { icon: <BarChartIcon sx={{ fontSize: 32 }} />, title: "Deep Analytics", desc: "Track performance, user behavior, and conversation trends in real-time." },
  { icon: <SecurityIcon sx={{ fontSize: 32 }} />, title: "Enterprise Security", desc: "Bank-grade encryption and compliance with global data protection standards." },
  { icon: <SupportAgentIcon sx={{ fontSize: 32 }} />, title: "Live Agent Handoff", desc: "Seamlessly escalate to human agents when your bot needs backup." },
  { icon: <AutoAwesomeIcon sx={{ fontSize: 32 }} />, title: "Smart Automation", desc: "Automate repetitive tasks and let your team focus on what matters." },
];

const stats = [
  { value: "10K+", label: "Active Users" },
  { value: "1M+", label: "Conversations" },
  { value: "99.9%", label: "Uptime" },
  { value: "4.9★", label: "Rating" },
];

const testimonials = [
  { name: "Sarah Chen", role: "CEO, TechStart", text: "This chatbot transformed our customer support. Response time dropped by 80%!" },
  { name: "James Wilson", role: "Product Manager, CloudCo", text: "The flow builder is incredibly intuitive. We built our entire support flow in one day." },
  { name: "Priya Patel", role: "Founder, ShopEasy", text: "Our customers love the instant responses. Sales have increased by 35% since implementing." },
];

const CountUp = ({ end, duration = 2 }) => {
  const [count, setCount] = useState(0);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const increment = Math.ceil(end / (duration * 60));
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [inView, end, duration]);

  return (
    <motion.div onViewportEnter={() => setInView(true)}>
      <Typography sx={{ fontSize: { xs: 36, md: 48 }, fontWeight: 800, color: "#4F46E5", lineHeight: 1 }}>
        {typeof end === "number" ? count.toLocaleString() : count + "+"}
      </Typography>
    </motion.div>
  );
};

const Home = () => {
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const headerBg = useTransform(scrollYProgress, [0, 0.08], ["rgba(255,255,255,0)", "rgba(255,255,255,0.95)"]);
  const headerShadow = useTransform(scrollYProgress, [0, 0.08], ["0 0 0 rgba(0,0,0,0)", "0 4px 30px rgba(0,0,0,0.08)"]);

  const [heroInView, setHeroInView] = useState(true);

  const TypeWriter = ({ text, speed = 50 }) => {
    const [displayed, setDisplayed] = useState("");
    useEffect(() => {
      let i = 0;
      const timer = setInterval(() => {
        setDisplayed(text.slice(0, i + 1));
        i++;
        if (i >= text.length) clearInterval(timer);
      }, speed);
      return () => clearInterval(timer);
    }, [text, speed]);
    return <>{displayed}<span className="cursor-blink">|</span></>;
  };

  return (
    <Box sx={{ overflow: "hidden", fontFamily: "'Poppins', sans-serif" }}>
      {/* ===== HEADER ===== */}
      <motion.header
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 1100,
          background: headerBg, boxShadow: headerShadow,
          backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
          transition: "background 0.3s",
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 70 }}>
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, cursor: "pointer" }} onClick={() => navigate("/")}>
                <Box sx={{ width: 36, height: 36, borderRadius: "10px", background: "linear-gradient(135deg, #4F46E5, #7C3AED)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <SmartToyIcon sx={{ color: "#fff", fontSize: 20 }} />
                </Box>
                <Typography sx={{ fontWeight: 700, fontSize: 20, color: "#1f2937", letterSpacing: "-0.5px" }}>
                  SmartBot
                </Typography>
              </Box>
            </motion.div>

            <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 4 }}>
              {["Product", "Features", "Pricing", "About"].map((item, i) => (
                <motion.a
                  key={item}
                  href="#"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i, duration: 0.4 }}
                  whileHover={{ scale: 1.05 }}
                  sx={{ textDecoration: "none", color: "#4b5563", fontWeight: 500, fontSize: 14, cursor: "pointer", "&:hover": { color: "#4F46E5" } }}
                >
                  {item}
                </motion.a>
              ))}
            </Box>

            <Box sx={{ display: "flex", gap: 1.5 }}>
              <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
                <Button onClick={() => navigate("/login")} sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600, color: "#4b5563", px: 2.5, "&:hover": { bgcolor: "#f3f4f6" } }}>
                  Log in
                </Button>
              </motion.div>
              <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
                <Button
                  variant="contained"
                  onClick={() => navigate("/signup")}
                  sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600, px: 2.5, background: "linear-gradient(135deg, #4F46E5, #7C3AED)", boxShadow: "0 4px 15px rgba(79,70,229,0.4)", "&:hover": { boxShadow: "0 6px 25px rgba(79,70,229,0.5)" } }}
                >
                  Get Started Free
                </Button>
              </motion.div>
            </Box>
          </Box>
        </Container>
      </motion.header>

      {/* ===== HERO ===== */}
      <Box sx={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", background: "linear-gradient(135deg, #EEF2FF 0%, #FAF5FF 50%, #F0FDF4 100%)", pt: 10 }}>
        {/* Floating orbs */}
        <Box sx={{ position: "absolute", top: "10%", left: "5%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(79,70,229,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
        <Box sx={{ position: "absolute", bottom: "15%", right: "8%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
        <Box sx={{ position: "absolute", top: "40%", right: "30%", width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />

        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}>
                <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1, px: 2, py: 0.6, borderRadius: "20px", bgcolor: "rgba(79,70,229,0.1)", border: "1px solid rgba(79,70,229,0.2)", mb: 2 }}>
                  <AutoAwesomeIcon sx={{ fontSize: 14, color: "#4F46E5" }} />
                  <Typography sx={{ fontSize: 12, fontWeight: 600, color: "#4F46E5", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    AI-Powered Chatbot Platform
                  </Typography>
                </Box>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}>
                <Typography sx={{ fontSize: { xs: 36, md: 52, lg: 60 }, fontWeight: 800, lineHeight: 1.1, color: "#111827", mb: 2, letterSpacing: "-1.5px" }}>
                  Automate Conversations.{" "}
                  <Box component="span" sx={{ background: "linear-gradient(135deg, #4F46E5, #7C3AED)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                    Grow Faster.
                  </Box>
                </Typography>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}>
                <Typography sx={{ fontSize: { xs: 16, md: 18 }, color: "#6B7280", lineHeight: 1.7, mb: 4, maxWidth: 540 }}>
                  <TypeWriter text="Build intelligent chatbots that engage visitors, qualify leads, and provide instant support — 24/7. No coding required." speed={25} />
                </Typography>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.35, ease: "easeOut" }}>
                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate("/signup")}
                    endIcon={<ArrowForwardIcon />}
                    sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600, px: 4, py: 1.5, fontSize: 16, background: "linear-gradient(135deg, #4F46E5, #7C3AED)", boxShadow: "0 8px 30px rgba(79,70,229,0.35)", "&:hover": { boxShadow: "0 12px 40px rgba(79,70,229,0.45)" } }}
                  >
                    Start Free Trial
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    startIcon={<PlayArrowIcon />}
                    sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600, px: 4, py: 1.5, fontSize: 16, borderColor: "#d1d5db", color: "#374151", "&:hover": { borderColor: "#4F46E5", color: "#4F46E5", bgcolor: "rgba(79,70,229,0.04)" } }}
                  >
                    Watch Demo
                  </Button>
                </Box>
              </motion.div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.6 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 4 }}>
                  <Box sx={{ display: "flex" }}>
                    {[1, 2, 3, 4].map((_, i) => (
                      <Avatar key={i} sx={{ width: 36, height: 36, border: "2px solid #fff", ml: i > 0 ? -1.5 : 0, bgcolor: ["#4F46E5", "#7C3AED", "#EC4899", "#F59E0B"][i], fontSize: 12, fontWeight: 700 }}>
                        {["S", "J", "M", "L"][i]}
                      </Avatar>
                    ))}
                  </Box>
                  <Typography sx={{ fontSize: 13, color: "#6B7280" }}>
                    <strong style={{ color: "#111827" }}>4K+</strong> businesses already onboard
                  </Typography>
                </Box>
              </motion.div>
            </Grid>

            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, scale: 0.85, x: 60 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
              >
                <Box sx={{ position: "relative" }}>
                  <Box sx={{ bgcolor: "#fff", borderRadius: 4, boxShadow: "0 25px 60px rgba(0,0,0,0.12)", overflow: "hidden", border: "1px solid rgba(229,231,235,0.5)" }}>
                    <Box sx={{ bgcolor: "#f9fafb", px: 3, py: 1.5, borderBottom: "1px solid #e5e7eb", display: "flex", alignItems: "center", gap: 1 }}>
                      <Box sx={{ display: "flex", gap: 0.5 }}>
                        <Box sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: "#ef4444" }} />
                        <Box sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: "#f59e0b" }} />
                        <Box sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: "#10b981" }} />
                      </Box>
                      <Typography sx={{ fontSize: 12, color: "#9ca3af", ml: 1 }}>SmartBot Dashboard</Typography>
                    </Box>
                    <Box sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2 }}>
                      <Box sx={{ display: "flex", gap: 2 }}>
                        <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: "#EEF2FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <SmartToyIcon sx={{ color: "#4F46E5", fontSize: 22 }} />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Box sx={{ height: 12, width: "60%", borderRadius: 1, bgcolor: "#e5e7eb", mb: 1 }} />
                          <Box sx={{ height: 12, width: "40%", borderRadius: 1, bgcolor: "#e5e7eb" }} />
                        </Box>
                      </Box>
                      <Box sx={{ display: "flex", gap: 1.5 }}>
                        {["Welcome!", "How can I help?", "Get Started"].map((t, i) => (
                          <motion.div
                            key={t}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 + i * 0.15, duration: 0.4 }}
                          >
                            <Box sx={{ px: 2, py: 1, borderRadius: 2, bgcolor: i === 0 ? "#4F46E5" : "#f3f4f6", color: i === 0 ? "#fff" : "#374151", fontSize: 12, fontWeight: 500 }}>
                              {t}
                            </Box>
                          </motion.div>
                        ))}
                      </Box>
                      <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.3, duration: 0.5 }}
                      >
                        <Box sx={{ alignSelf: "flex-end", px: 2, py: 1.5, borderRadius: "12px 12px 4px 12px", bgcolor: "#4F46E5", color: "#fff", fontSize: 13, maxWidth: "70%" }}>
                          Hi! I'd like to learn more about your pricing.
                        </Box>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.6, duration: 0.5 }}
                      >
                        <Box sx={{ alignSelf: "flex-start", px: 2, py: 1.5, borderRadius: "12px 12px 12px 4px", bgcolor: "#f3f4f6", color: "#374151", fontSize: 13, maxWidth: "70%" }}>
                          Sure! We have plans starting at $29/month. Want a personalized demo?
                        </Box>
                      </motion.div>
                    </Box>
                  </Box>
                  <Box sx={{ position: "absolute", bottom: -15, right: -15, width: 120, height: 120, borderRadius: "50%", background: "linear-gradient(135deg, rgba(79,70,229,0.1), rgba(124,58,237,0.1))", zIndex: -1 }} />
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ===== STATS ===== */}
      <Box sx={{ py: { xs: 6, md: 8 }, bgcolor: "#fff" }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {stats.map((stat, i) => (
              <Grid item xs={6} md={3} key={stat.label}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  style={{ textAlign: "center" }}
                >
                  <Typography sx={{ fontSize: { xs: 36, md: 48 }, fontWeight: 800, background: "linear-gradient(135deg, #4F46E5, #7C3AED)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", lineHeight: 1 }}>
                    {stat.value}
                  </Typography>
                  <Typography sx={{ color: "#6B7280", fontWeight: 500, mt: 1, fontSize: 15 }}>{stat.label}</Typography>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ===== FEATURES ===== */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: "#F9FAFB" }}>
        <Container maxWidth="lg">
          <motion.div {...fadeUp}>
            <Typography sx={{ textAlign: "center", fontSize: { xs: 28, md: 38 }, fontWeight: 800, color: "#111827", mb: 1 }}>
              Everything You Need
            </Typography>
            <Typography sx={{ textAlign: "center", color: "#6B7280", fontSize: 16, mb: 6, maxWidth: 600, mx: "auto" }}>
              Powerful features to automate, analyze, and optimize your customer conversations.
            </Typography>
          </motion.div>

          <Grid container spacing={3}>
            {features.map((f, i) => (
              <Grid item xs={12} sm={6} md={4} key={f.title}>
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: i * 0.08, duration: 0.5, ease: "easeOut" }}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  style={{ height: "100%" }}
                >
                  <Card sx={{ height: "100%", borderRadius: 3, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", transition: "box-shadow 0.3s", "&:hover": { boxShadow: "0 12px 40px rgba(0,0,0,0.08)" } }}>
                    <CardContent sx={{ p: 3.5 }}>
                      <Box sx={{ width: 56, height: 56, borderRadius: 2.5, bgcolor: "#EEF2FF", display: "flex", alignItems: "center", justifyContent: "center", color: "#4F46E5", mb: 2.5 }}>
                        {f.icon}
                      </Box>
                      <Typography sx={{ fontWeight: 700, fontSize: 17, color: "#111827", mb: 1 }}>{f.title}</Typography>
                      <Typography sx={{ color: "#6B7280", fontSize: 14, lineHeight: 1.7 }}>{f.desc}</Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ===== TESTIMONIALS ===== */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: "#fff" }}>
        <Container maxWidth="lg">
          <motion.div {...fadeUp}>
            <Typography sx={{ textAlign: "center", fontSize: { xs: 28, md: 38 }, fontWeight: 800, color: "#111827", mb: 1 }}>
              Loved by Thousands
            </Typography>
            <Typography sx={{ textAlign: "center", color: "#6B7280", fontSize: 16, mb: 6, maxWidth: 500, mx: "auto" }}>
              See what our customers have to say about their experience.
            </Typography>
          </motion.div>

          <Grid container spacing={3}>
            {testimonials.map((t, i) => (
              <Grid item xs={12} md={4} key={t.name}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  whileHover={{ y: -4 }}
                  style={{ height: "100%" }}
                >
                  <Card sx={{ height: "100%", borderRadius: 3, p: 3.5, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", position: "relative" }}>
                    <FormatQuoteIcon sx={{ position: "absolute", top: 16, right: 20, fontSize: 40, color: "#EEF2FF", opacity: 0.6 }} />
                    <Typography sx={{ color: "#4B5563", fontSize: 14, lineHeight: 1.8, mb: 3, fontStyle: "italic" }}>
                      "{t.text}"
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      <Avatar sx={{ width: 40, height: 40, bgcolor: ["#4F46E5", "#7C3AED", "#EC4899"][i], fontWeight: 700 }}>{t.name.charAt(0)}</Avatar>
                      <Box>
                        <Typography sx={{ fontWeight: 600, fontSize: 14, color: "#111827" }}>{t.name}</Typography>
                        <Typography sx={{ fontSize: 12, color: "#9CA3AF" }}>{t.role}</Typography>
                      </Box>
                    </Box>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ===== CTA ===== */}
      <Box sx={{ py: { xs: 8, md: 12 }, background: "linear-gradient(135deg, #EEF2FF 0%, #FAF5FF 100%)" }}>
        <Container maxWidth="md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Box sx={{ textAlign: "center", bgcolor: "#fff", borderRadius: 4, p: { xs: 4, md: 6 }, boxShadow: "0 10px 40px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6" }}>
              <Typography sx={{ fontSize: { xs: 28, md: 36 }, fontWeight: 800, color: "#111827", mb: 2 }}>
                Ready to Transform Your Support?
              </Typography>
              <Typography sx={{ color: "#6B7280", fontSize: 16, mb: 4, maxWidth: 480, mx: "auto" }}>
                Join thousands of businesses using SmartBot to automate conversations and delight customers.
              </Typography>
              <Box sx={{ display: "flex", justifyContent: "center", gap: 2, flexWrap: "wrap" }}>
                <TextField
                  placeholder="Enter your work email"
                  size="small"
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2, bgcolor: "#fff", minWidth: 280 } }}
                />
                <Button
                  variant="contained"
                  onClick={() => navigate("/signup")}
                  sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600, px: 4, py: 1.5, background: "linear-gradient(135deg, #4F46E5, #7C3AED)", boxShadow: "0 8px 25px rgba(79,70,229,0.35)", "&:hover": { boxShadow: "0 12px 35px rgba(79,70,229,0.45)" } }}
                >
                  Get Started Free
                </Button>
              </Box>
              <Typography sx={{ color: "#9CA3AF", fontSize: 12, mt: 2 }}>No credit card required · Free 14-day trial</Typography>
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* ===== FOOTER ===== */}
      <Box sx={{ bgcolor: "#111827", pt: { xs: 6, md: 8 }, pb: 4 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
                  <Box sx={{ width: 34, height: 34, borderRadius: "8px", background: "linear-gradient(135deg, #4F46E5, #7C3AED)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <SmartToyIcon sx={{ color: "#fff", fontSize: 18 }} />
                  </Box>
                  <Typography sx={{ fontWeight: 700, fontSize: 18, color: "#fff" }}>SmartBot</Typography>
                </Box>
                <Typography sx={{ color: "#9CA3AF", fontSize: 13, lineHeight: 1.8, mb: 3, maxWidth: 300 }}>
                  AI-powered chatbot platform that helps businesses automate conversations, qualify leads, and deliver instant customer support.
                </Typography>
                <Box sx={{ display: "flex", gap: 1.5 }}>
                  {[
                    { icon: "M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z", label: "Twitter" },
                    { icon: "M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2zM4 6a2 2 0 100-4 2 2 0 000 4z", label: "LinkedIn" },
                    { icon: "M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z", label: "Facebook" },
                  ].map((s) => (
                    <motion.a
                      key={s.label}
                      href="#"
                      whileHover={{ y: -3, scale: 1.1 }}
                      style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d={s.icon} />
                      </svg>
                    </motion.a>
                  ))}
                </Box>
              </motion.div>
            </Grid>

            {[
              { title: "Product", links: ["Features", "Pricing", "Integrations", "API"] },
              { title: "Company", links: ["About", "Blog", "Careers", "Contact"] },
              { title: "Support", links: ["Help Center", "Documentation", "System Status", "Community"] },
              { title: "Legal", links: ["Privacy Policy", "Terms of Service", "Cookie Policy", "GDPR"] },
            ].map((col, i) => (
              <Grid item xs={6} sm={4} md={2} key={col.title}>
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                  <Typography sx={{ fontWeight: 600, fontSize: 13, color: "#fff", mb: 2, textTransform: "uppercase", letterSpacing: "1px" }}>{col.title}</Typography>
                  {col.links.map((l) => (
                    <Typography key={l} component="a" href="#" sx={{ display: "block", color: "#9CA3AF", fontSize: 13, mb: 1.2, textDecoration: "none", cursor: "pointer", "&:hover": { color: "#fff" } }}>
                      {l}
                    </Typography>
                  ))}
                </motion.div>
              </Grid>
            ))}
          </Grid>

          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
            <Box sx={{ borderTop: "1px solid rgba(255,255,255,0.08)", mt: 6, pt: 4, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
              <Typography sx={{ color: "#6B7280", fontSize: 13 }}>
                © 2025 SmartBot, Inc. All rights reserved.
              </Typography>
              <Typography sx={{ color: "#6B7280", fontSize: 13 }}>
                Made with ❤️ for better conversations
              </Typography>
            </Box>
          </motion.div>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;