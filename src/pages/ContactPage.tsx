import React, { useState } from 'react';
import { MapPin, Phone, Mail, CheckCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate sending message
    setIsSubmitted(true);
  };

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <AnimatePresence>
        {isSubmitted && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl relative"
            >
              <button 
                onClick={() => setIsSubmitted(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">Message Sent Successfully!</h3>
                <p className="text-slate-500 mb-8 leading-relaxed">Thank you for reaching out. Our team will get back to you shortly.</p>
                <button 
                  onClick={() => setIsSubmitted(false)}
                  className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:bg-blue-900 transition shadow-md"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-primary mb-4">Contact Us</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          We're here to help with your business compliance needs. Reach out today.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-16">
        <div>
          <h2 className="text-2xl font-bold text-primary mb-6">Get in Touch</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input required type="text" className="w-full border-gray-300 border rounded-xl shadow-sm py-3 px-4 focus:ring-primary focus:border-primary outline-none transition" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input required type="text" className="w-full border-gray-300 border rounded-xl shadow-sm py-3 px-4 focus:ring-primary focus:border-primary outline-none transition" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input required type="email" className="w-full border-gray-300 border rounded-xl shadow-sm py-3 px-4 focus:ring-primary focus:border-primary outline-none transition" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea required rows={4} className="w-full border-gray-300 border rounded-xl shadow-sm py-3 px-4 focus:ring-primary focus:border-primary outline-none transition"></textarea>
            </div>
            <button type="submit" className="bg-primary text-white font-bold px-8 py-3 rounded-xl hover:bg-blue-900 transition shadow-md w-full">
              Send Message
            </button>
          </form>
        </div>

        <div className="bg-gray-50 p-8 rounded-xl border border-gray-100">
          <h2 className="text-2xl font-bold text-primary mb-8">Office Information</h2>
          
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="p-3 bg-white rounded-lg shadow-sm mr-4 text-accent">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Head Office</h4>
                <p className="text-gray-600">YRAA CONSULTING BD<br/>162 SHAHID SYED NAZRUL ISLAM SARANI,<br/>SULEMAN PLAZA LIFT 8 ROOM 13,<br/>(3/3 OLD PURANAPALTAN) DHAKA</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="p-3 bg-white rounded-lg shadow-sm mr-4 text-accent">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Phone</h4>
                <p className="text-gray-600">01726816530</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="p-3 bg-white rounded-lg shadow-sm mr-4 text-accent">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Email</h4>
                <p className="text-gray-600">YRAACONSULTINGBD@GMAIL.COM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
