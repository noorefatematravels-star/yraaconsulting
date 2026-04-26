import { Link } from 'react-router';
import { Mail, Phone, MapPin, Building2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12 pb-12 border-b border-slate-800">
          <div className="flex gap-10">
            <div className="flex flex-col text-center md:text-left">
              <span className="text-3xl font-bold text-white">500+</span>
              <span className="text-sm text-slate-400">Successful Clients</span>
            </div>
            <div className="flex flex-col text-center md:text-left">
              <span className="text-3xl font-bold text-white">14+</span>
              <span className="text-sm text-slate-400">Special Services</span>
            </div>
            <div className="flex flex-col text-center md:text-left">
              <span className="text-3xl font-bold text-white">99%</span>
              <span className="text-sm text-slate-400">Satisfaction Rate</span>
            </div>
          </div>
          <div className="text-center md:text-right max-w-xs">
            <p className="text-slate-400 text-sm">Trusted by businesses across Bangladesh for our commitment to excellence.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-white">
              <Building2 className="w-6 h-6 text-accent" />
              <span className="text-xl font-bold">YRAA CONSULTING BD</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
              Empowering businesses with comprehensive consulting, registration, and advisory services in Bangladesh.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-white font-bold tracking-wider uppercase text-sm">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-accent transition-colors">Home</Link></li>
              <li><Link to="/services" className="hover:text-accent transition-colors">Our Services</Link></li>
              <li><Link to="/team" className="hover:text-accent transition-colors">Our Team</Link></li>
              <li><Link to="/contact" className="hover:text-accent transition-colors">Contact Us</Link></li>
              <li><Link to="/dashboard" className="hover:text-accent transition-colors">Track Order</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h3 className="text-white font-bold tracking-wider uppercase text-sm">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start">
                <MapPin className="w-5 h-5 text-accent mr-3 shrink-0" />
                <span>
                  162 SHAHID SYED NAZRUL ISLAM SARANI,<br />
                  SULEMAN PLAZA LIFT 8 ROOM 13,<br />
                  (3/3 OLD PURANAPALTAN) DHAKA
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 text-accent mr-3 shrink-0" />
                <span>01726816530</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 text-accent mr-3 shrink-0" />
                <a href="mailto:YRAACONSULTINGBD@GMAIL.COM" className="hover:text-white transition-colors">
                  YRAACONSULTINGBD@GMAIL.COM
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 text-sm text-center text-slate-500 flex flex-col md:flex-row items-center justify-between">
          <p>&copy; {new Date().getFullYear()} YRAA CONSULTING BD. All rights reserved.</p>
          <div className="mt-4 md:mt-0 space-x-4">
            <Link to="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="#" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
