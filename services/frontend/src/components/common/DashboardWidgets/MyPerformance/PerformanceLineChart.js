import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


const PerformanceLineChart=(props)=>{
        const{
            data=[],
        }=props;
        return (
            <ResponsiveContainer debounce={1} width="100%" height="100%">
                <LineChart
                    data={data}
                    margin={{
                        top: 10,
                        right: 50,
                        left: 20,
                        bottom: 15,
                    }}
                >
                    <CartesianGrid strokeDasharray="4 1" horizontal={true} vertical={false}/>
                    <XAxis dataKey="day" type='category'/>
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="linear" dataKey="onScreen" stroke="rgba(168, 92, 255, 1)" strokeWidth={4}/>
                    <Line type="linear" dataKey="offScreen" stroke="rgba(21, 163, 165, 1)" strokeWidth={4}/>
                </LineChart>
            </ResponsiveContainer>
        );
}

export default PerformanceLineChart;