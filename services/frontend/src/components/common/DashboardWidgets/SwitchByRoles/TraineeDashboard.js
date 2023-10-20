import React, {lazy} from 'react';

const Assistance = lazy(()=>import("../Assistance"));
// const TipsForLearning = lazy(()=>import("../TipsForLearning"));
const MyTaskList = lazy(()=>import("../MyTaskList"));
const MyPerformance = lazy(()=>import("../MyPerformance"));
const UpcomingEvents = lazy(()=>import("../UpcomingEvents"));
const MyLastContent = lazy(()=>import("../MyLastContent"));
const MyAccomplishments = lazy(()=>import("../MyAccomplishments"));

const TraineeDashboard=(props)=> {
    const{}=props;

     return (
        <>
            <Assistance />
            {/* <TipsForLearning /> */}
            <MyTaskList role={'TRAINEE'} />
            <MyPerformance type={'TRAINEE'} />
            <UpcomingEvents />
            {/* <Assistance beginning={3} size={3}/> */}
            <MyLastContent/>
            <MyAccomplishments/>
        </>
     )
 }

export default TraineeDashboard;