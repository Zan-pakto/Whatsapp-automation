import Link from 'next/link';
import { MessageCircle, Zap, Users, BarChart3, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* Navbar */}
      <nav className="max-w-7xl mx-auto px-6 py-8 flex justify-between items-center">
        <div className="text-2xl font-black text-[#054c44] flex items-center gap-3">
          <div className="w-10 h-10 bg-[#054c44] rounded-xl flex items-center justify-center shadow-lg">
            <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="Logo" className="w-6 h-6 invert" />
          </div>
          <span className="tracking-tighter">W-API</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/login" className="text-sm font-bold text-slate-600 hover:text-[#054c44] transition-colors">
            Sign In
          </Link>
          <Link href="/register" className="px-6 py-3 bg-[#054c44] text-white rounded-xl text-sm font-bold hover:bg-[#065d53] transition-all shadow-lg shadow-emerald-900/20 active:scale-95">
            Get Started Free
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 pt-24 pb-32">
        <div className="flex flex-col items-center text-center space-y-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold uppercase tracking-wider border border-emerald-100 animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Next-Gen WhatsApp Automation
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tight leading-[0.9] max-w-4xl">
            Scale your <span className="text-[#054c44]">conversations</span> with AI precision.
          </h1>
          
          <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed font-medium">
            The enterprise-grade platform for WhatsApp Business. Broadcast, automate, and manage your customer relationships in real-time.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6 w-full sm:w-auto">
            <Link href="/register" className="group px-10 py-5 bg-[#054c44] text-white text-lg rounded-xl font-black hover:bg-[#065d53] transition-all shadow-2xl shadow-emerald-900/30 flex items-center justify-center gap-3 active:scale-95">
              Launch Dashboard
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="px-10 py-5 bg-white text-slate-900 text-lg rounded-xl font-bold border-2 border-slate-100 hover:bg-slate-50 transition-all active:scale-95">
              Book a Demo
            </button>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-40">
          {[
            { 
              icon: <Zap className="text-emerald-600" />, 
              bg: 'bg-emerald-50',
              title: 'Instant Delivery', 
              desc: 'Ultra-low latency webhooks for real-time status updates across all your business channels.' 
            },
            { 
              icon: <Users className="text-blue-600" />, 
              bg: 'bg-blue-50',
              title: 'Team Collaboration', 
              desc: 'Advanced multi-agent CRM to manage thousands of contacts with automated routing.' 
            },
            { 
              icon: <BarChart3 className="text-purple-600" />, 
              bg: 'bg-purple-50',
              title: 'Deep Intelligence', 
              desc: 'Granular analytics on engagement, response times, and campaign performance metrics.' 
            }
          ].map((feature, i) => (
            <div key={i} className="bg-white p-10 rounded-2xl border border-slate-100 hover:border-emerald-200 hover:shadow-[0_20px_50px_rgba(5,76,68,0.05)] transition-all group">
              <div className={`w-14 h-14 ${feature.bg} rounded-xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                {feature.icon}
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">{feature.title}</h3>
              <p className="text-slate-500 font-medium leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-16 bg-slate-50/30 mt-20">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-xl font-black text-[#054c44] flex items-center gap-2 grayscale opacity-50">
            W-API Platform
          </div>
          <div className="text-slate-400 text-sm font-medium">
            © 2026 WhatsAppAuto Enterprise. Built for high-volume automation.
          </div>
        </div>
      </footer>
    </div>
  );
}

