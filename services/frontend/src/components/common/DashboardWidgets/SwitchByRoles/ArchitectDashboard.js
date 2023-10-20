import React, {lazy} from 'react';
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";

const Assistance = lazy(()=>import("../Assistance"));
const MyPerformance = lazy(()=>import("../MyPerformance"));
const UpcomingEvents = lazy(()=>import("../UpcomingEvents"));
const MyLastEnquiries  = lazy(()=>import("../MyLastEnquiries"));
const MyTasksArchitect  = lazy(()=>import("../MyTasksArchitect"));
const ActivityPreview = lazy(()=>import("../ActivityPreview"));
const MyLastContent = lazy(()=>import("../MyLastContent"));
const MyClasses = lazy(()=>import("../MyClasses"));
const MyCurriculums = lazy(()=>import("../MyCurriculums"));


const ArchitectDashboard=(props)=> {
    const{}=props;
    const {F_getHelper} = useMainContext();
    const {manageScopeIds} = F_getHelper();

    return (
        <>
            <Assistance />
            <MyPerformance type={'ARCHITECT'}/>
            <UpcomingEvents />
            {manageScopeIds.isTrainingCenter ? (
                <>
                    <MyLastEnquiries role='ARCHITECT'/>
                    <MyTasksArchitect />
                    <ActivityPreview />
                    <MyLastContent />
                </>
            ) :(
                <>
                    <ActivityPreview />
                    <MyClasses />
                    <MyCurriculums />
                </>
            )}

        </>
    )
}

export default ArchitectDashboard;