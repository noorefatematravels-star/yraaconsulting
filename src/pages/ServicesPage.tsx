import React, { useState, useEffect } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';

interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url?: string;
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  
  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/services')
      .then(res => res.json())
      .then(data => {
        setServices(data.services || []);
        setLoading(false);
      });
  }, []);

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService) return;
    setIsSubmitting(true);
    
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, serviceId: selectedService.id })
      });
      const data = await res.json();
      
      if (data.success) {
        // Proceed to payment page with new tracking ID
        navigate(`/payment/${data.trackingId}`);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to place order. Try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-primary mb-4">Our Services</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          From licensing to taxation, we have tailored solutions to make your business compliant and successful.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {services.map((service, idx) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              key={service.id} 
              className="bg-white border border-gray-200 rounded-xl hover:shadow-lg transition flex flex-col h-full overflow-hidden group"
            >
              <div className="h-48 overflow-hidden bg-slate-100 flex items-center justify-center shrink-0">
                {service.image_url ? (
                  <img src={service.image_url} alt={service.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out" referrerPolicy="no-referrer" />
                ) : (
                  <CheckCircle2 className="w-12 h-12 text-blue-200" />
                )}
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-lg font-bold text-primary mb-2 line-clamp-2">{service.name}</h3>
                <p className="text-sm text-gray-600 line-clamp-3 mb-4">{service.description}</p>
                <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-100">
                  <span className="font-bold text-gray-900 border border-slate-200 bg-slate-50 px-3 py-1 rounded-full text-sm">
                    ৳ {service.price.toLocaleString()}
                  </span>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => navigate(`/services/${service.id}`)}
                      className="text-gray-500 font-medium hover:text-primary text-sm tracking-tight"
                    >
                      Details
                    </button>
                    <button 
                      onClick={() => setSelectedService(service)}
                      className="text-primary font-bold hover:text-blue-700 flex items-center tracking-tight"
                    >
                      Order <ArrowRight className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Order Modal */}
      {selectedService && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl relative">
            <button 
              onClick={() => setSelectedService(null)} 
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold text-primary mb-2">Order Service</h2>
            <div className="mb-6 pb-4 border-b border-gray-200">
              <p className="font-medium text-gray-900">{selectedService.name}</p>
              <p className="text-xl font-bold text-accent mt-1">৳ {selectedService.price.toLocaleString()}</p>
            </div>
            
            <form onSubmit={handleOrderSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input type="text" required value={name} onChange={e=>setName(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-primary focus:border-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input type="email" required value={email} onChange={e=>setEmail(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-primary focus:border-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input type="tel" required value={phone} onChange={e=>setPhone(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-primary focus:border-primary" />
              </div>
              
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-primary text-white py-3 rounded font-medium hover:bg-blue-900 transition mt-4 disabled:opacity-50"
              >
                {isSubmitting ? 'Processing...' : 'Continue to Payment'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
