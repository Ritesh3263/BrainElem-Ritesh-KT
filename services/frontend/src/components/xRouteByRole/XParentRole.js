import React, {lazy} from "react";
import {Route, Routes} from "react-router-dom";
const OldDashboard = lazy(() => import("../../components/Dashboard/Dashboard"));
const Dashboard = lazy(() => import("../../components/common/DashboardWidgets/SwitchByRoles/PartnerDashboard"));
const Reports = lazy(()=> import ("../../components/Reports/Reports"));
const HomeworksList = lazy(() => import("../../components/Trainee/Homeworks/HomeworksList"));
const WelcomeExaminationView = lazy(() => import("../Trainer/Examinate/Welcome/WelcomeExaminationView"));
const GradebooksMain = lazy(() => import("../../components/Gradebooks/GradebooksMain"));
const Schedule = lazy(() => import("../../components/Schedule/Schedule"));
const ProgramTrainerPreview = lazy(() => import("../../components/Program/ProgramTrainer/ProgramTrainerPreview/ProgramTrainerPreview"));
const ReportsPreview = lazy(()=> import ("../../components/Reports/ReportTraineePreview"));
const Activity = lazy(() => import("components/Activity/List"));
const NewMyCourses = lazy(() => import("components/schoolModule/MyCourses"));
const NewMyCoursesPreview = lazy(() => import("components/schoolModule/MyCourses/Preview"));

export default function XParentRole(props){
    const{
        isTrainingCenter
    }=props;

    return(
        <Routes>
            {/*<Route path="/dashboard" element={<Dashboard/>}/>*/}
            <Route path="/old-dashboard" element={<OldDashboard/>}/>
            <Route path="/reports" element={<Reports/>}/>
            <Route path="/schedule" element={<Schedule/>}/>
            <Route path="/traineeHomeworks" element={<HomeworksList/>}/>
            <Route path="/gradebooks-main" element={<GradebooksMain/>}/>
            <Route path="/program-trainer-preview" element={<ProgramTrainerPreview/>}/>
            <Route path="/report-preview/:traineeId/:reportId" element={<ReportsPreview/>}/>
            <Route path="/examinate" element={<WelcomeExaminationView/>}/>

            {!isTrainingCenter &&(
                <>
                    <Route path="/my-courses" element={<NewMyCourses/>}/>
                    <Route path="/my-courses/preview/" element={<NewMyCoursesPreview/>}/>
                </>
            )}

            <Route path="/activities" element={<Activity/>}/>
        </Routes>
    )
}