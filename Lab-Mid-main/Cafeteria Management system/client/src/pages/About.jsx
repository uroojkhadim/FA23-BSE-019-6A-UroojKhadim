import React from 'react';
import { motion } from 'framer-motion';
import { Award, Briefcase, Globe, Heart, ShieldCheck, Star } from 'lucide-react';

const About = () => {
  return (
    <div className="bg-background min-h-screen py-32 px-10">
      <div className="max-w-[1400px] mx-auto space-y-32">
        {/* Story Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-12">
            <div className="space-y-6">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-primary font-black text-[10px] uppercase tracking-[0.4em]"
              >
                Our Scientific Heritage
              </motion.div>
              <h1 className="text-7xl font-black tracking-tighter italic leading-[0.9]">Fueling the <br /><span className="gradient-text uppercase">Academic Mind</span></h1>
            </div>
            <p className="text-2xl text-text-muted leading-relaxed font-medium">
              Established in 2024, Elite Cafe was born from a simple thesis: the quality of a student's output is directly proportional to the quality of their intake. 
            </p>
            <p className="text-lg text-white/60 leading-relaxed font-medium">
              We partnered with the university's top nutritional scientists and world-class artisanal chefs to create a dining experience that transcends the traditional "cafeteria" model. Today, we serve as the strategic hub for late-night study sessions, early-morning seminars, and celebratory graduation feasts.
            </p>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-[120px] rounded-full"></div>
            <img 
              src="https://images.unsplash.com/photo-1541167760496-162955ed8a9f?q=80&w=1000&auto=format&fit=crop" 
              alt="Elite Dining Story" 
              className="relative z-10 rounded-[60px] grayscale hover:grayscale-0 transition-all duration-700 border border-glass-border"
            />
          </div>
        </section>

        {/* Values Grid */}
        <section className="space-y-16">
          <div className="text-center">
            <h2 className="text-[10px] font-black uppercase tracking-[0.8em] text-text-muted">The Elite Standard</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {[
              { icon: <ShieldCheck />, title: 'Quality Assurance', desc: 'Every ingredient is vetted by our internal quality protocol for purity and ethical sourcing.' },
              { icon: <Award />, title: 'Artisanal Mastery', desc: 'Our chefs are trained in traditional techniques with a modern gastronomic twist.' },
              { icon: <Globe />, title: 'Zero Waste Protocol', desc: 'We operate a carbon-neutral kitchen with 100% biodegradable logistics.' },
              { icon: <Heart />, title: 'Student Welfare', desc: 'A portion of every transaction fuels the University Student Hardship Fund.' },
              { icon: <Star />, title: 'Premier Service', desc: 'Experience the fastest fulfillment times in the sector through our digital POS.' },
              { icon: <Briefcase />, title: 'Career Growth', desc: 'We provide strategic employment opportunities for over 200 students annually.' }
            ].map((value, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -10 }}
                className="glass-card p-10 space-y-6 group border-l-4 border-transparent hover:border-primary transition-all duration-500"
              >
                <div className="text-primary group-hover:scale-110 transition-transform duration-500">
                  {React.cloneElement(value.icon, { size: 32 })}
                </div>
                <h3 className="text-2xl font-black">{value.title}</h3>
                <p className="text-text-muted font-medium leading-relaxed">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
