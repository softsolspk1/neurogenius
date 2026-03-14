
import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, FolderTree, HelpCircle, BarChart3, Settings, LogOut } from 'lucide-react';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '4px' }}>
          <img src="/logo.png" alt="Logo" style={{ height: '32px', width: 'auto' }} />
        </div>
        <span>Neuro Genius</span>
      </div>
      
      <nav className="nav-links">
        <NavLink to="/" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/users" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <Users size={20} />
          <span>User Management</span>
        </NavLink>
        <NavLink to="/categories" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <FolderTree size={20} />
          <span>Categories</span>
        </NavLink>
        <NavLink to="/questions" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <HelpCircle size={20} />
          <span>Question Bank</span>
        </NavLink>
        <NavLink to="/analytics" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <BarChart3 size={20} />
          <span>Analytics</span>
        </NavLink>
        <NavLink to="/settings" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <Settings size={20} />
          <span>Settings</span>
        </NavLink>
      </nav>

      <div style={{ marginTop: 'auto' }}>
        <button className="nav-item" style={{ background: 'none', border: 'none', width: '100%', cursor: 'pointer' }}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
