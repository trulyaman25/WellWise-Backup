import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import MentalHealth from '../../../../../build/contracts/MentalHealth.json';
import PatientRegistration from '../../../../../build/contracts/PatientRegistration.json';
import '../../../../../globalStyles.css';
import axios from "axios";
import gemini from '/animations/gemini.gif';

import Web3 from 'web3';
import { motion, AnimatePresence } from 'framer-motion';
import Typewriter from 'typewriter-effect';
import styled from '@emotion/styled';

const ScrollableContainer = styled.div`
    &::-webkit-scrollbar {
        display: none;
    }
    -ms-overflow-style: none;
    scrollbar-width: none;
`;

const AnimatedText = ({ text, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        className="preserve-whitespace"
    >
        {text}
    </motion.div>
);

const AdviceStep = ({ step, description, index, totalSteps }) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.5 }} // Sequential delay
            className="bg-gray-50 rounded-xl p-6 shadow-sm mb-4"
        >
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.5 + 0.2 }}
                className="text-gray-800"
            >
                {`${step}. ${description}`}
            </motion.p>
        </motion.div>
    );
};

function Report() {
    const { healthID, testID } = useParams();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const [scores, setScores] = useState({
        historyScore: '',
        phq9Score: '',
        sentimentalScore: '',
        videoScore: ''
    });

    const [childHoodDetails, setChildHoodDetails] = useState({
        question1: '',
        question2: '',
        question3: '',
        question4: '',
        question5: '',
        question6: '',
        question7: '',
        score: ''
    });

    const [phq9Details, setphq9Details] = useState({
        question1: '',
        question2: '',
        question3: '',
        question4: '',
        question5: '',
        question6: '',
        question7: '',
        question8: '',
        question9: '',
        score: ''
    });

    const [sentimentalDetails, setSentimentalDetails] = useState({
        test1: '',
        test2: '',
        analysisText1: '',
        analysisText2: '',
        score: ''
    });

    const [totalScore, setTotalScore] = useState(0);
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
    
                        setPatientDetails({
                            credentials: {
                                walletAddress: patientCredentials[0],
                                name: String(patientCredentials[1]),
                                healthID: String(patientCredentials[2]),
                                email: String(patientCredentials[3]),
                            },
                            personalDetails: {
                                gender: String(patientPersonalDetails[0]),
                                age: patientPersonalDetails[1],
                                date: String(patientPersonalDetails[2]),
                                month: String(patientPersonalDetails[3]),
                                year: String(patientPersonalDetails[4]),
                                maritalStatus: String(patientPersonalDetails[5]),
                                disabilities: String(patientPersonalDetails[6]),
                            }
                        });
                    } else {
                        setError('PatientRegistration smart contract not deployed on the detected network.');
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

    const [response, setResponse] = useState();

    useEffect(() => {
        const init = async () => {
            if (!window.ethereum) {
                setError('MetaMask not detected. Please install the MetaMask extension.');
                setLoading(false);
                return;
            }

            const web3Instance = new Web3(window.ethereum);
            try {
                await window.ethereum.enable();

                const networkId = await web3Instance.eth.net.getId();
                const contractAddress = MentalHealth.networks[networkId]?.address;

                if (!contractAddress) {
                    setError('MentalHealth smart contract not deployed on the detected network.');
                    setLoading(false);
                    return;
                }

                const contract = new web3Instance.eth.Contract(
                    MentalHealth.abi,
                    contractAddress
                );

                const fetchedAllScores = await contract.methods
                    .getAllScores(testID)
                    .call();
                const fetchedChildhoodDetails = await contract.methods
                    .getChildhoodDetails(testID)
                    .call();
                const fetchedPHQ9Details = await contract.methods
                    .getPHQ9Details(testID)
                    .call();
                const fetchSentimentDetails = await contract.methods
                    .getSentimentDetails(testID)
                    .call();

                setScores({
                    historyScore: parseFloat(fetchedAllScores[0]) || 0,
                    phq9Score: parseFloat(fetchedAllScores[1]) || 0,
                    sentimentalScore: parseFloat(fetchedAllScores[2]) || 0,
                    videoScore: parseFloat(fetchedAllScores[3]) || 0,
                });

                setChildHoodDetails(fetchedChildhoodDetails);
                setphq9Details(fetchedPHQ9Details);
                setSentimentalDetails(fetchSentimentDetails);

                console.log(`Details for Test ID ${testID}:`);
                console.log(fetchedAllScores);
                console.log(fetchedChildhoodDetails);
                console.log(fetchedPHQ9Details);
                console.log(fetchSentimentDetails);
            } catch (err) {
                console.error(err);
                setError('Error accessing MetaMask or fetching data.');
            }
            setLoading(false);
        };

        init();
    }, [testID]);

    useEffect(() => {
        console.log('Updated Scores:', scores);
    }, [scores]);

    useEffect(() => {
        const history = parseFloat(scores.historyScore) || 0;
        const phq9 = parseFloat(scores.phq9Score) || 0;
        const sentimental = parseFloat(scores.sentimentalScore) || 0;
        const video = parseFloat(scores.videoScore) || 0;

        if (history && phq9 && sentimental && video) {
            const total = (0.1 * history + 0.6 * phq9 + 0.2 * sentimental + 0.1 * video) * 100;
            setTotalScore(Math.round(total));
        }
    }, [scores]);

    useEffect(() => {
        console.log('Updated Total Score:', totalScore);
    }, [totalScore]);

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

    const numericalHistoryScore = parseFloat(scores.historyScore).toFixed(3);
    const numericalPHQ9Score = parseFloat(scores.phq9Score).toFixed(3);
    const numericalSentimentalScore = parseFloat(scores.sentimentalScore).toFixed(3);
    const numericalVideoScore = parseFloat(scores.videoScore).toFixed(3);

    const depressionScore = Math.round((0.2*numericalHistoryScore + 0.5*numericalPHQ9Score + 0.2*numericalSentimentalScore + 0.1*numericalVideoScore) * 100);

    const handleSubmit = async () => {
        if (!patientDetails) {
            setError('Patient details are not loaded yet.');
            return;
        }
    
        const requestData = {
            name: patientDetails.credentials.name,
            gender: patientDetails.personalDetails.gender,
            depScore: depressionScore,
        };
    
        try {
            const result = await axios.post('http://127.0.0.1:5000/results', requestData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            console.log(result);
            setResponse(result.data);
        } catch (err) {
            console.error("Error sending data:", err);
            setError(err.message);
        }
    };
    

    return (
        <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
            <div className="max-w-7xl mx-auto">
                <motion.div initial={{ opacity: 0, y: 20 }}animate={{ opacity: 1, y: 0 }}className="bg-white rounded-[40px] shadow-xl p-8 mb-8" >
                    <img src={gemini} alt="Gemini" className="absolute w-32 ml-20 opacity-50" />
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-[#1a5252] mb-4">
                            Mental Health Assessment Results
                        </h1>

                        <div className="inline-block bg-[#1a5252]/10 rounded-2xl p-6">
                            <span className="text-5xl font-bold text-[#1a5252]">
                                {depressionScore.toFixed(1)}%
                            </span>
                        </div>
                    </div>

                    <div className="flex justify-center gap-10 mt-8">
                        <button onClick={handleSubmit} className="bg-[#1a5252] hover:bg-[#153f3f] text-white font-bold py-3 px-6 rounded-lg text-xl transition duration-300 ease-in-out transform hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#1a5252] focus:ring-opacity-50" >
                            Get AI Advice
                        </button>

                        <Link to={`/patient/${healthID}/mht/${testID}`} className="inline-block bg-[#1a5252] hover:bg-[#153f3f] text-white font-bold py-3 px-8 rounded-lg text-xl transition duration-300 ease-in-out transform hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#1a5252] focus:ring-opacity-50" >
                            Back to Dashboard
                        </Link>
                    </div>
                </motion.div>

                <AnimatePresence>
                    {response && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="bg-white rounded-[40px] shadow-xl p-8" >
                            <div className="relative"> 
                                <div className="space-y-6">
                                    <div className="mb-8">
                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-2xl font-bold text-gray-800" >
                                            <AnimatedText text={`Analysis for ${response.name}`}delay={0} />
                                        </motion.div>

                                        <motion.div className="mt-4 text-xl text-gray-600">
                                            <AnimatedText text={`Severity: ${response.severity}`}delay={0.5} />
                                        </motion.div>
                                    </div>

                                    <ScrollableContainer className="space-y-4 max-h-[60vh] overflow-y-auto pr-4">
                                        {response.advice.map((step, index) => (
                                            <AdviceStep key={index} step={step.step} description={step.description} index={index} totalSteps={response.advice.length} />
                                        ))}
                                    </ScrollableContainer>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* <div className="text-center mt-8">
                    
                </div> */}
            </div>
        </div>
    );
}

export default Report;