import React, { useState } from "react";
import OptionList from "./Fetures/Ouestions/BasicTabs/SingleChoiceTab/OptionInputRow";
import BotPreviewDialogPopup from "./Fetures/Ouestions/BotPreviewDialogPopup";
// import OptionList from "./OptionList";
// import BotPreviewDialogPopup from "./BotPreviewDialogPopup";

const BotSettings = () => {
  const [options, setOptions] = useState([{ text: "Option 1" }]); // Default option

  // Add a new option to the list
  const handleAddOption = () => {
    setOptions([...options, { text: "" }]); // Add new empty option
  };

  // Handle option text change
  const handleOptionChange = (index, newValue) => {
    const updatedOptions = [...options];
    updatedOptions[index].text = newValue;
    setOptions(updatedOptions); // Update parent state
  };

  // Delete an option
  const handleDeleteOption = (index) => {
    const updatedOptions = options.filter((_, i) => i !== index);
    setOptions(updatedOptions); // Update parent state
  };

  return (
    <div>
      <OptionList
        options={options}
        handleAddOption={handleAddOption}
        handleOptionChange={handleOptionChange}
        handleDeleteOption={handleDeleteOption}
      />
      <BotPreviewDialogPopup
        open={true}
        onClose={() => {}}
        droppedItems={options}
      />
    </div>
  );
};

export default BotSettings;
