import { Mail, Linkedin } from 'lucide-react';
import { motion } from 'motion/react';

export default function TeamPage() {
  const team = [
    { name: 'Rafiqul Islam', role: 'CEO & Principal Consultant', bio: 'Expert in corporate law and RJSC compliance with 15 years experience.', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop' },
    { name: 'Nusrat Jahan', role: 'Head of Taxation', bio: 'Former deputy commissioner of taxes, specializing in corporate VAT & Tax.', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop' },
    { name: 'Ahsan Habib', role: 'Licensing Specialist', bio: 'Navigates city corporation regulations effectively to secure trade licenses quickly.', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop' },
    { name: 'Farhana Akter', role: 'Client Relations Manager', bio: 'Ensures every client gets timely updates and seamless document processing.', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop' },
  ];

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-primary mb-4">Meet Our Team</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          The dedicated professionals behind YRAA Consulting BD.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {team.map((member, i) => (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            key={i} 
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group"
          >
            <div className="aspect-w-1 aspect-h-1 overflow-hidden">
              <img src={member.image} alt={member.name} className="w-full h-64 object-cover group-hover:scale-105 transition duration-500" />
            </div>
            <div className="p-6">
              <h3 className="font-bold text-xl text-primary">{member.name}</h3>
              <p className="text-accent font-medium text-sm mb-3">{member.role}</p>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">{member.bio}</p>
              <div className="flex space-x-3">
                <a href="#" className="p-2 bg-blue-50 text-primary rounded-full hover:bg-blue-100"><Linkedin className="w-4 h-4"/></a>
                <a href="#" className="p-2 bg-blue-50 text-primary rounded-full hover:bg-blue-100"><Mail className="w-4 h-4"/></a>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
