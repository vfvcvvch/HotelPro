import React from 'react';
import { X, Printer, Download, CheckCircle2, Building2, QrCode } from 'lucide-react';

export default function InvoiceModal({ isOpen, onClose, booking }) {
  if (!isOpen || !booking) return null;

  const hotel = booking.hotelId || {};
  const room = booking.roomId || {};
  const guest = booking.guestDetails || {};
  const payment = booking.payment || {};

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(5, 20, 48, 0.75)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1200,
      padding: '20px'
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: '20px',
        width: '100%',
        maxWidth: '700px',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
        animation: 'fadeIn 0.25s ease'
      }}>
        {/* Top Control Bar */}
        <div style={{
          padding: '14px 24px',
          background: '#f8fafd',
          borderBottom: '1px solid #edf2f9',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#006ce4' }}>
            Official Booking Confirmation & Tax Invoice
          </span>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={handlePrint}
              style={{
                background: '#eaf2ff',
                color: '#006ce4',
                padding: '6px 14px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Printer size={14} />
              Print / Save PDF
            </button>
            <button
              onClick={onClose}
              style={{
                background: '#eee',
                color: '#555',
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Printable Invoice Document */}
        <div id="printable-invoice" style={{ padding: '32px' }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #006ce4', paddingBottom: '20px', marginBottom: '24px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ background: '#006ce4', padding: '6px', borderRadius: '6px', color: '#fff' }}>
                  <Building2 size={20} />
                </div>
                <span style={{ fontSize: '24px', fontWeight: 800, color: '#051430' }}>
                  Hotel<span style={{ color: '#e41b23' }}>Pro</span>
                </span>
              </div>
              <div style={{ fontSize: '12px', color: '#667788', marginTop: '6px' }}>
                Hospitality Booking Network Pvt. Ltd.<br />
                GSTIN: 27AABCH1942M1Z8 • Reg No: HP-2026-9812
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#0a8528', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
                <CheckCircle2 size={18} />
                <span>CONFIRMED</span>
              </div>
              <div style={{ fontSize: '12px', color: '#445566', marginTop: '4px' }}>
                <strong>Booking ID:</strong> {booking.bookingNumber}<br />
                <strong>Invoice No:</strong> {payment.invoiceNumber || 'INV-2026-00481'}<br />
                <strong>Date:</strong> {new Date(booking.createdAt || Date.now()).toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Hotel & Guest Section */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', background: '#fafcff', padding: '16px', borderRadius: '12px', border: '1px solid #eef3fa', marginBottom: '24px' }}>
            <div>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#7a8c9e', fontWeight: 700 }}>Hotel Information</div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: '#1a2b48', marginTop: '2px' }}>{hotel.name || 'Grand Resort'}</div>
              <div style={{ fontSize: '12px', color: '#556677', marginTop: '2px' }}>{hotel.address || hotel.city}</div>
              <div style={{ fontSize: '12px', color: '#006ce4', fontWeight: 600, marginTop: '4px' }}>Room: {room.title || 'Deluxe Room'}</div>
            </div>

            <div>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#7a8c9e', fontWeight: 700 }}>Guest Information</div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: '#1a2b48', marginTop: '2px' }}>{guest.name || 'Guest Traveler'}</div>
              <div style={{ fontSize: '12px', color: '#556677', marginTop: '2px' }}>Email: {guest.email || 'guest@hotelpro.com'}</div>
              <div style={{ fontSize: '12px', color: '#556677' }}>Phone: {guest.phone || '+91 9876543210'}</div>
            </div>
          </div>

          {/* Dates & Stay specs */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', border: '1px solid #e2ecf8', borderRadius: '10px', padding: '14px', marginBottom: '24px' }}>
            <div>
              <div style={{ fontSize: '11px', color: '#7a8c9e', fontWeight: 600 }}>CHECK-IN</div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#1a2b48' }}>
                {new Date(booking.checkInDate).toLocaleDateString()}
              </div>
              <div style={{ fontSize: '11px', color: '#90a0b2' }}>From 02:00 PM</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: '#7a8c9e', fontWeight: 600 }}>CHECK-OUT</div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#1a2b48' }}>
                {new Date(booking.checkOutDate).toLocaleDateString()}
              </div>
              <div style={{ fontSize: '11px', color: '#90a0b2' }}>Until 11:00 AM</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: '#7a8c9e', fontWeight: 600 }}>DURATION & GUESTS</div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#006ce4' }}>
                {booking.nights} Night{booking.nights > 1 ? 's' : ''} • {booking.guestsCount} Guest(s)
              </div>
            </div>
          </div>

          {/* Price Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: '#f0f5fc', color: '#1a2b48', textAlign: 'left' }}>
                <th style={{ padding: '10px 14px', borderBottom: '1px solid #dce6f2' }}>Description</th>
                <th style={{ padding: '10px 14px', borderBottom: '1px solid #dce6f2', textAlign: 'right' }}>Amount (INR)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '10px 14px', borderBottom: '1px solid #eee' }}>Room Tariff ({booking.nights} night{booking.nights > 1 ? 's' : ''})</td>
                <td style={{ padding: '10px 14px', borderBottom: '1px solid #eee', textAlign: 'right' }}>₹{booking.basePrice?.toLocaleString('en-IN')}</td>
              </tr>
              {booking.discountAmount > 0 && (
                <tr style={{ color: '#0a8528' }}>
                  <td style={{ padding: '10px 14px', borderBottom: '1px solid #eee' }}>Promotional Discount ({booking.promoCode || 'HOTELPRO20'})</td>
                  <td style={{ padding: '10px 14px', borderBottom: '1px solid #eee', textAlign: 'right' }}>- ₹{booking.discountAmount?.toLocaleString('en-IN')}</td>
                </tr>
              )}
              <tr>
                <td style={{ padding: '10px 14px', borderBottom: '1px solid #eee' }}>Hotel GST & Service Taxes (12%)</td>
                <td style={{ padding: '10px 14px', borderBottom: '1px solid #eee', textAlign: 'right' }}>₹{booking.taxesAndFees?.toLocaleString('en-IN')}</td>
              </tr>
              <tr style={{ fontWeight: 800, fontSize: '15px', color: '#051430', background: '#fafcff' }}>
                <td style={{ padding: '12px 14px' }}>Grand Total Paid</td>
                <td style={{ padding: '12px 14px', textAlign: 'right', color: '#006ce4' }}>₹{booking.totalAmount?.toLocaleString('en-IN')}</td>
              </tr>
            </tbody>
          </table>

          {/* Footer Voucher Stamp */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px dashed #ccc', paddingTop: '16px', fontSize: '11px', color: '#7a8c9e' }}>
            <div>
              <strong>Payment Status:</strong> PAID (Transaction: {payment.transactionId || 'TXN-SUCCESS'})<br />
              This is a computer-generated tax invoice and does not require a physical signature.
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <QrCode size={40} color="#006ce4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
