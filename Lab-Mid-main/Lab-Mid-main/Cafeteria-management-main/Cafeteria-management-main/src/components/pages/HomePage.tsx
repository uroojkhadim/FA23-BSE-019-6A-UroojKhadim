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
    <div className="min-h-screen bg-background text-foreground selection:bg-foreground selection:text-background overflow-x-hidden">
      <Header />

      <section className="w-full max-w-[120rem] mx-auto px-4 sm:px-6 lg:px-10 pt-28 sm:pt-36 pb-16 sm:pb-24">
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="grid grid-cols-12 gap-6 lg:gap-10">
          <div className="col-span-12 lg:col-span-9">
            <p className="font-paragraph text-xs sm:text-sm uppercase tracking-[0.22em] text-secondary-foreground mb-5">
              Campus Food Services
            </p>
            <h1 className="font-heading text-[2.4rem] leading-[0.95] sm:text-6xl lg:text-[7rem] uppercase tracking-tight mb-6">
              COMSATS <span className="text-accent">Cafeteria</span> Portal
            </h1>
            <p className="font-paragraph text-sm sm:text-base lg:text-lg text-foreground/80 max-w-3xl leading-relaxed">
              A reliable campus ordering system for students, teachers, and administrators with menu browsing, order
              tracking, billing, and operations management in one place.
            </p>
            {user && (
              <p className="font-paragraph text-xs sm:text-sm uppercase tracking-[0.18em] text-secondary-foreground mt-5">
                Signed in as {user.role}
              </p>
            )}

            <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
              <Link
                to={user?.role === 'admin' ? '/admin' : '/menu'}
                className="group inline-flex items-center justify-center px-6 sm:px-8 py-3.5 bg-primary text-primary-foreground font-paragraph text-xs sm:text-sm uppercase tracking-widest transition-transform hover:scale-[1.01]"
              >
                Open Portal
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to={user?.role === 'student' || user?.role === 'admin' ? '/orders' : '/login'}
                className="inline-flex items-center justify-center px-6 sm:px-8 py-3.5 border border-secondary text-foreground font-paragraph text-xs sm:text-sm uppercase tracking-widest hover:border-primary hover:text-primary transition-colors"
              >
                {user?.role === 'student' || user?.role === 'admin' ? 'View Orders' : 'Campus Login'}
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="w-full max-w-[120rem] mx-auto px-4 sm:px-6 lg:px-10 pb-16 sm:pb-24">
        <div className="relative w-full h-[40vh] sm:h-[55vh] lg:h-[70vh] overflow-hidden border border-secondary/70 bg-secondary/10" ref={imageRef}>
          <motion.div style={{ scale: imageScale }} className="w-full h-full">
            <Image src={HERO_IMAGE} alt="Cafeteria operations" className="w-full h-full object-cover grayscale-[20%]" />
          </motion.div>
          <div className="absolute inset-4 sm:inset-6 border border-secondary/60 pointer-events-none" />
        </div>
      </section>

      <section className="w-full max-w-[120rem] mx-auto px-4 sm:px-6 lg:px-10 py-14 sm:py-20">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl uppercase tracking-tight">Core Modules</h2>
          <div className="w-full sm:w-1/2 h-px bg-secondary" />
        </div>

        {features.length > 0 ? (
          <div
            className={`grid border-t border-l border-secondary ${
              features.length >= 4 ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-4' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
            }`}
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
                  className="border-r border-b border-secondary p-6 sm:p-8 flex flex-col min-h-[230px] bg-background hover:bg-secondary/5 transition-colors"
                >
                  <FeatureIcon className="w-7 h-7 mb-5 text-foreground/80" strokeWidth={1.4} />
                  <h3 className="font-heading text-lg sm:text-xl uppercase tracking-wide mb-3">{feature.title}</h3>
                  <p className="font-paragraph text-sm text-foreground/70 leading-relaxed flex-1">{feature.description}</p>
                  <div className="mt-6 pt-5 border-t border-secondary/50 flex items-center justify-between">
                    <span className="font-paragraph text-[11px] uppercase tracking-widest text-secondary-foreground">
                      {feature.roleLabel}
                    </span>
                    <Link
                      to={feature.link}
                      className="w-8 h-8 rounded-full border border-secondary flex items-center justify-center hover:border-foreground hover:bg-foreground hover:text-background transition-all"
                      aria-label={`Go to ${feature.title}`}
                    >
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="border border-secondary p-8">
            <p className="font-paragraph text-sm text-foreground/70">
              Sign in with a student or administrator account to access cafeteria modules.
            </p>
          </div>
        )}
      </section>

      <section className="w-full max-w-[120rem] mx-auto px-4 sm:px-6 lg:px-10 py-14 sm:py-20 bg-foreground text-background">
        <div className="grid grid-cols-12 gap-6 sm:gap-8">
          <div className="col-span-12 md:col-span-3">
            <h2 className="font-heading text-xl sm:text-2xl uppercase tracking-widest text-secondary">Access Levels</h2>
          </div>
          <div className="col-span-12 md:col-span-9">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-0">
              {roleCards.map((role, index) => (
                <div
                  key={role.title}
                  className={`flex flex-col ${index !== 0 ? 'md:pl-6 lg:pl-8 md:border-l border-secondary/30' : ''} ${
                    index !== roleCards.length - 1 ? 'md:pr-6 lg:pr-8' : ''
                  }`}
                >
                  <h3 className="font-heading text-lg sm:text-xl uppercase mb-3">{role.title}</h3>
                  <p className="font-paragraph text-sm text-secondary/80 leading-relaxed">{role.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="w-full max-w-[120rem] mx-auto px-4 sm:px-6 lg:px-10 py-14 sm:py-20">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 md:col-span-4">
            <p className="font-paragraph text-xs sm:text-sm uppercase tracking-[0.2em] text-secondary-foreground mb-3">Support</p>
            <h2 className="font-heading text-2xl sm:text-4xl uppercase tracking-tight">Contact Channels</h2>
          </div>
          <div className="col-span-12 md:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div className="border border-secondary p-5 sm:p-6">
              <Mail className="w-5 h-5 text-foreground mb-3" strokeWidth={1.5} />
              <p className="font-heading text-base sm:text-lg uppercase mb-1.5">Email</p>
              <p className="font-paragraph text-sm">cafeteria@comsats.edu.pk</p>
            </div>
            <div className="border border-secondary p-5 sm:p-6">
              <Phone className="w-5 h-5 text-foreground mb-3" strokeWidth={1.5} />
              <p className="font-heading text-base sm:text-lg uppercase mb-1.5">Phone</p>
              <p className="font-paragraph text-sm">+92 (51) 1234-5678</p>
            </div>
            <div className="border border-secondary p-5 sm:p-6">
              <MessageCircle className="w-5 h-5 text-foreground mb-3" strokeWidth={1.5} />
              <p className="font-heading text-base sm:text-lg uppercase mb-1.5">WhatsApp</p>
              <p className="font-paragraph text-sm">+92 300 0000000</p>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full max-w-[120rem] mx-auto px-4 sm:px-6 lg:px-10 pb-20 sm:pb-28">
        <div className="border border-foreground p-6 sm:p-10 lg:p-16 relative overflow-hidden">
          <div className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto">
            <h2 className="font-heading text-3xl sm:text-5xl uppercase tracking-tight mb-4 sm:mb-6">Start Service</h2>
            <p className="font-paragraph text-sm sm:text-lg text-foreground/70 mb-8 sm:mb-10">
              Sign in with your campus role or open the menu to start a new order.
            </p>

            <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3 sm:gap-4">
              <Link
                to="/menu"
                className="inline-flex items-center justify-center px-6 sm:px-8 py-3.5 bg-primary text-primary-foreground font-paragraph text-xs sm:text-sm uppercase tracking-widest hover:opacity-90 transition-opacity"
              >
                Browse Menu
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center px-6 sm:px-8 py-3.5 border border-primary text-primary font-paragraph text-xs sm:text-sm uppercase tracking-widest hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-6 sm:px-8 py-3.5 border border-secondary text-foreground font-paragraph text-xs sm:text-sm uppercase tracking-widest hover:border-primary transition-colors"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
