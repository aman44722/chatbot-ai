import React from "react";

const labelStyle = {
  display: "flex",
  alignItems: "center",
  fontSize: "13px",
  color: "#999",
  marginBottom: "6px",
  gap: "4px",
  fontWeight: 600,
};

const inputStyle = {
  width: "100%",
  padding: "10px 12px",
  border: "1px solid #ddd",
  borderRadius: "8px",
  fontSize: "14px",
  outline: "none",
  boxSizing: "border-box",
};

const InfoIcon = () => (
  <span style={{ fontSize: "12px", color: "#aaa", cursor: "help" }}>ⓘ</span>
);

const TextSettings = ({
  botName,
  setBotName,
  welcomeText,
  setWelcomeText,
  description,
  setDescription,
  font,
  setFont,
  fontSize,
  setFontSize,
}) => {
  return (
    <div
      style={{
        marginTop: "40px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      {/* Bot Name */}
      <div>
        <label style={labelStyle}>
          Bot Name <InfoIcon />
        </label>
        <input
          type="text"
          value={botName}
          onChange={(e) => setBotName(e.target.value)}
          style={inputStyle}
        />
      </div>

      {/* Welcome Text */}
      <div>
        <label style={labelStyle}>
          Welcome Text <InfoIcon />
        </label>
        <input
          type="text"
          value={welcomeText}
          onChange={(e) => setWelcomeText(e.target.value)}
          style={inputStyle}
        />
      </div>

      {/* Bot Description */}
      <div>
        <label style={labelStyle}>
          Bot Description <InfoIcon />
        </label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={inputStyle}
        />
      </div>

      {/* Font and Font Size */}
      <div style={{ display: "flex", gap: "10px" }}>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>Choose a Font</label>
          <input
            type="text"
            value={font}
            onChange={(e) => setFont(e.target.value)}
            style={inputStyle}
          />
        </div>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>Font Size</label>
          <select
            value={fontSize}
            onChange={(e) => setFontSize(e.target.value)}
            style={inputStyle}
          >
            <option value="14px">14px</option>
            <option value="16px">16px</option>
            <option value="18px">18px</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default TextSettings;
