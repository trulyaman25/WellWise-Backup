import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const PASTEL_COLORS = ['#A7D397', '#F9C5D1', '#B5EAEA', '#FFDD94'];

export const ScoreDistributionChart = ({ scores }) => {
    const data = [
        { name: 'History', value: scores.historyScore * 100 },
        { name: 'PHQ-9', value: scores.phq9Score * 100 },
        { name: 'Sentiment', value: scores.sentimentalScore * 100 },
        { name: 'Video', value: scores.videoScore * 100 },
    ];

    return (
        <div className="w-32 h-32">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie data={data} innerRadius={40} outerRadius={55} paddingAngle={4} dataKey="value" stroke="none" cornerRadius={100} >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={PASTEL_COLORS[index % PASTEL_COLORS.length]} />
                        ))}
                    </Pie>
                    
                    <Tooltip contentStyle={{ backgroundColor: 'white',borderRadius: '4px',padding: '8px',border: 'none' }} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export const EmotionTrendChart = ({ emotionData }) => {
    return (
        <div className="w-fit p-2">
            <ResponsiveContainer width={380} height={300}>
                <LineChart data={emotionData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#EEEEEE" />
                    <XAxis dataKey="timestamp" tick={{ fill: "#666666" }} />
                    <YAxis tick={{ fill: "#666666" }} />
                    <Tooltip contentStyle={{ border: 'none', borderRadius: '4px' }} />
                    <Line type="monotone" dataKey="value" stroke="#666666" strokeWidth={2} dot={{ fill: '#666666', r: 3 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};