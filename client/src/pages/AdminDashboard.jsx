import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { 
  ShieldCheck, 
  TrendingUp, 
  DollarSign, 
  CalendarCheck, 
  Users, 
  Percent, 
  Edit3, 
  Check, 
  History,
  AlertCircle,
  Building2,
  RefreshCw
} from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Price Edit State
  const [editingRoomId, setEditingRoomId] = useState(null);
  const [newPrice, setNewPrice] = useState('');

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, roomsRes] = await Promise.all([
        api.getAdminStats(),
        api.getAdminUsers(),
        api.getRooms()
      ]);

      if (statsRes.success) setStats(statsRes.data);
      if (usersRes.success) setUsers(usersRes.data);
      if (roomsRes.success) setRooms(roomsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRole = async (userId, newRole) => {
    try {
      const res = await api.updateUserRole(userId, newRole);
      if (res.success) {
        setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
        alert(`User role changed to ${newRole}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSavePrice = async (roomId) => {
    try {
      const res = await api.updateRoomPrice(roomId, newPrice);
      if (res.success) {
        setRooms(rooms.map(r => r._id === roomId ? { ...r, pricePerNight: Number(newPrice) } : r));
        setEditingRoomId(null);
        alert('Room price updated successfully!');
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading || !stats) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0', color: '#68788c' }}>
        Loading executive analytics and revenue matrices...
      </div>
    );
  }

  // Monthly revenue chart max for scaling
  const maxRevenue = Math.max(...(stats.monthlyRevenue || []).map(m => m.revenue), 100000);

  return (
    <div style={{ padding: '30px 0 80px' }}>
      <div className="container">
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #051430 0%, #1e293b 100%)',
          borderRadius: '20px',
          padding: '24px 32px',
          color: '#ffffff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '28px',
          boxShadow: '0 8px 24px rgba(5,20,48,0.12)'
        }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(228, 27, 35, 0.25)', border: '1px solid #e41b23', padding: '3px 12px', borderRadius: '14px', fontSize: '11px', fontWeight: 800, color: '#ff7b72', marginBottom: '8px' }}>
              <ShieldCheck size={14} />
              <span>SYSTEM ADMINISTRATION CONSOLE</span>
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#fff' }}>
              Executive Performance & Hotel Operations
            </h1>
            <p style={{ fontSize: '13px', color: '#cbd5e1' }}>
              Real-time financial turnover, dynamic seasonal room pricing, and user privilege audits.
            </p>
          </div>

          <button
            onClick={fetchAdminData}
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
            Refresh Analytics
          </button>
        </div>

        {/* 4 Metric Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' }}>
          {[
            { label: 'Total Revenue', value: `₹${stats.totalRevenue?.toLocaleString('en-IN')}`, icon: DollarSign, color: '#006ce4', sub: '+18.4% this quarter' },
            { label: 'Occupancy Rate', value: `${stats.occupancyRate}%`, icon: Percent, color: '#0a8528', sub: `${stats.occupiedRooms} / ${stats.totalRooms} rooms occupied` },
            { label: 'Total Reservations', value: stats.totalBookings, icon: CalendarCheck, color: '#7c3aed', sub: `${stats.activeBookings} active stays` },
            { label: 'Registered Users', value: stats.totalUsers, icon: Users, color: '#e41b23', sub: 'Across Guest, Staff, Admin' }
          ].map((card, i) => {
            const Icon = card.icon;
            return (
              <div key={i} style={{ background: '#ffffff', borderRadius: '16px', padding: '20px', border: '1px solid #e2ecf8', boxShadow: '0 2px 10px rgba(5,20,48,0.04)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>{card.label}</span>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `${card.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={18} color={card.color} />
                  </div>
                </div>
                <div style={{ fontSize: '26px', fontWeight: 800, color: '#1a2b48' }}>{card.value}</div>
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>{card.sub}</div>
              </div>
            );
          })}
        </div>

        {/* 2-Column Analytics Charts */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px', marginBottom: '32px' }}>
          {/* Monthly Revenue Bar Chart (SVG) */}
          <div style={{ background: '#ffffff', borderRadius: '16px', padding: '24px', border: '1px solid #e2ecf8' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#1a2b48' }}>Monthly Revenue Turnover</h3>
                <div style={{ fontSize: '12px', color: '#64748b' }}>Gross room sales in INR</div>
              </div>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#0a8528', background: '#e6f7ec', padding: '4px 10px', borderRadius: '12px' }}>
                Steady Growth
              </span>
            </div>

            {/* SVG Bar Chart */}
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '200px', padding: '10px 0', borderBottom: '1px solid #edf2f7' }}>
              {(stats.monthlyRevenue || []).map((item, idx) => {
                const heightPercent = Math.max(15, Math.round((item.revenue / maxRevenue) * 100));
                return (
                  <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, gap: '8px' }}>
                    <div style={{ fontSize: '10px', fontWeight: 700, color: '#006ce4' }}>
                      ₹{(item.revenue / 1000).toFixed(0)}k
                    </div>
                    <div style={{
                      width: '36px',
                      height: `${heightPercent * 1.5}px`,
                      background: 'linear-gradient(180deg, #0077ff 0%, #0056cc 100%)',
                      borderRadius: '6px 6px 0 0',
                      transition: 'all 0.3s ease'
                    }} />
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748b' }}>{item.month}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Occupancy by Category */}
          <div style={{ background: '#ffffff', borderRadius: '16px', padding: '24px', border: '1px solid #e2ecf8' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#1a2b48', marginBottom: '6px' }}>Room Type Distribution</h3>
            <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '20px' }}>Current active occupancy by tier</div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {(stats.categoryDistribution || []).map((cat, i) => {
                const percent = Math.round((cat.occupied / cat.rooms) * 100);
                return (
                  <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                      <span style={{ color: '#1a2b48' }}>{cat.category}</span>
                      <span style={{ color: '#006ce4' }}>{cat.occupied}/{cat.rooms} Occupied ({percent}%)</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${percent}%`, height: '100%', background: percent > 50 ? '#0a8528' : '#006ce4', borderRadius: '4px' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Dynamic Pricing Management */}
        <div style={{ background: '#ffffff', borderRadius: '16px', padding: '24px', border: '1px solid #e2ecf8', marginBottom: '32px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#1a2b48', marginBottom: '4px' }}>
            Dynamic Room Inventory & Seasonal Pricing
          </h3>
          <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>
            Adjust live room tariffs for holiday peaks and festive seasons.
          </p>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: '#f8fafd', color: '#475569', textAlign: 'left', borderBottom: '1px solid #e2ecf8' }}>
                <th style={{ padding: '12px 14px' }}>Room #</th>
                <th style={{ padding: '12px 14px' }}>Title & Hotel</th>
                <th style={{ padding: '12px 14px' }}>Category</th>
                <th style={{ padding: '12px 14px' }}>Status</th>
                <th style={{ padding: '12px 14px' }}>Current Price / Night</th>
                <th style={{ padding: '12px 14px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map(room => (
                <tr key={room._id} style={{ borderBottom: '1px solid #edf2f7' }}>
                  <td style={{ padding: '12px 14px', fontWeight: 800, color: '#1a2b48' }}>#{room.roomNumber}</td>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ fontWeight: 700, color: '#1a2b48' }}>{room.title}</div>
                    <div style={{ fontSize: '11px', color: '#7a8c9e' }}>{room.hotelId?.name || 'Hotel'}</div>
                  </td>
                  <td style={{ padding: '12px 14px', color: '#006ce4', fontWeight: 600 }}>{room.categoryName}</td>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: room.status === 'available' ? '#0a8528' : '#d97706' }}>
                      ● {room.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px 14px', fontWeight: 800 }}>
                    {editingRoomId === room._id ? (
                      <input
                        type="number"
                        value={newPrice}
                        onChange={(e) => setNewPrice(e.target.value)}
                        style={{ width: '100px', padding: '4px 8px', fontSize: '13px', fontWeight: 800 }}
                      />
                    ) : (
                      <span>₹{room.pricePerNight?.toLocaleString('en-IN')}</span>
                    )}
                  </td>
                  <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                    {editingRoomId === room._id ? (
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => handleSavePrice(room._id)}
                          style={{ background: '#0a8528', color: '#fff', padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 700 }}
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingRoomId(null)}
                          style={{ background: '#eee', color: '#444', padding: '4px 10px', borderRadius: '4px', fontSize: '12px' }}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setEditingRoomId(room._id);
                          setNewPrice(room.pricePerNight);
                        }}
                        style={{
                          background: '#eaf2ff',
                          color: '#006ce4',
                          padding: '5px 12px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: 700,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <Edit3 size={13} />
                        Update Price
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* User Directory & Privilege Management */}
        <div style={{ background: '#ffffff', borderRadius: '16px', padding: '24px', border: '1px solid #e2ecf8', marginBottom: '32px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#1a2b48', marginBottom: '4px' }}>
            User Roles & Staff Privileges
          </h3>
          <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>
            Elevate staff members or adjust system administration roles.
          </p>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: '#f8fafd', color: '#475569', textAlign: 'left', borderBottom: '1px solid #e2ecf8' }}>
                <th style={{ padding: '12px 14px' }}>User Name</th>
                <th style={{ padding: '12px 14px' }}>Email Address</th>
                <th style={{ padding: '12px 14px' }}>Phone</th>
                <th style={{ padding: '12px 14px' }}>Current Role</th>
                <th style={{ padding: '12px 14px', textAlign: 'right' }}>Privilege Assignment</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id} style={{ borderBottom: '1px solid #edf2f7' }}>
                  <td style={{ padding: '12px 14px', fontWeight: 700, color: '#1a2b48' }}>{u.name}</td>
                  <td style={{ padding: '12px 14px', color: '#64748b' }}>{u.email}</td>
                  <td style={{ padding: '12px 14px', color: '#64748b' }}>{u.phone || '+91 9876543210'}</td>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{
                      background: u.role === 'admin' ? '#ffeceb' : u.role === 'staff' ? '#eaf2ff' : '#f1f5f9',
                      color: u.role === 'admin' ? '#e41b23' : u.role === 'staff' ? '#006ce4' : '#475569',
                      padding: '3px 8px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: 800,
                      textTransform: 'uppercase'
                    }}>
                      {u.role}
                    </span>
                  </td>
                  <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                    <select
                      value={u.role}
                      onChange={(e) => handleUpdateRole(u._id, e.target.value)}
                      style={{ padding: '4px 8px', fontSize: '12px', fontWeight: 600, borderRadius: '6px' }}
                    >
                      <option value="guest">Guest</option>
                      <option value="staff">Staff</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Security & Audit Activity Logs */}
        <div style={{ background: '#ffffff', borderRadius: '16px', padding: '24px', border: '1px solid #e2ecf8' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <History size={18} color="#006ce4" />
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#1a2b48' }}>
              Security & Activity Audit Logs
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {(stats.recentLogs || []).map(log => (
              <div
                key={log._id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 16px',
                  background: '#f8fafd',
                  borderRadius: '10px',
                  border: '1px solid #edf2f7',
                  fontSize: '13px'
                }}
              >
                <div>
                  <span style={{ fontWeight: 800, color: '#006ce4' }}>[{log.action}]</span>{' '}
                  <span style={{ color: '#1a2b48' }}>{log.details}</span>
                  <div style={{ fontSize: '11px', color: '#7a8c9e', marginTop: '2px' }}>
                    Initiated by {log.userName} ({log.role}) • IP: {log.ipAddress || '127.0.0.1'}
                  </div>
                </div>
                <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>
                  {new Date(log.timestamp || log.createdAt).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
