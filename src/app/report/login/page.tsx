"use client";

import { useState } from "react";
import { Eye, EyeOff, User, Lock, Mail, Phone, MapPin, Shield, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ReportLoginPage() {
  const [activeTab, setActiveTab] = useState<'login' | 'registration'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Login form state
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
    role: "asha" as "asha" | "local-volunteer"
  });

  // Registration form state
  const [registrationData, setRegistrationData] = useState({
    fullName: "",
    email: "",
    phone: "",
    employeeId: "",
    role: "asha" as "asha" | "local-volunteer",
    district: "",
    block: "",
    village: "",
    password: "",
    confirmPassword: ""
  });

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    });
    setError("");
  };

  const handleRegistrationChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setRegistrationData({
      ...registrationData,
      [e.target.name]: e.target.value
    });
    setError("");
    setSuccess("");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch('/api/auth/report-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('reportAuth', JSON.stringify({
          token: data.token,
          role: data.role,
          username: data.username,
          name: data.name,
          expiresAt: data.expiresAt
        }));

        // Redirect to report dashboard
        window.location.href = '/report';
      } else {
        setError(data.error || 'Invalid credentials');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    // Validate passwords match
    if (registrationData.password !== registrationData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/report-register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Registration successful! Please wait for admin approval.");
        setRegistrationData({
          fullName: "",
          email: "",
          phone: "",
          employeeId: "",
          role: "asha",
          district: "",
          block: "",
          village: "",
          password: "",
          confirmPassword: ""
        });
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Tab Headers */}
          <div className="flex">
            <button
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-4 px-6 text-center font-semibold transition-all ${
                activeTab === 'login'
                  ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <User size={20} />
                Applicant Login
              </div>
            </button>
            <button
              onClick={() => setActiveTab('registration')}
              className={`flex-1 py-4 px-6 text-center font-semibold transition-all ${
                activeTab === 'registration'
                  ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Shield size={20} />
                Registration
              </div>
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            <AnimatePresence mode="wait">
              {activeTab === 'login' ? (
                <motion.div
                  key="login"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Health Worker Login</h2>
                    <p className="text-gray-600">Access the reporting system</p>
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleLogin} className="space-y-6">
                    {/* Role Selection */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Role
                      </label>
                      <select
                        name="role"
                        value={loginData.role}
                        onChange={handleLoginChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white font-medium"
                        required
                      >
                        <option value="asha">ASHA Worker</option>
                        <option value="local-volunteer">Local Volunteer</option>
                      </select>
                    </div>

                    {/* Username */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Username / Employee ID
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                          type="text"
                          name="username"
                          value={loginData.username}
                          onChange={handleLoginChange}
                          placeholder="Enter your username"
                          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-400 bg-white font-medium"
                          required
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={loginData.password}
                          onChange={handleLoginChange}
                          placeholder="Enter your password"
                          className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-400 bg-white font-medium"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        'Login to Report System'
                      )}
                    </button>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="registration"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">New Applicant Registration</h2>
                    <p className="text-gray-600">Register as ASHA Worker or Local Volunteer</p>
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                      {error}
                    </div>
                  )}

                  {success && (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
                      <CheckCircle size={20} />
                      {success}
                    </div>
                  )}

                  <form onSubmit={handleRegistration} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Full Name */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          value={registrationData.fullName}
                          onChange={handleRegistrationChange}
                          placeholder="Enter your full name"
                          className="w-full px-4 py-3 border-2 border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 placeholder-gray-500 bg-white font-medium text-base"
                          required
                        />
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Email Address *
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                          <input
                            type="email"
                            name="email"
                            value={registrationData.email}
                            onChange={handleRegistrationChange}
                            placeholder="Enter your email"
                            className="w-full pl-12 pr-4 py-3 border-2 border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 placeholder-gray-500 bg-white font-medium text-base"
                            required
                          />
                        </div>
                      </div>

                      {/* Phone */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Phone Number *
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                          <input
                            type="tel"
                            name="phone"
                            value={registrationData.phone}
                            onChange={handleRegistrationChange}
                            placeholder="Enter your phone number"
                            className="w-full pl-12 pr-4 py-3 border-2 border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 placeholder-gray-500 bg-white font-medium text-base"
                            required
                          />
                        </div>
                      </div>

                      {/* Employee ID */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Employee/Volunteer ID *
                        </label>
                        <input
                          type="text"
                          name="employeeId"
                          value={registrationData.employeeId}
                          onChange={handleRegistrationChange}
                          placeholder="Enter your ID"
                          className="w-full px-4 py-3 border-2 border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 placeholder-gray-500 bg-white font-medium text-base"
                          required
                        />
                      </div>

                      {/* Role */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Role *
                        </label>
                        <select
                          name="role"
                          value={registrationData.role}
                          onChange={handleRegistrationChange}
                          className="w-full px-4 py-3 border-2 border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 bg-white font-medium text-base"
                          required
                        >
                          <option value="asha">ASHA Worker</option>
                          <option value="local-volunteer">Local Volunteer</option>
                        </select>
                      </div>

                      {/* District */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          District *
                        </label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                          <input
                            type="text"
                            name="district"
                            value={registrationData.district}
                            onChange={handleRegistrationChange}
                            placeholder="Enter your district"
                            className="w-full pl-12 pr-4 py-3 border-2 border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 placeholder-gray-500 bg-white font-medium text-base"
                            required
                          />
                        </div>
                      </div>

                      {/* Block */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Block *
                        </label>
                        <input
                          type="text"
                          name="block"
                          value={registrationData.block}
                          onChange={handleRegistrationChange}
                          placeholder="Enter your block"
                          className="w-full px-4 py-3 border-2 border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 placeholder-gray-500 bg-white font-medium text-base"
                          required
                        />
                      </div>

                      {/* Village */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Village/Area *
                        </label>
                        <input
                          type="text"
                          name="village"
                          value={registrationData.village}
                          onChange={handleRegistrationChange}
                          placeholder="Enter your village/area"
                          className="w-full px-4 py-3 border-2 border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 placeholder-gray-500 bg-white font-medium text-base"
                          required
                        />
                      </div>
                    </div>

                    {/* Password Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                      {/* Password */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Password *
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                          <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={registrationData.password}
                            onChange={handleRegistrationChange}
                            placeholder="Create a password"
                            className="w-full pl-12 pr-12 py-3 border-2 border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 placeholder-gray-500 bg-white font-medium text-base"
                            required
                            minLength={6}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                          </button>
                        </div>
                      </div>

                      {/* Confirm Password */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Confirm Password *
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            value={registrationData.confirmPassword}
                            onChange={handleRegistrationChange}
                            placeholder="Confirm your password"
                            className="w-full pl-12 pr-12 py-3 border-2 border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 placeholder-gray-500 bg-white font-medium text-base"
                            required
                            minLength={6}
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-8"
                    >
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        'Submit Registration Request'
                      )}
                    </button>

                    <p className="text-center text-sm text-gray-600 mt-4">
                      Your registration will be reviewed by an administrator. You will be notified once approved.
                    </p>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}