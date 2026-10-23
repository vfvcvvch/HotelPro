import React, { useState } from 'react';
import { 
  X, 
  CreditCard, 
  QrCode, 
  Landmark, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  Loader2 
} from 'lucide-react';

export default function PaymentModal({ isOpen, onClose, bookingData, onPaymentSuccess }) {
  if (!isOpen || !bookingData) return null;

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardNumber, setCardNumber] = useState('4532 8920 1928 3491');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('883');
  const [upiId, setUpiId] = useState('traveler@okhdfcbank');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [processing, setProcessing] = useState(false);

  const handlePay = async (e) => {
    e.preventDefault();
    setProcessing(true);

    // Simulate payment gateway delay (1.5 seconds)
    setTimeout(async () => {
      setProcessing(false);
      onPaymentSuccess(paymentMethod);
    }, 1500);
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
      zIndex: 1100,
      padding: '20px'
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: '20px',
        width: '100%',
        maxWidth: '540px',
        boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
        overflow: 'hidden',
        animation: 'fadeIn 0.25s ease'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #051430 0%, #0c2d66 100%)',
          color: '#ffffff',
          padding: '20px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#ffcc66', fontWeight: 700, letterSpacing: '0.5px' }}>
              SECURE PAYMENT GATEWAY
            </div>
            <div style={{ fontSize: '18px', fontWeight: 800 }}>
              Amount: ₹{bookingData.totalAmount?.toLocaleString('en-IN')}
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={processing}
            style={{
              background: 'rgba(255,255,255,0.15)',
              color: '#fff',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Payment Methods Tabs */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          borderBottom: '1px solid #eef2f7',
          background: '#f8fafd'
        }}>
          {[
            { id: 'card', label: 'Card', icon: CreditCard },
            { id: 'upi', label: 'UPI / QR', icon: QrCode },
            { id: 'netbanking', label: 'NetBanking', icon: Landmark }
          ].map(tab => {
            const Icon = tab.icon;
            const active = paymentMethod === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setPaymentMethod(tab.id)}
                style={{
                  padding: '12px 10px',
                  background: active ? '#ffffff' : 'transparent',
                  color: active ? '#006ce4' : '#627488',
                  fontWeight: active ? 700 : 500,
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  borderBottom: active ? '2.5px solid #006ce4' : 'none'
                }}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Form Body */}
        <form onSubmit={handlePay} style={{ padding: '24px' }}>
          {paymentMethod === 'card' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#556677' }}>Card Number</label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="xxxx xxxx xxxx xxxx"
                  required
                  style={{ width: '100%', marginTop: '4px', letterSpacing: '1px', fontWeight: 600 }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#556677' }}>Valid Thru</label>
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    placeholder="MM/YY"
                    required
                    style={{ width: '100%', marginTop: '4px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#556677' }}>CVV</label>
                  <input
                    type="password"
                    maxLength="4"
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    placeholder="•••"
                    required
                    style={{ width: '100%', marginTop: '4px' }}
                  />
                </div>
              </div>
            </div>
          )}

          {paymentMethod === 'upi' && (
            <div style={{ textAlign: 'center', padding: '10px 0' }}>
              <div style={{
                width: '140px',
                height: '140px',
                margin: '0 auto 16px',
                border: '2px dashed #006ce4',
                borderRadius: '12px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#f0f7ff'
              }}>
                <QrCode size={70} color="#006ce4" />
                <span style={{ fontSize: '10px', color: '#006ce4', fontWeight: 700, marginTop: '4px' }}>Scan with Any UPI App</span>
              </div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#556677', textAlign: 'left', display: 'block' }}>Or Enter Virtual Payment Address (VPA)</label>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="username@bank"
                required
                style={{ width: '100%', marginTop: '4px' }}
              />
            </div>
          )}

          {paymentMethod === 'netbanking' && (
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#556677' }}>Select Banking Partner</label>
              <select
                value={selectedBank}
                onChange={(e) => setSelectedBank(e.target.value)}
                style={{ width: '100%', marginTop: '4px' }}
              >
                <option value="HDFC Bank">HDFC Bank</option>
                <option value="State Bank of India">State Bank of India (SBI)</option>
                <option value="ICICI Bank">ICICI Bank</option>
                <option value="Axis Bank">Axis Bank</option>
                <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
              </select>
              <div style={{ fontSize: '12px', color: '#7a8c9e', marginTop: '10px' }}>
                You will be redirected to your bank's secure authorization portal.
              </div>
            </div>
          )}

          {/* Pay Button */}
          <div style={{ marginTop: '24px' }}>
            <button
              type="submit"
              disabled={processing}
              className="btn-mmt-primary"
              style={{
                width: '100%',
                padding: '14px',
                fontSize: '16px',
                opacity: processing ? 0.75 : 1
              }}
            >
              {processing ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Processing Payment...</span>
                </>
              ) : (
                <>
                  <Lock size={16} />
                  <span>PAY ₹{bookingData.totalAmount?.toLocaleString('en-IN')} NOW</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
