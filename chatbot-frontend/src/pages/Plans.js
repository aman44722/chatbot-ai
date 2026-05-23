import React, { useEffect, useState } from "react";
import {
    Box, Paper, Typography, Button, Chip, CircularProgress
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";

const API = process.env.REACT_APP_AUTH_API || "http://localhost:5000/api/auth";
const PLANS_API = API.replace("/api/auth", "/api/plans");

const FEATURE_LABELS = {
    lead_generation: "Lead Generation Bot",
    customer_support: "Customer Support Bot",
    live_chat: "Live Chat",
    canned_responses: "Canned Responses",
    analytics: "Chatbot Analytics",
    template_message_analytics: "Template Message Analytics",
    webhook_integrations: "Webhook Integrations",
    google_sheets: "Google Sheets Integration",
    crm_standard: "CRM (Standard)",
    email_otp: "Email OTP Validations",
    lead_notifications: "Lead Email Notifications",
    hot_lead_notifications: "Hot Lead Notifications",
    auto_email_followup: "Auto Email Followup",
    multilingual: "Multi-Lingual (2 Languages)",
    ai_bot: "AI Bot (Self Setup)",
    ai_speech: "AI Speech Answering",
    voice_intent_mapping: "Voice Enabled Intent Mapping",
    csv_export: "CSV Chats Export",
    contacts_dashboard: "Contacts Dashboard",
    whatsapp_catalog: "WhatsApp Catalog",
    whatsapp_ecommerce: "WhatsApp E-Commerce",
    "2fa": "2 Factor Authentication",
    lead_data_masking: "Lead Data Masking",
};

const Plans = () => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userPlan, setUserPlan] = useState(null);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user?.plan) setUserPlan(user.plan);

        const token = user?.token;
        if (!token) { setLoading(false); return; }

        axios.get(PLANS_API, { headers: { Authorization: `Bearer ${token}` } })
            .then((res) => setPlans(res.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
                <CircularProgress />
            </Box>
        );
    }

    const limitLabel = (plan, key) => {
        const val = plan.limits[key];
        if (val === -1) return "Unlimited";
        if (key === "languages") return `${val} Language${val > 1 ? "s" : ""}`;
        if (key === "liveAgents") return `${val} Live Agent${val > 1 ? "s" : ""}`;
        if (key === "chatbots") return `${val} Chatbot${val > 1 ? "s" : ""}`;
        if (key === "chatsPerMonth") return `${val.toLocaleString()} Chats/Month`;
        if (key === "waUserChatsPerMonth") return val ? `${val.toLocaleString()} WA Chats/Month` : "No WhatsApp";
        return val;
    };

    const isCurrentPlan = (slug) => userPlan === slug;

    return (
        <Box sx={{
            p: 4, minHeight: "100%",
            background: "linear-gradient(135deg, #f0f4ff 0%, #fdf2f8 50%, #f0f4ff 100%)",
        }}>
            <Box sx={{ textAlign: "center", mb: 4 }}>
                <Typography fontWeight={800} fontSize={28} color="#1f2937" mb={0.5}>
                    Choose Your Plan
                </Typography>
                <Typography variant="body1" color="#6b7280">
                    Scale your chatbot with the right plan for your business
                </Typography>
            </Box>

            <Box sx={{
                display: "flex", gap: 3, justifyContent: "center", flexWrap: "wrap",
                maxWidth: 1200, mx: "auto",
            }}>
                {plans.map((plan) => {
                    const popular = plan.slug === "growth";
                    const current = isCurrentPlan(plan.slug);

                    return (
                        <Paper key={plan.slug} sx={{
                            width: 280, borderRadius: 3, overflow: "hidden", position: "relative",
                            border: current ? "2px solid #6366f1" : popular ? "2px solid #f59e0b" : "1px solid rgba(255,255,255,0.7)",
                            boxShadow: current ? "0 8px 32px rgba(99,102,241,0.15)" : popular ? "0 8px 32px rgba(245,158,11,0.15)" : "0 4px 16px rgba(0,0,0,0.04)",
                            transition: "transform 0.2s, box-shadow 0.2s",
                            "&:hover": { transform: "translateY(-4px)", boxShadow: "0 12px 40px rgba(0,0,0,0.1)" },
                            bgcolor: "rgba(255,255,255,0.85)",
                            backdropFilter: "blur(12px)",
                        }}>
                            {popular && (
                                <Chip label="Most Popular" size="small"
                                    sx={{ position: "absolute", top: 12, right: 12, bgcolor: "#f59e0b", color: "#fff", fontWeight: 700, fontSize: 11 }} />
                            )}
                            {current && (
                                <Chip label="Your Plan" size="small"
                                    sx={{ position: "absolute", top: 12, left: 12, bgcolor: "#6366f1", color: "#fff", fontWeight: 700, fontSize: 11 }} />
                            )}

                            <Box sx={{
                                p: 3, textAlign: "center",
                                background: current
                                    ? "linear-gradient(135deg, #6366f1, #8b5cf6)"
                                    : popular
                                        ? "linear-gradient(135deg, #f59e0b, #f97316)"
                                        : "linear-gradient(135deg, #f1f5f9, #e2e8f0)",
                                color: (current || popular) ? "#fff" : "#475569",
                            }}>
                                <Typography fontWeight={700} fontSize={18}>{plan.name}</Typography>
                                <Box sx={{ mt: 1, display: "flex", alignItems: "baseline", justifyContent: "center", gap: 0.5 }}>
                                    <Typography fontSize={32} fontWeight={800}>
                                        ${plan.price}
                                    </Typography>
                                    <Typography fontSize={14} sx={{ opacity: 0.8 }}>/month</Typography>
                                </Box>
                                {plan.slug === "enterprise" && (
                                    <Typography fontSize={12} sx={{ opacity: 0.8, mt: 0.5 }}>Custom pricing available</Typography>
                                )}
                            </Box>

                            <Box sx={{ px: 2.5, py: 2, borderBottom: "1px solid #f1f5f9" }}>
                                {[
                                    { key: "chatbots", label: "Chatbots" },
                                    { key: "chatsPerMonth", label: "Chats/Month" },
                                    { key: "waUserChatsPerMonth", label: "WhatsApp Chats" },
                                    { key: "liveAgents", label: "Live Agents" },
                                    { key: "languages", label: "Languages" },
                                ].map((l) => (
                                    <Box key={l.key} sx={{ display: "flex", justifyContent: "space-between", py: 0.6 }}>
                                        <Typography variant="body2" color="#6b7280">{l.label}</Typography>
                                        <Typography variant="body2" fontWeight={600} color="#1f2937">{limitLabel(plan, l.key)}</Typography>
                                    </Box>
                                ))}
                            </Box>

                            <Box sx={{ px: 2.5, py: 2 }}>
                                <Typography fontWeight={600} fontSize={12} color="#6b7280" textTransform="uppercase" letterSpacing={0.5} mb={1}>
                                    Features
                                </Typography>
                                {plan.features.map((f) => (
                                    <Box key={f} sx={{ display: "flex", gap: 1, alignItems: "flex-start", py: 0.4 }}>
                                        <CheckIcon sx={{ fontSize: 15, color: "#10b981", mt: 0.3, flexShrink: 0 }} />
                                        <Typography variant="body2" color="#374151">{FEATURE_LABELS[f] || f}</Typography>
                                    </Box>
                                ))}
                            </Box>

                            <Box sx={{ px: 2.5, pb: 3 }}>
                                <Button fullWidth variant={current ? "outlined" : "contained"}
                                    disabled={current}
                                    sx={{
                                        textTransform: "none", borderRadius: 2.5, fontWeight: 700, py: 1,
                                        ...(!current ? {
                                            background: current
                                                ? undefined
                                                : popular
                                                    ? "linear-gradient(135deg, #f59e0b, #f97316)"
                                                    : "linear-gradient(135deg, #6366f1, #8b5cf6)",
                                            color: "#fff",
                                            boxShadow: "0 4px 15px rgba(0,0,0,0.12)",
                                            "&:hover": {
                                                background: popular ? "linear-gradient(135deg, #f97316, #f59e0b)" : "linear-gradient(135deg, #8b5cf6, #6366f1)",
                                            },
                                        } : {
                                            borderColor: "#6366f1",
                                            color: "#6366f1",
                                        }),
                                    }}>
                                    {current ? "Current Plan" : plan.price === 0 ? "Get Started" : "Upgrade"}
                                </Button>
                            </Box>
                        </Paper>
                    );
                })}
            </Box>
        </Box>
    );
};

export default Plans;
