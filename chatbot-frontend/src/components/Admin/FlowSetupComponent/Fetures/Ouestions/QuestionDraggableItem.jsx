import { useState, useRef } from "react";
import {
  Box,
  IconButton,
  LinearProgress,
  Typography,
  Dialog,
  Button,
} from "@mui/material";
import { useDrag, useDrop } from "react-dnd";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CallSplitIcon from "@mui/icons-material/CallSplit";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { useSnackbar } from "notistack";

const ItemType = "DROPPED_ITEM";

const QuestionDraggableItem = ({
  item,
  index,
  moveItem,
  onEdit,
  onDelete,
  onDuplicate,
  onConditional,
}) => {
  const ref = useRef(null);
  const { enqueueSnackbar } = useSnackbar();

  const [isHovering, setIsHovering] = useState(false);
  const [progress, setProgress] = useState(0);
  const [draggingOpacity, setDraggingOpacity] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const triggerProgress = () => {
    setIsHovering(true);
    setDraggingOpacity(0.3);
    setProgress(0);
    let value = 0;
    const interval = setInterval(() => {
      value += 10;
      setProgress(value);
      if (value >= 100) {
        clearInterval(interval);
        setIsHovering(false);
        setDraggingOpacity(1);
      }
    }, 60);
  };

  const [, drop] = useDrop({
    accept: ItemType,
    hover(draggedItem, monitor) {
      if (!ref.current) return;
      const dragIndex = draggedItem.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;
      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;
      moveItem(dragIndex, hoverIndex);
      draggedItem.index = hoverIndex;
      triggerProgress();
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 0.5 }}>
        <Box ref={ref} sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          border: isDragging ? "2px dashed #6366f1" : "1px solid #f3f4f6",
          p: "8px 14px",
          borderRadius: 2.5,
          bgcolor: isDragging ? "#6366f106" : "rgba(255,255,255,0.9)",
          position: "relative",
          boxShadow: isDragging
            ? "0 4px 16px rgba(99,102,241,0.15)"
            : "0 1px 3px rgba(0,0,0,0.04)",
          opacity: draggingOpacity,
          transition: "all 0.2s",
          cursor: "grab",
          "&:hover": {
            borderColor: "#e5e7eb",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          },
        }}>
          <DragIndicatorIcon sx={{ fontSize: 16, color: "#d1d5db", flexShrink: 0 }} />

          <Box className="icon-size-custome" sx={{ fontSize: 10, color: "#6366f1", display: "flex", flexShrink: 0 }}>
            {item.icon}
          </Box>

          <Typography
            sx={{
              flex: 1, fontSize: 13, fontWeight: 600, color: "#111827",
              whiteSpace: "pre-wrap", lineHeight: 1.3,
            }}
            dangerouslySetInnerHTML={{ __html: item.text }}
          />

          <Box sx={{ display: "flex", gap: 0.3, flexShrink: 0 }}>
            <IconButton onClick={() => onEdit(item)} size="small" sx={{ color: "#6366f1", "&:hover": { bgcolor: "#6366f112" } }}>
              <EditIcon sx={{ fontSize: 17 }} />
            </IconButton>
            <IconButton onClick={() => onDuplicate(item)} size="small" sx={{ color: "#10b981", "&:hover": { bgcolor: "#10b98112" } }}>
              <ContentCopyIcon sx={{ fontSize: 17 }} />
            </IconButton>
            <IconButton onClick={() => onConditional(item.id)} size="small" sx={{ color: "#f59e0b", "&:hover": { bgcolor: "#f59e0b12" } }}>
              <CallSplitIcon sx={{ fontSize: 17 }} />
            </IconButton>
            <IconButton onClick={() => setDeleteDialogOpen(true)} size="small" sx={{ color: "#ef4444", "&:hover": { bgcolor: "#ef444412" } }}>
              <DeleteIcon sx={{ fontSize: 17 }} />
            </IconButton>
          </Box>

          {isHovering && (
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                position: "absolute", bottom: 0, left: 0, width: "100%",
                height: 3, borderRadius: "0 0 10px 10px",
                bgcolor: "transparent",
                "& .MuiLinearProgress-bar": { bgcolor: "#6366f1" },
              }}
            />
          )}
        </Box>

        <Box sx={{
          bgcolor: "#3b82f6", color: "#fff",
          px: 1.2, py: 0.5, borderRadius: 1.5,
          fontWeight: 600, fontSize: 11, whiteSpace: "nowrap",
          mt: 0.5, flexShrink: 0,
        }}>
          User's reply
        </Box>
      </Box>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <Box p={3} sx={{ textAlign: "center" }}>
          <Typography variant="h6" fontWeight="bold" mb={2}>
            Delete Question
          </Typography>
          <Typography mb={3} sx={{ color: "#6b7280", fontSize: 14 }}>
            Are you sure you want to delete this question?
          </Typography>
          <Box display="flex" justifyContent="center" gap={2}>
            <Button
              onClick={() => setDeleteDialogOpen(false)}
              variant="outlined"
              sx={{
                borderColor: "#d1d5db", color: "#374151", minWidth: 100, borderRadius: "10px",
                textTransform: "none", fontWeight: 600,
                "&:hover": { borderColor: "#9ca3af" },
              }}
            >
              No
            </Button>
            <Button
              onClick={() => {
                onDelete(item.id);
                setDeleteDialogOpen(false);
                enqueueSnackbar("Question deleted successfully", {
                  variant: "success",
                });
              }}
              variant="contained"
              sx={{
                bgcolor: "#ef4444", color: "#fff", minWidth: 100, borderRadius: "10px",
                textTransform: "none", fontWeight: 600,
                "&:hover": { bgcolor: "#dc2626" },
              }}
            >
              Yes
            </Button>
          </Box>
        </Box>
      </Dialog>
    </>
  );
};

export default QuestionDraggableItem;
