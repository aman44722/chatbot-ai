import React, { useState, useRef, useEffect } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import avt1 from "../../../assets/images/avatar/avatar-v101.svg";
import avt2 from "../../../assets/images/avatar/avatar-v102.svg";
import avt3 from "../../../assets/images/avatar/avatar-v103.svg";
import avt4 from "../../../assets/images/avatar/avatar-v104.svg";
import avt5 from "../../../assets/images/avatar/avatar-v105.svg";
import avt6 from "../../../assets/images/avatar/avatar-v107.svg";
import avt7 from "../../../assets/images/avatar/avatar-v108.svg";
import avt8 from "../../../assets/images/avatar/avatar-v109.svg";
import avt9 from "../../../assets/images/avatar/avatar-v110.svg";
import avt10 from "../../../assets/images/avatar/avatar-v111.svg";

const SectionCard = ({ title, desc, children }) => (
  <Box sx={{
    bgcolor: "#f9fafb", borderRadius: 2.5, p: 1.5, mb: 1.5,
    border: "1px solid #f3f4f6",
  }}>
    <Typography sx={{ fontWeight: 700, fontSize: 13, color: "#111827", mb: 0.1 }}>{title}</Typography>
    {desc && <Typography sx={{ fontSize: 11, color: "#9ca3af", mb: 1 }}>{desc}</Typography>}
    {children}
  </Box>
);

const LogoSettings = ({ companyLogo, setCompanyLogo, avatar, setAvatar }) => {
  const scrollRef = useRef(null);

  const defaultAvatars = [avt1, avt2, avt3, avt4, avt5, avt6, avt7, avt8, avt9, avt10];
  const [avatarOptions, setAvatarOptions] = useState(defaultAvatars);
  const [showLeftArrow, setShowLeftArrow] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handleScroll = () => setShowLeftArrow(el.scrollLeft > 5);
    el.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollLeft = () => scrollRef.current?.scrollBy({ left: -120, behavior: "smooth" });
  const scrollRight = () => scrollRef.current?.scrollBy({ left: 120, behavior: "smooth" });

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.size < 5 * 1024 * 1024) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarOptions((prev) => [reader.result, ...prev]);
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      alert("File size must be under 5MB");
    }
  };

  return (
    <div>
      <SectionCard title="Company Logo" desc="Upload your brand logo that appears in the chat header.">
        {companyLogo ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mt: 0.5 }}>
            <Box sx={{ position: "relative" }}>
              <Box sx={{ width: 64, height: 64, borderRadius: "50%", overflow: "hidden", border: "3px solid #e5e7eb", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
                <img src={companyLogo} alt="logo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </Box>
              <IconButton onClick={() => setCompanyLogo("")} size="small" sx={{ position: "absolute", top: -6, right: -6, bgcolor: "#fff", boxShadow: "0 2px 6px rgba(0,0,0,0.12)", "&:hover": { bgcolor: "#fee2e2" }, width: 20, height: 20 }}>
                <CloseIcon sx={{ fontSize: 12, color: "#ef4444" }} />
              </IconButton>
            </Box>
            <Typography sx={{ fontSize: 11, color: "#9ca3af" }}>Click ✕ to remove</Typography>
          </Box>
        ) : (
          <Box component="label" htmlFor="upload-logo" sx={{
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            border: "2px dashed #d1d5db", borderRadius: 2, p: 2, cursor: "pointer", mt: 0.5,
            transition: "all 0.2s", "&:hover": { borderColor: "#6366f1", bgcolor: "#6366f104" },
          }}>
            <CloudUploadIcon sx={{ fontSize: 28, color: "#9ca3af", mb: 0.5 }} />
            <Typography sx={{ fontWeight: 600, fontSize: 12, color: "#6b7280" }}>Upload Logo</Typography>
            <Typography sx={{ fontSize: 10, color: "#9ca3af", mt: 0.2 }}>Max 5 MB</Typography>
            <input id="upload-logo" type="file" accept="image/*" style={{ display: "none" }}
              onChange={(e) => {
                const file = e.target.files[0];
                if (file && file.size < 5 * 1024 * 1024) {
                  const reader = new FileReader();
                  reader.onloadend = () => setCompanyLogo(reader.result);
                  reader.readAsDataURL(file);
                } else alert("File size exceeds 5MB");
              }} />
          </Box>
        )}
      </SectionCard>

      <SectionCard title="Bot Avatar" desc="Choose an avatar for your bot.">
        <Box sx={{ position: "relative", mt: 0.5 }}>
          {showLeftArrow && (
            <Box onClick={scrollLeft} sx={{
              position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", zIndex: 1,
              width: 18, height: 32, borderRadius: "0 6px 6px 0", bgcolor: "#6366f1", color: "#fff",
              display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 11,
              "&:hover": { bgcolor: "#4f46e5" },
            }}>◀</Box>
          )}

          <Box ref={scrollRef} sx={{
            display: "flex", overflowX: "auto", gap: 1, p: 1,
            borderRadius: 2, border: "1px solid #e5e7eb", scrollBehavior: "smooth", bgcolor: "#fff",
          }}>
            <Box component="label" htmlFor="upload-avatar" sx={{
              width: 38, height: 38, borderRadius: "50%", bgcolor: "#f3f4f6",
              display: "flex", justifyContent: "center", alignItems: "center",
              cursor: "pointer", border: "2px dashed #d1d5db", flexShrink: 0,
              "&:hover": { borderColor: "#6366f1" },
            }}>
              <AddIcon sx={{ fontSize: 18, color: "#9ca3af" }} />
              <input id="upload-avatar" type="file" accept="image/*" style={{ display: "none" }} onChange={handleAvatarUpload} />
            </Box>

            {avatarOptions.map((avt, index) => (
              <Box key={index} onClick={() => setAvatar(avt)} sx={{
                width: 38, height: 38, borderRadius: "50%", overflow: "hidden", position: "relative",
                border: avt === avatar ? "2.5px solid #10b981" : "2px solid transparent",
                cursor: "pointer", transition: "all 0.2s", flexShrink: 0,
                "&:hover": { transform: "scale(1.08)" },
              }}>
                <img src={avt} alt="avatar" style={{
                  position: "absolute", inset: 0, width: "100%", height: "100%",
                  objectFit: "cover", borderRadius: "50%",
                }} />
              </Box>
            ))}
          </Box>

          <Box onClick={scrollRight} sx={{
            position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)", zIndex: 1,
            width: 18, height: 32, borderRadius: "6px 0 0 6px", bgcolor: "#6366f1", color: "#fff",
            display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 11,
            "&:hover": { bgcolor: "#4f46e5" },
          }}>▶</Box>
        </Box>
      </SectionCard>
    </div>
  );
};

export default LogoSettings;
