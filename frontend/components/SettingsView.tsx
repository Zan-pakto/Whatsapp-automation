'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Save, Copy, Check, ShieldCheck, ArrowUpRight } from 'lucide-react';

export default function SettingsView() {
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [business, setBusiness] = useState({
    name: '',
    whatsappPhoneNumberId: '',
    whatsappAccessToken: '',
    whatsappWabaId: '',
    webhookVerifyToken: '',
    _id: ''
  });

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const { data } = await api.get('/business');
        setBusiness(data);
      } catch (err) {
        console.error('Failed to fetch business info');
      }
    };
    fetchBusiness();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.put('/business', business);
      setBusiness(data);
      alert('Settings saved successfully!');
    } catch (err) {
      alert('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const webhookUrl = `${window.location.origin.replace('3000', '5000')}/api/webhook/${business._id}`;

  return (
    <div className="flex-1 h-full bg-gray-50 overflow-y-auto p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Business Setup</h1>
          <p className="text-gray-500 mt-2">Configure your Meta WhatsApp Cloud API credentials to start messaging.</p>
        </div>

        {/* Apply for API Card */}
        <div className="bg-white border-2 border-dashed border-indigo-200 p-8 rounded-3xl flex flex-col md:flex-row items-center gap-8 shadow-sm">
          <div className="flex-1 space-y-4">
            <h2 className="text-2xl font-bold text-indigo-950 flex items-center gap-2">
              <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WA" className="w-6 h-6" />
              Get Official WhatsApp API
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              To send messages, you need to register your business on the Meta Developer Portal. 
              Get your **Phone Number ID** and **Access Token** in less than 5 minutes.
            </p>
            <ul className="text-xs text-gray-500 space-y-2">
              <li className="flex items-center gap-2">✓ Official Green Tick (Optional)</li>
              <li className="flex items-center gap-2">✓ Send Bulk Broadcasts</li>
              <li className="flex items-center gap-2">✓ Multi-Agent Support</li>
            </ul>
            <a 
              href="https://developers.facebook.com/apps" 
              target="_blank" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#25D366] text-white rounded-xl font-bold hover:bg-[#128C7E] transition-all shadow-lg shadow-green-100"
            >
              Apply via Meta Dashboard
              <ArrowUpRight size={18} />
            </a>
          </div>
          <div className="w-full md:w-64 bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-3">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">How to Apply</p>
            <div className="space-y-4">
              {[
                { s: '1', t: 'Create Meta App' },
                { s: '2', t: 'Setup WhatsApp' },
                { s: '3', t: 'Add Phone Number' },
                { s: '4', t: 'Copy Credentials' },
              ].map((step) => (
                <div key={step.s} className="flex items-center gap-3">
                  <span className="w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center text-xs font-bold text-indigo-600 shadow-sm">{step.s}</span>
                  <span className="text-sm text-gray-700 font-medium">{step.t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Webhook Info Card */}
        <div className="bg-indigo-900 text-white p-6 rounded-2xl shadow-xl space-y-4">
          <div className="flex items-center gap-2 text-indigo-200 font-semibold">
            <ShieldCheck size={20} />
            Webhook Configuration
          </div>
          <p className="text-sm text-indigo-100">Copy these to your Meta Developer Portal under WhatsApp {'>'} Configuration.</p>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-indigo-300">Callback URL</label>
              <div className="flex bg-indigo-950/50 p-3 rounded-lg items-center justify-between border border-indigo-700/50">
                <code className="text-xs text-indigo-100 truncate mr-2">{webhookUrl}</code>
                <button onClick={() => copyToClipboard(webhookUrl, 'url')} className="text-indigo-400 hover:text-white transition-colors">
                  {copied === 'url' ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-indigo-300">Verify Token</label>
              <div className="flex bg-indigo-950/50 p-3 rounded-lg items-center justify-between border border-indigo-700/50">
                <code className="text-xs text-indigo-100">{business.webhookVerifyToken}</code>
                <button onClick={() => copyToClipboard(business.webhookVerifyToken, 'token')} className="text-indigo-400 hover:text-white transition-colors">
                  {copied === 'token' ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Settings Form */}
        <form onSubmit={handleSave} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Business Name</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-gray-900"
                value={business.name || ''}
                onChange={(e) => setBusiness({ ...business, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Phone Number ID</label>
              <input
                type="text"
                placeholder="From Meta Dashboard"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-gray-900"
                value={business.whatsappPhoneNumberId || ''}
                onChange={(e) => setBusiness({ ...business, whatsappPhoneNumberId: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Permanent Access Token</label>
            <textarea
              rows={3}
              placeholder="EAA..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-gray-900"
              value={business.whatsappAccessToken || ''}
              onChange={(e) => setBusiness({ ...business, whatsappAccessToken: e.target.value })}
            />
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-50"
            >
              <Save size={20} />
              {loading ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
