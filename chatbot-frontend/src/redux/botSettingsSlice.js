// src/redux/botSettingsSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  botName: 'chatbot',
  welcomeText: 'Hey',
  description: 'Descriptions',
  font: 'Nanum Gothic Coding',
  fontSize: '14px',
  companyLogo: 'https://cdn-icons-png.flaticon.com/512/4712/4712027.png',
  avatar: null,
  botPosition: 'right',
  selectedBubbleStyle: 'style1',
  borderRadius: 10,
  textAlign: 'left',
  themeColors: {
    header: "#006C74",
    question: "#ffffff",
    answer: "#007bff",
    option: "#007bff",
    optionBorder: "#444c5c",
    chatBackground: "#ffffff"
  },
  overlayOpacity: 0,
  chatColor: { r: 255, g: 255, b: 255, a: 1 },
  uploadedImage: null,
};

const botSettingsSlice = createSlice({
  name: 'botSettings',
  initialState,
  reducers: {
    updateSetting: (state, action) => {
      return { ...state, ...action.payload };
    },
    resetSettings: () => initialState
  }
});



export const { updateSetting, resetSettings } = botSettingsSlice.actions;
export default botSettingsSlice.reducer;
