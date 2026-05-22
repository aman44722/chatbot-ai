// App.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Common/Layout';
import Dashboard from './pages/Dashboard';
import Chats from './pages/Chats';
import Users from './pages/Users';
import Answers from './pages/Answers';
import Leads from './pages/Leads';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Logout from './pages/Logout';
import UserMessage from './components/UserMessage/UserMessage';
import SetUp from './pages/SetupPage/SetUp';
import FlowSetup from './pages/FlowSetupPage/FlowSetup';
import AuthForm from './components/LoginRegister';
import PrivateRoute from './PrivateRoute/PrivateRoute';
import Account from './pages/Account';
import './App.css';

// ✅ Import your home page component
import HomePage from './pages/Home';
import PublicLayout from './components/Common/PublicLayout';
import Install from './pages/InstallationPage/Install';
// import WidgetApp from './widget/WidgetApp';
// import WidgetLoader from './widget/WidgetLoader';
import ConversationView from './pages/ConversationView';
import Conversations from './pages/Conversations';
import Bots from './pages/Bots';
import BotDetail from './pages/BotDetail';
import AIAgents from './pages/AIAgents';
import Templates from './pages/Templates';
import Partners from './pages/Partners';
import Referral from './pages/Referral';


function App() {
  return (
    <Routes>

      {/* Home page — uses its own header/footer */}
      <Route index element={<HomePage />} />

      {/* Public pages with header/footer */}
      <Route element={<PublicLayout />}>
      </Route>

      {/* Standalone widget — no layout, used inside iframe embed */}
      <Route path="usertest/:chatId" element={<UserMessage />} />

      <Route path="login" element={<AuthForm />} />
      <Route path="signup" element={<AuthForm />} />

      {/* ✅ WIDGET ROUTE – ROOT LEVEL */}
      {/* <Route path="/widget/ui:chatbotId" element={<WidgetLoader />} /> */}

      {/* Redirects */}
      <Route path="/chats" element={<Navigate to="/app/chats" replace />} />
      <Route path="/users" element={<Navigate to="/app/users" replace />} />
      <Route path="/answers" element={<Navigate to="/app/answers" replace />} />
      <Route path="/leads" element={<Navigate to="/app/leads" replace />} />
      <Route path="/analytics" element={<Navigate to="/app/analytics" replace />} />
      <Route path="/settings" element={<Navigate to="/app/settings" replace />} />
      <Route path="/setup" element={<Navigate to="/app/setup" replace />} />
      <Route path="/flow-setup" element={<Navigate to="/app/flow-setup" replace />} />
      <Route path="/install" element={<Navigate to="/app/install" replace />} />
      <Route path="/logout" element={<Navigate to="/app/logout" replace />} />
      <Route path="/account" element={<Navigate to="/app/account" replace />} />
      <Route path="/dashboard" element={<Navigate to="/app/dashboard" replace />} />
      <Route path="/bots" element={<Navigate to="/dashboard" replace />} />
      <Route path="/conversations/:id" element={<Navigate to="/app/conversations/:id" replace />} />
      <Route path="/conversations" element={<Navigate to="/app/conversations" replace />} />

      {/* Protected under /app */}
      <Route path="/app" element={<Layout />}>
        <Route element={<PrivateRoute />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="chats" element={<Chats />} />
          <Route path="users" element={<Users />} />
          <Route path="answers" element={<Answers />} />
          <Route path="leads" element={<Leads />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="settings" element={<Settings />} />
          <Route path="setup" element={<SetUp />} />
          <Route path="flow-setup" element={<FlowSetup />} />
          <Route path="install" element={<Install />} />
          <Route path="logout" element={<Logout />} />
          <Route path="account" element={<Account />} />
          <Route path="conversations" element={<Conversations />} />
          <Route path="conversations/:id" element={<ConversationView />} />
          <Route path="bots" element={<Bots />} />
          <Route path="bot/:botId" element={<BotDetail />} />
          <Route path="ai-agents" element={<AIAgents />} />
          <Route path="templates" element={<Templates />} />
          <Route path="partners" element={<Partners />} />
          <Route path="referral" element={<Referral />} />


        </Route>
      </Route>

      {/* 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
