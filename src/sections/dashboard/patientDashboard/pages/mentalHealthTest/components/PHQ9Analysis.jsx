const PHQ9Analysis = ({ questionData, phq9Details, getPHQ9SeverityColor, numericalPHQ9Score }) => {
    return (
        <div className="bg-white p-4">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-googleSansBold text-gray-800">PHQ-9 Analysis</h2>
            </div>
            <div className="space-y-4">
                {questionData.phq9.questions.map((question, index) => {
                    const severity = getPHQ9SeverityColor(phq9Details[`${index}`], index);
                    return (
                        <div key={index} className="space-y-2">
                            <p className="text-gray-600 text-sm">{question.text}</p>
                            <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                                <span className="text-gray-800">Response:</span>
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${severity.bg}`} />
                                    <span className={`font-medium ${severity.text}`}>
                                        {question.options[phq9Details[`${index}`]] || 'No response'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600">Overall PHQ-9 Score:</span>
                        <span className={`font-medium ${
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
    );
};

export default PHQ9Analysis;
