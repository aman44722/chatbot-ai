// widget.js — host on CDN (e.g. https://cdn.a2bot.com/widget.js)
// Shows a floating chat icon. Click opens the full React chat UI in an iframe.
(function () {
    try {
        var cfg = window.A2BOT_CONFIG || {};
        if (!cfg.id) return console.warn("A2BOT: missing widget id in window.A2BOT_CONFIG");

        var botId = cfg.id;
        if (window.__A2BOT_INITED_FOR === botId) return;
        window.__A2BOT_INITED_FOR = botId;

        // The base URL of the React app hosting the chat UI
        var appOrigin = cfg.origin || window.location.origin;
        // Remove trailing slash
        if (appOrigin.charAt(appOrigin.length - 1) === "/") appOrigin = appOrigin.slice(0, -1);

        var apiBase = cfg.api || appOrigin.replace(/:\d+$/, "") + ":5000/api/auth";

        // Fetch bot settings from API for icon styling
        fetch(apiBase + "/user/" + botId + "/layout-settings")
            .then(function (r) { return r.ok ? r.json() : {}; })
            .catch(function () { return {}; })
            .then(function (layout) { initWidget(layout); });

    } catch (err) {
        console.error("A2BOT widget init error:", err);
    }

    function initWidget(layout) {
        layout = layout || {};

        function el(tag, attrs, style) {
            var e = document.createElement(tag);
            attrs = attrs || {};
            for (var k in attrs) {
                if (k === "text") e.textContent = attrs[k];
                else if (k === "html") e.innerHTML = attrs[k];
                else e.setAttribute(k, attrs[k]);
            }
            if (style) Object.assign(e.style, style);
            return e;
        }

        var cfg = window.A2BOT_CONFIG || {};
        var botId = cfg.id;
        var pos = layout.botPosition || "right";
        var themeColors = layout.themeColors || {};
        var headerColor = themeColors.header || "#005f73";
        var logoUrl = layout.companyLogo || layout.avatar || "";
        var botName = layout.botName || "Chatbot";
        var appOrigin = cfg.origin || window.location.origin;
        if (appOrigin.charAt(appOrigin.length - 1) === "/") appOrigin = appOrigin.slice(0, -1);

        // ---------- Inject base styles ----------
        var styleEl = el("style", { id: "a2bot-style-" + botId });
        styleEl.textContent = [
            "#a2bot-panel-" + botId + " iframe {",
            "  border: none; width: 100%; height: 100%; border-radius: 16px;",
            "  background: #fff;",
            "}",
            "#a2bot-btn-" + botId + " {",
            "  transition: transform 0.2s ease, box-shadow 0.2s ease;",
            "}",
            "#a2bot-btn-" + botId + ":hover {",
            "  transform: scale(1.08);",
            "  box-shadow: 0 8px 25px rgba(0,0,0,0.2);",
            "}",
            "#a2bot-panel-" + botId + " {",
            "  animation: a2botFadeIn 0.25s ease;",
            "}",
            "@keyframes a2botFadeIn {",
            "  from { opacity: 0; transform: translateY(12px) scale(0.96); }",
            "  to { opacity: 1; transform: translateY(0) scale(1); }",
            "}"
        ].join("\n");
        document.head.appendChild(styleEl);

        // ---------- Root container ----------
        var root = el("div", { id: "a2bot-root-" + botId }, {
            position: "fixed",
            zIndex: "999999",
            pointerEvents: "auto"
        });

        if (pos === "left") { root.style.left = "30px"; root.style.bottom = "30px"; }
        else if (pos === "center") { root.style.left = "50%"; root.style.transform = "translateX(-50%)"; root.style.bottom = "50px"; }
        else { root.style.right = "30px"; root.style.bottom = "30px"; }

        // ---------- Floating button (icon) ----------
        var btn = el("div", { id: "a2bot-btn-" + botId }, {
            width: "64px", height: "64px", borderRadius: "50%",
            boxShadow: "0 6px 20px rgba(0,0,0,0.15)", cursor: "pointer",
            overflow: "hidden", display: "flex", alignItems: "center",
            justifyContent: "center", background: headerColor
        });

        if (logoUrl) {
            var img = el("img", { src: logoUrl, alt: botName, width: "56", height: "56" }, {
                objectFit: "cover", borderRadius: "50%"
            });
            btn.appendChild(img);
        } else {
            // Fallback: show first letter
            var letter = el("span", {}, {
                color: "#fff", fontSize: "26px", fontWeight: "700",
                fontFamily: "sans-serif", lineHeight: "1"
            });
            letter.textContent = botName.charAt(0).toUpperCase();
            btn.appendChild(letter);
        }

        root.appendChild(btn);
        document.body.appendChild(root);

        // ---------- Toggle panel on click ----------
        btn.addEventListener("click", function () {
            var existing = document.getElementById("a2bot-panel-" + botId);
            if (existing) {
                // Hide/show instead of remove — React component stays mounted, state preserved
                existing.style.display = existing.style.display === "none" ? "" : "none";
                return;
            }

            // First open — create panel + iframe once
            var panel = el("div", { id: "a2bot-panel-" + botId }, {
                width: "400px", height: "600px", borderRadius: "16px",
                boxShadow: "0 8px 40px rgba(0,0,0,0.18)", overflow: "hidden",
                background: "#fff", position: "fixed", zIndex: "999999"
            });

            if (pos === "left") { panel.style.left = "20px"; panel.style.bottom = "110px"; }
            else if (pos === "center") { panel.style.left = "50%"; panel.style.transform = "translateX(-50%)"; panel.style.bottom = "110px"; }
            else { panel.style.right = "20px"; panel.style.bottom = "110px"; }

            // Responsive: on small screens, use full screen
            if (window.innerWidth < 480) {
                panel.style.width = "100vw";
                panel.style.height = "100vh";
                panel.style.right = "0";
                panel.style.bottom = "0";
                panel.style.left = "0";
                panel.style.top = "0";
                panel.style.transform = "none";
                panel.style.borderRadius = "0";
            }

            // Create an iframe that loads the full React chat UI
            var iframe = el("iframe", {
                src: appOrigin + "/usertest/" + botId,
                title: "A2Bot Chat"
            });

            panel.appendChild(iframe);
            document.body.appendChild(panel);
        });
    }
})();