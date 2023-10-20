import React, {lazy} from 'react';

const MyPerformance = lazy(()=>import("../MyPerformance"));
const MyLastEnquiries  = lazy(()=>import("../MyLastEnquiries"));
const Assistance = lazy(()=>import("../Assistance"));
const UpcomingEvents = lazy(()=>import("../UpcomingEvents"));
const ActivityPreview = lazy(()=>import("../ActivityPreview"));

const PartnerDashboard=(props)=> {
    const{}=props;

    return (
        <>
            <MyPerformance type={'TRAINER'}/>
            <MyLastEnquiries />
            <Assistance />
            <UpcomingEvents />
            <ActivityPreview sizeType='2/3'/>
        </>
    )
}

export default PartnerDashboard;