// widget.js — host on CDN (e.g. https://cdn.a2bot.com/widget.js)
(function () {
    try {
        var cfg = window.A2BOT_CONFIG || {};
        if (!cfg.id) return console.warn("A2BOT: missing id");

        var botId = cfg.id;
        if (window.__A2BOT_INITED_FOR === botId) return;
        window.__A2BOT_INITED_FOR = botId;

        var apiBase = cfg.api || "http://localhost:5000/api/auth";

        // Fetch bot settings from API (keeps snippet tiny — no base64 images in HTML)
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
        var questionColor = themeColors.question || "#0076FF";
        var chatBg = themeColors.chatBackground || "#fff";
        var br = (parseInt(layout.borderRadius) || 10) + "px";
        var logoUrl = layout.companyLogo || layout.avatar || "";

        // root container
        var root = el("div", { id: "a2bot-root-" + botId }, {
            position: "fixed",
            zIndex: "999999",
            pointerEvents: "auto"
        });

        if (pos === "left") { root.style.left = "30px"; root.style.bottom = "30px"; }
        else if (pos === "center") { root.style.left = "50%"; root.style.transform = "translateX(-50%)"; root.style.bottom = "50px"; }
        else { root.style.right = "30px"; root.style.bottom = "30px"; }

        // floating button
        var btn = el("div", {}, {
            width: "64px", height: "64px", borderRadius: "50%",
            boxShadow: "0 6px 20px rgba(0,0,0,0.15)", cursor: "pointer",
            overflow: "hidden", display: "flex", alignItems: "center",
            justifyContent: "center", background: "#fff"
        });

        var img = el("img", { src: logoUrl, alt: "bot", width: "56", height: "56" }, { objectFit: "cover" });
        btn.appendChild(img);
        root.appendChild(btn);
        document.body.appendChild(root);

        btn.addEventListener("click", function () {
            var existing = document.getElementById("a2bot-panel-" + botId);
            if (existing) { existing.remove(); return; }

            var panel = el("div", { id: "a2bot-panel-" + botId }, {
                width: "360px", height: "560px", borderRadius: "12px",
                boxShadow: "0 8px 40px rgba(0,0,0,0.2)", overflow: "hidden",
                background: "#fff", position: "fixed", zIndex: "999999"
            });

            if (pos === "left") { panel.style.left = "30px"; panel.style.bottom = "110px"; }
            else if (pos === "center") { panel.style.left = "50%"; panel.style.transform = "translateX(-50%)"; panel.style.bottom = "110px"; }
            else { panel.style.right = "30px"; panel.style.bottom = "110px"; }

            // header
            var header = el("div", {}, {
                background: headerColor, color: "#fff", padding: "12px 14px",
                display: "flex", alignItems: "center", gap: "10px"
            });
            var hImg = el("img", { src: logoUrl, width: "40", height: "40" }, { borderRadius: "50%", objectFit: "cover" });
            header.appendChild(hImg);
            var titleWrap = el("div");
            var botTitle = el("div", {}, { fontWeight: "700" });
            botTitle.textContent = layout.botName || "Chatbot";
            var desc = el("div", {}, { fontSize: "12px", opacity: "0.9" });
            desc.textContent = layout.description || "";
            titleWrap.appendChild(botTitle);
            titleWrap.appendChild(desc);
            header.appendChild(titleWrap);
            panel.appendChild(header);

            // body
            var body = el("div", {}, {
                padding: "14px", height: "420px", overflow: "auto", background: chatBg
            });
            var botBubble = el("div", {}, {
                background: questionColor, color: "#fff", padding: "10px 12px",
                borderRadius: br, display: "inline-block"
            });
            botBubble.textContent = layout.welcomeText || "Hi! How can I help?";
            body.appendChild(botBubble);
            panel.appendChild(body);

            // footer
            var footer = el("div", {}, { padding: "10px", borderTop: "1px solid #eee" });
            var input = el("input", { type: "text", placeholder: "Type a message..." }, {
                width: "100%", padding: "8px", borderRadius: "8px", border: "1px solid #ddd",
                boxSizing: "border-box"
            });
            footer.appendChild(input);
            panel.appendChild(footer);

            document.body.appendChild(panel);
        });
    }
})();
