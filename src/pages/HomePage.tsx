import React, { useState, useEffect } from 'react';
import { ArrowRight, Search, FileText, CheckCircle, Clock, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Tag } from 'lucide-react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';

const FAQS = [
  {
    question: "How long does it take to get a new Trade License?",
    answer: "Typically, a new Trade License is issued within 3-5 working days after submitting all required documents to the respective city corporation or municipality."
  },
  {
    question: "What documents are required for RJSC Registration?",
    answer: "You will need NID copies of all directors, passport-sized photographs, a registered office address, and the proposed company name. For foreign nationals, passport copies are required."
  },
  {
    question: "How does the payment and tracking process work?",
    answer: "Once you place an order, you will receive a unique 13-character tracking ID (e.g., YRAA-2026-XXXXX). You can use this ID on our Dashboard to track progress and make payments securely."
  },
  {
    question: "Can I update my order details after placing it?",
    answer: "Yes, you can access your User Profile through your Dashboard using your tracking ID to update your contact information such as name, email, and phone number."
  }
];

interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url?: string;
}

export default function HomePage() {
  const [trackingId, setTrackingId] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/services')
      .then(res => res.json())
      .then(data => setServices(data.services || []))
      .catch(err => console.error(err));
  }, []);

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingId.trim()) {
      navigate(`/dashboard?tracking=${encodeURIComponent(trackingId.trim())}`);
    }
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid md:grid-cols-[3fr_2fr] gap-12 items-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-md text-sm font-bold mb-4 border-l-4 border-accent">
              Professional Business Consultancy
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold leading-[1.2] text-primary mb-6">
              Your Business <span className="text-accent">Legal</span> & <span className="text-accent">Tax</span> Solutions in One Place.
            </h1>
            <p className="text-slate-600 text-lg mb-6 max-w-lg">
              YRAA Consulting BD is the trusted name for Trade License, RJSC Registration, VAT, and Income Tax services in Bangladesh.
            </p>
            <div className="flex mb-8">
              <button onClick={() => navigate('/services')} className="bg-primary hover:bg-blue-900 text-white px-6 py-3 rounded-xl font-bold transition flex items-center space-x-2">
                <span>View Our Services</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            {/* Tracking Box Section */}
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full translate-x-16 -translate-y-16 -z-0 opacity-50"></div>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="w-2 h-6 bg-accent rounded-full"></span>
                Track Your Order
              </h3>
              <form onSubmit={handleTrackSubmit} className="flex gap-3 relative z-10 flex-col sm:flex-row">
                <input
                  type="text"
                  placeholder="YRAA-2026-XXXXX"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  className="flex-1 px-5 py-4 rounded-xl border-2 border-slate-100 bg-slate-50 focus:border-primary outline-none text-lg font-mono w-full"
                  required
                />
                <button type="submit" className="bg-accent hover:bg-[#d18e1a] text-primary font-bold px-8 py-4 rounded-xl shadow-md transition-all whitespace-nowrap">
                  Search
                </button>
              </form>
              <p className="mt-3 text-sm text-slate-400">Please use your 13-character tracking ID.</p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.2 }} className="flex flex-col gap-6">
            <div className="bg-primary rounded-3xl p-6 text-white shadow-2xl flex-1">
              <h4 className="text-accent font-bold mb-4 uppercase tracking-widest text-xs">Main Services</h4>
              <div className="grid grid-cols-2 gap-4">
                <div onClick={() => navigate('/services')} className="bg-white/10 p-4 rounded-xl border border-white/10 cursor-pointer hover:bg-white/20 transition">
                  <div className="w-8 h-8 bg-accent rounded mb-3 flex items-center justify-center"><FileText className="w-4 h-4 text-primary" /></div>
                  <div className="font-bold text-sm">Trade License</div>
                  <div className="text-[10px] text-white/60 mt-1">New & Renew</div>
                </div>
                <div onClick={() => navigate('/services')} className="bg-white/10 p-4 rounded-xl border border-white/10 cursor-pointer hover:bg-white/20 transition">
                  <div className="w-8 h-8 bg-white/20 rounded mb-3 flex items-center justify-center"><CheckCircle className="w-4 h-4 text-white" /></div>
                  <div className="font-bold text-sm">RJSC Registration</div>
                  <div className="text-[10px] text-white/60 mt-1">Limited Company</div>
                </div>
                <div onClick={() => navigate('/services')} className="bg-white/10 p-4 rounded-xl border border-white/10 cursor-pointer hover:bg-white/20 transition">
                  <div className="w-8 h-8 bg-white/20 rounded mb-3 flex items-center justify-center"><Clock className="w-4 h-4 text-white" /></div>
                  <div className="font-bold text-sm">VAT & Tax</div>
                  <div className="text-[10px] text-white/60 mt-1">Return Submission</div>
                </div>
                <div onClick={() => navigate('/services')} className="bg-white/10 p-4 rounded-xl border border-white/10 cursor-pointer hover:bg-white/20 transition">
                  <div className="w-8 h-8 bg-white/20 rounded mb-3 flex items-center justify-center"><Search className="w-4 h-4 text-white" /></div>
                  <div className="font-bold text-sm">Trademark</div>
                  <div className="text-[10px] text-white/60 mt-1">Brand Protection</div>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Order Status (Sample)</span>
                  <span className="text-accent text-xs font-bold">In Progress</span>
                </div>
                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                  <div className="bg-accent w-3/5 h-full"></div>
                </div>
              </div>
            </div>
            
            {/* Payment Partner Bar */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase block mb-3">Payment Partners</span>
              <div className="flex justify-between items-center px-2 opacity-70 grayscale contrast-125">
                 <div className="font-bold text-pink-600">bKash</div>
                 <div className="font-bold text-orange-600">Nagad</div>
                 <div className="font-bold text-purple-700">Rocket</div>
                 <div className="font-bold text-blue-600">VISA</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Our All Services Slider */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white border-t border-slate-100 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-extrabold text-primary mb-4">Our All Services</h2>
              <p className="text-gray-600 max-w-2xl">Scroll to explore our comprehensive solutions for entrepreneurs and businesses in Bangladesh.</p>
            </div>
            <div className="hidden md:flex gap-3">
              <button 
                onClick={() => { const el = document.getElementById('services-slider'); if(el) el.scrollBy({ left: -350, behavior: 'smooth' }); }}
                className="w-12 h-12 rounded-full border-2 border-slate-200 flex items-center justify-center text-primary hover:bg-primary hover:text-white hover:border-primary transition"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button 
                onClick={() => { const el = document.getElementById('services-slider'); if(el) el.scrollBy({ left: 350, behavior: 'smooth' }); }}
                className="w-12 h-12 rounded-full border-2 border-slate-200 flex items-center justify-center text-primary hover:bg-primary hover:text-white hover:border-primary transition"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
          
          {/* Snap Container Slider */}
          <div 
            id="services-slider" 
            className="flex overflow-x-auto gap-6 snap-x snap-mandatory pb-8 pt-4 -mx-4 px-4 sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden flex-nowrap"
            style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
          >
            {services.filter(s => s.image_url).map((service, i) => (
              <a 
                href={`/services/${service.id}`} 
                key={i} 
                className="group min-w-[300px] w-[300px] sm:min-w-[320px] sm:w-[320px] bg-slate-50 rounded-3xl shrink-0 snap-start shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col overflow-hidden relative"
              >
                <div className="h-48 w-full overflow-hidden relative bg-white">
                  <img 
                    src={service.image_url} 
                    alt={service.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-in-out" 
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-xl font-bold text-primary mb-3 leading-tight group-hover:text-accent transition-colors">{service.name}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-4 flex-1 line-clamp-3">{service.description}</p>
                  <div className="flex items-center text-primary font-bold text-sm mt-auto justify-between w-full">
                    <span className="flex items-center">
                      <Tag className="w-4 h-4 mr-1 text-accent" />
                      ৳ {service.price.toLocaleString()}
                    </span>
                    <span className="flex items-center">
                      Learn More <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 border-t border-slate-200">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-600">Everything you need to know about our services and process.</p>
          </div>
          <div className="space-y-4">
            {FAQS.map((faq, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-6 py-4 flex items-center justify-between font-bold text-left text-gray-900 hover:bg-slate-50 transition-colors"
                >
                  <span>{faq.question}</span>
                  {openFaq === i ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-5 text-gray-600">
                        <p>{faq.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
