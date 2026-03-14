
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  HelpCircle, 
  FolderTree, 
  BarChart3, 
  FileText, 
  Settings, 
  Bell,
  Stethoscope
} from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { p: '/', label: 'Dashboard', icon: LayoutDashboard },
    { p: '/users', label: 'Doctors', icon: Users },
    { p: '/questions', label: 'Question Bank', icon: HelpCircle },
    { p: '/categories', label: 'Categories', icon: FolderTree },
    { p: '/analytics', label: 'Analytics', icon: BarChart3 },
    { p: '/quizzes', label: 'Ward Activities', icon: Stethoscope },
    { p: '/notifications', label: 'Broadcast', icon: Bell },
    { p: '/reports', label: 'Reports', icon: FileText },
    { p: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <img 
          src="https://quiz.healthhandspharmacy.com/logo.png" 
          alt="Logo" 
          style={{ width: '40px', height: '40px', objectFit: 'contain' }} 
        />
        <div className="logo-text">NeuroGenius</div>
      </div>

      <nav style={{ flex: 1 }}>
        {navItems.map((item) => (
          <NavLink 
            key={item.p} 
            to={item.p} 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div style={{ 
        marginTop: 'auto', 
        padding: '1.5rem', 
        background: 'rgba(255,255,255,0.03)', 
        borderRadius: 'var(--radius-md)',
        border: '1px solid rgba(255,255,255,0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
           <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>AD</div>
           <div>
              <p style={{ fontSize: '0.875rem', fontWeight: 700 }}>Admin User</p>
              <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Super Admin</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
