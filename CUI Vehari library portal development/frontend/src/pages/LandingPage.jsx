import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white shadow-sm z-50 border-b border-outline-variant flex items-center justify-between px-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary-container rounded-xl flex items-center justify-center shadow-lg">
          <span className="material-symbols-outlined text-secondary-container">school</span>
        </div>
        <span className="font-newsreader font-bold text-primary text-xl hidden sm:inline-block">
          CUI Vehari Plagiarism Portal
        </span>
      </div>
      <div className="flex items-center gap-6">
        <div className="hidden md:flex items-center gap-6">
          <a href="#" className="text-on-surface-variant hover:text-primary font-medium text-sm">Home</a>
          <a href="#" className="text-on-surface-variant hover:text-primary font-medium text-sm">Guidelines</a>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-full transition-colors">
            <span className="material-symbols-outlined">account_circle</span>
          </button>
          <button className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-full transition-colors">
            <span className="material-symbols-outlined">logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

const HeroSection = () => {
  return (
    <section className="min-h-[600px] academic-gradient pt-32 pb-20 px-6 flex flex-col items-center text-center">
      <div className="bg-secondary-container text-on-secondary-container rounded-full px-4 py-1.5 uppercase text-[10px] tracking-[0.2em] font-bold mb-8">
        Integrity in Research
      </div>
      <h1 className="font-newsreader text-4xl md:text-6xl text-white max-w-4xl leading-tight mb-6">
        CUI Vehari Plagiarism Detection Portal
      </h1>
      <p className="text-primary-fixed-dim text-lg md:text-xl max-w-2xl mx-auto mb-10 font-light">
        A unified platform for students, supervisors, and librarians to manage, verify, and report on academic submissions with absolute precision.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 mb-16">
        <Link to="/register" className="btn-primary">
          Get Started
        </Link>
        <a href="#how-it-works" className="btn-secondary">
          Learn More
        </a>
      </div>

      <div className="flex flex-col items-center">
        <p className="text-white/50 text-[10px] uppercase tracking-[0.3em] font-bold mb-6">Developed By</p>
        <div className="inline-flex flex-wrap justify-center gap-4">
          <div className="bg-white/10 backdrop-blur rounded-xl px-5 py-3 text-white text-left border border-white/5">
            <p className="font-semibold text-sm">Muhammad Abdullah</p>
            <p className="text-white/60 text-[11px] mt-0.5 uppercase tracking-wider">CS Department</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-xl px-5 py-3 text-white text-left border border-white/5">
            <p className="font-semibold text-sm">Urooj Khadim</p>
            <p className="text-white/60 text-[11px] mt-0.5">FA23-BSE-019</p>
            <p className="text-white/60 text-[11px] uppercase tracking-wider">Software Engineering</p>
          </div>
        </div>
      </div>
    </section>
  );
};

const RoleCards = () => {
  const roles = [
    { role: "Student", icon: "school", desc: "Submit your thesis, track supervisor approvals, and download plagiarism reports.", link: "/login?role=student" },
    { role: "Supervisor", icon: "supervisor_account", desc: "Review student submissions, provide academic clearance, and manage your research groups.", link: "/login?role=supervisor" },
    { role: "Librarian", icon: "local_library", desc: "Execute plagiarism checks, verify source originality, and issue final certification.", link: "/login?role=librarian" },
    { role: "Admin", icon: "admin_panel_settings", desc: "Configure system settings, manage user accounts, and audit portal logs.", link: "/login?role=admin" },
  ];

  return (
    <section className="py-24 px-6 max-w-screen-xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="font-newsreader text-4xl text-primary mb-4">Choose Your Portal Access</h2>
        <p className="text-on-surface-variant max-w-xl mx-auto">Select your specialized access point to manage academic integrity protocols.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {roles.map((item) => (
          <Link key={item.role} to={item.link} className="card-item group">
            <div className="bg-white rounded-2xl custom-shadow p-8 h-full transition-all duration-300 hover:-translate-y-2 flex flex-col">
              <div className="w-14 h-14 bg-secondary-container/20 rounded-full flex items-center justify-center mb-6 text-on-secondary-container">
                <span className="material-symbols-outlined text-3xl">{item.icon}</span>
              </div>
              <h3 className="font-newsreader text-2xl text-primary mb-3">{item.role}</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed mb-8 flex-1">
                {item.desc}
              </p>
              <div className="flex items-center gap-2 text-secondary font-bold text-sm group-hover:gap-3 transition-all">
                Login Portal <span className="material-symbols-outlined text-base">arrow_forward</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

const WorkflowSection = () => {
  const steps = [
    { icon: "upload_file", title: "Upload Thesis", desc: "Submit PDF or Word documents securely." },
    { icon: "rate_review", title: "Supervisor Review", desc: "Supervisor reviews and grants academic clearance." },
    { icon: "plagiarism", title: "Plagiarism Check", desc: "Librarian runs Turnitin analysis on the document." },
    { icon: "verified", title: "Report Issued", desc: "Student receives certified plagiarism report." },
  ];

  return (
    <section id="how-it-works" className="bg-surface-container-low py-24 border-y border-outline-variant/20">
      <div className="max-w-screen-xl mx-auto px-6">
        <h2 className="font-newsreader text-4xl text-primary text-center mb-20">Portal Workflow</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative">
          {/* Connector Line */}
          <div className="hidden md:block absolute top-12 left-24 right-24 h-0.5 bg-outline-variant/30 z-0"></div>
          
          {steps.map((step, idx) => (
            <div key={idx} className="flex flex-col items-center text-center relative z-10">
              <div className="w-24 h-24 bg-white rounded-full custom-shadow border-4 border-secondary-container flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-primary text-4xl">{step.icon}</span>
              </div>
              <h4 className="font-bold text-primary mb-2">{step.title}</h4>
              <p className="text-on-surface-variant text-xs leading-relaxed max-w-[200px]">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const StatsBar = () => {
  const stats = [
    { number: "500+", label: "Theses Processed" },
    { number: "4", label: "User Roles" },
    { number: "100%", label: "Secure Submissions" },
    { number: "24hrs", label: "Average Turnaround" },
  ];

  return (
    <section className="bg-primary py-16">
      <div className="max-w-screen-xl mx-auto px-6 flex flex-row justify-center gap-12 md:gap-24 flex-wrap">
        {stats.map((stat, idx) => (
          <div key={idx} className="text-center">
            <p className="font-newsreader text-4xl md:text-5xl text-secondary-container font-bold mb-2">
              {stat.number}
            </p>
            <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-primary-container py-16 text-white px-6">
      <div className="max-w-screen-xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center border border-white/10">
                <span className="material-symbols-outlined text-secondary-container">school</span>
              </div>
              <span className="font-newsreader font-bold text-xl">CUI Vehari Portal</span>
            </div>
            <p className="text-white/50 text-sm max-w-sm font-light">
              Maintaining academic integrity and excellence at COMSATS University Islamabad, Vehari Campus.
            </p>
          </div>
          <div className="flex gap-10">
            <div className="flex flex-col gap-3">
              <p className="text-xs font-bold uppercase tracking-widest text-secondary-container mb-2">Resources</p>
              <a href="#" className="text-white/60 hover:text-white text-sm transition-colors">Privacy Policy</a>
              <a href="#" className="text-white/60 hover:text-white text-sm transition-colors">Guidelines</a>
              <a href="#" className="text-white/60 hover:text-white text-sm transition-colors">Contact Support</a>
            </div>
          </div>
        </div>
        <div className="pt-8 border-t border-white/5 text-center">
          <p className="text-white/30 text-[10px] uppercase tracking-widest font-medium">
            © 2024 COMSATS University Islamabad, Vehari Campus. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <RoleCards />
        <WorkflowSection />
        <StatsBar />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
