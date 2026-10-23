import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import HeroSearch from '../components/HeroSearch';
import RoomCard from '../components/RoomCard';
import BookingModal from '../components/BookingModal';
import PaymentModal from '../components/PaymentModal';
import InvoiceModal from '../components/InvoiceModal';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  ShieldCheck, 
  Sparkles, 
  Clock, 
  CreditCard, 
  HeartHandshake, 
  Star, 
  MapPin, 
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

export default function HomePage() {
  const { isAuthenticated, quickLogin } = useAuth();
  const navigate = useNavigate();

  const [featuredRooms, setFeaturedRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Booking Flow State
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [currentBookingData, setCurrentBookingData] = useState(null);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await api.getRooms();
        if (res.success && res.data) {
          setFeaturedRooms(res.data.slice(0, 4));
        }
      } catch (err) {
        console.error('Failed to load featured rooms:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  const handleBookNow = (room) => {
    if (!isAuthenticated) {
      // Auto-switch to guest mode for effortless evaluation
      quickLogin('guest').then(() => {
        setSelectedRoom(room);
        setBookingModalOpen(true);
      });
      return;
    }
    setSelectedRoom(room);
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
      } else {
        alert(res.message || 'Booking creation failed');
      }
    } catch (err) {
      console.error(err);
      alert('Error finalizing booking');
    }
  };

  const destinations = [
    { name: 'Goa', tag: 'Beaches & Nightlife', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=500&q=80', startingPrice: '₹3,999' },
    { name: 'Mumbai', tag: 'Skyline & Marine Drive', image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=500&q=80', startingPrice: '₹4,999' },
    { name: 'Jaipur', tag: 'Royal Forts & Palaces', image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=500&q=80', startingPrice: '₹4,500' },
    { name: 'Manali', tag: 'Snow Peaks & Pine Valleys', image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=500&q=80', startingPrice: '₹4,200' },
    { name: 'Delhi', tag: 'Heritage & Diplomatic Heart', image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=500&q=80', startingPrice: '₹3,800' }
  ];

  return (
    <div>
      {/* 1. Signature Hero Search Section */}
      <HeroSearch />

      {/* 2. Popular Indian Destinations Carousel / Grid */}
      <section style={{ padding: '60px 0 30px' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px' }}>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: '#006ce4', letterSpacing: '0.5px' }}>
                EXPLORE INDIA
              </div>
              <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#1a2b48' }}>
                Trending Travel Destinations
              </h2>
            </div>
            <Link to="/rooms" style={{ color: '#006ce4', fontWeight: 700, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              View all 25+ stays ➔
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '20px' }}>
            {destinations.map(d => (
              <div
                key={d.name}
                onClick={() => navigate(`/rooms?city=${d.name}`)}
                style={{
                  position: 'relative',
                  height: '240px',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(5,20,48,0.08)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}
              >
                <img src={d.image} alt={d.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, transparent 40%, rgba(5, 20, 48, 0.85) 100%)',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  color: '#fff'
                }}>
                  <div style={{ fontSize: '20px', fontWeight: 800 }}>{d.name}</div>
                  <div style={{ fontSize: '11px', color: '#c9daef' }}>{d.tag}</div>
                  <div style={{ fontSize: '12px', color: '#ffd573', fontWeight: 700, marginTop: '4px' }}>
                    From {d.startingPrice} / night
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Featured MMT Assured Properties */}
      <section style={{ padding: '40px 0 60px' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <div className="mmt-assured-badge" style={{ marginBottom: '6px' }}>
                <ShieldCheck size={14} />
                <span>HOTELPRO ASSURED • 100% QUALITY PROMISE</span>
              </div>
              <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#1a2b48' }}>
                Handpicked Stays for You
              </h2>
            </div>
            <Link to="/rooms" className="btn-mmt-outline">
              Explore All Available Rooms
            </Link>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#7a8c9e' }}>
              Loading top properties...
            </div>
          ) : (
            <div>
              {featuredRooms.map(room => (
                <RoomCard
                  key={room._id}
                  room={room}
                  onBookNow={handleBookNow}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. Why Book With HotelPro / MakeMyTrip Promises */}
      <section style={{ background: '#ffffff', padding: '60px 0', borderTop: '1px solid #e6ecf5' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 40px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#1a2b48' }}>
              Why Book With HotelPro?
            </h2>
            <p style={{ color: '#68788c', fontSize: '15px', marginTop: '6px' }}>
              Designed to bring trust, comfort, and peace of mind to millions of travelers across India.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '30px' }}>
            {[
              {
                icon: ShieldCheck,
                color: '#006ce4',
                title: 'MakeMyTrip Assured Stays',
                desc: 'Rigorous 24-point quality inspections, sanitized rooms, and guaranteed fresh linen.'
              },
              {
                icon: CreditCard,
                color: '#e41b23',
                title: 'Instant Refund Policy',
                desc: 'Cancel with zero hassle up to 24 hours prior to check-in for 100% refund.'
              },
              {
                icon: Clock,
                color: '#f5a623',
                title: '24/7 Concierge Support',
                desc: 'Dedicated on-site and phone support to assist with check-ins, transfers, and custom dining.'
              },
              {
                icon: Sparkles,
                color: '#0a8528',
                title: 'Best Rate Guarantee',
                desc: 'Unlock exclusive member rates and extra 20% savings with coupon HOTELPRO20.'
              }
            ].map((perk, i) => {
              const Icon = perk.icon;
              return (
                <div key={i} style={{
                  padding: '24px',
                  borderRadius: '16px',
                  background: '#fafcff',
                  border: '1px solid #e8eff8'
                }}>
                  <div style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    background: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                    marginBottom: '16px'
                  }}>
                    <Icon size={24} color={perk.color} />
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px', color: '#1a2b48' }}>
                    {perk.title}
                  </h3>
                  <p style={{ fontSize: '13px', color: '#627385', lineHeight: 1.6 }}>
                    {perk.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Modals */}
      <BookingModal
        isOpen={bookingModalOpen}
        room={selectedRoom}
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
