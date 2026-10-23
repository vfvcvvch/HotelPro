import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import FilterSidebar from '../components/FilterSidebar';
import RoomCard from '../components/RoomCard';
import BookingModal from '../components/BookingModal';
import PaymentModal from '../components/PaymentModal';
import InvoiceModal from '../components/InvoiceModal';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  Building2, 
  MapPin, 
  SlidersHorizontal, 
  ArrowUpDown,
  Search,
  Sparkles
} from 'lucide-react';

export default function RoomCatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAuthenticated, quickLogin } = useAuth();

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('recommended');

  const [filters, setFilters] = useState({
    city: searchParams.get('city') || '',
    category: searchParams.get('category') || '',
    minPrice: '',
    maxPrice: searchParams.get('maxPrice') || '25000',
    amenity: ''
  });

  // Booking Modal States
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [currentBookingData, setCurrentBookingData] = useState(null);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  useEffect(() => {
    fetchRooms();
  }, [filters, searchParams]);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.city) params.city = filters.city;
      if (filters.category) params.category = filters.category;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      if (filters.amenity) params.amenity = filters.amenity;

      const res = await api.getRooms(params);
      if (res.success && res.data) {
        setRooms(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleResetFilters = () => {
    setFilters({
      city: '',
      category: '',
      minPrice: '',
      maxPrice: '30000',
      amenity: ''
    });
    setSearchParams({});
  };

  const handleBookNow = (room) => {
    if (!isAuthenticated) {
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
      }
    } catch (err) {
      console.error(err);
      alert('Error booking room');
    }
  };

  // Sorting logic
  const sortedRooms = [...rooms].sort((a, b) => {
    if (sortBy === 'price_asc') return a.pricePerNight - b.pricePerNight;
    if (sortBy === 'price_desc') return b.pricePerNight - a.pricePerNight;
    return 0; // recommended
  });

  return (
    <div style={{ padding: '30px 0 60px' }}>
      <div className="container">
        {/* Top Filter Summary Bar */}
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '18px 24px',
          border: '1px solid #e1ebf8',
          boxShadow: '0 4px 16px rgba(5, 20, 48, 0.04)',
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '14px'
        }}>
          <div>
            <div style={{ fontSize: '12px', color: '#68788c', fontWeight: 600 }}>
              Showing verified hotel rooms in:
            </div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#1a2b48', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin size={20} color="#006ce4" />
              <span>{filters.city ? `${filters.city}, India` : 'All Available Destinations in India'}</span>
              <span style={{ fontSize: '13px', color: '#006ce4', background: '#eaf2ff', padding: '2px 8px', borderRadius: '12px' }}>
                {rooms.length} stays found
              </span>
            </div>
          </div>

          {/* Quick city filter chips */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['All', 'Goa', 'Mumbai', 'Jaipur', 'Delhi', 'Manali'].map(c => {
              const active = (c === 'All' && !filters.city) || filters.city === c;
              return (
                <button
                  key={c}
                  onClick={() => setFilters(prev => ({ ...prev, city: c === 'All' ? '' : c }))}
                  style={{
                    background: active ? '#006ce4' : '#f0f5fc',
                    color: active ? '#fff' : '#475569',
                    padding: '6px 14px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 700
                  }}
                >
                  {c}
                </button>
              );
            })}
          </div>

          {/* Sorting Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ArrowUpDown size={15} color="#68788c" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                border: '1px solid #ccd9ea',
                borderRadius: '8px',
                padding: '8px 12px',
                fontSize: '13px',
                fontWeight: 600,
                color: '#1a2b48',
                background: '#fff'
              }}
            >
              <option value="recommended">Sort by: Recommended</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* 2-Column Catalog Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '24px', alignItems: 'flex-start' }}>
          {/* Left: Filter Sidebar */}
          <FilterSidebar
            filters={filters}
            setFilters={setFilters}
            onReset={handleResetFilters}
          />

          {/* Right: Room Cards */}
          <div>
            {loading ? (
              <div style={{ background: '#fff', padding: '60px', borderRadius: '16px', textAlign: 'center', color: '#7a8c9e' }}>
                Fetching verified rooms...
              </div>
            ) : sortedRooms.length === 0 ? (
              <div style={{ background: '#fff', padding: '60px', borderRadius: '16px', textAlign: 'center' }}>
                <Building2 size={48} color="#006ce4" style={{ margin: '0 auto 12px', opacity: 0.5 }} />
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1a2b48' }}>No matching rooms found</h3>
                <p style={{ color: '#68788c', fontSize: '14px', marginTop: '4px' }}>Try widening your price range or clearing selected filters.</p>
                <button onClick={handleResetFilters} className="btn-mmt-primary" style={{ marginTop: '16px', padding: '8px 20px', fontSize: '13px' }}>
                  Reset Filters
                </button>
              </div>
            ) : (
              sortedRooms.map(room => (
                <RoomCard
                  key={room._id}
                  room={room}
                  onBookNow={handleBookNow}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Booking Modals */}
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
