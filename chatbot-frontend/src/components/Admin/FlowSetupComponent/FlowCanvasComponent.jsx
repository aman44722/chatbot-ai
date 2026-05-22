import React, { useEffect, useState } from "react";
import { useDrop } from "react-dnd";
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  InputAdornment,
} from "@mui/material";

import { useSnackbar } from "notistack";

import "./Style.css";

import EditQuestionPopup from "./Fetures/Ouestions/EditQuestionPopup";
import BotPreviewDialogPopup from "./Fetures/Ouestions/BotPreviewDialogPopup";
import QuestionDraggableItem from "./Fetures/Ouestions/QuestionDraggableItem";
import { fetchUserById, updateUserDetails } from "../../../api/authApi";
import { toast, ToastContainer } from "react-toastify";
import SearchIcon from "@mui/icons-material/Search";
import PreviewIcon from "@mui/icons-material/Preview";
import SaveIcon from "@mui/icons-material/Save";
import WidgetsIcon from "@mui/icons-material/Widgets";

const FlowCanvasComponent = () => {
  const { enqueueSnackbar } = useSnackbar();

  const [droppedItems, setDroppedItems] = useState([]);
  const [openEdit, setOpenEdit] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [language, setLanguage] = useState("en");
  const [openPreview, setOpenPreview] = useState(false);

  const [{ isOver }, dropRef] = useDrop(() => ({
    accept: "COMPONENT",
    drop: (item) => {
      const defaultText = item.defaultLabel || "Default Question";
      setDroppedItems((prev) => [
        ...prev,
        { ...item, id: Date.now(), text: defaultText },
      ]);
      enqueueSnackbar("Question added successfully", {
        variant: "success",
        anchorOrigin: { vertical: "top", horizontal: "right" },
      });
    },
    collect: (monitor) => ({ isOver: monitor.isOver() }),
  }));

  const handleEdit = (item) => {
    setEditingItem(item);
    setOpenEdit(true);
  };

  const generateUniqueId = () => "q" + Math.random().toString(36).substr(2, 9);

  const handleUpdate = (updatedItem) => {
    setDroppedItems((prev) =>
      prev.map((q) => (q.id === updatedItem.id ? updatedItem : q))
    );
  };

  const handleDelete = (id) => {
    setDroppedItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
    setEditingItem(null);
  };

  const handleDuplicate = (item) => {
    const newItem = {
      ...item,
      id: generateUniqueId(),
      text: item.text + " (copy)",
    };
    setDroppedItems((prev) => [...prev, newItem]);
    enqueueSnackbar("Question duplicated successfully", {
      variant: "success",
      anchorOrigin: { vertical: "top", horizontal: "right" },
    });
  };

  const handleSave = async () => {
    const userID = localStorage.getItem("userId");
    const token = JSON.parse(localStorage.getItem("user"))?.token;
    if (!userID || !token) {
      throw new Error("Missing userId or token");
    }
    const cleanItems = droppedItems.map(({ icon, label, defaultLabel, ...rest }) => rest);
    const userPayload = { flowSetupSetting: { question: { list: cleanItems } } };
    try {
      const response = await updateUserDetails(userID, token, userPayload);
      if (response) toast.success("Saved successfully");
      else toast.error("Error saving the questions");
    } catch (error) {
      console.error("Error saving the questions:", error);
    }
  };

  const handleConditionalFlow = (id) => {
    alert(`Setup conditional flow for item ID: ${id}`);
  };

  const filteredItems = droppedItems.filter((item) =>
    item.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const getQuestions = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) throw new Error("User ID is missing in localStorage.");
        const userData = await fetchUserById(userId);
        setDroppedItems(userData?.flowSetupSetting?.question?.list || []);
      } catch (error) {
        console.error("Error fetching questions:", error);
        enqueueSnackbar("Error fetching questions", { variant: "error" });
      }
    };
    getQuestions();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Box
      ref={dropRef}
      sx={{
        flex: 1,
        minHeight: "60vh",
        p: { xs: 1.5, md: 2.5 },
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(12px)",
        transition: "background 0.3s",
        position: "relative",
      }}
    >
      {/* Top Control Bar */}
      <Box sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        justifyContent: "space-between",
        gap: 1.5,
        alignItems: { xs: "stretch", sm: "center" },
        mb: 0.5,
      }}>
        <TextField
          placeholder="Search questions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ fontSize: 16, color: "#9ca3af" }} />
              </InputAdornment>
            ),
          }}
          sx={{
            maxWidth: { xs: "100%", sm: 280 },
            "& .MuiOutlinedInput-root": {
              borderRadius: "10px", bgcolor: "#fff", fontSize: 13,
              "& fieldset": { borderColor: "#e5e7eb" },
              "&:hover fieldset": { borderColor: "#c7d2fe" },
              "&.Mui-focused fieldset": { borderColor: "#6366f1", borderWidth: 1.5 },
            },
          }}
        />

        <Box sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          flexWrap: "wrap",
        }}>
          <Select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            size="small"
            sx={{
              minWidth: 100,
              borderRadius: "10px",
              bgcolor: "#fff",
              fontSize: 13,
              "& fieldset": { borderColor: "#e5e7eb" },
            }}
          >
            <MenuItem value="en">English</MenuItem>
            <MenuItem value="hi">Hindi</MenuItem>
            <MenuItem value="es">Spanish</MenuItem>
            <MenuItem value="fr">French</MenuItem>
          </Select>

          <Button
            onClick={() => setOpenPreview(true)}
            startIcon={<PreviewIcon />}
            variant="outlined"
            sx={{
              borderRadius: "10px", textTransform: "none", fontWeight: 600, fontSize: 13,
              borderColor: "#e5e7eb", color: "#374151", px: 2,
              "&:hover": { borderColor: "#6366f1", bgcolor: "#6366f106" },
            }}
          >
            Preview
          </Button>

          <Button
            onClick={handleSave}
            startIcon={<SaveIcon />}
            variant="contained"
            sx={{
              borderRadius: "10px", textTransform: "none", fontWeight: 600, fontSize: 13,
              bgcolor: "#6366f1", px: 2.5,
              "&:hover": { bgcolor: "#4f46e5" },
            }}
          >
            Save
          </Button>
        </Box>
      </Box>

      {/* Drop Area */}
      <Box sx={{
        flex: 1,
        borderRadius: 3,
        border: isOver ? "2px dashed #6366f1" : "2px dashed transparent",
        bgcolor: isOver ? "#6366f106" : "transparent",
        transition: "all 0.3s",
        p: { xs: 1, md: 2 },
        display: "flex",
        flexDirection: "column",
        gap: 1,
      }}>
        {filteredItems.length === 0 ? (
          <Box sx={{
            flex: 1, display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            gap: 1.5, py: 6,
            color: "#d1d5db",
          }}>
            <WidgetsIcon sx={{ fontSize: 48, opacity: 0.4 }} />
            <Typography sx={{ fontSize: 15, fontWeight: 600, color: "#9ca3af" }}>
              {droppedItems.length === 0
                ? "Drag components here to build your flow"
                : "No matching questions found"}
            </Typography>
            <Typography sx={{ fontSize: 12, color: "#d1d5db" }}>
              {droppedItems.length === 0
                ? "Pick items from the sidebar and drop them here"
                : "Try a different search term"}
            </Typography>
          </Box>
        ) : (
          filteredItems.map((item) => {
            const originalIndex = droppedItems.findIndex((di) => di.id === item.id);
            return (
              <QuestionDraggableItem
                key={item.id}
                index={originalIndex}
                item={item}
                moveItem={(from, to) => {
                  const updated = [...droppedItems];
                  const [moved] = updated.splice(from, 1);
                  updated.splice(to, 0, moved);
                  setDroppedItems(updated);
                }}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onDuplicate={handleDuplicate}
                onConditional={handleConditionalFlow}
              />
            );
          })
        )}
      </Box>

      {/* Edit Popup */}
      {openEdit && editingItem && (
        <EditQuestionPopup
          openEdit={openEdit}
          handleCloseEdit={handleCloseEdit}
          editingItem={editingItem}
          onUpdate={handleUpdate}
        />
      )}

      {/* Bot Preview */}
      <BotPreviewDialogPopup
        open={openPreview}
        onClose={() => setOpenPreview(false)}
        droppedItems={droppedItems}
      />

      <ToastContainer />
    </Box>
  );
};

export default FlowCanvasComponent;
