import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

const CustomTooltip = ({ active, payload, label, focusedLine }) => {
    if (active && payload && payload.length) {
        const relevantData = payload.filter(p => !focusedLine || p.dataKey === focusedLine);
        
        return (
            <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-100">
                <p className="text-sm font-medium mb-2">{`Test ${label}`}</p>
                {relevantData.map((entry, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                        <span className="text-gray-600">{entry.name}:</span>
                        <span className="font-medium">{Number(entry.value).toFixed(3)}</span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

const UnifiedGraph = ({ data = [] }) => {
    const [focusedLine, setFocusedLine] = useState(null);

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
                <div>
                    <h3 className="text-2xl font-googleSansBold text-gray-800 mb-2">Mental Health Score Trends</h3>
                    <p className="text-gray-500 text-sm">Comprehensive view of all mental health parameters</p>
                </div>
                <div className="flex flex-wrap gap-4 sm:gap-6">
                    {[
                        { name: 'Childhood', key: 'childhood', color: '#0ea5e9' },
                        { name: 'PHQ-9', key: 'phq9', color: '#f97316' },
                        { name: 'Sentiment', key: 'sentiment', color: '#22c55e' },
                        { name: 'Final', key: 'final', color: '#8b5cf6' }
                    ].map(item => (
                        <div 
                            key={item.key}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-300 cursor-pointer hover:bg-gray-100"
                            style={{ 
                                backgroundColor: focusedLine === item.key ? `${item.color}15` : 'transparent',
                                border: `1px solid ${focusedLine === item.key ? item.color : 'transparent'}`
                            }}
                            onClick={() => setFocusedLine(prev => prev === item.key ? null : item.key)}
                        >
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                            <span className="text-sm text-gray-600 font-medium whitespace-nowrap">{item.name}</span>
                        </div>
                    ))}
                </div>
            </div>
            <div className="h-[250px] relative">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/5 pointer-events-none rounded-lg" />
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }} onMouseLeave={() => setFocusedLine(null)}>
                        <defs>
                            {[
                                { id: 'childhood', color: '#0ea5e9' },
                                { id: 'phq9', color: '#f97316' },
                                { id: 'sentiment', color: '#22c55e' },
                                { id: 'final', color: '#8b5cf6' }
                            ].map(gradient => (
                                <linearGradient key={gradient.id} id={gradient.id} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={gradient.color} stopOpacity={0.2} />
                                    <stop offset="95%" stopColor={gradient.color} stopOpacity={0.05} />
                                </linearGradient>
                            ))}
                        </defs>

                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                        <XAxis dataKey="testId" stroke="#666" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                        <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} tick={{ fontSize: 12 }} tickFormatter={value => value.toFixed(2)} />

                        <Tooltip content={<CustomTooltip focusedLine={focusedLine} />} cursor={{ stroke: '#666', strokeWidth: 1, strokeDasharray: '5 5', opacity: 0.5 }} />

                        {[
                            { key: 'childhood', color: '#0ea5e9', name: 'Childhood Score' },
                            { key: 'phq9', color: '#f97316', name: 'PHQ-9 Score' },
                            { key: 'sentiment', color: '#22c55e', name: 'Sentiment Score' },
                            { key: 'final', color: '#8b5cf6', name: 'Final Score' }
                        ].map(line => (
                            <Line
                                key={line.key}
                                name={line.name}
                                type="monotoneX"
                                dataKey={line.key}
                                stroke={line.color}
                                strokeWidth={focusedLine === line.key ? 3 : 2}
                                strokeOpacity={focusedLine ? (focusedLine === line.key ? 1 : 0.15) : 1}
                                fill={`url(#${line.key})`}
                                dot={{ r: focusedLine === line.key ? 6 : 4, strokeWidth: 2, fill: "#fff", stroke: line.color, opacity: focusedLine ? (focusedLine === line.key ? 1 : 0.15) : 1 }}
                                activeDot={{ r: 8, strokeWidth: 0, fill: line.color }}
                                onMouseEnter={() => setFocusedLine(line.key)}
                                onClick={() => setFocusedLine(prev => prev === line.key ? null : line.key)}
                                style={{ cursor: 'pointer' }}
                            />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
};

export default UnifiedGraph;
