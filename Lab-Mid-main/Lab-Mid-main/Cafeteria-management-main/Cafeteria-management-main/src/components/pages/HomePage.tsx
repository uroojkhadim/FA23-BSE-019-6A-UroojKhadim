import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ShoppingCart, Users, BarChart3, Utensils, ArrowRight, Mail, Phone, MessageCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Image } from '@/components/ui/image';
import { getFeaturesForRole, roleSummaries } from '@/lib/access';
import { useAuthStore } from '@/store/authStore';

const HERO_IMAGE =
  'https://static.wixstatic.com/media/a525c7_81f4b76f50b04205bc0e0661511f5926~mv2.png?originWidth=1280&originHeight=704';

const featureIcons = [Utensils, Users, ShoppingCart, BarChart3];

export default function HomePage() {
  const { user } = useAuthStore();
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, 100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.2]);
  const imageRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: imageScroll } = useScroll({
    target: imageRef,
    offset: ['start end', 'end start'],
  });
  const imageScale = useTransform(imageScroll, [0, 1], [1.06, 1]);
  const features = getFeaturesForRole(user?.role);
  const roleCards = Object.values(roleSummaries);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 text-foreground selection:bg-blue-600 selection:text-white overflow-x-hidden">
      <Header />

      {/* Hero Section */}
      <section className="relative w-full max-w-[120rem] mx-auto px-4 sm:px-6 lg:px-10 pt-28 sm:pt-36 pb-16 sm:pb-24">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-100 rounded-full opacity-30 blur-3xl animate-pulse-slow" />
          <div className="absolute top-20 -left-20 w-72 h-72 bg-amber-50 rounded-full opacity-40 blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
        </div>

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative grid grid-cols-12 gap-6 lg:gap-10">
          <div className="col-span-12 lg:col-span-9">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm border border-slate-200/50 rounded-full mb-5 shadow-sm"
            >
              <Utensils className="w-4 h-4 text-blue-600" strokeWidth={1.5} />
              <p className="font-paragraph text-xs uppercase tracking-[0.2em] text-slate-600">
                Campus Food Services
              </p>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-heading text-[2.4rem] leading-[0.95] sm:text-6xl lg:text-[7rem] uppercase tracking-tight mb-6"
            >
              COMSATS <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800">Cafeteria</span> Portal
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="font-paragraph text-sm sm:text-base lg:text-lg text-slate-600 max-w-3xl leading-relaxed"
            >
              A reliable campus ordering system for students, teachers, and administrators with menu browsing, order
              tracking, billing, and operations management in one place.
            </motion.p>
            
            {user && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mt-5 inline-flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-full"
              >
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <p className="font-paragraph text-xs sm:text-sm uppercase tracking-[0.18em] text-green-700">
                  Signed in as {user.role}
                </p>
              </motion.div>
            )}

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto"
            >
              <Link
                to={user?.role === 'admin' ? '/admin' : '/menu'}
                className="group inline-flex items-center justify-center px-6 sm:px-8 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-paragraph text-xs sm:text-sm uppercase tracking-widest rounded-xl shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-[1.02]"
              >
                Open Portal
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to={user?.role === 'student' || user?.role === 'admin' ? '/orders' : '/login'}
                className="inline-flex items-center justify-center px-6 sm:px-8 py-3.5 border-2 border-slate-300 text-slate-700 font-paragraph text-xs sm:text-sm uppercase tracking-widest rounded-xl hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50 transition-all"
              >
                {user?.role === 'student' || user?.role === 'admin' ? 'View Orders' : 'Campus Login'}
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Hero Image Section */}
      <section className="w-full max-w-[120rem] mx-auto px-4 sm:px-6 lg:px-10 pb-16 sm:pb-24">
        <div className="relative w-full h-[40vh] sm:h-[55vh] lg:h-[70vh] overflow-hidden rounded-3xl border-2 border-slate-200 shadow-2xl" ref={imageRef}>
          <motion.div style={{ scale: imageScale }} className="w-full h-full">
            <Image src={HERO_IMAGE} alt="Cafeteria operations" className="w-full h-full object-cover grayscale-[10%]" />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
          <div className="absolute inset-6 border-2 border-white/30 rounded-2xl pointer-events-none" />
        </div>
      </section>

      {/* Core Modules Section */}
      <section className="w-full max-w-[120rem] mx-auto px-4 sm:px-6 lg:px-10 py-14 sm:py-20">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl uppercase tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900">Core Modules</h2>
            <p className="font-paragraph text-sm text-slate-500 mt-2">Everything you need for seamless cafeteria operations</p>
          </div>
          <div className="w-full sm:w-1/2 h-1 bg-gradient-to-r from-blue-600 to-blue-800 rounded-full" />
        </div>

        {features.length > 0 ? (
          <div
            className={`grid ${
              features.length >= 4 ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-4' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
            } gap-6`}
          >
            {features.map((feature, index) => {
              const FeatureIcon = featureIcons[index % featureIcons.length];
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.4, delay: index * 0.06 }}
                  whileHover={{ y: -8, transition: { duration: 0.2 } }}
                  className="group relative bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-card shadow-card-hover hover:shadow-xl transition-all overflow-hidden"
                >
                  {/* Gradient background on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="relative z-10 flex flex-col min-h-[230px]">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <FeatureIcon className="w-7 h-7 text-white" strokeWidth={1.4} />
                    </div>
                    <h3 className="font-heading text-lg sm:text-xl uppercase tracking-wide mb-3 text-slate-900">{feature.title}</h3>
                    <p className="font-paragraph text-sm text-slate-600 leading-relaxed flex-1">{feature.description}</p>
                    <div className="mt-6 pt-5 border-t border-slate-200 flex items-center justify-between">
                      <span className="font-paragraph text-[10px] uppercase tracking-widest text-slate-500">
                        {feature.roleLabel}
                      </span>
                      <Link
                        to={feature.link}
                        className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg transform group-hover:rotate-45 duration-300"
                        aria-label={`Go to ${feature.title}`}
                      >
                        <ArrowRight className="w-4 h-4 text-white" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
            <p className="font-paragraph text-sm text-slate-600">
              Sign in with a student or administrator account to access cafeteria modules.
            </p>
          </div>
        )}
      </section>

      {/* Access Levels Section */}
      <section className="w-full max-w-[120rem] mx-auto px-4 sm:px-6 lg:px-10 py-14 sm:py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-500 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 grid grid-cols-12 gap-6 sm:gap-8">
          <div className="col-span-12 md:col-span-3">
            <h2 className="font-heading text-xl sm:text-2xl uppercase tracking-widest text-blue-400 mb-2">Access Levels</h2>
            <p className="font-paragraph text-sm text-slate-400">Choose your role</p>
          </div>
          <div className="col-span-12 md:col-span-9">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-0">
              {roleCards.map((role, index) => (
                <div
                  key={role.title}
                  className={`flex flex-col p-6 ${index !== 0 ? 'md:pl-6 lg:pl-8 md:border-l border-white/10' : ''} ${
                    index !== roleCards.length - 1 ? 'md:pr-6 lg:pr-8' : ''
                  } hover:bg-white/5 rounded-2xl transition-colors duration-300`}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center mb-4">
                    <Users className="w-6 h-6 text-white" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-heading text-lg sm:text-xl uppercase mb-3 text-white">{role.title}</h3>
                  <p className="font-paragraph text-sm text-slate-300 leading-relaxed">{role.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="w-full max-w-[120rem] mx-auto px-4 sm:px-6 lg:px-10 py-14 sm:py-20">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 md:col-span-4">
            <p className="font-paragraph text-xs sm:text-sm uppercase tracking-[0.2em] text-blue-600 mb-3 font-semibold">Support</p>
            <h2 className="font-heading text-2xl sm:text-4xl uppercase tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900">Contact Channels</h2>
            <p className="font-paragraph text-sm text-slate-500 mt-2">Get in touch with our team</p>
          </div>
          <div className="col-span-12 md:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <a href="mailto:cafeteria@comsats.edu.pk" className="group bg-white border border-slate-200 p-5 sm:p-6 rounded-2xl shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300 block">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Mail className="w-5 h-5 text-white" strokeWidth={1.5} />
              </div>
              <p className="font-heading text-base sm:text-lg uppercase mb-1.5 text-slate-900">Email</p>
              <p className="font-paragraph text-sm text-slate-600 group-hover:text-slate-900 transition-colors">cafeteria@comsats.edu.pk</p>
            </a>
            <a href="tel:+925112345678" className="group bg-white border border-slate-200 p-5 sm:p-6 rounded-2xl shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300 block">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Phone className="w-5 h-5 text-white" strokeWidth={1.5} />
              </div>
              <p className="font-heading text-base sm:text-lg uppercase mb-1.5 text-slate-900">Phone</p>
              <p className="font-paragraph text-sm text-slate-600 group-hover:text-slate-900 transition-colors">+92 (51) 1234-5678</p>
            </a>
            <a href="https://wa.me/923000000000" target="_blank" rel="noopener noreferrer" className="group bg-white border border-slate-200 p-5 sm:p-6 rounded-2xl shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300 block">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <MessageCircle className="w-5 h-5 text-white" strokeWidth={1.5} />
              </div>
              <p className="font-heading text-base sm:text-lg uppercase mb-1.5 text-slate-900">WhatsApp</p>
              <p className="font-paragraph text-sm text-slate-600 group-hover:text-slate-900 transition-colors">+92 300 0000000</p>
            </a>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full max-w-[120rem] mx-auto px-4 sm:px-6 lg:px-10 pb-20 sm:pb-28">
        <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 p-6 sm:p-10 lg:p-16 rounded-3xl overflow-hidden shadow-2xl">
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl" />
          
          <div className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-heading text-3xl sm:text-5xl uppercase tracking-tight text-white mb-4 sm:mb-6">Start Service</h2>
              <p className="font-paragraph text-sm sm:text-lg text-blue-100 mb-8 sm:mb-10">
                Sign in with your campus role or open the menu to start a new order.
              </p>

              <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3 sm:gap-4">
                <Link
                  to="/menu"
                  className="inline-flex items-center justify-center px-6 sm:px-8 py-3.5 bg-white text-blue-700 font-paragraph text-xs sm:text-sm uppercase tracking-widest rounded-xl shadow-lg hover:shadow-xl hover:bg-blue-50 transition-all transform hover:scale-105 font-semibold"
                >
                  Browse Menu
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center px-6 sm:px-8 py-3.5 border-2 border-white text-white font-paragraph text-xs sm:text-sm uppercase tracking-widest rounded-xl hover:bg-white hover:text-blue-700 transition-all font-semibold"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center px-6 sm:px-8 py-3.5 bg-blue-900/30 backdrop-blur-sm border border-white/30 text-white font-paragraph text-xs sm:text-sm uppercase tracking-widest rounded-xl hover:bg-blue-900/50 transition-all"
                >
                  Register
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
