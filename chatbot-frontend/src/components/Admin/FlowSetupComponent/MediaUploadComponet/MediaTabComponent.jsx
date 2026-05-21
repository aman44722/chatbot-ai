import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  IconButton,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import picImg from "./picture.svg"; // placeholder image
import { toast } from "react-toastify";

const GIPHY_API_KEY = "lADTumhthnqlLrBtIItDmB5PFDCns3iy";

const Item = styled(Box)(({ theme }) => ({
  backgroundColor: "#fff",
  padding: theme.spacing(2),
  textAlign: "center",
  borderRadius: "6px",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  cursor: "pointer",
  transition: "transform 0.3s ease",
  "&:hover": {
    transform: "scale(1.05)",
  },
}));

const MediaTabComponent = ({ media, setMedia, questionChanged }) => {
  const [selectedGifUrl, setSelectedGifUrl] = useState(media ? media : picImg);
  const [searchTerm, setSearchTerm] = useState("");
  const [gifs, setGifs] = useState([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [noResults, setNoResults] = useState(false);

  useEffect(() => {
    if (questionChanged) {
      setMedia(""); // Clear media when the question changes
      setSelectedGifUrl(""); // Reset selected GIF
    }
    fetchGifs(false, 0);
  }, [questionChanged]);

  const fetchGifs = async (append = false, customOffset = 0) => {
    try {
      setLoading(true);
      const response = await axios.get("https://api.giphy.com/v1/gifs/search", {
        params: {
          api_key: GIPHY_API_KEY,
          q: searchTerm,
          limit: 10,
          offset: customOffset,
        },
      });

      const newGifs = response.data.data;

      if (newGifs.length === 0) {
        setNoResults(true);
      } else {
        setNoResults(false);
      }

      setGifs((prev) => {
        const prevIds = new Set(prev.map((gif) => gif.id));
        const uniqueNew = newGifs.filter((gif) => !prevIds.has(gif.id));
        return append ? [...prev, ...uniqueNew] : newGifs;
      });

      setLoading(false);
    } catch (err) {
      console.error("GIF fetch failed:", err);
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 100 * 1024) {
        toast.error("File must be under 100KB");
        e.target.value = "";
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setMedia(reader.result);
        setSelectedGifUrl("");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setOffset(0);
    fetchGifs(false, 0);
  };

  const handleLoadMore = () => {
    const newOffset = offset + 10;
    setOffset(newOffset);
    fetchGifs(true, newOffset);
  };

  const handleRemoveMedia = () => {
    setMedia("");
    setSelectedGifUrl("");
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Upload Preview Box */}
      <Box
        sx={{
          border: "2px dashed #d1d5db",
          borderRadius: "10px",
          padding: "20px",
          textAlign: "center",
          position: "relative",
          cursor: "pointer",
          "&:hover": { borderColor: "#2563eb", bgcolor: "#f8faff" },
        }}
        onClick={() => document.getElementById("upload-image-input").click()}
      >
        <input
          id="upload-image-input"
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        {media ? (
          <>
            <img
              src={media}
              alt="uploaded"
              style={{ maxWidth: "100%", maxHeight: "120px", borderRadius: "8px", objectFit: "contain" }}
            />
            <Typography sx={{ mt: 1, fontSize: 12, color: "#666" }}>
              Click to change · Max 100KB
            </Typography>
            <IconButton
              size="small"
              onClick={(e) => { e.stopPropagation(); handleRemoveMedia(); }}
              sx={{
                position: "absolute",
                top: "8px",
                right: "8px",
                background: "#fff",
                boxShadow: "0 0 4px rgba(0,0,0,0.2)",
                "&:hover": { bgcolor: "#fee2e2" },
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </>
        ) : (
          <Box sx={{ py: 2 }}>
            <img src={picImg} alt="upload" style={{ width: 48, height: 48, marginBottom: 8, opacity: 0.5 }} />
            <Typography sx={{ fontWeight: 500, fontSize: 14, color: "#444" }}>
              Click to upload image
            </Typography>
            <Typography sx={{ fontSize: 12, color: "#999" }}>
              Max 100KB
            </Typography>
          </Box>
        )}
      </Box>

      {/* --- OR --- */}
      <Typography
        sx={{ textAlign: "center", color: "#6b7280", fontSize: "12px" }}
      >
        --- OR ---
      </Typography>

      {/* GIF Search Input */}
      <TextField
        placeholder="Search GIFs"
        fullWidth
        value={searchTerm}
        onChange={handleSearchChange}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
        }}
      />

      {/* Loader Spinner */}
      {loading ? (
        <Box sx={{ textAlign: "center", mt: 2 }}>
          <CircularProgress />
        </Box>
      ) : noResults ? (
        <Typography sx={{ textAlign: "center", mt: 2, color: "red" }}>
          Data not found. Please type another search term.
        </Typography>
      ) : (
        <Grid
          sx={{ overflowY: "scroll", height: "30vh" }}
          container
          spacing={4}
        >
          {gifs.map((gif, index) => (
            <Grid item xs={6} md={4} key={index}>
              <Item sx={{ position: "relative" }}>
                <img
                  src={gif.images.fixed_width.url}
                  alt={gif.title}
                  style={{
                    width: "100%",
                    height: "auto",
                    borderRadius: "6px",
                    cursor: "pointer",
                    border:
                      selectedGifUrl === gif.images.original.url
                        ? "3px solid #2563eb"
                        : "2px solid transparent",
                  }}
                  onClick={() => {
                    setMedia(gif.images.original.url);
                    setSelectedGifUrl(gif.images.original.url);
                  }}
                />
                {selectedGifUrl === gif.images.original.url && (
                  <IconButton
                    size="small"
                    onClick={handleRemoveMedia}
                    sx={{
                      position: "absolute",
                      top: "6px",
                      right: "6px",
                      background: "#fff",
                      boxShadow: "0 0 4px rgba(0,0,0,0.2)",
                    }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                )}
              </Item>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Load More Button */}
      {gifs.length > 0 && (
        <Box textAlign="center" mt={2}>
          <Button variant="outlined" onClick={handleLoadMore}>
            Load More
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default MediaTabComponent;
