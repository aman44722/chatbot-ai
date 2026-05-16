import React, { useEffect, useState } from "react";
import { DndProvider, useDrop } from "react-dnd";
import {
  Box,
  Typography,
  IconButton,
  TextField,
  Switch,
  Select,
  MenuItem,
  Button,
  Dialog,
} from "@mui/material";

import { useSnackbar } from "notistack";
import { HTML5Backend } from "react-dnd-html5-backend";

import "./Style.css";

import EditQuestionPopup from "./Fetures/Ouestions/EditQuestionPopup";
import BotPreviewDialogPopup from "./Fetures/Ouestions/BotPreviewDialogPopup";
import QuestionDraggableItem from "./Fetures/Ouestions/QuestionDraggableItem";
import { fetchUserById, updateUserDetails } from "../../../api/authApi";
import { useDispatch } from "react-redux";
import { updateSetting } from "../../../redux/botSettingsSlice";
import { toast, ToastContainer } from "react-toastify";

const FlowCanvasComponent = () => {
  const { enqueueSnackbar } = useSnackbar();

  const [droppedItems, setDroppedItems] = useState([]);

  const [openEdit, setOpenEdit] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [language, setLanguage] = useState("en");
  const [openPreview, setOpenPreview] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);

  const [botName, setBotName] = useState("Chatbot");
  const [textAlign, setTextAlign] = useState("textAlign");
  const [description, setDescription] = useState("Assistant");
  const [welcomeText, setWelcomeText] = useState(
    "Hi there! How can I help you?"
  );
  const [botLogo, setBotLogo] = useState(
    "https://cdn-icons-png.flaticon.com/512/4712/4712035.png"
  );

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
        anchorOrigin: {
          vertical: "top",
          horizontal: "right",
        },
      });
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));
  const dispatch = useDispatch();
  // Handle editing a question
  const handleEdit = (item) => {
    setEditingItem(item);
    setOpenEdit(true);
  };

  const generateUniqueId = () => {
    return "q" + Math.random().toString(36).substr(2, 9); // Generate unique ID
  };

  // ✅ Receive updated item from EditQuestionPopup and update droppedItems list
  const handleUpdate = (updatedItem) => {
    const updatedList = droppedItems.map((q) =>
      q.id === updatedItem.id ? updatedItem : q
    );
    setDroppedItems(updatedList);
    console.log("updatedList", updatedList);
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
    enqueueSnackbar("Question has been duplicated successfully", {
      variant: "success",
      anchorOrigin: {
        vertical: "top",
        horizontal: "right",
      },
    });
  };

  const handleSave = async () => {
    const userID = localStorage.getItem("userId");
    const token = JSON.parse(localStorage.getItem("user"))?.token;

    if (!userID || !token) {
      throw new Error("Missing userId or token");
    }
    const userPayload = {
      flowSetupSetting: {
        question: {
          list: JSON.parse(JSON.stringify(droppedItems)), // Serialize the droppedItems correctly
        },
      },
    };

    try {
      const response = await updateUserDetails(userID, token, userPayload);

      if (response) {
        toast.success("Saved successfully");
      } else {
        toast.error("Error saving the questions");
      }

      console.log("Saved successfully:", response);
      // fetchUserById();
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
    // Fetch questions when the component mounts
    const getQuestions = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          throw new Error("User ID is missing in localStorage.");
        }

        const userData = await fetchUserById(userId);
        setDroppedItems(userData?.flowSetupSetting?.question?.list || []); // Update state with the fetched data
      } catch (error) {
        console.error("Error fetching questions:", error);
        enqueueSnackbar("Error fetching questions", { variant: "error" });
      }
    };

    getQuestions();
  }, []);
  return (
    <Box
      ref={dropRef}
      sx={{
        width: "70%",
        minHeight: "60vh",
        padding: "30px",
        backgroundColor: isOver ? "#F9FAFB" : "#fff",
        transition: "background 0.3s ease-in-out",
        display: "flex",
        flexDirection: "column",
        gap: "15px",
      }}
    >
      {/* Top Control Bar */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          gap: 2,
          alignItems: "center",
          mb: 2,
        }}
      >
        <TextField
          variant="outlined"
          label="Search Questions"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            sx={{ width: 100, ml: 2, height: "38px", borderRadius: "8px" }}
          >
            <MenuItem value="en">English</MenuItem>
            <MenuItem value="hi">Hindi</MenuItem>
            <MenuItem value="es">Spanish</MenuItem>
            <MenuItem value="fr">French</MenuItem>
          </Select>

          <Button
            onClick={() => setOpenPreview(true)}
            style={{
              background: "#4F46E5",
              color: "#fff",
              padding: "10px 25px",
              borderRadius: "8px",
              border: "none",
              alignSelf: "flex-start",
            }}
          >
            Preview
          </Button>
          <Button
            onClick={() => handleSave()}
            style={{
              background: "#4F46E5",
              color: "#fff",
              padding: "10px 25px",
              borderRadius: "8px",
              border: "none",
              alignSelf: "flex-start",
            }}
          >
            Save
          </Button>
          <ToastContainer />
        </Box>
      </Box>

      {/* Drop Area Content */}
      {filteredItems.length === 0 ? (
        <Typography variant="h6" color="text.secondary" textAlign="center">
          {droppedItems.length === 0
            ? "Drag components here to build your flow"
            : "Data not found!"}
        </Typography>
      ) : (
        <DndProvider backend={HTML5Backend}>
          {filteredItems.map((item, index) => (
            <QuestionDraggableItem
              key={item.id}
              index={index}
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
          ))}
        </DndProvider>
      )}

      {/* Edit Popup */}
      {openEdit && editingItem && (
        <EditQuestionPopup
          openEdit={openEdit}
          handleCloseEdit={handleCloseEdit}
          editingItem={editingItem}
          onUpdate={handleUpdate} // 👈 pass the update handler
        />
      )}

      {/* Bot Preview */}
      <BotPreviewDialogPopup
        open={openPreview}
        onClose={() => setOpenPreview(false)}
        droppedItems={droppedItems}
        botName={botName}
        description={description}
        welcomeText={welcomeText}
        botAvatar={botLogo}
        textAlign={textAlign}
        // pass setErrorMessage function
        // flexDirection={flexDirection}
        onUpdate={handleUpdate}
      />
    </Box>
  );
};

export default FlowCanvasComponent;
