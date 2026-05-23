import React, { useEffect, useState } from "react";
import {
    Box, Paper, Typography, Button, TextField, Alert,
    Snackbar, Divider, Chip
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import CheckIcon from "@mui/icons-material/Check";
import WebIcon from "@mui/icons-material/Web";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import CodeIcon from "@mui/icons-material/Code";
import ForumIcon from "@mui/icons-material/Forum";
import DescriptionIcon from "@mui/icons-material/Description";
import SmartphoneIcon from "@mui/icons-material/Smartphone";
import LaunchIcon from "@mui/icons-material/Launch";
import WidgetsIcon from "@mui/icons-material/Widgets";
import StorageIcon from "@mui/icons-material/Storage";
import StorefrontIcon from "@mui/icons-material/Storefront";
import ExtensionIcon from "@mui/icons-material/Extension";
import { useNavigate } from "react-router-dom";
import { getBotWhitelist } from "../../api/botApi";

const API = process.env.REACT_APP_AUTH_API || "http://localhost:5000/api/auth";

function buildSnippet(chatbotId) {
    const origin = window.location.origin;
    const api = process.env.REACT_APP_AUTH_API || `${origin.replace(/:\d+$/, '')}:5000/api/auth`;
    return `<!-- A2Bot Live Chat Widget -->
<script>
window.A2BOT_CONFIG = { id: "${chatbotId}", origin: "${origin}", api: "${api}" };
</script>
<script src="${origin}/widget.js" async></script>`;
}

const TAB_COLORS = {
    "website-blog": "#6366f1",
    instagram: "#E1306C",
    website: "#5b5ea6",
    messenger: "#1877F2",
    wordpress: "#21759b",
    "mobile-app": "#10b981",
    "landing-page": "#f59e0b",
    widget: "#8b5cf6",
    drupal: "#0678be",
    shopify: "#96bf48",
    "other-cms": "#ec4899",
};

const TABS = [
    { id: "website-blog", label: "Website/Blog", icon: WebIcon },
    { id: "instagram", label: "Instagram", icon: CameraAltIcon },
    { id: "website", label: "Website", icon: CodeIcon },
    { id: "messenger", label: "Messenger", icon: ForumIcon },
    { id: "wordpress", label: "WordPress", icon: DescriptionIcon },
    { id: "mobile-app", label: "Mobile App", icon: SmartphoneIcon },
    { id: "landing-page", label: "Landing Page", icon: LaunchIcon },
    { id: "widget", label: "Widget", icon: WidgetsIcon },
    { id: "drupal", label: "Drupal", icon: StorageIcon },
    { id: "shopify", label: "Shopify", icon: StorefrontIcon },
    { id: "other-cms", label: "Other CMS", icon: ExtensionIcon },
];

const Install = () => {
    const navigate = useNavigate();
    const [chatbotId, setChatbotId] = useState("");
    const [loading, setLoading] = useState(true);
    const [hasWhitelist, setHasWhitelist] = useState(true);
    const [copied, setCopied] = useState("");
    const [activeTab, setActiveTab] = useState("website");
    const [hoveredTab, setHoveredTab] = useState(null);

    useEffect(() => {
        const fetchMeta = async () => {
            setLoading(true);
            try {
                const selectedBotId = localStorage.getItem("selectedBotId");
                if (selectedBotId) {
                    setChatbotId(selectedBotId);
                    try {
                        const res = await getBotWhitelist(selectedBotId);
                        setHasWhitelist(Boolean(res.whitelist?.length));
                    } catch {
                        setHasWhitelist(true);
                    }
                } else {
                    const user = JSON.parse(localStorage.getItem("user"));
                    if (!user?.token) return;
                    const res = await fetch(`${API}/install/meta`, {
                        headers: { Authorization: `Bearer ${user.token}` },
                    });
                    const data = await res.json();
                    if (res.ok) {
                        setChatbotId(data.chatbotId || "");
                        setHasWhitelist(Boolean(data.hasWhitelist));
                    }
                }
            } catch (err) {
                console.error("Install meta error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchMeta();
    }, []);

    const snippet = chatbotId ? buildSnippet(chatbotId) : "";

    const copyToClipboard = async (text, label = "snippet") => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(label);
            setTimeout(() => setCopied(""), 2500);
        } catch {
            alert("Select all text in the box and copy manually (Ctrl+A, Ctrl+C).");
        }
    };

    const previewWidget = () => {
        if (chatbotId) window.open(`/usertest/${chatbotId}`, "_blank");
    };

    const widgetUrl = chatbotId ? `${window.location.origin}/usertest/${chatbotId}` : "";
    const iframeCode = chatbotId ? `<div>
    <iframe
        class="m-w-100"
        src="${widgetUrl}"
        style="border:0;"
        width="400"
        height="500"
    ></iframe>
</div>` : "";

    const widgetUrlShort = chatbotId ? `${window.location.origin}/usertest/${chatbotId}` : "";

    const glassCard = {
        borderRadius: 3,
        border: "1px solid rgba(255,255,255,0.7)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.06)",
        backdropFilter: "blur(12px)",
        background: "rgba(255,255,255,0.85)",
    };

    const gradientBtn = (color1, color2) => ({
        textTransform: "none",
        borderRadius: 2.5,
        fontWeight: 700,
        background: `linear-gradient(135deg, ${color1}, ${color2})`,
        color: "#fff",
        boxShadow: `0 4px 15px rgba(0,0,0,0.12)`,
        "&:hover": {
            background: `linear-gradient(135deg, ${color2}, ${color1})`,
            boxShadow: `0 6px 20px rgba(0,0,0,0.18)`,
        },
    });

    const renderSteps = (steps, color) => (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            {steps.map((step, i) => (
                <Box key={i} sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
                    <Box sx={{
                        minWidth: 28, height: 28, borderRadius: "50%",
                        background: `linear-gradient(135deg, ${color}, ${color}dd)`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: "#fff", fontWeight: 700, fontSize: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    }}>
                        {i + 1}
                    </Box>
                    <Typography variant="body2" color="text.secondary" mt={0.3} sx={{ lineHeight: 1.5 }}>
                        {step}
                    </Typography>
                </Box>
            ))}
        </Box>
    );

    const renderSnippetField = (value, copyLabel, placeholder) => (
        <TextField
            fullWidth multiline minRows={7}
            value={value || placeholder || "Select a bot first"}
            InputProps={{
                readOnly: true,
                sx: {
                    fontFamily: "monospace", fontSize: 12.5, borderRadius: 2.5,
                    bgcolor: "#f8f9fc", color: "#1f2937",
                    "& .MuiOutlinedInput-notchedOutline": { borderColor: "#e5e7eb" },
                },
            }}
        />
    );

    const renderCopyPreviewRow = (copyText, copyLabel, previewFn) => (
        <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap", mt: 2 }}>
            <Button
                variant="contained"
                startIcon={copied === copyLabel ? <CheckIcon /> : <ContentCopyIcon />}
                onClick={() => copyToClipboard(copyText, copyLabel)}
                disabled={!chatbotId}
                sx={{
                    ...gradientBtn(copied === copyLabel ? "#2e7d32" : "#5b5ea6", copied === copyLabel ? "#1b5e20" : "#4a4d8a"),
                    px: 3,
                }}
            >
                {copied === copyLabel ? "Copied!" : "Copy Code"}
            </Button>
            {previewFn && (
                <Button
                    variant="outlined"
                    startIcon={<OpenInNewIcon />}
                    onClick={previewFn}
                    disabled={!chatbotId}
                    sx={{
                        textTransform: "none", borderRadius: 2.5, px: 3,
                        borderColor: "#5b5ea6", color: "#5b5ea6", fontWeight: 600,
                        "&:hover": { borderColor: "#4a4d8a", bgcolor: "rgba(91,94,166,0.06)" },
                    }}
                >
                    Preview Widget
                </Button>
            )}
        </Box>
    );

    const renderSectionHeader = (title, subtitle, color) => (
        <Box sx={{
            background: `linear-gradient(135deg, ${color}, ${color}dd)`,
            mx: -1, mt: -1, mb: 3, p: 2.5, px: 3, borderRadius: 3,
            color: "#fff",
        }}>
            <Typography fontWeight={700} fontSize={17}>{title}</Typography>
            {subtitle && <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.3 }}>{subtitle}</Typography>}
        </Box>
    );

    const renderWebsite = () => {
        const c = TAB_COLORS.website;
        return (
            <Box sx={{ display: "flex", gap: 3 }}>
                <Box sx={{ width: 280, flexShrink: 0 }}>
                    <Paper sx={{ ...glassCard, overflow: "hidden" }}>
                        <Box sx={{ height: 4, background: `linear-gradient(90deg, ${c}, ${c}88)` }} />
                        <Box sx={{ p: 2.5 }}>
                            <Typography fontWeight={700} fontSize={15} mb={1.5} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <CodeIcon sx={{ fontSize: 18, color: c }} /> How to Install
                            </Typography>
                            {renderSteps([
                                "Copy the snippet below",
                                "Open your website's HTML file",
                                "Paste it before the closing </body> tag",
                                "Save and publish your changes",
                            ], c)}
                            <Divider sx={{ my: 2 }} />
                            <Button fullWidth variant="outlined" size="small"
                                sx={{ textTransform: "none", borderRadius: 2.5, borderColor: c, color: c, fontWeight: 600 }}
                                onClick={() => navigate({ pathname: "/app/settings", search: "?tab=whitelist" })}>
                                Manage Whitelist Domains
                            </Button>
                        </Box>
                    </Paper>
                    {chatbotId && (
                        <Paper sx={{ ...glassCard, mt: 2, overflow: "hidden" }}>
                            <Box sx={{ height: 3, background: `linear-gradient(90deg, ${c}88, ${c})` }} />
                            <Box sx={{ p: 2.5 }}>
                                <Typography variant="caption" fontWeight={700} sx={{ textTransform: "uppercase", letterSpacing: 0.5, color: c }}>
                                    Your Chatbot ID
                                </Typography>
                                <Typography fontFamily="monospace" fontSize={12}
                                    sx={{ mt: 0.5, wordBreak: "break-all", bgcolor: "#f4f6fb", p: 1.2, borderRadius: 1.5, color: c, border: "1px solid #eef0f7" }}>
                                    {chatbotId}
                                </Typography>
                                <Divider sx={{ my: 1.5 }} />
                                <Typography variant="caption" fontWeight={700} sx={{ textTransform: "uppercase", letterSpacing: 0.5, color: c }}>
                                    Widget URL
                                </Typography>
                                <Typography fontFamily="monospace" fontSize={11}
                                    sx={{ mt: 0.5, wordBreak: "break-all", bgcolor: "#f4f6fb", p: 1.2, borderRadius: 1.5, border: "1px solid #eef0f7" }}>
                                    {widgetUrlShort}
                                </Typography>
                            </Box>
                        </Paper>
                    )}
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Paper sx={{ ...glassCard, overflow: "hidden" }}>
                        {renderSectionHeader("Embed Script", "Paste before closing </body> tag on every page", c)}
                        <Box sx={{ px: 3, pb: 3 }}>
                            {!hasWhitelist && (
                                <Alert severity="warning" sx={{ mb: 2, borderRadius: 2 }}>
                                    No whitelisted domains yet. Add your domain in{" "}
                                    <strong style={{ cursor: "pointer", textDecoration: "underline" }}
                                        onClick={() => navigate({ pathname: "/app/settings", search: "?tab=whitelist" })}>
                                        Settings → Whitelist
                                    </strong>.
                                </Alert>
                            )}
                            {renderSnippetField(loading ? "Loading..." : snippet, "snippet")}
                            {renderCopyPreviewRow(snippet, "snippet", previewWidget)}
                        </Box>
                    </Paper>
                </Box>
            </Box>
        );
    };

    const renderWebsiteBlog = () => {
        const c = TAB_COLORS["website-blog"];
        return (
            <Paper sx={{ ...glassCard, overflow: "hidden" }}>
                {renderSectionHeader("Website / Blog Installation", "Paste snippet before </body> on your blog platform", c)}
                <Box sx={{ px: 3, pb: 3 }}>
                    {renderSnippetField(loading ? "Loading..." : snippet, "snippet")}
                    {renderCopyPreviewRow(snippet, "snippet", previewWidget)}
                    <Alert severity="info" sx={{ mt: 2.5, borderRadius: 2 }}>
                        <Typography variant="body2">Works on Blogger, WordPress.com, Wix, Weebly, and other blog platforms.</Typography>
                    </Alert>
                </Box>
            </Paper>
        );
    };

    const renderInstagram = () => {
        const c = TAB_COLORS.instagram;
        return (
            <Paper sx={{ ...glassCard, overflow: "hidden" }}>
                {renderSectionHeader("Instagram Installation", "Connect your Instagram Business account for auto-DM replies", c)}
                <Box sx={{ px: 3, pb: 3 }}>
                    {renderSteps([
                        "Go to Facebook Developers Console (developers.facebook.com)",
                        "Create a new app or select an existing one",
                        "Add the Instagram Graph API product",
                        "Connect your Instagram Business account",
                        "Generate an access token with required permissions",
                        "Paste the token below and save",
                    ], c)}
                    <Divider sx={{ my: 2.5 }} />
                    <Typography fontWeight={600} fontSize={14} mb={1} sx={{ color: "#374151" }}>Instagram Access Token</Typography>
                    <TextField fullWidth size="small" placeholder="Paste your Instagram access token here..."
                        sx={{ mb: 2 }}
                        InputProps={{
                            sx: { borderRadius: 2, fontFamily: "monospace", fontSize: 13, bgcolor: "#fff" },
                        }} />
                    <Button variant="contained" sx={{ ...gradientBtn(c, "#c13584"), px: 3 }}>
                        Save Token
                    </Button>
                    <Alert severity="info" sx={{ mt: 2.5, borderRadius: 2 }}>
                        Requires a Facebook Developer account and an Instagram Business account.
                    </Alert>
                </Box>
            </Paper>
        );
    };

    const renderMessenger = () => {
        const c = TAB_COLORS.messenger;
        return (
            <Paper sx={{ ...glassCard, overflow: "hidden" }}>
                {renderSectionHeader("Messenger Installation", "Connect Facebook Page Messenger for auto-replies", c)}
                <Box sx={{ px: 3, pb: 3 }}>
                    {renderSteps([
                        "Go to the Facebook Developers Console",
                        "Create a new app or select an existing one",
                        "Add the Messenger product",
                        "Connect your Facebook Page",
                        "Generate a Page Access Token",
                        "Subscribe to webhook events (messages, messaging_postbacks)",
                        "Paste the token below and save",
                    ], c)}
                    <Divider sx={{ my: 2.5 }} />
                    <Typography fontWeight={600} fontSize={14} mb={1} sx={{ color: "#374151" }}>Page Access Token</Typography>
                    <TextField fullWidth size="small" placeholder="Paste your Facebook Page access token here..."
                        sx={{ mb: 2 }}
                        InputProps={{
                            sx: { borderRadius: 2, fontFamily: "monospace", fontSize: 13, bgcolor: "#fff" },
                        }} />
                    <Button variant="contained" sx={{ ...gradientBtn(c, "#166fe5"), px: 3 }}>
                        Save Token
                    </Button>
                    <Alert severity="info" sx={{ mt: 2.5, borderRadius: 2 }}>
                        Requires a Facebook Developer account and a Facebook Page.
                    </Alert>
                </Box>
            </Paper>
        );
    };

    const renderCMS = (name, instructions, color) => (
        <Paper sx={{ ...glassCard, overflow: "hidden" }}>
            {renderSectionHeader(`${name} Installation`, instructions, color)}
            <Box sx={{ px: 3, pb: 3 }}>
                {renderSnippetField(loading ? "Loading..." : snippet, "snippet")}
                {renderCopyPreviewRow(snippet, "snippet", previewWidget)}
            </Box>
        </Paper>
    );

    const renderMobileApp = () => {
        const c = TAB_COLORS["mobile-app"];
        return (
            <Paper sx={{ ...glassCard, overflow: "hidden" }}>
                {renderSectionHeader("Mobile App Installation", "Integrate via WebView in your native or cross-platform app", c)}
                <Box sx={{ px: 3, pb: 3 }}>
                    <Box sx={{ display: "flex", gap: 1.5, mb: 2.5, flexWrap: "wrap" }}>
                        {[
                            { label: "Android", icon: "🤖" },
                            { label: "iOS", icon: "🍎" },
                            { label: "React Native", icon: "⚛️" },
                            { label: "Flutter", icon: "🦋" },
                        ].map((p) => (
                            <Button key={p.label} variant="outlined"
                                startIcon={<span>{p.icon}</span>}
                                sx={{
                                    textTransform: "none", borderRadius: 2.5, px: 2.5,
                                    borderColor: c, color: c, fontWeight: 600,
                                    "&:hover": { borderColor: c, bgcolor: `${c}0a` },
                                }}>
                                {p.label}
                            </Button>
                        ))}
                    </Box>
                    <Divider sx={{ mb: 2.5 }} />
                    <Typography fontWeight={600} fontSize={14} mb={1.5} sx={{ color: "#374151" }}>Manual Installation Steps</Typography>
                    {renderSteps([
                        "Add a WebView component to your app",
                        `Load the chatbot URL: ${widgetUrlShort || "/usertest/{botId}"}`,
                        "Enable JavaScript and DOM storage in WebView settings",
                        "Customize the WebView appearance to match your app theme",
                        "Build and deploy your app",
                    ], c)}
                    <Alert severity="info" sx={{ mt: 2.5, borderRadius: 2 }}>
                        For native SDK integration, contact our support team for platform-specific documentation.
                    </Alert>
                </Box>
            </Paper>
        );
    };

    const renderLandingPage = () => {
        const c = TAB_COLORS["landing-page"];
        return (
            <Paper sx={{ ...glassCard, overflow: "hidden" }}>
                {renderSectionHeader("Landing Page Installation", "Share or embed your chatbot on any landing page", c)}
                <Box sx={{ px: 3, pb: 3 }}>
                    <TextField
                        fullWidth
                        value={widgetUrlShort || "Select a bot first"}
                        InputProps={{
                            readOnly: true,
                            sx: {
                                fontFamily: "monospace", fontSize: 13, borderRadius: 2.5,
                                bgcolor: "#f8f9fc", color: "#1f2937",
                                "& .MuiOutlinedInput-notchedOutline": { borderColor: "#e5e7eb" },
                            },
                        }}
                        sx={{ mb: 2 }}
                    />
                    <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
                        <Button variant="contained"
                            startIcon={copied === "url" ? <CheckIcon /> : <ContentCopyIcon />}
                            onClick={() => copyToClipboard(widgetUrlShort, "url")}
                            disabled={!chatbotId}
                            sx={{ ...gradientBtn(copied === "url" ? "#2e7d32" : c, copied === "url" ? "#1b5e20" : "#d97706"), px: 3 }}>
                            {copied === "url" ? "Copied!" : "Copy Link"}
                        </Button>
                        <Button variant="outlined" startIcon={<OpenInNewIcon />}
                            onClick={previewWidget} disabled={!chatbotId}
                            sx={{
                                textTransform: "none", borderRadius: 2.5, px: 3,
                                borderColor: c, color: c, fontWeight: 600,
                                "&:hover": { borderColor: c, bgcolor: `${c}0a` },
                            }}>
                            Open Preview
                        </Button>
                    </Box>
                    <Alert severity="info" sx={{ mt: 2.5, borderRadius: 2 }}>
                        Embed this link as an iframe on any landing page or share it directly with customers.
                    </Alert>
                </Box>
            </Paper>
        );
    };

    const renderWidget = () => {
        const c = TAB_COLORS.widget;
        return (
            <Paper sx={{ ...glassCard, overflow: "hidden" }}>
                {renderSectionHeader("Widget Installation", "Embed as a fixed-size iframe element", c)}
                <Box sx={{ px: 3, pb: 3 }}>
                    {renderSnippetField(iframeCode, "iframe")}
                    {renderCopyPreviewRow(iframeCode, "iframe", previewWidget)}
                </Box>
            </Paper>
        );
    };

    const renderOtherCMS = () => {
        const c = TAB_COLORS["other-cms"];
        return (
            <Paper sx={{ ...glassCard, overflow: "hidden", textAlign: "center" }}>
                <Box sx={{
                    background: `linear-gradient(135deg, ${c}, ${c}dd)`,
                    mx: -1, mt: -1, mb: 3, p: 4, borderRadius: 3, color: "#fff",
                }}>
                    <Box sx={{ fontSize: 48, mb: 1 }}>📞</Box>
                    <Typography fontWeight={700} fontSize={18}>Other CMS Installation</Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
                        Platform not listed here? We'll help you with the setup.
                    </Typography>
                </Box>
                <Box sx={{ px: 3, pb: 4 }}>
                    <Button variant="contained"
                        sx={{ ...gradientBtn(c, "#db2777"), px: 5, py: 1.2, fontSize: 15 }}>
                        Contact Support
                    </Button>
                </Box>
            </Paper>
        );
    };

    const renderContent = () => {
        switch (activeTab) {
            case "website-blog": return renderWebsiteBlog();
            case "instagram": return renderInstagram();
            case "website": return renderWebsite();
            case "messenger": return renderMessenger();
            case "wordpress": return renderCMS("WordPress", 'Install "Insert Headers and Footers" plugin, paste in footer.', TAB_COLORS.wordpress);
            case "mobile-app": return renderMobileApp();
            case "landing-page": return renderLandingPage();
            case "widget": return renderWidget();
            case "drupal": return renderCMS("Drupal", "Go to Administration → Configuration → PHP and paste in footer code.", TAB_COLORS.drupal);
            case "shopify": return renderCMS("Shopify", "Online Store → Themes → Edit code → paste before </body> in theme.liquid.", TAB_COLORS.shopify);
            case "other-cms": return renderOtherCMS();
            default: return null;
        }
    };

    return (
        <Box sx={{
            p: 3, minHeight: "100%",
            background: "linear-gradient(135deg, #f0f4ff 0%, #fdf2f8 50%, #f0f4ff 100%)",
        }}>
            <Box sx={{ display: "flex", gap: 3, maxWidth: 1200, mx: "auto" }}>
                <Box sx={{ width: 220, flexShrink: 0 }}>
                    <Paper sx={{
                        borderRadius: 3, overflow: "hidden",
                        border: "1px solid rgba(255,255,255,0.7)",
                        boxShadow: "0 8px 32px rgba(0,0,0,0.05)",
                        backdropFilter: "blur(12px)",
                        background: "rgba(255,255,255,0.8)",
                    }}>
                        {TABS.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            const isHovered = hoveredTab === tab.id;
                            const color = TAB_COLORS[tab.id];
                            return (
                                <Box key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    onMouseEnter={() => setHoveredTab(tab.id)}
                                    onMouseLeave={() => setHoveredTab(null)}
                                    sx={{
                                        display: "flex", alignItems: "center", gap: 1.5, px: 2.5, py: 1.4,
                                        cursor: "pointer", position: "relative",
                                        borderLeft: isActive ? `3px solid ${color}` : "3px solid transparent",
                                        bgcolor: isActive ? `${color}0d` : "transparent",
                                        color: isActive ? color : "#64748b",
                                        fontWeight: isActive ? 700 : 500,
                                        fontSize: 13,
                                        borderBottom: "1px solid",
                                        borderColor: "divider",
                                        transition: "all 0.2s",
                                        "&:hover": {
                                            bgcolor: isActive ? `${color}0d` : "#f1f5f9",
                                            color: isActive ? color : "#334155",
                                        },
                                    }}>
                                    <Icon sx={{
                                        fontSize: 18, flexShrink: 0,
                                        color: isActive ? color : isHovered ? "#475569" : "#94a3b8",
                                        transition: "color 0.2s",
                                    }} />
                                    {tab.label}
                                </Box>
                            );
                        })}
                    </Paper>
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                    {renderContent()}
                </Box>
            </Box>
            <Snackbar
                open={Boolean(copied)}
                autoHideDuration={2500}
                message={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <CheckIcon sx={{ fontSize: 18 }} />
                        Copied to clipboard
                    </Box>
                }
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                ContentProps={{ sx: { borderRadius: 2, bgcolor: "#1f2937" } }}
            />
        </Box>
    );
};

export default Install;
