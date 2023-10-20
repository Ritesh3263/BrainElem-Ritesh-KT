import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { new_theme } from 'NewMuiTheme';
import { ThemeProvider } from '@mui/material';

function PerformancePieChart(props) {
    const {
        data=[],
    } = props;
    const COLORS = [new_theme.palette.neutrals.grey50,new_theme.palette.secondary.Turquoise,new_theme.palette.primary.LightPurple];
    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, value, name, grade }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                {name !=='MAX_VALUE' ? grade : ''}
            </text>
        );
    };

    return (
        <ThemeProvider theme={new_theme}>
        <ResponsiveContainer debounce={1} width="100%" height="100%">
            <PieChart>
                <Legend layout="vertical" verticalAlign="top" align="right" />
                <Pie
                    data={data}
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={90}
                    fill={new_theme.palette.newSupplementary.NSupText}
                    dataKey="percentageValue"
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
            </PieChart>
        </ResponsiveContainer>
        </ThemeProvider>
    );
}

export default PerformancePieChart;