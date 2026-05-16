import "./Style.css";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Switch,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import MediaTabComponent from "../../MediaUploadComponet/MediaTabComponent";
import CustomTextEditor from "./CustomTextEditor";
// import SingleChoiceTab from "./BasicTabs/SingleChoiceTab/SingleChoiceTab";
import QuestionTab from "./BasicTabs/QuestionTab/QuestionTab";
import NumberTab from "./BasicTabs/NumberTab/NumberTab";
import EmailTab from "./BasicTabs/EmailTab/EmailTab";
import MultipleChoiceTab from "./BasicTabs/MultipleChoiceTab/MultipleChoiceTab";
import MobileNumberTab from "./BasicTabs/MobileNumberTab/MobileNumberTab";
// import SingleChoiceTab from "./BasicTabs/SingleChoiceTab/SingleChoiceTab";
import OptionList from "./BasicTabs/SingleChoiceTab/Options/OptionInputRow";
import ShowOptionsButtons from "./BasicTabs/SingleChoiceTab/Options/ShowOptionsButtons";
import picImg from "./picture.svg";

const EditQuestionPopup = ({
  openEdit,
  handleCloseEdit,
  editingItem,
  onUpdate,
}) => {
  const [tabIndex, setTabIndex] = useState(0);
  const [text, setText] = useState("");
  const [options, setOptions] = useState("New Option");
  const [flexDirection, setFlexDirection] = useState("column");
  const [media, setMedia] = useState({ picImg });
  const [skipOption, setSkipOption] = useState(false);
  const [inputText, setInputText] = useState("Please enter a valid answer");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // Populate form data if editing an existing item
    if (editingItem) {
      setText(editingItem.text || "");
      setOptions(editingItem.options);
      setFlexDirection(editingItem.flexDirection || "column");
      setSkipOption(editingItem.skipOption || false); // Ensure boolean value
      setMedia(editingItem.media || {});
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

    // Check if options is an array or string and validate accordingly
    if (Array.isArray(options)) {
      if (options.some((option) => option.trim() === "")) {
        return;
      }
    } else if (typeof options === "string" && options.trim() === "") {
      return;
    }

    // Pass media as "" if removed, otherwise pass the media URL
    onUpdate({
      ...editingItem,
      text,
      options,
      skipOption, // Pass updated skipOption state
      flexDirection,
      media: media || "", // Ensure empty string is sent if removed
    });

    console.log("options - ", options);
    console.log("flexDirection - ", flexDirection);
    console.log("text - ", text);
    console.log("media - ", media);
    console.log("skipOption - ", skipOption);

    handleCloseEdit();
  };

  return (
    <Dialog open={openEdit} onClose={handleCloseEdit} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Question</DialogTitle>

      <DialogContent>
        <Typography variant="caption" color="textSecondary">
          Note: Please press "Enter" for Paragraph break
        </Typography>

        {/* Custom Text Editor */}
        <CustomTextEditor value={text} onChange={setText} />

        {/* Tabs */}
        <Tabs value={tabIndex} onChange={handleTabChange} sx={{ mb: 2 }}>
          <Tab label="Basic" />
          <Tab label="Media" />
          <Tab label="Advanced" />
        </Tabs>

        {tabIndex === 0 && (
          <Box>
            {editingItem?.type === "question" ? (
              <QuestionTab
                skipOption={skipOption} // Pass the current skipOption state
                setSkipOption={setSkipOption} // Pass the setter function to handle updates
                errorMessage={errorMessage}
                setErrorMessage={setErrorMessage}
              />
            ) : editingItem?.type === "single_choice" ? (
              <Box>
                <ShowOptionsButtons
                  flexDirection={flexDirection}
                  setFlexDirection={setFlexDirection}
                />
                <OptionList value={options} onChange={setOptions} />
              </Box>
            ) : editingItem?.type === "email_feild" ? (
              <EmailTab
                skipOption={skipOption} // Pass the current skipOption state
                setSkipOption={setSkipOption} // Pass the setter function to handle updates
                errorMessage={errorMessage}
                setErrorMessage={setErrorMessage}
              />
            ) : editingItem?.type === "multiple_choice" ? (
              <MultipleChoiceTab />
            ) : editingItem?.type === "mobile_number" ? (
              <MobileNumberTab />
            ) : editingItem?.type === "number" ? (
              <NumberTab />
            ) : (
              <Box
                sx={{ display: "flex", alignItems: "center", mb: 2, gap: 2 }}
              >
                <Typography>Do Not Give Skip Option</Typography>
                <Switch
                  checked={skipOption} // Toggle state based on current skipOption value
                  onChange={handleSwitchChange} // Call the handleSwitchChange to update the skipOption
                />
              </Box>
            )}
          </Box>
        )}
        {tabIndex === 1 && (
          <MediaTabComponent media={media} setMedia={setMedia} />
        )}
        {tabIndex === 2 && (
          <Typography variant="body2">
            Advanced tab content goes here.
          </Typography>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleCloseEdit}>Cancel</Button>
        <Button variant="contained" onClick={handleSave}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditQuestionPopup;
