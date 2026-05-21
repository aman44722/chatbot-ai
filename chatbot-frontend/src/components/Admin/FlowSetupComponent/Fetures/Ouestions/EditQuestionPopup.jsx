import "./Style.css";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Switch,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import TuneIcon from "@mui/icons-material/Tune";
import ImageIcon from "@mui/icons-material/Image";
import SettingsIcon from "@mui/icons-material/Settings";
import CloseIcon from "@mui/icons-material/Close";
import MediaTabComponent from "../../MediaUploadComponet/MediaTabComponent";
import CustomTextEditor from "./CustomTextEditor";
import QuestionTab from "./BasicTabs/QuestionTab/QuestionTab";
import NumberTab from "./BasicTabs/NumberTab/NumberTab";
import EmailTab from "./BasicTabs/EmailTab/EmailTab";
import MultipleChoiceTab from "./BasicTabs/MultipleChoiceTab/MultipleChoiceTab";
import MobileNumberTab from "./BasicTabs/MobileNumberTab/MobileNumberTab";
import OptionList from "./BasicTabs/SingleChoiceTab/Options/OptionInputRow";
import ShowOptionsButtons from "./BasicTabs/SingleChoiceTab/Options/ShowOptionsButtons";

const typeLabels = {
  question: "Question",
  single_choice: "Single Choice",
  email_feild: "Email",
  multiple_choice: "Multiple Choice",
  mobile_number: "Mobile Number",
  number: "Number",
  rating: "Rating",
  date_picker: "Date Picker",
  time_picker: "Time Picker",
  location: "Location",
  file_upload: "File Upload",
  website: "Website",
  ask_contacts: "Ask Contacts",
  order_items: "Order Items",
  authenticator: "Authenticator",
  form: "Form",
  carousel_with_buttons: "Carousel",
  dynamic_question: "Dynamic",
  Real_time_search: "Real Time Search",
  appointment_booking: "Appointment",
};

const typeColors = {
  question: "#6366f1",
  single_choice: "#8b5cf6",
  email_feild: "#3b82f6",
  multiple_choice: "#a855f7",
  mobile_number: "#06b6d4",
  number: "#14b8a6",
  rating: "#f59e0b",
  date_picker: "#ef4444",
  time_picker: "#f97316",
  location: "#84cc16",
  file_upload: "#10b981",
  website: "#6366f1",
  ask_contacts: "#ec4899",
  order_items: "#8b5cf6",
  authenticator: "#06b6d4",
  form: "#14b8a6",
  carousel_with_buttons: "#f59e0b",
  dynamic_question: "#ef4444",
  Real_time_search: "#3b82f6",
  appointment_booking: "#10b981",
};


const EditQuestionPopup = ({
  openEdit,
  handleCloseEdit,
  editingItem,
  onUpdate,
}) => {
  const [tabIndex, setTabIndex] = useState(0);
  const [text, setText] = useState("");
  const [options, setOptions] = useState([]);
  const [flexDirection, setFlexDirection] = useState("column");
  const [media, setMedia] = useState("");
  const [skipOption, setSkipOption] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [validations, setValidations] = useState({});

  useEffect(() => {
    if (editingItem) {
      setText(editingItem.text || "");
      setOptions(editingItem.options);
      setFlexDirection(editingItem.flexDirection || "column");
      setSkipOption(editingItem.skipOption || false);
      setMedia(editingItem.media || "");
      setErrorMessage(editingItem.errorMessage || "");
      setValidations(editingItem.validations || {});
    }
  }, [editingItem]);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const handleSwitchChange = (event) => {
    setSkipOption(event.target.checked); // Update skipOption state when switch toggles
  };

  const handleSave = () => {
    // Validate text (check if it's not empty)
    if (text.trim() === "") {
      setErrorMessage("Question text cannot be empty");
      return;
    }

    if (Array.isArray(options)) {
      if (options.some((option) => option.trim() === "")) {
        setErrorMessage("Options cannot be empty");
        return;
      }
    }

    onUpdate({
      ...editingItem,
      text,
      options: options || [],
      skipOption,
      flexDirection,
      media: media || "",
      errorMessage,
      validations,
    });

    console.log("options - ", options);
    console.log("flexDirection - ", flexDirection);
    console.log("text - ", text);
    console.log("media - ", media);
    console.log("skipOption - ", skipOption);

    handleCloseEdit();
  };

  const typeLabel = typeLabels[editingItem?.type] || "Question";
  const typeColor = typeColors[editingItem?.type] || "#6366f1";

  const basicTab = (
    <Box>
      {editingItem?.type === "question" ? (
        <QuestionTab
          skipOption={skipOption}
          setSkipOption={setSkipOption}
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
          validations={validations}
          setValidations={setValidations}
        />
      ) : editingItem?.type === "single_choice" ? (
        <Box>
          <ShowOptionsButtons
            flexDirection={flexDirection}
            setFlexDirection={setFlexDirection}
          />
          <OptionList value={options} onChange={setOptions} />
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3, mt: 2 }}>
            <Switch checked={skipOption} onChange={handleSwitchChange} />
            <Typography sx={{ fontWeight: 500, color: "#6b7280" }}>
              {skipOption ? "Give Skip Option" : "Do Not Give Skip Option"}
            </Typography>
          </Box>
        </Box>
      ) : editingItem?.type === "email_feild" ? (
        <EmailTab
          skipOption={skipOption}
          setSkipOption={setSkipOption}
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
        />
      ) : editingItem?.type === "multiple_choice" ? (
        <MultipleChoiceTab
          skipOption={skipOption}
          setSkipOption={setSkipOption}
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
          validations={validations}
          setValidations={setValidations}
        />
      ) : editingItem?.type === "mobile_number" ? (
        <MobileNumberTab
          skipOption={skipOption}
          setSkipOption={setSkipOption}
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
          validations={validations}
          setValidations={setValidations}
        />
      ) : editingItem?.type === "number" ? (
        <NumberTab
          skipOption={skipOption}
          setSkipOption={setSkipOption}
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
          validations={validations}
          setValidations={setValidations}
        />
      ) : (
        <Box sx={{ display: "flex", alignItems: "center", mb: 2, gap: 2 }}>
          <Switch checked={skipOption} onChange={handleSwitchChange} />
          <Typography sx={{ fontWeight: 500, color: "#6b7280" }}>
            {skipOption ? "Give Skip Option" : "Do Not Give Skip Option"}
          </Typography>
        </Box>
      )}
    </Box>
  );

  return (
    <Dialog
      open={openEdit}
      onClose={handleCloseEdit}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
          overflow: "hidden",
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${typeColor}15, ${typeColor}08)`,
          borderBottom: "1px solid",
          borderColor: "divider",
          px: 3,
          pt: 2.5,
          pb: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: "10px",
                background: `linear-gradient(135deg, ${typeColor}, ${typeColor}cc)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: 18,
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              {typeLabel.charAt(0)}
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 600, fontSize: 16, lineHeight: 1.3 }}>
                Edit {typeLabel}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
                Press "Enter" for paragraph break
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              px: 1.5,
              py: 0.4,
              borderRadius: "20px",
              fontSize: 11,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              color: typeColor,
              bgcolor: `${typeColor}15`,
              border: `1px solid ${typeColor}30`,
            }}
          >
            {typeLabel}
          </Box>
        </Box>
      </Box>

      <Divider />

      {/* Text Editor */}
      <Box sx={{ px: 3, pt: 2.5 }}>
        <CustomTextEditor value={text} onChange={setText} />
      </Box>

      {/* Tabs */}
      <Box sx={{ px: 3, mt: 2 }}>
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          sx={{
            minHeight: 40,
            "& .MuiTabs-indicator": {
              height: 3,
              borderRadius: "3px 3px 0 0",
              bgcolor: typeColor,
            },
            "& .MuiTab-root": {
              minHeight: 40,
              py: 0.5,
              textTransform: "none",
              fontWeight: 500,
              fontSize: 13,
              "&.Mui-selected": { color: typeColor, fontWeight: 600 },
            },
          }}
        >
          <Tab icon={<TuneIcon sx={{ fontSize: 18 }} />} label="Basic" iconPosition="start" />
          <Tab icon={<ImageIcon sx={{ fontSize: 18 }} />} label="Media" iconPosition="start" />
          <Tab icon={<SettingsIcon sx={{ fontSize: 18 }} />} label="Advanced" iconPosition="start" />
        </Tabs>
      </Box>

      {/* Tab Content */}
      <DialogContent sx={{ px: 3, pt: 1, pb: 1 }}>
        {tabIndex === 0 && basicTab}
        {tabIndex === 1 && (
          <MediaTabComponent media={media} setMedia={setMedia} />
        )}
        {tabIndex === 2 && (
          <Box sx={{ p: 2, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              Advanced settings coming soon
            </Typography>
          </Box>
        )}
      </DialogContent>

      <Divider />

      {/* Actions */}
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button
          onClick={handleCloseEdit}
          sx={{
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 500,
            color: "text.secondary",
            "&:hover": { bgcolor: "action.hover" },
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          sx={{
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
            px: 3,
            background: `linear-gradient(135deg, ${typeColor}, ${typeColor}dd)`,
            boxShadow: `0 4px 15px ${typeColor}40`,
            "&:hover": {
              background: `linear-gradient(135deg, ${typeColor}dd, ${typeColor})`,
              boxShadow: `0 6px 20px ${typeColor}60`,
            },
          }}
        >
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditQuestionPopup;
