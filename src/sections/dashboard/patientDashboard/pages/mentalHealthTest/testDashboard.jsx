import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import PatientRegistration from '../../../../../build/contracts/PatientRegistration.json';
import MentalHealth from '../../../../../build/contracts/MentalHealth.json';
import Web3 from 'web3';
import axios from "axios";

import deepFaceGraph from '/graph.jpg';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Brain, Activity, FileText, Video, AlertTriangle } from 'lucide-react';
import questionData from '../../data/questionData.json';
import { ScoreDistributionChart, EmotionTrendChart } from '../../components/AnalyticsCharts';

function TestDashboard() {
    const { healthID, testID } = useParams();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

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

    const [emotionDetails, setEmotionDetails] = useState({
        blinkCount: '',
        blinkPerMin: '',
    });

    const [totalScore, setTotalScore] = useState(0);

    const [patientDetails, setPatientDetails] = useState({
        name: '',
    });

    const [patientCredentials, setPatientCredentials] = useState({
        cryptoWalletAddress: '',
        name: '',
        healthID: '',
        email: '',
    });

    const getDepressionLevel = (score) => {
        if (score <= 30) return { level: 'Minimal', color: '#A7D397' }; // Pastel green
        if (score <= 50) return { level: 'Mild', color: '#FFDD94' };    // Pastel yellow
        if (score <= 70) return { level: 'Moderate', color: '#F9C5D1' }; // Pastel orange
        return { level: 'Severe', color: '#FF9B9B' };                    // Pastel red
    };

    const calculateDepressionScore = () => {
        const history = parseFloat(scores.historyScore) || 0;
        const phq9 = parseFloat(scores.phq9Score) || 0;
        const sentimental = parseFloat(scores.sentimentalScore) || 0;
        const video = parseFloat(scores.videoScore) || 0;
        return Math.round((0.2 * history + 0.5 * phq9 + 0.2 * sentimental + 0.1 * video) * 100);
    };

    const depressionScore = calculateDepressionScore();
    const depressionStatus = getDepressionLevel(depressionScore);

    const getSentimentColor = (text) => {
        const suicidalWords = ['suicide', 'suicidal', 'kill myself', 'end my life', 'die', 'death'];
        const positiveWords = ['positive', 'happy', 'good', 'excellent'];
        const negativeWords = ['negative', 'sad', 'bad', 'poor'];
        
        text = text.toLowerCase();
        if (suicidalWords.some(word => text.includes(word))) return 'text-red-600 font-bold';
        if (positiveWords.some(word => text.includes(word))) return 'text-green-600';
        if (negativeWords.some(word => text.includes(word))) return 'text-orange-600';
        return 'text-yellow-600';
    };

    const getChildhoodSeverityColor = (response) => {
        const highRiskResponses = [
            'Yes, an immediate family member',
            'Yes, a major event',
            'I sleep very little or excessively',
            'I have lost or gained significant weight recently',
            'Yes, it had a lasting emotional impact',
            'I feel isolated and have no one to talk to',
            'Yes, heavily'
        ];
        
        const moderateRiskResponses = [
            'Yes, a distant relative',
            'Yes, a minor event',
            'I have trouble falling asleep or staying asleep',
            'I eat more or less than usual',
            "A little, but it didn't affect me much",
            "I have some support, but it's limited",
            'Occasionally, but not regularly'
        ];

        if (highRiskResponses.includes(response)) return 'bg-red-500';
        if (moderateRiskResponses.includes(response)) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    const getPHQ9SeverityColor = (answer, questionIndex) => {
        // Special handling for suicidal thoughts (question 9)
        if (questionIndex === 8) {
            return {
                bg: parseInt(answer) > 0 ? 'bg-red-500' : 'bg-green-500',
                text: parseInt(answer) > 0 ? 'text-red-600 font-bold' : 'text-green-600'
            };
        }

        // For other questions
        if (parseInt(answer) === 3) return { bg: 'bg-red-500', text: 'text-red-600' };
        if (parseInt(answer) === 2) return { bg: 'bg-orange-500', text: 'text-orange-600' };
        if (parseInt(answer) === 1) return { bg: 'bg-yellow-500', text: 'text-yellow-600' };
        return { bg: 'bg-green-500', text: 'text-green-600' };
    };

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

                // Initialize both contracts
                const mentalHealthContract = new web3Instance.eth.Contract(
                    MentalHealth.abi,
                    MentalHealth.networks[networkId]?.address
                );

                const patientContract = new web3Instance.eth.Contract(
                    PatientRegistration.abi,
                    PatientRegistration.networks[networkId]?.address
                );

                // Fetch patient details first
                const patientData = await patientContract.methods
                    .getPatientPersonalDetails(healthID)
                    .call();

                const patientCredentials = await patientContract.methods
                    .getPatientCredentials(healthID)
                    .call();

                console.log(patientData);

                setPatientCredentials({
                    cryptoWalletAddress: patientCredentials.cryptoWalletAddress,
                    name: patientCredentials.name,
                    healthID: patientCredentials.healthID,
                    email: patientCredentials.email
                });

                setPatientDetails({
                    name: patientData.name,
                    age: patientData.age,
                    date: patientData.date,
                    month: patientData.month,
                    year: patientData.year,
                    maritalStatus: patientData.maritalStatus,
                    disabled: patientData.disabled,
                });
                
                setPatientDetails({
                    name: patientData.name,
                    age: patientData.age,
                    gender: patientData.gender,
                    mobile: patientData.mobile,
                    email: patientData.email
                });

                const fetchedAllScores = await mentalHealthContract.methods
                    .getAllScores(testID)
                    .call();
                const fetchedChildhoodDetails = await mentalHealthContract.methods
                    .getChildhoodDetails(testID)
                    .call();
                const fetchedPHQ9Details = await mentalHealthContract.methods
                    .getPHQ9Details(testID)
                    .call();
                const fetchSentimentDetails = await mentalHealthContract.methods
                    .getSentimentDetails(testID)
                    .call();
                const fetctEmotionDetails = await mentalHealthContract.methods
                    .getEmotionDetails(testID)
                    .call();

                console.log(fetchedAllScores);

                setScores({
                    historyScore: fetchedAllScores[0],
                    phq9Score: fetchedAllScores[1],
                    sentimentalScore: fetchedAllScores[2],
                    videoScore: fetchedAllScores[3],
                });

                setChildHoodDetails({
                    question1: fetchedChildhoodDetails[0],
                    question2: fetchedChildhoodDetails[1],
                    question3: fetchedChildhoodDetails[2],
                    question4: fetchedChildhoodDetails[3],
                    question5: fetchedChildhoodDetails[4],
                    question6: fetchedChildhoodDetails[5],
                    question7: fetchedChildhoodDetails[6],
                    score: fetchedChildhoodDetails[7]
                });

                setphq9Details(fetchedPHQ9Details);

                setEmotionDetails({
                    blinkCount: fetctEmotionDetails[0],
                    blinkPerMin: fetctEmotionDetails[1]
                })

                setSentimentalDetails({
                    test1: fetchSentimentDetails[0],
                    test2: fetchSentimentDetails[1],
                    analysisText1: fetchSentimentDetails[2],
                    analysisText2: fetchSentimentDetails[3],
                    score: fetchSentimentDetails[4]
                });

                console.log(`Details for Test ID ${testID}:`);
                console.log(fetchedAllScores);
                console.log(fetchedChildhoodDetails);
                console.log(fetchedPHQ9Details);
                console.log(fetctEmotionDetails);
                console.log(fetchSentimentDetails);
            } catch (err) {
                console.error(err);
                setError('Error accessing MetaMask or fetching data.');
            }
            setLoading(false);
        };

        init();
    }, [testID, healthID]);

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

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'http://127.0.0.1:5000/depression_score',
        headers: { 
          'Content-Type': 'application/json'
        },
        data : scores
    };
      
    axios.request(config)
        .then((response) => {
            console.log(JSON.stringify(response.data));
    })
        .catch((error) => {
            console.log(error);
    });

    useEffect(() => {
        const history = scores.historyScore;
        const phq9 = scores.phq9Score;
        const sentimental = scores.sentimentalScore;
        const video = scores.videoScore;

        if (history && phq9 && sentimental && video) {
            const total = (0.1 * history + 0.6 * phq9 + 0.2 * sentimental + 0.1 * video) * 100;
            setTotalScore(Math.round(total));
        }
    }, [scores]);

    const [historyScore, setHistoryScore] = useState();
    useEffect(() => {
        const history = scores.historyScore;

        if (history) {
            const total = scores.historyScore * 100;
            setHistoryScore(Math.round(total));
        }
    }, [scores]);

    const [PHQ9Score, setPHQ9Score] = useState();
    useEffect(() => {
        const PHQ9Score = scores.phq9Score;

        if (PHQ9Score) {
            const total = scores.phq9Score * 100;
            setPHQ9Score(Math.round(total));
        }
    }, [scores]);

    const [sentimentalScore, setSentimentalScore] = useState();
    useEffect(() => {
        const SentimentalScore = scores.sentimentalScore;

        if (SentimentalScore) {
            const total = scores.sentimentalScore * 100;
            setSentimentalScore(Math.round(total));
        }
    }, [scores]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center space-y-3">
                    <div className="animate-spin w-8 h-8 border-4 border-[#266666] border-t-transparent rounded-full mx-auto"/>
                    <p className="text-gray-600">Loading assessment data...</p>
                </div>
            </div>
        );
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

    return (
        <div className="min-h-screen w-full p-4">
            <div className="fixed w-[calc(100%-200px)] border border-gray-200 p-10 flex flex-row justify-between items-start rounded-3xl backdrop-blur-lg z-10">
                <h1 className="text-4xl font-googleSansBold text-gray-800">Mental Health Assessment</h1>

                <div className="flex flex-row justify-center items-center">
                    <p className="font-googleSansMedium">
                        <span className="text-lg">Test ID: </span>
                        <span className="text-lg text-gray-700">{testID}</span>
                    </p>
                </div>
            </div>

            <div className="w-full mx-auto pt-32 px-10 space-y-6">
                <div className="p-4">
                    <div className="flex justify-between items-start gap-4">
                        <div className="space-y-4">
                            <div className="w-[800px]">
                                <div className="pt-10 pb-10 pr-10 rounded-lg">
                                    <h3 className="font-googleSansMedium text-2xl text-gray-700 mb-3">Personal Details</h3>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-center justify-between">
                                            <span className="font-googleSansRegular text-lg text-gray-600">Name:</span>
                                            <span className="font-googleSansRegular text-lg">{patientCredentials.name}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="font-googleSansRegular text-lg text-gray-600">Health ID:</span>
                                            <span className="font-googleSansRegular text-lg">{patientCredentials.healthID}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="font-googleSansRegular text-lg text-gray-600">Email:</span>
                                            <span className="font-googleSansRegular text-lg">{patientCredentials.email}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="font-googleSansRegular text-lg text-gray-600">Wallet:</span>
                                            <span className="font-googleSansRegular text-lg">
                                                {patientCredentials.cryptoWalletAddress}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-8">
                            <div className="w-80 h-80 ">
                                <ScoreDistributionChart scores={scores} />
                            </div>
                            <div className="w-[200px] h-[200px]">
                                <CircularProgressbar value={depressionScore} text={`${depressionScore}%`} strokeWidth={12} styles={buildStyles({ pathColor: depressionStatus.color, textColor: depressionStatus.color, trailColor: '#F5F5F5' })} />
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 inline-flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded">
                        <AlertTriangle size={16} className="text-gray-600" />
                        <span className="text-gray-700">Depression Level: 
                            <span style={{ color: depressionStatus.color }} className="font-medium ml-1">
                                {depressionStatus.level}
                            </span>
                        </span>
                    </div>
                </div>

                {/* Score Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <ScoreCard
                        title="History Score"
                        score={numericalHistoryScore * 100}
                        icon={<FileText className="w-6 h-6 text-emerald-600" />} // Increased icon size
                        detail="Background Assessment"
                    />
                    <ScoreCard
                        title="PHQ-9 Score"
                        score={numericalPHQ9Score * 100}
                        icon={<Activity className="w-6 h-6 text-blue-600" />} // Increased icon size
                        detail="Depression Screening"
                    />
                    <ScoreCard
                        title="Sentiment Score"
                        score={numericalSentimentalScore * 100}
                        icon={<Brain className="w-6 h-6 text-purple-600" />} // Increased icon size
                        detail="Emotional Analysis"
                    />
                    <ScoreCard
                        title="Video Analysis"
                        score={numericalVideoScore * 100}
                        icon={<Video className="w-6 h-6 text-red-600" />} // Increased icon size
                        detail="Facial Expression"
                    />
                </div>


                {/* Emotion Graph Card */}
                <div className="bg-white p-4">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-googleSansBold text-gray-800">Emotional Expression Analysis</h2>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center justify-between">
                                <span className="font-googleSansMedium text-lg text-gray-600">Total Blink Count</span>
                                <span className="text-xl font-googleSansRegular text-gray-800">{emotionDetails.blinkCount}</span>
                            </div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center justify-between">
                                <span className="font-googleSansMedium text-lg text-gray-600">Blinks per Minute</span>
                                <span className="text-xl font-googleSansRegular text-gray-800">{emotionDetails.blinkPerMin}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Analysis Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* PHQ-9 Card with Severity Indicators */}
                    <div className="bg-white p-4">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-googleSansBold text-gray-800">PHQ-9 Analysis</h2>
                        </div>
                        <div className="space-y-4">
                            {questionData.phq9.questions.map((question, index) => {
                                const severity = getPHQ9SeverityColor(phq9Details[`${index}`], index);
                                return (
                                    <div key={index} className="space-y-2">
                                        <p className="text-gray-600 font-googleSansMedium text-base">Q{index + 1}. {question.text}</p>
                                        <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                                            <span className="text-gray-700 font-albulaRegular">Response:</span>
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${severity.bg}`} />
                                                <span className={`font-googleSansMedium ${severity.text}`}>
                                                    {question.options[phq9Details[`${index}`]] || 'No response'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            
                            <div className=" p-3 bg-gray-50 rounded-lg">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 font-googleSansMedium text-xl">Overall PHQ-9 Score:</span>
                                    <span className={`font-googleSansBold text-xl ${
                                        parseFloat(phq9Details.score) > 0.7 ? 'text-red-600' :
                                        parseFloat(phq9Details.score) > 0.5 ? 'text-orange-600' :
                                        parseFloat(phq9Details.score) > 0.3 ? 'text-yellow-600' :
                                        'text-green-600'
                                    }`}>
                                        {numericalPHQ9Score * 100} %
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sentiment Analysis with Trend */}
                    <div className="bg-white p-4">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-googleSansBold text-gray-800">Sentiment Analysis</h2>
                        </div>

                        <div className="mt-20 w-full flex flex-col justify-center items-center">
                            <EmotionTrendChart emotionData={[
                                { timestamp: 'Start', value: 0.5 },
                                { timestamp: 'Middle', value: parseFloat(sentimentalDetails.score) },
                                { timestamp: 'End', value: parseFloat(scores.sentimentalScore) }
                            ]} />
                            <h3 className="text-lg font-googleSansMedium text-gray-800 mt-6">Sentiment Trend</h3>
                        </div>

                        <div className="space-y-4 mt-20">
                            {questionData.sentiment.questions.map((question, index) => (
                                <div key={index} className="space-y-2">
                                    <p className="text-gray-600 font-googleSansMedium text-base">Q{index + 1}. {question.text}</p>
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <p className="text-gray-800 whitespace-pre-wrap font-googleSansMedium">
                                            <span className="text-gray-700 font-googleSansRegular">User's Response: </span>
                                            {index === 0 ? sentimentalDetails.test1 : sentimentalDetails.test2}
                                        </p>
                                        <div className="mt-2 flex justify-between items-center text-sm">
                                            <span className="text-gray-600">ML Analysis:</span>
                                            <span className={`font-googleSansMedium ${getSentimentColor(
                                                index === 0 ? sentimentalDetails.analysisText1 : sentimentalDetails.analysisText2
                                            )}`}>
                                                {index === 0 ? sentimentalDetails.analysisText1 : sentimentalDetails.analysisText2}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 text-xl font-googleSansMedium">Overall Sentiment Score:</span>
                                    <span className="text-[#266666] font-googleSansBold text-xl">
                                        {sentimentalDetails.score ? `${(parseFloat(sentimentalDetails.score) * 100).toFixed(1)}%` : 'N/A'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Childhood Assessment Card */}
                <div className="bg-white p-4">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-googleSansBold text-gray-800">Childhood Assessment</h2>
                    </div>
                    <div className="space-y-4">
                        {questionData.childhood.questions.map((question, index) => (
                            <div key={index} className="space-y-2">
                                <p className="text-gray-600 font-googleSansMedium text-base">Q{index + 1}. {question.text}</p>
                                <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                                    <span className="text-gray-700 font-albulaRegular">Response:</span>
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${getChildhoodSeverityColor(childHoodDetails[`question${index + 1}`])}`} />
                                        <span className={`font-googleSansMedium ${
                                            getChildhoodSeverityColor(childHoodDetails[`question${index + 1}`]) === 'bg-red-500' ? 'text-red-600' :
                                            getChildhoodSeverityColor(childHoodDetails[`question${index + 1}`]) === 'bg-yellow-500' ? 'text-yellow-600' :
                                            'text-green-600'
                                        }`}>
                                            {childHoodDetails[`question${index + 1}`] || 'No response'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600 text-xl font-googleSansMedium">Overall Childhood Assessment Score:</span>
                                <span className="text-[#266666] font-googleSansBold text-xl">
                                    {childHoodDetails.score ? `${(parseFloat(childHoodDetails.score) * 100).toFixed(1)}%` : 'N/A'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <img src={deepFaceGraph} alt="Emotion Analysis" className="w-full rounded-xl" />
            </div>
        </div>
    );
}

const ScoreCard = ({ title, score, icon, detail }) => {
    return (
        <div className="bg-white border-2 border-gray-100 rounded-xl p-4 py-7 cursor-pointer hover:shadow-md hover:-translate-y-1 transition-all ease-in-out">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    {icon}
                    <h3 className="text-gray-800 font-googleSansBold text-2xl">{title}</h3>
                </div>
                <div className="text-2xl font-googleSansBold text-gray-800">{score.toFixed(1)}%</div>
            </div>
            <p className="font-albulaRegular text-gray-500 text-base">{detail}</p>
        </div>
    );
};

export default TestDashboard;