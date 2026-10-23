import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Building2, 
  CalendarCheck, 
  ShieldCheck, 
  UserCheck, 
  LogOut, 
  ChevronDown, 
  Sparkles,
  User,
  Menu,
  X
} from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, role, logout, quickLogin } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleQuickSwitch = async (targetRole) => {
    await quickLogin(targetRole);
    setDropdownOpen(false);
    if (targetRole === 'admin') navigate('/admin');
    else if (targetRole === 'staff') navigate('/staff');
    else navigate('/my-bookings');
  };

  return (
    <header style={{
      background: 'linear-gradient(180deg, #051430 0%, #08214d 100%)',
      color: '#ffffff',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
    }}>
      {/* Top Demo Quick Bar */}
      <div style={{
        background: 'rgba(0,0,0,0.25)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        fontSize: '12px',
        padding: '6px 0'
      }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#c5d7f2' }}>
            <Sparkles size={14} color="#f5a623" />
            <span><strong>College Project Demo:</strong> Instant 1-Click Role Switcher ➔</span>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              onClick={() => handleQuickSwitch('guest')}
              style={{
                background: role === 'guest' && isAuthenticated ? '#006ce4' : 'rgba(255,255,255,0.12)',
                color: '#fff',
                padding: '2px 10px',
                borderRadius: '12px',
                fontSize: '11px',
                fontWeight: 600
              }}
            >
              👤 Guest Mode
            </button>
            <button 
              onClick={() => handleQuickSwitch('staff')}
              style={{
                background: role === 'staff' && isAuthenticated ? '#006ce4' : 'rgba(255,255,255,0.12)',
                color: '#fff',
                padding: '2px 10px',
                borderRadius: '12px',
                fontSize: '11px',
                fontWeight: 600
              }}
            >
              🛎️ Staff Portal
            </button>
            <button 
              onClick={() => handleQuickSwitch('admin')}
              style={{
                background: role === 'admin' && isAuthenticated ? '#e41b23' : 'rgba(255,255,255,0.12)',
                color: '#fff',
                padding: '2px 10px',
                borderRadius: '12px',
                fontSize: '11px',
                fontWeight: 600
              }}
            >
              🛡️ Admin Console
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px' }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #0077ff 0%, #e41b23 100%)',
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(228, 27, 35, 0.3)'
          }}>
            <Building2 size={24} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ fontSize: '22px', fontWeight: 800, letterSpacing: '-0.5px' }}>Hotel<span style={{ color: '#ff4d42' }}>Pro</span></span>
              <span style={{ 
                background: '#ff4d42', 
                color: '#fff', 
                fontSize: '9px', 
                fontWeight: 800, 
                padding: '2px 5px', 
                borderRadius: '4px',
                letterSpacing: '0.5px'
              }}>
                MMT STYLE
              </span>
            </div>
            <div style={{ fontSize: '10px', color: '#90a8cb', letterSpacing: '0.4px', fontWeight: 500 }}>
              HOTEL BOOKING & MANAGEMENT
            </div>
          </div>
        </Link>

        {/* Center Nav Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <Link 
            to="/" 
            style={{ 
              fontWeight: 600, 
              fontSize: '14px', 
              color: location.pathname === '/' ? '#4da2ff' : '#ffffff',
              borderBottom: location.pathname === '/' ? '2px solid #4da2ff' : 'none',
              paddingBottom: '4px'
            }}
          >
            Hotels & Resorts
          </Link>
          <Link 
            to="/rooms" 
            style={{ 
              fontWeight: 600, 
              fontSize: '14px', 
              color: location.pathname === '/rooms' ? '#4da2ff' : '#e1ebf8'
            }}
          >
            Browse All Rooms
          </Link>
          {isAuthenticated && (
            <Link 
              to="/my-bookings" 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '6px', 
                fontWeight: 600, 
                fontSize: '14px',
                color: location.pathname === '/my-bookings' ? '#4da2ff' : '#e1ebf8'
              }}
            >
              <CalendarCheck size={16} />
              My Bookings
            </Link>
          )}
          {isAuthenticated && (role === 'staff' || role === 'admin') && (
            <Link 
              to="/staff" 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '6px', 
                fontWeight: 600, 
                fontSize: '14px', 
                color: '#ffd073' 
              }}
            >
              <UserCheck size={16} />
              Staff Desk
            </Link>
          )}
          {isAuthenticated && role === 'admin' && (
            <Link 
              to="/admin" 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '6px', 
                fontWeight: 600, 
                fontSize: '14px', 
                color: '#ff9090' 
              }}
            >
              <ShieldCheck size={16} />
              Admin
            </Link>
          )}
        </nav>

        {/* Right Auth Area */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', position: 'relative' }}>
          {isAuthenticated ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  background: 'rgba(255,255,255,0.1)',
                  padding: '6px 14px',
                  borderRadius: '24px',
                  color: '#fff',
                  border: '1px solid rgba(255,255,255,0.2)'
                }}
              >
                <img
                  src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
                  alt="avatar"
                  style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
                  <div style={{ fontSize: '13px', fontWeight: 700 }}>{user?.name?.split(' ')[0]}</div>
                  <div style={{ fontSize: '10px', color: '#ffd573', textTransform: 'uppercase', fontWeight: 700 }}>
                    {user?.role}
                  </div>
                </div>
                <ChevronDown size={14} color="#a0b5d0" />
              </button>

              {dropdownOpen && (
                <div style={{
                  position: 'absolute',
                  right: 0,
                  top: '46px',
                  width: '210px',
                  background: '#ffffff',
                  color: '#1a2b48',
                  borderRadius: '12px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
                  padding: '8px',
                  zIndex: 200,
                  animation: 'fadeIn 0.2s ease'
                }}>
                  <div style={{ padding: '8px 12px', borderBottom: '1px solid #eee' }}>
                    <div style={{ fontWeight: 700, fontSize: '13px' }}>{user?.name}</div>
                    <div style={{ fontSize: '11px', color: '#777' }}>{user?.email}</div>
                  </div>
                  <Link 
                    to="/my-bookings" 
                    onClick={() => setDropdownOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 12px',
                      fontSize: '13px',
                      color: '#333',
                      borderRadius: '6px'
                    }}
                  >
                    <CalendarCheck size={15} color="#006ce4" />
                    My Reservations
                  </Link>
                  {(role === 'staff' || role === 'admin') && (
                    <Link 
                      to="/staff" 
                      onClick={() => setDropdownOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 12px',
                        fontSize: '13px',
                        color: '#333',
                        borderRadius: '6px'
                      }}
                    >
                      <UserCheck size={15} color="#f5a623" />
                      Staff Operations
                    </Link>
                  )}
                  {role === 'admin' && (
                    <Link 
                      to="/admin" 
                      onClick={() => setDropdownOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 12px',
                        fontSize: '13px',
                        color: '#333',
                        borderRadius: '6px'
                      }}
                    >
                      <ShieldCheck size={15} color="#e41b23" />
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => { logout(); setDropdownOpen(false); navigate('/'); }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 12px',
                      fontSize: '13px',
                      color: '#e41b23',
                      background: 'none',
                      borderRadius: '6px',
                      marginTop: '4px',
                      borderTop: '1px solid #f0f0f0'
                    }}
                  >
                    <LogOut size={15} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Link 
                to="/login"
                style={{
                  background: 'linear-gradient(90deg, #0077ff 0%, #0056cc 100%)',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '13px',
                  padding: '8px 20px',
                  borderRadius: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <User size={15} />
                Login or Create Account
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
