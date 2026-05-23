(function () {
    try {
        var cfg = window.A2BOT_CONFIG || {};
        if (!cfg.id) return console.warn("A2BOT: missing id in window.A2BOT_CONFIG");
        var botId = cfg.id;
        if (!window.__A2BOT_INITED) window.__A2BOT_INITED = {};
        if (window.__A2BOT_INITED[botId]) return;
        window.__A2BOT_INITED[botId] = true;

        var appOrigin = cfg.origin || window.location.origin;
        if (appOrigin.slice(-1) === "/") appOrigin = appOrigin.slice(0, -1);
        var apiBase = cfg.api || appOrigin.replace(/:\d+$/, "") + ":5000/api/auth";
        var botsApi = apiBase.replace("/api/auth", "/api/bots");

        // 1. Show button immediately with defaults — no API wait
        buildWidget({ headerColor: "#005f73", botName: "Chat" }, appOrigin, botId);

        // 2. Fetch real bot settings and patch button + panel position
        fetch(botsApi + "/" + botId + "/settings")
            .then(function (r) { return r.ok ? r.json() : {}; })
            .catch(function () { return {}; })
            .then(function (layout) { patchWidget(layout, appOrigin, botId); });

    } catch (e) {
        console.error("A2BOT widget error:", e);
    }

    // ─── Responsive panel dimensions ──────────────────────────────────────────
    // Leaves at least 120px of website visible above the panel on any screen
    function getPanelSize() {
        var vw = window.innerWidth;
        var vh = window.innerHeight;
        if (vw < 480) {
            return { w: vw + "px", h: vh + "px", fullscreen: true };
        }
        var w = Math.min(380, vw - 40);
        var h = Math.min(580, vh - 130);   // 130px = button(64) + gap(30) + bottom(36)
        return { w: w + "px", h: h + "px", fullscreen: false };
    }

    // ─── Build widget immediately ──────────────────────────────────────────────
    function buildWidget(opts, appOrigin, botId) {
        var pos = opts.botPosition || "right";
        var headerColor = (opts.themeColors || {}).header || opts.headerColor || "#005f73";
        var logoUrl = opts.companyLogo || opts.avatar || "";
        var botName = opts.botName || "Chatbot";
        var size = getPanelSize();

        // ── Styles ──
        var styleEl = document.createElement("style");
        styleEl.id = "a2bot-style-" + botId;
        var origin = (pos === "left") ? "bottom left" : (pos === "center") ? "bottom center" : "bottom right";
        styleEl.textContent = [
            "#a2bot-btn-" + botId + "{transition:transform .2s ease,box-shadow .2s ease;}",
            "#a2bot-btn-" + botId + ":hover{transform:scale(1.08);box-shadow:0 8px 25px rgba(0,0,0,.22);}",
            "#a2bot-panel-" + botId + "{",
            "  transition:opacity .22s ease,transform .22s ease;",
            "  transform-origin:" + origin + ";",
            "  opacity:0;transform:translateY(14px) scale(.97);pointer-events:none;",
            "}",
            "#a2bot-panel-" + botId + ".a2bot-open{opacity:1 !important;transform:translateY(0) scale(1) !important;pointer-events:auto !important;}",
            "#a2bot-panel-" + botId + " iframe{border:none;width:100%;height:100%;display:block;}"
        ].join("\n");
        document.head.appendChild(styleEl);

        // ── Root (anchors the floating button) ──
        var root = document.createElement("div");
        root.id = "a2bot-root-" + botId;
        Object.assign(root.style, { position: "fixed", zIndex: "999999", pointerEvents: "auto" });
        positionAnchor(root, pos, "30px");
        var btn = createButton(botId, headerColor, logoUrl, botName);
        root.appendChild(btn);
        document.body.appendChild(root);

        // ── Panel — hidden, iframe preloads in background ──
        var panel = document.createElement("div");
        panel.id = "a2bot-panel-" + botId;
        Object.assign(panel.style, {
            position: "fixed", zIndex: "999998",
            borderRadius: size.fullscreen ? "0" : "16px",
            overflow: "hidden",
            boxShadow: "0 8px 40px rgba(0,0,0,.18)",
            background: "#fff",
            width: size.w, height: size.h
        });
        positionPanel(panel, pos, size);
        var iframe = document.createElement("iframe");
        iframe.src = appOrigin + "/usertest/" + botId;
        iframe.title = "A2Bot Chat";
        iframe.setAttribute("loading", "eager");
        Object.assign(iframe.style, { border: "none", width: "100%", height: "100%", display: "block" });
        panel.appendChild(iframe);
        document.body.appendChild(panel);

        // ── Recompute panel size on window resize ──
        window.addEventListener("resize", function () {
            var s = getPanelSize();
            panel.style.width = s.w;
            panel.style.height = s.h;
            panel.style.borderRadius = s.fullscreen ? "0" : "16px";
            positionPanel(panel, pos, s);
        });

        // ── Toggle on button click ──
        btn.addEventListener("click", function () {
            var open = panel.classList.contains("a2bot-open");
            panel.classList[open ? "remove" : "add"]("a2bot-open");
        });

        // ── Listen for minimize message from iframe ──
        window.addEventListener("message", function (e) {
            if (e.data && e.data.type === "A2BOT_MINIMIZE") {
                panel.classList.remove("a2bot-open");
            }
        });
    }

    // ─── Position helpers ──────────────────────────────────────────────────────
    function positionAnchor(el, pos, edge) {
        el.style.left = ""; el.style.right = ""; el.style.bottom = edge; el.style.transform = "";
        if (pos === "left")        { el.style.left  = edge; }
        else if (pos === "center") { el.style.left  = "50%"; el.style.transform = "translateX(-50%)"; }
        else                       { el.style.right = edge; }
    }

    function positionPanel(panel, pos, size) {
        panel.style.left = ""; panel.style.right = ""; panel.style.transform = "";
        panel.style.top  = ""; panel.style.bottom = "";
        if (size.fullscreen) {
            Object.assign(panel.style, { top: "0", left: "0", right: "0", bottom: "0", width: "100%", height: "100%" });
            return;
        }
        panel.style.bottom = "110px";
        if (pos === "left")        { panel.style.left  = "20px"; }
        else if (pos === "center") { panel.style.left  = "50%"; panel.style.transform = "translateX(-50%)"; }
        else                       { panel.style.right = "20px"; }
    }

    // ─── Create floating button element ───────────────────────────────────────
    function createButton(botId, headerColor, logoUrl, botName) {
        var btn = document.createElement("div");
        btn.id = "a2bot-btn-" + botId;
        Object.assign(btn.style, {
            width: "60px", height: "60px", borderRadius: "50%",
            boxShadow: "0 6px 20px rgba(0,0,0,.15)", cursor: "pointer",
            overflow: "hidden", display: "flex", alignItems: "center",
            justifyContent: "center", background: headerColor
        });
        setButtonContent(btn, logoUrl, botName);
        return btn;
    }

    // ─── Patch button + panel position after API responds ─────────────────────
    function patchWidget(layout, appOrigin, botId) {
        layout = layout || {};
        var pos = layout.botPosition || "right";
        var headerColor = (layout.themeColors || {}).header || "#005f73";
        var logoUrl = layout.companyLogo || layout.avatar || "";
        var botName = layout.botName || "Chatbot";

        // Update button
        var btn = document.getElementById("a2bot-btn-" + botId);
        if (btn) { btn.style.background = headerColor; setButtonContent(btn, logoUrl, botName); }

        // Update root position
        var root = document.getElementById("a2bot-root-" + botId);
        if (root) positionAnchor(root, pos, "30px");

        // Update panel position + transform-origin in CSS
        var panel = document.getElementById("a2bot-panel-" + botId);
        if (panel) positionPanel(panel, pos, getPanelSize());

        var styleEl = document.getElementById("a2bot-style-" + botId);
        if (styleEl) {
            var origin = (pos === "left") ? "bottom left" : (pos === "center") ? "bottom center" : "bottom right";
            styleEl.textContent = styleEl.textContent.replace(/transform-origin:[^;]+;/, "transform-origin:" + origin + ";");
        }
    }

    // ─── Set button logo or initial letter ────────────────────────────────────
    function setButtonContent(btn, logoUrl, botName) {
        btn.innerHTML = "";
        if (logoUrl) {
            var img = document.createElement("img");
            img.src = logoUrl; img.alt = botName;
            Object.assign(img.style, { width: "52px", height: "52px", objectFit: "cover", borderRadius: "50%" });
            btn.appendChild(img);
        } else {
            var span = document.createElement("span");
            span.textContent = (botName || "C").charAt(0).toUpperCase();
            Object.assign(span.style, {
                color: "#fff", fontSize: "24px", fontWeight: "700",
                fontFamily: "sans-serif", lineHeight: "1", userSelect: "none"
            });
            btn.appendChild(span);
        }
    }
})();
