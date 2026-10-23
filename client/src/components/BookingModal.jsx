import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  X, 
  Calendar, 
  Users, 
  Tag, 
  ShieldCheck, 
  CreditCard, 
  MapPin, 
  Info,
  CheckCircle2
} from 'lucide-react';

export default function BookingModal({ room, isOpen, onClose, onProceedToPayment }) {
  if (!isOpen || !room) return null;

  const { user } = useAuth();
  const hotel = room.hotelId || {};

  const [checkInDate, setCheckInDate] = useState('2026-11-05');
  const [checkOutDate, setCheckOutDate] = useState('2026-11-08');
  const [guestsCount, setGuestsCount] = useState(room.capacity || 2);
  const [name, setName] = useState(user?.name || 'Rahul Sharma');
  const [email, setEmail] = useState(user?.email || 'guest@hotelpro.com');
  const [phone, setPhone] = useState(user?.phone || '+91 9876543210');
  const [specialRequests, setSpecialRequests] = useState('High floor preferred, sea-view room.');
  const [promoCode, setPromoCode] = useState('HOTELPRO20');
  const [discountApplied, setDiscountApplied] = useState(true);

  // Compute nights
  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);
  const diffTime = Math.abs(checkOut - checkIn);
  const nights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  const basePrice = room.pricePerNight * nights;
  const discountAmount = discountApplied ? Math.round(basePrice * 0.20) : 0;
  const taxesAndFees = Math.round((basePrice - discountAmount) * 0.12);
  const totalAmount = (basePrice - discountAmount) + taxesAndFees;

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'HOTELPRO20') {
      setDiscountApplied(true);
    } else {
      alert('Invalid promo code. Use HOTELPRO20 for 20% OFF');
      setDiscountApplied(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const bookingData = {
      hotelId: hotel._id || room.hotelId,
      roomId: room._id,
      checkInDate,
      checkOutDate,
      nights,
      guestsCount,
      guestDetails: { name, email, phone, specialRequests },
      basePrice,
      taxesAndFees,
      discountAmount,
      promoCode: discountApplied ? promoCode : '',
      totalAmount
    };
    onProceedToPayment(bookingData, room, hotel);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(5, 20, 48, 0.7)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: '20px',
        width: '100%',
        maxWidth: '820px',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
        animation: 'fadeIn 0.25s ease'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #051430 0%, #0d2e68 100%)',
          color: '#ffffff',
          padding: '20px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTopLeftRadius: '20px',
          borderTopRightRadius: '20px'
        }}>
          <div>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#ffcc66', fontWeight: 700, letterSpacing: '0.5px' }}>
              RESERVATION CHECKOUT
            </div>
            <h2 style={{ fontSize: '20px', color: '#fff', fontWeight: 800 }}>
              {room.title}
            </h2>
            <div style={{ fontSize: '12px', color: '#bed4f5', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
              <MapPin size={12} />
              <span>{hotel.name} • {hotel.city}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.15)',
              color: '#fff',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '24px' }}>
            {/* Left: Guest & Stay Details */}
            <div>
              <h4 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '14px', color: '#1a2b48' }}>
                1. Trip Dates & Guest Info
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#556677' }}>Check-In Date</label>
                  <input
                    type="date"
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    required
                    style={{ width: '100%', marginTop: '4px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#556677' }}>Check-Out Date</label>
                  <input
                    type="date"
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    required
                    style={{ width: '100%', marginTop: '4px' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#556677' }}>Number of Guests</label>
                <select
                  value={guestsCount}
                  onChange={(e) => setGuestsCount(e.target.value)}
                  style={{ width: '100%', marginTop: '4px' }}
                >
                  <option value="1">1 Adult</option>
                  <option value="2">2 Adults</option>
                  <option value="3">3 Adults</option>
                  <option value="4">4 Adults</option>
                </select>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#556677' }}>Lead Guest Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="e.g. Rahul Sharma"
                  style={{ width: '100%', marginTop: '4px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#556677' }}>Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="guest@hotelpro.com"
                    style={{ width: '100%', marginTop: '4px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#556677' }}>Contact Phone</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    placeholder="+91 9876543210"
                    style={{ width: '100%', marginTop: '4px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#556677' }}>Special Requests (Optional)</label>
                <textarea
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  rows="2"
                  placeholder="Late check-in, dietary requirements, airport shuttle..."
                  style={{ width: '100%', marginTop: '4px', resize: 'none' }}
                />
              </div>
            </div>

            {/* Right: Price Summary & Promo Code */}
            <div style={{
              background: '#f8fafd',
              padding: '20px',
              borderRadius: '16px',
              border: '1px solid #e2ecf8',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <h4 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '14px', color: '#1a2b48' }}>
                  Price Breakdown
                </h4>

                {/* Promo Code Box */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#627488' }}>
                    Promo / Coupon Code
                  </label>
                  <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="e.g. HOTELPRO20"
                      style={{ textTransform: 'uppercase', flex: 1, padding: '8px 10px', fontSize: '13px', fontWeight: 700 }}
                    />
                    <button
                      type="button"
                      onClick={handleApplyPromo}
                      style={{
                        background: '#006ce4',
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: '12px',
                        padding: '0 14px',
                        borderRadius: '6px'
                      }}
                    >
                      Apply
                    </button>
                  </div>
                  {discountApplied && (
                    <div style={{ fontSize: '11px', color: '#0a8528', fontWeight: 600, marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle2 size={12} />
                      <span>20% MakeMyTrip discount unlocked!</span>
                    </div>
                  )}
                </div>

                {/* Line items */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: '#526478', borderTop: '1px solid #e7eff8', paddingTop: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Base Fare ({nights} night{nights > 1 ? 's' : ''})</span>
                    <span>₹{basePrice.toLocaleString('en-IN')}</span>
                  </div>

                  {discountApplied && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#0a8528', fontWeight: 600 }}>
                      <span>Promo Discount (20%)</span>
                      <span>- ₹{discountAmount.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Hotel GST & Service Fees (12%)</span>
                    <span>₹{taxesAndFees.toLocaleString('en-IN')}</span>
                  </div>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '18px',
                    fontWeight: 800,
                    color: '#1a2b48',
                    borderTop: '2px dashed #dbe5f2',
                    paddingTop: '12px',
                    marginTop: '8px'
                  }}>
                    <span>Total Payable</span>
                    <span style={{ color: '#006ce4' }}>₹{totalAmount.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Submit CTA */}
              <div style={{ marginTop: '20px' }}>
                <button
                  type="submit"
                  className="btn-mmt-primary"
                  style={{ width: '100%', padding: '14px', fontSize: '15px' }}
                >
                  <CreditCard size={18} />
                  PROCEED TO PAYMENT
                </button>
                <div style={{ fontSize: '11px', textAlign: 'center', color: '#7a8c9e', marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                  <ShieldCheck size={13} color="#0a8528" />
                  <span>256-bit SSL Encrypted • Instant Confirmation</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
