import Link from 'next/link';
import { MessageCircle, Zap, Users, BarChart3 } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      {/* Navbar */}
      <nav className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
        <div className="text-2xl font-bold text-indigo-900 flex items-center gap-2">
          <MessageCircle className="text-indigo-600" />
          WhatsAppAuto
        </div>
        <div className="space-x-4">
          <Link href="/login" className="px-4 py-2 text-indigo-900 font-medium hover:text-indigo-600 transition-colors">
            Login
          </Link>
          <Link href="/register" className="px-6 py-2 bg-indigo-600 text-white rounded-full font-medium hover:bg-indigo-700 transition-shadow hover:shadow-lg shadow-indigo-200">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 pt-20 pb-32">
        <div className="text-center space-y-8">
          <h1 className="text-6xl font-extrabold text-indigo-950 tracking-tight leading-tight">
            Automate Your <span className="text-indigo-600">WhatsApp</span> <br />
            Marketing & Support
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            The all-in-one platform for WhatsApp Business API. Manage chats, send broadcasts, and analyze performance with real-time updates.
          </p>
          <div className="flex justify-center gap-4 pt-4">
            <Link href="/register" className="px-8 py-4 bg-indigo-600 text-white text-lg rounded-full font-bold hover:bg-indigo-700 transition-all hover:scale-105 shadow-xl shadow-indigo-200">
              Start Free Trial
            </Link>
            <button className="px-8 py-4 bg-white text-indigo-900 text-lg rounded-full font-bold border-2 border-indigo-50 hover:bg-indigo-50 transition-all">
              Watch Demo
            </button>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-32">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-indigo-50 hover:shadow-xl transition-shadow group">
            <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Zap className="text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold text-indigo-950 mb-3">Real-time Webhooks</h3>
            <p className="text-gray-600">Get instant notifications for messages, delivery, and read receipts across all devices.</p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-indigo-50 hover:shadow-xl transition-shadow group">
            <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Users className="text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-indigo-950 mb-3">Multi-tenant CRM</h3>
            <p className="text-gray-600">Perfect for agencies. Manage multiple businesses and agents under one workspace.</p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-indigo-50 hover:shadow-xl transition-shadow group">
            <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <BarChart3 className="text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-indigo-950 mb-3">Deep Analytics</h3>
            <p className="text-gray-600">Track delivery rates, open rates, and agent response times to optimize your performance.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-indigo-50 py-12 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-500 text-sm">
          © 2026 WhatsAppAuto Platform. Powered by Meta Cloud API.
        </div>
      </footer>
    </div>
  );
}
