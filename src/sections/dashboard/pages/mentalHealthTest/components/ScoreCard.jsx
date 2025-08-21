const ScoreCard = ({ title, score = 0, icon, detail }) => {
    const formatted = typeof score === 'number' ? score.toFixed(1) : `${parseFloat(score || 0).toFixed(1)}`;
    return (
        <div className="bg-white p-4">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    {icon}
                    <h3 className="text-gray-800 font-medium">{title}</h3>
                </div>
                <div className="text-xl font-medium text-gray-800">{formatted}%</div>
            </div>
            <p className="text-gray-500 text-sm">{detail}</p>
        </div>
    );
};

export default ScoreCard;