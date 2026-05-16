import React, { useState, useRef } from "react";
import { RgbaColorPicker } from "react-colorful";

const ThemeSettings = ({
  themeColors,
  setThemeColors,
  overlayOpacity,
  setOverlayOpacity,
  chatColor,
  setChatColor,
  uploadedImage,
  setUploadedImage,
}) => {
  const [selectedTab, setSelectedTab] = useState("Gradient");
  const [selectedTheme, setSelectedTheme] = useState(themeColors.header);
  const [showDropdown, setShowDropdown] = useState(false);
  const [hovered, setHovered] = useState(false);
  const fileInputRef = useRef(null);

  const themePresets = [
    {
      title: "Purple",
      colors: ["#BD7FF5", "#ffffff", "#F1F1F1", "#3375B3", "#3375B3"],
    },
    {
      title: "Blue",
      colors: ["#505DD3", "#ffffff", "#F8F8F8", "#0076FF", "0076FF"],
    },
    {
      title: "Orange",
      colors: ["#FFBD36", "#F9F9F9", "#F3F3F3", "#212E3F", "#212E3F"],
    },
    {
      title: "Black",
      colors: ["#000000", "#ffffff", "#E1E0E1", "#AA1E0D", "#AA1E0D"],
    },
    {
      title: "Plain White",
      colors: ["#ffffff", "#ffffff", "#11999E", "#F0EEEE", "#F0EEEE"],
    },
    {
      title: "Mixed",
      colors: ["#434343", "#ffffff", "#298FCA", "#00A0F6", "#00A0F6"],
    },
  ];

  const gradientPresets = [
    "linear-gradient(45deg, #00ff87, #60efff)",
    "linear-gradient(45deg, #0061ff, #60efff)",
    "linear-gradient(45deg, #ff1b6b, #45caff)",
    "linear-gradient(45deg, #40c9ff, #e81cff)",
    "linear-gradient(45deg, #ff930f, #fff95b)",
    "linear-gradient(45deg, #ff0f7b, #f89b29)",
    "linear-gradient(45deg, #bf0fff, #cbff49)",
    "linear-gradient(45deg, #696eff, #f8acff)",
    "linear-gradient(45deg, #a9ff68, #ff8989)",
    "linear-gradient(45deg, #595cff, #c6f8ff)",
    "linear-gradient(45deg, #ffa585, #ffeda0)",
    "linear-gradient(45deg, #84ffc9, #aab2ff, #eca0ff)",
    "linear-gradient(45deg, #ef709b, #fa9372)",
    "linear-gradient(45deg, #b2ef91, #fa9372)",
    "linear-gradient(45deg, #9bf8f4, #6f7bf7)",
    "linear-gradient(45deg, #f9c58d, #f492f0)",
    "linear-gradient(45deg, #f492f0, #a18dce)",
    "linear-gradient(45deg, #f9b16e, #f68080)",
    "linear-gradient(45deg, #9bafd9, #103783)",
    "linear-gradient(45deg, #fbd07c, #f7f779)",
    "linear-gradient(45deg, #c5f9d7, #f7d486, #f27a7d)",
    "linear-gradient(45deg, #ebf4f5, #b5c6e0)",
    "linear-gradient(45deg, #f6d5f7, #fbe9d7)",
    "linear-gradient(45deg, #432371, #faae7b)",
    "linear-gradient(45deg, #e9b7ce, #d3f3f1)",
    "linear-gradient(45deg, #439cfb, #f187fb)",
    "linear-gradient(45deg, #1dbde6, #f1515e)",
    "linear-gradient(45deg, #57ebde, #aefb2a)",
    "linear-gradient(45deg, #42047e, #07f49e)",
    "linear-gradient(45deg, #f4f269, #5cb270)",
    "linear-gradient(45deg, #b190ba, #e8b595)",
    "linear-gradient(45deg, #b597f6, #96c6ea)",
    "linear-gradient(45deg, #c9def4, #f5ccd4, #b8a4c9)",
    "linear-gradient(45deg, #7c65a9, #96d4ca)",
    "linear-gradient(45deg, #f6cfbe, #b9dcf2)",
    "linear-gradient(45deg, #caefd7, #f5bfd7, #abc9e9)",
    "linear-gradient(45deg, #9fccfa, #0974f1)",
    "linear-gradient(45deg, #ffb88e, #ea5753)",
    "linear-gradient(45deg, #d397fa, #8364e8)",
    "linear-gradient(45deg, #8de9d5, #32c4c0)",
    "linear-gradient(45deg, #f5e6ad, #f13c77)",
    "linear-gradient(45deg, #82f4b1, #30c67c)",
    "linear-gradient(45deg, #d4acfb, #b84fce)",
    "linear-gradient(45deg, #f7ba2c, #ea5459)",
    "linear-gradient(45deg, #61f4de, #6e78ff)",
    "linear-gradient(45deg, #ffcb6b, #3d8bff)",
    "linear-gradient(45deg, #a8f368, #f9035e)",
    "linear-gradient(45deg, #f5c900, #183182)",
    "linear-gradient(45deg, #ffcf67, #d3321d)",
    "linear-gradient(45deg, #95f9c3, #0b3866)",
    "linear-gradient(45deg, #4dc9e6, #210cae)",
    "linear-gradient(45deg, #eeb86d, #9946b2)",
    "linear-gradient(45deg, #d9cf79, #5612d6)",
    "linear-gradient(45deg, #e2db1f, #ae10f9)",
  ];

  const backgroundImages = [
    "https://custpostimages.s3.ap-south-1.amazonaws.com/ss_images/bot_background_1.png",
    "https://custpostimages.s3.ap-south-1.amazonaws.com/ss_images/bot_background_2.png",
    "https://custpostimages.s3.ap-south-1.amazonaws.com/ss_images/bot_background_3.png",
    "https://custpostimages.s3.ap-south-1.amazonaws.com/ss_images/bot_background_4.png",
    "https://custpostimages.s3.ap-south-1.amazonaws.com/ss_images/bot_background_5.png",
  ];

  return (
    <div style={{ marginTop: "40px" }}>
      <label style={{ fontWeight: 600, fontSize: "14px", color: "#555" }}>
        Choose a theme <span title="Choose your preferred theme">ℹ️</span>
      </label>

      <div
        onClick={() => setShowDropdown(!showDropdown)}
        style={{ position: "relative", marginTop: "10px", cursor: "pointer" }}
      >
        <div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            display: "flex",
            gap: "10px",
            padding: "5px 10px",
            border: "1px solid #ddd",
            borderRadius: "8px",
            alignItems: "center",
            justifyContent: "space-around",
            background: hovered ? "#F1EFEC" : "#f7f7f7",
            transition: "background 0.3s ease",
          }}
        >
          {[
            themeColors.header,
            themeColors.question,
            themeColors.answer,
            themeColors.option,
            themeColors.optionBorder,
          ].map((color, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedTheme(color)}
              style={{
                width: "20px",
                height: "20px",
                borderRadius: "6px",
                backgroundColor: color,
                cursor: "pointer",
                border:
                  selectedTheme === color
                    ? "2px solid #007bff"
                    : "2px solid #ccc",
              }}
            />
          ))}

          <div
            onClick={() => setShowDropdown(!showDropdown)}
            style={{
              width: 0,
              height: 0,
              borderLeft: "6px solid transparent",
              borderRight: "6px solid transparent",
              borderTop: "6px solid #333",
              cursor: "pointer",
            }}
          />
        </div>

        {showDropdown && (
          <div
            style={{
              position: "absolute",
              top: "100%",
              left: "10%",
              marginTop: "10px",
              width: "70%",
              background: "#fff",
              border: "1px solid #ddd",
              borderRadius: "8px",
              boxShadow: "0px 4px 20px #d8d8d8",
              padding: "15px 20px",
              zIndex: 10,
              fontSize: "13px",
              height: "40vh",
              overflowY: "scroll",
              scrollbarWidth: "thin",
            }}
          >
            {themePresets.map((theme, idx) => (
              <div key={idx} style={{ marginBottom: "20px" }}>
                <div style={{ marginBottom: "8px" }}>{theme.title}</div>
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    justifyContent: "space-evenly",
                    border: "1px solid rgba(221, 221, 221, 0.5)",
                    borderRadius: "10px",
                    padding: "10px",
                  }}
                >
                  {theme.colors.map((color, i) => (
                    <div
                      key={i}
                      onClick={() =>
                        setThemeColors({
                          header: theme.colors[0],
                          question: theme.colors[1],
                          answer: theme.colors[2],
                          option: theme.colors[3],
                          optionBorder: theme.colors[4],
                          chatBackground:
                            themeColors.chatBackground || "#ffffff",
                        })
                      }
                      style={{
                        width: "20px",
                        height: "20px",
                        backgroundColor: color,
                        borderRadius: "6px",
                        border:
                          selectedTheme === color
                            ? "2px solid #007bff"
                            : "2px solid #ccc",
                        cursor: "pointer",
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Header Background Picker */}
      {["header", "question", "answer", "option", "optionBorder"].map(
        (key, idx) => (
          <div
            key={idx}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              margin: "15px 0",
            }}
          >
            <label style={{ textTransform: "capitalize" }}>
              {key.replace("optionBorder", "Option Border")} Background
            </label>
            <input
              type="color"
              value={themeColors[key]}
              onChange={(e) =>
                setThemeColors({ ...themeColors, [key]: e.target.value })
              }
              style={{ width: "40px", height: "30px" }}
            />
          </div>
        )
      )}

      {/* Chat Background Tab Switch */}
      <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
        {["Gradient", "Color", "Image"].map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            style={{
              border: "1px solid #ccc",
              flex: 1,
              height: "40px",
              borderRadius: "10px",
              backgroundColor: selectedTab === tab ? "#4F46E5" : "#fff",
              color: selectedTab === tab ? "#fff" : "#000",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Chat Background Content */}
      {selectedTab === "Gradient" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: "10px",
            marginTop: "20px",
            height: "50vh",
            overflowY: "scroll",
          }}
        >
          {gradientPresets.map((gradient, idx) => (
            <div
              key={idx}
              onClick={() =>
                setThemeColors({ ...themeColors, chatBackground: gradient })
              }
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: gradient,
                cursor: "pointer",
                border:
                  themeColors.chatBackground === gradient
                    ? "3px solid #4F46E5"
                    : "1px solid #ccc",
              }}
            />
          ))}
        </div>
      )}

      {selectedTab === "Color" && (
        <div style={{ marginTop: "20px" }}>
          <RgbaColorPicker
            color={chatColor}
            onChange={(newColor) => {
              setChatColor(newColor);
              setThemeColors({
                ...themeColors,
                chatBackground: `rgba(${newColor.r},${newColor.g},${newColor.b},${newColor.a})`,
              });
            }}
            style={{ width: "100%" }}
          />
          <p style={{ textAlign: "center", fontWeight: 500 }}>
            rgba({chatColor.r}, {chatColor.g}, {chatColor.b}, {chatColor.a})
          </p>
        </div>
      )}

      {selectedTab === "Image" && (
        <div style={{ marginTop: "20px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "10px",
              height: "30vh",
              overflowY: "scroll",
              overflowX: "hidden",
              scrollbarWidth: "thin",
            }}
          >
            {backgroundImages.map((img, idx) => (
              <img
                key={idx}
                src={img}
                onClick={() =>
                  setThemeColors({
                    ...themeColors,
                    chatBackground: `url(${img})`,
                  })
                }
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "6px",
                  border:
                    themeColors.chatBackground === `url(${img})`
                      ? "3px solid #4F46E5"
                      : "1px solid #ccc",
                  cursor: "pointer",
                }}
              />
            ))}
            {uploadedImage && (
              <img
                src={uploadedImage}
                onClick={() =>
                  setThemeColors({
                    ...themeColors,
                    chatBackground: `url(${uploadedImage})`,
                  })
                }
                style={{
                  width: "100%",
                  height: "60px",
                  objectFit: "cover",
                  borderRadius: "6px",
                  border:
                    themeColors.chatBackground === `url(${uploadedImage})`
                      ? "3px solid #4F46E5"
                      : "1px solid #ccc",
                  cursor: "pointer",
                }}
              />
            )}
          </div>

          <div style={{ marginTop: "15px", textAlign: "center" }}>
            <button
              onClick={() => fileInputRef.current.click()}
              style={{
                padding: "8px 16px",
                backgroundColor: "#4F46E5",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                fontWeight: "500",
                cursor: "pointer",
              }}
            >
              Upload Image
            </button>
            <p style={{ fontSize: "12px", color: "#888", marginTop: "5px" }}>
              File Size should be less than 5 MB <br />{" "}
              <span> Image Must Be 380*585 </span>
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => {
                const file = e.target.files[0];
                if (file && file.size < 5 * 1024 * 1024) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setUploadedImage(reader.result);
                    setThemeColors({
                      ...themeColors,
                      chatBackground: `url(${reader.result})`,
                    });
                  };
                  reader.readAsDataURL(file);
                } else {
                  alert("Image must be less than 5MB");
                }
              }}
            />
          </div>

          {/* Overlay Slider */}
          <div style={{ marginTop: "20px" }}>
            <label style={{ fontWeight: 500 }}>
              Overlay Opacity ({overlayOpacity}%)
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={overlayOpacity}
              onChange={(e) => setOverlayOpacity(Number(e.target.value))}
              style={{ width: "100%" }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeSettings;
