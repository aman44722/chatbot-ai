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
import { getWhitelist, saveWhitelistingUrls } from "../api/authApi";

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

export default function SettingsPage() {
  const [active, setActive] = useTabSync("language");
  const activeNav = NAV.find((t) => t.id === active);

  return (
    <Box sx={{ p: { xs: 1.5, md: 3 }, background: "linear-gradient(135deg, #f0f4ff 0%, #faf5ff 50%, #f0fdf4 100%)", minHeight: "100vh" }}>
      <Box sx={{ display: "flex", gap: 3, alignItems: "stretch", maxWidth: 1400, mx: "auto" }}>
        <Paper elevation={0} sx={{
          width: { xs: 72, sm: 280 }, flexShrink: 0,
          borderRadius: 3, bgcolor: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)",
          border: "1px solid rgba(229,231,235,0.5)", overflow: "hidden",
          transition: "all 0.3s",
        }}>
          <Box sx={{ px: { xs: 1, sm: 2.5 }, py: 2.5, borderBottom: "1px solid #f3f4f6" }}>
            <Typography sx={{ fontWeight: 700, fontSize: { xs: 13, sm: 16 }, color: "#111827", display: { xs: "none", sm: "block" } }}>
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
                    borderRadius: 2, mb: 0.3, px: { xs: 1, sm: 1.5 }, py: 1,
                    transition: "all 0.2s",
                    "&.Mui-selected": { bgcolor: `${t.color}12`, "&:hover": { bgcolor: `${t.color}18` } },
                    "&:hover": { bgcolor: "#f3f4f6" },
                    justifyContent: { xs: "center", sm: "flex-start" },
                  }}
                >
                  <ListItemIcon sx={{
                    minWidth: { xs: 0, sm: 36 }, color: sel ? t.color : "#6b7280",
                    justifyContent: "center",
                  }}>
                    <Box sx={{
                      width: 32, height: 32, borderRadius: "10px",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      bgcolor: sel ? `${t.color}15` : "transparent",
                      transition: "all 0.2s",
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
                    }}
                  />
                  {sel && <ChevronRightIcon sx={{ fontSize: 16, color: t.color, display: { xs: "none", sm: "block" } }} />}
                </ListItemButton>
              );
            })}
          </List>
        </Paper>

        <Paper elevation={0} sx={{
          flex: 1, borderRadius: 3, p: { xs: 2, md: 3.5 },
          bgcolor: "rgba(255,255,255,0.92)", backdropFilter: "blur(12px)",
          border: "1px solid rgba(229,231,235,0.5)",
          minHeight: "80vh", transition: "all 0.3s",
        }}>
          {active === "language" && <LanguageTab />}
          {active === "autotrigger" && <AutoTriggerTab />}
          {active === "whitelist" && <WhitelistTab />}
          {!["language", "autotrigger", "whitelist"].includes(active) && (
            <Box sx={{ height: "100%", minHeight: 400, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2 }}>
              <Box sx={{ width: 64, height: 64, borderRadius: "16px", bgcolor: `${activeNav?.color}12`, display: "flex", alignItems: "center", justifyContent: "center", color: activeNav?.color }}>
                {activeNav?.icon}
              </Box>
              <Typography sx={{ fontSize: 18, fontWeight: 700, color: "#111827" }}>{activeNav?.label}</Typography>
              <Typography sx={{ fontSize: 14, color: "#9ca3af", maxWidth: 360, textAlign: "center" }}>
                Settings for <b style={{ color: "#374151" }}>{activeNav?.label}</b> will appear here. Stay tuned!
              </Typography>
              <Chip label="Coming Soon" size="small" sx={{ borderRadius: 2, bgcolor: "#fef3c7", color: "#d97706", fontWeight: 600 }} />
            </Box>
          )}
        </Paper>
      </Box>
    </Box>
  );
}

function SectionCard({ icon, title, desc, children }) {
  return (
    <Box sx={{
      bgcolor: "#f9fafb", borderRadius: 2.5, p: 2.5, mb: 2.5,
      border: "1px solid #f3f4f6", transition: "all 0.2s",
      "&:hover": { borderColor: "#e5e7eb", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" },
    }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
        {icon && <Box sx={{ color: "#6366f1", display: "flex" }}>{icon}</Box>}
        <Box>
          <Typography sx={{ fontWeight: 700, fontSize: 15, color: "#111827" }}>{title}</Typography>
          {desc && <Typography sx={{ fontSize: 12, color: "#9ca3af", mt: 0.2 }}>{desc}</Typography>}
        </Box>
      </Box>
      {children}
    </Box>
  );
}

function FormRow({ label, hint, children }) {
  return (
    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2, mb: 2, flexWrap: "wrap" }}>
      <Box sx={{ minWidth: 180, flex: "0 0 auto", pt: 0.5 }}>
        <Typography sx={{ fontWeight: 600, fontSize: 13, color: "#374151" }}>{label}</Typography>
        {hint && <Typography sx={{ fontSize: 11, color: "#9ca3af", mt: 0.2 }}>{hint}</Typography>}
      </Box>
      <Box sx={{ flex: 1, minWidth: 200 }}>{children}</Box>
    </Box>
  );
}

function LanguageTab() {
  const [language, setLanguage] = useState("Bengali");
  const [prefStatement, setPrefStatement] = useState("Please choose a language of your preference.");
  const locked = false;

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography sx={{ fontSize: 20, fontWeight: 800, color: "#111827" }}>Language Settings</Typography>
        <Typography sx={{ fontSize: 13, color: "#6b7280", mt: 0.3 }}>Configure the default language for your chatbot.</Typography>
      </Box>

      <SectionCard title="Default Language" desc="Choose the primary language for bot responses.">
        <FormRow label="Select Language">
          <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
            <Select size="small" value={language} onChange={(e) => setLanguage(e.target.value)}
              sx={{ minWidth: 260, bgcolor: "#fff", borderRadius: "10px", "& .MuiOutlinedInput-notchedOutline": { borderColor: "#e5e7eb" } }}
              disabled={locked}>
              {["English","Hindi","Bengali","Marathi","Gujarati","Tamil","Telugu","Kannada","Malayalam","Punjabi"].map((lng) => (
                <MenuItem key={lng} value={lng}>{lng}</MenuItem>
              ))}
            </Select>
            <Button variant="contained" disabled={locked}
              startIcon={<SaveIcon />}
              sx={{ borderRadius: "10px", textTransform: "none", fontWeight: 600, px: 3, bgcolor: "#6366f1", "&:hover": { bgcolor: "#4f46e5" } }}>
              Save
            </Button>
          </Box>
        </FormRow>
      </SectionCard>

      <SectionCard title="Language Preference Statement" desc="Message shown to users when asking language preference.">
        <TextField placeholder="Please choose a language of your preference." value={prefStatement}
          onChange={(e) => setPrefStatement(e.target.value)} multiline minRows={3} fullWidth
          disabled={locked}
          sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px", bgcolor: "#fff" } }} />
        <Button variant="contained" disabled={locked} startIcon={<SaveIcon />}
          sx={{ mt: 2, borderRadius: "10px", textTransform: "none", fontWeight: 600, px: 3, bgcolor: "#6366f1", "&:hover": { bgcolor: "#4f46e5" } }}>
          Save
        </Button>
      </SectionCard>

      {locked && (
        <Box sx={{ textAlign: "center", mt: 4, p: 3, bgcolor: "#fef3c7", borderRadius: 2.5, border: "1px solid #fde68a" }}>
          <Typography sx={{ color: "#92400e", mb: 2, fontWeight: 500 }}>
            This feature requires an upgrade.
          </Typography>
          <Button variant="contained" startIcon={<UpgradeIcon />}
            sx={{ borderRadius: "10px", textTransform: "none", fontWeight: 600, bgcolor: "#d97706", "&:hover": { bgcolor: "#b45309" } }}>
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
      p: 1.5, px: 2, borderRadius: 2, bgcolor: "#fff", border: "1px solid #f3f4f6",
      mb: 1.5, transition: "all 0.2s", "&:hover": { borderColor: "#e5e7eb" },
    }}>
      <Typography sx={{ fontWeight: 500, fontSize: 13, color: "#374151" }}>{label}</Typography>
      <Switch checked={checked} onChange={onChange} sx={{ "& .MuiSwitch-thumb": { bgcolor: checked ? "#6366f1" : "#bdbdbd" } }} />
    </Box>
  );

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography sx={{ fontSize: 20, fontWeight: 800, color: "#111827" }}>Auto Trigger</Typography>
        <Typography sx={{ fontSize: 13, color: "#6b7280", mt: 0.3 }}>Control when the chatbot opens automatically for visitors.</Typography>
      </Box>

      <SectionCard title="Trigger Conditions" desc="Choose when the bot should auto-open.">
        {toggleRow("In Desktop", desktopEnabled, (e) => setDesktopEnabled(e.target.checked))}
        {toggleRow("In Mobile", mobileEnabled, (e) => setMobileEnabled(e.target.checked))}
        {toggleRow("Before visitor exits", exitEnabled, (e) => setExitEnabled(e.target.checked))}
      </SectionCard>

      <SectionCard title="Trigger Timing" desc="Set delay before the bot opens (in seconds).">
        <FormRow label="Desktop delay">
          <TextField type="number" value={desktopSeconds} onChange={(e) => setDesktopSeconds(Number(e.target.value))}
            size="small" sx={{ maxWidth: 200, "& .MuiOutlinedInput-root": { borderRadius: "10px", bgcolor: "#fff" } }} />
        </FormRow>
        <FormRow label="Mobile delay">
          <TextField type="number" value={mobileSeconds} onChange={(e) => setMobileSeconds(Number(e.target.value))}
            size="small" sx={{ maxWidth: 200, "& .MuiOutlinedInput-root": { borderRadius: "10px", bgcolor: "#fff" } }} />
        </FormRow>
      </SectionCard>

      <Button variant="contained" startIcon={<SaveIcon />}
        sx={{ borderRadius: "10px", textTransform: "none", fontWeight: 600, px: 4, mt: 1, bgcolor: "#6366f1", "&:hover": { bgcolor: "#4f46e5" } }}>
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

  useEffect(() => {
    getWhitelist().then(res => {
      if (res.whitelist?.length) setDomains(res.whitelist.join("\n"));
    });
  }, []);

  const handleSave = async () => {
    setLoading(true);
    setSaved(false);
    try {
      await saveWhitelistingUrls(domains);
      setSaved(true);
      navigate("/app/install?refresh=1");
    } catch (e) { alert(e); }
    finally { setLoading(false); }
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography sx={{ fontSize: 20, fontWeight: 800, color: "#111827" }}>Domain Whitelist</Typography>
        <Typography sx={{ fontSize: 13, color: "#6b7280", mt: 0.3 }}>Only allow your chatbot to load on these domains. One per line.</Typography>
      </Box>

      <SectionCard title="Allowed Domains" desc="Add domains where your chatbot widget can appear.">
        <TextField multiline minRows={5}
          placeholder={`https://example.com\nhttps://abc.com`}
          value={domains} onChange={(e) => setDomains(e.target.value)}
          fullWidth
          sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px", bgcolor: "#fff", fontFamily: "monospace", fontSize: 13 } }} />
        <Button variant="contained" onClick={handleSave} disabled={loading} startIcon={loading ? undefined : <SaveIcon />}
          sx={{ mt: 2, borderRadius: "10px", textTransform: "none", fontWeight: 600, px: 4, bgcolor: "#6366f1", "&:hover": { bgcolor: "#4f46e5" } }}>
          {loading ? "Saving..." : "Save"}
        </Button>
        {saved && (
          <Chip label="Saved successfully" color="success" size="small" sx={{ mt: 1.5, borderRadius: 2, fontWeight: 600 }} />
        )}
      </SectionCard>
    </Box>
  );
}
