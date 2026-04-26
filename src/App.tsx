import { BrowserRouter, Routes, Route, Link } from "react-router";
import { Home, Compass, Users, Phone, LayoutDashboard } from "lucide-react";
import HomePage from "./pages/HomePage";
import ServicesPage from "./pages/ServicesPage";
import TeamPage from "./pages/TeamPage";
import ContactPage from "./pages/ContactPage";
import DashboardPage from "./pages/DashboardPage";
import PaymentPage from "./pages/PaymentPage";
import UserProfilePage from "./pages/UserProfilePage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import ServiceDetailsPage from "./pages/ServiceDetailsPage";
import Footer from "./components/Footer";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
        <header className="bg-primary shadow-lg sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              <div className="flex items-center">
                <Link to="/" className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center font-bold text-primary text-xl">Y</div>
                  <span className="font-bold text-2xl tracking-tight text-white">YRAA <span className="text-accent">Consulting BD</span></span>
                </Link>
              </div>
              <nav className="hidden md:flex space-x-8 items-center font-medium text-white/90">
                <Link to="/" className="hover:text-accent transition-colors flex items-center space-x-1"><Home className="w-4 h-4"/><span>Home</span></Link>
                <Link to="/services" className="hover:text-accent transition-colors flex items-center space-x-1"><Compass className="w-4 h-4"/><span>Services</span></Link>
                <Link to="/team" className="hover:text-accent transition-colors flex items-center space-x-1"><Users className="w-4 h-4"/><span>Our Team</span></Link>
                <Link to="/contact" className="hover:text-accent transition-colors flex items-center space-x-1"><Phone className="w-4 h-4"/><span>Contact</span></Link>
                <Link to="/dashboard" className="bg-accent text-primary px-4 py-1.5 rounded-full text-sm font-bold hover:bg-yellow-400 transition-colors flex items-center space-x-1"><LayoutDashboard className="w-4 h-4"/><span>Dashboard</span></Link>
                <Link to="/admin" className="text-white hover:text-accent border border-white/20 px-3 py-1 rounded-full text-xs transition-colors flex items-center space-x-1"><span>Admin</span></Link>
              </nav>
              <div className="md:hidden flex items-center">
                <Link to="/dashboard" className="bg-accent text-primary p-2 rounded-full">
                  <LayoutDashboard className="w-5 h-5"/>
                </Link>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/team" element={<TeamPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/payment/:trackingId" element={<PaymentPage />} />
            <Route path="/profile" element={<UserProfilePage />} />
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/services/:id" element={<ServiceDetailsPage />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
