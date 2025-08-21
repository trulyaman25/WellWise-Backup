const ChildhoodAssessment = ({ questionData, childHoodDetails, getChildhoodSeverityColor }) => {
    return (
        <div className="bg-white p-4">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-googleSansBold text-gray-800">Childhood Assessment</h2>
            </div>
            <div className="space-y-4">
                {questionData.childhood.questions.map((question, index) => (
                    <div key={index} className="space-y-2">
                        <p className="text-gray-600 text-sm">{question.text}</p>
                        <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                            <span className="text-gray-800">Selected:</span>
                            <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${getChildhoodSeverityColor(childHoodDetails[`question${index + 1}`])}`} />
                                <span className={`font-medium ${
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
                        <span className="text-gray-600">Overall Childhood Assessment Score:</span>
                        <span className="font-medium text-[#266666]">
                            {childHoodDetails.score ? `${(parseFloat(childHoodDetails.score) * 100).toFixed(1)}%` : 'N/A'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChildhoodAssessment;
