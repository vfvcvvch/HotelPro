import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Star, 
  MapPin, 
  ShieldCheck, 
  Check, 
  Users, 
  Maximize2, 
  ArrowRight,
  Sparkles,
  Wifi,
  Coffee
} from 'lucide-react';

export default function RoomCard({ room, onBookNow }) {
  const hotel = room.hotelId || {};
  const originalPrice = Math.round(room.pricePerNight * 1.25);
  const taxAmount = Math.round(room.pricePerNight * 0.12);

  return (
    <div style={{
      background: '#ffffff',
      borderRadius: '16px',
      overflow: 'hidden',
      border: '1px solid #e2ecf8',
      boxShadow: '0 4px 18px rgba(5, 20, 48, 0.05)',
      display: 'grid',
      gridTemplateColumns: '300px 1fr 240px',
      transition: 'all 0.25s ease',
      marginBottom: '20px'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.boxShadow = '0 12px 32px rgba(0, 108, 228, 0.12)';
      e.currentTarget.style.borderColor = '#b8d6fc';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'none';
      e.currentTarget.style.boxShadow = '0 4px 18px rgba(5, 20, 48, 0.05)';
      e.currentTarget.style.borderColor = '#e2ecf8';
    }}
    >
      {/* 1. Image Thumbnail & Badges */}
      <div style={{ position: 'relative', height: '100%', minHeight: '230px', background: '#eee' }}>
        <img
          src={room.images?.[0] || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80'}
          alt={room.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        {/* MMT Assured Ribbon */}
        <div style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          background: 'linear-gradient(135deg, #fff3d6 0%, #ffd67a 100%)',
          color: '#805000',
          padding: '4px 10px',
          borderRadius: '4px',
          fontSize: '11px',
          fontWeight: 800,
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
          border: '1px solid #ffcc55'
        }}>
          <ShieldCheck size={14} color="#b37400" />
          <span>MMT ASSURED</span>
        </div>

        {/* Room Status Chip */}
        <div style={{
          position: 'absolute',
          bottom: '12px',
          left: '12px',
          background: room.status === 'available' ? 'rgba(10, 133, 40, 0.9)' : 'rgba(228, 27, 35, 0.9)',
          color: '#fff',
          padding: '3px 8px',
          borderRadius: '4px',
          fontSize: '11px',
          fontWeight: 700,
          textTransform: 'uppercase'
        }}>
          {room.status === 'available' ? '● Available' : `● ${room.status}`}
        </div>
      </div>

      {/* 2. Middle Content & Room Specs */}
      <div style={{ padding: '18px 22px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          {/* Hotel Name & Location */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#687b92', fontSize: '13px', marginBottom: '4px' }}>
            <MapPin size={14} color="#006ce4" />
            <span>{hotel.name || 'Luxury Partner Hotel'} • <strong>{hotel.city || 'India'}</strong></span>
          </div>

          {/* Room Title */}
          <Link to={`/rooms/${room._id}`}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1a2b48', marginBottom: '8px', cursor: 'pointer' }}>
              {room.title}
            </h3>
          </Link>

          {/* Dimensions / Capacity */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '12px', color: '#546578', marginBottom: '12px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Users size={14} color="#778899" />
              Max {room.capacity} Guests
            </span>
            <span>•</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Maximize2 size={13} color="#778899" />
              {room.roomSizeSqFt || 380} sq.ft
            </span>
            <span>•</span>
            <span style={{ fontWeight: 600, color: '#006ce4' }}>
              {room.bedType || 'King Bed'}
            </span>
          </div>

          {/* Key Inclusions / Perks */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', fontSize: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#0a8528', fontWeight: 600 }}>
              <Check size={14} />
              <span>Free Cancellation (100% Refund Available)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#546578' }}>
              <Coffee size={14} color="#f5a623" />
              <span>Complimentary Multi-Cuisine Breakfast</span>
            </div>
          </div>
        </div>

        {/* Amenity Badges */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '14px' }}>
          {(room.amenities || []).slice(0, 4).map((a, i) => (
            <span
              key={i}
              style={{
                background: '#f2f6fc',
                color: '#41556c',
                fontSize: '11px',
                padding: '3px 8px',
                borderRadius: '4px',
                fontWeight: 500
              }}
            >
              {a}
            </span>
          ))}
          {room.amenities?.length > 4 && (
            <span style={{ fontSize: '11px', color: '#006ce4', fontWeight: 600, padding: '3px 0' }}>
              +{room.amenities.length - 4} more
            </span>
          )}
        </div>
      </div>

      {/* 3. Right Pricing & CTA Section */}
      <div style={{
        padding: '20px',
        borderLeft: '1px solid #edf2f9',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: '#fafcff'
      }}>
        {/* Rating Score */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '8px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#1a2b48' }}>Very Good</div>
            <div style={{ fontSize: '10px', color: '#7a8b9e' }}>1,480 Ratings</div>
          </div>
          <div className="mmt-rating-badge">
            <span>4.8</span>
            <Star size={11} fill="white" color="white" />
          </div>
        </div>

        {/* Pricing */}
        <div style={{ textAlign: 'right', marginTop: 'auto', marginBottom: '16px' }}>
          <div style={{ fontSize: '12px', color: '#8898aa', textDecoration: 'line-through' }}>
            ₹{originalPrice.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#1a2b48', lineHeight: 1.1 }}>
            ₹{room.pricePerNight.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '11px', color: '#68788c', marginTop: '2px' }}>
            + ₹{taxAmount.toLocaleString('en-IN')} taxes & fees / night
          </div>
          <div style={{
            fontSize: '10px',
            color: '#e41b23',
            fontWeight: 700,
            background: '#ffeceb',
            display: 'inline-block',
            padding: '2px 6px',
            borderRadius: '3px',
            marginTop: '4px'
          }}>
            SAVING 20% TODAY
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button
            onClick={() => onBookNow(room)}
            className="btn-mmt-primary"
            style={{ width: '100%', padding: '10px 14px', fontSize: '14px' }}
          >
            BOOK NOW
          </button>
          <Link
            to={`/rooms/${room._id}`}
            style={{
              textAlign: 'center',
              fontSize: '12px',
              fontWeight: 600,
              color: '#006ce4',
              padding: '4px 0'
            }}
          >
            View Room Details ➔
          </Link>
        </div>
      </div>
    </div>
  );
}
