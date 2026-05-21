(function () {
    try {
        var cfg = window.A2BOT_CONFIG || {};
        if (!cfg.id) return console.warn("A2BOT: missing id in window.A2BOT_CONFIG");
        var botId = cfg.id;
        if (window.__A2BOT_INITED_FOR === botId) return;
        window.__A2BOT_INITED_FOR = botId;

        var appOrigin = cfg.origin || window.location.origin;
        if (appOrigin.slice(-1) === "/") appOrigin = appOrigin.slice(0, -1);
        var apiBase = cfg.api || appOrigin.replace(/:\d+$/, "") + ":5000/api/auth";

        // 1. Show button immediately with defaults — no API wait
        buildWidget({ headerColor: "#005f73", botName: "Chat" }, appOrigin, botId);

        // 2. Fetch real settings and patch button + iframe src
        fetch(apiBase + "/user/" + botId + "/layout-settings")
            .then(function (r) { return r.ok ? r.json() : {}; })
            .catch(function () { return {}; })
            .then(function (layout) { patchWidget(layout, appOrigin, botId); });

    } catch (e) {
        console.error("A2BOT widget error:", e);
    }

    // ─── Build widget immediately with given options ───────────────────────────
    function buildWidget(opts, appOrigin, botId) {
        var cfg = window.A2BOT_CONFIG || {};
        var pos = opts.botPosition || "right";
        var headerColor = (opts.themeColors || {}).header || opts.headerColor || "#005f73";
        var logoUrl = opts.companyLogo || opts.avatar || "";
        var botName = opts.botName || "Chatbot";

        // ── Styles ──
        var styleEl = document.createElement("style");
        styleEl.id = "a2bot-style-" + botId;
        styleEl.textContent = [
            "#a2bot-btn-" + botId + "{transition:transform .2s ease,box-shadow .2s ease;}",
            "#a2bot-btn-" + botId + ":hover{transform:scale(1.08);box-shadow:0 8px 25px rgba(0,0,0,.22);}",
            "#a2bot-panel-" + botId + "{",
            "  transition:opacity .22s ease,transform .22s ease;",
            "  opacity:0;transform:translateY(18px) scale(.96);pointer-events:none;",
            "}",
            "#a2bot-panel-" + botId + ".a2bot-open{opacity:1;transform:translateY(0) scale(1);pointer-events:auto;}",
            "#a2bot-panel-" + botId + " iframe{border:none;width:100%;height:100%;display:block;}"
        ].join("\n");
        document.head.appendChild(styleEl);

        // ── Root (positions the button) ──
        var root = document.createElement("div");
        root.id = "a2bot-root-" + botId;
        Object.assign(root.style, { position: "fixed", zIndex: "999999", pointerEvents: "auto" });
        if (pos === "left")        { root.style.left = "30px"; root.style.bottom = "30px"; }
        else if (pos === "center") { root.style.left = "50%"; root.style.transform = "translateX(-50%)"; root.style.bottom = "50px"; }
        else                       { root.style.right = "30px"; root.style.bottom = "30px"; }

        // ── Floating button ──
        var btn = document.createElement("div");
        btn.id = "a2bot-btn-" + botId;
        Object.assign(btn.style, {
            width: "64px", height: "64px", borderRadius: "50%",
            boxShadow: "0 6px 20px rgba(0,0,0,.15)", cursor: "pointer",
            overflow: "hidden", display: "flex", alignItems: "center",
            justifyContent: "center", background: headerColor
        });
        setButtonContent(btn, logoUrl, botName);
        root.appendChild(btn);
        document.body.appendChild(root);

        // ── Panel (pre-built hidden — iframe loads in background) ──
        var panel = buildPanel(botId, pos, appOrigin);
        document.body.appendChild(panel);

        // ── Toggle open/close with animation ──
        var isOpen = false;
        btn.addEventListener("click", function () {
            isOpen = !isOpen;
            if (isOpen) {
                panel.classList.add("a2bot-open");
            } else {
                panel.classList.remove("a2bot-open");
            }
        });
    }

    // ─── Build panel + preloaded iframe ───────────────────────────────────────
    function buildPanel(botId, pos, appOrigin) {
        var cfg = window.A2BOT_CONFIG || {};
        var panel = document.createElement("div");
        panel.id = "a2bot-panel-" + botId;
        Object.assign(panel.style, {
            position: "fixed", zIndex: "999998",
            width: "400px", height: "600px",
            borderRadius: "16px", overflow: "hidden",
            boxShadow: "0 8px 40px rgba(0,0,0,.18)", background: "#fff"
        });

        if (pos === "left")        { panel.style.left = "20px"; panel.style.bottom = "110px"; }
        else if (pos === "center") { panel.style.left = "50%"; panel.style.transform = "translateX(-50%)"; panel.style.bottom = "110px"; }
        else                       { panel.style.right = "20px"; panel.style.bottom = "110px"; }

        if (window.innerWidth < 480) {
            Object.assign(panel.style, {
                width: "100vw", height: "100vh",
                top: "0", left: "0", right: "0", bottom: "0",
                borderRadius: "0", transform: "none"
            });
        }

        // Iframe preloaded immediately — chat is ready before first click
        var iframe = document.createElement("iframe");
        iframe.src = appOrigin + "/usertest/" + cfg.id;
        iframe.title = "A2Bot Chat";
        iframe.setAttribute("loading", "eager");
        Object.assign(iframe.style, { border: "none", width: "100%", height: "100%", display: "block" });
        panel.appendChild(iframe);
        return panel;
    }

    // ─── Update button + iframe after API responds ─────────────────────────────
    function patchWidget(layout, appOrigin, botId) {
        layout = layout || {};
        var pos = layout.botPosition || "right";
        var headerColor = (layout.themeColors || {}).header || "#005f73";
        var logoUrl = layout.companyLogo || layout.avatar || "";
        var botName = layout.botName || "Chatbot";

        // Update button
        var btn = document.getElementById("a2bot-btn-" + botId);
        if (btn) {
            btn.style.background = headerColor;
            setButtonContent(btn, logoUrl, botName);
        }

        // Update root position if botPosition changed from default
        var root = document.getElementById("a2bot-root-" + botId);
        if (root && pos !== "right") {
            if (pos === "left")        { root.style.right = ""; root.style.left = "30px"; }
            else if (pos === "center") { root.style.right = ""; root.style.left = "50%"; root.style.transform = "translateX(-50%)"; }
        }

        // Update panel position
        var panel = document.getElementById("a2bot-panel-" + botId);
        if (panel && window.innerWidth >= 480) {
            panel.style.right = ""; panel.style.left = ""; panel.style.transform = "";
            if (pos === "left")        { panel.style.left = "20px"; panel.style.bottom = "110px"; }
            else if (pos === "center") { panel.style.left = "50%"; panel.style.transform = "translateX(-50%)"; panel.style.bottom = "110px"; }
            else                       { panel.style.right = "20px"; panel.style.bottom = "110px"; }
        }
    }

    // ─── Set button inner content (logo or letter) ─────────────────────────────
    function setButtonContent(btn, logoUrl, botName) {
        btn.innerHTML = "";
        if (logoUrl) {
            var img = document.createElement("img");
            img.src = logoUrl;
            img.alt = botName;
            Object.assign(img.style, { width: "56px", height: "56px", objectFit: "cover", borderRadius: "50%" });
            btn.appendChild(img);
        } else {
            var span = document.createElement("span");
            span.textContent = (botName || "C").charAt(0).toUpperCase();
            Object.assign(span.style, {
                color: "#fff", fontSize: "26px", fontWeight: "700",
                fontFamily: "sans-serif", lineHeight: "1", userSelect: "none"
            });
            btn.appendChild(span);
        }
    }
})();
