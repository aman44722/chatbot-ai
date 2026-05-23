import React, { useState } from "react";
import {
  Box, Paper, Typography, Button, Chip, TextField, Dialog, DialogTitle,
  DialogContent, DialogActions, CircularProgress, Grid, Avatar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import QuizIcon from "@mui/icons-material/Quiz";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SendIcon from "@mui/icons-material/Send";
import TEMPLATES from "../data/templates";
import { createBot, updateBot } from "../api/botApi";

function ChatPreview({ template, size = "card" }) {
  const s = template.botSettings;
  const colors = s.themeColors;
  const firstQ = template.flowSetupSetting?.question?.list?.[0];
  const isLarge = size === "large";

  return (
    <Box sx={{
      width: "100%", borderRadius: 2, overflow: "hidden",
      border: "1px solid rgba(229,231,235,0.5)",
      bgcolor: colors.chatBackground || "#fff",
      boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
    }}>
      {/* Chat Header */}
      <Box sx={{
        bgcolor: colors.header, p: isLarge ? 1.5 : 1,
        display: "flex", alignItems: "center", gap: 1,
      }}>
        <Avatar sx={{
          width: isLarge ? 32 : 24, height: isLarge ? 32 : 24,
          bgcolor: "rgba(255,255,255,0.2)", fontSize: isLarge ? 14 : 11, fontWeight: 700,
          color: "#fff",
        }}>
          {(s.botName || "B")[0]}
        </Avatar>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: isLarge ? 13 : 10, lineHeight: 1.2 }}>
            {s.botName || "ChatBot"}
          </Typography>
          <Typography sx={{ color: "rgba(255,255,255,0.7)", fontSize: isLarge ? 11 : 8, lineHeight: 1.2 }}>
            {s.description || "Online"}
          </Typography>
        </Box>
        <Box sx={{ width: isLarge ? 20 : 14, height: isLarge ? 20 : 14, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Box sx={{ width: isLarge ? 8 : 5, height: isLarge ? 8 : 5, borderRadius: "50%", bgcolor: "#fff", opacity: 0.6 }} />
        </Box>
      </Box>

      {/* Chat Body */}
      <Box sx={{ p: isLarge ? 2 : 1.2 }}>
        {/* Welcome bubble */}
        <Box sx={{ display: "flex", gap: 0.8, mb: 1.2, alignItems: "flex-start" }}>
          <Avatar sx={{
            width: isLarge ? 28 : 20, height: isLarge ? 28 : 20,
            bgcolor: colors.header, fontSize: isLarge ? 12 : 9, fontWeight: 700,
            color: "#fff", mt: 0.3,
          }}>
            {(s.botName || "B")[0]}
          </Avatar>
          <Box sx={{
            bgcolor: colors.question || "#fff",
            color: colors.question === "#ffffff" || !colors.question ? "#1f2937" : "#fff",
            borderRadius: isLarge ? 3 : 2,
            borderTopLeftRadius: isLarge ? 4 : 2,
            p: isLarge ? 1.5 : 1,
            maxWidth: "80%",
            boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
            border: colors.question === "#ffffff" || !colors.question ? "1px solid #e5e7eb" : "none",
          }}>
            <Typography sx={{ fontSize: isLarge ? 12 : 9, lineHeight: 1.4, fontWeight: 500 }}>
              {s.welcomeText || "Welcome!"}
            </Typography>
          </Box>
        </Box>

        {/* First question bubble */}
        {firstQ && (
          <Box sx={{ display: "flex", gap: 0.8, alignItems: "flex-start" }}>
            <Avatar sx={{
              width: isLarge ? 28 : 20, height: isLarge ? 28 : 20,
              bgcolor: colors.header, fontSize: isLarge ? 12 : 9, fontWeight: 700,
              color: "#fff", mt: 0.3,
            }}>
              {(s.botName || "B")[0]}
            </Avatar>
            <Box sx={{
              bgcolor: colors.question || "#fff",
              color: colors.question === "#ffffff" || !colors.question ? "#1f2937" : "#fff",
              borderRadius: isLarge ? 3 : 2,
              borderTopLeftRadius: isLarge ? 4 : 2,
              p: isLarge ? 1.5 : 1,
              maxWidth: "80%",
              boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
              border: colors.question === "#ffffff" || !colors.question ? "1px solid #e5e7eb" : "none",
            }}>
              <Typography sx={{ fontSize: isLarge ? 12 : 9, lineHeight: 1.4, fontWeight: 500 }}>
                {firstQ.text}
              </Typography>
              {/* Option buttons preview */}
              {firstQ.options?.slice(0, 2).map((opt, i) => (
                <Box key={i} sx={{
                  mt: 0.8, px: isLarge ? 1.5 : 1, py: isLarge ? 0.6 : 0.3,
                  borderRadius: isLarge ? 2 : 1,
                  bgcolor: colors.option || "#6366f1",
                  color: "#fff",
                  fontSize: isLarge ? 11 : 8,
                  fontWeight: 600,
                  textAlign: "center",
                  display: "inline-block",
                  mr: 0.5,
                }}>
                  {opt.label}
                </Box>
              ))}
              {firstQ.options?.length > 2 && (
                <Typography sx={{ fontSize: isLarge ? 10 : 7, color: "#9ca3af", mt: 0.5 }}>
                  +{firstQ.options.length - 2} more options
                </Typography>
              )}
            </Box>
          </Box>
        )}
      </Box>

      {/* Input area */}
      <Box sx={{ p: isLarge ? 1.5 : 1, borderTop: "1px solid #f3f4f6", display: "flex", gap: 0.5, bgcolor: "#fafafa" }}>
        <Box sx={{ flex: 1, height: isLarge ? 32 : 20, borderRadius: isLarge ? 2 : 1, bgcolor: "#fff", border: "1px solid #e5e7eb" }} />
        <Box sx={{
          width: isLarge ? 32 : 20, height: isLarge ? 32 : 20,
          borderRadius: isLarge ? 2 : 1,
          bgcolor: colors.header || "#6366f1",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <SendIcon sx={{ color: "#fff", fontSize: isLarge ? 16 : 10 }} />
        </Box>
      </Box>
    </Box>
  );
}

const Templates = () => {
  const navigate = useNavigate();
  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const [previewDialog, setPreviewDialog] = useState(null);
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
    const template = previewDialog;
    setApplying(true);
    try {
      const created = await createBot(botName.trim());
      const botId = created.bot._id || created._id;
      await updateBot(botId, {
        botSettings: template.botSettings,
        flowSetupSetting: template.flowSetupSetting,
      });
      localStorage.setItem("selectedBotId", botId);
      setPreviewDialog(null);
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
                      borderRadius: 3, overflow: "hidden",
                      bgcolor: "rgba(255,255,255,0.9)", backdropFilter: "blur(12px)",
                      border: "1px solid rgba(229,231,235,0.4)",
                      boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                      transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
                      "&:hover": {
                        transform: "translateY(-3px)",
                        boxShadow: `0 12px 40px ${industry.color}18`,
                        borderColor: `${industry.color}30`,
                      },
                    }}>
                      {/* Chat preview image */}
                      <Box sx={{ p: 1.5, bgcolor: "#fafbfc", borderBottom: "1px solid #f3f4f6" }}>
                        <ChatPreview template={tmpl} size="card" />
                      </Box>

                      <Box sx={{ p: 2 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 1 }}>
                          <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: industry.color, flexShrink: 0 }} />
                          <Typography sx={{ fontWeight: 700, fontSize: 15, color: "#1f2937" }}>
                            {tmpl.name}
                          </Typography>
                        </Box>
                        <Typography sx={{ fontSize: 12.5, color: "#6b7280", mb: 1.5, lineHeight: 1.4 }}>
                          {tmpl.desc}
                        </Typography>

                        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                            <QuizIcon sx={{ fontSize: 14, color: "#9ca3af" }} />
                            <Typography fontSize={11} color="#9ca3af">{qCount} questions</Typography>
                          </Box>
                        </Box>

                        <Button
                          fullWidth
                          variant="contained"
                          onClick={() => { setPreviewDialog(tmpl); setBotName(tmpl.botSettings.botName); }}
                          sx={{
                            borderRadius: "10px", textTransform: "none", fontWeight: 700, fontSize: 13, py: 0.9,
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
                      </Box>
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        ))}
      </Box>

      {/* Preview + Apply Dialog */}
      <Dialog open={!!previewDialog} onClose={() => !applying && setPreviewDialog(null)}
        maxWidth="md" fullWidth
        PaperProps={{ sx: { borderRadius: 4, overflow: "hidden", maxWidth: 800 } }}>
        {previewDialog && (
          <>
            <DialogTitle sx={{
              fontWeight: 700, fontSize: 18, pb: 0,
              display: "flex", alignItems: "center", gap: 1.5,
              pt: 2.5, px: 3,
            }}>
              <Box sx={{
                width: 40, height: 40, borderRadius: "12px",
                background: `linear-gradient(135deg, ${previewDialog.botSettings.themeColors.header}, ${previewDialog.botSettings.themeColors.answer})`,
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: `0 4px 16px ${previewDialog.botSettings.themeColors.header}40`,
              }}>
                <SmartToyIcon sx={{ color: "#fff", fontSize: 20 }} />
              </Box>
              <Box>
                <Typography sx={{ fontSize: 17, fontWeight: 700, color: "#1f2937" }}>
                  {previewDialog.name}
                </Typography>
                <Typography sx={{ fontSize: 13, color: "#6b7280", fontWeight: 400 }}>
                  {previewDialog.desc}
                </Typography>
              </Box>
            </DialogTitle>
            <DialogContent sx={{ px: 3, py: 2.5 }}>
              <Grid container spacing={3}>
                {/* Chat Preview */}
                <Grid item xs={12} md={7}>
                  <Box sx={{
                    bgcolor: "#fafbfc", borderRadius: 3, p: 2,
                    border: "1px solid #f3f4f6",
                  }}>
                    <Typography sx={{ fontSize: 11, fontWeight: 600, color: "#9ca3af", mb: 1.5, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                      Live Preview
                    </Typography>
                    <ChatPreview template={previewDialog} size="large" />
                  </Box>
                </Grid>

                {/* Details + Create */}
                <Grid item xs={12} md={5}>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <Box sx={{
                      p: 2, borderRadius: 2.5,
                      bgcolor: `${previewDialog.botSettings.themeColors.header}06`,
                      border: `1px solid ${previewDialog.botSettings.themeColors.header}15`,
                    }}>
                      <Typography sx={{ fontSize: 12, fontWeight: 600, color: "#374151", mb: 1.5 }}>
                        Template Details
                      </Typography>
                      {[
                        { label: "Bot Name", value: previewDialog.botSettings.botName },
                        { label: "Questions", value: `${previewDialog.flowSetupSetting?.question?.list?.length || 0} questions` },
                        { label: "Font", value: previewDialog.botSettings.font },
                        { label: "Bubble Style", value: previewDialog.botSettings.selectedBubbleStyle.replace("style", "Style ") },
                        { label: "Welcome Text", value: `"${previewDialog.botSettings.welcomeText}"` },
                      ].map((d, i) => (
                        <Box key={i} sx={{ display: "flex", justifyContent: "space-between", py: 0.6, borderBottom: i < 4 ? "1px solid rgba(229,231,235,0.4)" : "none" }}>
                          <Typography fontSize={12} color="#6b7280">{d.label}</Typography>
                          <Typography fontSize={12} fontWeight={600} color="#1f2937">{d.value}</Typography>
                        </Box>
                      ))}
                    </Box>

                    {/* Color swatches */}
                    <Box sx={{ p: 2, borderRadius: 2.5, bgcolor: "#f9fafb", border: "1px solid #f3f4f6" }}>
                      <Typography sx={{ fontSize: 12, fontWeight: 600, color: "#374151", mb: 1 }}>
                        Theme Colors
                      </Typography>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        {[
                          { label: "Header", color: previewDialog.botSettings.themeColors.header },
                          { label: "Bubble", color: previewDialog.botSettings.themeColors.question },
                          { label: "Answer", color: previewDialog.botSettings.themeColors.answer },
                          { label: "Button", color: previewDialog.botSettings.themeColors.option },
                        ].map((c, i) => (
                          <Box key={i} sx={{ textAlign: "center", flex: 1 }}>
                            <Box sx={{ width: "100%", height: 28, borderRadius: 1.5, bgcolor: c.color, mb: 0.3, boxShadow: `0 2px 8px ${c.color}30` }} />
                            <Typography fontSize={9} color="#9ca3af">{c.label}</Typography>
                          </Box>
                        ))}
                      </Box>
                    </Box>

                    {/* Bot name input */}
                    <Box>
                      <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#374151", mb: 1 }}>
                        Name Your Bot
                      </Typography>
                      <TextField
                        fullWidth
                        value={botName}
                        onChange={(e) => setBotName(e.target.value)}
                        placeholder="Enter bot name..."
                        autoFocus
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "11px",
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#6366f1", borderWidth: 2 },
                          },
                        }}
                      />
                    </Box>

                    <Button
                      fullWidth
                      variant="contained"
                      onClick={handleApply}
                      disabled={!botName.trim() || applying}
                      startIcon={applying ? <CircularProgress size={18} color="inherit" /> : <RocketLaunchIcon />}
                      sx={{
                        borderRadius: "11px", textTransform: "none", fontWeight: 700, fontSize: 14, py: 1.3,
                        background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                        boxShadow: "0 4px 16px rgba(99,102,241,0.35)",
                        "&:hover": { background: "linear-gradient(135deg, #4f46e5, #7c3aed)", boxShadow: "0 6px 24px rgba(99,102,241,0.45)" },
                        "&.Mui-disabled": { background: "#d1d5db" },
                      }}>
                      {applying ? "Creating Bot..." : "Create Bot"}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
              <Button onClick={() => setPreviewDialog(null)} disabled={applying}
                sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600, color: "#6b7280" }}>
                Cancel
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default Templates;
