import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import BookingModal from '../components/BookingModal';
import PaymentModal from '../components/PaymentModal';
import InvoiceModal from '../components/InvoiceModal';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  MapPin, 
  Star, 
  ShieldCheck, 
  Check, 
  Users, 
  Maximize2, 
  Coffee, 
  Wifi, 
  Tv, 
  Sparkles,
  Building2,
  Calendar,
  MessageSquare,
  ThumbsUp
} from 'lucide-react';

export default function RoomDetailsPage() {
  const { id } = useParams();
  const { user, isAuthenticated, quickLogin } = useAuth();

  const [room, setRoom] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Review submission state
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  // Booking Flow States
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [currentBookingData, setCurrentBookingData] = useState(null);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  useEffect(() => {
    fetchRoomDetails();
  }, [id]);

  const fetchRoomDetails = async () => {
    setLoading(true);
    try {
      const res = await api.getRoomById(id);
      if (res.success && res.data) {
        setRoom(res.data);
        if (res.data.hotelId?._id) {
          const revRes = await api.getHotelReviews(res.data.hotelId._id);
          if (revRes.success && revRes.data) {
            setReviews(revRes.data);
          }
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = () => {
    if (!isAuthenticated) {
      quickLogin('guest').then(() => {
        setBookingModalOpen(true);
      });
      return;
    }
    setBookingModalOpen(true);
  };

  const handleProceedToPayment = (bookingPayload) => {
    setCurrentBookingData(bookingPayload);
    setBookingModalOpen(false);
    setPaymentModalOpen(true);
  };

  const handlePaymentSuccess = async (method) => {
    try {
      const res = await api.createBooking({
        ...currentBookingData,
        paymentMethod: method
      });

      if (res.success) {
        setPaymentModalOpen(false);
        setConfirmedBooking({
          ...res.data.booking,
          hotelId: res.data.hotel,
          roomId: res.data.room,
          payment: res.data.payment
        });
        setInvoiceModalOpen(true);
      }
    } catch (err) {
      console.error(err);
      alert('Error finalizing booking');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      await quickLogin('guest');
    }
    setSubmittingReview(true);
    try {
      const res = await api.createReview({
        hotelId: room.hotelId?._id || room.hotelId,
        roomId: room._id,
        rating: newRating,
        title: 'Verified Stay Review',
        comment: newComment
      });
      if (res.success) {
        setReviews([res.data, ...reviews]);
        setNewComment('');
        alert('Thank you! Your verified review has been posted.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading || !room) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0', color: '#68788c' }}>
        Loading room specifications and photo gallery...
      </div>
    );
  }

  const hotel = room.hotelId || {};
  const images = room.images && room.images.length > 0 ? room.images : [hotel.bannerImage];
  const originalPrice = Math.round(room.pricePerNight * 1.25);
  const taxAmount = Math.round(room.pricePerNight * 0.12);

  return (
    <div style={{ padding: '30px 0 80px' }}>
      <div className="container">
        {/* Breadcrumb & Title */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '13px', color: '#68788c', marginBottom: '8px' }}>
            <Link to="/" style={{ color: '#006ce4' }}>Home</Link> ➔ <Link to={`/rooms?city=${hotel.city}`} style={{ color: '#006ce4' }}>{hotel.city} Hotels</Link> ➔ <span>{hotel.name}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span className="mmt-assured-badge">
                  <ShieldCheck size={14} />
                  <span>MMT ASSURED HOTEL</span>
                </span>
                <span style={{ fontSize: '12px', color: '#f5a623', display: 'flex', alignItems: 'center', gap: '2px' }}>
                  {[...Array(hotel.starRating || 5)].map((_, i) => (
                    <Star key={i} size={14} fill="#f5a623" />
                  ))}
                </span>
              </div>
              <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#1a2b48' }}>
                {room.title}
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#5b6c7f', fontSize: '14px', marginTop: '4px' }}>
                <MapPin size={16} color="#006ce4" />
                <span>{hotel.name} • {hotel.address}</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#1a2b48' }}>Excellent Quality</div>
                <div style={{ fontSize: '11px', color: '#7a8c9e' }}>1,480 Verified Ratings</div>
              </div>
              <div className="mmt-rating-badge" style={{ fontSize: '16px', padding: '6px 12px' }}>
                <span>4.8</span>
                <Star size={14} fill="white" color="white" />
              </div>
            </div>
          </div>
        </div>

        {/* Photo Gallery Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '12px',
          height: '420px',
          borderRadius: '16px',
          overflow: 'hidden',
          marginBottom: '32px',
          boxShadow: '0 8px 30px rgba(5,20,48,0.1)'
        }}>
          {/* Main Large Image */}
          <div style={{ height: '100%', background: '#eee' }}>
            <img
              src={images[activeImageIndex] || images[0]}
              alt="Main Room"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          {/* Thumbnails */}
          <div style={{ display: 'grid', gridTemplateRows: 'repeat(2, 1fr)', gap: '12px', height: '100%' }}>
            {images.slice(0, 2).map((img, i) => (
              <div
                key={i}
                onClick={() => setActiveImageIndex(i)}
                style={{
                  cursor: 'pointer',
                  border: activeImageIndex === i ? '3px solid #006ce4' : 'none',
                  borderRadius: '8px',
                  overflow: 'hidden'
                }}
              >
                <img src={img} alt="Thumb" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ))}
          </div>
        </div>

        {/* 2-Column Content Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '32px', alignItems: 'flex-start' }}>
          {/* Left Details Column */}
          <div>
            {/* Quick Specs Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '16px',
              background: '#ffffff',
              padding: '20px',
              borderRadius: '16px',
              border: '1px solid #e2ecf8',
              marginBottom: '24px'
            }}>
              <div>
                <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#7a8c9e', fontWeight: 700 }}>Occupancy</div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#1a2b48', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Users size={16} color="#006ce4" />
                  <span>Up to {room.capacity} Guests</span>
                </div>
              </div>

              <div>
                <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#7a8c9e', fontWeight: 700 }}>Room Size</div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#1a2b48', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Maximize2 size={16} color="#006ce4" />
                  <span>{room.roomSizeSqFt || 380} sq.ft</span>
                </div>
              </div>

              <div>
                <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#7a8c9e', fontWeight: 700 }}>Bed Configuration</div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#1a2b48', marginTop: '2px' }}>
                  {room.bedType || 'King Bed'}
                </div>
              </div>
            </div>

            {/* Hotel & Room Description */}
            <div style={{ background: '#ffffff', padding: '24px', borderRadius: '16px', border: '1px solid #e2ecf8', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#1a2b48', marginBottom: '12px' }}>
                About {hotel.name}
              </h3>
              <p style={{ color: '#4d5e71', lineHeight: 1.7, fontSize: '14px', marginBottom: '16px' }}>
                {hotel.description}
              </p>
              <div style={{ display: 'flex', gap: '20px', borderTop: '1px solid #eef2f7', paddingTop: '14px', fontSize: '13px', color: '#68788c' }}>
                <div><strong>Check-In:</strong> 02:00 PM</div>
                <div><strong>Check-Out:</strong> 11:00 AM</div>
                <div><strong>Sanitization:</strong> Fully Inspected</div>
              </div>
            </div>

            {/* Amenities Grid */}
            <div style={{ background: '#ffffff', padding: '24px', borderRadius: '16px', border: '1px solid #e2ecf8', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#1a2b48', marginBottom: '16px' }}>
                Room & Property Amenities
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' }}>
                {(room.amenities || []).map((amenity, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#334155' }}>
                    <div style={{ background: '#eaf2ff', color: '#006ce4', padding: '6px', borderRadius: '6px' }}>
                      <Check size={14} />
                    </div>
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Verified Guest Reviews & Form */}
            <div style={{ background: '#ffffff', padding: '24px', borderRadius: '16px', border: '1px solid #e2ecf8' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#1a2b48' }}>
                  Verified Guest Reviews ({reviews.length})
                </h3>
              </div>

              {/* Review Input Box */}
              <form onSubmit={handleReviewSubmit} style={{ background: '#fafcff', padding: '16px', borderRadius: '12px', border: '1px solid #e8eff8', marginBottom: '24px' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '8px', color: '#1a2b48' }}>
                  Share Your Experience
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                  <span style={{ fontSize: '12px', color: '#68788c' }}>Rating:</span>
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewRating(star)}
                      style={{ background: 'none' }}
                    >
                      <Star size={18} fill={star <= newRating ? '#f5a623' : 'none'} color="#f5a623" />
                    </button>
                  ))}
                </div>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  required
                  rows="2"
                  placeholder="Tell other travelers about the room view, staff hospitality, and amenities..."
                  style={{ width: '100%', marginBottom: '10px', resize: 'none' }}
                />
                <button type="submit" disabled={submittingReview} className="btn-mmt-primary" style={{ padding: '8px 20px', fontSize: '13px' }}>
                  Submit Review
                </button>
              </form>

              {/* Review items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {reviews.map(rev => (
                  <div key={rev._id} style={{ borderBottom: '1px solid #edf2f7', paddingBottom: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img
                          src={rev.userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
                          alt={rev.userName}
                          style={{ width: '32px', height: '32px', borderRadius: '50%' }}
                        />
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '13px' }}>{rev.userName}</div>
                          <div style={{ fontSize: '11px', color: '#8898aa' }}>{new Date(rev.createdAt).toLocaleDateString()}</div>
                        </div>
                      </div>
                      <div className="mmt-rating-badge" style={{ fontSize: '11px', padding: '2px 6px' }}>
                        <span>{rev.rating}</span>
                        <Star size={10} fill="white" color="white" />
                      </div>
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#1a2b48', marginTop: '8px' }}>
                      "{rev.title}"
                    </div>
                    <p style={{ fontSize: '13px', color: '#556677', marginTop: '4px', lineHeight: 1.5 }}>
                      {rev.comment}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sticky Booking Box */}
          <div style={{
            position: 'sticky',
            top: '110px',
            background: '#ffffff',
            borderRadius: '20px',
            padding: '24px',
            border: '1px solid #dce8f8',
            boxShadow: '0 10px 30px rgba(5,20,48,0.08)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '14px' }}>
              <div>
                <span style={{ fontSize: '12px', color: '#8a99aa', textDecoration: 'line-through' }}>
                  ₹{originalPrice.toLocaleString('en-IN')}
                </span>
                <div style={{ fontSize: '28px', fontWeight: 800, color: '#1a2b48' }}>
                  ₹{room.pricePerNight.toLocaleString('en-IN')}
                </div>
                <div style={{ fontSize: '11px', color: '#68788c' }}>
                  + ₹{taxAmount.toLocaleString('en-IN')} taxes per night
                </div>
              </div>
              <div style={{
                background: '#e6f7ec',
                color: '#0a8528',
                fontWeight: 700,
                fontSize: '11px',
                padding: '4px 8px',
                borderRadius: '4px'
              }}>
                20% OFF AVAILABLE
              </div>
            </div>

            {/* Inclusions */}
            <div style={{ borderTop: '1px solid #edf2f9', borderBottom: '1px solid #edf2f9', padding: '14px 0', margin: '14px 0', fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#0a8528', fontWeight: 600 }}>
                <Check size={14} />
                <span>Free cancellation anytime</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#334155' }}>
                <Coffee size={14} color="#f5a623" />
                <span>Complimentary breakfast included</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#334155' }}>
                <Wifi size={14} color="#006ce4" />
                <span>Free high-speed WiFi</span>
              </div>
            </div>

            <button
              onClick={handleBookNow}
              className="btn-mmt-primary"
              style={{ width: '100%', padding: '14px', fontSize: '16px' }}
            >
              BOOK THIS ROOM
            </button>

            <div style={{ fontSize: '11px', textAlign: 'center', color: '#8898aa', marginTop: '10px' }}>
              Instant Confirmation • No booking fee charged
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modals */}
      <BookingModal
        isOpen={bookingModalOpen}
        room={room}
        onClose={() => setBookingModalOpen(false)}
        onProceedToPayment={handleProceedToPayment}
      />

      <PaymentModal
        isOpen={paymentModalOpen}
        bookingData={currentBookingData}
        onClose={() => setPaymentModalOpen(false)}
        onPaymentSuccess={handlePaymentSuccess}
      />

      <InvoiceModal
        isOpen={invoiceModalOpen}
        booking={confirmedBooking}
        onClose={() => setInvoiceModalOpen(false)}
      />
    </div>
  );
}
