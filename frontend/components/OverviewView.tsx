'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { MessageSquare, CheckCircle, Eye, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

interface Stats {
  totalMessages: number;
  deliveryRate: number;
  readRate: number;
  incomingCount: number;
  outgoingCount: number;
}

export default function OverviewView() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/analytics');
        setStats(data);
      } catch (err) {
        console.error('Failed to fetch analytics');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="p-8 text-gray-500">Loading analytics...</div>;

  const cards = [
    {
      title: 'Total Messages',
      value: stats?.totalMessages || 0,
      icon: <MessageSquare className="text-emerald-600" />,
      bg: 'bg-emerald-50',
      color: 'text-emerald-600'
    },
    {
      title: 'Delivery Rate',
      value: `${Math.round(stats?.deliveryRate || 0)}%`,
      icon: <CheckCircle className="text-green-600" />,
      bg: 'bg-green-50',
      color: 'text-green-600'
    },
    {
      title: 'Read Rate',
      value: `${Math.round(stats?.readRate || 0)}%`,
      icon: <Eye className="text-blue-600" />,
      bg: 'bg-blue-50',
      color: 'text-blue-600'
    }
  ];

  return (
    <div className="flex-1 h-full bg-gray-50 overflow-y-auto p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-500 mt-2">Track your WhatsApp engagement and delivery performance.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">{card.title}</p>
                <h3 className="text-2xl font-bold text-gray-900">{card.value}</h3>
              </div>
              <div className={`w-12 h-12 ${card.bg} rounded-xl flex items-center justify-center`}>
                {card.icon}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Traffic Breakdown */}
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Messaging Traffic</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                    <ArrowUpRight size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Outgoing</p>
                    <p className="text-xs text-gray-500">Sent by your team</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">{stats?.outgoingCount || 0}</p>
                  <p className="text-xs text-green-500 font-medium">Messages</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                    <ArrowDownLeft size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Incoming</p>
                    <p className="text-xs text-gray-500">Received from customers</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">{stats?.incomingCount || 0}</p>
                  <p className="text-xs text-blue-500 font-medium">Messages</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="pt-4">
                <div className="flex justify-between text-xs font-medium mb-2">
                  <span className="text-gray-500">Distribution</span>
                  <span className="text-emerald-600">
                    {Math.round(((stats?.outgoingCount || 0) / (stats?.totalMessages || 1)) * 100)}% Outgoing
                  </span>
                </div>
                <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden flex">
                  <div 
                    className="h-full bg-emerald-500" 
                    style={{ width: `${((stats?.outgoingCount || 0) / (stats?.totalMessages || 1)) * 100}%` }}
                  ></div>
                  <div 
                    className="h-full bg-green-500" 
                    style={{ width: `${((stats?.incomingCount || 0) / (stats?.totalMessages || 1)) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Tips Card */}
          <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 p-8 rounded-xl shadow-xl text-white relative overflow-hidden">
            <div className="relative z-10 space-y-4">
              <h3 className="text-xl font-bold">Campaign Optimization</h3>
              <p className="text-emerald-100 text-sm leading-relaxed">
                Your read rate is at {Math.round(stats?.readRate || 0)}%. Try using personalized templates and interactive buttons to increase engagement by up to 40%.
              </p>
              <button className="px-6 py-2 bg-white text-emerald-900 rounded-lg font-bold text-sm hover:bg-emerald-50 transition-colors">
                View Templates
              </button>
            </div>
            <div className="absolute -right-8 -bottom-8 opacity-10">
              <MessageSquare size={160} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
