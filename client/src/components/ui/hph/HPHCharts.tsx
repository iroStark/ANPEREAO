import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { HPHCard, HPHCardHeader, HPHCardContent } from './HPHCard';

interface HPHDistributionChartProps {
    title: string;
    data: Array<{ name: string; value: number; color: string }>;
}

export const HPHDistributionChart: React.FC<HPHDistributionChartProps> = ({ title, data }) => {
    return (
        <HPHCard>
            <HPHCardHeader>
                <h3 className="text-base font-bold text-foreground uppercase tracking-tight">{title}</h3>
            </HPHCardHeader>
            <HPHCardContent>
                <div className="h-[300px] min-h-[300px] w-full relative">
                    <ResponsiveContainer width="100%" height="100%" debounce={100}>
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                labelLine={true}
                                label={({percent}) => `${((percent || 0) * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip 
                                cursor={{fill: 'transparent'}}
                                contentStyle={{ 
                                    backgroundColor: 'hsl(var(--card))', 
                                    borderColor: 'hsl(var(--border))', 
                                    borderRadius: '12px', 
                                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                                    color: 'hsl(var(--foreground))' 
                                }}
                                itemStyle={{ color: 'hsl(var(--foreground))', fontSize: '12px', fontWeight: 'bold' }}
                            />
                            <Legend verticalAlign="bottom" height={36} iconType="circle" />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </HPHCardContent>
        </HPHCard>
    );
};

interface HPHBarChartProps {
    title: string;
    data: any[];
    dataKey: string;
}

export const HPHBarChart: React.FC<HPHBarChartProps> = ({ title, data, dataKey }) => {
    return (
        <HPHCard>
            <HPHCardHeader>
                <h3 className="text-base font-bold text-foreground uppercase tracking-tight">{title}</h3>
            </HPHCardHeader>
            <HPHCardContent>
                <div className="h-[300px] min-h-[300px] w-full relative">
                    <ResponsiveContainer width="100%" height="100%" debounce={100}>
                        <BarChart data={data} layout="vertical" margin={{ left: 20, right: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" opacity={0.5} />
                            <XAxis type="number" axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontWeight: 'bold'}} />
                            <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontWeight: 'bold'}} width={100} />
                            <Tooltip 
                                cursor={{fill: 'hsl(var(--accent))', opacity: 0.1}}
                                contentStyle={{ 
                                    backgroundColor: 'hsl(var(--card))', 
                                    borderColor: 'hsl(var(--border))', 
                                    borderRadius: '12px', 
                                    color: 'hsl(var(--foreground))' 
                                }}
                            />
                            {/* Uses primary color variable via CSS variable syntax which Recharts generally supports if defined in CSS, but for fill prop usually needs hex/rgb. 
                                Tailwind `bg-primary` sets `background-color`. 
                                We can try `hsl(var(--primary))` which works in modern browsers for SVG fill. */}
                            <Bar dataKey={dataKey} fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </HPHCardContent>
        </HPHCard>
    );
};
