import React from "react";
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from 'recharts';

export default function EliaPieChart({currentReport}){

    const data = [
        { name: 'Group A', value: 100 },
        { name: 'Group B', value: 37 },
    ];

    const COLORS = [`rgba(21, 163, 165, 1)`, `rgba(21, 163, 165, 0.2)`, '#FFBB28', '#FF8042'];

    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);
        return (
            <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                {/*{`${(percent * 100).toFixed(0)}%`}*/}
                {`${(percent * 100).toFixed(0)}`}
            </text>
        );
    }

    return(
            // <ResponsiveContainer width="100%" height="100%">
                <PieChart width={200} height={200}>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomizedLabel}
                        outerRadius={70}
                        fill="pink"
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                </PieChart>
            // </ResponsiveContainer>
    )
}