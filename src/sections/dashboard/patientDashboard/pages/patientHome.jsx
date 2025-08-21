import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BiTestTube } from 'react-icons/bi';
import { MdTrendingUp } from 'react-icons/md';
import { RiMentalHealthLine } from 'react-icons/ri';
import { ChevronRight} from "lucide-react";

import SidePanel from './patientHomeSidePanel';
import ScoreGraph from '../components/mainDashboard_components/ScoreGraph';
import UnifiedGraph from '../components/mainDashboard_components/UnifiedGraph';

import { usePatientData } from '../dataProvider/PatientDataProvider';

import '../../../../globalStyles.css'

const prepareUnifiedData = (details) => {
    return details.testIDs.map((testId, index) => ({
        testId: `Test ${index + 1}`,
        childhood: parseFloat(details.childhoodScores[index]),
        phq9: parseFloat(details.PHQ9Scores[index]),
        sentiment: parseFloat(details.sentimentScores[index]),
        final: parseFloat(details.finalScores[index])
    }));
};

function PatientDashboard() {
    const { patientDetails, loading, error } = usePatientData();
    const healthID = patientDetails?.credentials?.healthID || '';

    const [isSidePanelExpanded, setIsSidePanelExpanded] = useState(false);

    useEffect(() => {
        console.log('Updated Patient Details:', patientDetails);
    }, [patientDetails]);

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
                    <div className="flex-1 bg-gradient-to-br from-gray-50 to-gray-100 rounded-[40px] h-full border-gray-400 shadow-inner overflow-y-auto">
                        <div className={`sticky top-0 z-10 px-14 pt-14 pb-6 transition-all duration-300 ${ isSidePanelExpanded ? '' : 'pr-14' }`}>
                            <motion.div initial={{ opacity: 0, y: -20 }}animate={{ opacity: 1, y: 0 }}className='flex flex-row px-10 py-4 bg-gradient-to-r from-[#1a5252] to-[#2a7070] rounded-3xl backdrop-blur-md justify-between items-center shadow-lg' >
                                <div>
                                    <h1 className="text-3xl font-googleSansBold text-white">
                                        Welcome, {patientDetails.credentials.name.split(' ')[0]}!
                                    </h1>
                                    <div className="flex items-center gap-2 mt-2 text-gray-200">
                                        <span>Health ID: </span>
                                        <span className='text-gray-100'>{patientDetails.credentials.healthID}</span>
                                    </div>
                                </div>

                                <Link>
                                    <motion.div whileHover={{ scale: 1.05 }} className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm" >
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
                                    <ScoreGraph data={prepareGraphData(patientDetails.mentalHealthDetails.testIDs, patientDetails.mentalHealthDetails.finalScores)} dataKey="score" color="#8b5cf6" title="Final Score Trend" icon={ <MdTrendingUp className="text-[#8b5cf6] text-xl" /> } />
                                </motion.div>

                                <motion.div layout>
                                    <ScoreGraph data={prepareGraphData(patientDetails.mentalHealthDetails.testIDs, patientDetails.mentalHealthDetails.childhoodScores)} dataKey="score" color="#0ea5e9" title="Childhood Score Trend" icon={<RiMentalHealthLine className="text-[#0ea5e9] text-xl" />} />
                                </motion.div>

                                <motion.div layout>
                                    <ScoreGraph data={prepareGraphData(patientDetails.mentalHealthDetails.testIDs, patientDetails.mentalHealthDetails.PHQ9Scores)} dataKey="score" color="#f97316" title="PHQ-9 Score Trend" icon={<MdTrendingUp className="text-[#f97316] text-xl" />} />
                                </motion.div>

                                <motion.div layout>
                                    <ScoreGraph data={prepareGraphData(patientDetails.mentalHealthDetails.testIDs, patientDetails.mentalHealthDetails.sentimentScores)} dataKey="score" color="#22c55e" title="Sentiment Score Trend" icon={<RiMentalHealthLine className="text-[#22c55e] text-xl" />} />
                                </motion.div>
                            </div>

                            <div className="my-10 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl">
                                <UnifiedGraph data={prepareUnifiedData(patientDetails.mentalHealthDetails)} />
                            </div>

                            <div className="gap-6 mb-8">
                                <div className={`bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-xl border border-gray-200 ${ isSidePanelExpanded ? 'col-span-2' : '' }`}>
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

                                    <div className="space-y-3 max-h-[350px] overflow-y-auto">
                                        {patientDetails.mentalHealthDetails.testIDs.map((testId, index) => {
                                            const finalScore = patientDetails.mentalHealthDetails.finalScores[index];
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
                                                <Link to={`/patient/${healthID}/mht/${testId}`} key={testId} className="block transition-transform cursor-pointer">
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
                                        })}

                                        {patientDetails.mentalHealthDetails.testIDs.length === 0 && (
                                            <p className="text-center text-gray-500 mt-4">No tests available</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <SidePanel onExpandChange={setIsSidePanelExpanded} />

                </div>
            </main>
        </>
    );
}

export default PatientDashboard;