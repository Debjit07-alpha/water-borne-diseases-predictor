"use client";

import { useState, useEffect } from "react";
import { Send, Users, MapPin, Clock, AlertTriangle, CheckCircle, MessageSquare, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

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

export default function SMSAlertsPage() {
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Send className="text-blue-600" size={32} />
              SMS Health Alerts
            </h1>
            <p className="mt-2 text-gray-600">
              Send configurable SMS alerts to community members for health data collection and early warning
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('alerts')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'alerts'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Send size={16} />
                  SMS Alerts
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    {alerts.length}
                  </span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('responses')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'responses'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <MessageSquare size={16} />
                  Community Responses
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    {alerts.reduce((sum, alert) => sum + (alert.responses?.length || 0), 0)}
                  </span>
                </div>
              </button>
            </nav>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Alerts</p>
                <p className="text-2xl font-bold text-gray-900">{alerts.length}</p>
              </div>
              <Send className="text-blue-600" size={24} />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Reported Cases</p>
                <p className="text-2xl font-bold text-orange-600">
                  {getResponseSummary().totalCases}
                </p>
              </div>
              <Users className="text-orange-600" size={24} />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Emergencies</p>
                <p className="text-2xl font-bold text-red-600">
                  {getResponseSummary().emergencies}
                </p>
              </div>
              <AlertTriangle className="text-red-600" size={24} />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Response Rate</p>
                <p className="text-2xl font-bold text-green-600">
                  {getResponseSummary().responseRate}%
                </p>
              </div>
              <TrendingUp className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'alerts' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* New Alert Form */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Create New Alert</h2>
                  <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                  >
                    {showForm ? 'Cancel' : 'New Alert'}
                  </button>
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
                      <select
                        value={formData.diseaseType}
                        onChange={(e) => setFormData(prev => ({ ...prev, diseaseType: e.target.value }))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">Select disease/symptom</option>
                        {diseaseOptions.map(disease => (
                          <option key={disease} value={disease}>{disease}</option>
                        ))}
                      </select>
                    </div>

                    {/* Severity */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Severity
                      </label>
                      <select
                        value={formData.severity}
                        onChange={(e) => setFormData(prev => ({ ...prev, severity: e.target.value as any }))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Mild">Mild</option>
                        <option value="Moderate">Moderate</option>
                        <option value="Severe">Severe</option>
                      </select>
                    </div>

                    {/* Affected Count */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Number of Affected Individuals
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={formData.affectedCount}
                        onChange={(e) => setFormData(prev => ({ ...prev, affectedCount: parseInt(e.target.value) }))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    {/* Location */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Location/Village
                      </label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                        placeholder="Enter location"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    {/* Action Required */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Action Required
                      </label>
                      <textarea
                        value={formData.actionRequired}
                        onChange={(e) => setFormData(prev => ({ ...prev, actionRequired: e.target.value }))}
                        placeholder="e.g., Report to clinic if symptoms persist"
                        rows={3}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    {/* Recipients */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Recipients (Phone Numbers)
                      </label>
                      <textarea
                        value={formData.recipients}
                        onChange={(e) => setFormData(prev => ({ ...prev, recipients: e.target.value }))}
                        placeholder="Enter phone numbers separated by commas"
                        rows={2}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    {/* Custom Message */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Additional Message (Optional)
                      </label>
                      <textarea
                        value={formData.customMessage}
                        onChange={(e) => setFormData(prev => ({ ...prev, customMessage: e.target.value }))}
                        placeholder="Additional instructions or notes"
                        rows={2}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {/* Preview Message */}
                    {formData.diseaseType && (
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm font-medium text-gray-700 mb-2">SMS Preview:</p>
                        <div className="text-xs bg-white p-2 rounded border">
                          {generateSMSMessage(formData)}
                        </div>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send size={16} />
                          Send SMS Alert
                        </>
                      )}
                    </button>
                  </motion.form>
                )}
              </div>
            </div>

            {/* Alert History */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-6 border-b">
                  <h2 className="text-lg font-semibold text-gray-900">Recent Alerts</h2>
                </div>
                
                <div className="divide-y max-h-96 overflow-y-auto">
                  {alerts.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                      <Send className="mx-auto mb-4 text-gray-300" size={48} />
                      <p>No alerts sent yet. Create your first SMS alert to get started.</p>
                    </div>
                  ) : (
                    alerts.map((alert) => (
                      <motion.div
                        key={alert.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 hover:bg-gray-50 cursor-pointer"
                        onClick={() => setSelectedAlert(alert)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-medium text-gray-900">{alert.diseaseType}</span>
                              <span className={`px-2 py-1 text-xs rounded-full ${severityColors[alert.severity]}`}>
                                {alert.severity}
                              </span>
                              {alert.responses?.some(r => r.parsedData.status === 'emergency') && (
                                <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                                  ⚠️ Emergency Responses
                                </span>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                              <div className="flex items-center gap-1">
                                <Users size={14} />
                                {alert.affectedCount} affected
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin size={14} />
                                {alert.location}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock size={14} />
                                {alert.timestamp.toLocaleString()}
                              </div>
                            </div>
                            
                            <p className="text-sm text-gray-700">{alert.actionRequired}</p>
                            
                            <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                              <span>Sent to {alert.recipients.length} recipient(s)</span>
                              {alert.responses && alert.responses.length > 0 && (
                                <span className="text-green-600">
                                  • {alert.responses.length} response(s)
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Responses View */
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold text-gray-900">Community Response Tracking</h2>
                <p className="text-sm text-gray-600 mt-1">Real-time SMS responses from community members</p>
              </div>
              
              <div className="divide-y max-h-96 overflow-y-auto">
                {getAllResponses().length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <MessageSquare className="mx-auto mb-4 text-gray-300" size={48} />
                    <p>No responses received yet. Responses will appear here in real-time.</p>
                  </div>
                ) : (
                  getAllResponses().map((response) => (
                    <motion.div
                      key={response.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium text-gray-900">{response.phone}</span>
                            <span className={`px-2 py-1 text-xs rounded-full ${responseStatusColors[response.parsedData.status]}`}>
                              {response.parsedData.status.replace('_', ' ').toUpperCase()}
                            </span>
                            {response.parsedData.urgency && (
                              <span className={`px-2 py-1 text-xs rounded-full ${urgencyColors[response.parsedData.urgency]}`}>
                                {response.parsedData.urgency.toUpperCase()} PRIORITY
                              </span>
                            )}
                          </div>
                          
                          <div className="bg-gray-50 p-3 rounded-lg mb-2">
                            <p className="text-sm text-gray-800">{response.message}</p>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            {response.parsedData.cases !== undefined && (
                              <div className="flex items-center gap-1">
                                <Users size={14} />
                                {response.parsedData.cases} cases
                              </div>
                            )}
                            {response.parsedData.symptoms && response.parsedData.symptoms.length > 0 && (
                              <div className="flex items-center gap-1">
                                <AlertTriangle size={14} />
                                {response.parsedData.symptoms.join(', ')}
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <Clock size={14} />
                              {response.timestamp.toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}