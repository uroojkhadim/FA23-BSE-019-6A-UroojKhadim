import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Coffee, Globe, Github } from 'lucide-react';
import { toast } from 'react-toastify';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await login(email, password);
      toast.success(`Welcome back, ${user.name}`);
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'staff') navigate('/pos');
      else navigate('/');
    } catch (err) {
      toast.error('Authentication Failed: ' + err.message);
    }
  };

  return (
    <div className="auth-split">
      {/* Visual Side */}
      <div className="auth-visual">
        <div className="absolute inset-0 bg-primary/20 mix-blend-overlay z-10"></div>
        <img 
          src="/cafe_hero_premium.png" 
          alt="Premium Cafe Interior" 
          className="auth-visual-image"
        />
        <div className="auth-visual-overlay"></div>
        <div className="absolute inset-0 flex flex-col justify-center p-24 z-20">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-8xl font-black text-white leading-[0.9]">
              Savor the <br /> 
              <span className="gradient-text">Excellence.</span>
            </h1>
            <p className="text-text-secondary text-2xl mt-8 max-w-lg leading-relaxed font-medium">
              Experience the pinnacle of cafeteria management with our elite digital platform.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Form Side */}
      <div className="auth-form-side">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md space-y-12"
        >
          <div className="flex flex-col items-center lg:items-start">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-[20px] flex items-center justify-center mb-8 shadow-2xl shadow-primary/20 group cursor-pointer overflow-hidden">
               <motion.div whileHover={{ rotate: 15 }}>
                  <Coffee size={32} className="text-white" />
               </motion.div>
            </div>
            <h2 className="text-5xl font-black tracking-tight mb-2">Login to <span className="gradient-text">Portal</span></h2>
            <p className="text-text-secondary font-semibold">Welcome back to the elite community</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="social-btn">
              <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center text-[10px] text-black font-black">G</div>
              Google
            </button>
            <button className="social-btn"><Github size={20} /> Github</button>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-glass-border"></div>
            </div>
            <span className="relative bg-bg-deep px-6 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">or Secure Access</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.15em] text-text-secondary ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={20} />
                <input 
                  type="email" 
                  className="modern-input pl-14" 
                  placeholder="explorer@cafe.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black uppercase tracking-[0.15em] text-text-secondary">Secure Password</label>
                <a href="#" className="text-[10px] font-black uppercase tracking-[0.15em] text-primary hover:underline">Forgot?</a>
              </div>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={20} />
                <input 
                  type="password" 
                  className="modern-input pl-14" 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <button type="submit" className="btn-vibrant w-full group py-5 text-lg mt-6">
              Access Dashboard <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <p className="text-center lg:text-left text-text-secondary font-medium mt-10">
            Digital newcomer? <Link to="/register" className="text-primary font-bold hover:underline decoration-2 underline-offset-4">Join the community</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
