import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Calendar, 
  Users, 
  Search, 
  Sparkles, 
  ShieldCheck, 
  Tag, 
  CheckCircle2 
} from 'lucide-react';

export default function HeroSearch({ initialValues = {} }) {
  const navigate = useNavigate();
  const [city, setCity] = useState(initialValues.city || 'Goa');
  const [checkIn, setCheckIn] = useState(initialValues.checkIn || '2026-11-01');
  const [checkOut, setCheckOut] = useState(initialValues.checkOut || '2026-11-04');
  const [guests, setGuests] = useState(initialValues.guests || '2');
  const [categoryTab, setCategoryTab] = useState('All');

  const popularCities = ['Goa', 'Mumbai', 'Jaipur', 'Delhi', 'Manali'];

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (city) params.set('city', city);
    if (checkIn) params.set('checkIn', checkIn);
    if (checkOut) params.set('checkOut', checkOut);
    if (guests) params.set('capacity', guests);
    if (categoryTab !== 'All') params.set('category', categoryTab);

    navigate(`/rooms?${params.toString()}`);
  };

  return (
    <div style={{
      background: 'linear-gradient(180deg, #051430 0%, #0d2a5d 65%, #f4f6fa 65%, #f4f6fa 100%)',
      padding: '40px 0 30px',
      position: 'relative'
    }}>
      <div className="container">
        {/* Banner Title */}
        <div style={{ textAlign: 'center', marginBottom: '24px', color: '#ffffff' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255,255,255,0.12)',
            padding: '6px 16px',
            borderRadius: '20px',
            fontSize: '13px',
            fontWeight: 600,
            marginBottom: '12px',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            <Sparkles size={16} color="#ffd573" />
            <span>India's Premier Hotel Booking Experience</span>
          </div>
          <h1 style={{ fontSize: '36px', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.5px', marginBottom: '8px' }}>
            Book Hotels, Luxury Resorts & Homestays
          </h1>
          <p style={{ color: '#c3d5ee', fontSize: '16px' }}>
            Enjoy guaranteed lowest rates, instant confirmation, and 24/7 hospitality concierge.
          </p>
        </div>

        {/* Floating MakeMyTrip Search Card */}
        <div style={{
          background: '#ffffff',
          borderRadius: '20px',
          padding: '24px',
          boxShadow: '0 20px 50px rgba(5, 20, 48, 0.25)',
          border: '1px solid #e1ebf8'
        }}>
          {/* Top Category Tabs */}
          <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid #edf2f9', paddingBottom: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
            {['All', 'Deluxe', 'Executive Suite', 'Presidential Suite', 'Standard'].map(tab => (
              <button
                key={tab}
                type="button"
                onClick={() => setCategoryTab(tab)}
                style={{
                  background: categoryTab === tab ? '#eaf2ff' : 'transparent',
                  color: categoryTab === tab ? '#006ce4' : '#5e6d77',
                  border: categoryTab === tab ? '1.5px solid #006ce4' : '1px solid transparent',
                  padding: '8px 18px',
                  borderRadius: '20px',
                  fontWeight: categoryTab === tab ? 700 : 500,
                  fontSize: '13px'
                }}
              >
                {tab === 'All' ? '🏨 All Hotel Rooms' : tab}
              </button>
            ))}
          </div>

          {/* Form Fields Grid */}
          <form onSubmit={handleSearch}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
              gap: '12px',
              border: '1px solid #dbe5f1',
              borderRadius: '12px',
              padding: '6px',
              background: '#fafcff'
            }}>
              {/* City / Destination */}
              <div style={{
                padding: '12px 14px',
                background: '#ffffff',
                borderRadius: '8px',
                border: '1px solid #eef3fa',
                boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
              }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', textTransform: 'uppercase', color: '#7e8e9f', fontWeight: 700, marginBottom: '4px' }}>
                  <MapPin size={14} color="#006ce4" />
                  City, Location
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  style={{
                    width: '100%',
                    border: 'none',
                    padding: '2px 0',
                    fontSize: '16px',
                    fontWeight: 700,
                    color: '#1a2b48',
                    background: 'transparent',
                    cursor: 'pointer'
                  }}
                >
                  {popularCities.map(c => (
                    <option key={c} value={c}>{c}, India</option>
                  ))}
                </select>
                <div style={{ fontSize: '11px', color: '#90a0b2', marginTop: '2px' }}>India's top tourist pick</div>
              </div>

              {/* Check-In */}
              <div style={{
                padding: '12px 14px',
                background: '#ffffff',
                borderRadius: '8px',
                border: '1px solid #eef3fa'
              }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', textTransform: 'uppercase', color: '#7e8e9f', fontWeight: 700, marginBottom: '4px' }}>
                  <Calendar size={14} color="#006ce4" />
                  Check-In
                </label>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  style={{
                    width: '100%',
                    border: 'none',
                    padding: '2px 0',
                    fontSize: '15px',
                    fontWeight: 700,
                    color: '#1a2b48',
                    cursor: 'pointer'
                  }}
                />
              </div>

              {/* Check-Out */}
              <div style={{
                padding: '12px 14px',
                background: '#ffffff',
                borderRadius: '8px',
                border: '1px solid #eef3fa'
              }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', textTransform: 'uppercase', color: '#7e8e9f', fontWeight: 700, marginBottom: '4px' }}>
                  <Calendar size={14} color="#006ce4" />
                  Check-Out
                </label>
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  style={{
                    width: '100%',
                    border: 'none',
                    padding: '2px 0',
                    fontSize: '15px',
                    fontWeight: 700,
                    color: '#1a2b48',
                    cursor: 'pointer'
                  }}
                />
              </div>

              {/* Guests */}
              <div style={{
                padding: '12px 14px',
                background: '#ffffff',
                borderRadius: '8px',
                border: '1px solid #eef3fa'
              }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', textTransform: 'uppercase', color: '#7e8e9f', fontWeight: 700, marginBottom: '4px' }}>
                  <Users size={14} color="#006ce4" />
                  Rooms & Guests
                </label>
                <select
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  style={{
                    width: '100%',
                    border: 'none',
                    padding: '2px 0',
                    fontSize: '15px',
                    fontWeight: 700,
                    color: '#1a2b48',
                    background: 'transparent',
                    cursor: 'pointer'
                  }}
                >
                  <option value="1">1 Adult (1 Room)</option>
                  <option value="2">2 Adults (1 Room)</option>
                  <option value="3">3 Adults (1 Room)</option>
                  <option value="4">4+ Adults (Family Suite)</option>
                </select>
                <div style={{ fontSize: '11px', color: '#90a0b2', marginTop: '2px' }}>Instant Room Allocation</div>
              </div>
            </div>

            {/* Bottom Actions & Promo banner */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '20px',
              flexWrap: 'wrap',
              gap: '14px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#0a8528', fontWeight: 600 }}>
                  <CheckCircle2 size={16} />
                  <span>Free Cancellation on Most Rooms</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#e41b23', fontWeight: 700 }}>
                  <Tag size={16} />
                  <span>Flat 20% OFF with code: HOTELPRO20</span>
                </div>
              </div>

              <button
                type="submit"
                className="btn-mmt-primary"
                style={{
                  minWidth: '220px',
                  fontSize: '16px',
                  padding: '14px 32px'
                }}
              >
                <Search size={18} />
                SEARCH HOTELS
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
