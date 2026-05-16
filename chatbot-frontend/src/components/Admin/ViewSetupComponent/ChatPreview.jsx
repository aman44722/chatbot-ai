import React from "react";

const isColorDark = (hexColor) => {
  const r = parseInt(hexColor.substr(1, 2), 16);
  const g = parseInt(hexColor.substr(3, 2), 16);
  const b = parseInt(hexColor.substr(5, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness < 128;
};

const ChatPreview = ({
  isChatOpen,
  setIsChatOpen,
  botPosition,
  welcomeText,
  companyLogo,
  botName,
  description,
  font,
  themeColors,
  avatar,
  selectedBubbleStyle,
  borderRadius,
  textAlign,
  isHeaderExpanded,
  setIsHeaderExpanded,
  overlayOpacity,
}) => {
  const textColor = isColorDark(themeColors.answer) ? "#ffffff" : "#000000";
  const textColorQuestion = isColorDark(themeColors.question)
    ? "#ffffff"
    : "#000000";
  const textColorOptions = isColorDark(themeColors.option)
    ? "#ffffff"
    : "#000000";

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        alignItems: "start",
        padding: "20px 10px",
        marginLeft: "10px",
        justifyContent: "center",
        backgroundColor: "#F6F9FF",
        boxShadow: "0px 4px 20px #dbdbdb",
        borderRadius: "10px",
        overflowY: "scroll",
        position: "relative",
      }}
    >
      {/* Show Window */}
      <div className="mock-browser-layout">
        <div style={{}}>
          <div className="browser-bar">
            <span className="dot red"></span>
            <span className="dot yellow"></span>
            <span className="dot blue"></span>
          </div>
          <div className="nav-line"></div>
          <div className="nav-line"></div>
          <div className="nav-line"></div>
          <div className="content">
            <div className="block"></div>
            <div className="block"></div>
          </div>
          <div className="footer-block"></div>

          {/* Bot Icon */}
          {!isChatOpen && (
            <div
              onClick={() => setIsChatOpen(true)}
              style={{
                position: "absolute",
                bottom: botPosition === "center" ? "50%" : "30px",
                top: botPosition === "center" ? "unset" : "auto",
                right: botPosition === "left" ? "unset" : "30px",
                left:
                  botPosition === "left"
                    ? "5%"
                    : botPosition === "center"
                      ? "unset"
                      : "auto",
                transform:
                  botPosition === "center" ? "translateY(50%)" : "none",
                backgroundColor: "transparent",
                cursor: "pointer",
                zIndex: 1000,
              }}
            >
              {welcomeText && (
                <div
                  style={{
                    position: "absolute",
                    right: "80px",
                    top: "20px",
                    backgroundColor: "#0F1C3F",
                    color: "#fff",
                    fontSize: "13px",
                    padding: "6px 12px",
                    borderRadius: "8px",
                    whiteSpace: "nowrap",
                    fontWeight: 500,
                    boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                  }}
                >
                  {welcomeText}
                </div>
              )}
              <div
                style={{
                  position: "relative",
                  borderRadius: "50%",
                  boxShadow: "0px 4px 20px #d8d8d8",
                }}
              >
                <span className="status-dot"></span>
                <img
                  src={companyLogo}
                  alt="Bot"
                  style={{ height: "70px", width: "70px", borderRadius: "50%" }}
                />
              </div>
            </div>
          )}

          {/* Chat Window */}
          {isChatOpen && (
            <div
              style={{
                position: "absolute",
                bottom: "0px",
                left: botPosition === "left" ? "30px" : "unset",
                right: botPosition === "right" ? "30px" : "unset",
                transform:
                  botPosition === "center" ? "translateX(-50%)" : "none",
                zIndex: 1000,
                transition: "all 0.3s ease-in-out",
              }}
            >
              <div
                style={{
                  width: "400px",
                  height: "75vh",
                  background: "#fff",
                  borderRadius: "10px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  fontFamily: font,
                  overflow: "scroll",
                }}
              >
                {/* Header */}
                <div
                  onClick={() => setIsHeaderExpanded(!isHeaderExpanded)}
                  style={{
                    background: themeColors.header,
                    borderRadius: "10px 10px 0 0",
                    padding: isHeaderExpanded ? "25px" : "20px 15px",
                    color: "#fff",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: isHeaderExpanded ? "column" : "row",
                    alignItems: "center",
                    justifyContent: isHeaderExpanded ? "center" : "flex-start",
                    position: "relative",
                    textAlign: "center",
                  }}
                >
                  <img
                    src={companyLogo}
                    alt="logo"
                    style={{
                      width: isHeaderExpanded ? "50px" : "30px",
                      height: isHeaderExpanded ? "50px" : "30px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      marginRight: isHeaderExpanded ? "0" : "10px",
                    }}
                  />
                  <div>
                    <h3
                      style={{
                        margin: isHeaderExpanded ? "8px 0 2px" : "0",
                        fontSize: isHeaderExpanded ? "16px" : "14px",
                        fontWeight: "bold",
                      }}
                    >
                      {botName}
                    </h3>
                    {isHeaderExpanded && (
                      <p
                        style={{
                          margin: 0,
                          fontSize: "12px",
                          color: "#e0e0e0",
                        }}
                      >
                        {description}
                      </p>
                    )}
                  </div>
                  {isHeaderExpanded && (
                    <div
                      style={{
                        position: "absolute",
                        right: "20px",
                        top: "20px",
                        display: "flex",
                        gap: "10px",
                      }}
                    >
                      <span
                        onClick={() => setIsChatOpen(false)}
                        style={{ cursor: "pointer" }}
                      >
                        ✕
                      </span>
                    </div>
                  )}
                </div>

                {/* Body */}
                <div
                  style={{
                    padding: "15px",
                    overflowY: "auto",
                    height: "61vh",
                    background: themeColors.chatBackground,
                    backgroundColor: `rgba(0,0,0,${overlayOpacity / 100})`,
                    backgroundBlendMode: "overlay",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      marginBottom: "10px",
                    }}
                  >
                    <img
                      src={avatar}
                      alt="bot"
                      style={{
                        width: "20px",
                        height: "20px",
                        marginRight: "10px",
                        borderRadius: "50%",
                      }}
                    />
                    <div
                      style={{
                        background: themeColors.question,
                        color: textColorQuestion,
                        padding: "8px 12px",
                        borderRadius: "10px",
                        fontSize: "13px",
                        ...(selectedBubbleStyle === "style1" && {
                          borderRadius: "8px",
                        }),
                        ...(selectedBubbleStyle === "style2" && {
                          borderRadius: "20px",
                        }),
                        ...(selectedBubbleStyle === "style4" && {
                          borderRadius: "12px 12px 0px 12px",
                        }),
                        ...(selectedBubbleStyle === "style3" && {
                          borderRadius: "12px 12px 12px 0px",
                        }),
                      }}
                    >
                      Bot question here
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-end",
                      justifyContent: "flex-end",
                      marginBottom: "10px",
                    }}
                  >
                    <div
                      style={{
                        background: themeColors.answer,
                        color: textColor,
                        padding: "8px 12px",
                        ...(selectedBubbleStyle === "style1" && {
                          borderRadius: "8px",
                        }),
                        ...(selectedBubbleStyle === "style2" && {
                          borderRadius: "20px",
                        }),
                        ...(selectedBubbleStyle === "style3" && {
                          borderRadius: "12px 12px 0px 12px",
                        }),
                        ...(selectedBubbleStyle === "style4" && {
                          borderRadius: "12px 12px 12px 0px",
                        }),
                      }}
                    >
                      Visitor answer here
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      marginBottom: "10px",
                    }}
                  >
                    <img
                      src={avatar}
                      alt="bot"
                      style={{
                        width: "20px",
                        height: "20px",
                        marginRight: "10px",
                        borderRadius: "50%",
                      }}
                    />
                    <div
                      style={{
                        background: themeColors.question,
                        color: textColorQuestion,
                        padding: "8px 12px",
                        borderRadius: "10px",
                        fontSize: "13px",
                      }}
                    >
                      Sample options will look like this
                    </div>
                  </div>

                  <button
                    style={{
                      width: "100%",
                      padding: "8px",
                      background: themeColors.option,
                      color: textColorOptions,
                      border: `2px solid ${themeColors.optionBorder}`,
                      borderRadius: `${borderRadius}px`,
                      marginTop: "5px",
                    }}
                  >
                    Option 1
                  </button>

                  <button
                    style={{
                      width: "100%",
                      padding: "8px",
                      background: themeColors.answer,
                      color: textColor,
                      borderRadius: `${borderRadius}px`,
                      marginTop: "10px",
                      textAlign: textAlign,
                    }}
                  >
                    Confirm
                  </button>
                </div>

                {/* Footer */}
                <div
                  style={{
                    background: "#fff",
                    textAlign: "center",
                    padding: "10px 15px",
                    boxShadow: "0px 4px 20px #d8d8d8",
                    fontSize: "12px",
                    borderTop: "1px solid #ddd",
                  }}
                >
                  Powered by A2 Digital
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPreview;
