import React, {lazy} from "react";
import {Route, Routes} from "react-router-dom";
const AcceptingCloudContentList = lazy(() => import("components/Library/ModuleCloud/AcceptingCloudContentList"));
const AcceptingCloudContent = lazy(() => import("components/Library/ModuleCloud/AcceptingCloudContent"));
//old
//const ModuleCloud = lazy(() => import("components/Library/ModuleCloud/ModuleCloud"));
// new
const ModuleCloud = lazy(() => import("components/Library/ModuleLibrary/ModuleLibrary"));

export default function XCloudManagerRole(){
    return(
        <Routes>
            <Route path="/module-cloud" element={<ModuleCloud/>}/>
            <Route path="/accepting-cloud-content" element={<AcceptingCloudContentList/>}/>
            <Route path="/accepting-cloud-content/:contentId" element={<AcceptingCloudContent/>}/>
        </Routes>
    )
}