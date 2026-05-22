import { Box } from '@mui/material'
import React from 'react'
import FlowSidebarComponent from '../../components/Admin/FlowSetupComponent/FlowSidebarComponent'
import FlowCanvasComponent from '../../components/Admin/FlowSetupComponent/FlowCanvasComponent'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend';
import { SnackbarProvider } from "notistack";

const FlowSetup = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <Box sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        gap: { xs: 2, md: 0 },
        p: { xs: 0, md: 0 },
        background: "linear-gradient(135deg, #f0f4ff 0%, #faf5ff 50%, #f0fdf4 100%)",
        minHeight: "calc(100vh - 60px)",
      }}>
        <SnackbarProvider
          maxSnack={3}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          autoHideDuration={3000}
        >
          <FlowSidebarComponent />
          <FlowCanvasComponent />
        </SnackbarProvider>
      </Box>
    </DndProvider>
  )
}

export default FlowSetup
