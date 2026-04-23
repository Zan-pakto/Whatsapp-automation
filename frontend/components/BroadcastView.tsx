'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Zap, Send, Users, CheckCircle, Info } from 'lucide-react';

export default function BroadcastView() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const { data } = await api.get('/contacts');
      setContacts(data);
    } catch (err) {
      console.error('Failed to fetch contacts');
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSend = async () => {
    if (selectedIds.length === 0 || !message) return;
    setLoading(true);
    try {
      await api.post('/broadcast', {
        contactIds: selectedIds,
        content: message
      });
      alert(`Broadcast sent to ${selectedIds.length} contacts!`);
      setStep(1);
      setSelectedIds([]);
      setMessage('');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to send broadcast');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 h-full bg-gray-50 flex flex-col p-8 overflow-y-auto font-sans">
      <div className="max-w-5xl mx-auto w-full space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Campaign Broadcasts</h1>
          <p className="text-gray-500 mt-1">Engage your audience at scale with bulk messaging.</p>
        </div>

        {/* Stepper */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex justify-between items-center px-12">
          {[
            { s: 1, t: 'Audience' },
            { s: 2, t: 'Content' },
            { s: 3, t: 'Launch' }
          ].map((s) => (
            <div key={s.s} className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${step >= s.s ? 'bg-[#075E54] text-white shadow-xl scale-110' : 'bg-gray-100 text-gray-400'}`}>
                {s.s}
              </div>
              <span className={`text-sm font-bold ${step >= s.s ? 'text-[#075E54]' : 'text-gray-400'}`}>{s.t}</span>
              {s.s < 3 && <div className={`w-16 h-[2px] mx-4 transition-colors duration-500 ${step > s.s ? 'bg-emerald-500' : 'bg-gray-100'}`} />}
            </div>
          ))}
        </div>

        {step === 1 && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
            <div className="p-8 border-b bg-gray-50/50 flex justify-between items-center">
              <div>
                <span className="text-2xl font-black text-gray-900">{selectedIds.length}</span>
                <span className="ml-2 text-gray-500 font-medium">contacts selected</span>
              </div>
              <button 
                onClick={() => setSelectedIds(contacts.map(c => c._id))}
                className="text-sm font-bold text-[#075E54] hover:bg-emerald-50 px-4 py-2 rounded-full transition-colors"
              >
                Select All Contacts
              </button>
            </div>
            <div className="max-h-[30rem] overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {contacts.map((contact) => (
                <div 
                  key={contact._id} 
                  onClick={() => handleToggleSelect(contact._id)}
                  className={`p-5 rounded-xl border-2 transition-all cursor-pointer flex items-center gap-4 ${selectedIds.includes(contact._id) ? 'border-emerald-500 bg-emerald-50 shadow-md' : 'border-gray-50 hover:border-gray-200'}`}
                >
                  <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors ${selectedIds.includes(contact._id) ? 'bg-emerald-500 border-emerald-500' : 'border-gray-200'}`}>
                    {selectedIds.includes(contact._id) && <CheckCircle size={16} className="text-white" />}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-900">{contact.name || 'Unknown'}</div>
                    <div className="text-xs text-gray-400 font-mono">{contact.waId}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-8 border-t bg-gray-50/50 flex justify-end">
              <button 
                disabled={selectedIds.length === 0}
                onClick={() => setStep(2)}
                className="px-12 py-4 bg-[#075E54] text-white rounded-xl font-bold shadow-xl shadow-emerald-100 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
              >
                Proceed to Content
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-10 space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-4">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Message Body</label>
              <textarea 
                rows={8}
                placeholder="Type your broadcast message here..."
                className="w-full p-8 bg-gray-50 border-none rounded-xl focus:ring-4 focus:ring-emerald-500/10 outline-none text-gray-900 resize-none text-lg shadow-inner"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <div className="p-5 bg-emerald-50 text-emerald-800 rounded-xl flex items-start gap-4 text-sm leading-relaxed border border-emerald-100">
                <Info size={20} className="shrink-0 mt-0.5 text-emerald-600" />
                <span><strong>Pro Tip:</strong> Using the customer's name in the message significantly increases open rates. Ensure your Meta account has active balance for bulk sending.</span>
              </div>
            </div>
            <div className="flex justify-between pt-6">
              <button onClick={() => setStep(1)} className="px-10 py-4 text-gray-400 font-bold hover:text-gray-600 transition-colors">Go Back</button>
              <button 
                disabled={!message}
                onClick={() => setStep(3)}
                className="px-12 py-4 bg-[#075E54] text-white rounded-xl font-bold shadow-xl shadow-emerald-100 hover:scale-105 active:scale-95 transition-all"
              >
                Review Campaign
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-16 text-center space-y-10 animate-in zoom-in duration-500">
            <div className="w-32 h-32 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner ring-8 ring-emerald-50">
              <Zap size={56} className="animate-pulse" />
            </div>
            <div className="space-y-3">
              <h3 className="text-3xl font-black text-gray-900">Ready to Launch?</h3>
              <p className="text-gray-500 text-lg">Your broadcast will be sent to <span className="font-bold text-[#075E54]">{selectedIds.length} customers</span> immediately.</p>
            </div>
            <div className="bg-gray-50 p-8 rounded-xl max-w-xl mx-auto text-gray-600 italic border border-gray-100 text-sm leading-loose">
              "{message}"
            </div>
            <div className="flex gap-6 max-w-lg mx-auto pt-4">
              <button onClick={() => setStep(2)} className="flex-1 py-5 text-gray-400 font-bold hover:bg-gray-50 rounded-2xl transition-all">Edit Content</button>
              <button 
                disabled={loading}
                onClick={handleSend}
                className="flex-1 py-5 bg-[#075E54] text-white rounded-xl font-bold shadow-2xl shadow-emerald-200 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 text-lg"
              >
                {loading ? 'Processing...' : <><Send size={22} /> Blast Now</>}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
