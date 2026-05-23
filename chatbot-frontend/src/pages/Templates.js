import React, { useState } from "react";
import {
  Box, Paper, Typography, Button, Chip, TextField, Dialog, DialogTitle,
  DialogContent, DialogActions, CircularProgress, Grid,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import QuizIcon from "@mui/icons-material/Quiz";
import PaletteIcon from "@mui/icons-material/Palette";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import TEMPLATES from "../data/templates";
import { createBot, updateBot } from "../api/botApi";

const Templates = () => {
  const navigate = useNavigate();
  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const [applyDialog, setApplyDialog] = useState(null);
  const [botName, setBotName] = useState("");
  const [applying, setApplying] = useState(false);

  const allIndustries = TEMPLATES.map((t) => ({
    id: t.industry,
    label: t.industry,
    icon: t.icon,
    color: t.color,
    count: t.templates.length,
  }));

  const visible = selectedIndustry
    ? TEMPLATES.filter((t) => t.industry === selectedIndustry)
    : TEMPLATES;

  const handleApply = async () => {
    if (!botName.trim()) return;
    const template = applyDialog;
    setApplying(true);
    try {
      const created = await createBot(botName.trim());
      const botId = created.bot._id || created._id;
      await updateBot(botId, {
        botSettings: template.botSettings,
        flowSetupSetting: template.flowSetupSetting,
      });
      localStorage.setItem("selectedBotId", botId);
      setApplyDialog(null);
      setBotName("");
      navigate("/app/flow-setup");
    } catch (e) {
      alert(e?.message || "Failed to apply template");
    } finally {
      setApplying(false);
    }
  };

  return (
    <Box sx={{
      position: "relative", minHeight: "100%", p: { xs: 2, md: 3 },
      "&::before": {
        content: '""', position: "absolute", inset: 0,
        background: `
          radial-gradient(600px circle at 0% 20%, rgba(99,102,241,0.06) 0%, transparent 70%),
          radial-gradient(500px circle at 80% 80%, rgba(139,92,246,0.05) 0%, transparent 70%),
          radial-gradient(400px circle at 50% 50%, rgba(99,102,241,0.03) 0%, transparent 70%)
        `,
        animation: "waterFlow 12s ease-in-out infinite",
        pointerEvents: "none",
      },
      "&::after": {
        content: '""', position: "absolute", inset: 0,
        background: "linear-gradient(180deg, #f8faff 0%, #f0f4ff 50%, #faf5ff 100%)",
        opacity: 0.7, pointerEvents: "none",
      },
      "@keyframes waterFlow": {
        "0%,100%": { backgroundPosition: "0% 0%" },
        "50%": { backgroundPosition: "100% 100%" },
      },
    }}>
      <Box sx={{ position: "relative", zIndex: 1 }}>
        {/* Header */}
        <Paper sx={{
          p: { xs: 2.5, md: 3.5 }, mb: 3, borderRadius: 3.5,
          bgcolor: "rgba(255,255,255,0.88)", backdropFilter: "blur(16px)",
          border: "1px solid rgba(229,231,235,0.3)",
          boxShadow: "0 4px 24px rgba(0,0,0,0.04)",
          position: "relative", overflow: "hidden",
          "&::before": {
            content: '""', position: "absolute", top: 0, left: 0, right: 0, height: 3,
            background: "linear-gradient(90deg, #6366f1, #8b5cf6, #f59e0b, #10b981)",
          },
        }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <Box sx={{
              width: 48, height: 48, borderRadius: "14px",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 8px 24px rgba(99,102,241,0.3)",
              flexShrink: 0,
            }}>
              <AutoAwesomeIcon sx={{ color: "#fff", fontSize: 24 }} />
            </Box>
            <Box>
              <Typography sx={{
                fontSize: 22, fontWeight: 800, letterSpacing: "-0.4px",
                background: "linear-gradient(135deg, #1f2937, #6366f1)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>
                Bot Templates
              </Typography>
              <Typography sx={{ fontSize: 14, color: "#6b7280", mt: 0.2 }}>
                Choose a pre-designed template for your industry and launch in minutes
              </Typography>
            </Box>
          </Box>

          {/* Industry chips */}
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            <Chip
              label="All Industries"
              onClick={() => setSelectedIndustry(null)}
              variant={selectedIndustry === null ? "filled" : "outlined"}
              sx={{
                borderRadius: 2, fontWeight: 600, fontSize: 12, height: 32,
                bgcolor: selectedIndustry === null ? "#6366f1" : "transparent",
                color: selectedIndustry === null ? "#fff" : "#374151",
                borderColor: "#e5e7eb",
                "&:hover": { bgcolor: selectedIndustry === null ? "#6366f1" : "#f3f4f6" },
              }}
            />
            {allIndustries.map((ind) => (
              <Chip
                key={ind.id}
                label={<span>{ind.icon} {ind.label}</span>}
                onClick={() => setSelectedIndustry(ind.id)}
                variant={selectedIndustry === ind.id ? "filled" : "outlined"}
                sx={{
                  borderRadius: 2, fontWeight: 600, fontSize: 12, height: 32,
                  bgcolor: selectedIndustry === ind.id ? ind.color : "transparent",
                  color: selectedIndustry === ind.id ? "#fff" : "#374151",
                  borderColor: "#e5e7eb",
                  "&:hover": { bgcolor: selectedIndustry === ind.id ? ind.color : "#f3f4f6" },
                }}
              />
            ))}
          </Box>
        </Paper>

        {/* Template cards */}
        {visible.map((industry) => (
          <Box key={industry.industry} sx={{ mb: 4 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
              <Typography sx={{ fontSize: 20 }}>{industry.icon}</Typography>
              <Typography sx={{ fontWeight: 700, fontSize: 17, color: "#1f2937", letterSpacing: "-0.3px" }}>
                {industry.industry}
              </Typography>
              <Typography sx={{ fontSize: 13, color: "#9ca3af" }}>{industry.templates.length} templates</Typography>
            </Box>
            <Grid container spacing={2.5}>
              {industry.templates.map((tmpl) => {
                const qCount = tmpl.flowSetupSetting?.question?.list?.length || 0;
                return (
                  <Grid item xs={12} sm={6} lg={4} key={tmpl.id}>
                    <Paper sx={{
                      borderRadius: 3, p: 2.5, position: "relative", overflow: "hidden",
                      bgcolor: "rgba(255,255,255,0.9)", backdropFilter: "blur(12px)",
                      border: "1px solid rgba(229,231,235,0.4)",
                      boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                      transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
                      "&:hover": {
                        transform: "translateY(-3px)",
                        boxShadow: `0 12px 40px ${industry.color}18`,
                        borderColor: `${industry.color}30`,
                      },
                      "&::before": {
                        content: '""', position: "absolute", top: 0, left: 0, right: 0, height: 4,
                        background: `linear-gradient(90deg, ${tmpl.botSettings.themeColors.header}, ${industry.color})`,
                      },
                    }}>
                      {/* Color palette preview */}
                      <Box sx={{ display: "flex", gap: 0.5, mb: 2, mt: 0.5 }}>
                        {[tmpl.botSettings.themeColors.header, tmpl.botSettings.themeColors.answer, tmpl.botSettings.themeColors.option].map((c, i) => (
                          <Box key={i} sx={{ width: 20, height: 20, borderRadius: "6px", bgcolor: c, boxShadow: `0 2px 6px ${c}40` }} />
                        ))}
                        <Box sx={{ flex: 1 }} />
                        <Chip label={tmpl.botSettings.selectedBubbleStyle.replace("style", "Bubble ")} size="small"
                          sx={{ height: 20, fontSize: 10, fontWeight: 600, bgcolor: "#f3f4f6", color: "#6b7280" }} />
                      </Box>

                      <Typography sx={{ fontWeight: 700, fontSize: 16, color: "#1f2937", mb: 0.3 }}>
                        {tmpl.name}
                      </Typography>
                      <Typography sx={{ fontSize: 13, color: "#6b7280", mb: 2, lineHeight: 1.4 }}>
                        {tmpl.desc}
                      </Typography>

                      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2.5 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                          <QuizIcon sx={{ fontSize: 15, color: "#9ca3af" }} />
                          <Typography fontSize={12} color="#9ca3af">{qCount} questions</Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                          <PaletteIcon sx={{ fontSize: 15, color: "#9ca3af" }} />
                          <Typography fontSize={12} color="#9ca3af">{tmpl.botSettings.font}</Typography>
                        </Box>
                      </Box>

                      <Button
                        fullWidth
                        variant="contained"
                        onClick={() => { setApplyDialog(tmpl); setBotName(tmpl.botSettings.botName); }}
                        sx={{
                          borderRadius: "10px", textTransform: "none", fontWeight: 700, fontSize: 13, py: 1,
                          background: `linear-gradient(135deg, ${industry.color}, ${industry.color}dd)`,
                          boxShadow: `0 4px 14px ${industry.color}40`,
                          "&:hover": {
                            background: `linear-gradient(135deg, ${industry.color}, ${industry.color})`,
                            boxShadow: `0 6px 20px ${industry.color}60`,
                          },
                        }}
                        startIcon={<RocketLaunchIcon sx={{ fontSize: 16 }} />}>
                        Use This Template
                      </Button>
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        ))}
      </Box>

      {/* Apply Dialog */}
      <Dialog open={!!applyDialog} onClose={() => !applying && setApplyDialog(null)}
        PaperProps={{ sx: { borderRadius: 3.5, p: 1, minWidth: 380, maxWidth: 420 } }}>
        <DialogTitle sx={{ fontWeight: 700, fontSize: 17, pb: 1, display: "flex", alignItems: "center", gap: 1 }}>
          <AutoAwesomeIcon sx={{ color: "#6366f1", fontSize: 22 }} />
          Apply Template
        </DialogTitle>
        <DialogContent>
          <Typography fontSize={14} color="#6b7280" mb={2.5}>
            This will create a new bot with the <strong>"{applyDialog?.name}"</strong> template.
          </Typography>
          <TextField
            label="Bot Name"
            fullWidth
            value={botName}
            onChange={(e) => setBotName(e.target.value)}
            autoFocus
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "11px",
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#6366f1", borderWidth: 2 },
              },
              "& .MuiInputLabel-root.Mui-focused": { color: "#6366f1" },
            }}
          />
          {applyDialog && (
            <Box sx={{ mt: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
              <Chip icon={<SmartToyIcon />} label={applyDialog.botSettings.botName} size="small"
                sx={{ borderRadius: 2, bgcolor: `${applyDialog.botSettings.themeColors.header}12`, color: applyDialog.botSettings.themeColors.header, fontWeight: 600 }} />
              <Chip icon={<QuizIcon />} label={`${applyDialog.flowSetupSetting?.question?.list?.length || 0} questions`} size="small"
                sx={{ borderRadius: 2, bgcolor: "#f3f4f6", fontWeight: 500 }} />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 2, pb: 2, gap: 1 }}>
          <Button onClick={() => setApplyDialog(null)} disabled={applying}
            sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600, color: "#6b7280" }}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleApply} disabled={!botName.trim() || applying}
            startIcon={applying ? <CircularProgress size={16} color="inherit" /> : <CheckCircleIcon />}
            sx={{
              borderRadius: 2, textTransform: "none", fontWeight: 700, px: 3,
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              "&:hover": { background: "linear-gradient(135deg, #4f46e5, #7c3aed)" },
              "&.Mui-disabled": { background: "#d1d5db" },
            }}>
            {applying ? "Creating..." : "Create Bot"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Templates;
