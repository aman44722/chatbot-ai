import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { Outlet, useLocation } from 'react-router-dom';

const Layout = () => {
  const location = useLocation();

  // agar user pages hai (usertest, userchat) to simple content
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

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#fff' }}>
      {/* Sidebar full height */}
      <aside style={{ width: 200, flexShrink: 0 }}>
        <Sidebar />
      </aside>

      {/* Right section */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header (top bar after sidebar) */}
        <header style={{ height: '60px' }}>
          <Header />
        </header>

        {/* Content area */}
        <main style={{ flex: 1, padding: '10px', overflowY: 'auto' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
