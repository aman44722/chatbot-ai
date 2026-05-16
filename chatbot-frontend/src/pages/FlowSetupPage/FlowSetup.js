import { Box } from '@mui/material'
import React from 'react'
// import ChatPreview from '../../components/Admin/ViewSetupComponent/ChatPreview'
import FlowSidebarComponent from '../../components/Admin/FlowSetupComponent/FlowSidebarComponent'
import FlowCanvasComponent from '../../components/Admin/FlowSetupComponent/FlowCanvasComponent'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend';
import { SnackbarProvider } from "notistack";

const FlowSetup = () => {
   return (
      <DndProvider backend={HTML5Backend}>
         <Box sx={{ display: 'flex', }}>
            <FlowSidebarComponent />
            <SnackbarProvider
               maxSnack={3}
               anchorOrigin={{ vertical: "top", horizontal: "right" }}
               autoHideDuration={3000}
            >
               <FlowCanvasComponent />
            </SnackbarProvider>
         </Box>
      </DndProvider>

   )
}

export default FlowSetup
