// SettingsPage.jsx
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
  Tabs,
  Tab,
  Switch,
  IconButton,
  Tooltip,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

// Icons
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
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { getWhitelist, saveWhitelistingUrls } from "../api/authApi";

/* ---------------------- Nav config ---------------------- */
const NAV = [
  { id: "language", label: "Language", icon: <TranslateIcon /> },
  { id: "autotrigger", label: "Auto Trigger", icon: <FlashOnIcon /> },
  { id: "whitelist", label: "White/Blacklisting Urls", icon: <LinkIcon /> },
  { id: "consent", label: "Consent", icon: <PolicyIcon /> },
  { id: "tts", label: "Text to Speech", icon: <RecordVoiceOverIcon /> },
  { id: "botTiming", label: "Bot Active Timings", icon: <AccessTimeIcon /> },
  { id: "banUsers", label: "Ban/Unban Users (Live Chat)", icon: <BlockIcon /> },
  { id: "devices", label: "Enabled Devices", icon: <DevicesIcon /> },
  {
    id: "waIg",
    label: "WhatsApp/Instagram",
    icon: (
      <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
        <WhatsAppIcon fontSize="small" />
        <InstagramIcon fontSize="small" />
      </Box>
    ),
  },
  { id: "advanced", label: "Advanced", icon: <SettingsSuggestIcon /> },
  { id: "sla", label: "SLA", icon: <AvTimerIcon /> },
];

const ALLOWED_TABS = new Set(NAV.map((n) => n.id));

/* --------------- Hook: URL <-> state sync ---------------- */
function useTabSync(defaultTab = "language") {
  const location = useLocation();
  const navigate = useNavigate();

  const params = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );

  const safeTab = useMemo(() => {
    const q = params.get("tab");
    return ALLOWED_TABS.has(q || "") ? q : defaultTab;
  }, [params, defaultTab]);

  const [active, setActive] = useState(safeTab);

  // URL change -> state
  useEffect(() => {
    if (safeTab !== active) setActive(safeTab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [safeTab]);

  // state change (via UI click) -> URL
  const setActiveAndUrl = useCallback(
    (id) => {
      if (!ALLOWED_TABS.has(id)) return;
      const p = new URLSearchParams(location.search);
      p.set("tab", id);
      navigate({ pathname: location.pathname, search: `?${p.toString()}` }, { replace: true });
      setActive(id);
    },
    [location.pathname, location.search, navigate]
  );

  return [active, setActiveAndUrl];
}

/* --------------------- Main Component -------------------- */
export default function SettingsPage() {
  const [active, setActive] = useTabSync("language");

  return (
    <Box sx={{ p: 2, bgcolor: "#f6f8ff", minHeight: "100vh" }}>
      <Box
        sx={{
          display: "flex",
          gap: 2,
          alignItems: "stretch",
          maxWidth: 1400,
          mx: "auto",
        }}
      >
        {/* Sidebar */}
        <Paper elevation={0} sx={{ width: 310, p: 1.5, borderRadius: 2, bgcolor: "#fff" }}>
          <List sx={{ p: 0 }}>
            {NAV.map((t) => (
              <ListItemButton
                key={t.id}
                onClick={() => setActive(t.id)}
                selected={active === t.id}
                sx={{
                  borderRadius: 1.5,
                  mb: 0.5,
                  "&.Mui-selected": { bgcolor: "#eef2ff", color: "#3949ab" },
                }}
              >
                <ListItemIcon sx={{ minWidth: 34, color: "inherit" }}>
                  {t.icon}
                </ListItemIcon>
                <ListItemText primaryTypographyProps={{ fontSize: 14 }} primary={t.label} />
              </ListItemButton>
            ))}
          </List>
        </Paper>

        {/* Content */}
        <Paper elevation={0} sx={{ flex: 1, borderRadius: 2, p: 3, bgcolor: "#fff", minHeight: "80vh" }}>
          {active === "language" && <LanguageTab />}
          {active === "autotrigger" && <AutoTriggerTab />}
          {active === "whitelist" && <WhitelistTab />}

          {!["language", "autotrigger", "whitelist"].includes(active) && (
            <Box sx={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Typography color="text.secondary">
                Settings for <b>{NAV.find((t) => t.id === active)?.label}</b> will appear here.
              </Typography>
            </Box>
          )}
        </Paper>
      </Box>
    </Box>
  );
}

/* ---------------------- Language Tab --------------------- */
function LanguageTab() {
  const [language, setLanguage] = useState("Bengali");
  const [prefStatement, setPrefStatement] = useState(
    "Please choose a language of your preference."
  );
  const locked = false; // true karoge to Upgrade box dikhega

  return (
    <Box>
      <Row>
        <LabelWithInfo text="Default Language" />
        <Select
          size="small"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          sx={{ minWidth: 260, bgcolor: "#fafbff" }}
          disabled={locked}
        >
          {[
            "English",
            "Hindi",
            "Bengali",
            "Marathi",
            "Gujarati",
            "Tamil",
            "Telugu",
            "Kannada",
            "Malayalam",
            "Punjabi",
          ].map((lng) => (
            <MenuItem key={lng} value={lng}>
              {lng}
            </MenuItem>
          ))}
        </Select>
        <Button variant="contained" disabled={locked} sx={{ textTransform: "none" }}>
          Save
        </Button>
      </Row>

      <Box sx={{ mt: 4 }}>
        <LabelWithInfo text="Language Preference Statement" />
        <TextField
          placeholder="Please choose a language of your preference."
          value={prefStatement}
          onChange={(e) => setPrefStatement(e.target.value)}
          multiline
          minRows={3}
          fullWidth
          disabled={locked}
          sx={{ mt: 1.5 }}
        />
        <Button variant="contained" disabled={locked} sx={{ mt: 2, textTransform: "none" }}>
          Save
        </Button>
      </Box>

      {locked && (
        <Box sx={{ textAlign: "center", mt: 6 }}>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            Sorry this feature is not available for you, You need to upgrade to get this feature
          </Typography>
          <Button variant="contained" sx={{ textTransform: "none" }}>
            Upgrade
          </Button>
        </Box>
      )}
    </Box>
  );
}

/* ------------------- Auto Trigger Tab -------------------- */
function AutoTriggerTab() {
  const [desktopEnabled, setDesktopEnabled] = useState(true);
  const [mobileEnabled, setMobileEnabled] = useState(true);
  const [exitEnabled, setExitEnabled] = useState(true);
  const [desktopSeconds, setDesktopSeconds] = useState(0);
  const [mobileSeconds, setMobileSeconds] = useState(5);

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
        <Typography variant="h6">Auto Trigger</Typography>
        <Tooltip title="Controls when the bot opens automatically.">
          <IconButton size="small">
            <InfoOutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
        {/* Left toggles */}
        <Box sx={{ minWidth: 420, flex: 1 }}>
          <FieldBlock label="In Desktop">
            <Switch checked={desktopEnabled} onChange={(e) => setDesktopEnabled(e.target.checked)} />
          </FieldBlock>

          <FieldBlock label="In Mobile">
            <Switch checked={mobileEnabled} onChange={(e) => setMobileEnabled(e.target.checked)} />
          </FieldBlock>

          <FieldBlock label="Before the visitor is about to exit">
            <Switch checked={exitEnabled} onChange={(e) => setExitEnabled(e.target.checked)} />
          </FieldBlock>
        </Box>

        {/* Right inputs */}
        <Box sx={{ minWidth: 380, flex: 1 }}>
          <Typography sx={{ mb: 1, fontWeight: 600 }}>Trigger time (in seconds)</Typography>
          <TextField
            type="number"
            value={desktopSeconds}
            onChange={(e) => setDesktopSeconds(Number(e.target.value))}
            fullWidth
            sx={{ mb: 3, maxWidth: 360 }}
          />

          <Typography sx={{ mb: 1, fontWeight: 600 }}>Trigger time for mobile (in seconds)</Typography>
          <TextField
            type="number"
            value={mobileSeconds}
            onChange={(e) => setMobileSeconds(Number(e.target.value))}
            fullWidth
            sx={{ maxWidth: 360 }}
          />
        </Box>
      </Box>

      <Box sx={{ mt: 4 }}>
        <Button variant="contained" sx={{ px: 4 }}>
          Save
        </Button>
      </Box>
    </Box>
  );
}

/* ---------------- Whitelist / Blacklist Tab --------------- */
function WhitelistTab() {
  const [domains, setDomains] = useState("");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  // 🔹 load already saved domains
  useEffect(() => {
    getWhitelist().then(res => {
      if (res.whitelist?.length) {
        setDomains(res.whitelist.join("\n"));
      }
    });
  }, []);
  const navigate = useNavigate();
  const handleSave = async () => {
    setLoading(true);
    setSaved(false);
    try {
      await saveWhitelistingUrls(domains);
      setSaved(true);
      navigate("/app/install?refresh=1");
    } catch (e) {
      alert(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>Whitelisted Domains</h3>

      <textarea
        rows={6}
        placeholder={`https://example.com\nhttps://abc.com`}
        value={domains}
        onChange={(e) => setDomains(e.target.value)}
        style={{ width: "100%" }}
      />

      <button onClick={handleSave} disabled={loading}>
        {loading ? "Saving..." : "Save"}
      </button>

      {saved && <p style={{ color: "green" }}>Saved successfully ✅</p>}
    </div>
  );
}

/* --------------------- Reusable UI ----------------------- */
function Row({ children }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
      {children}
    </Box>
  );
}

function LabelWithInfo({ text }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Typography sx={{ fontWeight: 600 }}>{text}</Typography>
      <Tooltip title="Learn more">
        <IconButton size="small">
          <InfoOutlinedIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  );
}

function FieldBlock({ label, children }) {
  return (
    <Box sx={{ mb: 3 }}>
      <Typography sx={{ mb: 1.2, fontWeight: 600 }}>{label}</Typography>
      <Paper
        variant="outlined"
        sx={{
          p: 1,
          px: 1.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderRadius: 2,
        }}
      >
        {children}
        <Typography color="text.secondary" sx={{ mr: 1 }}>
          Enabled
        </Typography>
      </Paper>
    </Box>
  );
}
