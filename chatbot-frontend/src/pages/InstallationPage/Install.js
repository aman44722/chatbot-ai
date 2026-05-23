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

const TABS = [
    { id: "website-blog", label: "Website/Blog Installation", icon: WebIcon },
    { id: "instagram", label: "Instagram Installation", icon: CameraAltIcon },
    { id: "website", label: "Website Installation", icon: CodeIcon },
    { id: "messenger", label: "Messenger Installation", icon: ForumIcon },
    { id: "wordpress", label: "WordPress Installation", icon: DescriptionIcon },
    { id: "mobile-app", label: "Mobile App Installation", icon: SmartphoneIcon },
    { id: "landing-page", label: "Landing Page Installation", icon: LaunchIcon },
    { id: "widget", label: "Widget Installation", icon: WidgetsIcon },
    { id: "drupal", label: "Drupal Installation", icon: StorageIcon },
    { id: "shopify", label: "Shopify Installation", icon: StorefrontIcon },
    { id: "other-cms", label: "Other CMS Installation", icon: ExtensionIcon },
];

const Install = () => {
    const navigate = useNavigate();
    const [chatbotId, setChatbotId] = useState("");
    const [loading, setLoading] = useState(true);
    const [hasWhitelist, setHasWhitelist] = useState(true);
    const [copied, setCopied] = useState("");
    const [activeTab, setActiveTab] = useState("website");

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

    const tabSx = (id) => ({
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        px: 2.5,
        py: 1.4,
        cursor: "pointer",
        bgcolor: activeTab === id ? "#5b5ea6" : "transparent",
        color: activeTab === id ? "#fff" : "text.primary",
        fontWeight: activeTab === id ? 700 : 500,
        fontSize: 13,
        borderBottom: "1px solid",
        borderColor: "divider",
        transition: "all 0.15s",
        "&:hover": { bgcolor: activeTab === id ? "#5b5ea6" : "#f0f0ff" },
    });

    const renderWebsite = () => (
        <Box sx={{ display: "flex", gap: 3 }}>
            <Box sx={{ width: 300, flexShrink: 0 }}>
                <Paper sx={{ p: 3, borderRadius: 2.5 }}>
                    <Typography fontWeight={700} fontSize={15} mb={1}>How to install</Typography>
                    {[
                        "Copy the snippet below",
                        "Open your website's HTML",
                        "Paste it before the closing </body> tag",
                        "Save and publish",
                    ].map((step, i) => (
                        <Box key={i} sx={{ display: "flex", gap: 1.5, mb: 1.5, alignItems: "flex-start" }}>
                            <Chip label={i + 1} size="small" sx={{ bgcolor: "#5b5ea6", color: "#fff", fontWeight: 700, minWidth: 24, height: 24, fontSize: 12 }} />
                            <Typography variant="body2" color="text.secondary" mt={0.2}>{step}</Typography>
                        </Box>
                    ))}
                    <Divider sx={{ my: 2 }} />
                    <Button
                        fullWidth
                        variant="outlined"
                        size="small"
                        sx={{ textTransform: "none", borderRadius: 2 }}
                        onClick={() => navigate({ pathname: "/app/settings", search: "?tab=whitelist" })}
                    >
                        Manage Whitelist Domains
                    </Button>
                </Paper>
                {chatbotId && (
                    <Paper sx={{ p: 2.5, borderRadius: 2.5, mt: 2 }}>
                        <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ textTransform: "uppercase", letterSpacing: 0.5 }}>
                            Your Chatbot ID
                        </Typography>
                        <Typography fontFamily="monospace" fontSize={12} sx={{ mt: 0.5, wordBreak: "break-all", bgcolor: "#f4f6fb", p: 1, borderRadius: 1, color: "#5b5ea6" }}>
                            {chatbotId}
                        </Typography>
                        <Divider sx={{ my: 1.5 }} />
                        <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ textTransform: "uppercase", letterSpacing: 0.5 }}>
                            Widget URL
                        </Typography>
                        <Typography fontFamily="monospace" fontSize={11} sx={{ mt: 0.5, wordBreak: "break-all", bgcolor: "#f4f6fb", p: 1, borderRadius: 1, color: "#333" }}>
                            {widgetUrl}
                        </Typography>
                    </Paper>
                )}
            </Box>
            <Box sx={{ flex: 1 }}>
                <Paper sx={{ p: 4, borderRadius: 2.5 }}>
                    <Typography fontWeight={700} fontSize={17} mb={0.5}>Embed Script</Typography>
                    <Typography variant="body2" color="text.secondary" mb={2}>
                        Paste this snippet before <code style={{ background: "#f0f0f0", padding: "1px 5px", borderRadius: 4 }}>&lt;/body&gt;</code> on every page where you want the chat widget.
                    </Typography>
                    {!hasWhitelist && (
                        <Alert severity="warning" sx={{ mb: 2, borderRadius: 2 }}>
                            No whitelisted domains yet. The widget may be blocked on external sites. Add your domain in{" "}
                            <strong style={{ cursor: "pointer", textDecoration: "underline" }} onClick={() => navigate({ pathname: "/app/settings", search: "?tab=whitelist" })}>
                                Settings → Whitelist
                            </strong>.
                        </Alert>
                    )}
                    <TextField
                        fullWidth
                        multiline
                        minRows={10}
                        value={loading ? "Loading..." : snippet}
                        InputProps={{
                            readOnly: true,
                            sx: { fontFamily: "monospace", fontSize: 12.5, borderRadius: 2, bgcolor: "#fafafa", color: "#333" },
                        }}
                    />
                    <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                        <Button
                            variant="contained"
                            startIcon={copied === "snippet" ? <CheckIcon /> : <ContentCopyIcon />}
                            onClick={() => copyToClipboard(snippet, "snippet")}
                            disabled={loading || !snippet}
                            sx={{
                                textTransform: "none", borderRadius: 2, fontWeight: 700,
                                bgcolor: copied === "snippet" ? "#2e7d32" : "#5b5ea6",
                                "&:hover": { bgcolor: copied === "snippet" ? "#1b5e20" : "#4a4d8a" },
                            }}
                        >
                            {copied === "snippet" ? "Copied!" : "Copy Snippet"}
                        </Button>
                        <Button
                            variant="outlined"
                            startIcon={<OpenInNewIcon />}
                            onClick={previewWidget}
                            disabled={!chatbotId}
                            sx={{ textTransform: "none", borderRadius: 2, borderColor: "#5b5ea6", color: "#5b5ea6" }}
                        >
                            Preview Widget
                        </Button>
                    </Box>
                    <Alert severity="info" sx={{ mt: 3, borderRadius: 2 }} icon={false}>
                        <Typography variant="caption" color="text.secondary">
                            This snippet embeds the widget as a secure iframe from <strong>{window.location.origin}</strong>.
                            Make sure to copy it from your <strong>production deployment</strong> (not localhost) before pasting on a live site.
                        </Typography>
                    </Alert>
                </Paper>
            </Box>
        </Box>
    );

    const renderWebsiteBlog = () => (
        <Paper sx={{ p: 4, borderRadius: 2.5 }}>
            <Typography fontWeight={700} fontSize={17} mb={0.5}>Website/Blog Installation</Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
                Paste this snippet before the closing <code style={{ background: "#f0f0f0", padding: "1px 5px", borderRadius: 4 }}>&lt;/body&gt;</code> tag on your blog or website platform (Blogger, WordPress.com, Wix, etc.).
            </Typography>
            <TextField
                fullWidth multiline minRows={8}
                value={loading ? "Loading..." : snippet}
                InputProps={{ readOnly: true, sx: { fontFamily: "monospace", fontSize: 12.5, borderRadius: 2, bgcolor: "#fafafa", color: "#333" } }}
            />
            <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                <Button
                    variant="contained" startIcon={copied === "snippet" ? <CheckIcon /> : <ContentCopyIcon />}
                    onClick={() => copyToClipboard(snippet, "snippet")} disabled={loading || !snippet}
                    sx={{ textTransform: "none", borderRadius: 2, fontWeight: 700, bgcolor: copied === "snippet" ? "#2e7d32" : "#5b5ea6", "&:hover": { bgcolor: copied === "snippet" ? "#1b5e20" : "#4a4d8a" } }}
                >
                    {copied === "snippet" ? "Copied!" : "Copy Snippet"}
                </Button>
                <Button variant="outlined" startIcon={<OpenInNewIcon />} onClick={previewWidget} disabled={!chatbotId}
                    sx={{ textTransform: "none", borderRadius: 2, borderColor: "#5b5ea6", color: "#5b5ea6" }}>
                    Preview Widget
                </Button>
            </Box>
        </Paper>
    );

    const renderInstagram = () => (
        <Paper sx={{ p: 4, borderRadius: 2.5 }}>
            <Typography fontWeight={700} fontSize={17} mb={2}>Instagram Installation</Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
                Connect your Instagram Business account to enable auto-DM replies. Follow the steps below:
            </Typography>
            {[
                "Go to the Facebook Developers Console (developers.facebook.com)",
                "Create a new app or select an existing one",
                "Add the Instagram Graph API product to your app",
                "Connect your Instagram Business account",
                "Generate an access token with the required permissions",
                "Paste the token below and save",
            ].map((step, i) => (
                <Box key={i} sx={{ display: "flex", gap: 1.5, mb: 1.5, alignItems: "flex-start" }}>
                    <Chip label={i + 1} size="small" sx={{ bgcolor: "#E1306C", color: "#fff", fontWeight: 700, minWidth: 24, height: 24, fontSize: 12 }} />
                    <Typography variant="body2" color="text.secondary" mt={0.2}>{step}</Typography>
                </Box>
            ))}
            <Divider sx={{ my: 3 }} />
            <Typography fontWeight={600} fontSize={14} mb={1}>Instagram Access Token</Typography>
            <TextField fullWidth size="small" placeholder="Paste your Instagram access token here..."
                sx={{ mb: 2 }} InputProps={{ sx: { borderRadius: 2, fontFamily: "monospace", fontSize: 13 } }} />
            <Button variant="contained" sx={{ textTransform: "none", borderRadius: 2, bgcolor: "#E1306C", "&:hover": { bgcolor: "#c13584" } }}>
                Save Token
            </Button>
            <Alert severity="info" sx={{ mt: 3, borderRadius: 2 }}>
                <Typography variant="body2">
                    Instagram integration requires a Facebook Developer account and an Instagram Business account.
                    Auto-DM replies will be handled via Instagram Graph API webhooks.
                </Typography>
            </Alert>
        </Paper>
    );

    const renderMessenger = () => (
        <Paper sx={{ p: 4, borderRadius: 2.5 }}>
            <Typography fontWeight={700} fontSize={17} mb={2}>Messenger Installation</Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
                Connect your Facebook Page Messenger to enable auto-replies:
            </Typography>
            {[
                "Go to the Facebook Developers Console",
                "Create a new app or select an existing one",
                "Add the Messenger product",
                "Connect your Facebook Page",
                "Generate a Page Access Token",
                "Subscribe to webhook events (messages, messaging_postbacks)",
                "Paste the token below and save",
            ].map((step, i) => (
                <Box key={i} sx={{ display: "flex", gap: 1.5, mb: 1.5, alignItems: "flex-start" }}>
                    <Chip label={i + 1} size="small" sx={{ bgcolor: "#1877F2", color: "#fff", fontWeight: 700, minWidth: 24, height: 24, fontSize: 12 }} />
                    <Typography variant="body2" color="text.secondary" mt={0.2}>{step}</Typography>
                </Box>
            ))}
            <Divider sx={{ my: 3 }} />
            <Typography fontWeight={600} fontSize={14} mb={1}>Page Access Token</Typography>
            <TextField fullWidth size="small" placeholder="Paste your Facebook Page access token here..."
                sx={{ mb: 2 }} InputProps={{ sx: { borderRadius: 2, fontFamily: "monospace", fontSize: 13 } }} />
            <Button variant="contained" sx={{ textTransform: "none", borderRadius: 2, bgcolor: "#1877F2", "&:hover": { bgcolor: "#166fe5" } }}>
                Save Token
            </Button>
            <Alert severity="info" sx={{ mt: 3, borderRadius: 2 }}>
                <Typography variant="body2">
                    Messenger integration requires a Facebook Developer account and a Facebook Page.
                    Auto-replies will be handled via Messenger Platform webhooks.
                </Typography>
            </Alert>
        </Paper>
    );

    const renderCMS = (name, instructions) => (
        <Paper sx={{ p: 4, borderRadius: 2.5 }}>
            <Typography fontWeight={700} fontSize={17} mb={0.5}>{name} Installation</Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>{instructions}</Typography>
            <TextField
                fullWidth multiline minRows={8}
                value={loading ? "Loading..." : snippet}
                InputProps={{ readOnly: true, sx: { fontFamily: "monospace", fontSize: 12.5, borderRadius: 2, bgcolor: "#fafafa", color: "#333" } }}
            />
            <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                <Button variant="contained" startIcon={copied === "snippet" ? <CheckIcon /> : <ContentCopyIcon />}
                    onClick={() => copyToClipboard(snippet, "snippet")} disabled={loading || !snippet}
                    sx={{ textTransform: "none", borderRadius: 2, fontWeight: 700, bgcolor: copied === "snippet" ? "#2e7d32" : "#5b5ea6", "&:hover": { bgcolor: copied === "snippet" ? "#1b5e20" : "#4a4d8a" } }}>
                    {copied === "snippet" ? "Copied!" : "Copy Snippet"}
                </Button>
                <Button variant="outlined" startIcon={<OpenInNewIcon />} onClick={previewWidget} disabled={!chatbotId}
                    sx={{ textTransform: "none", borderRadius: 2, borderColor: "#5b5ea6", color: "#5b5ea6" }}>
                    Preview Widget
                </Button>
            </Box>
        </Paper>
    );

    const renderMobileApp = () => (
        <Paper sx={{ p: 4, borderRadius: 2.5 }}>
            <Typography fontWeight={700} fontSize={17} mb={2}>Mobile App Installation</Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
                Integrate the chatbot into your mobile app manually. Choose your platform below:
            </Typography>
            <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
                {["Android (Kotlin/Java)", "iOS (Swift)", "React Native", "Flutter"].map((p) => (
                    <Button key={p} variant="outlined" sx={{ textTransform: "none", borderRadius: 2, px: 3, borderColor: "#5b5ea6", color: "#5b5ea6" }}>
                        {p}
                    </Button>
                ))}
            </Box>
            <Divider sx={{ mb: 3 }} />
            <Typography fontWeight={600} fontSize={14} mb={1}>Manual Installation Steps</Typography>
            {[
                "Add a WebView component to your app",
                `Load the chatbot URL: ${widgetUrl || "/usertest/{botId}"}`,
                "Enable JavaScript and DOM storage in WebView settings",
                "Customize the WebView appearance to match your app theme",
                "Build and deploy your app",
            ].map((step, i) => (
                <Box key={i} sx={{ display: "flex", gap: 1.5, mb: 1.5, alignItems: "flex-start" }}>
                    <Chip label={i + 1} size="small" sx={{ bgcolor: "#10b981", color: "#fff", fontWeight: 700, minWidth: 24, height: 24, fontSize: 12 }} />
                    <Typography variant="body2" color="text.secondary" mt={0.2}>{step}</Typography>
                </Box>
            ))}
            <Alert severity="info" sx={{ mt: 3, borderRadius: 2 }}>
                <Typography variant="body2">
                    For native SDK integration, contact our support team for platform-specific SDK documentation.
                </Typography>
            </Alert>
        </Paper>
    );

    const renderLandingPage = () => (
        <Paper sx={{ p: 4, borderRadius: 2.5 }}>
            <Typography fontWeight={700} fontSize={17} mb={0.5}>Landing Page Installation</Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
                Use this preview link to embed your chatbot on a landing page or share it directly with your audience.
            </Typography>
            <TextField
                fullWidth
                value={widgetUrl || "Select a bot first"}
                InputProps={{ readOnly: true, sx: { fontFamily: "monospace", fontSize: 13, borderRadius: 2, bgcolor: "#fafafa", color: "#333" } }}
                sx={{ mb: 2 }}
            />
            <Box sx={{ display: "flex", gap: 2 }}>
                <Button variant="contained" startIcon={copied === "url" ? <CheckIcon /> : <ContentCopyIcon />}
                    onClick={() => copyToClipboard(widgetUrl, "url")} disabled={!chatbotId}
                    sx={{ textTransform: "none", borderRadius: 2, bgcolor: copied === "url" ? "#2e7d32" : "#5b5ea6", "&:hover": { bgcolor: copied === "url" ? "#1b5e20" : "#4a4d8a" } }}>
                    {copied === "url" ? "Copied!" : "Copy Link"}
                </Button>
                <Button variant="outlined" startIcon={<OpenInNewIcon />} onClick={previewWidget} disabled={!chatbotId}
                    sx={{ textTransform: "none", borderRadius: 2, borderColor: "#5b5ea6", color: "#5b5ea6" }}>
                    Open Preview
                </Button>
            </Box>
            <Alert severity="info" sx={{ mt: 3, borderRadius: 2 }}>
                <Typography variant="body2">
                    You can embed this link as an iframe on any landing page, or share it directly with your customers.
                </Typography>
            </Alert>
        </Paper>
    );

    const renderWidget = () => (
        <Paper sx={{ p: 4, borderRadius: 2.5 }}>
            <Typography fontWeight={700} fontSize={17} mb={0.5}>Widget Installation</Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
                Use this iframe snippet to embed the chatbot widget as a fixed-size element directly into your page.
            </Typography>
            <TextField
                fullWidth multiline minRows={6}
                value={iframeCode || "Select a bot first"}
                InputProps={{ readOnly: true, sx: { fontFamily: "monospace", fontSize: 12.5, borderRadius: 2, bgcolor: "#fafafa", color: "#333" } }}
            />
            <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                <Button variant="contained" startIcon={copied === "iframe" ? <CheckIcon /> : <ContentCopyIcon />}
                    onClick={() => copyToClipboard(iframeCode, "iframe")} disabled={!chatbotId}
                    sx={{ textTransform: "none", borderRadius: 2, bgcolor: copied === "iframe" ? "#2e7d32" : "#5b5ea6", "&:hover": { bgcolor: copied === "iframe" ? "#1b5e20" : "#4a4d8a" } }}>
                    {copied === "iframe" ? "Copied!" : "Copy Code"}
                </Button>
                <Button variant="outlined" startIcon={<OpenInNewIcon />} onClick={previewWidget} disabled={!chatbotId}
                    sx={{ textTransform: "none", borderRadius: 2, borderColor: "#5b5ea6", color: "#5b5ea6" }}>
                    Preview Widget
                </Button>
            </Box>
        </Paper>
    );

    const renderOtherCMS = () => (
        <Paper sx={{ p: 4, borderRadius: 2.5, textAlign: "center" }}>
            <Typography fontWeight={700} fontSize={17} mb={2}>Other CMS Installation</Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
                Need help installing the chatbot on a platform not listed here?
                Contact our support team and we'll help you with the setup.
            </Typography>
            <Button variant="contained"
                sx={{ textTransform: "none", borderRadius: 2, bgcolor: "#5b5ea6", "&:hover": { bgcolor: "#4a4d8a" }, px: 4 }}>
                Contact Support
            </Button>
        </Paper>
    );

    const renderContent = () => {
        switch (activeTab) {
            case "website-blog": return renderWebsiteBlog();
            case "instagram": return renderInstagram();
            case "website": return renderWebsite();
            case "messenger": return renderMessenger();
            case "wordpress": return renderCMS("WordPress", 'Install the "Insert Headers and Footers" plugin, then paste this snippet in the footer section.');
            case "mobile-app": return renderMobileApp();
            case "landing-page": return renderLandingPage();
            case "widget": return renderWidget();
            case "drupal": return renderCMS("Drupal", "Go to Administration → Configuration → Development → PHP and paste this snippet in the footer code.");
            case "shopify": return renderCMS("Shopify", "In your Shopify admin, go to Online Store → Themes → Edit code, and paste this snippet before the closing </body> tag in theme.liquid.");
            case "other-cms": return renderOtherCMS();
            default: return null;
        }
    };

    return (
        <Box sx={{ p: 3, minHeight: "100%" }}>
            <Box sx={{ display: "flex", gap: 3, maxWidth: 1200, mx: "auto" }}>
                <Box sx={{ width: 240, flexShrink: 0 }}>
                    <Paper sx={{ borderRadius: 2.5, overflow: "hidden" }}>
                        {TABS.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <Box key={tab.id} onClick={() => setActiveTab(tab.id)} sx={tabSx(tab.id)}>
                                    <Icon sx={{ fontSize: 18, flexShrink: 0 }} />
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
                message="✅ Copied to clipboard"
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            />
        </Box>
    );
};

export default Install;
