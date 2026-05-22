import React from "react";
import { Box, Typography, Slider } from "@mui/material";

const SectionCard = ({ title, desc, children }) => (
  <Box sx={{
    bgcolor: "#f9fafb", borderRadius: 2.5, p: 2.5, mb: 2,
    border: "1px solid #f3f4f6",
    "&:hover": { borderColor: "#e5e7eb", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" },
  }}>
    <Typography sx={{ fontWeight: 700, fontSize: 14, color: "#111827", mb: 0.2 }}>{title}</Typography>
    {desc && <Typography sx={{ fontSize: 11, color: "#9ca3af", mb: 1.5 }}>{desc}</Typography>}
    {children}
  </Box>
);

const botPositions = [
  { key: "right", justify: "flex-end", align: "flex-end", label: "Right" },
  { key: "center", justify: "center", align: "flex-end", label: "Center" },
  { key: "left", justify: "flex-start", align: "flex-end", label: "Left" },
];

const LayoutSettings = ({ botPosition, setBotPosition, selectedBubbleStyle, setSelectedBubbleStyle, borderRadius, setBorderRadius, textAlign, setTextAlign }) => (
  <div>
    <SectionCard title="Bot Position" desc="Choose where the chat widget appears on the page.">
      <Box sx={{ display: "flex", gap: 1.5, mt: 1 }}>
        {botPositions.map((pos) => {
          const sel = botPosition === pos.key;
          return (
            <Box key={pos.key} onClick={() => setBotPosition(pos.key)} sx={{
              flex: 1, height: 48, bgcolor: "#374151", borderRadius: 2,
              display: "flex", justifyContent: pos.justify, alignItems: pos.align,
              p: 0.5, cursor: "pointer", transition: "all 0.2s",
              border: sel ? "2px solid #6366f1" : "2px solid transparent",
              boxShadow: sel ? "0 0 0 3px #6366f130" : "none",
              "&:hover": { opacity: 0.85 },
            }}>
              <Box sx={{ width: 14, height: 14, bgcolor: "#fff", borderRadius: "3px" }} />
            </Box>
          );
        })}
      </Box>
      <Box sx={{ display: "flex", gap: 1.5, mt: 0.5 }}>
        {botPositions.map((pos) => (
          <Typography key={pos.key} sx={{ flex: 1, textAlign: "center", fontSize: 11, fontWeight: botPosition === pos.key ? 700 : 500, color: botPosition === pos.key ? "#6366f1" : "#9ca3af" }}>
            {pos.label}
          </Typography>
        ))}
      </Box>
    </SectionCard>

    <SectionCard title="Bubble Style" desc="Choose the shape of message bubbles.">
      <Box sx={{ display: "flex", gap: 1.5, mt: 1 }}>
        {[
          { key: "style1", radius: "8px" },
          { key: "style2", radius: "20px" },
          { key: "style3", radius: "12px 12px 12px 0" },
        ].map((style) => {
          const sel = selectedBubbleStyle === style.key;
          return (
            <Box key={style.key} onClick={() => setSelectedBubbleStyle(style.key)} sx={{
              flex: 1, p: 1.5, bgcolor: sel ? "#6366f112" : "#f3f4f6",
              borderRadius: 2, cursor: "pointer", textAlign: "center", transition: "all 0.2s",
              border: sel ? "2px solid #6366f1" : "1px solid #e5e7eb",
              "&:hover": { borderColor: "#c7d2fe" },
            }}>
              <Box sx={{
                bgcolor: "#6366f1", color: "#fff", px: 1.5, py: 0.8,
                borderRadius: style.radius, fontSize: 13, fontWeight: 600, display: "inline-block",
              }}>
                Hi!
              </Box>
            </Box>
          );
        })}
      </Box>
    </SectionCard>

    <SectionCard title="Option Border Radius" desc="Adjust the roundness of option buttons.">
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 1 }}>
        <Slider value={borderRadius} onChange={(e, val) => setBorderRadius(val)} min={0} max={50}
          sx={{ flex: 1, color: "#6366f1", "& .MuiSlider-thumb": { width: 16, height: 16 } }} />
        <Box sx={{
          width: 48, height: 36, bgcolor: "#6366f1", borderRadius: `${borderRadius}px`,
          transition: "border-radius 0.2s", flexShrink: 0,
        }} />
      </Box>
    </SectionCard>

    <SectionCard title="Button Text Alignment" desc="Align text inside option buttons.">
      <Box sx={{ display: "flex", gap: 1.5, mt: 1 }}>
        {["left", "center", "right"].map((align) => {
          const sel = textAlign === align;
          return (
            <Box key={align} onClick={() => setTextAlign(align)} sx={{
              flex: 1, py: 1, px: 1.5, bgcolor: sel ? "#6366f1" : "#f3f4f6",
              color: sel ? "#fff" : "#374151", cursor: "pointer", textAlign: align,
              fontWeight: 600, fontSize: 13, transition: "all 0.2s",
              border: sel ? "none" : "1px solid #e5e7eb",
              borderRadius: `${borderRadius}px`,
              "&:hover": { bgcolor: sel ? "#4f46e5" : "#e5e7eb" },
            }}>
              Hi
            </Box>
          );
        })}
      </Box>
    </SectionCard>
  </div>
);

export default LayoutSettings;
