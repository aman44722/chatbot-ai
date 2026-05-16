import React from "react";
import { Box, Typography } from "@mui/material";
import { useDrag } from "react-dnd";

// Icons
import AddIcon from "@mui/icons-material/Add";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import EmailIcon from "@mui/icons-material/Email";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import DoneOutlineIcon from "@mui/icons-material/DoneOutline";
import DialpadIcon from "@mui/icons-material/Dialpad";
import GradeIcon from "@mui/icons-material/Grade";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import HdrStrongIcon from "@mui/icons-material/HdrStrong";
import PublishIcon from "@mui/icons-material/Publish";
import DashboardCustomizeIcon from "@mui/icons-material/DashboardCustomize";
import RecentActorsIcon from "@mui/icons-material/RecentActors";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import KeyIcon from "@mui/icons-material/Key";
import FlipToFrontIcon from "@mui/icons-material/FlipToFront";
import RecommendIcon from "@mui/icons-material/Recommend";
import LensIcon from "@mui/icons-material/Lens";
import ContentPasteSearchIcon from "@mui/icons-material/ContentPasteSearch";
import BookOnlineIcon from "@mui/icons-material/BookOnline";
import TagIcon from "@mui/icons-material/Tag";

// ✅ COMPONENT FOR DRAGGABLE ITEM
const DraggableItem = ({ item }) => {
  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: "COMPONENT",
    item,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <Box
      ref={dragRef}
      sx={{
        backgroundColor: "#fff",
        border: "1px solid #E0E7FF",
        borderRadius: "10px",
        padding: "10px 8px",
        textAlign: "center",
        fontSize: "13px",
        fontWeight: 500,
        color: "#006C74",
        cursor: "grab",
        opacity: isDragging ? 0.5 : 1,
        transition: "0.2s",
        "&:hover": {
          backgroundColor: "#EEF2FF",
          borderColor: "#C7D2FE",
        },
      }}
    >
      <div style={{ fontSize: "20px" }}>{item.icon}</div>
      <div style={{ marginTop: "4px", lineHeight: "13px" }}>{item.label}</div>
    </Box>
  );
};

// ITEMS LIST
const componentItems = [
  {
    label: "Question",
    defaultLabel: "What is your name?",
    icon: <QuestionMarkIcon sx={{ fontSize: "35px", fontWeight: "bold" }} />,
    type: "question",
  },
  {
    label: (
      <>
        Single
        <br />
        Choice
      </>
    ),
    defaultLabel: "What is your gender?",
    icon: <DoneOutlineIcon sx={{ fontSize: "35px", fontWeight: "bold" }} />,
    type: "single_choice",
  },
  {
    label: "Email",
    defaultLabel: "Enter your email ID",
    icon: <EmailIcon sx={{ fontSize: "35px", fontWeight: "bold" }} />,
    type: "email_feild",
  },
  {
    label: (
      <>
        Multiple
        <br />
        Choice
      </>
    ),
    defaultLabel: "Select multiple options",
    icon: <DoneAllIcon sx={{ fontSize: "35px", fontWeight: "bold" }} />,
    type: "multiple_options",
  },
  {
    label: (
      <>
        Mobile
        <br />
        Number
      </>
    ),
    defaultLabel: "Enter your mobile number",
    icon: <DialpadIcon sx={{ fontSize: "35px", fontWeight: "bold" }} />,
    type: "mobile_number",
  },
  {
    label: "Number",
    defaultLabel: "Enter a number",
    icon: <TagIcon sx={{ fontSize: "35px", fontWeight: "bold" }} />,
    type: "number",
  },
  {
    label: "Rating",
    defaultLabel: "Give a rating",
    icon: <GradeIcon sx={{ fontSize: "35px", fontWeight: "bold" }} />,
    type: "rating",
  },
  {
    label: "Date Picker",
    defaultLabel: "Select a date",
    icon: <CalendarMonthIcon sx={{ fontSize: "35px", fontWeight: "bold" }} />,
    type: "date_picker",
  },
  {
    label: "Time Picker",
    defaultLabel: "Select a time",
    icon: <AccessTimeIcon sx={{ fontSize: "35px", fontWeight: "bold" }} />,
    type: "time_picker",
  },
  {
    label: "Location",
    defaultLabel: "Enter your location",
    icon: <LocationOnIcon sx={{ fontSize: "35px", fontWeight: "bold" }} />,
    type: "location",
  },
  {
    label: "Range",
    defaultLabel: "Choose a range",
    icon: <HdrStrongIcon sx={{ fontSize: "35px", fontWeight: "bold" }} />,
  },
  {
    label: "File Upload",
    defaultLabel: "Upload your file",
    icon: <PublishIcon sx={{ fontSize: "35px", fontWeight: "bold" }} />,
    type: "file_upload",
  },
  {
    label: "Website",
    defaultLabel: "Enter website URL",
    icon: (
      <DashboardCustomizeIcon sx={{ fontSize: "35px", fontWeight: "bold" }} />
    ),
    type: "website",
  },
  {
    label: "Ask Contacts",
    defaultLabel: "Select a contact",
    icon: <RecentActorsIcon sx={{ fontSize: "35px", fontWeight: "bold" }} />,
    type: "ask_contacts",
  },
  {
    label: "Order Items",
    defaultLabel: "Order your items",
    icon: <ShoppingCartIcon sx={{ fontSize: "35px", fontWeight: "bold" }} />,
    type: "order_items",
  },
  {
    label: "Authenticator",
    defaultLabel: "Enter OTP",
    icon: <KeyIcon sx={{ fontSize: "35px", fontWeight: "bold" }} />,
    type: "authenticator",
  },
  {
    label: "Form",
    defaultLabel: "Fill this form",
    icon: <FlipToFrontIcon sx={{ fontSize: "35px", fontWeight: "bold" }} />,
    type: "form",
  },
  {
    label: "Carousel with buttons",
    defaultLabel: "View carousel options",
    icon: <RecommendIcon sx={{ fontSize: "35px", fontWeight: "bold" }} />,
    type: "carousel_with_buttons",
  },
  {
    label: "Dynamic Question",
    defaultLabel: "Dynamic input",
    icon: <LensIcon sx={{ fontSize: "35px", fontWeight: "bold" }} />,
    type: "dynamic_question",
  },
  {
    label: "Real Time Search",
    defaultLabel: "Search here",
    icon: (
      <ContentPasteSearchIcon sx={{ fontSize: "35px", fontWeight: "bold" }} />
    ),
    type: "Real_time_search",
  },
  {
    label: "Appointment Booking",
    defaultLabel: "Book your appointment",
    icon: <BookOnlineIcon sx={{ fontSize: "35px", fontWeight: "bold" }} />,
    type: "appointment_booking",
  },
];

const FlowSidebarComponent = () => {
  return (
    <Box
      sx={{
        width: "30%",
        boxShadow: "0px 4px 20px #d8d8d8",
        borderRadius: "20px",
        borderRight: "1px solid #eee",
        overflowY: "auto",
        background: "#f9fbfd",
        padding: "30px",
        display: "flex",
        flexDirection: "column",
        gap: "30px",
      }}
    >
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            border: "1px solid #E5E7EB",
            borderRadius: "4px",
            padding: "6px 12px",
            backgroundColor: "#ffffff",
            boxShadow: "0px 4px 20px #d8d8d8",
            width: "100%",
          }}
        >
          <label style={{ fontWeight: 600, fontSize: "14px", color: "#555" }}>
            Main Flow
          </label>
        </Box>
        <AddIcon
          sx={{ cursor: "pointer", fontSize: "18px", color: "#6B7280", mr: 1 }}
        />
        <ContentCopyIcon
          sx={{ cursor: "pointer", fontSize: "18px", color: "#6B7280" }}
        />
      </Box>

      {/* Title */}
      <Typography
        sx={{ fontWeight: "bold", fontSize: "16px", textAlign: "center" }}
      >
        Ask User
      </Typography>

      {/* Components */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "12px",
        }}
      >
        {componentItems.map((item, index) => (
          <DraggableItem key={index} item={item} />
        ))}
      </Box>
    </Box>
  );
};

export default FlowSidebarComponent;
