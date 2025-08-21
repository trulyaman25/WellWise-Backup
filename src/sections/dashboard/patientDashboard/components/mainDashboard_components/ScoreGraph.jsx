import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ResponsiveContainer, LineChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const ScoreGraph = ({ data = [], dataKey = 'score', color = '#8b5cf6', title = '', icon = null }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const gradientId = `colorGradient-${color.replace('#', '')}`;

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} onClick={() => setIsExpanded(!isExpanded)} className="w-full bg-white p-6 rounded-2xl shadow-sm border border-gray-100 cursor-pointer transition-all duration-300 ease-in-out hover:shadow-lg" >
            <div className="flex items-center justify-between ">
                <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg" style={{ backgroundColor: `${color}20` }}>
                        {icon}
                    </div>
                    <div>
                        <h3 className="text-base font-googleSansBold text-gray-800">{title}</h3>
                        <p className="text-sm text-gray-500">
                            Last {data.length} tests
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-600">
                        Latest: {data[data.length - 1]?.score?.toFixed?.(3) || 'N/A'}
                    </span>
                </div>
            </div>
            
            <motion.div 
                initial={false}
                animate={{ 
                    height: isExpanded ? "200px" : "0px",
                    opacity: isExpanded ? 1 : 0,
                    marginTop: isExpanded ? "16px" : "0px"
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
            >
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                        <defs>
                            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={color} stopOpacity={0.34}/>
                                <stop offset="95%" stopColor={color} stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                        <XAxis dataKey="testId" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} tick={false} />
                        <Tooltip contentStyle={{ backgroundColor: '#fff',border: 'none',borderRadius: '8px',boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)' }}labelStyle={{ color: '#666' }}formatter={(value) => [Number(value).toFixed(3), "Score"]} />
                        <Area type="monotone" dataKey={dataKey} stroke={color} fillOpacity={1} fill={`url(#${gradientId})`} />
                        <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} dot={{ r: 4, strokeWidth: 2, fill: "#fff", stroke: color }} activeDot={{ r: 6, strokeWidth: 0, fill: color }} />
                    </LineChart>
                </ResponsiveContainer>
            </motion.div>
        </motion.div>
    );
};

export default ScoreGraph;
