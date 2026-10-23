import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Building2, 
  Lock, 
  Mail, 
  Sparkles, 
  ShieldCheck, 
  UserCheck, 
  User, 
  ArrowRight 
} from 'lucide-react';

export default function LoginPage() {
  const { login, quickLogin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await login(email, password);
    setLoading(false);
    if (res.success) {
      navigate('/');
    } else {
      setError(res.message);
    }
  };

  const handleDemoLogin = async (role) => {
    setLoading(true);
    setError('');
    const res = await quickLogin(role);
    setLoading(false);
    if (res.success) {
      if (role === 'admin') navigate('/admin');
      else if (role === 'staff') navigate('/staff');
      else navigate('/my-bookings');
    }
  };

  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      background: 'linear-gradient(180deg, #f0f5fc 0%, #ffffff 100%)'
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: '24px',
        width: '100%',
        maxWidth: '480px',
        padding: '36px',
        boxShadow: '0 20px 50px rgba(5,20,48,0.1)',
        border: '1px solid #e1ebf8'
      }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            background: 'linear-gradient(135deg, #0077ff 0%, #e41b23 100%)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px',
            boxShadow: '0 4px 14px rgba(228, 27, 35, 0.3)'
          }}>
            <Building2 size={26} color="#fff" />
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#1a2b48' }}>
            Sign in to HotelPro
          </h2>
          <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
            Access booking vouchers, manage reservations & hotel operations
          </p>
        </div>

        {/* Demo Fast Login Cards */}
        <div style={{
          background: '#f8fafd',
          borderRadius: '14px',
          padding: '14px',
          border: '1px dashed #c8daf0',
          marginBottom: '24px'
        }}>
          <div style={{ fontSize: '11px', fontWeight: 800, color: '#006ce4', textTransform: 'uppercase', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Sparkles size={13} color="#f5a623" />
            <span>1-Click Evaluator Demo Logins</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
            <button
              type="button"
              onClick={() => handleDemoLogin('guest')}
              style={{
                background: '#ffffff',
                border: '1px solid #d5e4f5',
                padding: '8px 4px',
                borderRadius: '8px',
                fontSize: '11px',
                fontWeight: 700,
                color: '#1a2b48'
              }}
            >
              👤 Guest
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('staff')}
              style={{
                background: '#ffffff',
                border: '1px solid #d5e4f5',
                padding: '8px 4px',
                borderRadius: '8px',
                fontSize: '11px',
                fontWeight: 700,
                color: '#006ce4'
              }}
            >
              🛎️ Staff
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('admin')}
              style={{
                background: '#ffffff',
                border: '1px solid #ffccd0',
                padding: '8px 4px',
                borderRadius: '8px',
                fontSize: '11px',
                fontWeight: 700,
                color: '#e41b23'
              }}
            >
              🛡️ Admin
            </button>
          </div>
        </div>

        {error && (
          <div style={{ background: '#ffeceb', color: '#e41b23', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, marginBottom: '18px' }}>
            {error}
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>Email Address</label>
            <div style={{ position: 'relative', marginTop: '4px' }}>
              <Mail size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '12px' }} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="name@hotelpro.com"
                style={{ width: '100%', paddingLeft: '38px' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '22px' }}>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>Password</label>
            <div style={{ position: 'relative', marginTop: '4px' }}>
              <Lock size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '12px' }} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                style={{ width: '100%', paddingLeft: '38px' }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-mmt-primary"
            style={{ width: '100%', padding: '12px', fontSize: '15px' }}
          >
            {loading ? 'Signing in...' : 'Sign In ➔'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: '#64748b' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#006ce4', fontWeight: 700 }}>
            Create one free
          </Link>
        </div>
      </div>
    </div>
  );
}
