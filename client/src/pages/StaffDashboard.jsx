import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { 
  UserCheck, 
  DoorClosed, 
  Sparkles, 
  ClipboardList, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  RefreshCw,
  LogOut,
  Bed,
  MapPin
} from 'lucide-react';

export default function StaffDashboard() {
  const [activeTab, setActiveTab] = useState('arrivals');
  const [data, setData] = useState({
    arrivals: [],
    checkedInGuests: [],
    departures: [],
    rooms: [],
    serviceRequests: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStaffOverview();
  }, []);

  const fetchStaffOverview = async () => {
    setLoading(true);
    try {
      const res = await api.getStaffOverview();
      if (res.success && res.data) {
        setData(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async (bookingId) => {
    try {
      const res = await api.checkInGuest(bookingId);
      if (res.success) {
        alert('Guest checked in successfully! Room status set to Occupied.');
        fetchStaffOverview();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCheckOut = async (bookingId) => {
    try {
      const res = await api.checkOutGuest(bookingId);
      if (res.success) {
        alert('Guest checked out successfully! Room queued for Housekeeping Cleaning.');
        fetchStaffOverview();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleRoomStatus = async (roomId, newStatus) => {
    try {
      const res = await api.updateRoomStatus(roomId, newStatus);
      if (res.success) {
        fetchStaffOverview();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateTicket = async (ticketId, status) => {
    try {
      const res = await api.updateServiceTicket(ticketId, status);
      if (res.success) {
        fetchStaffOverview();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return { bg: '#e6f7ec', text: '#0a8528', border: '#a5d6a7' };
      case 'occupied': return { bg: '#eaf2ff', text: '#006ce4', border: '#90caf9' };
      case 'cleaning': return { bg: '#fff4e5', text: '#d97706', border: '#ffe082' };
      case 'maintenance': return { bg: '#ffeceb', text: '#e41b23', border: '#ef9a9a' };
      default: return { bg: '#f1f5f9', text: '#475569', border: '#cbd5e1' };
    }
  };

  return (
    <div style={{ padding: '30px 0 80px' }}>
      <div className="container">
        {/* Top Header */}
        <div style={{
          background: 'linear-gradient(135deg, #051430 0%, #0a2558 100%)',
          color: '#ffffff',
          borderRadius: '20px',
          padding: '24px 30px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '28px',
          boxShadow: '0 8px 24px rgba(5,20,48,0.12)'
        }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.15)', padding: '3px 12px', borderRadius: '14px', fontSize: '11px', fontWeight: 800, color: '#ffd573', marginBottom: '8px' }}>
              <UserCheck size={14} />
              <span>FRONT DESK & OPERATIONS PORTAL</span>
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#fff' }}>
              Hotel Staff Command Center
            </h1>
            <p style={{ fontSize: '13px', color: '#b9d2f2' }}>
              Process live check-ins, manage departures, and update room housekeeping availability.
            </p>
          </div>

          <button
            onClick={fetchStaffOverview}
            style={{
              background: '#006ce4',
              color: '#fff',
              padding: '10px 18px',
              borderRadius: '20px',
              fontSize: '13px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <RefreshCw size={15} />
            Refresh Data
          </button>
        </div>

        {/* Navigation Tabs */}
        <div style={{
          display: 'flex',
          gap: '12px',
          borderBottom: '2px solid #e2ecf8',
          marginBottom: '24px'
        }}>
          {[
            { id: 'arrivals', label: `Arrivals / Check-In (${data.arrivals?.length || 0})`, icon: DoorClosed },
            { id: 'departures', label: `Checked-In / Departures (${data.departures?.length || 0})`, icon: LogOut },
            { id: 'housekeeping', label: `Housekeeping Matrix (${data.rooms?.length || 0} Rooms)`, icon: Sparkles },
            { id: 'tickets', label: `Service Requests (${data.serviceRequests?.length || 0})`, icon: ClipboardList }
          ].map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  background: 'none',
                  color: active ? '#006ce4' : '#64748b',
                  borderBottom: active ? '3px solid #006ce4' : '3px solid transparent',
                  padding: '12px 18px',
                  fontWeight: active ? 800 : 600,
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '-2px'
                }}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Arrivals (Check-In) */}
        {activeTab === 'arrivals' && (
          <div>
            {data.arrivals?.length === 0 ? (
              <div style={{ background: '#fff', padding: '60px', borderRadius: '16px', textAlign: 'center', color: '#64748b' }}>
                No pending arrivals scheduled.
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
                {data.arrivals.map(b => (
                  <div key={b._id} style={{ background: '#fff', borderRadius: '16px', padding: '20px', border: '1px solid #e2ecf8', boxShadow: '0 2px 10px rgba(5,20,48,0.04)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: '#0a8528', background: '#e6f7ec', padding: '3px 8px', borderRadius: '4px' }}>
                        CONFIRMED RESERVATION
                      </span>
                      <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>{b.bookingNumber}</span>
                    </div>

                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1a2b48' }}>
                      {b.guestDetails?.name || 'Guest'}
                    </h3>
                    <div style={{ fontSize: '13px', color: '#556677', marginTop: '2px' }}>
                      Phone: {b.guestDetails?.phone || '+91 9876543210'}
                    </div>
                    <div style={{ fontSize: '13px', color: '#006ce4', fontWeight: 600, marginTop: '8px' }}>
                      {b.roomId?.title || 'Deluxe Room'} (Room #{b.roomId?.roomNumber || '101'})
                    </div>

                    <div style={{ background: '#f8fafd', padding: '10px', borderRadius: '8px', margin: '12px 0', fontSize: '12px', color: '#556677' }}>
                      <div>Stay: {new Date(b.checkInDate).toLocaleDateString()} to {new Date(b.checkOutDate).toLocaleDateString()} ({b.nights} nights)</div>
                      <div style={{ marginTop: '2px', fontStyle: 'italic', color: '#778899' }}>"{b.guestDetails?.specialRequests || 'No special requests'}"</div>
                    </div>

                    <button
                      onClick={() => handleCheckIn(b._id)}
                      className="btn-mmt-primary"
                      style={{ width: '100%', padding: '10px', fontSize: '13px' }}
                    >
                      <UserCheck size={16} />
                      CHECK-IN GUEST & ASSIGN ROOM
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Departures (Check-Out) */}
        {activeTab === 'departures' && (
          <div>
            {data.departures?.length === 0 ? (
              <div style={{ background: '#fff', padding: '60px', borderRadius: '16px', textAlign: 'center', color: '#64748b' }}>
                No active in-house guests for checkout.
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
                {data.departures.map(b => (
                  <div key={b._id} style={{ background: '#fff', borderRadius: '16px', padding: '20px', border: '1px solid #e2ecf8', boxShadow: '0 2px 10px rgba(5,20,48,0.04)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: '#006ce4', background: '#eaf2ff', padding: '3px 8px', borderRadius: '4px' }}>
                        IN-HOUSE / OCCUPIED
                      </span>
                      <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>Room #{b.roomId?.roomNumber || '101'}</span>
                    </div>

                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1a2b48' }}>
                      {b.guestDetails?.name || 'Guest'}
                    </h3>
                    <div style={{ fontSize: '13px', color: '#556677', marginTop: '2px' }}>
                      Booking: {b.bookingNumber} • Total: ₹{b.totalAmount?.toLocaleString('en-IN')} (PAID)
                    </div>

                    <div style={{ background: '#f8fafd', padding: '10px', borderRadius: '8px', margin: '12px 0', fontSize: '12px', color: '#556677' }}>
                      Check-out Scheduled: {new Date(b.checkOutDate).toLocaleDateString()} (11:00 AM)
                    </div>

                    <button
                      onClick={() => handleCheckOut(b._id)}
                      style={{
                        width: '100%',
                        padding: '10px',
                        fontSize: '13px',
                        background: '#e41b23',
                        color: '#fff',
                        borderRadius: '24px',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                    >
                      <LogOut size={16} />
                      PROCESS CHECK-OUT & QUEUE CLEANING
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Housekeeping Room Matrix */}
        {activeTab === 'housekeeping' && (
          <div>
            <div style={{ marginBottom: '16px', display: 'flex', gap: '14px', alignItems: 'center', fontSize: '12px', fontWeight: 700 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#0a8528' }}></span> Available (Ready)</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#006ce4' }}></span> Occupied (Guest in room)</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#d97706' }}></span> Cleaning (Housekeeping)</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#e41b23' }}></span> Maintenance</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '18px' }}>
              {data.rooms?.map(room => {
                const color = getStatusColor(room.status);
                return (
                  <div
                    key={room._id}
                    style={{
                      background: '#ffffff',
                      borderRadius: '14px',
                      padding: '18px',
                      border: `1.5px solid ${color.border}`,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '18px', fontWeight: 800, color: '#1a2b48' }}>
                        Room #{room.roomNumber}
                      </span>
                      <span style={{
                        background: color.bg,
                        color: color.text,
                        fontSize: '11px',
                        fontWeight: 800,
                        padding: '3px 8px',
                        borderRadius: '4px',
                        textTransform: 'uppercase'
                      }}>
                        {room.status}
                      </span>
                    </div>

                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>{room.title}</div>
                    <div style={{ fontSize: '12px', color: '#7a8c9e', marginTop: '2px' }}>
                      {room.hotelId?.name || 'Hotel'} • ₹{room.pricePerNight}/night
                    </div>

                    {/* Quick State Toggle Buttons */}
                    <div style={{ borderTop: '1px solid #edf2f7', paddingTop: '12px', marginTop: '12px' }}>
                      <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, marginBottom: '6px' }}>Set Status:</div>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          onClick={() => handleToggleRoomStatus(room._id, 'available')}
                          style={{
                            flex: 1,
                            padding: '6px',
                            background: room.status === 'available' ? '#0a8528' : '#e6f7ec',
                            color: room.status === 'available' ? '#fff' : '#0a8528',
                            borderRadius: '6px',
                            fontSize: '11px',
                            fontWeight: 700
                          }}
                        >
                          Clean
                        </button>
                        <button
                          onClick={() => handleToggleRoomStatus(room._id, 'cleaning')}
                          style={{
                            flex: 1,
                            padding: '6px',
                            background: room.status === 'cleaning' ? '#d97706' : '#fff4e5',
                            color: room.status === 'cleaning' ? '#fff' : '#d97706',
                            borderRadius: '6px',
                            fontSize: '11px',
                            fontWeight: 700
                          }}
                        >
                          Dirty
                        </button>
                        <button
                          onClick={() => handleToggleRoomStatus(room._id, 'maintenance')}
                          style={{
                            flex: 1,
                            padding: '6px',
                            background: room.status === 'maintenance' ? '#e41b23' : '#ffeceb',
                            color: room.status === 'maintenance' ? '#fff' : '#e41b23',
                            borderRadius: '6px',
                            fontSize: '11px',
                            fontWeight: 700
                          }}
                        >
                          Repair
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 4: Service Requests */}
        {activeTab === 'tickets' && (
          <div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {data.serviceRequests?.map(ticket => (
                <div
                  key={ticket._id}
                  style={{
                    background: '#ffffff',
                    borderRadius: '12px',
                    padding: '18px 22px',
                    border: '1px solid #e1ebf8',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '14px'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{
                        background: ticket.status === 'completed' ? '#e6f7ec' : '#fff4e5',
                        color: ticket.status === 'completed' ? '#0a8528' : '#d97706',
                        fontSize: '11px',
                        fontWeight: 800,
                        padding: '2px 8px',
                        borderRadius: '4px',
                        textTransform: 'uppercase'
                      }}>
                        {ticket.status}
                      </span>
                      <span style={{ fontSize: '13px', fontWeight: 800, color: '#1a2b48' }}>
                        Room #{ticket.roomNumber} ({ticket.guestName})
                      </span>
                      <span style={{ fontSize: '11px', color: '#7a8c9e' }}>• Priority: {ticket.priority}</span>
                    </div>
                    <div style={{ fontSize: '13px', color: '#475569' }}>
                      {ticket.notes}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    {ticket.status !== 'in-progress' && ticket.status !== 'completed' && (
                      <button
                        onClick={() => handleUpdateTicket(ticket._id, 'in-progress')}
                        style={{ background: '#eaf2ff', color: '#006ce4', padding: '6px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: 700 }}
                      >
                        Start Service
                      </button>
                    )}
                    {ticket.status !== 'completed' && (
                      <button
                        onClick={() => handleUpdateTicket(ticket._id, 'completed')}
                        style={{ background: '#0a8528', color: '#fff', padding: '6px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: 700 }}
                      >
                        Mark Completed
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
