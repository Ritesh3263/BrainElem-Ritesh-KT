import React, {lazy} from 'react';
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";

const MyPerformance = lazy(()=>import("../MyPerformance"));
const MyLastEnquiries  = lazy(()=>import("../MyLastEnquiries"));
const Assistance = lazy(()=>import("../Assistance"));
const ActivityPreview = lazy(()=>import("../ActivityPreview"));
const UpcomingEvents = lazy(()=>import("../UpcomingEvents"));
const MyLastContent = lazy(()=>import("../MyLastContent"));


const ModuleManagerDashboard=(props)=> {
    const{}=props;
    const {F_getHelper} = useMainContext();
    const {manageScopeIds} = F_getHelper();

    return (
        <>
            {manageScopeIds.isTrainingCenter ? (
                <>
                    <Assistance />
                    <MyPerformance type={'MODULEMANAGER'}/>
                    <MyLastEnquiries />
                    <ActivityPreview sizeType='2/3'/>
                </>
            ) : (
                <>
                    <Assistance beginning={1} size={3}/>
                    <MyPerformance type={'MODULEMANAGER'}/>
                    <ActivityPreview />
                </>
            )}
            <UpcomingEvents />
            <MyLastContent />
        </>
    )
}

export default ModuleManagerDashboard;