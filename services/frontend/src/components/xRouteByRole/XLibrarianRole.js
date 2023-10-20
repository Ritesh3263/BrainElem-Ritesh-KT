import React, {lazy} from "react";
import {Route, Routes} from "react-router-dom";
const ModuleLibrary = lazy(() => import("../../components/Library/ModuleLibrary/ModuleLibrary"));
const AcceptingLibraryContentList = lazy(() => import("../../components/Library/ModuleLibrary/AcceptingLibraryContentList"));
const AcceptingLibraryContent = lazy(() => import("../../components/Library/ModuleLibrary/AcceptingLibraryContent"));
const AcceptingLibraryCourseList = lazy(() => import("../../components/Library/ModuleLibrary/AcceptingLibraryCourseList"));
const AcceptingLibraryCourse = lazy(() => import("../../components/Library/ModuleLibrary/AcceptingLibraryCourse"));

export default function XLibrarianRole(){
    return(
        <Routes>
            <Route path="/module-library" element={<ModuleLibrary/>}/>
            <Route path="/accepting-library-content" element={<AcceptingLibraryContentList/>}/>
            <Route path="/accepting-library-content/:contentId" element={<AcceptingLibraryContent/>}/>
            <Route path="/accepting-library-course" element={<AcceptingLibraryCourseList/>}/>
            <Route path="/accepting-library-course/:courseId" element={<AcceptingLibraryCourse/>}/>
        </Routes>
    )
}