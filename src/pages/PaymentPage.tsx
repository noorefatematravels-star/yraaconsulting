import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { CreditCard, ShieldCheck, ChevronRight } from 'lucide-react';

export default function PaymentPage() {
  const { trackingId } = useParams();
  const navigate = useNavigate();
  const [method, setMethod] = useState('bKash');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderDetails, setOrderDetails] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/orders/${trackingId}`)
      .then(res => res.json())
      .then(data => {
        if (data.order) {
          setOrderDetails(data.order);
        }
      });
  }, [trackingId]);

  const handlePayment = async () => {
    setIsProcessing(true);
    
    try {
      // Fake delay to simulate payment gateway process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const res = await fetch('/api/payments/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trackingId,
          gatewayTxnId: `TXN-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
          method: method,
          status: 'success'
        })
      });
      const data = await res.json();
      
      if (data.success) {
        navigate(`/dashboard?tracking=${trackingId}`);
      } else {
        alert(data.error || 'Payment failed');
      }
    } catch (err) {
      alert('Error connecting to payment gateway.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto min-h-[70vh] flex flex-col justify-center">
      <div className="bg-white p-8 rounded-3xl shadow-2xl border border-slate-100 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        
        <div className="flex flex-col items-center mb-8 relative z-10">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
            <CreditCard className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Secure Checkout</h1>
          <p className="text-slate-500 mt-2 flex items-center">
            <ShieldCheck className="w-4 h-4 mr-1 text-green-600" />
            256-bit SSL Encrypted Payment
          </p>
        </div>
        
        {orderDetails && (
          <div className="mb-8 p-6 bg-slate-50 rounded-2xl border border-slate-100 relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm text-slate-500 font-medium">Order Subtotal</p>
                <h3 className="font-bold text-slate-800 text-lg">{orderDetails.service_name}</h3>
                {orderDetails.category_selection && (
                  <p className="text-sm text-slate-500 mt-1">Category: {orderDetails.category_selection}</p>
                )}
                <p className="text-xs text-slate-400 mt-2">Tracking ID: {trackingId}</p>
              </div>
              <div className="text-right">
                <span className="text-3xl font-bold text-primary">৳ {orderDetails.amount?.toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}

        <div className="mb-8 relative z-10">
          <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">Select Payment Method</label>
          <div className="grid grid-cols-3 gap-4">
            {['bKash', 'Nagad', 'Rocket'].map(gw => (
              <label 
                key={gw} 
                className={`border-2 rounded-xl p-4 cursor-pointer flex flex-col items-center justify-center transition-all ${method === gw ? 'border-primary bg-blue-50 ring-4 ring-primary/10' : 'border-slate-200 hover:border-blue-200 bg-white shadow-sm hover:shadow'}`}
              >
                <input 
                  type="radio" 
                  name="paymentMethod" 
                  value={gw}
                  checked={method === gw}
                  onChange={() => setMethod(gw)}
                  className="hidden"
                />
                <span className={`font-bold ${method === gw ? 'text-primary' : 'text-slate-600'}`}>{gw}</span>
              </label>
            ))}
          </div>
        </div>

        <button 
          onClick={handlePayment} 
          disabled={isProcessing}
          className="w-full bg-primary hover:bg-blue-900 text-white font-bold py-4 rounded-xl transition shadow-lg relative z-10 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center group"
        >
          {isProcessing ? 'Processing Transaction...' : 'Confirm Payment'}
          {!isProcessing && <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />}
        </button>
      </div>
    </div>
  );
}
