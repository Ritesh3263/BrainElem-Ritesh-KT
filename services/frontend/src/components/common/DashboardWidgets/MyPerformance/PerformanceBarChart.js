import React, {PureComponent} from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function PerformanceBarChart(props) {
    const {
        data=[],
    } = props;
    return (
        <ResponsiveContainer debounce={1} width="100%" height="100%">
            <BarChart width={150} height={40} data={data}>
                <Bar dataKey="activityTimePerDay" fill='rgba(21, 163, 165, 1)' radius={30} barSize={25}/>
                <Bar dataKey="awayTime" fill='rgba(21, 163, 165, 1)' radius={30} barSize={-5}/>
                <XAxis dataKey="day" axisLine={false} tickLine={false}/>
                {/*<Tooltip />*/}
                <Legend payload={[{value:'Activity time', type: 'circle', color:'rgba(21, 163, 165, 1)'}]}/>
            </BarChart>
        </ResponsiveContainer>
    );
}

export default PerformanceBarChart;