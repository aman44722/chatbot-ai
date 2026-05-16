import React from "react";
import { Box, Button, Typography } from "@mui/material";
import ShowOptionsButtons from "./Options/ShowOptionsButtons";
import OptionInputRow from "./Options/OptionInputRow";
// import ShowOptionsButtons from "./ShowOptionsButtons";
// import OptionInputRow from "./OptionInputRow";

const SingleChoiceTab = () => {
  return (
    <>
      <div>
        <ShowOptionsButtons />
        <OptionInputRow />
      </div>

    </>
  );
};

export default SingleChoiceTab;
