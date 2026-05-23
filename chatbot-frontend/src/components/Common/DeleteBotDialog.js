import React from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box,
} from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

const DeleteBotDialog = ({ open, botName, deleting, onClose, onConfirm }) => (
  <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth
    PaperProps={{
      sx: {
        borderRadius: 4, overflow: "hidden", maxWidth: 400,
        position: "relative",
        "&::before": {
          content: '""', position: "absolute", inset: 0,
          background: `
            radial-gradient(600px circle at 20% 10%, rgba(239,68,68,0.06) 0%, transparent 60%),
            radial-gradient(400px circle at 80% 90%, rgba(239,68,68,0.04) 0%, transparent 60%)
          `,
          animation: "deleteWaterFlow 8s ease-in-out infinite",
          pointerEvents: "none",
        },
        "@keyframes deleteWaterFlow": {
          "0%,100%": { backgroundPosition: "0% 0%" },
          "50%": { backgroundPosition: "100% 100%" },
        },
      },
    }}
  >
    <Box sx={{
      position: "relative", zIndex: 1,
      "&::before": {
        content: '""', position: "absolute", top: 0, left: 0, right: 0, height: 3,
        background: "linear-gradient(90deg, #ef4444, #dc2626, #f97316)",
      },
    }}>
      <DialogTitle sx={{ pt: 3, pb: 1, display: "flex", alignItems: "center", gap: 1.5 }}>
        <Box sx={{
          width: 42, height: 42, borderRadius: "12px",
          background: "linear-gradient(135deg, #ef4444, #dc2626)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 6px 20px rgba(239,68,68,0.3)",
          flexShrink: 0,
        }}>
          <WarningAmberIcon sx={{ color: "#fff", fontSize: 22 }} />
        </Box>
        <Box>
          <Typography sx={{ fontWeight: 800, fontSize: 16, color: "#1f2937", letterSpacing: "-0.3px" }}>
            Delete Bot
          </Typography>
          <Typography sx={{ fontSize: 13, color: "#6b7280", fontWeight: 400 }}>
            This action cannot be undone
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pb: 1 }}>
        <Box sx={{
          p: 2, borderRadius: 2.5, mb: 1,
          bgcolor: "#fef2f2", border: "1px solid #fecaca",
        }}>
          <Typography sx={{ fontSize: 14, color: "#991b1b", lineHeight: 1.6 }}>
            Are you sure you want to delete <strong>"{botName}"</strong>? All data, conversations, and settings will be permanently removed.
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 2.5, pb: 2.5, gap: 1 }}>
        <Button onClick={onClose} disabled={deleting}
          sx={{
            borderRadius: "10px", textTransform: "none", fontWeight: 600,
            color: "#6b7280", px: 2.5,
            "&:hover": { bgcolor: "#f3f4f6" },
          }}>
          Cancel
        </Button>
        <Button variant="contained" onClick={onConfirm} disabled={deleting}
          startIcon={<DeleteForeverIcon />}
          sx={{
            borderRadius: "10px", textTransform: "none", fontWeight: 700, px: 3,
            background: "linear-gradient(135deg, #ef4444, #dc2626)",
            boxShadow: "0 4px 14px rgba(239,68,68,0.35)",
            "&:hover": {
              background: "linear-gradient(135deg, #dc2626, #b91c1c)",
              boxShadow: "0 6px 20px rgba(239,68,68,0.45)",
            },
            "&.Mui-disabled": { background: "#d1d5db" },
          }}>
          Delete Bot
        </Button>
      </DialogActions>
    </Box>
  </Dialog>
);

export default DeleteBotDialog;
