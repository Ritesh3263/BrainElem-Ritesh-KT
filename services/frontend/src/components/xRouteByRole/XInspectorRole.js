import React, {lazy} from "react";
import {Route, Routes} from "react-router-dom";
const ProgramTrainerPreview = lazy(() => import("../../components/Program/ProgramTrainer/ProgramTrainerPreview/ProgramTrainerPreview"));
const GradebooksMain = lazy(() => import("../../components/Gradebooks/GradebooksMain"));
const Schedule = lazy(() => import("../../components/Schedule/Schedule"));
const Reports = lazy(()=> import ("../../components/Reports/Reports"));
const ReportsForm = lazy(()=> import ("../../components/Reports/ReportTraineeForm"));
const ReportsPreview = lazy(()=> import ("../../components/Reports/ReportTraineePreview"));
const WelcomeExaminationView = lazy(() => import("../Trainer/Examinate/Welcome/WelcomeExaminationView"));
const GroupExaminationView = lazy(() => import("../Trainer/Examinate/Group/GroupExaminationView"));
const IndividualExaminationView = lazy(() => import("../Trainer/Examinate/Individual/IndividualExaminationView"));
const AcceptingLibraryContentList = lazy(() => import("../../components/Library/ModuleLibrary/AcceptingLibraryContentList"));
const AcceptingLibraryContent = lazy(() => import("../../components/Library/ModuleLibrary/AcceptingLibraryContent"));
const Activity = lazy(() => import("components/Activity/List"));
const Courses = lazy(() => import("../TrainingModule/Courses/CourseMain"));

export default function XInspectorRole(){
    return(
        <Routes>
            <Route path="/program-trainer-preview" element={<ProgramTrainerPreview/>}/>
            <Route path="/gradebooks-main" element={<GradebooksMain/>}/>
            <Route path="/schedule" element={<Schedule/>}/>
            <Route path="/reports" element={<Reports/>}/>
            <Route path="/report-preview/:traineeId/:reportId" element={<ReportsPreview/>}/>
            <Route path="/report-form/:groupId/:traineeId/:reportId" element={<ReportsForm/>}/>
            <Route path="/examinate" element={<WelcomeExaminationView/>}/>
            <Route path="/examinate/:eventId" element={<GroupExaminationView/>}/>
            <Route path="/examinate/:eventId/:userId" element={<IndividualExaminationView trainerMode={true}/>}/>
            <Route path="/examinate/content/:contentId/group/:groupId" element={<GroupExaminationView/>}/>
            
            <Route path="/inspector-content" element={<AcceptingLibraryContentList/>}/>
            <Route path="/inspector-content/:contentId" element={<AcceptingLibraryContent/>}/>

            <Route path="/activities" element={<Activity/>}/>
            <Route path="/courses/:courseId" element={<Courses />} />
            <Route path="/courses" element={<Courses />} />
        </Routes>
    )
}