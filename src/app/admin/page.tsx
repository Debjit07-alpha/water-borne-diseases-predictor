"use client";

import { useState } from "react";
import { Shield, Users, CheckCircle, XCircle, Eye } from "lucide-react";

interface Registration {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
}

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  
  // Mock registration data
  const [registrations, setRegistrations] = useState<Registration[]>([
    {
      id: "1",
      name: "Priya Sharma",
      email: "priya@health.gov.in",
      phone: "+91 9876543210",
      role: "ASHA Worker",
      status: "pending",
      date: "2025-09-22"
    },
    {
      id: "2", 
      name: "Raj Kumar",
      email: "raj@volunteer.org",
      phone: "+91 9123456789",
      role: "Local Volunteer",
      status: "pending", 
      date: "2025-09-21"
    }
  ]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (loginData.email === "debjitsaha069@gmail.com" && loginData.password === "12345678") {
            setIsLoggedIn(true);
        } else if (loginData.email === "biswasjaydeep51@gmail.com" && loginData.password === "12345678") {
            setIsLoggedIn(true);
        } else {
            alert("Invalid email or password. Please check your credentials.");
        }
    };

  const updateStatus = (id: string, status: 'approved' | 'rejected') => {
    setRegistrations(prev => 
      prev.map(reg => reg.id === id ? { ...reg, status } : reg)
    );
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="bg-white p-10 rounded-xl shadow-lg border border-gray-200 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
              <Shield className="text-white" size={32} />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Administrator Portal</h1>
            <p className="text-gray-600">Water-Borne Disease Prevention System</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Administrator Email
              </label>
              <input
                type="email"
                placeholder="Enter your admin email address"
                value={loginData.email}
                onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all bg-gray-50 text-gray-900"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter secure password"
                value={loginData.password}
                onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all bg-gray-50 text-gray-900"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold p-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Access Administrator Dashboard
            </button>
          </form>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-center text-xs text-gray-500">
              <Shield size={12} className="mr-1" />
              <span>Secure Administrative Access • Authorized Personnel Only</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const pendingCount = registrations.filter(r => r.status === 'pending').length;
  const approvedCount = registrations.filter(r => r.status === 'approved').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 mb-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center shadow-lg">
                <Shield className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Administrator Dashboard</h1>
                <p className="text-gray-600 mt-1">Water-Borne Disease Prevention • Registration Management System</p>
              </div>
            </div>
            <button
              onClick={() => setIsLoggedIn(false)}
              className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              🚪 Logout
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Registrations</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{registrations.length}</p>
                <p className="text-sm text-gray-500 mt-1">All applications</p>
              </div>
              <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="text-blue-600" size={28} />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Approved Users</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{approvedCount}</p>
                <p className="text-sm text-gray-500 mt-1">Active accounts</p>
              </div>
              <div className="w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="text-green-600" size={28} />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Pending Review</p>
                <p className="text-3xl font-bold text-yellow-600 mt-2">{pendingCount}</p>
                <p className="text-sm text-gray-500 mt-1">Awaiting approval</p>
              </div>
              <div className="w-14 h-14 bg-yellow-100 rounded-lg flex items-center justify-center">
                <XCircle className="text-yellow-600" size={28} />
              </div>
            </div>
          </div>
        </div>

        {/* Registrations List */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200">
          <div className="p-8 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="text-blue-600" size={20} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Registration Management</h2>
                <p className="text-gray-600">Review and manage user registration requests</p>
              </div>
            </div>
          </div>
          
          <div className="p-8">
            {registrations.length === 0 ? (
              <div className="text-center py-16">
                <Users className="mx-auto text-gray-300 mb-4" size={64} />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Registration Requests</h3>
                <p className="text-gray-500">All registration requests will appear here for review</p>
              </div>
            ) : (
              <div className="space-y-6">
                {registrations.map((reg) => (
                  <div key={reg.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-lg">{reg.name.charAt(0)}</span>
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-800">{reg.name}</h3>
                            <p className="text-sm text-gray-600 font-medium">{reg.role}</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center gap-2 text-gray-600">
                            <span className="text-blue-500">📧</span>
                            <span className="font-medium">Email:</span>
                            <span>{reg.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <span className="text-green-500">📱</span>
                            <span className="font-medium">Phone:</span>
                            <span>{reg.phone}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <span className="text-purple-500">📅</span>
                            <span className="font-medium">Applied:</span>
                            <span>{new Date(reg.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 ml-6">
                        <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                          reg.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                          reg.status === 'approved' ? 'bg-green-100 text-green-800 border border-green-200' :
                          'bg-red-100 text-red-800 border border-red-200'
                        }`}>
                          {reg.status === 'pending' && '⏳ Pending Review'}
                          {reg.status === 'approved' && '✅ Approved'}
                          {reg.status === 'rejected' && '❌ Rejected'}
                        </span>
                        
                        {reg.status === 'pending' && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => updateStatus(reg.id, 'approved')}
                              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold px-4 py-2 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2"
                            >
                              <CheckCircle size={16} />
                              Approve
                            </button>
                            <button
                              onClick={() => updateStatus(reg.id, 'rejected')}
                              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold px-4 py-2 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2"
                            >
                              <XCircle size={16} />
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
