'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { UserPlus, Search, Tag, Mail, MapPin, StickyNote, X } from 'lucide-react';

export default function ContactsView() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkData, setBulkData] = useState('');
  const [newContact, setNewContact] = useState({ name: '', waId: '', email: '', address: '', notes: '', tags: '' });

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

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/contacts', {
        ...newContact,
        tags: newContact.tags.split(',').map(t => t.trim()).filter(t => t)
      });
      setShowAddModal(false);
      fetchContacts();
      setNewContact({ name: '', waId: '', email: '', address: '', notes: '', tags: '' });
    } catch (err) {
      alert('Failed to add contact');
    }
  };

  const handleBulkImport = async () => {
    const lines = bulkData.split('\n').filter(l => l.trim());
    const contactsToImport = lines.map(line => {
      const [name, waId] = line.split(',').map(s => s.trim());
      return { name, waId };
    }).filter(c => c.waId);

    if (contactsToImport.length === 0) {
      alert('No valid contacts found. Use format: Name, Number');
      return;
    }

    try {
      await api.post('/contacts/bulk', { contacts: contactsToImport });
      alert(`Imported ${contactsToImport.length} contacts!`);
      setShowBulkModal(false);
      setBulkData('');
      fetchContacts();
    } catch (err) {
      alert('Failed to import contacts');
    }
  };

  const filtered = contacts.filter(c => 
    (c.name || '').toLowerCase().includes(search.toLowerCase()) || 
    c.waId.includes(search)
  );

  return (
    <div className="flex-1 h-full bg-gray-50 flex flex-col overflow-hidden">
      <div className="p-8 space-y-6 flex-1 overflow-y-auto">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Contact CRM</h1>
            <p className="text-gray-500">Manage your customer database and audience segments.</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setShowBulkModal(true)}
              className="flex items-center gap-2 px-6 py-3 border-2 border-[#075E54] text-[#075E54] rounded-xl font-bold hover:bg-emerald-50 transition-all shadow-sm"
            >
              Bulk Import
            </button>
            <button 
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-[#075E54] text-white rounded-xl font-bold hover:bg-[#128C7E] transition-all shadow-lg"
            >
              <UserPlus size={20} />
              New Customer
            </button>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search by name or phone number..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none shadow-sm text-gray-900"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-[10px] uppercase tracking-widest font-bold border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Customer Name</th>
                <th className="px-6 py-4">WhatsApp Number</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((contact) => (
                <tr key={contact._id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold border border-emerald-200 shadow-sm">
                        {contact.name?.charAt(0).toUpperCase() || '?'}
                      </div>
                      <div className="font-bold text-gray-900">{contact.name || 'Unknown User'}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-lg text-[13px] font-mono font-medium text-gray-600">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" className="w-3 h-3" alt="WA" />
                      {contact.waId}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-lg text-[10px] font-bold uppercase tracking-tight">Verified</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="px-4 py-1.5 border border-gray-200 rounded-lg text-xs font-bold text-gray-600 hover:bg-[#075E54] hover:text-white transition-all shadow-sm">
                      Chat Now
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="bg-[#075E54] p-8 text-white flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-bold">New Customer</h3>
                <p className="text-emerald-100/70 text-sm mt-1">Add a single contact to your database.</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleAdd} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                <input required className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-gray-900" value={newContact.name} onChange={e => setNewContact({...newContact, name: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">WhatsApp Number</label>
                <input required placeholder="e.g. 919876543210" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-gray-900" value={newContact.waId} onChange={e => setNewContact({...newContact, waId: e.target.value})} />
              </div>

              <div className="flex gap-4 pt-6">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-4 text-gray-400 font-bold hover:text-gray-600 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 py-4 bg-[#075E54] text-white rounded-2xl font-bold shadow-xl shadow-emerald-100 hover:bg-[#128C7E] transition-all">Save Contact</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Bulk Import Modal */}
      {showBulkModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="bg-[#075E54] p-8 text-white flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-bold">Bulk Import Contacts</h3>
                <p className="text-emerald-100/70 text-sm mt-1">Paste your list to import hundreds of contacts at once.</p>
              </div>
              <button onClick={() => setShowBulkModal(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Format: Name, Number (one per line)</label>
                <textarea 
                  rows={10} 
                  placeholder={"John Doe, 919876543210\nJane Smith, 919988776655"}
                  className="w-full px-6 py-6 bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-emerald-500/10 outline-none text-gray-900 font-mono text-sm shadow-inner" 
                  value={bulkData} 
                  onChange={e => setBulkData(e.target.value)} 
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowBulkModal(false)} className="flex-1 py-4 text-gray-400 font-bold hover:text-gray-600 transition-colors">Cancel</button>
                <button 
                  onClick={handleBulkImport}
                  className="flex-1 py-4 bg-[#075E54] text-white rounded-xl font-bold shadow-xl shadow-emerald-100 hover:scale-105 transition-all"
                >
                  Start Import Process
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
