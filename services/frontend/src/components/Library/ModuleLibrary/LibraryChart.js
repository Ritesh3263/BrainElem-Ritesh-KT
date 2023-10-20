import React, {useEffect, useState} from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {useTranslation} from "react-i18next";
import LibraryService from "services/library.service";
import moment from "moment";


const LibraryChart=(props)=>{
    const{
        data=[],
    }=props;
    const [libraryData, setLibraryData] = useState([]);
    const { t } = useTranslation();

    useEffect(()=>{
        LibraryService.getLibraryData().then(res=>{
            let m = [5,4,3,2,1,0] // six months
            m = m.map(i=>{
                let month =  moment().subtract(i, 'months').format('MMM');
                let monthX = res.data.find(x=>x._id==moment().subtract(i, 'months').format('M'))
                return {
                    month,
                    accepted: monthX?.accepted||0,
                    awaiting: monthX?.awaiting||0,
                    rejected: monthX?.rejected||0,
                    other: monthX? (monthX.total-monthX.accepted-monthX.awaiting-monthX.rejected) : 0,
                    total: monthX?.total||0,
                }
            });
            setLibraryData(m);
        });
    },[]);
    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart
                data={libraryData}
                margin={{
                    top: 30,
                    right: 20,
                    left: -20,
                    bottom: 50,
                }}
            >
                <CartesianGrid strokeDasharray="4 1" horizontal={true} vertical={false}/>
                <XAxis dataKey="month" type='category'/>
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="linear" dataKey="accepted" stroke="rgba(168, 92, 255, 1)" strokeWidth={3}/>
                <Line type="linear" dataKey="awaiting" stroke="rgba(21, 163, 165, 1)" strokeWidth={3}/>
                <Line type="linear" dataKey="rejected" stroke="rgba(121, 163, 165, 1)" strokeWidth={3}/>
                <Line type="linear" dataKey="other" stroke="rgba(21, 63, 165, 1)" strokeWidth={3}/>
                <Line type="linear" dataKey="total" stroke="rgba(21, 163, 65, 1)" strokeWidth={3}/>
            </LineChart>
        </ResponsiveContainer>
    );
}

export default LibraryChart;