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
import QuestionTab from "./BasicTabs/QuestionTab/QuestionTab";
import NumberTab from "./BasicTabs/NumberTab/NumberTab";
import EmailTab from "./BasicTabs/EmailTab/EmailTab";
import MultipleChoiceTab from "./BasicTabs/MultipleChoiceTab/MultipleChoiceTab";
import MobileNumberTab from "./BasicTabs/MobileNumberTab/MobileNumberTab";
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
  const [options, setOptions] = useState([]);
  const [flexDirection, setFlexDirection] = useState("column");
  const [media, setMedia] = useState({ picImg });
  const [skipOption, setSkipOption] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [validations, setValidations] = useState({});

  useEffect(() => {
    if (editingItem) {
      setText(editingItem.text || "");
      setOptions(editingItem.options);
      setFlexDirection(editingItem.flexDirection || "column");
      setSkipOption(editingItem.skipOption || false);
      setMedia(editingItem.media || {});
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
              <Box
                sx={{ display: "flex", alignItems: "center", mb: 2, gap: 2 }}
              >
                <Switch checked={skipOption} onChange={handleSwitchChange} />
                <Typography sx={{ fontWeight: 500, color: "#6b7280" }}>
                  {skipOption ? "Give Skip Option" : "Do Not Give Skip Option"}
                </Typography>
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
