import React, { lazy, useEffect, useState } from 'react';
import { useMainContext } from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import UserService from "../../../../services/user.service";
// import CognitiveDashboard from './CognitiveDashboard';
const CongintiveSpace = lazy(() => import ("../../../CognitiveSpace/CognitiveSpace"));
const CognitiveDashboard = lazy(() => import ("./CognitiveDashboard"));
const TraineeDashboard = lazy(() => import("./TraineeDashboard"));
const TrainerSessionManagerDashboard = lazy(() => import("./TrainerSessionManagerDashboard"));
const PartnerDashboard = lazy(() => import("./PartnerDashboard"));
const ModuleManagerDashboard = lazy(() => import("./ModuleManagerDashboard"));
const ArchitectDashboard = lazy(() => import("./ArchitectDashboard"));
const ParentDashboard = lazy(() => import("./ParentDashboard"));
const AdministrationDashboard = lazy(() => import("./AdministrationDashboard"));

const SwitchByRoles = () => {

    const {
        setMyCurrentRoute,
        F_getHelper
    } = useMainContext();
    const { user, manageScopeIds } = F_getHelper();
    const [interestModalHelper, setInterestModalHelper] = useState({ isOpen: false })

    useEffect(() => {
        setMyCurrentRoute('Dashboard');
        //console.log("isTrainingCenter",manageScopeIds.isTrainingCenter);
        // console.log("user",user.role);
        if (!manageScopeIds.isTrainingCenter) {
            UserService.read(user.id).then(res => {
                if (res.status === 200) {
                    if (res.data?.details?.subinterests?.length <= 0) {
                        setInterestModalHelper({ isOpen: true });
                    }
                }
            }).catch(err => console.log(err));
        }
    }, []);
    return (
        <>
            {/* {user.role === 'Trainee' && (<TraineeDashboard />)} */}
            {user.role === 'Trainee' && (<CongintiveSpace />)}
            {user.role === 'Other' && (<CognitiveDashboard />)}

            {/*TrainingManager === sessionManager???*/}
            {['Trainer', 'ClassManager', 'TrainingManager'].includes(user.role) && (<TrainerSessionManagerDashboard />)}
            {user.role === 'Partner' && (<PartnerDashboard />)}
            {['Assistant'].includes(user.role) && (<ModuleManagerDashboard />)}
            {user.role === 'ModuleManager' && (<CognitiveDashboard />)}
            {user.role === 'Architect' && (<ArchitectDashboard />)}
            {user.role === 'Parent' && (<ParentDashboard />)}
            {['NetworkManager', 'EcoManager', 'Root'].includes(user.role) && (<AdministrationDashboard />)}
        </>
    )
}

export default SwitchByRoles;