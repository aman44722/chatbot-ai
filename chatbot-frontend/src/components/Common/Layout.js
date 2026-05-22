import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { Outlet, useLocation } from 'react-router-dom';

const COLLAPSED_W = 72;
const EXPANDED_W = 240;

const Layout = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(() => {
    return localStorage.getItem('sidebarCollapsed') === 'true';
  });

  const toggleSidebar = () => {
    setCollapsed(prev => {
      const next = !prev;
      localStorage.setItem('sidebarCollapsed', next);
      return next;
    });
  };

  const isUserPage =
    location.pathname.startsWith('/usertest') ||
    location.pathname.startsWith('/userchat');

  if (isUserPage) {
    return (
      <main style={{ padding: '20px' }}>
        <Outlet />
      </main>
    );
  }

  const sidebarW = collapsed ? COLLAPSED_W : EXPANDED_W;

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#fff' }}>
      <aside style={{ width: sidebarW, flexShrink: 0, transition: 'width 0.3s ease' }}>
        <Sidebar collapsed={collapsed} onToggle={toggleSidebar} />
      </aside>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <header style={{ height: '60px' }}>
          <Header />
        </header>

        <main style={{ flex: 1, overflowY: 'auto', background: '#f8faff' }}>
          <div className="water-bg" style={{ minHeight: '100%', padding: '10px' }}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
