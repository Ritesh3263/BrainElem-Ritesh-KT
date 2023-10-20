import React, {lazy} from "react";
import {Route, Routes} from "react-router-dom";

const Sessions = lazy(() => import("../TrainingModule/Sessions/NSessionMain"));
const EnquiresMain = lazy(() => import("../TrainingModule/Enquires/EnquiresMain"));
const OldDashboard = lazy(() => import("components/Dashboard/Dashboard"));
const Dashboard = lazy(() => import("components/common/DashboardWidgets/SwitchByRoles/PartnerDashboard"));
const Partners = lazy(() => import("components/TrainingModule/Partners/PartnersList"));
const Courses = lazy(() => import("../TrainingModule/Courses/CourseMain"));


export default function XPartnerRole(){
    return(
        <Routes>
            <Route path="/old-dashboard" element={<OldDashboard/>}/>
            {/*<Route path="/dashboard" element={<Dashboard/>}/>*/}
            <Route path="/enquires" element={<EnquiresMain/>}/>
            <Route path="/sessions" element={<Sessions/>}/>
            <Route path="/partners" element={<Partners/>}/>
            <Route path="/courses/:courseId" element={<Courses />} />
            <Route path="/courses" element={<Courses />} />
        </Routes>
    )
}