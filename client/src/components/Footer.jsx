import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, ShieldCheck, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      background: '#051430',
      color: '#94a3b8',
      padding: '50px 0 24px',
      borderTop: '1px solid #11284d',
      fontSize: '13px'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '30px',
          marginBottom: '40px'
        }}>
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <div style={{
                background: 'linear-gradient(135deg, #0077ff 0%, #e41b23 100%)',
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff'
              }}>
                <Building2 size={18} />
              </div>
              <span style={{ fontSize: '20px', fontWeight: 800, color: '#fff' }}>
                Hotel<span style={{ color: '#ff4d42' }}>Pro</span>
              </span>
            </div>
            <p style={{ lineHeight: 1.6, color: '#7a8c9e' }}>
              India's leading hospitality booking & operations platform inspired by MakeMyTrip. Providing end-to-end hotel reservations and front-desk property management.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <div style={{ color: '#fff', fontWeight: 700, marginBottom: '14px', fontSize: '14px' }}>Top Destinations</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Link to="/rooms?city=Goa" style={{ color: '#94a3b8' }}>Hotels in Goa</Link>
              <Link to="/rooms?city=Mumbai" style={{ color: '#94a3b8' }}>Hotels in Mumbai</Link>
              <Link to="/rooms?city=Jaipur" style={{ color: '#94a3b8' }}>Hotels in Jaipur</Link>
              <Link to="/rooms?city=Manali" style={{ color: '#94a3b8' }}>Hotels in Manali</Link>
              <Link to="/rooms?city=Delhi" style={{ color: '#94a3b8' }}>Hotels in Delhi</Link>
            </div>
          </div>

          {/* Hotel Operations Portals */}
          <div>
            <div style={{ color: '#fff', fontWeight: 700, marginBottom: '14px', fontSize: '14px' }}>System Portals</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Link to="/rooms" style={{ color: '#94a3b8' }}>Guest Room Catalog</Link>
              <Link to="/my-bookings" style={{ color: '#94a3b8' }}>My Reservations & Invoices</Link>
              <Link to="/staff" style={{ color: '#94a3b8' }}>Front Desk Staff Portal</Link>
              <Link to="/admin" style={{ color: '#94a3b8' }}>Executive Admin Dashboard</Link>
            </div>
          </div>

          {/* Tech Stack */}
          <div>
            <div style={{ color: '#fff', fontWeight: 700, marginBottom: '14px', fontSize: '14px' }}>Academic Project Info</div>
            <div style={{ color: '#7a8c9e', lineHeight: 1.6 }}>
              <strong>MERN Technology Stack:</strong><br />
              MongoDB • Express.js • React • Node.js<br />
              JWT Role-Based Access Control (RBAC)<br />
              Built for SkillWallet Final Project Submission
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.08)',
          paddingTop: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          <div>
            © 2026 HotelPro Technologies Ltd. All rights reserved. MakeMyTrip styled design.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#7a8c9e' }}>
            <span>Built with precision for College Evaluation</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
