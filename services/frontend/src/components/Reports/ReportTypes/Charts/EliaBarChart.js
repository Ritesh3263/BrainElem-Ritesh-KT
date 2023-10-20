import React from "react";
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
    {
        name: 'Subject A',
        classAverage: 4000,
        studentGrade: 2400,
        amt: 2400,
    },
    {
        name: 'Subject B',
        classAverage: 3000,
        studentGrade: 1398,
        amt: 2210,
    },
    {
        name: 'Subject C',
        classAverage: 2000,
        studentGrade: 9800,
        amt: 2290,
    },
    {
        name: 'Subject D',
        classAverage: 2780,
        studentGrade: 3908,
        amt: 2000,
    },
    {
        name: 'Subject E',
        classAverage: 1890,
        studentGrade: 4800,
        amt: 2181,
    },
    {
        name: 'Subject F',
        classAverage: 2390,
        studentGrade: 3800,
        amt: 2500,
    },
    {
        name: 'Subject G',
        classAverage: 3490,
        studentGrade: 4300,
        amt: 2100,
    },
];
export default function EliaBarChart({currentReport}){
    return(
        // <ResponsiveContainer width="100%" height="100%">
            <BarChart
                width={700}
                height={300}
                data={data}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="studentGrade" fill="#8884d8" />
                <Bar dataKey="classAverage" fill="#82ca9d" />
            </BarChart>
        // </ResponsiveContainer>
    )
}