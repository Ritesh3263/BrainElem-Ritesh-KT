import React, {lazy} from "react";
import {Route, Routes} from "react-router-dom";
const Schedule = lazy(() => import("../../components/Schedule/Schedule"));
const HomeworksList = lazy(() => import("../../components/Trainee/Homeworks/HomeworksList"));
const GradebooksMain = lazy(() => import("../../components/Gradebooks/GradebooksMain"));
const TraineeMyCourses = lazy(() => import("../../components/Trainee/MyCourses/TraineeMyCourses"));
const ExploreCourses = lazy(() => import("../../components/Explore/ExploreSessions/ExploreSessions"));
const Sessions = lazy(() => import("../../components/TrainingModule/Sessions/NSessionMain"));
const CertificationPreview = lazy(() => import("../../components/TrainingModule/Certifications/CertificationPreview/CertificationPreviewList"));
const TrainingMyCoursesMain = lazy(() => import("../../components/TrainingModule/TrainingMyCourses/TrainingMyCoursesMain"));
const NewMyCourses = lazy(() => import("components/schoolModule/MyCourses"));
const NewMyCoursesPreview = lazy(() => import("components/schoolModule/MyCourses/Preview"));
const Courses = lazy(() => import("../TrainingModule/Courses/CourseMain"));

// dashboards:
// old
const OldDashboard = lazy(() => import("../../components/Dashboard/Dashboard"));
const OldTrainingTraineeDashboard = lazy(() => import("../../components/TrainingModule/Dashboard/Trainee/TraineeDashboard"));
// new
// const Dashboard = lazy(() => import("../../components/common/DashboardWidgets/SwitchByRoles/TraineeDashboard"));

// My Space
const VirtualCoach = lazy(() => import("../../components/CognitiveSpace/VirtualCoach/VirtualCoach.js"));
const MyResources = lazy(() => import("../../components/CognitiveSpace/MyResources/MyResources.js"));
const Performance = lazy(() => import("../../components/CognitiveSpace/MyProgress/Performance.js"));


export default function XTraineeRole(props){
    const{
        isTrainingCenter
    }=props;

    return(
        <Routes>
            {/*<Route path="/dashboard" element={<Dashboard/>}/>*/}
            <Route path="/old-dashboard" element={<OldDashboard/>}/>
            <Route path="/schedule" element={<Schedule/>}/>
            <Route path="/traineeHomeworks" element={<HomeworksList/>}/>
            <Route path="/gradebooks-main" element={<GradebooksMain/>}/>
            <Route path="/trainee-myCourses" element={<TraineeMyCourses/>}/>
            <Route path="/my-courses" element={<NewMyCourses/>}/>
            <Route path="/my-courses/preview/" element={<NewMyCoursesPreview/>}/>
            {/*Training module*/}
            <Route path="/explore-courses" element={<ExploreCourses/>}/>
            <Route path="/sessions" element={<Sessions/>}/>
            <Route path="/sessions/:sessionId" element={<Sessions/>}/>
            <Route path="/certifications/certification-preview" element={<CertificationPreview/>}/>
            <Route path="/training-my-courses" element={<TrainingMyCoursesMain/>}/>
            <Route path="/training-my-courses-bc" element={<TrainingMyCoursesMain/>}/>
            <Route path="/old-training-dashboard" element={<OldTrainingTraineeDashboard/>}/>
            <Route path="/courses/:courseId" element={<Courses />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/virtualcoach" element={<VirtualCoach />}/>
            <Route path="/myresources" element={<MyResources />}/>
            <Route path="/myprogress" element={<Performance />}/>
        </Routes>
    )
}