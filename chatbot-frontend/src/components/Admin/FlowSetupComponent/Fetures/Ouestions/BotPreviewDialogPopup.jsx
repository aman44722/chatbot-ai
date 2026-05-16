import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  IconButton,
  Avatar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Switch,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import RefreshIcon from "@mui/icons-material/Refresh";
import CloseIcon from "@mui/icons-material/Close";
import { useSelector } from "react-redux";

const BotPreviewDialogPopup = ({ open, onClose, droppedItems }) => {
  const {
    botName,
    description,
    companyLogo,
    welcomeText,
    avatar,
    selectedBubbleStyle,
  } = useSelector((state) => state.botSettings);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [inputText, setInputText] = useState("");
  const [userMessages, setUserMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [skipClicked, setSkipClicked] = useState(
    new Array(droppedItems.length).fill(false)
  ); // Track skip status for each question
  const handleSend = () => {
    if (inputText.trim() === "") return;
    const updated = [...userMessages];
    updated[currentQuestionIndex] = inputText.trim();
    setUserMessages(updated);
    setInputText("");
    setIsTyping(true);
    setTimeout(() => {
      setCurrentQuestionIndex((prev) => prev + 1);
      setIsTyping(false);
    }, 1200);
  };

  const handleSkip = () => {
    const updatedSkipStatus = [...skipClicked];
    updatedSkipStatus[currentQuestionIndex] = true; // Mark this question as skipped
    setSkipClicked(updatedSkipStatus);
    setIsTyping(true); // Start typing animation immediately for skip
    setTimeout(() => {
      setCurrentQuestionIndex((prev) => prev + 1); // Skip to the next question
      setIsTyping(false); // Stop typing animation after skipping
    }, 1200);
  };

  const isChatCompleted = currentQuestionIndex >= droppedItems.length;

  const getBubbleRadius = () => {
    switch (selectedBubbleStyle) {
      case "style1":
        return "8px";
      case "style2":
        return "20px";
      case "style4":
        return "12px 12px 0 12px";
      case "style3":
        return "12px 12px 12px 0px";
      default:
        return "12px";
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <Box sx={{ padding: 4, position: "relative" }}>
        {/* Header */}
        <Box
          sx={{
            boxShadow: "0px 0px 5px 2px #bdfbffa2",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "#fff",
            borderRadius: "10px 10px 0 0",
            padding: "10px 16px",
            borderBottom: "1px solid #eee",
            position: "sticky",
            top: 0,
            zIndex: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Avatar src={companyLogo} sx={{ width: 30, height: 30 }} />
            <Box>
              <Typography variant="subtitle2" fontWeight={500}>
                {botName || "Chatbot"}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {description || "Assistant"}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton sx={{ background: "#F5F6FF", borderRadius: 2 }}>
              <MoreVertIcon fontSize="small" />
            </IconButton>
            <IconButton
              sx={{ background: "#F5F6FF", borderRadius: 2 }}
              onClick={() => {
                setCurrentQuestionIndex(0);
                setUserMessages([]);
                setInputText("");
                setSkipClicked(false);
                setIsTyping(false);
              }}
            >
              <RefreshIcon
                sx={{
                  transition: "transform 0.3s ease",
                  "&:hover": {
                    transform: "rotate(360deg)",
                  },
                }}
                fontSize="small"
              />
            </IconButton>

            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Chat Content */}
        <Box
          sx={{
            backgroundColor: "#fff",
            boxShadow: "0px 0px 5px 2px #bdfbffa2",
            padding: "20px",
            minHeight: "300px",
            maxHeight: "50vh",
            overflowY: "auto",
            border: "1px solid #d8d8d884",
          }}
        >
          {welcomeText && (
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                gap: 1.5,
                mb: 3,
              }}
            >
              <Box
                sx={{
                  backgroundColor: "#2563eb",
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img src={avatar} alt="bot" style={{ width: 18, height: 18 }} />
              </Box>
              <Box
                sx={{
                  backgroundColor: "#DBEAFE",
                  padding: "14px",
                  borderRadius: getBubbleRadius(),
                  maxWidth: "80%",
                }}
              >
                <Typography variant="body2">{welcomeText}</Typography>
              </Box>
            </Box>
          )}

          {droppedItems
            .slice(0, currentQuestionIndex + 1)
            .map((item, index) => (
              <React.Fragment key={`pair-${index}`}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    flexDirection: "column",
                    gap: 1.5,
                    mb: 1,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 1.5,
                      mb: 1,
                    }}
                  >
                    <Avatar src={avatar} sx={{ width: 30, height: 30 }} />
                    <Box
                      sx={{
                        backgroundColor: "#DBEAFE",
                        padding: "14px",
                        borderRadius: getBubbleRadius(),
                        maxWidth: "80%",
                      }}
                      dangerouslySetInnerHTML={{ __html: item.text }}
                    />
                  </Box>
                  {/* Show uploaded media if available */}
                  {item.media && (
                    <Box sx={{ mb: 2 }}>
                      <img
                        src={item.media}
                        alt="uploaded"
                        style={{
                          maxWidth: "240px",
                          maxHeight: "160px",
                          borderRadius: "10px",
                          border: "1px solid #e5e7eb",
                          objectFit: "cover",
                        }}
                      />
                    </Box>
                  )}
                  {/* Option Rendering: Displaying options as buttons */}
                  {item.options && !userMessages[index] && (
                    <Box sx={{ width: "100%", marginBottom: "20px" }}>
                      {/* Show Option if available */}
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "left",
                          alignItems: "start",
                          flexDirection: item.flexDirection || "column",
                          width: "100%",
                          rowGap: "0px",
                          columnGap: "10px",
                          marginLeft: "8%",
                          flexWrap: "wrap",
                        }}
                      >
                        {item.options &&
                        Array.isArray(item.options) &&
                        item.options.length > 0 ? (
                          item.options.map((option, optionIndex) => (
                            <button
                              key={optionIndex}
                              style={{
                                backgroundColor: "#2563eb",
                                color: "#ffffff",
                                padding: "10px 24px",
                                borderRadius: "12px",
                                border: "none",
                                fontSize: "14px",
                                fontWeight: 500,
                                cursor: "pointer",
                                transition: "all 0.3s ease",
                                boxShadow: "0 2px 6px rgba(0, 0, 0, 0.08)",
                                marginBottom: "12px",
                                textAlign: "center",
                                width: "33%",
                              }}
                              onClick={() => {
                                const updatedMessages = [...userMessages];
                                updatedMessages[index] = option;
                                setUserMessages(updatedMessages);
                                setCurrentQuestionIndex(index + 1);
                              }}
                              onMouseOver={(e) =>
                                (e.currentTarget.style.backgroundColor =
                                  "#1e40af")
                              }
                              onMouseOut={(e) =>
                                (e.currentTarget.style.backgroundColor =
                                  "#2563eb")
                              }
                            >
                              {option}
                            </button>
                          ))
                        ) : (
                          <> </> // If no options, do nothing
                        )}
                      </Box>

                      {/* Skip Button */}
                      {item.skipOption &&
                        !userMessages[index] &&
                        !skipClicked[index] && (
                          <Box
                            sx={{ display: "flex", justifyContent: "start" }}
                          >
                            <Button
                              variant="outlined"
                              onClick={handleSkip}
                              sx={{
                                marginLeft: "8%",
                                borderRadius: "12px",
                                padding: "10px 24px",
                                backgroundColor: "#2563eb",
                                color: "#ffffff",
                                "&:hover": {
                                  backgroundColor: "#1e40af",
                                },
                              }}
                            >
                              Skip
                            </Button>
                          </Box>
                        )}
                    </Box>
                  )}
                </Box>

                {/* Display User Messages */}
                {userMessages[index] && (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      mb: 1.5,
                    }}
                  >
                    <Box
                      sx={{
                        backgroundColor: "#2563eb",
                        color: "#fff",
                        padding: "10px 14px",
                        borderRadius: "20px",
                        maxWidth: "70%",
                      }}
                    >
                      <Typography fontSize="14px">
                        {userMessages[index]}
                      </Typography>
                    </Box>
                  </Box>
                )}

                {/* Display Typing Indicator */}
                {index === currentQuestionIndex && isTyping && (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 1.5,
                      mb: 2,
                    }}
                  >
                    <Avatar src={avatar} sx={{ width: 30, height: 30 }} />
                    <Box
                      sx={{
                        backgroundColor: "#DBEAFE",
                        borderRadius: getBubbleRadius(),
                        padding: "10px 14px",
                        display: "flex",
                        gap: 1,
                        maxWidth: "100px",
                      }}
                    >
                      {[...Array(3)].map((_, i) => (
                        <Box
                          key={i}
                          sx={{
                            width: "8px",
                            height: "8px",
                            borderRadius: "50%",
                            backgroundColor: "#2563eb",
                            animation: `blink 1.4s infinite ease-in-out ${
                              i * 0.2
                            }s`,
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                )}
              </React.Fragment>
            ))}

          {isChatCompleted && (
            <Typography color="success.main" align="center" mt={2}>
              ✅ All questions answered!
            </Typography>
          )}
        </Box>

        {/* Input Footer */}
        <Box
          sx={{
            boxShadow: "0px 0px 5px 2px #bdfbffa2",
            position: "sticky",
            bottom: 0,
            backgroundColor: "#fff",
            padding: "16px",
            borderTop: "1px solid #eee",
            zIndex: 1,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              border: "1px solid #E0E0E0",
              borderRadius: "999px",
              padding: "4px 8px",
            }}
          >
            <input
              type="text"
              value={inputText}
              disabled={isChatCompleted}
              placeholder="Type your answer"
              onChange={(e) => setInputText(e.target.value)}
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                padding: "10px",
                fontSize: "14px",
                borderRadius: "999px",
                background: "transparent",
              }}
            />
            <Button
              onClick={handleSend}
              disabled={isChatCompleted}
              sx={{
                minWidth: 0,
                height: "45px",
                width: "45px",
                padding: "8px",
                borderRadius: "50%",
                backgroundColor: "#2563eb",
                color: "#fff",
                ":hover": { backgroundColor: "#1d4ed8" },
              }}
            >
              ➤
            </Button>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
            <Typography
              variant="caption"
              sx={{
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              Powered By{" "}
              <span style={{ color: "#6366F1", fontWeight: 600 }}>
                A2 Digital
              </span>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
};

export default BotPreviewDialogPopup;
