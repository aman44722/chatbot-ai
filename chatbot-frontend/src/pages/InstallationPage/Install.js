import React, { useEffect, useState } from "react";
import { Box, Paper, Typography, Button, TextField, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Install = () => {
    const navigate = useNavigate();
    const [snippet, setSnippet] = useState("");
    const [loading, setLoading] = useState(true);
    const [meta, setMeta] = useState(null);

    const goToWhitelist = () => {
        navigate({ pathname: "/app/settings", search: "?tab=whitelist" });
    };

    const fetchSnippet = async () => {
        setLoading(true);
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            const token = user?.token;

            if (!token) return;

            const apiBase = process.env.REACT_APP_AUTH_API || "http://localhost:5000/api/auth";
            const res = await fetch(`${apiBase}/install/snippet`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const data = await res.json();

            if (res.status === 412 || !data.hasWhitelist) {
                setMeta({ whitelist: [] });
                setSnippet("");
            } else if (res.ok) {
                setMeta({ whitelist: data.whitelist || [] });
                setSnippet(String(data.snippet || ""));
            }
        } catch (err) {
            console.error("Snippet fetch error", err);
        } finally {
            setLoading(false);
        }
    };

    // Fetch on mount and again when window regains focus
    useEffect(() => {
        fetchSnippet();
        const onFocus = () => fetchSnippet();
        window.addEventListener("focus", onFocus);
        return () => window.removeEventListener("focus", onFocus);
    }, []);

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(snippet);
            alert("Snippet copied to clipboard");
        } catch {
            alert("Unable to copy — select and copy manually");
        }
    };

    return (
        <Box style={{ padding: "24px", background: "#F6F9FF", display: "flex", gap: "10px" }}>
            {/* Left */}
            <Box sx={{ width: "40%" }}>
                <Paper sx={{ p: 2 }}>
                    <Typography variant="h6">Installation Options</Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                        Use the script on allowed domains only.
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                        <Button variant="contained" onClick={goToWhitelist}>
                            Update Whitelisting URLs
                        </Button>
                    </Box>
                </Paper>
            </Box>

            {/* Right */}
            <Box sx={{ width: "60%" }}>
                <Paper sx={{ p: 4 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Copy the installation code and paste it before the closing &lt;/head&gt; tag of your website
                    </Typography>

                    {meta && meta.whitelist.length === 0 && (
                        <Alert severity="warning" sx={{ mb: 2 }}>
                            You have not added any whitelisted domains. Please add your domain in Whitelisting first.
                        </Alert>
                    )}

                    <TextField
                        fullWidth
                        multiline
                        minRows={8}
                        value={loading ? "Loading..." : snippet}
                        InputProps={{ readOnly: true }}
                    />

                    <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                        <Button
                            variant="contained"
                            onClick={copyToClipboard}
                            disabled={loading || !snippet}
                        >
                            Copy Snippet
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </Box>
    );
};

export default Install;
