import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BiTestTube } from 'react-icons/bi';
import { Calendar, User, Phone, MapPin, Mail} from 'lucide-react';
import { usePatientData } from '../dataProvider/PatientDataProvider.jsx';

import AppointmentModal from '../components/mainDashboard_components/AppointmentModal.jsx';
import IFrameModal from '../components/mainDashboard_components/botPressModal';

const getMentalHealthStatus = (score) => {
    if (score <= 0.23) return { status: 'No Depression', color: '#22c55e' };
    if (score <= 0.42) return { status: 'Mild Depression', color: '#facc15' };
    if (score <= 0.71) return { status: 'Moderate Depression', color: '#f97316' };
    return { status: 'Severe Depression', color: '#ef4444' };
};

const formatScore = (score) => parseFloat(score).toFixed(3);

const SidePanel = ({ onExpandChange }) => {
    const { patientDetails } = usePatientData();

    const [isExpanded, setIsExpanded] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isIFrameOpen, setIsIFrameOpen] = useState(false);

    useEffect(() => {
        onExpandChange(isExpanded);
    }, [isExpanded]);

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

                <div className={`flex ${isExpanded ? 'mt-6 flex-row' : 'mt-auto flex-col'} gap-3`}>
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

            <AppointmentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            <IFrameModal isOpen={isIFrameOpen} onClose={() => setIsIFrameOpen(false)} />
        </>
    );
};

export default SidePanel;
