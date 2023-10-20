import React, {lazy} from "react";
import {Route, Routes, Navigate} from "react-router-dom";
const ModulesList = lazy(() => import("../../components/Module/ModuleSetup/ModulesList/ModulesList"));
const ModuleForm = lazy(() => import("../../components/Module/ModuleSetup/ModulesList/ModuleForm"));
const ModuleManagers = lazy(() => import("../../components/Module/ModuleSetup/ModuleManagersList/ModuleManagers"));
const ModuleManagerForm = lazy(() => import("../../components/Module/ModuleSetup/ModuleManagersList/ModuleManagerForm"));


export default function XNetworkManagerRole(){
    return(
        <Routes>
            <Route path="/" element={<Navigate to="/modules" />}/>
            <Route path="/modules" element={<ModulesList/>}/>
            <Route path="/modules/form/:moduleId" element={<ModuleForm/>}/>
            <Route path="/modules/managers" element={<ModuleManagers/>}/>
            <Route path="/modules/managers/form/:uId" element={<ModuleManagerForm/>}/>
        </Routes>
    )
}