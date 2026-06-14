import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  MapPin,
  Star,
  Filter,
  Clock,
  Calendar,
  CheckCircle,
  ChevronRight,
  Map,
  Activity,
  Zap,
  SlidersHorizontal
} from 'lucide-react';
import { Link } from 'react-router-dom';

const DoctorSearch = () => {
  const [selectedFilters, setSelectedFilters] = useState({
    specialization: '',
    city: '',
    feeRange: [500, 3000],
    gender: '',
    availability: false
  });

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
      gender: 'Female',
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop',
      nextAvailable: 'Today, 4:00 PM'
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
      gender: 'Male',
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop',
      nextAvailable: 'Tomorrow, 10:00 AM'
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
      gender: 'Female',
      image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop',
      nextAvailable: 'Monday, 11:00 AM'
    },
    {
      id: 4,
      name: 'Dr. James Wilson',
      specialization: 'Orthopedic',
      experience: 18,
      rating: 4.7,
      reviews: 198,
      clinic: 'Bone & Joint Care',
      fee: 2000,
      available: true,
      gender: 'Male',
      image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop',
      nextAvailable: 'Today, 2:30 PM'
    },
    {
      id: 5,
      name: 'Dr. Ayesha Khan',
      specialization: 'Gynecologist',
      experience: 14,
      rating: 4.9,
      reviews: 267,
      clinic: 'Women\'s Health Center',
      fee: 1600,
      available: true,
      gender: 'Female',
      image: 'https://images.unsplash.com/photo-1651008376891-9518348753825?w=400&h=400&fit=crop',
      nextAvailable: 'Tomorrow, 3:00 PM'
    },
    {
      id: 6,
      name: 'Dr. Rajesh Kumar',
      specialization: 'Dermatologist',
      experience: 11,
      rating: 4.6,
      reviews: 156,
      clinic: 'Skin Care Clinic',
      fee: 1300,
      available: false,
      gender: 'Male',
      image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&h=400&fit=crop',
      nextAvailable: 'Tuesday, 9:00 AM'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Search Header */}
      <div className="bg-gradient-to-r from-[#2563EB] to-[#0EA5E9] pt-24 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">Find Your Doctor</h1>
            <p className="text-xl text-white/90">Search and book appointments with verified doctors</p>
          </div>

          {/* Search Bar */}
          <div className="bg-white p-2 rounded-2xl shadow-2xl">
            <div className="flex flex-col lg:flex-row gap-2">
              <div className="flex-1 flex items-center gap-3 px-6 py-4 bg-[#F8FAFC] rounded-xl lg:rounded-r-none">
                <Search className="text-slate-400" size={24} />
                <input
                  type="text"
                  placeholder="Search by doctor name, specialty, or condition..."
                  className="flex-1 bg-transparent border-none outline-none text-slate-700 text-lg"
                />
              </div>
              <div className="flex items-center gap-3 px-6 py-4 bg-[#F8FAFC] rounded-xl lg:rounded-l-none lg:rounded-r-none">
                <MapPin className="text-slate-400" size={24} />
                <select className="bg-transparent border-none outline-none text-slate-700 text-lg">
                  <option>Select City</option>
                  <option>Karachi</option>
                  <option>Lahore</option>
                  <option>Islamabad</option>
                </select>
              </div>
              <button className="bg-gradient-to-r from-[#2563EB] to-[#0EA5E9] text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-blue-500/25 transition-all flex items-center gap-2">
                Search <Search size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Filters Sidebar */}
          <aside className="lg:w-80 flex-shrink-0">
            <div className="bg-white rounded-2xl p-6 sticky top-24 border border-gray-100 shadow-lg">
              <div className="flex items-center gap-2 mb-6">
                <SlidersHorizontal className="text-[#2563EB]" size={24} />
                <h3 className="text-xl font-bold text-[#1e293b]">Filters</h3>
              </div>

              {/* Specialization */}
              <div className="mb-8">
                <h4 className="font-semibold text-[#1e293b] mb-4">Specialization</h4>
                <div className="space-y-3">
                  {['All', 'Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics', 'Dermatology', 'Gynecology'].map((spec, i) => (
                    <label key={i} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="specialization"
                        value={spec}
                        className="w-5 h-5 text-[#2563EB]"
                      />
                      <span className="text-slate-600">{spec}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Gender */}
              <div className="mb-8">
                <h4 className="font-semibold text-[#1e293b] mb-4">Gender</h4>
                <div className="space-y-3">
                  {['Any', 'Male', 'Female'].map((gender, i) => (
                    <label key={i} className="flex items-center gap-3 cursor-pointer">
                      <input type="radio" name="gender" value={gender} className="w-5 h-5 text-[#2563EB]" />
                      <span className="text-slate-600">{gender}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Availability */}
              <div className="mb-8">
                <h4 className="font-semibold text-[#1e293b] mb-4">Availability</h4>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="w-5 h-5 text-[#2563EB]" />
                  <span className="text-slate-600">Available Today</span>
                </label>
              </div>

              {/* Fee Range */}
              <div className="mb-8">
                <h4 className="font-semibold text-[#1e293b] mb-4">Consultation Fee</h4>
                <div className="space-y-3">
                  {['Any', 'Under ₹1000', '₹1000-₹2000', 'Over ₹2000'].map((range, i) => (
                    <label key={i} className="flex items-center gap-3 cursor-pointer">
                      <input type="radio" name="fee" value={range} className="w-5 h-5 text-[#2563EB]" />
                      <span className="text-slate-600">{range}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button className="w-full bg-[#EEF6FF] text-[#2563EB] py-3 rounded-xl font-semibold hover:bg-[#dbeafe] transition-all">
                Apply Filters
              </button>
            </div>
          </aside>

          {/* Results */}
          <main className="flex-1">
            <div className="flex items-center justify-between mb-8">
              <p className="text-slate-600"><span className="font-bold text-[#1e293b]">{doctors.length}</span> doctors found</p>
              <div className="flex items-center gap-3">
                <span className="text-slate-600">Sort by:</span>
                <select className="border border-gray-200 rounded-xl px-4 py-2 bg-white text-slate-700">
                  <option>Recommended</option>
                  <option>Rating: High to Low</option>
                  <option>Experience: High to Low</option>
                  <option>Fee: Low to High</option>
                </select>
              </div>
            </div>

            {/* Doctor Cards */}
            <div className="space-y-6">
              {doctors.map((doctor, index) => (
                <motion.div
                key={doctor.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-3xl border border-gray-100 p-6 hover:shadow-xl hover:shadow-blue-900/5 transition-all"
              >
                <div className="flex flex-col lg:flex-row gap-8">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-40 h-40 rounded-2xl object-cover"
                  />

                  <div className="flex-1">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-2xl font-bold text-[#1e293b]">{doctor.name}</h3>
                          {doctor.available && (
                            <span className="flex items-center gap-1 bg-green-50 text-[#10B981] px-3 py-1 rounded-full text-sm font-semibold">
                              <span className="w-2 h-2 bg-[#10B981] rounded-full" />
                              Available
                            </span>
                          )}
                        </div>
                        <p className="text-[#2563EB] text-lg font-medium mb-1">{doctor.specialization}</p>
                        <div className="flex items-center gap-4 text-slate-500">
                          <span className="flex items-center gap-1">
                            <Star className="text-yellow-400" size={16} fill="currentColor" />
                            <span className="font-semibold text-[#1e293b]">{doctor.rating}</span>
                            <span className="text-slate-400">({doctor.reviews} reviews)</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <Activity size={16} />
                            {doctor.experience} years experience
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-6">
                      <div className="flex items-center gap-2 text-slate-600">
                        <MapPin size={18} />
                        {doctor.clinic}
                      </div>
                      <div className="flex items-center gap-2 text-slate-600">
                        <Clock size={18} />
                        Next: <span className="font-semibold text-[#2563EB]">{doctor.nextAvailable}</span>
                      </div>
                    </div>

                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-6">
                        <div>
                          <p className="text-3xl font-bold text-[#1e293b]">₹{doctor.fee}</p>
                          <p className="text-slate-500 text-sm">Consultation fee</p>
                        </div>
                      </div>
                      <button className="bg-gradient-to-r from-[#2563EB] to-[#0EA5E9] text-white px-8 py-3 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-blue-500/25 transition-all flex items-center gap-2">
                        Book Now <ChevronRight size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-2 mt-12">
              {[1, 2, 3, '...', 8].map((page, i) => (
                <button
                  key={i}
                  className={`w-12 h-12 rounded-xl font-semibold transition-all ${
                    page === 1
                      ? 'bg-gradient-to-r from-[#2563EB] to-[#0EA5E9] text-white'
                      : 'bg-white text-slate-600 border border-gray-200 hover:border-[#2563EB] hover:text-[#2563EB]'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default DoctorSearch;
