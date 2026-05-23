# Implementation Roadmap

## Phase 1 — Subscription & Plans System (Foundation)
- [ ] Backend: Plan model (tiers, limits, features)
- [ ] Backend: Plan middleware (check access before API)
- [ ] Frontend: Plans page at `/app/plans`
- [ ] Frontend: Plan badge on sidebar, upgrade prompts
- [ ] Limits: Chatbots count, chats/month, user chats/month

## Phase 2 — User Roles & Authentication
- [ ] Roles: Admin, Analyst, Supervisor, Agent
- [ ] Backend: Role-based access middleware
- [ ] Frontend: User management with role assignment
- [ ] 2-Factor Authentication (2FA)

## Phase 3 — Live Chat System
- [ ] Live agent queue (3 agents max per plan)
- [ ] Real-time messaging (Socket.io)
- [ ] Canned responses (pre-saved replies)
- [ ] Agent dashboard: assigned chats, status toggle
- [ ] Supervisor dashboard: monitor all agents, transfer chats

## Phase 4 — Notifications & Validations
- [ ] Email OTP validation for leads
- [ ] Lead email notifications (new lead alert)
- [ ] Hot lead notifications (priority leads)
- [ ] Auto email followup (scheduled emails)
- [ ] Backend: Email service (SendGrid / AWS SES)

## Phase 5 — Multi-Lingual & AI Features
- [ ] Multi-lingual UI (2 languages: backend + frontend i18n)
- [ ] AI Bot (self-setup — user provides OpenAI key)
- [ ] AI Speech Answering (STT + TTS)
- [ ] Voice Enabled Intent Mapping

## Phase 6 — Integrations
- [ ] CRM (Standard) — export leads to CRM
- [ ] Webhook Integrations — user-configurable webhooks
- [ ] Google Sheets — auto-sync leads

## Phase 7 — WhatsApp Integration
- [ ] WhatsApp Business API connection
- [ ] WhatsApp Catalog (product listing)
- [ ] WhatsApp E-Commerce (cart, checkout)
- [ ] Separate WhatsApp plan tier

## Phase 8 — Advanced Features
- [ ] CSV Chats Export
- [ ] Contacts Dashboard
- [ ] Lead Data Masking (security)
- [ ] Template Message Analytics

---

### Current Status
| Feature | Status |
|---------|--------|
| Chatbots CRUD | ✅ Done |
| Chat Widget | ✅ Done |
| Conversations | ✅ Done |
| Users Page | ✅ Done |
| Leads Page | ✅ Done |
| Analytics (basic) | ✅ Done |
| Settings | ✅ Done |
| Templates | ✅ Done |
| Install Page | ✅ Done |
