import React from 'react';
import { EmotionTrendChart } from '../../../components/testDashboard_components/AnalyticsCharts';

const SentimentAnalysis = ({ sentimentalDetails, scores, questionData, getSentimentColor }) => {
    return (
        <div className="bg-white p-4">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-googleSansBold text-gray-800">Sentiment Analysis</h2>
            </div>
            <div className="mt-20">
                <h3 className="text-lg font-googleSansMedium text-gray-800 mb-4">Sentiment Trend</h3>
                <EmotionTrendChart emotionData={[
                    { timestamp: 'Start', value: 0.5 },
                    { timestamp: 'Middle', value: parseFloat(sentimentalDetails.score) },
                    { timestamp: 'End', value: parseFloat(scores.sentimentalScore) }
                ]} />
            </div>
            <div className="space-y-4 mt-20">
                {questionData.sentiment.questions.map((question, index) => (
                    <div key={index} className="space-y-2">
                        <p className="text-gray-600 text-sm">{question.text}</p>
                        <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-gray-800 whitespace-pre-wrap">
                                <span className="text-gray-600 font-medium">User's Response: </span>
                                {index === 0 ? sentimentalDetails.test1 : sentimentalDetails.test2}
                            </p>
                            <div className="mt-2 flex justify-between items-center text-sm">
                                <span className="text-gray-600">ML Analysis:</span>
                                <span className={`font-medium ${getSentimentColor(
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
                        <span className="text-gray-600">Overall Sentiment Score:</span>
                        <span className="font-medium text-[#266666]">
                            {sentimentalDetails.score ? `${(parseFloat(sentimentalDetails.score) * 100).toFixed(1)}%` : 'N/A'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SentimentAnalysis;
