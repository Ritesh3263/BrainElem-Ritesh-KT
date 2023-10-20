import React, {lazy} from "react";
import {Route, Routes} from "react-router-dom";

const Certification = lazy(() => import("../../components/TrainingModule/Certifications/Certification/CertificationList"));
const CertificationPreview = lazy(() => import("../../components/TrainingModule/Certifications/CertificationPreview/CertificationPreviewList"));
const CertificatesList = lazy(() => import("../../components/TrainingModule/Certifications/Certificates/CertificatesList"));
const CertificateForm = lazy(() => import("../../components/TrainingModule/Certifications/Certificates/CertificateForm"));
const CompetenceBlocksList = lazy(() => import("../../components/TrainingModule/Certifications/CompetenceBlocks/CompetenceBlocksList"));
const CompetenceBlock = lazy(() => import("../../components/TrainingModule/Certifications/CompetenceBlocks/CompetenceBlockForm"));
const TemplatesList = lazy(() => import("../../components/TrainingModule/Certifications/Templates/TemplatesList"));
const TemplateForm = lazy(() => import("../../components/TrainingModule/Certifications/Templates/TemplateFrom"));
const Sessions = lazy(() => import("../TrainingModule/Sessions/NSessionMain"));
const SessionsWithoutCompany = lazy(() => import("../TrainingModule/Sessions/NSessionMainWithoutCompany"));
const ReportsSettings = lazy(() => import("../Reports/ReportsSettings/ReportsSettings"));
const EnquiresMain = lazy(() => import("../TrainingModule/Enquires/EnquiresMain"));
const Courses = lazy(() => import("../TrainingModule/Courses/CourseMain"));

export default function XTrainingManagerRole(){
    return(
        <Routes>
            <Route path="/certifications/certificates" element={<CertificatesList/>}/>
            <Route path="/certifications/certification" element={<Certification/>}/>
            <Route path="/certifications/certification-preview" element={<CertificationPreview/>}/>
            <Route path="/certifications/certificate/:certificateId" element={<CertificateForm/>}/>
            <Route path="/certifications/competenceBlocks" element={<CompetenceBlocksList/>}/>
            <Route path="/certifications/competenceBlock/:competenceBlockId" element={<CompetenceBlock/>}/>
            <Route path="/certifications/templates" element={<TemplatesList/>}/>
            <Route path="/certifications/template/:templateId" element={<TemplateForm/>}/>
            <Route path="/enquires" element={<EnquiresMain/>}/>
            <Route path="/reports-settings" element={<ReportsSettings/>}/>
            <Route path="/sessions" element={<Sessions/>}/>
            <Route path="/sessions/:sessionId" element={<Sessions/>}/>
            <Route path="/sessions-free" element={<SessionsWithoutCompany/>}/>
            <Route path="/courses/:courseId" element={<Courses />} />
            <Route path="/courses" element={<Courses />} />
        </Routes>
    )
}