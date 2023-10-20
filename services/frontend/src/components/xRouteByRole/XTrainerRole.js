import React, {lazy} from "react";
import {Route, Routes} from "react-router-dom";
const ProgramTrainerEdit = lazy(() => import("../Program/ProgramTrainer/ProgramTrainerEdit/ProgramTrainerEdit"));
const OldDashboard = lazy(() => import("../Dashboard/Dashboard"));
const Dashboard = lazy(() => import("../common/DashboardWidgets/SwitchByRoles/TrainerSessionManagerDashboard"));
const Schedule = lazy(() => import("../Schedule/Schedule"));
const Reports = lazy(()=> import ("../Reports/Reports"));
const ReportsForm = lazy(()=> import ("../Reports/ReportTraineeForm"));
const ReportsPreview = lazy(()=> import ("../Reports/ReportTraineePreview"));
const GradebooksMain = lazy(() => import("../Gradebooks/GradebooksMain"));
const WelcomeExaminationView = lazy(() => import("../Trainer/Examinate/Welcome/WelcomeExaminationView"));
const GroupExaminationView = lazy(() => import("../Trainer/Examinate/Group/GroupExaminationView"));
const GroupExaminationViewForQuestion = lazy(() => import("../Trainer/Examinate/Group/GroupExaminationViewForQuestion"));
const IndividualExaminationView = lazy(() => import("../Trainer/Examinate/Individual/IndividualExaminationView"));
const ProgramTrainerPreview = lazy(() => import("../Program/ProgramTrainer/ProgramTrainerPreview/ProgramTrainerPreview"));
const Sessions = lazy(() => import("../TrainingModule/Sessions/NSessionMain"));
const SessionsWithoutCompany = lazy(() => import("../TrainingModule/Sessions/NSessionMainWithoutCompany"));
const Certification = lazy(() => import("../TrainingModule/Certifications/Certification/CertificationList"));
const TrainingTrainerDashboard = lazy(() => import("../../components/TrainingModule/Dashboard/Trainer/TrainerDashboard"));
// const Activity = lazy(() => import("components/Activity/List"));
const NewMyCourses = lazy(() => import("components/schoolModule/MyCourses"));
const NewMyCoursesPreview = lazy(() => import("components/schoolModule/MyCourses/Preview"));
const Courses = lazy(() => import("../TrainingModule/Courses/CourseMain"));


export default function XTrainerRole(props){
        const{
                isTrainingCenter
        }=props;

    return(
        <Routes>
            <Route path="/old-dashboard" element={<OldDashboard/>}/>
            {/*<Route path="/dashboard" element={<Dashboard/>}/>*/}
            <Route path="/schedule" element={<Schedule/>}/>
            <Route path="/reports" element={<Reports/>}/>
            <Route path="/report-preview/:traineeId/:reportId" element={<ReportsPreview/>}/>
            <Route path="/report-form/:groupId/:traineeId/:reportId" element={<ReportsForm/>}/>
            <Route path="/gradebooks-main" element={<GradebooksMain/>}/>
            <Route path="/examinate" element={<WelcomeExaminationView/>}/>
            <Route path="/examinate/:eventId" element={<GroupExaminationView/>}/>
            <Route path="/examinate/:eventId/:userId" element={<IndividualExaminationView trainerMode={true}/>}/>
            <Route path="/examinate/content/:contentId/group/:groupId" element={<GroupExaminationView/>}/>
            
            <Route path="/examinate/event/:eventId/questions" element={<GroupExaminationViewForQuestion/>}/>
            <Route path="/examinate/content/:contentId/group/:groupId/questions" element={<GroupExaminationViewForQuestion/>}/>
            <Route path="/program-trainer-preview" element={<ProgramTrainerPreview/>}/>
            <Route path="/program-edit" element={<ProgramTrainerEdit/>}/>
            <Route path="/my-courses" element={<NewMyCourses/>}/>
            <Route path="/my-courses/preview/" element={<NewMyCoursesPreview/>}/>
            {/*Training Module*/}
            <Route path="/sessions" element={<Sessions/>}/>
            <Route path="/sessions/:sessionId" element={<Sessions/>}/>
            <Route path="/sessions-free" element={<SessionsWithoutCompany/>}/>
            <Route path="/certifications/certification" element={<Certification/>}/>
            <Route path="/training-dashboard" element={<TrainingTrainerDashboard/>}/>

            <Route path="/courses/:courseId" element={<Courses />} />
            <Route path="/courses" element={<Courses />} />
        </Routes>
    )
}