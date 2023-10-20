import React, {lazy} from 'react';

const Assistance = lazy(()=>import("../Assistance"));
const MyTaskList = lazy(()=>import("../MyTaskList"));
const MyPerformance = lazy(()=>import("../MyPerformance"));
const UpcomingEvents = lazy(()=>import("../UpcomingEvents"));
const MyLastContent = lazy(()=>import("../MyLastContent"));
const ActivityPreview = lazy(()=>import("../ActivityPreview"));

const TrainerSessionManagerDashboard=(props)=> {
    const{}=props;

    return (
        <>
            <Assistance />
            <MyPerformance type={'TRAINER'} />
            <UpcomingEvents />
            <MyLastContent />
            <ActivityPreview />
            <MyTaskList role='TRAINER' />
            {/* <Assistance beginning={3} size={3}/> */}
        </>
    )
}

export default TrainerSessionManagerDashboard;