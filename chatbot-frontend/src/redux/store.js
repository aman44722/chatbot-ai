// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import botSettingsReducer from './botSettingsSlice';

export const store = configureStore({
  reducer: {
    botSettings: botSettingsReducer
  }
});
