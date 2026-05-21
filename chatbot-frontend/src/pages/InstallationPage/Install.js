import React, { useEffect, useState } from "react";
import {
    Box, Paper, Typography, Button, TextField, Alert,
    Snackbar, Divider, Chip
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import CheckIcon from "@mui/icons-material/Check";
import { useNavigate } from "react-router-dom";

const API = process.env.REACT_APP_AUTH_API || "http://localhost:5000/api/auth";

function buildSnippet(chatbotId) {
    const origin = window.location.origin;
    return `<!-- A2Bot Live Chat Widget -->
<script>
(function(){
  if(document.getElementById('a2bot-widget')) return;
  var f = document.createElement('iframe');
  f.id = 'a2bot-widget';
  f.src = '${origin}/usertest/${chatbotId}';
  f.style.cssText = [
    'position:fixed',
    'bottom:20px',
    'right:20px',
    'width:400px',
    'height:600px',
    'border:none',
    'z-index:2147483647',
    'border-radius:16px',
    'box-shadow:0 8px 32px rgba(0,0,0,0.22)'
  ].join(';');
  f.allow = 'microphone';
  document.body.appendChild(f);
})();
</script>`;
}

const Install = () => {
    const navigate = useNavigate();
    const [chatbotId, setChatbotId] = useState("");
    const [loading, setLoading] = useState(true);
    const [hasWhitelist, setHasWhitelist] = useState(true);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const fetchMeta = async () => {
            setLoading(true);
            try {
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
            } catch (err) {
                console.error("Install meta error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchMeta();
    }, []);

    const snippet = chatbotId ? buildSnippet(chatbotId) : "";

    const copySnippet = async () => {
        try {
            await navigator.clipboard.writeText(snippet);
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        } catch {
            alert("Select all text in the box and copy manually (Ctrl+A, Ctrl+C).");
        }
    };

    const previewWidget = () => {
        if (chatbotId) window.open(`/usertest/${chatbotId}`, "_blank");
    };

    return (
        <Box sx={{ p: 3, bgcolor: "#F6F9FF", minHeight: "100%" }}>
            <Box sx={{ display: "flex", gap: 3, maxWidth: 1100, mx: "auto" }}>

                {/* ── LEFT ── */}
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
                            <Typography
                                fontFamily="monospace"
                                fontSize={12}
                                sx={{ mt: 0.5, wordBreak: "break-all", bgcolor: "#f4f6fb", p: 1, borderRadius: 1, color: "#5b5ea6" }}
                            >
                                {chatbotId}
                            </Typography>

                            <Divider sx={{ my: 1.5 }} />

                            <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ textTransform: "uppercase", letterSpacing: 0.5 }}>
                                Widget URL
                            </Typography>
                            <Typography
                                fontFamily="monospace"
                                fontSize={11}
                                sx={{ mt: 0.5, wordBreak: "break-all", bgcolor: "#f4f6fb", p: 1, borderRadius: 1, color: "#333" }}
                            >
                                {window.location.origin}/usertest/{chatbotId}
                            </Typography>
                        </Paper>
                    )}
                </Box>

                {/* ── RIGHT ── */}
                <Box sx={{ flex: 1 }}>
                    <Paper sx={{ p: 4, borderRadius: 2.5 }}>
                        <Typography fontWeight={700} fontSize={17} mb={0.5}>
                            Embed Script
                        </Typography>
                        <Typography variant="body2" color="text.secondary" mb={2}>
                            Paste this snippet before <code style={{ background: "#f0f0f0", padding: "1px 5px", borderRadius: 4 }}>&lt;/body&gt;</code> on every page where you want the chat widget.
                        </Typography>

                        {!hasWhitelist && (
                            <Alert severity="warning" sx={{ mb: 2, borderRadius: 2 }}>
                                No whitelisted domains yet. The widget may be blocked on external sites. Add your domain in{" "}
                                <strong
                                    style={{ cursor: "pointer", textDecoration: "underline" }}
                                    onClick={() => navigate({ pathname: "/app/settings", search: "?tab=whitelist" })}
                                >
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
                                sx: {
                                    fontFamily: "monospace",
                                    fontSize: 12.5,
                                    borderRadius: 2,
                                    bgcolor: "#fafafa",
                                    color: "#333",
                                },
                            }}
                        />

                        <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                            <Button
                                variant="contained"
                                startIcon={copied ? <CheckIcon /> : <ContentCopyIcon />}
                                onClick={copySnippet}
                                disabled={loading || !snippet}
                                sx={{
                                    textTransform: "none", borderRadius: 2, fontWeight: 700,
                                    bgcolor: copied ? "#2e7d32" : "#5b5ea6",
                                    "&:hover": { bgcolor: copied ? "#1b5e20" : "#4a4d8a" },
                                }}
                            >
                                {copied ? "Copied!" : "Copy Snippet"}
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
                                This snippet embeds the widget as a secure iframe from{" "}
                                <strong>{window.location.origin}</strong>.
                                Make sure to copy it from your <strong>production deployment</strong> (not localhost) before pasting on a live site.
                            </Typography>
                        </Alert>
                    </Paper>
                </Box>
            </Box>

            <Snackbar
                open={copied}
                autoHideDuration={2500}
                message="✅ Snippet copied to clipboard"
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            />
        </Box>
    );
};

export default Install;
