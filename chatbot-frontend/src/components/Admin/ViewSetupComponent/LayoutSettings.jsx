import React from "react";
import { Box, Typography, Slider } from "@mui/material";

const SectionCard = ({ title, desc, children }) => (
  <Box sx={{
    bgcolor: "#f9fafb", borderRadius: 2.5, p: 1.5, mb: 1.5,
    border: "1px solid #f3f4f6",
  }}>
    <Typography sx={{ fontWeight: 700, fontSize: 13, color: "#111827", mb: 0.1 }}>{title}</Typography>
    {desc && <Typography sx={{ fontSize: 11, color: "#9ca3af", mb: 1 }}>{desc}</Typography>}
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
    <SectionCard title="Bot Position" desc="Where the chat widget appears on the page.">
      <Box sx={{ display: "flex", gap: 1, mt: 0.5 }}>
        {botPositions.map((pos) => {
          const sel = botPosition === pos.key;
          return (
            <Box key={pos.key} onClick={() => setBotPosition(pos.key)} sx={{
              flex: 1, height: 40, bgcolor: "#374151", borderRadius: 1.5,
              display: "flex", justifyContent: pos.justify, alignItems: pos.align,
              p: 0.5, cursor: "pointer", transition: "all 0.2s",
              border: sel ? "2px solid #6366f1" : "2px solid transparent",
              boxShadow: sel ? "0 0 0 2px #6366f130" : "none",
              "&:hover": { opacity: 0.8 },
            }}>
              <Box sx={{ width: 12, height: 12, bgcolor: "#fff", borderRadius: "2px" }} />
            </Box>
          );
        })}
      </Box>
      <Typography sx={{ textAlign: "center", fontSize: 10, color: "#9ca3af", mt: 0.3 }}>
        {botPositions.find(p => p.key === botPosition)?.label || "Right"} selected
      </Typography>
    </SectionCard>

    <SectionCard title="Bubble Style" desc="Shape of message bubbles.">
      <Box sx={{ display: "flex", gap: 1, mt: 0.5 }}>
        {[
          { key: "style1", radius: "8px" },
          { key: "style2", radius: "20px" },
          { key: "style3", radius: "12px 12px 12px 0" },
        ].map((style) => {
          const sel = selectedBubbleStyle === style.key;
          return (
            <Box key={style.key} onClick={() => setSelectedBubbleStyle(style.key)} sx={{
              flex: 1, p: 1, bgcolor: sel ? "#6366f112" : "#f3f4f6",
              borderRadius: 1.5, cursor: "pointer", textAlign: "center", transition: "all 0.2s",
              border: sel ? "2px solid #6366f1" : "1px solid #e5e7eb",
              "&:hover": { borderColor: "#c7d2fe" },
            }}>
              <Box sx={{
                bgcolor: "#6366f1", color: "#fff", px: 1, py: 0.5,
                borderRadius: style.radius, fontSize: 12, fontWeight: 600, display: "inline-block",
              }}>
                Hi!
              </Box>
            </Box>
          );
        })}
      </Box>
    </SectionCard>

    <SectionCard title="Option Border Radius" desc="Roundness of option buttons.">
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mt: 0.5 }}>
        <Slider value={borderRadius} onChange={(e, val) => setBorderRadius(val)} min={0} max={50} size="small"
          sx={{ flex: 1, color: "#6366f1", "& .MuiSlider-thumb": { width: 14, height: 14 } }} />
        <Box sx={{
          width: 40, height: 30, bgcolor: "#6366f1", borderRadius: `${borderRadius}px`,
          transition: "border-radius 0.2s", flexShrink: 0,
        }} />
      </Box>
    </SectionCard>

    <SectionCard title="Button Text Alignment" desc="Align text inside option buttons.">
      <Box sx={{ display: "flex", gap: 1, mt: 0.5 }}>
        {["left", "center", "right"].map((align) => {
          const sel = textAlign === align;
          return (
            <Box key={align} onClick={() => setTextAlign(align)} sx={{
              flex: 1, py: 0.8, px: 1, bgcolor: sel ? "#6366f1" : "#f3f4f6",
              color: sel ? "#fff" : "#374151", cursor: "pointer", textAlign: align,
              fontWeight: 600, fontSize: 12, transition: "all 0.2s",
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
