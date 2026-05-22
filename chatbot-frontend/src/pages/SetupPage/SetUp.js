import React, { useState, useEffect } from 'react';
import './AdminSettings.css';
import { Box, Typography, Button } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import ChatPreview from '../../components/Admin/ViewSetupComponent/ChatPreview';
import LayoutSettings from '../../components/Admin/ViewSetupComponent/LayoutSettings';
import LogoSettings from '../../components/Admin/ViewSetupComponent/LogoSettings';
import TextSettings from '../../components/Admin/ViewSetupComponent/TextSettings';
import ThemeSettings from '../../components/Admin/ViewSetupComponent/ThemeSettings';
import { resetSettings, updateSetting } from '../../redux/botSettingsSlice';
import { EditChatBotSettings, fetchUserById } from '../../api/authApi';
import { getBotById, updateBot } from '../../api/botApi';
import { toast, ToastContainer } from 'react-toastify';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import ImageIcon from '@mui/icons-material/Image';
import ViewQuiltIcon from '@mui/icons-material/ViewQuilt';
import PaletteIcon from '@mui/icons-material/Palette';
import SaveIcon from '@mui/icons-material/Save';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

const TABS = [
  { key: 'text', label: 'Text', icon: <TextFieldsIcon /> },
  { key: 'logo', label: 'Logo', icon: <ImageIcon /> },
  { key: 'layout', label: 'Layout', icon: <ViewQuiltIcon /> },
  { key: 'themes', label: 'Themes', icon: <PaletteIcon /> },
];

const SetUp = () => {
  const dispatch = useDispatch();
  const {
    botName, welcomeText, description, font, fontSize, companyLogo,
    avatar, botPosition, selectedBubbleStyle, borderRadius, textAlign,
    themeColors, overlayOpacity, chatColor, uploadedImage
  } = useSelector((state) => state.botSettings);
  const [activeTab, setActiveTab] = useState('text');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isHeaderExpanded, setIsHeaderExpanded] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const selectedBotId = localStorage.getItem('selectedBotId');
        if (selectedBotId) {
          const botData = await getBotById(selectedBotId);
          if (botData?.botSettings) {
            dispatch(updateSetting(botData.botSettings));
          }
        } else {
          const user = JSON.parse(localStorage.getItem("user"));
          const userId = localStorage.getItem("userId");
          if (user && userId) {
            const userData = await fetchUserById(userId);
            if (userData?.botSettings) {
              dispatch(updateSetting(userData.botSettings));
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch bot settings:", err);
      }
    };
    fetchSettings();
  }, [dispatch]);

  const botSettings = useSelector((state) => state.botSettings);

  const handleSave = async () => {
    try {
      const selectedBotId = localStorage.getItem('selectedBotId');
      if (selectedBotId) {
        const response = await updateBot(selectedBotId, { botSettings });
        if (response) toast.success('Bot settings updated!!');
      } else {
        const response = await EditChatBotSettings(botSettings);
        if (response) toast.success('Bot settings updated!!');
      }
    } catch (error) {
      console.error('Error updating settings:', error);
      alert('Failed to update settings.');
    }
  };

  const handleReset = () => {
    dispatch(resetSettings());
    toast.info('Settings reset to default!');
  };

  return (
    <Box sx={{
      display: 'flex', height: 'calc(100vh - 60px)', gap: 1.5, p: 1.5,
      background: "linear-gradient(135deg, #f0f4ff 0%, #faf5ff 50%, #f0fdf4 100%)",
      overflow: 'hidden',
    }}>
      {/* Left Panel */}
      <Box className="custom-scrollbar" sx={{
        width: { xs: '100%', md: 340 }, minWidth: 0, flexShrink: 0,
        borderRadius: 3,
        background: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)",
        border: "1px solid rgba(229,231,235,0.5)",
        overflowY: 'auto', overflowX: 'hidden',
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Tab Navigation */}
        <Box sx={{
          position: 'sticky', top: 0, zIndex: 9,
          background: "rgba(255,255,255,0.9)", backdropFilter: "blur(12px)",
          borderBottom: "1px solid #f3f4f6", px: 1.5, py: 1.5,
        }}>
          <Typography sx={{ fontWeight: 700, fontSize: 15, color: "#111827", mb: 0.8 }}>
            Bot Settings
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            {TABS.map(tab => {
              const sel = activeTab === tab.key;
              return (
                <Button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  size="small"
                  sx={{
                    flex: 1, borderRadius: 1.5, textTransform: 'none',
                    fontWeight: sel ? 700 : 500, fontSize: 11, minWidth: 0,
                    px: 0.5, py: 0.6,
                    bgcolor: sel ? '#6366f1' : 'transparent',
                    color: sel ? '#fff' : '#6b7280',
                    border: sel ? 'none' : '1px solid #e5e7eb',
                    '&:hover': { bgcolor: sel ? '#4f46e5' : '#f3f4f6' },
                  }}
                >
                  {tab.label}
                </Button>
              );
            })}
          </Box>
        </Box>

        {/* Tab Content */}
        <Box sx={{ flex: 1, p: 1.5, overflowX: 'hidden' }}>
          {activeTab === 'text' && (
            <TextSettings
              botName={botName}
              setBotName={(value) => dispatch(updateSetting({ botName: value }))}
              welcomeText={welcomeText}
              setWelcomeText={(value) => dispatch(updateSetting({ welcomeText: value }))}
              description={description}
              setDescription={(value) => dispatch(updateSetting({ description: value }))}
              font={font}
              setFont={(value) => dispatch(updateSetting({ font: value }))}
              fontSize={fontSize}
              setFontSize={(value) => dispatch(updateSetting({ fontSize: value }))}
            />
          )}
          {activeTab === 'logo' && (
            <LogoSettings
              companyLogo={companyLogo}
              setCompanyLogo={(value) => dispatch(updateSetting({ companyLogo: value }))}
              avatar={avatar}
              setAvatar={(value) => dispatch(updateSetting({ avatar: value }))}
            />
          )}
          {activeTab === 'layout' && (
            <LayoutSettings
              botPosition={botPosition}
              setBotPosition={(value) => {
                dispatch(updateSetting({ botPosition: value }));
                setIsChatOpen(false);
              }}
              selectedBubbleStyle={selectedBubbleStyle}
              setSelectedBubbleStyle={(value) => dispatch(updateSetting({ selectedBubbleStyle: value }))}
              borderRadius={borderRadius}
              setBorderRadius={(value) => dispatch(updateSetting({ borderRadius: value }))}
              textAlign={textAlign}
              setTextAlign={(value) => dispatch(updateSetting({ textAlign: value }))}
            />
          )}
          {activeTab === 'themes' && (
            <ThemeSettings
              themeColors={themeColors}
              setThemeColors={(value) => dispatch(updateSetting({ themeColors: value }))}
              overlayOpacity={overlayOpacity}
              setOverlayOpacity={(value) => dispatch(updateSetting({ overlayOpacity: value }))}
              chatColor={chatColor}
              setChatColor={(value) => dispatch(updateSetting({ chatColor: value }))}
              uploadedImage={uploadedImage}
              setUploadedImage={(value) => dispatch(updateSetting({ uploadedImage: value }))}
            />
          )}
        </Box>

        {/* Save & Reset Footer */}
        <Box sx={{
          position: 'sticky', bottom: 0, zIndex: 9,
          background: "rgba(255,255,255,0.9)", backdropFilter: "blur(12px)",
          borderTop: "1px solid #f3f4f6", px: 1.5, py: 1.5,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <Typography sx={{ fontWeight: 600, fontSize: 12, color: "#374151" }}>
            Apply Changes?
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Button onClick={handleReset} variant="outlined" size="small" startIcon={<RestartAltIcon />}
              sx={{ borderRadius: 1.5, textTransform: 'none', fontWeight: 600, fontSize: 11, borderColor: '#e5e7eb', color: '#6b7280', px: 1, minWidth: 0, '&:hover': { borderColor: '#ef4444', color: '#ef4444' } }}>
              Reset
            </Button>
            <Button onClick={handleSave} variant="contained" size="small" startIcon={<SaveIcon />}
              sx={{ borderRadius: 1.5, textTransform: 'none', fontWeight: 600, fontSize: 11, bgcolor: '#6366f1', px: 1, minWidth: 0, '&:hover': { bgcolor: '#4f46e5' } }}>
              Save
            </Button>
          </Box>
        </Box>
      </Box>
      <ToastContainer />
      {/* Right Preview Panel */}
      <ChatPreview
        isChatOpen={isChatOpen}
        setIsChatOpen={setIsChatOpen}
        botPosition={botPosition}
        welcomeText={welcomeText}
        companyLogo={companyLogo}
        botName={botName}
        description={description}
        font={font}
        themeColors={themeColors}
        avatar={avatar}
        selectedBubbleStyle={selectedBubbleStyle}
        borderRadius={borderRadius}
        textAlign={textAlign}
        isHeaderExpanded={isHeaderExpanded}
        setIsHeaderExpanded={setIsHeaderExpanded}
        overlayOpacity={overlayOpacity}
      />
    </Box>
  );
};

export default SetUp;
