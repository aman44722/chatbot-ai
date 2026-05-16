import React from "react";

const LayoutSettings = ({
  botPosition,
  setBotPosition,
  selectedBubbleStyle,
  setSelectedBubbleStyle,
  borderRadius,
  setBorderRadius,
  textAlign,
  setTextAlign,
}) => {
  const botPositions = [
    { key: "right", justify: "flex-end", alignItems: "flex-end" }, // Bottom-right
    { key: "center", justify: "end", alignItems: "center" }, // Bottom-center
    { key: "left", justify: "flex-start", alignItems: "flex-end" }, // Bottom-left
  ];

  return (
    <div style={{ marginTop: "40px" }}>
      {/* Bot Position */}
      <label style={{ fontWeight: 600, fontSize: "14px", color: "#555" }}>
        Bot Position{" "}
        <span title="Select the corner where your bot appears">ⓘ</span>
      </label>
      <div style={{ display: "flex", gap: "10px", margin: "10px 0 20px 0" }}>
        {botPositions.map((pos, idx) => (
          <div
            key={idx}
            onClick={() => setBotPosition(pos.key)}
            style={{
              width: "100%",
              height: "40px",
              background: "#444c5c",
              borderRadius: "8px",
              display: "flex",
              justifyContent: pos.justify,
              alignItems: pos.alignItems,
              padding: "5px",
              cursor: "pointer",
              border:
                botPosition === pos.key
                  ? "2px solid #4F46E5"
                  : "2px solid transparent",
            }}
          >
            <div
              style={{
                width: "12px",
                height: "12px",
                background: "#ddd",
                borderRadius: "2px",
              }}
            ></div>
          </div>
        ))}
      </div>

      {/* Message Bubble Style */}
      <label style={{ fontWeight: 600, fontSize: "14px", color: "#555" }}>
        Message Bubbles <span title="Choose your chat bubble style">ⓘ</span>
      </label>
      <div style={{ display: "flex", gap: "10px", margin: "10px 0 20px 0" }}>
        <div
          onClick={() => setSelectedBubbleStyle("style1")}
          style={{
            background: "#f1f1f1",
            padding: "5px 10px",
            borderRadius: "8px",
            width: "100%",
            cursor: "pointer",
            border:
              selectedBubbleStyle === "style1"
                ? "2px solid #4F46E5"
                : "1px solid #ccc",
          }}
        >
          Hi!
        </div>

        <div
          onClick={() => setSelectedBubbleStyle("style2")}
          style={{
            background: "#f1f1f1",
            padding: "5px 10px",
            borderRadius: "20px",
            width: "100%",
            cursor: "pointer",
            border:
              selectedBubbleStyle === "style2"
                ? "2px solid #4F46E5"
                : "1px solid #ccc",
          }}
        >
          Hi!
        </div>

        <div
          onClick={() => setSelectedBubbleStyle("style3")}
          style={{
            background: "#f1f1f1",
            padding: "5px 10px",
            borderRadius: "12px 12px 12px 0",
            width: "100%",
            cursor: "pointer",
            border:
              selectedBubbleStyle === "style3"
                ? "2px solid #4F46E5"
                : "1px solid #ccc",
          }}
        >
          Hi!
        </div>
      </div>

      {/* Option Button Border Radius */}
      <label
        style={{
          fontWeight: 600,
          fontSize: "14px",
          color: "#555",
          display: "block",
        }}
      >
        Option Border Radius{" "}
        <span title="Adjust button corner roundness">ⓘ</span>
      </label>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "40px",
          marginTop: "10px",
        }}
      >
        <input
          type="range"
          min="0"
          max="50"
          value={borderRadius}
          onChange={(e) => setBorderRadius(Number(e.target.value))}
          style={{ flex: 1 }}
        />
        <div
          style={{
            width: "26%",
            height: "40px",
            background: "#4F46E5",
            borderRadius: `${borderRadius}px`,
            transition: "border-radius 0.2s ease",
          }}
        ></div>
      </div>

      {/* Button Text Alignment */}
      <label
        style={{
          fontWeight: 600,
          fontSize: "14px",
          color: "#555",
          marginTop: "20px",
          display: "block",
        }}
      >
        Button Text Alignment <span title="Align text inside buttons">ⓘ</span>
      </label>
      <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
        {["left", "center", "right"].map((align) => (
          <button
            key={align}
            onClick={() => setTextAlign(align)}
            style={{
              flex: 1,
              padding: "10px 15px",
              background: "#4F46E5",
              color: "white",
              border: textAlign === align ? "3px solid white" : "none",
              outline:
                textAlign === align ? "3px solid rgb(163, 163, 163)" : "none",
              borderRadius: `${borderRadius}px`,
              textAlign: align,
              fontWeight: "500",
              transition: "all 0.2s ease",
              cursor: "pointer",
            }}
          >
            Hi
          </button>
        ))}
      </div>
    </div>
  );
};

export default LayoutSettings;
