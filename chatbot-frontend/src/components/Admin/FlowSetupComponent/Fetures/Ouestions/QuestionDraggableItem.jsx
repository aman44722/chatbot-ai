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
import { useSnackbar } from "notistack";

// Unique ID generation function
const generateUniqueId = () => {
  return "q" + Math.random().toString(36).substr(2, 9); // Unique ID generation logic
};

const ItemType = "DROPPED_ITEM";

const QuestionDraggableItem = ({
  item,
  index,
  moveItem,
  onEdit,
  onDelete,
  onDuplicate,
  onConditional,
  addUniqueQuestion, // Function to handle adding a new question with unique ID
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
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
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

  // Add unique ID to the new question when it is dragged
  const handleDrag = () => {
    const newQuestion = {
      ...item,
      id: generateUniqueId(), // Assign a new unique ID
    };
    addUniqueQuestion(newQuestion); // Add the new question with unique ID to the list
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          margin: "0px 0 0 4%",
          gap: "8px",
        }}
      >
        <Box
          ref={ref}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            border: isDragging ? "2px dashed #000" : "1px solid #E5E7EB",
            padding: "0 16px",
            borderRadius: "10px",
            width: "100%",
            backgroundColor: "#F3F4F6",
            position: "relative",
            boxShadow: isDragging ? "0px 0px 6px rgba(0,0,0,0.15)" : "none",
            opacity: draggingOpacity,
            transition: "opacity 0.3s ease-in-out",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
              padding: "0 16px",
              borderRadius: "10px",
              width: "95%",
            }}
          >
            {/* Typography */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box className="icon-size-custome" sx={{ fontSize: "10px" }}>
                {item.icon}
              </Box>
              <Typography
                sx={{ whiteSpace: "pre-wrap", fontWeight: 500 }}
                dangerouslySetInnerHTML={{ __html: item.text }}
              />
            </Box>

            {/* Icon */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <IconButton onClick={() => onEdit(item)}>
                <EditIcon />
              </IconButton>
              <IconButton onClick={() => onDuplicate(item)}>
                <ContentCopyIcon />
              </IconButton>
              <IconButton onClick={() => onConditional(item.id)}>
                <CallSplitIcon />
              </IconButton>
              <IconButton onClick={() => setDeleteDialogOpen(true)}>
                <DeleteIcon />
              </IconButton>
            </Box>

            {/* Drag Progress Bar */}
            {isHovering && (
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  width: "100%",
                  height: "5px",
                  borderRadius: "0 0 8px 8px",
                }}
              />
            )}
          </Box>
        </Box>

        {/* User Reply Static */}
        <Box
          sx={{
            backgroundColor: "#3b82f6",
            color: "#fff",
            padding: "6px 14px",
            borderRadius: "6px",
            fontWeight: 500,
            fontSize: "14px",
          }}
        >
          User's reply
        </Box>
      </Box>

      {/* Deletion Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <Box p={3} sx={{ textAlign: "center" }}>
          <Typography variant="h6" fontWeight="bold" mb={2}>
            Delete Question
          </Typography>
          <Typography mb={3}>
            Are you sure you want to delete this question?
          </Typography>
          <Box display="flex" justifyContent="center" gap={2}>
            <Button
              onClick={() => setDeleteDialogOpen(false)}
              variant="outlined"
              sx={{ borderColor: "#4F46E5", color: "#4F46E5", minWidth: 100 }}
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
                backgroundColor: "#4F46E5",
                color: "#fff",
                minWidth: 100,
                ":hover": { backgroundColor: "#4338CA" },
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
