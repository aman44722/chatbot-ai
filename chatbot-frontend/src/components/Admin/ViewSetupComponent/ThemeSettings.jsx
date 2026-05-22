import React, { useState, useRef } from "react";
import { Box, Typography, Slider, Button } from "@mui/material";
import { RgbaColorPicker } from "react-colorful";

const SectionCard = ({ title, desc, children, noHover }) => (
  <Box sx={{
    bgcolor: "#f9fafb", borderRadius: 2.5, p: 1.5, mb: 1.5,
    border: "1px solid #f3f4f6",
  }}>
    <Typography sx={{ fontWeight: 700, fontSize: 13, color: "#111827", mb: 0.1 }}>{title}</Typography>
    {desc && <Typography sx={{ fontSize: 11, color: "#9ca3af", mb: 1 }}>{desc}</Typography>}
    {children}
  </Box>
);

const themePresets = [
  { title: "Purple", colors: ["#BD7FF5", "#ffffff", "#F1F1F1", "#3375B3", "#3375B3"] },
  { title: "Blue", colors: ["#505DD3", "#ffffff", "#F8F8F8", "#0076FF", "#0076FF"] },
  { title: "Orange", colors: ["#FFBD36", "#F9F9F9", "#F3F3F3", "#212E3F", "#212E3F"] },
  { title: "Black", colors: ["#000000", "#ffffff", "#E1E0E1", "#AA1E0D", "#AA1E0D"] },
  { title: "Plain White", colors: ["#ffffff", "#ffffff", "#11999E", "#F0EEEE", "#F0EEEE"] },
  { title: "Mixed", colors: ["#434343", "#ffffff", "#298FCA", "#00A0F6", "#00A0F6"] },
];

const gradientPresets = [
  "linear-gradient(45deg, #00ff87, #60efff)", "linear-gradient(45deg, #0061ff, #60efff)",
  "linear-gradient(45deg, #ff1b6b, #45caff)", "linear-gradient(45deg, #40c9ff, #e81cff)",
  "linear-gradient(45deg, #ff930f, #fff95b)", "linear-gradient(45deg, #ff0f7b, #f89b29)",
  "linear-gradient(45deg, #bf0fff, #cbff49)", "linear-gradient(45deg, #696eff, #f8acff)",
  "linear-gradient(45deg, #a9ff68, #ff8989)", "linear-gradient(45deg, #595cff, #c6f8ff)",
  "linear-gradient(45deg, #ffa585, #ffeda0)", "linear-gradient(45deg, #84ffc9, #aab2ff, #eca0ff)",
  "linear-gradient(45deg, #ef709b, #fa9372)", "linear-gradient(45deg, #b2ef91, #fa9372)",
  "linear-gradient(45deg, #9bf8f4, #6f7bf7)", "linear-gradient(45deg, #f9c58d, #f492f0)",
  "linear-gradient(45deg, #f492f0, #a18dce)", "linear-gradient(45deg, #f9b16e, #f68080)",
  "linear-gradient(45deg, #9bafd9, #103783)", "linear-gradient(45deg, #fbd07c, #f7f779)",
  "linear-gradient(45deg, #c5f9d7, #f7d486, #f27a7d)", "linear-gradient(45deg, #ebf4f5, #b5c6e0)",
  "linear-gradient(45deg, #f6d5f7, #fbe9d7)", "linear-gradient(45deg, #432371, #faae7b)",
  "linear-gradient(45deg, #e9b7ce, #d3f3f1)", "linear-gradient(45deg, #439cfb, #f187fb)",
  "linear-gradient(45deg, #1dbde6, #f1515e)", "linear-gradient(45deg, #57ebde, #aefb2a)",
  "linear-gradient(45deg, #42047e, #07f49e)", "linear-gradient(45deg, #f4f269, #5cb270)",
  "linear-gradient(45deg, #b190ba, #e8b595)", "linear-gradient(45deg, #b597f6, #96c6ea)",
  "linear-gradient(45deg, #c9def4, #f5ccd4, #b8a4c9)", "linear-gradient(45deg, #7c65a9, #96d4ca)",
  "linear-gradient(45deg, #f6cfbe, #b9dcf2)", "linear-gradient(45deg, #caefd7, #f5bfd7, #abc9e9)",
  "linear-gradient(45deg, #9fccfa, #0974f1)", "linear-gradient(45deg, #ffb88e, #ea5753)",
  "linear-gradient(45deg, #d397fa, #8364e8)", "linear-gradient(45deg, #8de9d5, #32c4c0)",
  "linear-gradient(45deg, #f5e6ad, #f13c77)", "linear-gradient(45deg, #82f4b1, #30c67c)",
  "linear-gradient(45deg, #d4acfb, #b84fce)", "linear-gradient(45deg, #f7ba2c, #ea5459)",
  "linear-gradient(45deg, #61f4de, #6e78ff)", "linear-gradient(45deg, #ffcb6b, #3d8bff)",
  "linear-gradient(45deg, #a8f368, #f9035e)", "linear-gradient(45deg, #f5c900, #183182)",
  "linear-gradient(45deg, #ffcf67, #d3321d)", "linear-gradient(45deg, #95f9c3, #0b3866)",
  "linear-gradient(45deg, #4dc9e6, #210cae)", "linear-gradient(45deg, #eeb86d, #9946b2)",
  "linear-gradient(45deg, #d9cf79, #5612d6)", "linear-gradient(45deg, #e2db1f, #ae10f9)",
];

const backgroundImages = [
  "https://custpostimages.s3.ap-south-1.amazonaws.com/ss_images/bot_background_1.png",
  "https://custpostimages.s3.ap-south-1.amazonaws.com/ss_images/bot_background_2.png",
  "https://custpostimages.s3.ap-south-1.amazonaws.com/ss_images/bot_background_3.png",
  "https://custpostimages.s3.ap-south-1.amazonaws.com/ss_images/bot_background_4.png",
  "https://custpostimages.s3.ap-south-1.amazonaws.com/ss_images/bot_background_5.png",
];

const colorLabels = {
  header: "Header Background",
  question: "Question Bubble",
  answer: "Answer Bubble",
  option: "Option Button",
  optionBorder: "Option Border",
};

const ThemeSettings = ({ themeColors, setThemeColors, overlayOpacity, setOverlayOpacity, chatColor, setChatColor, uploadedImage, setUploadedImage }) => {
  const [selectedTab, setSelectedTab] = useState("Gradient");
  const [showDropdown, setShowDropdown] = useState(false);
  const [hovered, setHovered] = useState(false);
  const fileInputRef = useRef(null);

  return (
    <div>
      <SectionCard title="Theme Presets" desc="Choose a pre-built color theme.">
        <Box sx={{ position: "relative", mt: 0.5 }}>
          <Box onClick={() => setShowDropdown(!showDropdown)}
            onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
            sx={{
              display: "flex", gap: 1, p: 1, borderRadius: 1.5, cursor: "pointer",
              bgcolor: hovered ? "#f3f4f6" : "#fff", border: "1px solid #e5e7eb",
              alignItems: "center", transition: "all 0.2s",
            }}>
            {["header", "question", "answer", "option", "optionBorder"].map((key) => (
              <Box key={key} sx={{ width: 18, height: 18, borderRadius: "5px", bgcolor: themeColors[key], border: "2px solid #e5e7eb" }} />
            ))}
            <Box sx={{ ml: "auto", width: 0, height: 0, borderLeft: "5px solid transparent", borderRight: "5px solid transparent", borderTop: "5px solid #6b7280" }} />
          </Box>

          {showDropdown && (
            <Box sx={{
              position: "absolute", top: "100%", left: 0, right: 0, mt: 1, zIndex: 10,
              bgcolor: "#fff", border: "1px solid #e5e7eb", borderRadius: 1.5,
              boxShadow: "0 8px 24px rgba(0,0,0,0.08)", p: 1.5, maxHeight: 280, overflowY: "auto",
            }}>
              {themePresets.map((theme, idx) => (
                <Box key={idx} sx={{ mb: 1 }}>
                  <Typography sx={{ fontSize: 11, fontWeight: 600, color: "#6b7280", mb: 0.3 }}>{theme.title}</Typography>
                  <Box onClick={() => setThemeColors({
                    header: theme.colors[0], question: theme.colors[1],
                    answer: theme.colors[2], option: theme.colors[3],
                    optionBorder: theme.colors[4], chatBackground: themeColors.chatBackground || "#ffffff",
                  })} sx={{ display: "flex", gap: 0.8, p: 0.8, borderRadius: 1, border: "1px solid #f3f4f6", cursor: "pointer", "&:hover": { bgcolor: "#f9fafb" } }}>
                    {theme.colors.map((color, i) => (
                      <Box key={i} sx={{ width: 20, height: 20, borderRadius: "5px", bgcolor: color, border: "1px solid #e5e7eb" }} />
                    ))}
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </SectionCard>

      <SectionCard title="Custom Colors" desc="Fine-tune each element color.">
        {["header", "question", "answer", "option", "optionBorder"].map((key) => (
          <Box key={key} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", py: 0.6 }}>
            <Typography sx={{ fontSize: 11, fontWeight: 500, color: "#374151" }}>{colorLabels[key]}</Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Typography sx={{ fontSize: 10, color: "#9ca3af", fontFamily: "monospace" }}>{themeColors[key]}</Typography>
              <input type="color" value={themeColors[key]}
                onChange={(e) => setThemeColors({ ...themeColors, [key]: e.target.value })}
                style={{ width: 30, height: 26, borderRadius: "5px", border: "1px solid #e5e7eb", cursor: "pointer", padding: 0 }} />
            </Box>
          </Box>
        ))}
      </SectionCard>

      <SectionCard title="Chat Background" desc="Background style for the chat area.">
        <Box sx={{ display: "flex", gap: 0.5, mb: 1.5 }}>
          {["Gradient", "Color", "Image"].map((tab) => {
            const sel = selectedTab === tab;
            return (
              <Button key={tab} onClick={() => setSelectedTab(tab)} size="small"
                sx={{
                  flex: 1, borderRadius: 1.5, textTransform: "none", fontWeight: 600, fontSize: 11, minWidth: 0, px: 0.5,
                  bgcolor: sel ? "#6366f1" : "#f3f4f6", color: sel ? "#fff" : "#6b7280",
                  "&:hover": { bgcolor: sel ? "#4f46e5" : "#e5e7eb" },
                }}>
                {tab}
              </Button>
            );
          })}
        </Box>

        {selectedTab === "Gradient" && (
          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 0.8, maxHeight: 200, overflowY: "auto" }}>
            {gradientPresets.map((gradient, idx) => {
              const sel = themeColors.chatBackground === gradient;
              return (
                <Box key={idx} onClick={() => setThemeColors({ ...themeColors, chatBackground: gradient })}
                  sx={{ width: "100%", pb: "100%", borderRadius: "50%", background: gradient, cursor: "pointer", position: "relative",
                    border: sel ? "2.5px solid #6366f1" : "1px solid #e5e7eb", transition: "all 0.2s",
                    "&:hover": { transform: "scale(1.08)" },
                  }} />
              );
            })}
          </Box>
        )}

        {selectedTab === "Color" && (
          <Box>
            <RgbaColorPicker color={chatColor}
              onChange={(newColor) => {
                setChatColor(newColor);
                setThemeColors({ ...themeColors, chatBackground: `rgba(${newColor.r},${newColor.g},${newColor.b},${newColor.a})` });
              }}
              style={{ width: "100%" }} />
            <Typography sx={{ textAlign: "center", fontWeight: 500, fontSize: 11, color: "#6b7280", mt: 0.5 }}>
              rgba({chatColor.r}, {chatColor.g}, {chatColor.b}, {chatColor.a})
            </Typography>
          </Box>
        )}

        {selectedTab === "Image" && (
          <Box>
            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 0.8, maxHeight: 160, overflowY: "auto", mb: 1.5 }}>
              {backgroundImages.map((img, idx) => {
                const sel = themeColors.chatBackground === `url(${img})`;
                return (
                  <Box key={idx} onClick={() => setThemeColors({ ...themeColors, chatBackground: `url(${img})` })}
                    sx={{
                      height: 48, borderRadius: 1.5, overflow: "hidden", cursor: "pointer",
                      border: sel ? "2px solid #6366f1" : "1px solid #e5e7eb",
                    }}>
                    <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </Box>
                );
              })}
              {uploadedImage && (
                <Box onClick={() => setThemeColors({ ...themeColors, chatBackground: `url(${uploadedImage})` })}
                  sx={{
                    height: 48, borderRadius: 1.5, overflow: "hidden", cursor: "pointer",
                    border: themeColors.chatBackground === `url(${uploadedImage})` ? "2px solid #6366f1" : "1px solid #e5e7eb",
                  }}>
                  <img src={uploadedImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </Box>
              )}
            </Box>

            <Button onClick={() => fileInputRef.current.click()} variant="outlined" size="small" fullWidth
              sx={{ borderRadius: 1.5, textTransform: "none", fontWeight: 600, fontSize: 11, borderColor: "#e5e7eb", color: "#374151", "&:hover": { borderColor: "#6366f1" } }}>
              Upload Image
            </Button>
            <Typography sx={{ fontSize: 10, color: "#9ca3af", textAlign: "center", mt: 0.3 }}>
              Max 5 MB &bull; 380×585 recommended
            </Typography>
            <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }}
              onChange={(e) => {
                const file = e.target.files[0];
                if (file && file.size < 5 * 1024 * 1024) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setUploadedImage(reader.result);
                    setThemeColors({ ...themeColors, chatBackground: `url(${reader.result})` });
                  };
                  reader.readAsDataURL(file);
                } else alert("Image must be less than 5MB");
              }} />

            <Box sx={{ mt: 1.5 }}>
              <Typography sx={{ fontWeight: 500, fontSize: 11, color: "#374151", mb: 0.3 }}>
                Overlay Opacity ({overlayOpacity}%)
              </Typography>
              <Slider value={overlayOpacity} onChange={(e, val) => setOverlayOpacity(val)} min={0} max={100} size="small"
                sx={{ color: "#6366f1", "& .MuiSlider-thumb": { width: 14, height: 14 } }} />
            </Box>
          </Box>
        )}
      </SectionCard>
    </div>
  );
};

export default ThemeSettings;
