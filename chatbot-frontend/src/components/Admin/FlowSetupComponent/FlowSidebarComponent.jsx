import React, { useState } from "react";
import { Box, Typography, TextField, InputAdornment } from "@mui/material";
import { useDrag } from "react-dnd";
import SearchIcon from "@mui/icons-material/Search";
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

const ITEM_COLORS = {
  "Question": "#6366f1",
  "SingleChoice": "#f59e0b",
  "Email": "#10b981",
  "MultipleChoice": "#8b5cf6",
  "MobileNumber": "#ec4899",
  "Number": "#06b6d4",
  "Rating": "#f97316",
  "DatePicker": "#14b8a6",
  "TimePicker": "#6366f1",
  "Location": "#ef4444",
  "Range": "#f59e0b",
  "FileUpload": "#10b981",
  "Website": "#8b5cf6",
  "AskContacts": "#ec4899",
  "OrderItems": "#06b6d4",
  "Authenticator": "#f97316",
  "Form": "#14b8a6",
  "Carousel": "#ef4444",
  "DynamicQuestion": "#6366f1",
  "RealTimeSearch": "#f59e0b",
  "AppointmentBooking": "#10b981",
};

const getCategory = (type) => {
  const basic = ["question", "single_choice", "email_feild", "multiple_options", "mobile_number", "number"];
  const advanced = ["rating", "date_picker", "time_picker", "location", "range", "file_upload", "website"];
  const premium = ["ask_contacts", "order_items", "authenticator", "form", "carousel_with_buttons", "dynamic_question", "Real_time_search", "appointment_booking"];
  if (basic.includes(type)) return "Basic Inputs";
  if (advanced.includes(type)) return "Advanced Inputs";
  if (premium.includes(type)) return "Premium";
  return "Other";
};

const DraggableItem = ({ item }) => {
  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: "COMPONENT",
    item,
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  }));

  const color = ITEM_COLORS[item.label.replace(/\s/g, "")] || "#6366f1";

  return (
    <Box
      ref={dragRef}
      sx={{
        bgcolor: "rgba(255,255,255,0.9)",
        border: "1px solid rgba(229,231,235,0.6)",
        borderRadius: 2.5,
        p: 1,
        textAlign: "center",
        cursor: "grab",
        opacity: isDragging ? 0.4 : 1,
        transition: "all 0.2s",
        "&:hover": {
          bgcolor: `${color}08`,
          borderColor: `${color}40`,
          transform: "translateY(-2px)",
          boxShadow: `0 4px 12px ${color}20`,
        },
        userSelect: "none",
      }}
    >
      <Box sx={{ fontSize: 22, lineHeight: 1, color }}>{item.icon}</Box>
      <Typography sx={{
        fontSize: 10, fontWeight: 600, color: "#374151",
        mt: 0.5, lineHeight: 1.2,
      }}>
        {item.label}
      </Typography>
    </Box>
  );
};

const componentItems = [
  { label: "Question", defaultLabel: "What is your name?", icon: <QuestionMarkIcon />, type: "question" },
  { label: "Single Choice", defaultLabel: "What is your gender?", icon: <DoneOutlineIcon />, type: "single_choice" },
  { label: "Email", defaultLabel: "Enter your email ID", icon: <EmailIcon />, type: "email_feild" },
  { label: "Multiple Choice", defaultLabel: "Select multiple options", icon: <DoneAllIcon />, type: "multiple_options" },
  { label: "Mobile Number", defaultLabel: "Enter your mobile number", icon: <DialpadIcon />, type: "mobile_number" },
  { label: "Number", defaultLabel: "Enter a number", icon: <TagIcon />, type: "number" },
  { label: "Rating", defaultLabel: "Give a rating", icon: <GradeIcon />, type: "rating" },
  { label: "Date Picker", defaultLabel: "Select a date", icon: <CalendarMonthIcon />, type: "date_picker" },
  { label: "Time Picker", defaultLabel: "Select a time", icon: <AccessTimeIcon />, type: "time_picker" },
  { label: "Location", defaultLabel: "Enter your location", icon: <LocationOnIcon />, type: "location" },
  { label: "Range", defaultLabel: "Choose a range", icon: <HdrStrongIcon />, type: "range" },
  { label: "File Upload", defaultLabel: "Upload your file", icon: <PublishIcon />, type: "file_upload" },
  { label: "Website", defaultLabel: "Enter website URL", icon: <DashboardCustomizeIcon />, type: "website" },
  { label: "Ask Contacts", defaultLabel: "Select a contact", icon: <RecentActorsIcon />, type: "ask_contacts" },
  { label: "Order Items", defaultLabel: "Order your items", icon: <ShoppingCartIcon />, type: "order_items" },
  { label: "Authenticator", defaultLabel: "Enter OTP", icon: <KeyIcon />, type: "authenticator" },
  { label: "Form", defaultLabel: "Fill this form", icon: <FlipToFrontIcon />, type: "form" },
  { label: "Carousel", defaultLabel: "View carousel options", icon: <RecommendIcon />, type: "carousel_with_buttons" },
  { label: "Dynamic Question", defaultLabel: "Dynamic input", icon: <LensIcon />, type: "dynamic_question" },
  { label: "Real Time Search", defaultLabel: "Search here", icon: <ContentPasteSearchIcon />, type: "Real_time_search" },
  { label: "Appointment Booking", defaultLabel: "Book your appointment", icon: <BookOnlineIcon />, type: "appointment_booking" },
];

const categories = ["Basic Inputs", "Advanced Inputs", "Premium"];

const FlowSidebarComponent = () => {
  const [search, setSearch] = useState("");

  const filtered = search.trim()
    ? componentItems.filter((item) =>
        item.label.toLowerCase().includes(search.toLowerCase())
      )
    : componentItems;

  return (
    <Box sx={{
      width: { xs: "100%", md: 260 },
      maxHeight: { xs: "auto", md: "calc(100vh - 60px)" },
      overflowY: "auto",
      flexShrink: 0,
      background: "rgba(255,255,255,0.85)",
      backdropFilter: "blur(12px)",
      borderRight: { xs: "none", md: "1px solid rgba(229,231,235,0.5)" },
      borderBottom: { xs: "1px solid rgba(229,231,235,0.5)", md: "none" },
      p: { xs: 1.5, md: 2 },
    }}>
      <Box sx={{
        display: "flex", alignItems: "center", gap: 1,
        mb: 1.5, px: 0.5,
      }}>
        <Box sx={{
          width: 28, height: 28, borderRadius: "8px",
          bgcolor: "#6366f115", display: "flex",
          alignItems: "center", justifyContent: "center",
          color: "#6366f1",
        }}>
          <DashboardCustomizeIcon sx={{ fontSize: 16 }} />
        </Box>
        <Typography sx={{ fontWeight: 700, fontSize: 15, color: "#111827" }}>
          Components
        </Typography>
      </Box>

      <TextField
        placeholder="Search components..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        size="small"
        fullWidth
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ fontSize: 16, color: "#9ca3af" }} />
            </InputAdornment>
          ),
        }}
        sx={{
          mb: 1.5,
          "& .MuiOutlinedInput-root": {
            borderRadius: "10px", bgcolor: "rgba(255,255,255,0.9)",
            fontSize: 13,
            "& fieldset": { borderColor: "#e5e7eb" },
            "&:hover fieldset": { borderColor: "#c7d2fe" },
            "&.Mui-focused fieldset": { borderColor: "#6366f1", borderWidth: 1.5 },
          },
        }}
      />

      {search.trim() ? (
        <Box sx={{
          display: "grid",
          gridTemplateColumns: { xs: "repeat(4,1fr)", sm: "repeat(5,1fr)", md: "repeat(3,1fr)" },
          gap: 0.8,
        }}>
          {filtered.map((item, i) => (
            <DraggableItem key={i} item={item} />
          ))}
        </Box>
      ) : (
        categories.map((cat) => {
          const items = componentItems.filter((i) => getCategory(i.type) === cat);
          return (
            <Box key={cat} sx={{ mb: 1.5 }}>
              <Typography sx={{
                fontSize: 11, fontWeight: 700, color: "#9ca3af",
                textTransform: "uppercase", letterSpacing: "0.5px",
                mb: 0.8, px: 0.5,
              }}>
                {cat}
              </Typography>
              <Box sx={{
                display: "grid",
                gridTemplateColumns: { xs: "repeat(4,1fr)", sm: "repeat(5,1fr)", md: "repeat(3,1fr)" },
                gap: 0.8,
              }}>
                {items.map((item, i) => (
                  <DraggableItem key={i} item={item} />
                ))}
              </Box>
            </Box>
          );
        })
      )}
    </Box>
  );
};

export default FlowSidebarComponent;
