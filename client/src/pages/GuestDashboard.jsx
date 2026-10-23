import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import InvoiceModal from '../components/InvoiceModal';
import { 
  CalendarCheck, 
  MapPin, 
  CreditCard, 
  Clock, 
  FileText, 
  AlertCircle, 
  CheckCircle2, 
  XCircle,
  Building2,
  Calendar
} from 'lucide-react';

export default function GuestDashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeInvoice, setActiveInvoice] = useState(null);
  const [invoiceOpen, setInvoiceOpen] = useState(false);

  // Cancellation Modal State
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancellingBookingId, setCancellingBookingId] = useState(null);
  const [cancelReason, setCancelReason] = useState('Change of travel schedule');
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    fetchMyBookings();
  }, []);

  const fetchMyBookings = async () => {
    setLoading(true);
    try {
      const res = await api.getMyBookings();
      if (res.success && res.data) {
        setBookings(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCancel = (bookingId) => {
    setCancellingBookingId(bookingId);
    setCancelModalOpen(true);
  };

  const handleConfirmCancel = async () => {
    setCancelling(true);
    try {
      const res = await api.cancelBooking(cancellingBookingId, cancelReason);
      if (res.success) {
        alert('Booking cancelled successfully. 100% refund of payment has been initiated to your source account!');
        setCancelModalOpen(false);
        fetchMyBookings();
      } else {
        alert(res.message || 'Failed to cancel');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCancelling(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return { label: 'CONFIRMED', bg: '#e6f7ec', color: '#0a8528', icon: CheckCircle2 };
      case 'checked-in':
        return { label: 'CHECKED-IN', bg: '#e8f2ff', color: '#006ce4', icon: CheckCircle2 };
      case 'checked-out':
        return { label: 'COMPLETED', bg: '#f3e8ff', color: '#7e22ce', icon: CheckCircle2 };
      case 'cancelled':
        return { label: 'CANCELLED & REFUNDED', bg: '#ffeceb', color: '#e41b23', icon: XCircle };
      default:
        return { label: status, bg: '#eee', color: '#555', icon: Clock };
    }
  };

  return (
    <div style={{ padding: '40px 0 80px' }}>
      <div className="container">
        {/* Profile Header */}
        <div style={{
          background: 'linear-gradient(135deg, #051430 0%, #0d2f6d 100%)',
          borderRadius: '20px',
          padding: '28px 32px',
          color: '#ffffff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '32px',
          boxShadow: '0 10px 30px rgba(5,20,48,0.15)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}
              alt={user?.name}
              style={{ width: '64px', height: '64px', borderRadius: '50%', border: '3px solid rgba(255,255,255,0.3)', objectFit: 'cover' }}
            />
            <div>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#ffcc66', fontWeight: 800 }}>
                TRAVELER DASHBOARD
              </div>
              <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#fff' }}>
                Welcome back, {user?.name}!
              </h1>
              <div style={{ fontSize: '13px', color: '#c5d8f2', marginTop: '2px' }}>
                {user?.email} • {user?.phone || '+91 9876543210'}
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '11px', color: '#a0bcdb', textTransform: 'uppercase', fontWeight: 700 }}>Total Stays</div>
            <div style={{ fontSize: '32px', fontWeight: 800, color: '#fff' }}>{bookings.length}</div>
          </div>
        </div>

        {/* Section Title */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#1a2b48' }}>
              My Hotel Reservations
            </h2>
            <p style={{ fontSize: '13px', color: '#68788c' }}>
              View booking vouchers, download GST tax invoices, and track live check-in statuses.
            </p>
          </div>
        </div>

        {/* Bookings List */}
        {loading ? (
          <div style={{ background: '#fff', padding: '60px', borderRadius: '16px', textAlign: 'center', color: '#7a8c9e' }}>
            Fetching reservations...
          </div>
        ) : bookings.length === 0 ? (
          <div style={{ background: '#fff', padding: '60px', borderRadius: '16px', textAlign: 'center' }}>
            <CalendarCheck size={48} color="#006ce4" style={{ margin: '0 auto 12px', opacity: 0.5 }} />
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1a2b48' }}>No Bookings Yet</h3>
            <p style={{ color: '#68788c', fontSize: '14px', marginTop: '4px' }}>
              Discover top-rated luxury resorts in Goa, Mumbai, and Jaipur.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {bookings.map(b => {
              const hotel = b.hotelId || {};
              const room = b.roomId || {};
              const badge = getStatusBadge(b.bookingStatus);
              const BadgeIcon = badge.icon;

              return (
                <div
                  key={b._id}
                  style={{
                    background: '#ffffff',
                    borderRadius: '16px',
                    padding: '22px',
                    border: '1px solid #e1ebf8',
                    boxShadow: '0 4px 18px rgba(5,20,48,0.04)',
                    display: 'grid',
                    gridTemplateColumns: '1.4fr 1.2fr 200px',
                    gap: '20px',
                    alignItems: 'center'
                  }}
                >
                  {/* Left: Hotel & Room Info */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <span style={{
                        background: badge.bg,
                        color: badge.color,
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: 800,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <BadgeIcon size={12} />
                        <span>{badge.label}</span>
                      </span>
                      <span style={{ fontSize: '12px', color: '#7a8c9e', fontWeight: 600 }}>
                        ID: {b.bookingNumber}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1a2b48', marginBottom: '4px' }}>
                      {hotel.name || 'Hotel'}
                    </h3>
                    <div style={{ fontSize: '13px', color: '#526478', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={14} color="#006ce4" />
                      <span>{hotel.city || 'India'}</span>
                    </div>
                    <div style={{ fontSize: '13px', color: '#006ce4', fontWeight: 600, marginTop: '6px' }}>
                      Room: {room.title || 'Deluxe Room'} ({b.guestsCount} Guests)
                    </div>
                  </div>

                  {/* Middle: Dates & Price */}
                  <div style={{ background: '#f8fafd', padding: '14px', borderRadius: '10px', border: '1px solid #eef3fa' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#68788c', marginBottom: '4px' }}>
                      <span>Check-In:</span>
                      <strong style={{ color: '#1a2b48' }}>{new Date(b.checkInDate).toLocaleDateString()}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#68788c', marginBottom: '4px' }}>
                      <span>Check-Out:</span>
                      <strong style={{ color: '#1a2b48' }}>{new Date(b.checkOutDate).toLocaleDateString()}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#68788c', borderTop: '1px solid #e2ecf8', paddingTop: '6px', marginTop: '6px' }}>
                      <span>Total Paid:</span>
                      <strong style={{ color: '#006ce4', fontSize: '14px' }}>₹{b.totalAmount?.toLocaleString('en-IN')}</strong>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <button
                      onClick={() => {
                        setActiveInvoice(b);
                        setInvoiceOpen(true);
                      }}
                      className="btn-mmt-outline"
                      style={{ fontSize: '13px', padding: '8px 14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                    >
                      <FileText size={14} />
                      <span>View Tax Invoice</span>
                    </button>

                    {b.bookingStatus === 'confirmed' && (
                      <button
                        onClick={() => handleOpenCancel(b._id)}
                        style={{
                          background: 'transparent',
                          color: '#e41b23',
                          border: '1.5px solid #ffccd0',
                          padding: '8px 14px',
                          borderRadius: '24px',
                          fontSize: '12px',
                          fontWeight: 700
                        }}
                      >
                        Cancel Stay
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Cancellation Modal */}
        {cancelModalOpen && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(5, 20, 48, 0.7)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1300,
            padding: '20px'
          }}>
            <div style={{
              background: '#ffffff',
              borderRadius: '16px',
              maxWidth: '460px',
              width: '100%',
              padding: '24px',
              boxShadow: '0 20px 50px rgba(0,0,0,0.25)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#e41b23', marginBottom: '12px' }}>
                <AlertCircle size={22} />
                <h3 style={{ fontSize: '18px', fontWeight: 800 }}>Confirm Reservation Cancellation</h3>
              </div>
              <p style={{ fontSize: '13px', color: '#556677', lineHeight: 1.5, marginBottom: '16px' }}>
                Under our <strong>MakeMyTrip Free Cancellation Guarantee</strong>, a 100% full refund will be immediately credited back to your original payment method.
              </p>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>Reason for Cancellation</label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                style={{ width: '100%', marginTop: '6px', marginBottom: '20px' }}
              >
                <option value="Change of travel schedule">Change of travel schedule</option>
                <option value="Found alternative accommodation">Found alternative accommodation</option>
                <option value="Personal emergency">Personal emergency</option>
                <option value="Work commitment">Work commitment</option>
              </select>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setCancelModalOpen(false)}
                  style={{ flex: 1, padding: '10px', background: '#f0f4f8', borderRadius: '8px', fontWeight: 600, fontSize: '13px' }}
                >
                  Keep Reservation
                </button>
                <button
                  type="button"
                  onClick={handleConfirmCancel}
                  disabled={cancelling}
                  style={{ flex: 1, padding: '10px', background: '#e41b23', color: '#fff', borderRadius: '8px', fontWeight: 700, fontSize: '13px' }}
                >
                  {cancelling ? 'Processing...' : 'Confirm Cancel & Refund'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Invoice Modal */}
        <InvoiceModal
          isOpen={invoiceOpen}
          booking={activeInvoice}
          onClose={() => setInvoiceOpen(false)}
        />
      </div>
    </div>
  );
}
