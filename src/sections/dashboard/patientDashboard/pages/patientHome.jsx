import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import PatientRegistration from '../../../../build/contracts/PatientRegistration.json';
import MentalHealth from '../../../../build/contracts/MentalHealth.json';
import Web3 from 'web3';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { BiTestTube } from 'react-icons/bi';
import { MdTrendingUp } from 'react-icons/md';
import { RiMentalHealthLine } from 'react-icons/ri';
import styled from '@emotion/styled';

import { ChevronRight, User, Calendar, Phone, MapPin, Mail, FileText, X } from "lucide-react";

import '../../../../globalStyles.css'

const ScrollableContainer = styled.div`
    &::-webkit-scrollbar {
        display: none;
    }
    -ms-overflow-style: none;
    scrollbar-width: none;
`;

const ScoreGraph = ({ data, dataKey, color, title, icon }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const gradientId = `colorGradient-${color.replace('#', '')}`;
    
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full bg-white p-6 rounded-2xl shadow-sm border border-gray-100 cursor-pointer transition-all duration-300 ease-in-out hover:shadow-lg" 
        >
            <div className="flex items-center justify-between ">
                <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg" style={{ backgroundColor: `${color}20` }}>
                        {icon}
                    </div>
                    <div>
                        <h3 className="text-base font-googleSansBold text-gray-800">{title}</h3>
                        <p className="text-sm text-gray-500">
                            Last {data.length} tests
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-600">
                        Latest: {data[data.length - 1]?.score.toFixed(3) || 'N/A'}
                    </span>
                </div>
            </div>
            
            <motion.div 
                initial={false}
                animate={{ 
                    height: isExpanded ? "200px" : "0px",
                    opacity: isExpanded ? 1 : 0,
                    marginTop: isExpanded ? "16px" : "0px"
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
            >
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                        <defs>
                            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={color} stopOpacity={0.34}/>
                                <stop offset="95%" stopColor={color} stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                        <XAxis dataKey="testId" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} tick={false} />
                        <Tooltip contentStyle={{ backgroundColor: '#fff',border: 'none',borderRadius: '8px',boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)' }}labelStyle={{ color: '#666' }}formatter={(value) => [value.toFixed(3), "Score"]} />
                        <Area type="monotone" dataKey={dataKey} stroke={color} fillOpacity={1}fill={`url(#${gradientId})`} />
                        <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2}dot={{ r: 4, strokeWidth: 2, fill: "#fff", stroke: color }}activeDot={{ r: 6, strokeWidth: 0, fill: color }} />
                    </LineChart>
                </ResponsiveContainer>
            </motion.div>
        </motion.div>
    );
};

const CustomTooltip = ({ active, payload, label, focusedLine }) => {
    if (active && payload && payload.length) {
        const relevantData = payload.filter(p => !focusedLine || p.dataKey === focusedLine);
        
        return (
            <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-100">
                <p className="text-sm font-medium mb-2">{`Test ${label}`}</p>
                {relevantData.map((entry, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}/>
                        <span className="text-gray-600">{entry.name}:</span>
                        <span className="font-medium">{Number(entry.value).toFixed(3)}</span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

const UnifiedGraph = ({ data }) => {
    const [focusedLine, setFocusedLine] = useState(null);
    
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
        >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
                <div>
                    <h3 className="text-2xl font-googleSansBold text-gray-800 mb-2">Mental Health Score Trends</h3>
                    <p className="text-gray-500 text-sm">Comprehensive view of all mental health parameters</p>
                </div>
                <div className="flex flex-wrap gap-4 sm:gap-6">
                    {[
                        { name: 'Childhood', key: 'childhood', color: '#0ea5e9' },
                        { name: 'PHQ-9', key: 'phq9', color: '#f97316' },
                        { name: 'Sentiment', key: 'sentiment', color: '#22c55e' },
                        { name: 'Final', key: 'final', color: '#8b5cf6' }
                    ].map(item => (
                        <div 
                            key={item.key} 
                            className="flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-300 cursor-pointer hover:bg-gray-100"
                            style={{ 
                                backgroundColor: focusedLine === item.key ? `${item.color}15` : 'transparent',
                                border: `1px solid ${focusedLine === item.key ? item.color : 'transparent'}`
                            }}
                            onClick={() => setFocusedLine(prev => prev === item.key ? null : item.key)}
                        >
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                            <span className="text-sm text-gray-600 font-medium whitespace-nowrap">{item.name}</span>
                        </div>
                    ))}
                </div>
            </div>
            <div className="h-[250px] relative">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/5 pointer-events-none rounded-lg" />
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart 
                        data={data} 
                        margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                        onMouseLeave={() => setFocusedLine(null)}
                    >
                        <defs>
                            {[
                                { id: 'childhood', color: '#0ea5e9' },
                                { id: 'phq9', color: '#f97316' },
                                { id: 'sentiment', color: '#22c55e' },
                                { id: 'final', color: '#8b5cf6' }
                            ].map(gradient => (
                                <linearGradient key={gradient.id} id={gradient.id} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={gradient.color} stopOpacity={0.2}/>
                                    <stop offset="95%" stopColor={gradient.color} stopOpacity={0.05}/>
                                </linearGradient>
                            ))}
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                        <XAxis 
                            dataKey="testId" 
                            stroke="#666" 
                            fontSize={12} 
                            tickLine={false} 
                            axisLine={false}
                            dy={10}
                        />
                        <YAxis 
                            stroke="#666" 
                            fontSize={12} 
                            tickLine={false} 
                            axisLine={false} 
                            tick={{ fontSize: 12 }}
                            tickFormatter={value => value.toFixed(2)}
                        />
                        <Tooltip 
                            content={<CustomTooltip focusedLine={focusedLine} />}
                            cursor={{ 
                                stroke: '#666', 
                                strokeWidth: 1, 
                                strokeDasharray: '5 5',
                                opacity: 0.5
                            }}
                        />
                        { [
                            { key: 'childhood', color: '#0ea5e9', name: 'Childhood Score' },
                            { key: 'phq9', color: '#f97316', name: 'PHQ-9 Score' },
                            { key: 'sentiment', color: '#22c55e', name: 'Sentiment Score' },
                            { key: 'final', color: '#8b5cf6', name: 'Final Score' }
                        ].map(line => (
                            <Line 
                                key={line.key}
                                name={line.name}
                                type="monotoneX"
                                dataKey={line.key} 
                                stroke={line.color}
                                strokeWidth={focusedLine === line.key ? 3 : 2}
                                strokeOpacity={focusedLine ? (focusedLine === line.key ? 1 : 0.15) : 1}
                                fill={`url(#${line.key})`}
                                dot={{ 
                                    r: focusedLine === line.key ? 6 : 4, 
                                    strokeWidth: 2, 
                                    fill: "#fff", 
                                    stroke: line.color,
                                    opacity: focusedLine ? (focusedLine === line.key ? 1 : 0.15) : 1
                                }}
                                activeDot={{ 
                                    r: 8, 
                                    strokeWidth: 0, 
                                    fill: line.color
                                }}
                                onMouseEnter={() => setFocusedLine(line.key)}
                                onClick={() => setFocusedLine(prev => prev === line.key ? null : line.key)}
                                style={{ cursor: 'pointer' }}
                            />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
};

const prepareUnifiedData = (details) => {
    return details.testIDs.map((testId, index) => ({
        testId: `Test ${index + 1}`,
        childhood: parseFloat(details.childhoodScores[index]),
        phq9: parseFloat(details.PHQ9Scores[index]),
        sentiment: parseFloat(details.sentimentScores[index]),
        final: parseFloat(details.finalScores[index])
    }));
};

import RazorpayButton from '../components/payment';

const AppointmentModal = ({ isOpen, onClose }) => {
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="bg-white rounded-xl p-6 w-[800px] max-h-[90vh] overflow-y-auto shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-googleSansBold text-gray-800">Schedule Appointment</h3>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>

          <div className="grid gap-6">
            {/* Doctor 1 */}
            <div className="p-4 rounded-lg border transition-all border-gray-200 hover:border-[#1a5252]/50">
              <div className="flex items-center gap-4">
                <img 
                  src="https://d35oenyzp35321.cloudfront.net/dr_chandrashekhar_website_pho_a247967e1e.jpg" 
                  alt="Dr. Michael Chen" 
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h4 className="text-lg font-medium text-gray-900">Dr. Michael Chen</h4>
                  <p className="text-[#1a5252] font-medium">Psychiatrist</p>
                  <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                    <span>12 years experience</span>
                    <span>Available: Tue, Thu, Sat</span>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end gap-2">
                  <p className="text-lg font-medium text-gray-900">₹ 800</p>
                  <div className="flex gap-2">
                    <RazorpayButton />
                    <button 
                      onClick={() => window.open('https://meet.google.com', '_blank')}
                      className="px-4 py-2 bg-[#1a5252] text-white rounded-md hover:bg-[#153f3f] transition-colors"
                    >
                      Join Meeting
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Doctor 2 */}
            <div className="p-4 rounded-lg border transition-all border-gray-200 hover:border-[#1a5252]/50">
              <div className="flex items-center gap-4">
                <img 
                  src="https://pbs.twimg.com/profile_images/1364936684958142464/k18b5LN3_400x400.jpg" 
                  alt="Dr. Gajendra Purohit" 
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h4 className="text-lg font-medium text-gray-900">Dr. Gajendra Purohit</h4>
                  <p className="text-[#1a5252] font-medium">Clinical Psychologist</p>
                  <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                    <span>15 years experience</span>
                    <span>Available: Mon, Wed, Fri</span>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end gap-2">
                  <p className="text-lg font-medium text-gray-900">₹ 1000</p>
                  <div className="flex gap-2">
                    <RazorpayButton />
                    <button 
                      onClick={() => window.open('https://meet.google.com', '_blank')}
                      className="px-4 py-2 bg-[#1a5252] text-white rounded-md hover:bg-[#153f3f] transition-colors"
                    >
                      Join Meeting
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Doctor 3 */}
            <div className="p-4 rounded-lg border transition-all border-gray-200 hover:border-[#1a5252]/50">
              <div className="flex items-center gap-4">
                <img 
                  src="https://admin.seekmed.care/storage/uploads/doctors//dr-jalpa-bhuta-1611574216.jpg" 
                  alt="Jalpa Bhuta" 
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h4 className="text-lg font-medium text-gray-900">Jalpa Bhuta</h4>
                  <p className="text-[#1a5252] font-medium">Behavioral Therapist</p>
                  <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                    <span>10 years experience</span>
                    <span>Available: Mon, Thu, Sat</span>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end gap-2">
                  <p className="text-lg font-medium text-gray-900">₹ 700</p>
                  <div className="flex gap-2">
                    <RazorpayButton />
                    <button 
                      onClick={() => window.open('https://meet.google.com', '_blank')}
                      className="px-4 py-2 bg-[#1a5252] text-white rounded-md hover:bg-[#153f3f] transition-colors"
                    >
                      Join Meeting
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              • Payment is required to schedule an appointment
              <br />
              • You'll be redirected to Google Meet after successful payment
              <br />
              • Consultation duration: 45 minutes
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const IFrameModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="bg-white rounded-xl p-4 w-[90%] max-w-[800px] h-[80vh] shadow-2xl relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button 
            onClick={onClose}
            className="absolute top-2 right-2 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
          </button>
          
          <iframe
            src="https://cdn.botpress.cloud/webchat/v2.3/shareable.html?configUrl=https://files.bpcontent.cloud/2024/12/14/20/20241214203234-PDJ8GLY8.json"
            className="w-full h-full rounded-lg"
            title="Chat Interface"
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const SidePanel = ({ patientDetails, onExpandChange }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isIFrameOpen, setIsIFrameOpen] = useState(false);

    useEffect(() => {
        onExpandChange(isExpanded);
    }, [isExpanded]);

    const getMentalHealthStatus = (score) => {
        if (score <= 0.23) return { status: 'No Depression', color: '#22c55e' };
        if (score <= 0.42) return { status: 'Mild Depression', color: '#facc15' };
        if (score <= 0.71) return { status: 'Moderate Depression', color: '#f97316' };
        return { status: 'Severe Depression', color: '#ef4444' };
    };

    const formatScore = (score) => {
        return parseFloat(score).toFixed(3);
    };

    return (
        <>
            <motion.div 
                className={`bg-white rounded-[40px] p-6 border-l border-gray-100 flex flex-col gap-6 transition-all duration-300 ${
                    isExpanded ? 'w-[800px] px-12' : 'w-[375px]'
                }`}
                layout
            >
                <div className="flex flex-col items-center" onClick={() => !isExpanded && setIsExpanded(true)}>
                    <div onClick={() => setIsExpanded(false)} className="w-20 h-20 bg-[#d4eceb] rounded-full flex items-center cursor-pointer justify-center mb-3">
                        <span className="text-[#1a5252] text-3xl font-semibold cursor-pointer">
                            {patientDetails.credentials.name.charAt(0)}
                        </span>
                    </div>
                    <h3 className="text-lg font-googleSansBold text-gray-800">
                        {patientDetails.credentials.name}
                    </h3>
                    <p className="text-sm text-gray-500">Patient ID: {patientDetails.credentials.healthID}</p>
                </div>

                {!isExpanded ? (
                    <>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <User size={18} className="text-[#1a5252]" />
                                <div>
                                    <p className="text-sm text-gray-500">Age</p>
                                    <p className="font-medium">{patientDetails.personalDetails.age} years</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone size={18} className="text-[#1a5252]" />
                                <div>
                                    <p className="text-sm text-gray-500">Contact</p>
                                    <p className="font-medium">{patientDetails.contactDetails.contactNumber}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Mail size={18} className="text-[#1a5252]" />
                                <div>
                                    <p className="text-sm text-gray-500">Email</p>
                                    <p className="font-medium">{patientDetails.credentials.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <MapPin size={18} className="text-[#1a5252]" />
                                <div>
                                    <p className="text-sm text-gray-500">Location</p>
                                    <p className="font-medium">{patientDetails.contactDetails.city}, {patientDetails.contactDetails.state}</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="text-sm font-googleSansBold text-gray-700">Latest Test Results</h4>
                                <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-600">
                                    Test #{patientDetails.mentalHealthDetails.testIDs.length}
                                </span>
                            </div>

                            {patientDetails.mentalHealthDetails.testIDs.length > 0 && (
                                <>
                                    <div className="mb-3">
                                        <span className="px-2 py-1 text-xs rounded-full" 
                                            style={{ 
                                                backgroundColor: getMentalHealthStatus(
                                                    patientDetails.mentalHealthDetails.finalScores[
                                                        patientDetails.mentalHealthDetails.finalScores.length - 1
                                                    ]
                                                ).color + '20',
                                                color: getMentalHealthStatus(
                                                    patientDetails.mentalHealthDetails.finalScores[
                                                        patientDetails.mentalHealthDetails.finalScores.length - 1
                                                    ]
                                                ).color 
                                            }}
                                        >
                                            {getMentalHealthStatus(
                                                patientDetails.mentalHealthDetails.finalScores[
                                                    patientDetails.mentalHealthDetails.finalScores.length - 1
                                                ]
                                            ).status}
                                        </span>
                                    </div>

                                    <div className="text-2xl font-bold text-[#1a5252] mb-3">
                                        {formatScore(patientDetails.mentalHealthDetails.finalScores[
                                            patientDetails.mentalHealthDetails.finalScores.length - 1
                                        ])}
                                    </div>

                                    <div className="grid grid-cols-1 gap-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-gray-500">Childhood</span>
                                            <span className="text-xs font-medium">{formatScore(patientDetails.mentalHealthDetails.childhoodScores[patientDetails.mentalHealthDetails.childhoodScores.length - 1])}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-gray-500">PHQ-9</span>
                                            <span className="text-xs font-medium">{formatScore(patientDetails.mentalHealthDetails.PHQ9Scores[patientDetails.mentalHealthDetails.PHQ9Scores.length - 1])}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-gray-500">Sentiment</span>
                                            <span className="text-xs font-medium">{formatScore(patientDetails.mentalHealthDetails.sentimentScores[patientDetails.mentalHealthDetails.sentimentScores.length - 1])}</span>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </>
                ) : (
                    // Expanded view
                    <div className="grid grid-cols-2 gap-6 mt-4">
                        {/* Personal Information */}
                        <div className="space-y-4">
                            <h4 className="font-googleSansBold text-gray-800">Personal Information</h4>
                            <div className="grid gap-4">
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-500">Gender</p>
                                    <p className="font-medium">{patientDetails.personalDetails.gender}</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-500">Date of Birth</p>
                                    <p className="font-medium">
                                        {`${patientDetails.personalDetails.date}/${patientDetails.personalDetails.month}/${patientDetails.personalDetails.year}`}
                                    </p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-500">Marital Status</p>
                                    <p className="font-medium">{patientDetails.personalDetails.maritalStatus}</p>
                                </div>
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="space-y-4">
                            <h4 className="font-googleSansBold text-gray-800">Contact Information</h4>
                            <div className="grid gap-4">
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-500">Address</p>
                                    <p className="font-medium">
                                        {`${patientDetails.contactDetails.apartmentNumber}, ${patientDetails.contactDetails.street}`}
                                    </p>
                                    <p className="font-medium">
                                        {`${patientDetails.contactDetails.city}, ${patientDetails.contactDetails.state}`}
                                    </p>
                                    <p className="font-medium">{patientDetails.contactDetails.country}</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-500">Phone</p>
                                    <p className="font-medium">{patientDetails.contactDetails.contactNumber}</p>
                                </div>
                            </div>
                        </div>

                        {/* Medical Information */}
                        <div className="space-y-4 col-span-2">
                            <h4 className="font-googleSansBold text-gray-800">Medical Information</h4>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-500">Allergies</p>
                                    <p className="font-medium">{patientDetails.medicalDetails.allergies || 'None'}</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-500">Medical Conditions</p>
                                    <p className="font-medium">
                                        {[
                                            patientDetails.medicalDetails.isDiabetic && 'Diabetic',
                                            patientDetails.medicalDetails.isHypertension && 'Hypertension'
                                        ].filter(Boolean).join(', ') || 'None'}
                                    </p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-500">Disabilities</p>
                                    <p className="font-medium">{patientDetails.personalDetails.disabilities || 'None'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Lifestyle Information */}
                        <div className="space-y-4 col-span-2">
                            <h4 className="font-googleSansBold text-gray-800">Lifestyle Information</h4>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-500">Smoking Status</p>
                                    <p className="font-medium">{patientDetails.lifeStyleDetails.smokingStatus}</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-500">Alcohol Consumption</p>
                                    <p className="font-medium">{patientDetails.lifeStyleDetails.alcoholConsumption}</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-500">Exercise Habit</p>
                                    <p className="font-medium">{patientDetails.lifeStyleDetails.exerciseHabit}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Footer buttons section */}
                <div className="mt-auto flex flex-col gap-3">
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="w-full bg-[#1a5252] text-white py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-[#153f3f] transition-colors"
                    >
                        <Calendar size={18} />
                        Schedule Appointment
                    </button>

                    <button
                        onClick={() => setIsIFrameOpen(true)}
                        className="w-full bg-[#1a5252]/90 text-white py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-[#153f3f] transition-colors"
                    >
                        <BiTestTube size={18} />
                        Chat with AI Assistant
                    </button>
                </div>
            </motion.div>

            <AppointmentModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
            
            <IFrameModal 
                isOpen={isIFrameOpen}
                onClose={() => setIsIFrameOpen(false)}
            />
        </>
    );
};

const AssessmentHistoryRow = ({ testId, index, finalScore, healthID }) => {
    const getScoreColor = (score) => {
        if (score <= 0.23) return { bg: '#22c55e20', text: '#22c55e' };
        if (score <= 0.42) return { bg: '#facc1520', text: '#facc15' };
        if (score <= 0.71) return { bg: '#f9731620', text: '#f97316' };
        return { bg: '#ef444420', text: '#ef4444' };
    };

    const formatDate = (testId) => {
        const today = new Date();
        const parsedDate = new Date(parseInt(testId));
        
        if (isNaN(parsedDate.getTime())) {
            return today.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
        }

        return parsedDate.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const colors = getScoreColor(finalScore);

    return (
        <Link to={`/patient/${healthID}/mht/${testId}`} className="block transition-transform cursor-pointer">
            <div className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg px-6 border border-transparent hover:border-emerald-500 transition-all ease-in-out">
                <div className="flex items-center gap-4 flex-1">
                    <div className="bg-[#1a5252] bg-opacity-10 p-2 rounded-lg">
                        <span className="text-[#1a5252] font-medium">#{index + 1}</span>
                    </div>
                    <div>
                        <p className="font-medium text-gray-900">Test {index + 1}</p>
                        <p className="text-sm text-gray-500">{formatDate(testId)}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div 
                        className="px-3 py-1 rounded-full text-sm font-medium"
                        style={{ 
                            backgroundColor: colors.bg,
                            color: colors.text
                        }}
                    >
                        {finalScore.toFixed(3)}
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-500" />
                </div>
            </div>
        </Link>
    );
};

function PatientDashboard() {
    const { healthID } = useParams();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [patientDetails, setPatientDetails] = useState(null);
    const [isSidePanelExpanded, setIsSidePanelExpanded] = useState(false);

    useEffect(() => {
        console.log("Updated Patient Details: ", patientDetails);
    }, [patientDetails]);

    useEffect(() => {
        const init = async () => {
            if (window.ethereum) {
                const web3Instance = new Web3(window.ethereum);
                try {
                    await window.ethereum.enable();
    
                    const networkId = await web3Instance.eth.net.getId();
                    const patientDeployedNetwork = PatientRegistration.networks[networkId];
    
                    if (patientDeployedNetwork) {
                        const patientContract = new web3Instance.eth.Contract(
                            PatientRegistration.abi,
                            patientDeployedNetwork.address
                        );
    
                        const patientCredentials = await patientContract.methods
                            .getPatientCredentials(healthID)
                            .call();
    
                        const patientPersonalDetails = await patientContract.methods
                            .getPatientPersonalDetails(healthID)
                            .call();
    
                        const patientContactDetails = await patientContract.methods
                            .getPatientContactDetails(healthID)
                            .call();
    
                        const patientMedicalDetails = await patientContract.methods
                            .getPatientMedicalDetails(healthID)
                            .call();
    
                        const patientLifeStyleDetails = await patientContract.methods
                            .getPatientLifestyleDetails(healthID)
                            .call();
    
                        const patientPolicyDetails = await patientContract.methods
                            .getPatientPolicyDetails(healthID)
                            .call();
    
                        setPatientDetails({
                            credentials: {
                                walletAddress: patientCredentials[0],
                                name: String(patientCredentials[1]),
                                healthID: String(patientCredentials[2]),
                                email: String(patientCredentials[3]),
                            },
                            personalDetails: {
                                gender: String(patientPersonalDetails[0]),
                                age: String(patientPersonalDetails[1]),
                                date: String(patientPersonalDetails[2]),
                                month: String(patientPersonalDetails[3]),
                                year: String(patientPersonalDetails[4]),
                                maritalStatus: String(patientPersonalDetails[5]),
                                disabilities: String(patientPersonalDetails[6]),
                            },
                            contactDetails: {
                                contactNumber: String(patientContactDetails[0]),
                                apartmentNumber: String(patientContactDetails[1]),
                                street: String(patientContactDetails[2]),
                                city: String(patientContactDetails[3]),
                                state: String(patientContactDetails[4]),
                                country: String(patientContactDetails[5]),
                            },
                            medicalDetails: {
                                weight: String(patientMedicalDetails[0]),
                                feet: String(patientMedicalDetails[1]),
                                inches: String(patientMedicalDetails[2]),
                                allergies: String(patientMedicalDetails[3]),
                                isDiabetic: patientMedicalDetails[4],
                                isHypertension: patientMedicalDetails[5],
                            },
                            lifeStyleDetails: {
                                smokingStatus: String(patientLifeStyleDetails[0]),
                                alcoholConsumption: String(patientLifeStyleDetails[1]),
                                exerciseHabit: String(patientLifeStyleDetails[2]),
                            },
                            policyDetails: {
                                insuranceProvider: String(patientPolicyDetails[0]),
                                policyNumber: String(patientPolicyDetails[1]),
                            },
                            mentalHealthDetails: {
                                testIDs: [],
                                childhoodScores: [],
                                PHQ9Scores: [],
                                sentimentScores: [],
                                finalScores: [],
                            }
                        });
                    } else {
                        setError('PatientRegistration smart contract not deployed on the detected network.');
                    }

                    const mentalHealthDeployedNetwork = MentalHealth.networks[networkId];
                    if (mentalHealthDeployedNetwork) {
                        const mentalHealthContract = new web3Instance.eth.Contract(
                            MentalHealth.abi,
                            mentalHealthDeployedNetwork.address
                        );
    
                        const fetchedTestIDs = await mentalHealthContract.methods
                            .getAllTestIDs(healthID)
                            .call();
    
                        const scores = [];
                        let tempChildhoodScores = [];
                        let tempPHQ9Scores = [];
                        let tempSentimentScores = [];
                        let tempFinalScores = [];

                        for (const testID of fetchedTestIDs) {
                            const fetchedChildhoodDetails = await mentalHealthContract.methods
                                .getChildhoodDetails(testID)
                                .call();
    
                            const fetchedPHQ9Details = await mentalHealthContract.methods
                                .getPHQ9Details(testID)
                                .call();

                            const fetchSentimentDetails = await mentalHealthContract.methods
                                .getSentimentDetails(testID)
                                .call();

                            const fetchChildHoodScore = await mentalHealthContract.methods
                                .getmhtcdscore(testID)
                                .call();
                            
                            const fetchPHQ9Score = await mentalHealthContract.methods
                                .getmhtphqscore(testID)
                                .call();

                            const fetchSentimentScore = await mentalHealthContract.methods
                                .getSentimentScore(testID)
                                .call();

                            const finalScore = (
                                (Number(fetchChildHoodScore) * 0.2) + 
                                (Number(fetchPHQ9Score) * 0.5) + 
                                (Number(fetchSentimentScore) * 0.3)
                            );

                            console.log(`Test ID ${testID} scores:`, {
                                childhood: Number(fetchChildHoodScore),
                                phq9: Number(fetchPHQ9Score),
                                sentiment: Number(fetchSentimentScore),
                                calculated: finalScore
                            });
                            
                            tempChildhoodScores.push(Number(fetchChildHoodScore));
                            tempPHQ9Scores.push(Number(fetchPHQ9Score));
                            tempSentimentScores.push(Number(fetchSentimentScore));
                            tempFinalScores.push(finalScore);
                        }

                        console.log('Final Calculated Scores:', tempFinalScores);

                        const mentalHealthDetails = {
                            testIDs: fetchedTestIDs,
                            childhoodScores: tempChildhoodScores,
                            PHQ9Scores: tempPHQ9Scores,
                            sentimentScores: tempSentimentScores,
                            finalScores: tempFinalScores
                        };

                        setPatientDetails(prevDetails => ({
                            ...prevDetails,
                            mentalHealthDetails
                        }));
                    } else {
                        setError('MentalHealth smart contract not deployed on the detected network.');
                    }
                } catch (err) {
                    console.error(err);
                    setError('Error accessing MetaMask or fetching data.');
                }
            } else {
                setError('MetaMask not detected. Please install the MetaMask extension.');
            }
            setLoading(false);
        };
    
        init();
    }, [healthID]);

    const getMentalHealthStatus = (score) => {
        if (score <= 0.23) return { status: 'No Depression', color: '#22c55e' };
        if (score <= 0.42) return { status: 'Mild Depression', color: '#facc15' };
        if (score <= 0.71) return { status: 'Moderate Depression', color: '#f97316' };
        return { status: 'Severe Depression', color: '#ef4444' };
    };

    const prepareGraphData = (testIDs, scores) => {
        return testIDs.map((testId, index) => ({
            testId: `Test ${index + 1}`,
            score: parseFloat(scores[index])
        }));
    };

    if (loading) {
        return <div className="text-center mt-10">Loading...</div>;
    }

    if (error) {
        return (
            <div className="text-red-500 bg-red-100 p-4 rounded-md mt-5 mx-auto max-w-md text-center">
                {error}
            </div>
        );
    }

    return (
        <>
            <main className="fixed w-[calc(100vw-350px)] bg-slate-950 h-screen pt-7 pb-7 pr-7 font-albulaRegular">   
                <div className="flex h-full gap-6">
                    <ScrollableContainer className="flex-1 bg-gradient-to-br from-gray-50 to-gray-100 rounded-[40px] h-full border-gray-400 shadow-inner overflow-y-auto">
                        <div className={`sticky top-0 z-10 px-14 pt-14 pb-6 transition-all duration-300 ${
                            isSidePanelExpanded ? '' : 'pr-14'
                        }`}>
                            <motion.div 
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className='flex flex-row px-10 py-4 bg-gradient-to-r from-[#1a5252] to-[#2a7070] rounded-3xl backdrop-blur-md justify-between items-center shadow-lg'
                            >
                                <div>
                                    <h1 className="text-3xl font-googleSansBold text-white">
                                        Welcome, {patientDetails.credentials.name.split(' ')[0]}!
                                    </h1>
                                    <div className="flex items-center gap-2 mt-2 text-gray-200">
                                        <span>Health ID: </span>
                                        <span className='text-gray-100'>{patientDetails.credentials.healthID}</span>
                                    </div>
                                </div>

                                <Link to={`/patient/${patientDetails.credentials.healthID}/profile`}>
                                    <motion.div 
                                        whileHover={{ scale: 1.05 }}
                                        className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm"
                                    >
                                        <span className="text-white text-xl font-semibold">
                                            {patientDetails.credentials.name.charAt(0)}
                                        </span>
                                    </motion.div>
                                </Link>
                            </motion.div>

                        </div>

                        <div className="relative flex items-center mb-10 px-20">
                            <div className="flex-grow border-t border-[#1a5252]/20"></div>
                            <span className="flex-shrink mx-4 text-[#1a5252] font-Albula-Regular">Dashboard</span>
                            <div className="flex-grow border-t border-[#1a5252]/20"></div>
                        </div>

                        <div className="px-14 bg-gradient-to-br from-gray-50/50 to-gray-100/50">
                            <div className={`grid ${isSidePanelExpanded ? 'grid-cols-1' : 'grid-cols-2'} gap-6 mb-8`}>
                                <motion.div layout>
                                    <ScoreGraph 
                                        data={prepareGraphData(patientDetails.mentalHealthDetails.testIDs, patientDetails.mentalHealthDetails.finalScores)} 
                                        dataKey="score" 
                                        color="#8b5cf6" 
                                        title="Final Score Trend" 
                                        icon={<MdTrendingUp className="text-[#8b5cf6] text-xl" />} 
                                    />
                                </motion.div>
                                <motion.div layout>
                                    <ScoreGraph 
                                        data={prepareGraphData(patientDetails.mentalHealthDetails.testIDs, patientDetails.mentalHealthDetails.childhoodScores)} 
                                        dataKey="score" 
                                        color="#0ea5e9" 
                                        title="Childhood Score Trend" 
                                        icon={<RiMentalHealthLine className="text-[#0ea5e9] text-xl" />} 
                                    />
                                </motion.div>
                                <motion.div layout>
                                    <ScoreGraph 
                                        data={prepareGraphData(patientDetails.mentalHealthDetails.testIDs, patientDetails.mentalHealthDetails.PHQ9Scores)} 
                                        dataKey="score" 
                                        color="#f97316" 
                                        title="PHQ-9 Score Trend" 
                                        icon={<MdTrendingUp className="text-[#f97316] text-xl" />} 
                                    />
                                </motion.div>
                                <motion.div layout>
                                    <ScoreGraph 
                                        data={prepareGraphData(patientDetails.mentalHealthDetails.testIDs, patientDetails.mentalHealthDetails.sentimentScores)} 
                                        dataKey="score" 
                                        color="#22c55e" 
                                        title="Sentiment Score Trend" 
                                        icon={<RiMentalHealthLine className="text-[#22c55e] text-xl" />} 
                                    />
                                </motion.div>
                            </div>

                            <div className="my-10 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl">
                                <UnifiedGraph data={prepareUnifiedData(patientDetails.mentalHealthDetails)} />
                            </div>

                            <div className="gap-6 mb-8">
                                <div className={`bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-xl border border-gray-200 ${
                                    isSidePanelExpanded ? 'col-span-2' : ''
                                }`}>
                                    <h3 className="text-2xl font-googleSansBold text-gray-800">Assessment History</h3>

                                    <div className="flex items-center my-10 gap-4">
                                        <div className="p-4 bg-[#1a5252] bg-opacity-10 rounded-lg">
                                            <BiTestTube className="w-8 h-8 text-[#1a5252]" />
                                        </div>
                                        <div>
                                            <p className="text-2xl font-bold text-[#1a5252]">{patientDetails.mentalHealthDetails.testIDs.length}</p>
                                            <p className="text-gray-500">Total Assessments Completed</p>
                                        </div>
                                    </div>

                                    <ScrollableContainer className="space-y-3 max-h-[350px] overflow-y-auto">
                                        {patientDetails.mentalHealthDetails.testIDs.map((testId, index) => (
                                            <AssessmentHistoryRow 
                                                key={testId}
                                                testId={testId}
                                                index={index}
                                                finalScore={patientDetails.mentalHealthDetails.finalScores[index]}
                                                healthID={healthID}
                                            />
                                        ))}

                                        {patientDetails.mentalHealthDetails.testIDs.length === 0 && (
                                            <p className="text-center text-gray-500 mt-4">No tests available</p>
                                        )}
                                    </ScrollableContainer>
                                </div>
                            </div>
                        </div>
                    </ScrollableContainer>
                    
                    <SidePanel patientDetails={patientDetails} onExpandChange={setIsSidePanelExpanded} />
                </div>
            </main>
        </>
    );
}

export default PatientDashboard;