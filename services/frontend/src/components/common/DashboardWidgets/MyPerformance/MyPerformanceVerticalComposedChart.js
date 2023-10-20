import React from 'react';
import {
    ComposedChart,
    Bar,
    XAxis,
    YAxis,
    Legend,
    ResponsiveContainer,
} from 'recharts';

const MyPerformanceVerticalComposedChart=(props)=> {
        const{
            data=[]
        }=props;
        return (
            <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                    layout="vertical"
                    data={data}
                    margin={{
                        top: 25,
                        right: 10,
                        bottom: 25,
                        left: 10,
                    }}
                >
                    <XAxis type="number" axisLine={false} tickLine={false} hide={true} />
                    <YAxis dataKey="name" type="category" scale="band" axisLine={false} tickLine={false} width={100}/>
                    <Legend />
                    <Bar dataKey="pv" fill='rgba(21, 163, 165, 1)' radius={30} barSize={20}/>
                </ComposedChart>
            </ResponsiveContainer>
        );
}

export default MyPerformanceVerticalComposedChart;