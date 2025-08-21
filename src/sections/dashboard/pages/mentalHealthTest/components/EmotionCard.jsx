import React from 'react';

const EmotionCard = ({ emotionDetails }) => {
    return (
        <div className="bg-white p-4">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-googleSansBold text-gray-800">Emotional Expression Analysis</h2>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                        <span className="text-gray-600">Total Blink Count</span>
                        <span className="text-xl font-medium text-gray-800">{emotionDetails.blinkCount}</span>
                    </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                        <span className="text-gray-600">Blinks per Minute</span>
                        <span className="text-xl font-medium text-gray-800">{emotionDetails.blinkPerMin}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmotionCard;
