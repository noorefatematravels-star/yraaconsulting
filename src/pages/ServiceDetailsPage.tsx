import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { ArrowLeft, CheckCircle2, ChevronRight, BookOpen, Clock, Tag } from 'lucide-react';
import { motion } from 'motion/react';

interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url?: string;
}

export default function ServiceDetailsPage() {
  const { id } = useParams();
  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Dynamic selection states
  const [selLevel1, setSelLevel1] = useState<string>(''); // Category (Service Name)
  const [selLevel2, setSelLevel2] = useState<string>(''); // Location / Sub-Category
  const [selLevel3, setSelLevel3] = useState<number | null>(null); // Index of Variation
  const [selLevel4, setSelLevel4] = useState<number | null>(null); // Index of Type (Add-on)

  useEffect(() => {
    fetch('/api/services')
      .then(res => res.json())
      .then(data => {
        const existing = data.services || [];
        const found = existing.find((s: any) => s.id.toString() === id);
        setService(found || null);
        
        if (found?.pricing_options?.map) {
          const map = found.pricing_options.map;
          const catKeys = Object.keys(map);
          if (catKeys.length > 0) {
            const firstCat = catKeys[0];
            setSelLevel1(firstCat);
            const locKeys = Object.keys(map[firstCat] || {});
            if (locKeys.length > 0) {
              const firstLoc = locKeys[0];
              setSelLevel2(firstLoc);
              const variations = map[firstCat][firstLoc];
              if (variations && variations.length > 0) {
                setSelLevel3(0);
                if (variations[0].types && variations[0].types.length > 0) {
                  setSelLevel4(0);
                }
              }
            }
          }
        }
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="py-20 text-center"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div></div>;

  if (!service) return <div className="py-20 text-center"><h1 className="text-2xl font-bold">Service Not Found</h1><Link to="/services" className="text-primary mt-4 inline-block underline">Go back to Services</Link></div>;

  const pricing = service.pricing_options;
  const labels = pricing?.labels || {
    label_category: 'Service Name',
    label_location: 'Location',
    label_variation: 'Timeline',
    label_types: 'Category'
  };

  // Helper to get nested data
  const getLevel2Options = () => selLevel1 && pricing?.map ? Object.keys(pricing.map[selLevel1] || {}) : [];
  const getLevel3Options = () => selLevel1 && selLevel2 && pricing?.map ? pricing.map[selLevel1][selLevel2] || [] : [];
  const getLevel4Options = () => {
    const vars = getLevel3Options();
    if (selLevel3 !== null && vars[selLevel3]) {
      return vars[selLevel3].types || [];
    }
    return [];
  };

  // Price Calculation
  const calculateTotal = () => {
    if (!pricing?.map) return service.price;
    const vars = getLevel3Options();
    const variation = selLevel3 !== null ? vars[selLevel3] : null;
    if (!variation) return service.price;

    let total = parseFloat(variation.base_price || '0') + parseFloat(variation.service_charge || '0');
    
    const types = variation.types || [];
    const type = selLevel4 !== null ? types[selLevel4] : null;
    if (type) {
      total += parseFloat(type.price || '0');
    }

    return total;
  };

  const currentPrice = calculateTotal();
  const currentTimeline = (getLevel3Options()[selLevel3 ?? -1] as any)?.variation || null;
  const selectionSummary = pricing?.map 
    ? `${selLevel1}${selLevel2 ? ' > ' + selLevel2 : ''}${selLevel3 !== null ? ' > ' + getLevel3Options()[selLevel3].variation : ''}${selLevel4 !== null ? ' > ' + getLevel4Options()[selLevel4].name : ''}`
    : null;

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/services" className="flex items-center text-slate-500 hover:text-primary mb-8 font-medium transition">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to All Services
        </Link>
        
        <div className="bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="bg-primary relative overflow-hidden flex flex-col md:flex-row">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent opacity-20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
            <div className="p-12 text-white flex-1 relative z-10 flex flex-col justify-center">
              <h1 className="text-4xl font-extrabold mb-4">{service.name}</h1>
              <p className="text-lg text-slate-200">{service.description}</p>
            </div>
            {service.image_url && (
              <div className="w-full md:w-1/3 shrink-0 relative z-10 hidden md:block">
                <img src={service.image_url} alt={service.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-transparent" />
              </div>
            )}
          </div>
          
          <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x border-b border-slate-100 divide-slate-100">
             <div className="p-8 flex flex-col items-center justify-center text-center">
               <Tag className="w-8 h-8 text-accent mb-3" />
               <span className="text-sm text-slate-500 font-bold uppercase tracking-wider mb-1">Pricing From</span>
               <span className="text-2xl font-bold text-primary">৳ {service.price.toLocaleString()}</span>
             </div>
             <div className="p-8 flex flex-col items-center justify-center text-center">
               <Clock className="w-8 h-8 text-accent mb-3" />
               <span className="text-sm text-slate-500 font-bold uppercase tracking-wider mb-1">Estimated Time</span>
               <span className="text-xl font-bold text-primary">5 - 10 Days</span>
             </div>
             <div className="p-8 flex flex-col items-center justify-center text-center">
               <BookOpen className="w-8 h-8 text-accent mb-3" />
               <span className="text-sm text-slate-500 font-bold uppercase tracking-wider mb-1">Complexity</span>
               <span className="text-xl font-bold text-primary">Standard</span>
             </div>
          </div>

          <div className="p-10 grid md:grid-cols-2 gap-12">
            <div className="space-y-10">
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
                  <span className="w-8 h-8 rounded bg-blue-50 text-primary flex items-center justify-center mr-3"><BookOpen className="w-5 h-5" /></span>
                  Service Breakdown
                </h2>
                <div className="text-slate-600 leading-relaxed space-y-4">
                  <p>Our <strong>{service.name}</strong> service is designed to eliminate bureaucratic delays and ensure full compliance. We handle the end-to-end process, from initial document preparation to final approval and handover.</p>
                  <p>Our expert agents will guide you through the complexities, liaise with government authorities, and keep you updated at every milestone.</p>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
                  <span className="w-8 h-8 rounded bg-blue-50 text-primary flex items-center justify-center mr-3"><CheckCircle2 className="w-5 h-5" /></span>
                  Specific Requirements
                </h2>
                <ul className="space-y-4">
                  {['Completed application form', 'Valid National ID card copies', 'Photographs of directors/owners', 'Registered office address proof', 'Bank solvency certificate (if applicable)'].map((req, i) => (
                    <li key={i} className="flex items-start">
                      <ChevronRight className="w-5 h-5 text-accent shrink-0 mr-2" />
                      <span className="text-slate-600">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
                  <span className="w-8 h-8 rounded bg-blue-50 text-primary flex items-center justify-center mr-3"><BookOpen className="w-5 h-5" /></span>
                  Case Study
                </h2>
                <div className="bg-white border border-slate-100 shadow-sm p-6 rounded-2xl relative">
                  <div className="absolute top-0 right-0 p-4 opacity-10"><BookOpen className="w-16 h-16" /></div>
                  <h3 className="font-bold text-slate-800 mb-2">Tech Startup Compliance</h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-4">
                    Recently, we helped a promising tech startup obtain their {service.name} within record time. They were struggling with complex paperwork and unclear guidelines from the authorities.
                  </p>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Our expert agents simplified the entire procedure, filed the correct categorization, and liaised directly with governmental bodies to ensure a 100% compliant and hassle-free issuance.
                  </p>
                </div>
              </div>
            </div>
            
              <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 h-fit sticky top-8">
              <h2 className="text-xl font-bold text-slate-800 mb-4">Start Your Order</h2>
              <p className="text-slate-600 mb-6 text-sm leading-relaxed">
                Provide your details below and our expert agents will contact you to proceed with your <strong>{service.name}</strong> application.
              </p>

              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                fetch('/api/orders', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    name: formData.get('name'),
                    email: formData.get('email'),
                    phone: formData.get('phone'),
                    serviceId: service.id,
                    amount: currentPrice,
                    categorySelection: selectionSummary
                  })
                })
                .then(res => res.json())
                .then(data => {
                  if (data.trackingId) {
                    window.location.href = `/payment/${data.trackingId}`;
                  } else {
                    alert('Error creating order');
                  }
                });
              }} className="space-y-4">
                {pricing?.map && (
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm mb-6 space-y-4">
                    <p className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-2">Configure Service</p>
                    
                    {/* Level 1: Category */}
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1 tracking-tight">{labels.label_category}</label>
                      <select 
                        value={selLevel1}
                        onChange={(e) => {
                          const val = e.target.value;
                          setSelLevel1(val);
                          const locs = Object.keys(pricing.map[val] || {});
                          if (locs.length > 0) {
                            setSelLevel2(locs[0]);
                            const vars = pricing.map[val][locs[0]];
                            if (vars.length > 0) {
                              setSelLevel3(0);
                              setSelLevel4(vars[0].types?.length > 0 ? 0 : null);
                            }
                          }
                        }}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary outline-none appearance-none bg-slate-50 text-sm font-medium"
                      >
                        {Object.keys(pricing.map).map(k => <option key={k} value={k}>{k}</option>)}
                      </select>
                    </div>

                    {/* Level 2: Location/Sub-category */}
                    {getLevel2Options().length > 0 && (
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1 tracking-tight">{labels.label_location}</label>
                        <select 
                          value={selLevel2}
                          onChange={(e) => {
                            const val = e.target.value;
                            setSelLevel2(val);
                            const vars = pricing.map[selLevel1][val];
                            if (vars.length > 0) {
                              setSelLevel3(0);
                              setSelLevel4(vars[0].types?.length > 0 ? 0 : null);
                            }
                          }}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary outline-none appearance-none bg-slate-50 text-sm font-medium"
                        >
                          {getLevel2Options().map(k => <option key={k} value={k}>{k}</option>)}
                        </select>
                      </div>
                    )}

                    {/* Level 3: Variation */}
                    {getLevel3Options().length > 0 && getLevel3Options()[0].variation && (
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1 tracking-tight">{labels.label_variation}</label>
                        <select 
                          value={selLevel3 ?? 0}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setSelLevel3(val);
                            const types = getLevel3Options()[val].types;
                            setSelLevel4(types?.length > 0 ? 0 : null);
                          }}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary outline-none appearance-none bg-slate-50 text-sm font-medium"
                        >
                          {getLevel3Options().map((v, i) => <option key={i} value={i}>{v.variation}</option>)}
                        </select>
                      </div>
                    )}

                    {/* Level 4: Types (Add-ons) */}
                    {getLevel4Options().length > 0 && (
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1 tracking-tight">{labels.label_types}</label>
                        <select 
                          value={selLevel4 ?? 0}
                          onChange={(e) => setSelLevel4(Number(e.target.value))}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary outline-none appearance-none bg-slate-50 text-sm font-medium"
                        >
                          {getLevel4Options().map((t, i) => <option key={i} value={i}>{t.name} {t.price !== "0" && `(+৳${parseFloat(t.price).toLocaleString()})`}</option>)}
                        </select>
                      </div>
                    )}

                    {currentTimeline && (
                      <div className="flex items-center text-xs text-primary font-bold bg-blue-50 p-3 rounded-xl border border-blue-100">
                        <Clock className="w-4 h-4 mr-2" />
                        Timeline: {currentTimeline}
                      </div>
                    )}
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                  <input name="name" required type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary outline-none" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                  <input name="email" required type="email" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary outline-none" placeholder="john@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                  <input name="phone" required type="tel" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary outline-none" placeholder="+880 1XXX XXXXXX" />
                </div>
                <div className="mt-6 pt-4 border-t border-slate-200">
                  <div className="flex justify-between mb-4 items-center">
                    <span className="font-medium text-slate-700">Total Price:</span>
                    <span className="font-bold text-primary text-2xl">৳ {currentPrice.toLocaleString()}</span>
                  </div>
                  <button type="submit" className="w-full block text-center bg-primary text-white font-bold py-4 rounded-xl hover:bg-blue-900 transition shadow-md">
                    Submit Order
                  </button>
                  <p className="text-xs text-center text-slate-500 mt-3">You will receive a tracking ID immediately after submission.</p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
