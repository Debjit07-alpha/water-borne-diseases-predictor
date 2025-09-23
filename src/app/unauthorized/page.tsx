import Link from 'next/link';
import { AlertTriangle, ArrowLeft, ShieldX } from 'lucide-react';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
        <div className="mb-6">
          <ShieldX className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600">
            You don't have permission to access this page. Please contact your administrator if you believe this is an error.
          </p>
        </div>

        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-center justify-center mb-2">
              <AlertTriangle className="w-5 h-5 text-amber-600 mr-2" />
              <span className="text-sm font-medium text-amber-800">Insufficient Permissions</span>
            </div>
            <p className="text-xs text-amber-700">
              This page requires special permissions that your account doesn't have.
            </p>
          </div>

          <div className="flex space-x-3">
            <Link
              href="/"
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Home
            </Link>
            <Link
              href="/auth"
              className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Switch Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}