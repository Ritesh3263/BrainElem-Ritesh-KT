import React, {lazy, useEffect} from 'react';
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";

const MyPerformance = lazy(()=>import("../MyPerformance"));
const ActivityPreview = lazy(()=>import("../ActivityPreview"));
const NetworkDetails = lazy(()=>import("../NetworkDetails"));

const AdministrationDashboard=(props)=> {
    const{}=props;
    const {F_handleSetShowLoader,F_showToastMessage,F_getErrorMessage,F_getHelper} = useMainContext();
    const {user} = F_getHelper();

    useEffect(()=>{
        //F_handleSetShowLoader(true)

    },[]);

    return (
        <>
            <MyPerformance type={'PARENT'}/>
            <ActivityPreview />
            {user.role === 'NetworkManager' && (
                <>
                    <MyPerformance type={'NETWORK'}/>
                    <NetworkDetails />
                </>
            )}
        </>
    )
}

export default AdministrationDashboard;