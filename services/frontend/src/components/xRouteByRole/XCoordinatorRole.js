import React, {lazy} from "react";
import {Route, Routes} from "react-router-dom";
const Coordinate = lazy(() => import("../../components/Coordinator/Coordinate"));
const Sessions = lazy(() => import("../TrainingModule/Sessions/NSessionMain"));
const SessionsWithoutCompany = lazy(() => import("../TrainingModule/Sessions/NSessionMainWithoutCompany"));
const Courses = lazy(() => import("../TrainingModule/Courses/CourseMain"));

export default function XCoordinatorRole(){
    return(
        <Routes>
            <Route path="/coordinate" element={<Coordinate/>}/>
            <Route path="/sessions" element={<Sessions/>}/>
            <Route path="/sessions-free" element={<SessionsWithoutCompany/>}/>
            <Route path="/courses/:courseId" element={<Courses />} />
            <Route path="/courses" element={<Courses />} />
        </Routes>
    )
}