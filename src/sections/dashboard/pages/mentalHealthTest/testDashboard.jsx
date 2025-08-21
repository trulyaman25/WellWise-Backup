import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import deepFaceGraph from '/graph.jpg';
import { Brain, Activity, FileText, Video, AlertTriangle } from 'lucide-react';
import questionData from '../../essentialData/questionData.json';
import ScoreCard from './components/ScoreCard';
import PatientOverview from './components/PatientOverview';
import EmotionCard from './components/EmotionCard';
import PHQ9Analysis from './components/PHQ9Analysis';
import SentimentAnalysis from './components/SentimentAnalysis';
import ChildhoodAssessment from './components/ChildhoodAssessment';

import { usePatientData } from '../../dataProvider/PatientDataProvider';
import TestDetailProvider, { useTestDetail } from '../../dataProvider/TestDetailProvider';

function TestDashboardInner() {
    const { patientDetails } = usePatientData();
    const { 
        scores: providerScores, 
        childHoodDetails: providerChildhood, 
        phq9Details: providerPHQ9, 
        sentimentalDetails: providerSentiment, 
        emotionDetails: providerEmotion, 
        loading: providerLoading, 
        error: providerError 
    } = useTestDetail();

    const { testID } = useParams();
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

    const [patientCredentials, setPatientCredentials] = useState({
        cryptoWalletAddress: '',
        name: '',
        healthID: '',
        email: '',
    });

    useEffect(() => {
        if (patientDetails && patientDetails.credentials) {
            setPatientCredentials({
                cryptoWalletAddress: patientDetails.credentials.walletAddress || '',
                name: patientDetails.credentials.name || '',
                healthID: patientDetails.credentials.healthID || '',
                email: patientDetails.credentials.email || ''
            });
        }
    }, [patientDetails]);

    useEffect(() => {
        if (providerScores) setScores(providerScores);
        if (providerChildhood) setChildHoodDetails(providerChildhood);
        if (providerPHQ9) setphq9Details(providerPHQ9);
        if (providerEmotion) setEmotionDetails(providerEmotion);
        if (providerSentiment) setSentimentalDetails(providerSentiment);
        if (providerError) setError(providerError);
        if (providerLoading !== undefined) setLoading(providerLoading);
    }, [providerScores, providerChildhood, providerPHQ9, providerSentiment, providerEmotion, providerLoading, providerError]);

    const getDepressionLevel = (score) => {
        if (score <= 30) return { level: 'Minimal', color: '#A7D397' };
        if (score <= 50) return { level: 'Mild', color: '#FFDD94' };
        if (score <= 70) return { level: 'Moderate', color: '#F9C5D1' };
        return { level: 'Severe', color: '#FF9B9B' };
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
        if (questionIndex === 8) {
            return {
                bg: parseInt(answer) > 0 ? 'bg-red-500' : 'bg-green-500',
                text: parseInt(answer) > 0 ? 'text-red-600 font-bold' : 'text-green-600'
            };
        }

        if (parseInt(answer) === 3) return { bg: 'bg-red-500', text: 'text-red-600' };
        if (parseInt(answer) === 2) return { bg: 'bg-orange-500', text: 'text-orange-600' };
        if (parseInt(answer) === 1) return { bg: 'bg-yellow-500', text: 'text-yellow-600' };
        return { bg: 'bg-green-500', text: 'text-green-600' };
    };

    useEffect(() => {
        console.log('Updated Scores:', scores);
    }, [scores]);

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'http://127.0.0.1:5001/depression_score',
        headers: { 
          'Content-Type': 'application/json'
        },
        data : scores
    };
      
    axios.request(config)
        .then((response) => { console.log(JSON.stringify(response.data)); })
        .catch((error) => { console.log(error); });

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
        <>
            <div className="min-h-screen max-w-[calc(100vw-350px)] p-4">
                <div className="fixed w-[calc(100%-385px)] border border-gray-200 p-10 flex flex-row justify-between items-start rounded-3xl backdrop-blur-lg z-10">
                    <h1 className="text-4xl font-googleSansBold text-gray-800">Mental Health Assessment</h1>

                    <div className="flex flex-row justify-center items-center">
                        <p className="font-googleSansMedium">
                            <span className="text-lg">Test ID: </span>
                            <span className="text-lg text-gray-700">{testID}</span>
                        </p>
                    </div>
                </div>
                
                <div className="w-full px-5 mx-auto space-y-8 pt-32">
                        {/* Patient Overview Section */}
                        <PatientOverview patientCredentials={patientCredentials} depressionScore={depressionScore} depressionStatus={depressionStatus} scores={scores} />

                    <hr className="border-gray-200" />

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <ScoreCard title="History Score" score={numericalHistoryScore * 100} icon={<FileText className="w-5 h-5 text-emerald-600" />} detail="Background Assessment" />
                        <ScoreCard title="PHQ-9 Score" score={numericalPHQ9Score * 100} icon={<Activity className="w-5 h-5 text-blue-600" />} detail="Depression Screening" />
                        <ScoreCard title="Sentiment Score" score={numericalSentimentalScore * 100} icon={<Brain className="w-5 h-5 text-purple-600" />} detail="Emotional Analysis" />
                        <ScoreCard title="Video Analysis" score={numericalVideoScore * 100} icon={<Video className="w-5 h-5 text-red-600" />} detail="Facial Expression" />
                    </div>

                    <hr className="border-gray-200" />

                    {/* Emotion Graph Card */}
                    <EmotionCard emotionDetails={emotionDetails} />

                    <hr className="border-gray-200" />

                    {/* Analysis Sections */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <PHQ9Analysis questionData={questionData} phq9Details={phq9Details} getPHQ9SeverityColor={getPHQ9SeverityColor} numericalPHQ9Score={numericalPHQ9Score} />
                        <SentimentAnalysis sentimentalDetails={sentimentalDetails} scores={scores} questionData={questionData} getSentimentColor={getSentimentColor} />
                    </div>

                    <hr className="border-gray-200" />

                    <ChildhoodAssessment questionData={questionData} childHoodDetails={childHoodDetails} getChildhoodSeverityColor={getChildhoodSeverityColor} />

                    <hr className="border-gray-200" />

                    <img src={deepFaceGraph} alt="Emotion Analysis" className="w-full rounded-xl" />
                </div>
            </div>
        </>
    );
}

function TestDashboardWrapper() {
    const { testID } = useParams();
    return (
        <TestDetailProvider testID={testID}>
            <TestDashboardInner />
        </TestDetailProvider>
    );
}

export default TestDashboardWrapper;