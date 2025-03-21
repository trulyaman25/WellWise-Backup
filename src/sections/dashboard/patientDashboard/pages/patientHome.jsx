import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import PatientRegistration from '../../../../build/contracts/PatientRegistration.json';
import MentalHealth from '../../../../build/contracts/MentalHealth.json';
import Web3 from 'web3';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area } from 'recharts';
import { motion } from 'framer-motion';
import { BiTestTube } from 'react-icons/bi';
import { MdTrendingUp } from 'react-icons/md';
import { RiMentalHealthLine } from 'react-icons/ri';
import styled from '@emotion/styled';

import '../../../../globalStyles.css'
import D_BRAIN from '/illustration/D_BRAIN.png';

const ScrollableContainer = styled.div`
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const ScoreGraph = ({ data, dataKey, color, title, icon }) => {
    const gradientId = `colorGradient-${color.replace('#', '')}`;
    
    return (
        <motion.div initial={{ opacity: 0, y: 20 }}animate={{ opacity: 1, y: 0 }}transition={{ duration: 0.5 }}className="w-full bg-white p-6 rounded-2xl shadow-sm border border-gray-100" >
            <div className="flex items-center justify-between mb-4">
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
            <div className="h-[200px] mt-4">
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
                        <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} tickFormatter={value => value.toFixed(1)} />
                        <Tooltip contentStyle={{ backgroundColor: '#fff',border: 'none',borderRadius: '8px',boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)' }}labelStyle={{ color: '#666' }}formatter={(value) => [value.toFixed(3), "Score"]} />
                        <Area type="monotone" dataKey={dataKey} stroke={color} fillOpacity={1}fill={`url(#${gradientId})`} />
                        <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2}dot={{ r: 4, strokeWidth: 2, fill: "#fff", stroke: color }}activeDot={{ r: 6, strokeWidth: 0, fill: color }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
};

function PatientDashboard() {
    const { healthID } = useParams();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [patientDetails, setPatientDetails] = useState(null);

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

                            const fetchFinalScore = await mentalHealthContract.methods
                                .getFinalScore(testID)
                                .call();
                            
                            tempChildhoodScores = [...tempChildhoodScores, Number(fetchChildHoodScore)];
                            tempPHQ9Scores = [...tempPHQ9Scores, Number(fetchPHQ9Score)];
                            tempSentimentScores = [...tempSentimentScores, Number(fetchSentimentScore)];
                            tempFinalScores = [...tempFinalScores, Number(fetchFinalScore)];
    
                            console.log(`Details for Test ID ${testID}:`);
                            console.log('Childhood Details:', fetchedChildhoodDetails);
                            console.log('PHQ-9 Details:', fetchedPHQ9Details);
                            console.log('Sentiment Details: ', fetchSentimentDetails);

                            const score = calculatePHQ9Score(fetchedPHQ9Details);
                            scores.push({ testId: testID, score });
                        }

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

    const calculatePHQ9Score = (phq9Details) => {
        return Math.floor(Math.random() * 100);
    };

    const getMentalHealthStatus = (score) => {
        if (score >= 20) return { status: 'Severe', color: '#ef4444' };
        if (score >= 15) return { status: 'Moderately Severe', color: '#f97316' };
        if (score >= 10) return { status: 'Moderate', color: '#facc15' };
        if (score >= 5) return { status: 'Mild', color: '#84cc16' };
        return { status: 'None-minimal', color: '#22c55e' };
    };

    const formatScore = (score) => {
        return parseFloat(score).toFixed(3);
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

    const today = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <>
            <main className="fixed w-[calc(100vw-350px)] bg-slate-950 h-screen pt-7 pb-7 pr-7 font-albulaRegular">   
                <ScrollableContainer className="bg-white rounded-[40px] h-full border-gray-400 p-14 shadow-inner overflow-y-auto">
                    <motion.div initial={{ opacity: 0, y: -20 }}animate={{ opacity: 1, y: 0 }}className='flex flex-row justify-between items-center mb-8'>
                        <div>
                            <h1 className="text-3xl font-googleSansBold text-[#1a5252]">
                                Welcome, {patientDetails.credentials.name.split(' ')[0]}!
                            </h1>
                            <div className="flex items-center gap-2 mt-2">
                                <span>Health ID: </span>
                                <span className='text-gray-500'>{patientDetails.credentials.healthID}</span>
                            </div>
                        </div>

                        <Link to={`/patient/${patientDetails.credentials.healthID}/profile`}>
                            <motion.div 
                                whileHover={{ scale: 1.05 }}
                                className="w-12 h-12 bg-[#d4eceb] rounded-full flex items-center justify-center"
                            >
                                <span className="text-[#1a5252] text-xl font-semibold">
                                    {patientDetails.credentials.name.charAt(0)}
                                </span>
                            </motion.div>
                        </Link>
                    </motion.div>

                    <div className="relative flex items-center">
                        <div class="flex-grow border-t border-gray-200"></div>
                        <span className="flex-shrink mx-4 text-gray-400 font-Albula-Regular">Mental Health Dashboard</span>
                        <div className="flex-grow border-t border-gray-200"></div>
                    </div>

                    <div className="grid grid-cols-3 gap-6 my-8">
                        <ScoreGraph data={prepareGraphData(patientDetails.mentalHealthDetails.testIDs, patientDetails.mentalHealthDetails.childhoodScores)} dataKey="score" color="#0ea5e9" title="Childhood Score Trend" icon={<RiMentalHealthLine className="text-[#0ea5e9] text-xl" />} />
                        <ScoreGraph  data={prepareGraphData( patientDetails.mentalHealthDetails.testIDs, patientDetails.mentalHealthDetails.PHQ9Scores )} dataKey="score" color="#f97316" title="PHQ-9 Score Trend" icon={<MdTrendingUp className="text-[#f97316] text-xl" />} />
                        <ScoreGraph  data={prepareGraphData( patientDetails.mentalHealthDetails.testIDs, patientDetails.mentalHealthDetails.sentimentScores )} dataKey="score" color="#22c55e" title="Sentiment Score Trend" icon={<RiMentalHealthLine className="text-[#22c55e] text-xl" />} />
                    </div>

                    <motion.div initial={{ opacity: 0 }}animate={{ opacity: 1 }}transition={{ delay: 0.2 }}className="grid grid-cols-3 gap-6">
                        <div className="col-span-2 bg-white p-6 rounded-xl shadow-md border border-gray-100">
                            <h3 className="text-lg font-googleSansBold text-gray-800 mb-4">Assessment History</h3>
                            <ScrollableContainer className="space-y-4 max-h-[400px] overflow-y-auto">
                                {patientDetails.mentalHealthDetails.testIDs.map((testId, index) => (
                                    <Link key={testId} to={`/patient/${healthID}/mht/${testId}`}className="block transition-transform hover:scale-[1.02]" >
                                        <div className="flex flex-col p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
                                            <div className="flex justify-between items-center mb-2">
                                                <p className="font-semibold">Test ID: {testId}</p>
                                                <span className="px-3 py-1 text-sm rounded-full" 
                                                    style={{ 
                                                        backgroundColor: getMentalHealthStatus(calculatePHQ9Score(testId)).color + '20',
                                                        color: getMentalHealthStatus(calculatePHQ9Score(testId)).color 
                                                    }}>
                                                    {getMentalHealthStatus(calculatePHQ9Score(testId)).status}
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-4 gap-4 mt-2">
                                                <div className="text-sm">
                                                    <span className="text-gray-500">Childhood Score:</span>
                                                    <p className="font-medium">
                                                        {patientDetails.mentalHealthDetails.childhoodScores[index] 
                                                            ? formatScore(patientDetails.mentalHealthDetails.childhoodScores[index]) 
                                                            : 'N/A'}
                                                    </p>
                                                </div>
                                                <div className="text-sm">
                                                    <span className="text-gray-500">PHQ9 Score:</span>
                                                    <p className="font-medium">
                                                        {patientDetails.mentalHealthDetails.PHQ9Scores[index]
                                                            ? formatScore(patientDetails.mentalHealthDetails.PHQ9Scores[index])
                                                            : 'N/A'}
                                                    </p>
                                                </div>
                                                <div className="text-sm">
                                                    <span className="text-gray-500">Sentiment Score:</span>
                                                    <p className="font-medium">
                                                        {patientDetails.mentalHealthDetails.sentimentScores[index]
                                                            ? formatScore(patientDetails.mentalHealthDetails.sentimentScores[index])
                                                            : 'N/A'}
                                                    </p>
                                                </div>
                                                <div className="text-sm">
                                                    <span className="text-gray-500">Final Score:</span>
                                                    <p className="font-medium">
                                                        {patientDetails.mentalHealthDetails.finalScores[index]
                                                            ? formatScore(patientDetails.mentalHealthDetails.finalScores[index])
                                                            : 'N/A'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                                {patientDetails.mentalHealthDetails.testIDs.length === 0 && (
                                    <p className="text-center text-gray-500">No assessment history available</p>
                                )}
                            </ScrollableContainer>
                        </div>

                        <div className="col-span-3 bg-white p-6 rounded-xl shadow-md border border-gray-100">
                            <h3 className="text-lg font-googleSansBold text-gray-800 mb-4">Lifestyle Factors</h3>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-500">Exercise Habit</p>
                                    <p className="font-semibold mt-1">{patientDetails.lifeStyleDetails.exerciseHabit}</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-500">Smoking Status</p>
                                    <p className="font-semibold mt-1">{patientDetails.lifeStyleDetails.smokingStatus}</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-500">Alcohol Consumption</p>
                                    <p className="font-semibold mt-1">{patientDetails.lifeStyleDetails.alcoholConsumption}</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </ScrollableContainer>
            </main>
        </>
    );
}

export default PatientDashboard;