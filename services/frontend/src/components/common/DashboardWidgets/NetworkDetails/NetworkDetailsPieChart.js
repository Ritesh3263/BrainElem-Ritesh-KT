import React, {useEffect, useState} from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { new_theme } from 'NewMuiTheme';
import { ThemeProvider } from '@mui/material';


function NetworkDetailsPieChart(props) {
    const {
        data=[],
        type='',
    } = props;

    const [_data,_setData]=useState([]);

    useEffect(()=>{
        if(type==='STORAGE'){
            _setData(data?.storage||[])
        }else if(type ==='GRADE'){
            _setData(data?.averageGrade||[])
        }else{
            _setData(data?.averageFrequency||[])
        }
    },[type,data]);

    const COLORS = [new_theme.palette.other.lightPink, new_theme.palette.other.lightGreen, new_theme.palette.neutrals.yellow, new_theme.palette.neutrals.orange];
    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, value, name, unit }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                {name !=='REST_VALUE' ? `${value} ${unit||''}` : ''}
                {name === 'Frequency' && '%'}
            </text>
        );
    };

    return (
        <ThemeProvider theme={new_theme}>
        <ResponsiveContainer width="100%" height="100%">
            <PieChart width={100} height={100}>
                <Pie
                    data={_data}
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={80}
                    fill={new_theme.palette.newSupplementary.NSupText}
                    dataKey="value"
                >
                    {_data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
            </PieChart>
        </ResponsiveContainer>
        </ThemeProvider>
    );
}

export default NetworkDetailsPieChart;