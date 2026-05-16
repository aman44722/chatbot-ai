import React, { useRef, useEffect, useState } from "react";
import { Box, Button, MenuItem, Select, IconButton } from "@mui/material";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import LinkIcon from "@mui/icons-material/Link";
import YouTubeIcon from "@mui/icons-material/YouTube";
import DOMPurify from "dompurify";
import OptionList from "./BasicTabs/SingleChoiceTab/Options/OptionInputRow";

const CustomTextEditor = ({ value, onChange }) => {
  const editorRef = useRef(null);
  const [fontSize, setFontSize] = useState("16px");

  const applyCommand = (command, value = null) => {
    const sanitizedValue = DOMPurify.sanitize(value); // sanitize input
    document.execCommand(command, false, sanitizedValue);
    editorRef.current.focus();
  };

  const insertLink = () => {
    const url = prompt("Enter URL:");
    if (url) {
      const sanitizedUrl = DOMPurify.sanitize(url); // sanitize URL
      applyCommand("createLink", sanitizedUrl);
    }
  };

  const embedYouTube = () => {
    const url = prompt("Enter YouTube video URL:");
    if (url) {
      const sanitizedUrl = DOMPurify.sanitize(url); // sanitize URL
      const embed = `<iframe width="100%" height="300" src="${sanitizedUrl.replace(
        "watch?v=",
        "embed/"
      )}" frameborder="0" allowfullscreen></iframe>`;
      document.execCommand("insertHTML", false, embed);
    }
  };
  const handleFontSizeChange = (e) => {
    setFontSize(e.target.value);
    applyCommand("fontSize", "7");
    const fonts = document.getElementsByTagName("font");
    for (let i = 0; i < fonts.length; i++) {
      if (fonts[i].size === "7") {
        fonts[i].removeAttribute("size");
        fonts[i].style.fontSize = e.target.value;
      }
    }
  };

  // Update contentEditable when value changes externally
  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value]);

  return (
    <Box sx={{ width: "100%" }}>
      {/* Toolbar */}
      <Box sx={{ display: "flex", gap: 1, mb: 2, alignItems: "center" }}>
        <Select size="small" value={fontSize} onChange={handleFontSizeChange}>
          <MenuItem value="12px">Small</MenuItem>
          <MenuItem value="16px">Medium</MenuItem>
          <MenuItem value="20px">Large</MenuItem>
          <MenuItem value="24px">XL</MenuItem>
        </Select>
        <Box>Line Breaker</Box>

        <IconButton onClick={() => applyCommand("bold")}>
          <FormatBoldIcon />
        </IconButton>
        <IconButton onClick={() => applyCommand("italic")}>
          <FormatItalicIcon />
        </IconButton>
        <IconButton onClick={() => applyCommand("insertUnorderedList")}>
          <FormatListBulletedIcon />
        </IconButton>
        <IconButton onClick={() => applyCommand("insertOrderedList")}>
          <FormatListNumberedIcon />
        </IconButton>
        <IconButton onClick={() => applyCommand("underline")}>
          <FormatUnderlinedIcon />
        </IconButton>
        <IconButton onClick={insertLink}>
          <LinkIcon />
        </IconButton>
        <IconButton onClick={embedYouTube}>
          <YouTubeIcon />
        </IconButton>
      </Box>

      {/* Editable Area */}
      <Box
        value={value}
        onChange={(e) => onChange(e.target.value)}
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={(e) => onChange(e.currentTarget.innerHTML)}
        sx={{
          minHeight: "150px",
          padding: "12px",
          border: "1px solid #ccc",
          borderRadius: "6px",
          backgroundColor: "#fff",
          fontSize,
        }}
      >
        {/* innerHTML will be handled by useEffect */}
      </Box>

      {/* <OptionList /> */}
    </Box>
  );
};

export default CustomTextEditor;
