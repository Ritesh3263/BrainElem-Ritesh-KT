import React, {lazy} from "react";
import {Route, Routes} from "react-router-dom";
const NCurriculumMain = lazy(() => import("../Module/ModuleCore/ModulesCoreCurriculae/NewCurriculum/NCurriculumMain"));
const ArchitectClassesList = lazy(() => import("../Architect/ArchitectClassesList"));
const ArchitectSetupClassForm = lazy(() => import("../Architect/ArchitectSetupClass/ArchitectSetupClassForm"));
const ProgramTrainerEdit = lazy(() => import("../Program/ProgramTrainer/ProgramTrainerEdit/ProgramTrainerEdit"));

const Certification = lazy(() => import("../TrainingModule/Certifications/Certification/CertificationList"));
const CertificationPreview = lazy(() => import("../TrainingModule/Certifications/CertificationPreview/CertificationPreviewList"));
const CertificatesList = lazy(() => import("../TrainingModule/Certifications/Certificates/CertificatesList"));
const CertificateForm = lazy(() => import("../TrainingModule/Certifications/Certificates/CertificateForm"));
const CompetenceBlocksList = lazy(() => import("../TrainingModule/Certifications/CompetenceBlocks/CompetenceBlocksList"));
const CompetenceBlock = lazy(() => import("../TrainingModule/Certifications/CompetenceBlocks/CompetenceBlockForm"));
const TemplatesList = lazy(() => import("../TrainingModule/Certifications/Templates/TemplatesList"));
const TemplateForm = lazy(() => import("../TrainingModule/Certifications/Templates/TemplateFrom"));
const Sessions = lazy(() => import("../TrainingModule/Sessions/NSessionMain"));
const SessionsWithoutCompany = lazy(() => import("../TrainingModule/Sessions/NSessionMainWithoutCompany"));
const ReportsSettings = lazy(() => import("../Reports/ReportsSettings/ReportsSettings"));
const Courses = lazy(() => import("../TrainingModule/Courses/CourseMain"));
const CoursePath = lazy(() => import("../TrainingModule/CoursePath/CoursePathMain"));
const FormatsList = lazy(() => import("../TrainingModule/Formats/FormatsList"));
const SourceMaterialsMain = lazy(() => import("../TrainingModule/SourceMaterials/SourceMaterialsMain"));
const GradebooksMain = lazy(() => import("../../components/Gradebooks/GradebooksMain"));
const OldDashboard = lazy(() => import("../Dashboard/Dashboard"));
const Dashboard = lazy(() => import("../common/DashboardWidgets/SwitchByRoles/ArchitectDashboard"));
const Activity = lazy(() => import("components/Activity/List"));

export default function XArchitectRole(){
    return(
        <Routes>
            {/*<Route path="/dashboard" element={<Dashboard/>}/>*/}
            <Route path="/old-dashboard" element={<OldDashboard/>}/>
            <Route path="/modules-core/curriculae/:curriculumId" element={<NCurriculumMain/>}/>
            <Route path="/modules-core/curriculae" element={<NCurriculumMain/>}/>
            <Route path="/architect-classes/:classId" element={<ArchitectClassesList/>}/>
            <Route path="/architect-classes" element={<ArchitectClassesList/>}/>
            <Route path="/architect-setup-class/:classId" element={<ArchitectSetupClassForm/>}/>
            <Route path="/program-edit" element={<ProgramTrainerEdit/>}/>
            <Route path="/reports-settings" element={<ReportsSettings/>}/>
            <Route path="/gradebooks-main" element={<GradebooksMain/>}/>

            <Route path="/activities" element={<Activity/>}/>
            
            {/*TRAINING-MODULE*/}
            <Route path="/certifications/certificates" element={<CertificatesList/>}/>
            <Route path="/certifications/certification" element={<Certification/>}/>
            <Route path="/certifications/certification-preview" element={<CertificationPreview/>}/>
            <Route path="/certifications/certificate/:certificateId" element={<CertificateForm/>}/>
            <Route path="/certifications/competenceBlocks" element={<CompetenceBlocksList/>}/>
            <Route path="/certifications/competenceBlock/:competenceBlockId" element={<CompetenceBlock/>}/>
            <Route path="/certifications/templates" element={<TemplatesList/>}/>
            <Route path="/certifications/template/:templateId" element={<TemplateForm/>}/>
            <Route path="/courses/:courseId" element={<Courses/>}/>
            <Route path="/courses" element={<Courses/>}/>
            <Route path="/coursePath" element={<CoursePath/>}/>
            <Route path="/sessions" element={<Sessions/>}/>
            <Route path="/sessions/:sessionId" element={<Sessions/>}/>
            <Route path="/sessions-free" element={<SessionsWithoutCompany/>}/>
            <Route path="/formats" element={<FormatsList/>}/>
            <Route path="/source-materials" element={<SourceMaterialsMain/>}/>
        </Routes>
    )
}