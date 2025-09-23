'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Eye, EyeOff, UserPlus, LogIn, AlertCircle, CheckCircle } from 'lucide-react';

interface LoginForm {
  usernameOrEmail: string;
  password: string;
}

interface RegisterForm {
  fullName: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  role: string;
  assignedArea: string;
}

const userRoles = [
  { value: 'ASHA_WORKER', label: 'ASHA Worker' },
  { value: 'COMMUNITY_VOLUNTEER', label: 'Community Volunteer' },
  { value: 'CLINIC_STAFF', label: 'Clinic Staff' },
  { value: 'INCIDENT_REPORTER', label: 'General Public - Incident Reporter' }
];

function AuthComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';
  
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [otpStep, setOtpStep] = useState(false);
  const [otpData, setOtpData] = useState({ userId: '', email: '', maskedEmail: '' });
  const [otp, setOtp] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  const [loginForm, setLoginForm] = useState<LoginForm>({
    usernameOrEmail: '',
    password: ''
  });

  const [registerForm, setRegisterForm] = useState<RegisterForm>({
    fullName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    role: '',
    assignedArea: ''
  });

  // Clear message when switching between forms
  useEffect(() => {
    setMessage({ type: '', text: '' });
  }, [isLogin]);

  // Countdown effect for resend OTP
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm)
      });

      const data = await response.json();

      if (response.ok && data.requiresOTP) {
        setMessage({ type: 'success', text: data.message });
        setOtpData({ userId: data.userId, email: data.email, maskedEmail: data.maskedEmail });
        setOtpStep(true);
        setResendCooldown(60); // 60 seconds cooldown
      } else if (response.ok) {
        setMessage({ type: 'success', text: 'Login successful! Redirecting...' });
        setTimeout(() => {
          router.push(redirectTo);
        }, 1000);
      } else {
        setMessage({ type: 'error', text: data.message || 'Login failed' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: otpData.userId,
          email: otpData.email,
          otp: otp
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Login successful! Redirecting...' });
        setTimeout(() => {
          router.push(redirectTo);
        }, 1000);
      } else {
        setMessage({ type: 'error', text: data.error || 'Invalid OTP' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendCooldown > 0) return;
    
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch('/api/auth/generate-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: otpData.email,
          password: loginForm.password
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'New OTP sent to your email!' });
        setResendCooldown(60);
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to resend OTP' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    // Validation
    if (registerForm.password !== registerForm.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      setIsLoading(false);
      return;
    }

    if (registerForm.password.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters long' });
      setIsLoading(false);
      return;
    }

    if (!registerForm.role) {
      setMessage({ type: 'error', text: 'Please select a user role' });
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerForm)
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Registration successful! Logging you in...' });
        setTimeout(() => {
          router.push(redirectTo);
        }, 1000);
      } else {
        setMessage({ type: 'error', text: data.message || 'Registration failed' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl shadow-2xl overflow-hidden w-full max-w-md"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6 text-center">
          <h1 className="text-2xl font-bold text-white mb-2">
            {isLogin ? 'Welcome Back' : 'Join Our Community'}
          </h1>
          <p className="text-blue-100 text-sm">
            {isLogin 
              ? 'Sign in to access reporting features' 
              : 'Register to report incidents and manage alerts'
            }
          </p>
        </div>

        {/* Form Container */}
        <div className="p-8">
          {/* Toggle Buttons */}
          <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                isLogin
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <LogIn className="w-4 h-4 inline mr-2" />
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                !isLogin
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <UserPlus className="w-4 h-4 inline mr-2" />
              Register
            </button>
          </div>

          {/* Message Display */}
          {message.text && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-4 p-3 rounded-lg flex items-center ${
                message.type === 'success'
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}
            >
              {message.type === 'success' ? (
                <CheckCircle className="w-4 h-4 mr-2" />
              ) : (
                <AlertCircle className="w-4 h-4 mr-2" />
              )}
              <span className="text-sm">{message.text}</span>
            </motion.div>
          )}

          {/* Login Form */}
          {isLogin ? (
            otpStep ? (
              /* OTP Verification Form */
              <form onSubmit={handleOTPVerification} className="space-y-4">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      📧
                    </motion.div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Check Your Email</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    We've sent a 6-digit verification code to
                  </p>
                  <p className="font-medium text-blue-600">{otpData.maskedEmail}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Enter 6-Digit OTP
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-3 py-3 text-center text-2xl font-bold tracking-widest border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="000000"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading || otp.length !== 6}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {isLoading ? 'Verifying...' : 'Verify OTP'}
                </motion.button>

                <div className="flex items-center justify-between text-sm">
                  <button
                    type="button"
                    onClick={() => {
                      setOtpStep(false);
                      setOtp('');
                      setMessage({ type: '', text: '' });
                    }}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    ← Back to Login
                  </button>
                  
                  <div className="text-center">
                    {resendCooldown > 0 ? (
                      <span className="text-gray-500">
                        Resend in {resendCooldown}s
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResendOTP}
                        disabled={isLoading}
                        className="text-blue-600 hover:text-blue-800 disabled:opacity-50"
                      >
                        Resend OTP
                      </button>
                    )}
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                  <p className="text-xs text-blue-800">
                    💡 <strong>Tip:</strong> Check your spam folder if you don't see the email in your inbox.
                  </p>
                </div>
              </form>
            ) : (
              /* Login Credentials Form */
              <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username or Email
                </label>
                <input
                  type="text"
                  required
                  value={loginForm.usernameOrEmail}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, usernameOrEmail: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Enter username or email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginForm.password}
                    onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Enter password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Forgot Password?
                </button>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </motion.button>

              <p className="text-center text-sm text-gray-600">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setIsLogin(false)}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Register here
                </button>
              </p>
            </form>
            )
          ) : (
            /* Register Form */
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={registerForm.fullName}
                  onChange={(e) => setRegisterForm(prev => ({ ...prev, fullName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  required
                  value={registerForm.username}
                  onChange={(e) => setRegisterForm(prev => ({ ...prev, username: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Choose a username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  User Role
                </label>
                <select
                  required
                  value={registerForm.role}
                  onChange={(e) => setRegisterForm(prev => ({ ...prev, role: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                >
                  <option value="">Select your role</option>
                  {userRoles.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
              </div>

              {(registerForm.role === 'ASHA_WORKER' || registerForm.role === 'COMMUNITY_VOLUNTEER') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Assigned Village/Area
                  </label>
                  <input
                    type="text"
                    value={registerForm.assignedArea}
                    onChange={(e) => setRegisterForm(prev => ({ ...prev, assignedArea: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Enter your assigned area"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={registerForm.password}
                    onChange={(e) => setRegisterForm(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Create a password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={registerForm.confirmPassword}
                    onChange={(e) => setRegisterForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="text-xs text-gray-600">
                By registering, you agree to our{' '}
                <a href="/privacy" className="text-blue-600 hover:text-blue-800">Privacy Policy</a>
                {' '}and{' '}
                <a href="/terms" className="text-blue-600 hover:text-blue-800">Terms of Service</a>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </motion.button>

              <p className="text-center text-sm text-gray-600">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setIsLogin(true)}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Login here
                </button>
              </p>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthComponent />
    </Suspense>
  );
}