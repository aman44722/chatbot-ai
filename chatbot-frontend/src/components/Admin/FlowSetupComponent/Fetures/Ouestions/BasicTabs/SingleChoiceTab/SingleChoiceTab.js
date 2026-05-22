import React, { useState } from "react";
import {
  Box, Button, Switch, TextField, Typography, Select, MenuItem, FormControl, InputLabel, IconButton, Chip, Grid,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import ShowOptionsButtons from "./Options/ShowOptionsButtons";
import OptionInputRow from "./Options/OptionInputRow";
import { toast } from "react-toastify";
import { compressImage } from "../../../../../../../utils/imageCompressor";

const SingleChoiceTab = ({
  skipOption, setSkipOption,
  errorMessage, setErrorMessage,
  options, setOptions,
  flexDirection, setFlexDirection,
  style, setStyle,
  defaultSelected, setDefaultSelected,
  shuffleOptions, setShuffleOptions,
  otherOption, setOtherOption,
  imageChoices, setImageChoices,
}) => {
  const handleImageUpload = (index) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      try {
        const compressed = await compressImage(file, 200, 0.6);
        const updated = [...imageChoices];
        updated[index] = { ...updated[index], image: compressed };
        setImageChoices(updated);
      } catch (err) {
        toast.error("Failed to compress image");
      }
    };
    input.click();
  };

  const removeImage = (index) => {
    const updated = [...imageChoices];
    updated[index] = { ...updated[index], image: "" };
    setImageChoices(updated);
  };

  return (
    <Box sx={{ mt: 1 }}>
      {/* Style Selector */}
      <Typography sx={{ fontWeight: 600, fontSize: 14, mb: 1, color: "#444" }}>Display Style</Typography>
      <Box sx={{ display: "flex", gap: 1.5, mb: 2, flexWrap: "wrap" }}>
        {["button", "dropdown", "list"].map((s) => (
          <Button
            key={s}
            variant={style === s ? "contained" : "outlined"}
            size="small"
            onClick={() => setStyle(s)}
            sx={{
              textTransform: "none", borderRadius: 2, px: 2.5, fontWeight: 500,
              bgcolor: style === s ? "#2563eb" : "transparent",
              color: style === s ? "#fff" : "#444",
              borderColor: style === s ? "#2563eb" : "#d0d0d0",
              "&:hover": { borderColor: "#2563eb" },
            }}
          >
            {s === "button" ? "Button Style" : s === "dropdown" ? "Dropdown Style" : "List View"}
          </Button>
        ))}
      </Box>

      {/* Layout Direction */}
      <ShowOptionsButtons flexDirection={flexDirection} setFlexDirection={setFlexDirection} />

      {/* Options */}
      <Typography sx={{ fontWeight: 600, fontSize: 14, mb: 1, color: "#444" }}>Add Choices</Typography>
      <OptionInputRow value={options} onChange={setOptions} />

      {/* Image Choices */}
      <Typography sx={{ fontWeight: 600, fontSize: 14, mb: 1, mt: 2, color: "#444" }}>Image Choices</Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, mb: 2 }}>
        {(options || []).map((opt, i) => (
          <Box key={i} sx={{ position: "relative", width: 90, textAlign: "center" }}>
            <Box
              onClick={() => handleImageUpload(i)}
              sx={{
                width: 80, height: 80, mx: "auto", borderRadius: 2,
                border: "2px dashed #d0d0d0", display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", overflow: "hidden", bgcolor: "#fafafa",
                "&:hover": { borderColor: "#2563eb" },
              }}
            >
              {imageChoices?.[i]?.image ? (
                <img src={imageChoices[i].image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <AddPhotoAlternateIcon sx={{ color: "#bbb", fontSize: 28 }} />
              )}
            </Box>
            {imageChoices?.[i]?.image && (
              <IconButton size="small" onClick={() => removeImage(i)}
                sx={{ position: "absolute", top: -6, right: -6, bgcolor: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,0.15)", width: 20, height: 20, "&:hover": { bgcolor: "#fee2e2" } }}>
                <DeleteIcon sx={{ fontSize: 12 }} />
              </IconButton>
            )}
            <Typography sx={{ fontSize: 11, mt: 0.5, color: "#666", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {opt || `Option ${i + 1}`}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Default Selected */}
      <FormControl fullWidth size="small" sx={{ mb: 2 }}>
        <InputLabel>Default Selected</InputLabel>
        <Select
          value={defaultSelected ?? ""}
          label="Default Selected"
          onChange={(e) => setDefaultSelected(e.target.value === "" ? null : Number(e.target.value))}
          sx={{ borderRadius: "10px", bgcolor: "#fff" }}
        >
          <MenuItem value="">None</MenuItem>
          {(options || []).map((opt, i) => (
            <MenuItem key={i} value={i}>{opt || `Option ${i + 1}`}</MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Toggles Row */}
      <Box sx={{ display: "flex", gap: 3, mb: 2, flexWrap: "wrap" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Switch size="small" checked={shuffleOptions} onChange={(e) => setShuffleOptions(e.target.checked)} />
          <Typography sx={{ fontSize: 13, color: "#555", fontWeight: 500 }}>Shuffle Options</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Switch size="small" checked={otherOption} onChange={(e) => setOtherOption(e.target.checked)} />
          <Typography sx={{ fontSize: 13, color: "#555", fontWeight: 500 }}>Enable "Other" Option</Typography>
        </Box>
      </Box>

      {/* Skip Toggle */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
        <Switch checked={skipOption} onChange={(e) => setSkipOption(e.target.checked)} />
        <Typography sx={{ fontWeight: 500, color: "#6b7280" }}>
          {skipOption ? "Give Skip Option" : "Do Not Give Skip Option"}
        </Typography>
      </Box>

      {/* Error Message */}
      <Typography sx={{ fontWeight: 500, mb: 1 }}>Enter the error message here.</Typography>
      <TextField
        fullWidth placeholder="Please enter a valid answer"
        value={errorMessage}
        onChange={(e) => setErrorMessage(e.target.value)}
        size="small"
        sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px", backgroundColor: "#fff" } }}
      />
    </Box>
  );
};

export default SingleChoiceTab;