'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import { useAuth } from '@/contexts/AuthContext';
import { Shield, Activity, MapPin, AlertTriangle, Users, LogOut, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user: auth0User, isLoading: auth0Loading } = useUser();
  const { user, isLoading } = useAuth();

  if (isLoading || auth0Loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!auth0User) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-xl">
          <Shield className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-6">Please login to access the dashboard.</p>
          <a
            href="/auth/login"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
          >
            Login with Auth0
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {auth0User.picture && (
                <img
                  src={auth0User.picture}
                  alt={auth0User.name || 'User'}
                  className="w-16 h-16 rounded-full border-4 border-blue-100"
                />
              )}
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Welcome, {auth0User.name || user?.fullName || 'User'}!
                </h1>
                <p className="text-gray-600">{auth0User.email}</p>
                {user?.role && (
                  <span className="inline-block mt-1 px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                    {user.role.replace('_', ' ')}
                  </span>
                )}
              </div>
            </div>
            <a
              href="/auth/logout"
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl transition-colors"
            >
              <LogOut size={18} />
              Logout
            </a>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Activity className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Active Incidents</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-100 rounded-xl">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">High Risk Zones</p>
                <p className="text-2xl font-bold text-gray-900">5</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <MapPin className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Areas Monitored</p>
                <p className="text-2xl font-bold text-gray-900">28</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-xl">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Reports Today</p>
                <p className="text-2xl font-bold text-gray-900">34</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/report"
              className="flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
            >
              <AlertTriangle className="w-6 h-6 text-blue-600" />
              <span className="font-medium text-gray-900">Report Incident</span>
            </Link>
            
            <Link
              href="/map"
              className="flex items-center gap-3 p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-colors"
            >
              <MapPin className="w-6 h-6 text-green-600" />
              <span className="font-medium text-gray-900">View Map</span>
            </Link>
            
            <Link
              href="/diseases"
              className="flex items-center gap-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors"
            >
              <Activity className="w-6 h-6 text-purple-600" />
              <span className="font-medium text-gray-900">Disease Info</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
