import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import { Search, Package, CreditCard, Clock, Activity, UserCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface OrderData {
  order: {
    id: number;
    tracking_id: string;
    status: string;
    payment_status: string;
    service_name: string;
    amount: number;
    category_selection: string | null;
  };
  history: {
    status: string;
    created_at: string;
    note: string | null;
  }[];
}

interface PaymentData {
  id: number;
  amount: number;
  gateway_txn_id: string;
  method: string;
  status: string;
  created_at: string;
}

export default function DashboardPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTrackingId = searchParams.get('tracking') || '';
  const navigate = useNavigate();
  
  const [searchInput, setSearchInput] = useState(initialTrackingId);
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [payments, setPayments] = useState<PaymentData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialTrackingId) {
      fetchData(initialTrackingId);
    }
  }, [initialTrackingId]);

  const fetchData = async (id: string) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/orders/${id}`);
      if (!res.ok) throw new Error('Order not found. Please check your Tracking ID.');
      const data = await res.json();
      setOrderData(data);

      const payRes = await fetch(`/api/orders/${id}/payments`);
      if (payRes.ok) {
        const payData = await payRes.json();
        setPayments(payData.payments || []);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch order details');
      setOrderData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchParams({ tracking: searchInput.trim() });
    }
  };

  const STATUS_FLOW = ['Order Received', 'Document Review', 'In Progress', 'Awaiting Approval', 'Completed'];

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto min-h-[70vh]">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-primary mb-2">Customer Dashboard</h1>
        <p className="text-gray-600">Track your order status and view service updates.</p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8 max-w-2xl mx-auto">
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
              placeholder="Enter Tracking ID (e.g. YRAA-2026-XXXXX)"
              required
            />
          </div>
          <button type="submit" className="bg-primary hover:bg-blue-900 text-white px-8 py-3 rounded-xl font-bold text-sm tracking-wide transition shadow-md">
            Search
          </button>
        </form>
      </div>

      {loading && <div className="text-center py-12"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div></div>}
      {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center font-bold border border-red-100 max-w-2xl mx-auto">{error}</div>}

      {orderData && !loading && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          <div className="flex justify-end">
             <button onClick={() => navigate(`/profile?tracking=${orderData.order.tracking_id}`)} className="bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold px-4 py-2 rounded-lg transition border border-slate-200 flex items-center space-x-2">
               <UserCircle className="w-4 h-4" />
               <span>Manage Profile</span>
             </button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center space-x-4 hover:shadow-md transition">
              <div className="w-12 h-12 bg-blue-50 text-primary rounded-xl flex items-center justify-center border border-blue-100"><Package className="w-6 h-6"/></div>
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Service</p>
                <p className="font-bold text-gray-900 leading-tight">{orderData.order.service_name}</p>
                {orderData.order.category_selection && (
                  <p className="text-[10px] text-slate-500 mt-1">Cat: {orderData.order.category_selection}</p>
                )}
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center space-x-4 hover:shadow-md transition">
              <div className="w-12 h-12 bg-yellow-50 text-accent rounded-xl flex items-center justify-center border border-yellow-100"><Activity className="w-6 h-6"/></div>
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Current Status</p>
                <p className="font-bold text-gray-900">{orderData.order.status}</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center space-x-4 hover:shadow-md transition">
              <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center border border-green-100"><CreditCard className="w-6 h-6"/></div>
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Payment Status</p>
                <p className="font-bold text-gray-900 uppercase">
                  {orderData.order.payment_status}
                  {orderData.order.payment_status !== 'paid' && (
                    <a href={`/payment/${orderData.order.tracking_id}`} className="ml-2 text-xs text-primary underline lowercase">Pay Now</a>
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-8">
              {/* Dynamic Tracker */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full translate-x-16 -translate-y-16 opacity-50 pointer-events-none"></div>
                <h3 className="text-xl font-bold text-primary mb-8 flex items-center gap-2">
                  <span className="w-2 h-6 bg-accent rounded-full"></span>
                  Progress Tracker
                </h3>
                <div className="relative">
                  {/* Vertical Line for Mobile */}
                  <div className="md:hidden absolute left-[15px] top-4 bottom-4 w-0.5 bg-gray-200 z-0"></div>
                  
                  {/* Horizontal Line for Desktop */}
                  <div className="hidden md:block absolute top-[20px] left-8 right-8 h-1 bg-slate-200 z-0">
                    <div 
                      className="absolute left-0 top-0 h-full bg-primary transition-all duration-1000 ease-in-out" 
                      style={{ width: `${(STATUS_FLOW.indexOf(orderData.order.status) / (STATUS_FLOW.length - 1)) * 100}%` }}
                    ></div>
                  </div>

                  <div className="space-y-8 md:space-y-0 md:flex md:justify-between relative z-10">
                    {STATUS_FLOW.map((statusStep, index) => {
                      const currentIdx = STATUS_FLOW.indexOf(orderData.order.status);
                      const isCompleted = index <= currentIdx;
                      const isActive = index === currentIdx;
                      
                      const historyEntry = orderData.history.find(h => h.status === statusStep);
                      
                      return (
                        <div key={statusStep} className="relative flex items-start md:flex-col md:items-center gap-4 md:gap-3 group">
                          <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center shrink-0 border-4 font-bold text-sm transition-all duration-500 ease-in-out ${isActive ? 'bg-primary border-primary text-white shadow-lg shadow-primary/30 ring-4 ring-primary/20 scale-110' : isCompleted ? 'bg-accent border-accent text-white shadow-sm' : 'bg-white border-slate-200 text-slate-300'}`}>
                            {isCompleted && !isActive ? '✓' : index + 1}
                          </div>
                          <div className="pt-1 md:pt-0 md:text-center w-full md:w-28 md:-ml-4">
                             <p className={`font-bold transition-colors ${isActive ? 'text-primary' : isCompleted ? 'text-slate-800' : 'text-slate-400'}`}>{statusStep}</p>
                             {historyEntry && (
                               <div className="mt-1 md:absolute md:top-[120%] md:left-1/2 md:-translate-x-1/2 md:w-48 bg-white/90 md:p-3 md:shadow-md md:rounded-xl md:border md:border-slate-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity z-20 pointer-events-none md:pointer-events-auto">
                                 <p className="text-xs font-mono text-gray-500 mb-1">{new Date(historyEntry.created_at).toLocaleString()}</p>
                                 {historyEntry.note && <p className="text-sm text-gray-600 bg-slate-50 p-2 rounded-lg border border-slate-100">{historyEntry.note}</p>}
                               </div>
                             )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              {/* Payment History */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                <h3 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
                  <span className="w-2 h-6 bg-accent rounded-full"></span>
                  Payment History
                </h3>
                {payments.length === 0 ? (
                  <p className="text-gray-500 italic text-sm">No payments recorded yet.</p>
                ) : (
                  <div className="space-y-4">
                    {payments.map(payment => (
                      <div key={payment.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-slate-100 transition">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-bold text-gray-900">৳ {payment.amount.toLocaleString()}</span>
                          <span className={`text-xs px-2 py-1 rounded font-bold uppercase ${payment.status === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{payment.status}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-600 font-medium">Method: <span className="text-primary">{payment.method}</span></span>
                          <span className="font-mono text-xs text-gray-500">TXN: {payment.gateway_txn_id}</span>
                        </div>
                        <div className="mt-2 text-xs text-gray-400 text-right">
                          {new Date(payment.created_at).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
