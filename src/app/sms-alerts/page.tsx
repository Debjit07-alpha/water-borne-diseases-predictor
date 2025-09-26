"use client";

import { useState, useEffect } from "react";
import { Send, Users, MapPin, Clock, AlertTriangle, CheckCircle, MessageSquare, TrendingUp, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import ProtectedRoute from "@/components/ProtectedRoute";

interface SMSResponse {
  id: string;
  phone: string;
  message: string;
  timestamp: Date;
  parsedData: {
    cases?: number;
    status: 'no_cases' | 'cases_reported' | 'emergency';
    symptoms?: string[];
    urgency?: 'low' | 'medium' | 'high';
  };
}

interface SMSAlert {
  id: string;
  diseaseType: string;
  severity: 'Mild' | 'Moderate' | 'Severe';
  affectedCount: number;
  location: string;
  timestamp: Date;
  actionRequired: string;
  recipients: string[];
  status: 'draft' | 'sent' | 'delivered' | 'responded';
  responses?: SMSResponse[];
}

function SMSAlertsPageContent() {
  const [alerts, setAlerts] = useState<SMSAlert[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<SMSAlert | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'alerts' | 'responses'>('alerts');
  
  // Poll for new responses every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (alerts.length > 0) {
        // Poll for new responses for each alert
        alerts.forEach(async (alert) => {
          if (alert.status === 'sent') {
            try {
              const response = await fetch(`/api/sms?alertId=${alert.id}`);
              const data = await response.json();
              if (data.success && data.data.length > 0) {
                // Update alert with new responses
                setAlerts(prev => prev.map(a => 
                  a.id === alert.id 
                    ? { ...a, responses: data.data, status: 'responded' as const }
                    : a
                ));
              }
            } catch (error) {
              console.error('Error polling responses:', error);
            }
          }
        });
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [alerts]);

  // Add some mock responses for demo
  useEffect(() => {
    if (alerts.length > 0) {
      setTimeout(() => {
        const alertWithResponses = alerts[0];
        if (alertWithResponses && !alertWithResponses.responses?.length) {
          const mockResponses: SMSResponse[] = [
            {
              id: '1',
              phone: '+91-9876543210',
              message: '2 cases of diarrhea in our household, children affected',
              timestamp: new Date(Date.now() - 15 * 60 * 1000),
              parsedData: {
                cases: 2,
                status: 'cases_reported',
                symptoms: ['diarrhea'],
                urgency: 'medium'
              }
            },
            {
              id: '2',
              phone: '+91-9876543211',
              message: 'No cases reported, all healthy',
              timestamp: new Date(Date.now() - 10 * 60 * 1000),
              parsedData: {
                cases: 0,
                status: 'no_cases',
                urgency: 'low'
              }
            },
            {
              id: '3',
              phone: '+91-9876543212',
              message: 'Emergency! 5 people very sick with fever and vomiting',
              timestamp: new Date(Date.now() - 5 * 60 * 1000),
              parsedData: {
                cases: 5,
                status: 'emergency',
                symptoms: ['fever', 'vomiting'],
                urgency: 'high'
              }
            }
          ];
          
          setAlerts(prev => prev.map(alert => 
            alert.id === alertWithResponses.id 
              ? { ...alert, responses: mockResponses, status: 'responded' }
              : alert
          ));
        }
      }, 3000);
    }
  }, [alerts.length]);
  
  // Form state
  const [formData, setFormData] = useState({
    diseaseType: '',
    severity: 'Mild' as 'Mild' | 'Moderate' | 'Severe',
    affectedCount: 1,
    location: '',
    actionRequired: '',
    recipients: '',
    customMessage: ''
  });

  const diseaseOptions = [
    'Diarrhea',
    'Fever',
    'Jaundice-like symptoms',
    'Vomiting',
    'Abdominal pain',
    'Dehydration',
    'Cholera symptoms',
    'Typhoid symptoms',
    'Hepatitis A symptoms',
    'Other'
  ];

  const severityColors = {
    Mild: 'bg-yellow-100 text-yellow-800',
    Moderate: 'bg-orange-100 text-orange-800',
    Severe: 'bg-red-100 text-red-800'
  };

  const responseStatusColors = {
    no_cases: 'bg-green-100 text-green-800',
    cases_reported: 'bg-yellow-100 text-yellow-800',
    emergency: 'bg-red-100 text-red-800'
  };

  const urgencyColors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800'
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const recipientList = formData.recipients.split(',').map(r => r.trim()).filter(r => r);
      
      // Generate SMS message
      const smsMessage = generateSMSMessage(formData);
      
      // Create alert object
      const newAlert: SMSAlert = {
        id: Date.now().toString(),
        diseaseType: formData.diseaseType,
        severity: formData.severity,
        affectedCount: formData.affectedCount,
        location: formData.location,
        timestamp: new Date(),
        actionRequired: formData.actionRequired,
        recipients: recipientList,
        status: 'sent'
      };

      // Send SMS via API
      const response = await fetch('/api/sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: smsMessage,
          recipients: recipientList,
          alertData: newAlert
        })
      });

      if (response.ok) {
        setAlerts(prev => [newAlert, ...prev]);
        setShowForm(false);
        setFormData({
          diseaseType: '',
          severity: 'Mild',
          affectedCount: 1,
          location: '',
          actionRequired: '',
          recipients: '',
          customMessage: ''
        });
      } else {
        throw new Error('Failed to send SMS');
      }
    } catch (error) {
      console.error('Error sending SMS:', error);
      alert('Failed to send SMS alert. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const generateSMSMessage = (data: typeof formData): string => {
    const timestamp = new Date().toLocaleString();
    return `🏥 HEALTH ALERT
Disease: ${data.diseaseType}
Severity: ${data.severity}
Affected: ${data.affectedCount} person(s)
Location: ${data.location}
Time: ${timestamp}

Action Required: ${data.actionRequired}

${data.customMessage ? `Note: ${data.customMessage}` : ''}

Reply with your household status or additional cases.
- Community Health System`;
  };

  // Function to generate Google Maps URL from location
  const generateGoogleMapsURL = (location: string): string => {
    if (!location.trim()) {
      return '';
    }
    
    // Clean and encode the location for URL
    const encodedLocation = encodeURIComponent(location.trim());
    
    // Generate Google Maps search URL
    return `https://www.google.com/maps/search/?api=1&query=${encodedLocation}`;
  };

  // Function to open location in Google Maps
  const openInMap = () => {
    if (!formData.location.trim()) {
      alert('Please enter a location first');
      return;
    }
    
    const mapsURL = generateGoogleMapsURL(formData.location);
    window.open(mapsURL, '_blank', 'noopener,noreferrer');
  };

  const getAllResponses = (): SMSResponse[] => {
    return alerts.reduce((allResponses: SMSResponse[], alert) => {
      if (alert.responses) {
        return [...allResponses, ...alert.responses];
      }
      return allResponses;
    }, []).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  };

  const getResponseSummary = () => {
    const allResponses = getAllResponses();
    const totalCases = allResponses.reduce((sum, response) => sum + (response.parsedData.cases || 0), 0);
    const emergencies = allResponses.filter(r => r.parsedData.status === 'emergency').length;
    const responseRate = alerts.length > 0 ? Math.round((allResponses.length / alerts.reduce((sum, alert) => sum + alert.recipients.length, 0)) * 100) : 0;
    
    return { totalCases, emergencies, responseRate, totalResponses: allResponses.length };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl font-extrabold text-white flex items-center gap-4 font-heading-serif">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="p-2 bg-white/20 rounded-full backdrop-blur-sm"
                >
                  <Send className="text-white" size={36} />
                </motion.div>
                SMS Health Alerts
              </h1>
              <p className="mt-3 text-blue-100 text-lg">
                Send configurable SMS alerts to community members for health data collection and early warning
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="mb-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg border border-indigo-100 overflow-hidden"
          >
            <nav className="flex">
              <motion.button
                onClick={() => setActiveTab('alerts')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex-1 py-4 px-6 font-medium text-sm transition-all duration-300 ${
                  activeTab === 'alerts'
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600'
                }`}
              >
                <div className="flex items-center justify-center gap-3">
                  <Send size={18} />
                  <span className="font-semibold">SMS Alerts</span>
                  <motion.span 
                    whileHover={{ scale: 1.1 }}
                    className={`px-3 py-1 text-xs rounded-full font-bold ${
                      activeTab === 'alerts' 
                        ? 'bg-white/20 text-white' 
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {alerts.length}
                  </motion.span>
                </div>
              </motion.button>
              <motion.button
                onClick={() => setActiveTab('responses')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex-1 py-4 px-6 font-medium text-sm transition-all duration-300 ${
                  activeTab === 'responses'
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 hover:text-green-600'
                }`}
              >
                <div className="flex items-center justify-center gap-3">
                  <MessageSquare size={18} />
                  <span className="font-semibold">Community Responses</span>
                  <motion.span 
                    whileHover={{ scale: 1.1 }}
                    className={`px-3 py-1 text-xs rounded-full font-bold ${
                      activeTab === 'responses' 
                        ? 'bg-white/20 text-white' 
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {alerts.reduce((sum, alert) => sum + (alert.responses?.length || 0), 0)}
                  </motion.span>
                </div>
              </motion.button>
            </nav>
          </motion.div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl shadow-xl border border-blue-200 text-white overflow-hidden relative"
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-100 font-medium">Total Alerts</p>
                  <p className="text-3xl font-bold text-white">{alerts.length}</p>
                </div>
                <motion.div
                  whileHover={{ rotate: 15, scale: 1.1 }}
                  className="p-3 bg-white/20 rounded-full"
                >
                  <Send className="text-white" size={24} />
                </motion.div>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-gradient-to-br from-orange-500 to-red-500 p-6 rounded-xl shadow-xl border border-orange-200 text-white overflow-hidden relative"
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-orange-100 font-medium">Reported Cases</p>
                  <p className="text-3xl font-bold text-white">
                    {getResponseSummary().totalCases}
                  </p>
                </div>
                <motion.div
                  whileHover={{ rotate: 15, scale: 1.1 }}
                  className="p-3 bg-white/20 rounded-full"
                >
                  <Users className="text-white" size={24} />
                </motion.div>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-gradient-to-br from-red-500 to-pink-600 p-6 rounded-xl shadow-xl border border-red-200 text-white overflow-hidden relative"
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-red-100 font-medium">Emergencies</p>
                  <p className="text-3xl font-bold text-white">
                    {getResponseSummary().emergencies}
                  </p>
                </div>
                <motion.div
                  whileHover={{ rotate: 15, scale: 1.1 }}
                  className="p-3 bg-white/20 rounded-full"
                >
                  <AlertTriangle className="text-white" size={24} />
                </motion.div>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-gradient-to-br from-green-500 to-emerald-600 p-6 rounded-xl shadow-xl border border-green-200 text-white overflow-hidden relative"
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-100 font-medium">Response Rate</p>
                  <p className="text-3xl font-bold text-white">
                    {getResponseSummary().responseRate}%
                  </p>
                </div>
                <motion.div
                  whileHover={{ rotate: 15, scale: 1.1 }}
                  className="p-3 bg-white/20 rounded-full"
                >
                  <TrendingUp className="text-white" size={24} />
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'alerts' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* New Alert Form */}
            <div className="lg:col-span-1">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-xl border border-blue-100 p-6 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <span className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg text-white">
                      ✉️
                    </span>
                    Create New Alert
                  </h2>
                  <motion.button
                    onClick={() => setShowForm(!showForm)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-2 rounded-xl text-sm font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    {showForm ? '❌ Cancel' : '➕ New Alert'}
                  </motion.button>
                </div>

                {showForm && (
                  <motion.form
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    onSubmit={handleSubmit}
                    className="space-y-4"
                  >
                    {/* Disease Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Disease/Symptom Type
                      </label>
                      <motion.select
                        value={formData.diseaseType}
                        onChange={(e) => setFormData(prev => ({ ...prev, diseaseType: e.target.value }))}
                        whileFocus={{ scale: 1.02 }}
                        className="w-full border-2 border-blue-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 bg-gradient-to-r from-white to-blue-50"
                        required
                      >
                        <option value="">Select disease/symptom</option>
                        {diseaseOptions.map(disease => (
                          <option key={disease} value={disease}>{disease}</option>
                        ))}
                      </motion.select>
                    </div>

                    {/* Severity */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Severity
                      </label>
                      <motion.select
                        value={formData.severity}
                        onChange={(e) => setFormData(prev => ({ ...prev, severity: e.target.value as any }))}
                        whileFocus={{ scale: 1.02 }}
                        className="w-full border-2 border-orange-200 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-300 bg-gradient-to-r from-white to-orange-50"
                      >
                        <option value="Mild">🟡 Mild</option>
                        <option value="Moderate">🟠 Moderate</option>
                        <option value="Severe">🔴 Severe</option>
                      </motion.select>
                    </div>

                    {/* Open in Map Button - Shows after severity is selected */}
                    {formData.severity && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-5 shadow-lg"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-bold text-blue-900 flex items-center gap-2">
                              🗺️ Location Mapping
                            </h4>
                            <p className="text-xs text-blue-700 mt-1">
                              View alert location on map for better coordination
                            </p>
                          </div>
                          <motion.button
                            type="button"
                            onClick={openInMap}
                            disabled={!formData.location.trim()}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 shadow-lg hover:shadow-xl"
                          >
                            <MapPin size={16} />
                            <ExternalLink size={14} />
                            Open in Map
                          </motion.button>
                        </div>
                        {!formData.location.trim() && (
                          <motion.p 
                            animate={{ opacity: [0.7, 1, 0.7] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="text-xs text-blue-600 mt-3 font-medium"
                          >
                            💡 Enter a location below to enable map view
                          </motion.p>
                        )}
                      </motion.div>
                    )}

                    {/* Affected Count */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Number of Affected Individuals
                      </label>
                      <motion.input
                        type="number"
                        min="1"
                        value={formData.affectedCount}
                        onChange={(e) => setFormData(prev => ({ ...prev, affectedCount: parseInt(e.target.value) }))}
                        whileFocus={{ scale: 1.02 }}
                        className="w-full border-2 border-red-200 rounded-xl px-4 py-3 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all duration-300 bg-gradient-to-r from-white to-red-50"
                        required
                      />
                    </div>

                    {/* Location */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Location/Village
                      </label>
                      <div className="relative">
                        <motion.input
                          type="text"
                          value={formData.location}
                          onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                          placeholder="Enter village name, landmark, or address"
                          whileFocus={{ scale: 1.02 }}
                          className="w-full border-2 border-green-200 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300 bg-gradient-to-r from-white to-green-50"
                          required
                        />
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-green-500"
                        >
                          <MapPin size={16} />
                        </motion.div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        📍 Be specific (e.g., "Village Name, District" or "Near Landmark")
                      </p>
                    </div>

                    {/* Action Required */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Action Required
                      </label>
                      <motion.textarea
                        value={formData.actionRequired}
                        onChange={(e) => setFormData(prev => ({ ...prev, actionRequired: e.target.value }))}
                        placeholder="e.g., Report to clinic if symptoms persist"
                        rows={3}
                        whileFocus={{ scale: 1.02 }}
                        className="w-full border-2 border-purple-200 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300 bg-gradient-to-r from-white to-purple-50 resize-none"
                        required
                      />
                    </div>

                    {/* Recipients */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Recipients (Phone Numbers)
                      </label>
                      <motion.textarea
                        value={formData.recipients}
                        onChange={(e) => setFormData(prev => ({ ...prev, recipients: e.target.value }))}
                        placeholder="📱 Enter phone numbers separated by commas (e.g., +91-9876543210, +91-9876543211)"
                        rows={2}
                        whileFocus={{ scale: 1.02 }}
                        className="w-full border-2 border-indigo-200 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300 bg-gradient-to-r from-white to-indigo-50 resize-none"
                        required
                      />
                    </div>

                    {/* Custom Message */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Additional Message (Optional)
                      </label>
                      <motion.textarea
                        value={formData.customMessage}
                        onChange={(e) => setFormData(prev => ({ ...prev, customMessage: e.target.value }))}
                        placeholder="💬 Additional instructions or notes (optional)"
                        rows={2}
                        whileFocus={{ scale: 1.02 }}
                        className="w-full border-2 border-teal-200 rounded-xl px-4 py-3 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all duration-300 bg-gradient-to-r from-white to-teal-50 resize-none"
                      />
                    </div>

                    {/* Preview Message */}
                    {formData.diseaseType && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-2xl border-2 border-blue-200 shadow-lg"
                      >
                        <p className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                          📱 SMS Preview:
                        </p>
                        <motion.div 
                          whileHover={{ scale: 1.02 }}
                          className="text-xs bg-gradient-to-r from-white to-gray-50 p-4 rounded-xl border-2 border-gray-200 shadow-inner font-mono leading-relaxed"
                        >
                          <pre className="whitespace-pre-wrap text-gray-800">
                            {generateSMSMessage(formData)}
                          </pre>
                        </motion.div>
                        <p className="text-xs text-blue-600 mt-2 font-medium">
                          ✅ Message ready to send to {formData.recipients.split(',').filter(r => r.trim()).length} recipients
                        </p>
                      </motion.div>
                    )}

                    <motion.button
                      type="submit"
                      disabled={isLoading}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 font-medium shadow-lg hover:shadow-xl"
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <Send size={18} />
                          <span>Send SMS Alert</span>
                        </>
                      )}
                    </motion.button>
                  </motion.form>
                )}
              </motion.div>
            </div>

            {/* Alert History */}
            <div className="lg:col-span-2">
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
                className="bg-gradient-to-br from-white to-purple-50 rounded-2xl shadow-xl border border-purple-100 overflow-hidden"
              >
                <div className="p-6 bg-gradient-to-r from-purple-500 to-pink-600 text-white">
                  <h2 className="text-xl font-bold flex items-center gap-3">
                    <span className="p-2 bg-white/20 rounded-lg">
                      📋
                    </span>
                    Recent Alerts
                  </h2>
                </div>
                
                <div className="divide-y max-h-96 overflow-y-auto">
                  {alerts.length === 0 ? (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 }}
                      className="p-12 text-center"
                    >
                      <motion.div
                        animate={{ 
                          y: [0, -10, 0],
                          rotateY: [0, 180, 360]
                        }}
                        transition={{ 
                          duration: 3,
                          repeat: Infinity,
                          repeatType: "reverse"
                        }}
                        className="mx-auto mb-6 p-4 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full w-20 h-20 flex items-center justify-center"
                      >
                        <Send className="text-purple-600" size={32} />
                      </motion.div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">No Alerts Yet</h3>
                      <p className="text-gray-600">Create your first SMS alert to get started with community health monitoring.</p>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="mt-4 text-sm text-purple-600 font-medium"
                      >
                        ✨ Click "New Alert" to begin
                      </motion.div>
                    </motion.div>
                  ) : (
                    alerts.map((alert, index) => (
                      <motion.div
                        key={alert.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02, y: -2 }}
                        className="p-6 border-b border-purple-100 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-300 cursor-pointer"
                        onClick={() => setSelectedAlert(alert)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <motion.span 
                                whileHover={{ scale: 1.05 }}
                                className="font-bold text-lg bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
                              >
                                {alert.diseaseType}
                              </motion.span>
                              <motion.span 
                                whileHover={{ scale: 1.1 }}
                                className={`px-3 py-1 text-xs rounded-full font-bold ${severityColors[alert.severity]} shadow-sm`}
                              >
                                {alert.severity}
                              </motion.span>
                              {alert.responses?.some(r => r.parsedData.status === 'emergency') && (
                                <motion.span 
                                  whileHover={{ scale: 1.1 }}
                                  animate={{ 
                                    boxShadow: ["0 0 0 0 rgba(239, 68, 68, 0.7)", "0 0 0 10px rgba(239, 68, 68, 0)", "0 0 0 0 rgba(239, 68, 68, 0)"]
                                  }}
                                  transition={{ duration: 1.5, repeat: Infinity }}
                                  className="px-3 py-1 text-xs rounded-full bg-red-100 text-red-800 font-bold shadow-lg"
                                >
                                  ⚠️ Emergency Responses
                                </motion.span>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-6 text-sm mb-3">
                              <motion.div 
                                whileHover={{ scale: 1.05 }}
                                className="flex items-center gap-2 bg-blue-100 px-3 py-1 rounded-full"
                              >
                                <Users size={14} className="text-blue-600" />
                                <span className="font-medium text-blue-800">{alert.affectedCount} affected</span>
                              </motion.div>
                              <motion.div 
                                whileHover={{ scale: 1.05 }}
                                className="flex items-center gap-2 bg-green-100 px-3 py-1 rounded-full"
                              >
                                <MapPin size={14} className="text-green-600" />
                                <span className="font-medium text-green-800">{alert.location}</span>
                              </motion.div>
                              <motion.div 
                                whileHover={{ scale: 1.05 }}
                                className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full"
                              >
                                <Clock size={14} className="text-gray-600" />
                                <span className="font-medium text-gray-800">{alert.timestamp.toLocaleString()}</span>
                              </motion.div>
                            </div>
                            
                            <motion.div
                              whileHover={{ scale: 1.01 }}
                              className="bg-gradient-to-r from-gray-50 to-purple-50 p-3 rounded-lg mb-3 border border-purple-100"
                            >
                              <p className="text-sm text-gray-800 font-medium">{alert.actionRequired}</p>
                            </motion.div>
                            
                            <div className="flex items-center gap-4 text-xs">
                              <motion.span 
                                whileHover={{ scale: 1.05 }}
                                className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full font-medium"
                              >
                                📤 Sent to {alert.recipients.length} recipient(s)
                              </motion.span>
                              {alert.responses && alert.responses.length > 0 && (
                                <motion.span 
                                  whileHover={{ scale: 1.05 }}
                                  className="bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium"
                                >
                                  💬 {alert.responses.length} response(s)
                                </motion.span>
                              )}
                            </div>
                          </div>
                          
                          {/* Open in Map button for existing alerts */}
                          <div className="ml-4">
                            <motion.button
                              onClick={(e) => {
                                e.stopPropagation();
                                const mapsURL = generateGoogleMapsURL(alert.location);
                                window.open(mapsURL, '_blank', 'noopener,noreferrer');
                              }}
                              whileHover={{ scale: 1.1, rotate: 5 }}
                              whileTap={{ scale: 0.95 }}
                              className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 shadow-lg hover:shadow-xl"
                              title="View location on Google Maps"
                            >
                              <MapPin size={14} />
                              <ExternalLink size={12} />
                              <span>Map</span>
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        ) : (
          /* Responses View */
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            <div className="bg-gradient-to-br from-white to-emerald-50 rounded-2xl shadow-xl border border-emerald-100 overflow-hidden">
              <div className="p-6 bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  <motion.span 
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className="p-2 bg-white/20 rounded-lg"
                  >
                    📊
                  </motion.span>
                  Community Response Tracking
                </h2>
                <p className="text-sm text-emerald-100 mt-2">Real-time SMS responses from community members</p>
              </div>
              
              <div className="divide-y max-h-96 overflow-y-auto">
                {getAllResponses().length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="p-12 text-center"
                  >
                    <motion.div
                      animate={{ 
                        scale: [1, 1.1, 1],
                        rotate: [0, -5, 5, 0]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "reverse"
                      }}
                      className="mx-auto mb-6 p-4 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full w-20 h-20 flex items-center justify-center"
                    >
                      <MessageSquare className="text-emerald-600" size={32} />
                    </motion.div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Awaiting Responses</h3>
                    <p className="text-gray-600">Community responses will appear here in real-time once SMS alerts are sent.</p>
                    <motion.div
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="mt-4 text-sm text-emerald-600 font-medium"
                    >
                      📱 Listening for incoming messages...
                    </motion.div>
                  </motion.div>
                ) : (
                  getAllResponses().map((response, index) => (
                    <motion.div
                      key={response.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02, y: -2 }}
                      className="p-6 border-b border-emerald-100 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 transition-all duration-300"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <motion.span 
                              whileHover={{ scale: 1.05 }}
                              className="font-semibold text-gray-900 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent"
                            >
                              {response.phone}
                            </motion.span>
                            <motion.span 
                              whileHover={{ scale: 1.1 }}
                              className={`px-3 py-1 text-xs rounded-full font-bold ${responseStatusColors[response.parsedData.status]} shadow-sm`}
                            >
                              {response.parsedData.status.replace('_', ' ').toUpperCase()}
                            </motion.span>
                            {response.parsedData.urgency && (
                              <motion.span 
                                whileHover={{ scale: 1.1 }}
                                className={`px-3 py-1 text-xs rounded-full font-bold ${urgencyColors[response.parsedData.urgency]} shadow-sm`}
                              >
                                {response.parsedData.urgency.toUpperCase()} PRIORITY
                              </motion.span>
                            )}
                          </div>
                          
                          <motion.div 
                            whileHover={{ scale: 1.01 }}
                            className="bg-gradient-to-r from-gray-50 to-emerald-50 p-4 rounded-xl mb-3 border border-emerald-100 shadow-sm"
                          >
                            <p className="text-sm text-gray-800 font-medium">{response.message}</p>
                          </motion.div>
                          
                          <div className="flex items-center gap-6 text-sm text-gray-600">
                            {response.parsedData.cases !== undefined && (
                              <motion.div 
                                whileHover={{ scale: 1.05 }}
                                className="flex items-center gap-2 bg-blue-100 px-3 py-1 rounded-full"
                              >
                                <Users size={14} className="text-blue-600" />
                                <span className="font-medium text-blue-800">{response.parsedData.cases} cases</span>
                              </motion.div>
                            )}
                            {response.parsedData.symptoms && response.parsedData.symptoms.length > 0 && (
                              <motion.div 
                                whileHover={{ scale: 1.05 }}
                                className="flex items-center gap-2 bg-orange-100 px-3 py-1 rounded-full"
                              >
                                <AlertTriangle size={14} className="text-orange-600" />
                                <span className="font-medium text-orange-800">{response.parsedData.symptoms.join(', ')}</span>
                              </motion.div>
                            )}
                            <motion.div 
                              whileHover={{ scale: 1.05 }}
                              className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full"
                            >
                              <Clock size={14} className="text-gray-600" />
                              <span className="font-medium text-gray-800">{response.timestamp.toLocaleString()}</span>
                            </motion.div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default function SMSAlertsPage() {
  return (
    <ProtectedRoute allowedRoles={['ASHA_WORKER', 'COMMUNITY_VOLUNTEER', 'CLINIC_STAFF', 'HOSPITAL_STAFF', 'NGO_WORKER', 'INCIDENT_REPORTER', 'ADMIN']}>
      <SMSAlertsPageContent />
    </ProtectedRoute>
  );
}