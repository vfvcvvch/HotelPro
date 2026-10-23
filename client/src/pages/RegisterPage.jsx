import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Building2, Lock, Mail, User, Phone } from 'lucide-react';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('guest');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await register({ name, email, password, phone, role });
    setLoading(false);
    if (res.success) {
      navigate('/');
    } else {
      setError(res.message);
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
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            background: 'linear-gradient(135deg, #0077ff 0%, #e41b23 100%)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px'
          }}>
            <Building2 size={26} color="#fff" />
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#1a2b48' }}>
            Create HotelPro Account
          </h2>
          <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
            Join millions of travelers enjoying guaranteed best room rates
          </p>
        </div>

        {error && (
          <div style={{ background: '#ffeceb', color: '#e41b23', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, marginBottom: '18px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '14px' }}>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>Full Name</label>
            <div style={{ position: 'relative', marginTop: '4px' }}>
              <User size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '12px' }} />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Rahul Sharma"
                style={{ width: '100%', paddingLeft: '38px' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '14px' }}>
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

          <div style={{ marginBottom: '14px' }}>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>Phone Number</label>
            <div style={{ position: 'relative', marginTop: '4px' }}>
              <Phone size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '12px' }} />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 9876543210"
                style={{ width: '100%', paddingLeft: '38px' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>Account Type</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={{ width: '100%', marginTop: '4px' }}
            >
              <option value="guest">Guest (Book Hotels & Stays)</option>
              <option value="staff">Hotel Staff (Front Desk & Housekeeping)</option>
              <option value="admin">Administrator (Full Access)</option>
            </select>
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
                placeholder="Minimum 6 characters"
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
            {loading ? 'Creating Account...' : 'Register Account'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: '#64748b' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#006ce4', fontWeight: 700 }}>
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
