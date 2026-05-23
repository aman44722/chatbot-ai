import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  Box,
  Paper,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Button,
  Select,
  MenuItem,
  TextField,
  Switch,
  Chip,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

import TranslateIcon from "@mui/icons-material/Translate";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import LinkIcon from "@mui/icons-material/Link";
import PolicyIcon from "@mui/icons-material/Policy";
import RecordVoiceOverIcon from "@mui/icons-material/RecordVoiceOver";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import BlockIcon from "@mui/icons-material/Block";
import DevicesIcon from "@mui/icons-material/Devices";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import InstagramIcon from "@mui/icons-material/Instagram";
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";
import AvTimerIcon from "@mui/icons-material/AvTimer";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import SaveIcon from "@mui/icons-material/Save";
import UpgradeIcon from "@mui/icons-material/Upgrade";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { getBotWhitelist, saveBotWhitelist, getBotLanguage, saveBotLanguage } from "../api/botApi";

const NAV = [
  { id: "language", label: "Language", icon: <TranslateIcon />, color: "#6366f1" },
  { id: "autotrigger", label: "Auto Trigger", icon: <FlashOnIcon />, color: "#f59e0b" },
  { id: "whitelist", label: "White/Blacklisting Urls", icon: <LinkIcon />, color: "#10b981" },
  { id: "consent", label: "Consent", icon: <PolicyIcon />, color: "#8b5cf6" },
  { id: "tts", label: "Text to Speech", icon: <RecordVoiceOverIcon />, color: "#ec4899" },
  { id: "botTiming", label: "Bot Active Timings", icon: <AccessTimeIcon />, color: "#06b6d4" },
  { id: "banUsers", label: "Ban/Unban Users (Live Chat)", icon: <BlockIcon />, color: "#ef4444" },
  { id: "devices", label: "Enabled Devices", icon: <DevicesIcon />, color: "#14b8a6" },
  {
    id: "waIg",
    label: "WhatsApp/Instagram",
    icon: <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}><WhatsAppIcon fontSize="small" /><InstagramIcon fontSize="small" /></Box>,
    color: "#25D366",
  },
  { id: "advanced", label: "Advanced", icon: <SettingsSuggestIcon />, color: "#6366f1" },
  { id: "sla", label: "SLA", icon: <AvTimerIcon />, color: "#f97316" },
];

const ALLOWED_TABS = new Set(NAV.map((n) => n.id));

function useTabSync(defaultTab = "language") {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const safeTab = useMemo(() => {
    const q = params.get("tab");
    return ALLOWED_TABS.has(q || "") ? q : defaultTab;
  }, [params, defaultTab]);
  const [active, setActive] = useState(safeTab);
  useEffect(() => { setActive(safeTab); }, [safeTab]);
  const setActiveAndUrl = useCallback((id) => {
    if (!ALLOWED_TABS.has(id)) return;
    const p = new URLSearchParams(location.search);
    p.set("tab", id);
    navigate({ pathname: location.pathname, search: `?${p.toString()}` }, { replace: true });
    setActive(id);
  }, [location.pathname, location.search, navigate]);
  return [active, setActiveAndUrl];
}

const PRIMARY = "#4F46E5";
const PRIMARY_DARK = "#4338CA";

export default function SettingsPage() {
  const [active, setActive] = useTabSync("language");
  const activeNav = NAV.find((t) => t.id === active);

  return (
    <Box sx={{
      position: "relative", minHeight: "100vh", overflow: "hidden",
      "&::before": {
        content: '""', position: "absolute", inset: 0,
        background: `
          radial-gradient(600px circle at 0% 20%, rgba(79,70,229,0.06) 0%, transparent 70%),
          radial-gradient(500px circle at 80% 80%, rgba(124,58,237,0.05) 0%, transparent 70%),
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
      <Box sx={{ position: "relative", zIndex: 1, p: { xs: 1.5, md: 3 }, maxWidth: 1400, mx: "auto" }}>
        <Box sx={{ display: "flex", gap: { xs: 1.5, md: 3 }, alignItems: "stretch" }}>
          <Paper elevation={0} sx={{
            width: { xs: 68, sm: 260 }, flexShrink: 0, alignSelf: "flex-start", position: "sticky", top: 24,
            borderRadius: 3.5, bgcolor: "rgba(255,255,255,0.88)", backdropFilter: "blur(16px)",
            border: "1px solid rgba(229,231,235,0.4)", overflow: "hidden",
            boxShadow: "0 4px 24px rgba(0,0,0,0.04)", transition: "all 0.3s",
          }}>
            <Box sx={{
              px: { xs: 1, sm: 2.5 }, py: 2.5,
              borderBottom: "1px solid rgba(243,244,246,0.8)",
              background: "linear-gradient(135deg, rgba(79,70,229,0.03), rgba(124,58,237,0.03))",
            }}>
              <Typography sx={{
                fontWeight: 800, fontSize: { xs: 13, sm: 17 },
                background: "linear-gradient(135deg, #4F46E5, #7C3AED)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                display: { xs: "none", sm: "block" },
                letterSpacing: "-0.3px",
              }}>
                Settings
              </Typography>
              <Typography sx={{ fontSize: 12, color: "#9ca3af", mt: 0.3, display: { xs: "none", sm: "block" } }}>
                Configure your chatbot
              </Typography>
            </Box>
            <List sx={{ p: 1 }}>
              {NAV.map((t) => {
                const sel = active === t.id;
                return (
                  <ListItemButton
                    key={t.id}
                    onClick={() => setActive(t.id)}
                    selected={sel}
                    sx={{
                      borderRadius: 2, mb: 0.2, px: { xs: 1, sm: 1.5 }, py: 0.9,
                      position: "relative", overflow: "visible",
                      transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)",
                      "&.Mui-selected": {
                        bgcolor: `${t.color}0d`,
                        "&:hover": { bgcolor: `${t.color}14` },
                      },
                      "&:hover": { bgcolor: "rgba(243,244,246,0.8)" },
                      justifyContent: { xs: "center", sm: "flex-start" },
                    }}
                  >
                    {sel && (
                      <Box sx={{
                        position: "absolute", left: -1, top: "50%", transform: "translateY(-50%)",
                        width: 3.5, height: 20, borderRadius: "0 4px 4px 0",
                        background: `linear-gradient(180deg, ${t.color}, ${t.color}cc)`,
                        boxShadow: `0 0 8px ${t.color}40`,
                      }} />
                    )}
                    <ListItemIcon sx={{
                      minWidth: { xs: 0, sm: 36 }, color: sel ? t.color : "#9ca3af",
                      justifyContent: "center", transition: "all 0.2s",
                    }}>
                      <Box sx={{
                        width: 32, height: 32, borderRadius: "11px",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        bgcolor: sel ? `${t.color}14` : "transparent",
                        transition: "all 0.25s",
                        fontSize: 20,
                        "& svg": { fontSize: sel ? 18 : 17 },
                      }}>
                        {t.icon}
                      </Box>
                    </ListItemIcon>
                    <ListItemText
                      primary={t.label}
                      primaryTypographyProps={{
                        fontSize: 13, fontWeight: sel ? 700 : 500,
                        color: sel ? t.color : "#374151",
                        display: { xs: "none", sm: "block" },
                        letterSpacing: "-0.1px",
                      }}
                    />
                    {sel && (
                      <ChevronRightIcon sx={{
                        fontSize: 16, color: t.color,
                        display: { xs: "none", sm: "block" },
                        opacity: 0.6,
                      }} />
                    )}
                  </ListItemButton>
                );
              })}
            </List>
          </Paper>

          <Paper elevation={0} sx={{
            flex: 1, borderRadius: 3.5, p: { xs: 2, md: 3.5 },
            bgcolor: "rgba(255,255,255,0.94)", backdropFilter: "blur(16px)",
            border: "1px solid rgba(229,231,235,0.3)",
            boxShadow: "0 4px 24px rgba(0,0,0,0.04)",
            minHeight: "75vh", transition: "all 0.3s",
            position: "relative",
            "&::before": {
              content: '""', position: "absolute", top: 0, left: 0, right: 0,
              height: 3, borderRadius: "3.5px 3.5px 0 0",
              background: "linear-gradient(90deg, #4F46E5, #7C3AED, #6366f1, #8b5cf6)",
              backgroundSize: "200% 100%",
              animation: "gradientShift 4s ease-in-out infinite",
            },
            "@keyframes gradientShift": {
              "0%,100%": { backgroundPosition: "0% 50%" },
              "50%": { backgroundPosition: "100% 50%" },
            },
          }}>
            {active === "language" && <LanguageTab />}
            {active === "autotrigger" && <AutoTriggerTab />}
            {active === "whitelist" && <WhitelistTab />}
            {!["language", "autotrigger", "whitelist"].includes(active) && (
              <Box sx={{ height: "100%", minHeight: 500, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2.5 }}>
                <Box sx={{
                  width: 72, height: 72, borderRadius: "20px",
                  background: `linear-gradient(135deg, ${activeNav?.color}15, ${activeNav?.color}08)`,
                  border: `1px solid ${activeNav?.color}20`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: activeNav?.color, fontSize: 32,
                  boxShadow: `0 8px 32px ${activeNav?.color}15`,
                }}>
                  {activeNav?.icon}
                </Box>
                <Typography sx={{ fontSize: 20, fontWeight: 800, color: "#111827", letterSpacing: "-0.3px" }}>{activeNav?.label}</Typography>
                <Typography sx={{ fontSize: 14, color: "#9ca3af", maxWidth: 360, textAlign: "center", lineHeight: 1.6 }}>
                  Settings for <b style={{ color: "#4F46E5" }}>{activeNav?.label}</b> will appear here. Stay tuned!
                </Typography>
                <Chip label="Coming Soon" size="small" sx={{
                  borderRadius: 2, bgcolor: "#fef3c7", color: "#d97706", fontWeight: 700, fontSize: 12, px: 0.5,
                  border: "1px solid #fde68a",
                  animation: "pulseGlow 2s ease-in-out infinite",
                }} />
              </Box>
            )}
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}

function SectionCard({ icon, title, desc, children, accent }) {
  return (
    <Box sx={{
      bgcolor: "#fff", borderRadius: 3, p: 3, mb: 2.5,
      border: "1px solid rgba(229,231,235,0.5)", transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
      position: "relative", overflow: "hidden",
      boxShadow: "0 1px 4px rgba(0,0,0,0.03)",
      "&:hover": {
        borderColor: accent ? `${accent}30` : "rgba(79,70,229,0.2)",
        boxShadow: `0 8px 30px ${accent ? `${accent}12` : "rgba(79,70,229,0.08)"}`,
        transform: "translateY(-1px)",
      },
      "&::before": {
        content: '""', position: "absolute", top: 0, left: 0, width: 4, height: "100%",
        background: `linear-gradient(180deg, ${accent || "#4F46E5"}, ${accent || "#7C3AED"}cc)`,
        opacity: 0.6, borderRadius: "0 2px 2px 0",
      },
    }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2.5, ml: 0.5 }}>
        {icon && (
          <Box sx={{
            color: accent || "#4F46E5", display: "flex",
            width: 28, height: 28, borderRadius: "8px",
            bgcolor: `${accent || "#4F46E5"}0d`,
            alignItems: "center", justifyContent: "center", fontSize: 16,
            flexShrink: 0,
          }}>
            {icon}
          </Box>
        )}
        <Box>
          <Typography sx={{ fontWeight: 700, fontSize: 15, color: "#111827", letterSpacing: "-0.2px" }}>{title}</Typography>
          {desc && <Typography sx={{ fontSize: 12, color: "#9ca3af", mt: 0.1 }}>{desc}</Typography>}
        </Box>
      </Box>
      <Box sx={{ ml: 0.5 }}>{children}</Box>
    </Box>
  );
}

function FormRow({ label, hint, children }) {
  return (
    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2.5, mb: 2.5, flexWrap: "wrap" }}>
      <Box sx={{ minWidth: 170, flex: "0 0 auto", pt: 0.5 }}>
        <Typography sx={{ fontWeight: 600, fontSize: 13, color: "#374151", letterSpacing: "-0.1px" }}>{label}</Typography>
        {hint && <Typography sx={{ fontSize: 11.5, color: "#9ca3af", mt: 0.2 }}>{hint}</Typography>}
      </Box>
      <Box sx={{ flex: 1, minWidth: 220 }}>{children}</Box>
    </Box>
  );
}

function LanguageTab() {
  const [language, setLanguage] = useState("English");
  const [prefStatement, setPrefStatement] = useState("Please choose a language of your preference.");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const locked = false;
  const navigate = useNavigate();
  const botId = localStorage.getItem('selectedBotId');

  useEffect(() => {
    if (!botId) return;
    getBotLanguage(botId).then(res => {
      setLanguage(res.language);
      setPrefStatement(res.prefStatement);
    }).catch(() => {});
  }, [botId]);

  const handleSave = async () => {
    if (!botId) return alert("Select a bot first");
    setSaving(true);
    setSaved(false);
    try {
      await saveBotLanguage(botId, language, prefStatement);
      setSaved(true);
    } catch (e) { alert(e); }
    finally { setSaving(false); }
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography sx={{
          fontSize: 22, fontWeight: 800, color: "#111827",
          letterSpacing: "-0.4px",
          background: "linear-gradient(135deg, #1f2937, #4F46E5)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>
          Language Settings
        </Typography>
        <Typography sx={{ fontSize: 13.5, color: "#6b7280", mt: 0.5 }}>
          Configure the default language for your chatbot.
        </Typography>
      </Box>

      <SectionCard title="Default Language" desc="Choose the primary language for bot responses." accent="#4F46E5">
        <FormRow label="Select Language">
          <Select size="small" value={language} onChange={(e) => setLanguage(e.target.value)}
            sx={{
              minWidth: 280, bgcolor: "#f9fafb", borderRadius: "11px",
              "& .MuiOutlinedInput-notchedOutline": { borderColor: "#e5e7eb" },
              "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#4F46E5" },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#4F46E5", borderWidth: 2 },
              transition: "all 0.2s",
            }}
            disabled={locked}>
            {["English","Hindi","Bengali","Marathi","Gujarati","Tamil","Telugu","Kannada","Malayalam","Punjabi"].map((lng) => (
              <MenuItem key={lng} value={lng}>{lng}</MenuItem>
            ))}
          </Select>
        </FormRow>
      </SectionCard>

      <SectionCard title="Language Preference Statement" desc="Message shown to users when asking language preference." accent="#7C3AED">
        <TextField placeholder="Please choose a language of your preference." value={prefStatement}
          onChange={(e) => setPrefStatement(e.target.value)} multiline minRows={3} fullWidth
          disabled={locked}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "11px", bgcolor: "#f9fafb",
              "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#7C3AED" },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#7C3AED", borderWidth: 2 },
            },
          }} />
      </SectionCard>

      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 3 }}>
        <Button variant="contained" onClick={handleSave} disabled={saving || locked}
          sx={{
            borderRadius: "11px", textTransform: "none", fontWeight: 700, fontSize: 14,
            px: 4.5, py: 1.2,
            background: "linear-gradient(135deg, #4F46E5, #7C3AED)",
            boxShadow: "0 4px 16px rgba(79,70,229,0.35)",
            "&:hover": {
              background: "linear-gradient(135deg, #4338CA, #6D28D9)",
              boxShadow: "0 6px 24px rgba(79,70,229,0.45)",
              transform: "translateY(-1px)",
            },
            "&:active": { transform: "translateY(0)" },
            "&.Mui-disabled": { background: "#d1d5db", boxShadow: "none" },
            transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)",
          }}
          startIcon={saving ? undefined : <SaveIcon sx={{ fontSize: 18 }} />}>
          {saving ? "Saving..." : "Save Settings"}
        </Button>
        {saved && (
          <Chip icon={<CheckCircleIcon />} label="Saved successfully" size="small"
            sx={{
              borderRadius: 2, fontWeight: 700, fontSize: 13, px: 0.5, py: 1.5,
              bgcolor: "#ecfdf5", color: "#059669",
              "& .MuiChip-icon": { color: "#10b981", fontSize: 20, ml: 0.5 },
              animation: "fadeSlideIn 0.35s ease",
              "@keyframes fadeSlideIn": {
                "0%": { opacity: 0, transform: "translateY(-8px) scale(0.95)" },
                "100%": { opacity: 1, transform: "translateY(0) scale(1)" },
              },
            }}
          />
        )}
      </Box>

      {locked && (
        <Box sx={{ textAlign: "center", mt: 5, p: 3.5, bgcolor: "#fef3c7", borderRadius: 3, border: "1px solid #fde68a" }}>
          <Typography sx={{ color: "#92400e", mb: 2, fontWeight: 600, fontSize: 14 }}>
            This feature requires an upgrade.
          </Typography>
          <Button variant="contained" startIcon={<UpgradeIcon />}
            sx={{ borderRadius: "10px", textTransform: "none", fontWeight: 700, bgcolor: "#d97706", "&:hover": { bgcolor: "#b45309" }, px: 3 }}>
            Upgrade Now
          </Button>
        </Box>
      )}
    </Box>
  );
}

function AutoTriggerTab() {
  const [desktopEnabled, setDesktopEnabled] = useState(true);
  const [mobileEnabled, setMobileEnabled] = useState(true);
  const [exitEnabled, setExitEnabled] = useState(true);
  const [desktopSeconds, setDesktopSeconds] = useState(0);
  const [mobileSeconds, setMobileSeconds] = useState(5);

  const toggleRow = (label, checked, onChange) => (
    <Box sx={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      p: 1.5, px: 2.5, borderRadius: 2.5,
      bgcolor: "#f9fafb", border: "1px solid #f3f4f6",
      mb: 1.5, transition: "all 0.2s",
      "&:hover": { borderColor: "#e5e7eb", bgcolor: "#fff" },
    }}>
      <Typography sx={{ fontWeight: 600, fontSize: 13, color: "#374151" }}>{label}</Typography>
      <Switch checked={checked} onChange={onChange}
        sx={{
          "& .MuiSwitch-track": { bgcolor: checked ? "#c7d2fe" : "#e5e7eb" },
          "& .MuiSwitch-thumb": { bgcolor: checked ? "#4F46E5" : "#bdbdbd" },
        }} />
    </Box>
  );

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography sx={{
          fontSize: 22, fontWeight: 800, color: "#111827",
          letterSpacing: "-0.4px",
          background: "linear-gradient(135deg, #1f2937, #f59e0b)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>
          Auto Trigger
        </Typography>
        <Typography sx={{ fontSize: 13.5, color: "#6b7280", mt: 0.5 }}>
          Control when the chatbot opens automatically for visitors.
        </Typography>
      </Box>

      <SectionCard title="Trigger Conditions" desc="Choose when the bot should auto-open." accent="#f59e0b">
        {toggleRow("In Desktop", desktopEnabled, (e) => setDesktopEnabled(e.target.checked))}
        {toggleRow("In Mobile", mobileEnabled, (e) => setMobileEnabled(e.target.checked))}
        {toggleRow("Before visitor exits", exitEnabled, (e) => setExitEnabled(e.target.checked))}
      </SectionCard>

      <SectionCard title="Trigger Timing" desc="Set delay before the bot opens (in seconds)." accent="#f97316">
        <FormRow label="Desktop delay">
          <TextField type="number" value={desktopSeconds} onChange={(e) => setDesktopSeconds(Number(e.target.value))}
            size="small" sx={{ maxWidth: 200, "& .MuiOutlinedInput-root": { borderRadius: "11px", bgcolor: "#f9fafb" } }} />
        </FormRow>
        <FormRow label="Mobile delay">
          <TextField type="number" value={mobileSeconds} onChange={(e) => setMobileSeconds(Number(e.target.value))}
            size="small" sx={{ maxWidth: 200, "& .MuiOutlinedInput-root": { borderRadius: "11px", bgcolor: "#f9fafb" } }} />
        </FormRow>
      </SectionCard>

      <Button variant="contained" startIcon={<SaveIcon />}
        sx={{
          borderRadius: "11px", textTransform: "none", fontWeight: 700, fontSize: 14,
          px: 4.5, py: 1.2, mt: 1,
          background: "linear-gradient(135deg, #f59e0b, #f97316)",
          boxShadow: "0 4px 16px rgba(245,158,11,0.35)",
          "&:hover": {
            background: "linear-gradient(135deg, #d97706, #ea580c)",
            boxShadow: "0 6px 24px rgba(245,158,11,0.45)",
            transform: "translateY(-1px)",
          },
          "&:active": { transform: "translateY(0)" },
          "&.Mui-disabled": { background: "#d1d5db", boxShadow: "none" },
          transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)",
        }}>
        Save Settings
      </Button>
    </Box>
  );
}

function WhitelistTab() {
  const [domains, setDomains] = useState("");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const navigate = useNavigate();
  const botId = localStorage.getItem('selectedBotId');

  useEffect(() => {
    if (!botId) return;
    getBotWhitelist(botId).then(res => {
      if (res.whitelist?.length) setDomains(res.whitelist.join("\n"));
    });
  }, [botId]);

  const handleSave = async () => {
    if (!botId) return alert("Select a bot first");
    setLoading(true);
    setSaved(false);
    try {
      await saveBotWhitelist(botId, domains);
      setSaved(true);
      navigate("/app/install?refresh=1");
    } catch (e) { alert(e); }
    finally { setLoading(false); }
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography sx={{
          fontSize: 22, fontWeight: 800, color: "#111827",
          letterSpacing: "-0.4px",
          background: "linear-gradient(135deg, #1f2937, #10b981)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>
          Domain Whitelist
        </Typography>
        <Typography sx={{ fontSize: 13.5, color: "#6b7280", mt: 0.5 }}>
          Only allow your chatbot to load on these domains. One per line.
        </Typography>
      </Box>

      <SectionCard title="Allowed Domains" desc="Add domains where your chatbot widget can appear." accent="#10b981">
        <TextField multiline minRows={5}
          placeholder={`https://example.com\nhttps://abc.com`}
          value={domains} onChange={(e) => setDomains(e.target.value)}
          fullWidth
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "11px", bgcolor: "#f9fafb", fontFamily: "monospace", fontSize: 13,
              "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#10b981" },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#10b981", borderWidth: 2 },
            },
          }} />
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 2.5 }}>
          <Button variant="contained" onClick={handleSave} disabled={loading}
            sx={{
              borderRadius: "11px", textTransform: "none", fontWeight: 700, fontSize: 14,
              px: 4.5, py: 1.2,
              background: "linear-gradient(135deg, #10b981, #34d399)",
              boxShadow: "0 4px 16px rgba(16,185,129,0.35)",
              "&:hover": {
                background: "linear-gradient(135deg, #059669, #10b981)",
                boxShadow: "0 6px 24px rgba(16,185,129,0.45)",
                transform: "translateY(-1px)",
              },
              "&:active": { transform: "translateY(0)" },
              "&.Mui-disabled": { background: "#d1d5db", boxShadow: "none" },
              transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)",
            }}
            startIcon={loading ? undefined : <SaveIcon sx={{ fontSize: 18 }} />}>
            {loading ? "Saving..." : "Save"}
          </Button>
          {saved && (
            <Chip icon={<CheckCircleIcon />} label="Saved successfully" size="small"
              sx={{
                borderRadius: 2, fontWeight: 700, fontSize: 13, px: 0.5, py: 1.5,
                bgcolor: "#ecfdf5", color: "#059669",
                "& .MuiChip-icon": { color: "#10b981", fontSize: 20, ml: 0.5 },
                animation: "fadeSlideIn 0.35s ease",
                "@keyframes fadeSlideIn": {
                  "0%": { opacity: 0, transform: "translateY(-8px) scale(0.95)" },
                  "100%": { opacity: 1, transform: "translateY(0) scale(1)" },
                },
              }}
            />
          )}
        </Box>
      </SectionCard>
    </Box>
  );
}
