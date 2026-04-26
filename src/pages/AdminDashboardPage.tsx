import { useState, useEffect } from 'react';
import { Shield, Settings, Users, FileText, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const ordRes = await fetch('/api/admin/orders');
      const usrRes = await fetch('/api/admin/users');
      
      if (ordRes.ok) {
        const ordData = await ordRes.json();
        setOrders(ordData.orders || []);
      }
      if (usrRes.ok) {
        const usrData = await usrRes.json();
        setUsers(usrData.users || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOrderStatus = async (id: number, status: string) => {
    try {
      await fetch(`/api/admin/orders/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateUserAccess = async (id: number, role: string, permissions: string[]) => {
    try {
      await fetch(`/api/admin/users/${id}/access`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, permissions })
      });
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return <div className="py-20 text-center"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div></div>;
  }

  const STATUS_FLOW = ['Order Received', 'Document Review', 'In Progress', 'Awaiting Approval', 'Completed'];

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-[70vh]">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white"><Shield className="w-6 h-6"/></div>
        <div>
           <h1 className="text-3xl font-bold text-primary">Admin Portal</h1>
           <p className="text-gray-500 font-medium">Manage orders, users, and platform settings.</p>
        </div>
      </div>

      <div className="flex gap-4 mb-8 border-b border-gray-200">
        <button 
          onClick={() => setActiveTab('orders')} 
          className={`pb-4 px-4 font-bold flex items-center gap-2 transition-colors ${activeTab === 'orders' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <FileText className="w-4 h-4"/> Orders
        </button>
        <button 
          onClick={() => setActiveTab('users')} 
          className={`pb-4 px-4 font-bold flex items-center gap-2 transition-colors ${activeTab === 'users' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <Users className="w-4 h-4"/> Users
        </button>
      </div>

      {activeTab === 'orders' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase text-xs tracking-wider">
                  <th className="p-4 font-bold">Tracking ID</th>
                  <th className="p-4 font-bold">Customer</th>
                  <th className="p-4 font-bold">Service Info</th>
                  <th className="p-4 font-bold">Payment</th>
                  <th className="p-4 font-bold">Status</th>
                  <th className="p-4 font-bold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map(order => (
                  <tr key={order.id} className="hover:bg-slate-50 transition">
                    <td className="p-4 font-mono text-sm text-primary font-bold">{order.tracking_id}</td>
                    <td className="p-4">
                      <div className="font-bold text-gray-900">{order.user_name}</div>
                      <div className="text-xs text-gray-500">{order.user_email}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm font-bold text-slate-800">{order.service_name}</div>
                      {order.category_selection && <div className="text-xs text-slate-500">Cat: {order.category_selection}</div>}
                      {order.amount && <div className="text-xs font-bold text-accent mt-1">৳ {order.amount.toLocaleString()}</div>}
                    </td>
                    <td className="p-4">
                      <span className={`text-xs px-2 py-1 rounded font-bold uppercase ${order.payment_status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {order.payment_status}
                      </span>
                    </td>
                    <td className="p-4">
                      <select 
                        value={order.status}
                        onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                        className="text-sm border border-slate-300 rounded-lg p-2 focus:ring-primary focus:border-primary w-full max-w-[200px]"
                      >
                        {STATUS_FLOW.map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                    <td className="p-4 text-xs text-gray-400">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {activeTab === 'users' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase text-xs tracking-wider">
                  <th className="p-4 font-bold">User</th>
                  <th className="p-4 font-bold">Email</th>
                  <th className="p-4 font-bold">Phone</th>
                  <th className="p-4 font-bold">Role & Permissions</th>
                  <th className="p-4 font-bold">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map(user => {
                  let perms = [];
                  try { perms = JSON.parse(user.permissions || '[]'); } catch(e){}
                  const handlePermissionChange = (perm: string, checked: boolean) => {
                     const newPerms = checked ? [...perms, perm] : perms.filter((p: string) => p !== perm);
                     handleUpdateUserAccess(user.id, user.role, newPerms);
                  };

                  return (
                    <tr key={user.id} className="hover:bg-slate-50 transition">
                      <td className="p-4 font-bold text-gray-900">{user.name}</td>
                      <td className="p-4 text-sm text-gray-600">{user.email}</td>
                      <td className="p-4 text-sm text-gray-600">{user.phone || '-'}</td>
                      <td className="p-4">
                        <select 
                          value={user.role}
                          onChange={(e) => handleUpdateUserAccess(user.id, e.target.value, perms)}
                          className="text-sm border border-slate-300 rounded-lg p-2 focus:ring-primary focus:border-primary mb-2 w-full max-w-[200px] block"
                        >
                          <option value="customer">Customer</option>
                          <option value="admin">Admin</option>
                          <option value="agent">Agent</option>
                        </select>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {['manage_orders', 'manage_services', 'view_reports', 'manage_users', 'edit_services', 'access_reports'].map(p => (
                            <label key={p} className="flex items-center space-x-1 text-xs text-gray-600 cursor-pointer">
                              <input 
                                type="checkbox" 
                                checked={perms.includes(p)} 
                                onChange={(e) => handlePermissionChange(p, e.target.checked)}
                                className="rounded text-primary focus:ring-primary"
                              />
                              <span>{p.replace('_', ' ')}</span>
                            </label>
                          ))}
                        </div>
                      </td>
                      <td className="p-4 text-xs text-gray-400">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
}
