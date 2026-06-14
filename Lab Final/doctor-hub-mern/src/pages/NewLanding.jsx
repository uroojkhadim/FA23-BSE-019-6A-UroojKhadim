import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Calendar,
  Star,
  CheckCircle,
  ChevronRight,
  Menu,
  X,
  User,
  Users,
  Activity,
  ShieldCheck,
  Clock,
  MapPin,
  Heart,
  ArrowRight,
  MessageSquare,
  FileText,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Link } from 'react-router-dom';

const NewLanding = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const specializations = [
    { name: 'Cardiology', icon: '❤️', count: 45 },
    { name: 'Dermatology', icon: '🩺', count: 38 },
    { name: 'Neurology', icon: '🧠', count: 32 },
    { name: 'Pediatrics', icon: '👶', count: 41 },
    { name: 'Orthopedics', icon: '🦴', count: 35 },
    { name: 'Gynecology', icon: '👩', count: 30 }
  ];

  const doctors = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      specialization: 'Cardiologist',
      experience: 12,
      rating: 4.9,
      reviews: 342,
      clinic: 'City Heart Center',
      fee: 1500,
      available: true,
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop'
    },
    {
      id: 2,
      name: 'Dr. Michael Chen',
      specialization: 'Neurologist',
      experience: 15,
      rating: 4.8,
      reviews: 289,
      clinic: 'Brain & Spine Clinic',
      fee: 1800,
      available: true,
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop'
    },
    {
      id: 3,
      name: 'Dr. Emily Williams',
      specialization: 'Pediatrician',
      experience: 10,
      rating: 4.95,
      reviews: 421,
      clinic: 'Little Hearts Hospital',
      fee: 1200,
      available: false,
      image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop'
    }
  ];

  const testimonials = [
    {
      name: 'Priya Sharma',
      role: 'Patient',
      text: 'Doctor Hub made finding the right specialist so easy! The booking process was seamless and the doctor was amazing.',
      rating: 5
    },
    {
      name: 'Raj Patel',
      role: 'Patient',
      text: 'Excellent platform with top-notch doctors. The virtual consultation feature is a game-changer!',
      rating: 5
    },
    {
      name: 'Anita Desai',
      role: 'Patient',
      text: 'Finally, a healthcare platform that actually cares about user experience. Highly recommend!',
      rating: 5
    }
  ];

  const faqs = [
    {
      question: 'How do I book an appointment?',
      answer: 'Simply search for a doctor, select your preferred date and time, and complete the booking process with payment.'
    },
    {
      question: 'Is my data secure?',
      answer: 'Yes, we use industry-standard encryption and comply with all healthcare data protection regulations.'
    },
    {
      question: 'Can I cancel my appointment?',
      answer: 'Yes, you can cancel up to 24 hours before your appointment for a full refund.'
    },
    {
      question: 'Do you offer virtual consultations?',
      answer: 'Absolutely! Many of our doctors offer both in-person and virtual consultation options.'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-[#2563EB] to-[#0EA5E9] rounded-xl flex items-center justify-center">
                <Heart className="text-white" size={20} fill="currentColor" />
              </div>
              <span className="text-2xl font-bold text-[#1e293b]">Doctor Hub</span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-slate-600 hover:text-[#2563EB] font-medium transition-colors">Home</Link>
              <Link to="/search" className="text-slate-600 hover:text-[#2563EB] font-medium transition-colors">Find Doctors</Link>
              <Link to="/" className="text-slate-600 hover:text-[#2563EB] font-medium transition-colors">Specialties</Link>
              <Link to="/" className="text-slate-600 hover:text-[#2563EB] font-medium transition-colors">About</Link>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <Link to="/login" className="text-slate-600 hover:text-[#2563EB] font-medium transition-colors">Login</Link>
              <Link
                to="/register"
                className="bg-gradient-to-r from-[#2563EB] to-[#0EA5E9] text-white px-6 py-2.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all"
              >
                Get Started
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="md:hidden bg-white border-t border-gray-100"
          >
            <div className="px-6 py-4 space-y-4">
              <Link to="/" className="block text-slate-600 font-medium py-2">Home</Link>
              <Link to="/search" className="block text-slate-600 font-medium py-2">Find Doctors</Link>
              <Link to="/login" className="block text-slate-600 font-medium py-2">Login</Link>
              <Link
                to="/register"
                className="block bg-gradient-to-r from-[#2563EB] to-[#0EA5E9] text-white px-6 py-2.5 rounded-xl font-semibold text-center"
              >
                Get Started
              </Link>
            </div>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid lg:grid-cols-2 gap-16 items-center"
          >
            <motion.div variants={itemVariants} className="space-y-8">
              <div className="inline-flex items-center gap-2 bg-[#EEF6FF] px-4 py-2 rounded-full">
                <span className="w-2 h-2 bg-[#2563EB] rounded-full animate-pulse" />
                <span className="text-[#2563EB] font-medium text-sm">Trusted by 50,000+ patients</span>
              </div>

              <h1 className="text-5xl lg:text-6xl font-extrabold text-[#1e293b] leading-tight">
                Your Health, Our Priority
                <span className="block bg-gradient-to-r from-[#2563EB] to-[#0EA5E9] bg-clip-text text-transparent">
                  Book Doctors Instantly
                </span>
              </h1>

              <p className="text-xl text-slate-600 leading-relaxed max-w-lg">
                Find verified doctors, book appointments in minutes, and manage your health journey with ease.
              </p>

              {/* Search Bar */}
              <div className="bg-white p-4 rounded-2xl shadow-xl shadow-blue-900/5 border border-gray-100">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 px-4 py-3 bg-[#F8FAFC] rounded-xl border border-gray-200">
                      <Search className="text-slate-400" size={20} />
                      <input
                        type="text"
                        placeholder="Search doctors, specialties..."
                        className="w-full bg-transparent border-none outline-none text-slate-700"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex items-center gap-2 px-4 py-3 bg-[#F8FAFC] rounded-xl border border-gray-200">
                      <MapPin className="text-slate-400" size={20} />
                      <select className="bg-transparent border-none outline-none text-slate-700">
                        <option>City</option>
                        <option>Karachi</option>
                        <option>Lahore</option>
                        <option>Islamabad</option>
                      </select>
                    </div>
                    <Link
                      to="/search"
                      className="bg-gradient-to-r from-[#2563EB] to-[#0EA5E9] text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all flex items-center gap-2"
                    >
                      Search <ArrowRight size={18} />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <p className="text-3xl font-bold text-[#1e293b]">500+</p>
                  <p className="text-slate-500">Expert Doctors</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-[#1e293b]">24/7</p>
                  <p className="text-slate-500">Support</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-[#1e293b]">4.9</p>
                  <p className="text-slate-500">Rating</p>
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="relative">
              <div className="relative z-10">
                <img
                  src="https://images.unsplash.com/photo-1631217868264-e5baf7554b63?w=800&h=600&fit=crop"
                  alt="Doctor"
                  className="rounded-3xl shadow-2xl"
                />
              </div>
              <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-2xl shadow-xl border border-gray-100 z-20">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#EEF6FF] rounded-xl flex items-center justify-center">
                    <CheckCircle className="text-[#2563EB]" size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-[#1e293b]">10,000+</p>
                    <p className="text-sm text-slate-500">Happy Patients</p>
                  </div>
                </div>
              </div>
              <div className="absolute -top-6 -right-6 bg-white p-6 rounded-2xl shadow-xl border border-gray-100 z-20">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                    <Users className="text-[#10B981]" size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-[#1e293b]">200+</p>
                    <p className="text-sm text-slate-500">Appointments Today</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Specializations Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-[#1e293b] mb-4">Find by Specialization</h2>
            <p className="text-xl text-slate-600">Explore our wide range of medical specialties</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {specializations.map((spec, index) => (
              <motion.div
                key={spec.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="bg-[#F8FAFC] p-6 rounded-2xl border border-gray-100 hover:border-[#2563EB]/20 hover:shadow-lg hover:shadow-blue-500/10 transition-all cursor-pointer"
              >
                <div className="text-4xl mb-3">{spec.icon}</div>
                <h3 className="font-bold text-[#1e293b] mb-1">{spec.name}</h3>
                <p className="text-slate-500 text-sm">{spec.count} doctors</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Doctors Section */}
      <section className="py-20 px-6 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-between mb-16"
          >
            <div>
              <h2 className="text-4xl font-bold text-[#1e293b] mb-4">Top Rated Doctors</h2>
              <p className="text-xl text-slate-600">Meet our verified and experienced doctors</p>
            </div>
            <Link
              to="/search"
              className="hidden md:flex items-center gap-2 text-[#2563EB] font-semibold hover:gap-3 transition-all"
            >
              View All <ArrowRight size={18} />
            </Link>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {doctors.map((doctor, index) => (
              <motion.div
                key={doctor.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                whileHover={{ y: -8 }}
                className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-blue-900/5 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start gap-4 mb-6">
                    <img
                      src={doctor.image}
                      alt={doctor.name}
                      className="w-24 h-24 rounded-2xl object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-[#1e293b] mb-1">{doctor.name}</h3>
                      <p className="text-[#2563EB] font-medium mb-2">{doctor.specialization}</p>
                      <div className="flex items-center gap-1">
                        <Star className="text-yellow-400" size={16} fill="currentColor" />
                        <span className="font-semibold text-[#1e293b]">{doctor.rating}</span>
                        <span className="text-slate-400 text-sm">({doctor.reviews})</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Clock size={16} />
                      <span className="text-sm">{doctor.experience} years experience</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <MapPin size={16} />
                      <span className="text-sm">{doctor.clinic}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div>
                      <p className="text-2xl font-bold text-[#1e293b]">₹{doctor.fee}</p>
                      <p className="text-sm text-slate-500">Consultation</p>
                    </div>
                    <div className="flex items-center gap-3">
                      {doctor.available ? (
                        <span className="flex items-center gap-1 text-[#10B981] text-sm font-medium">
                          <span className="w-2 h-2 bg-[#10B981] rounded-full" />
                          Available
                        </span>
                      ) : (
                        <span className="text-slate-400 text-sm font-medium">Busy</span>
                      )}
                      <button className="bg-gradient-to-r from-[#2563EB] to-[#0EA5E9] text-white px-6 py-2.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all">
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-[#1e293b] mb-4">How It Works</h2>
            <p className="text-xl text-slate-600">Get started in 4 simple steps</p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: 1, title: 'Search Doctor', icon: Search, color: '#2563EB' },
              { step: 2, title: 'Book Slot', icon: Calendar, color: '#0EA5E9' },
              { step: 3, title: 'Make Payment', icon: FileText, color: '#10B981' },
              { step: 4, title: 'Get Consultation', icon: MessageSquare, color: '#8B5CF6' }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="text-center"
              >
                <div className="w-20 h-20 bg-[#EEF6FF] rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <item.icon size={36} style={{ color: item.color }} />
                </div>
                <p className="text-sm text-slate-400 font-semibold mb-2">Step {item.step}</p>
                <h3 className="text-xl font-bold text-[#1e293b]">{item.title}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 bg-gradient-to-br from-[#EEF6FF] to-[#F8FAFC]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-[#1e293b] mb-4">What Our Patients Say</h2>
            <p className="text-xl text-slate-600">Real experiences from real patients</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="text-yellow-400" size={20} fill="currentColor" />
                  ))}
                </div>
                <p className="text-slate-600 text-lg mb-6 leading-relaxed">
                  "{testimonial.text}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#2563EB] to-[#0EA5E9] rounded-full flex items-center justify-center">
                    <User className="text-white" size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-[#1e293b]">{testimonial.name}</p>
                    <p className="text-slate-500 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-[#1e293b] mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-slate-600">Find answers to common questions</p>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="border border-gray-100 rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 bg-white text-left"
                >
                  <span className="font-semibold text-[#1e293b] text-lg">{faq.question}</span>
                  {openFaq === index ? <ChevronUp size={24} className="text-[#2563EB]" /> : <ChevronDown size={24} className="text-slate-400" />}
                </button>
                {openFaq === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="px-6 pb-6 text-slate-600"
                  >
                    {faq.answer}
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-[#2563EB] to-[#0EA5E9] rounded-3xl p-12 text-center"
          >
            <h2 className="text-4xl font-bold text-white mb-6">Ready to Take Charge of Your Health?</h2>
            <p className="text-white/90 text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of patients who trust Doctor Hub for their healthcare needs.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 bg-white text-[#2563EB] px-8 py-4 rounded-2xl font-bold text-lg hover:shadow-xl transition-all"
            >
              Get Started Free <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1e293b] text-white py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-[#2563EB] to-[#0EA5E9] rounded-xl flex items-center justify-center">
                  <Heart className="text-white" size={20} fill="currentColor" />
                </div>
                <span className="text-2xl font-bold">Doctor Hub</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Your trusted partner in healthcare. Connect with the best doctors and manage your health journey.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6">Quick Links</h4>
              <ul className="space-y-3 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Home</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Find Doctors</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Specialties</a></li>
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6">Support</h4>
              <ul className="space-y-3 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6">Contact</h4>
              <ul className="space-y-3 text-slate-400">
                <li>contact@doctorhub.com</li>
                <li>+92 300 123 4567</li>
                <li>Karachi, Pakistan</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-700 pt-8 text-center text-slate-400">
            <p>© 2026 Doctor Hub. Designed by Urooj Khadim. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default NewLanding;
