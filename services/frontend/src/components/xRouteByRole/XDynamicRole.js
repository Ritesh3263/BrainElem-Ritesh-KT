import React, { lazy } from "react";
import { Route, Routes } from "react-router-dom";
import { useMainContext } from "../_ContextProviders/MainDataContextProvider/MainDataProvider";
// OLD MODULE MANAGER
const MSAcademicYearList = lazy(() => import("../../components/Module/ModuleCore/ModulesCoreAcademicYear/MSAcademicYearList"));
const MSAcademicYearForm = lazy(() => import("../../components/Module/ModuleCore/ModulesCoreAcademicYear/MSAcademicYearForm"));
const MSClassesList = lazy(() => import("../../components/Module/ModuleCore/ModulesCoreClass/MSClassesList"));
const MSCLassesForm = lazy(() => import("../../components/Module/ModuleCore/ModulesCoreClass/MSCLassesForm"));
const MSGradingScalesList = lazy(() => import("../../components/Module/ModuleCore/ModulesCoreGradingScale/MSGradingScalesList"));
const MSGradingScalesForm = lazy(() => import("../../components/Module/ModuleCore/ModulesCoreGradingScale/MSGradingScalesForm"));
const MSSubjectsList = lazy(() => import("../../components/Module/ModuleCore/ModulesCoreSubject/MSSubjectsList"));
const MSSubjectsForm = lazy(() => import("../../components/Module/ModuleCore/ModulesCoreSubject/MSSubjectsForm"));
const MSUsersList = lazy(() => import("../../components/Module/ModuleCore/ModulesCoreUser/MSUsersList"));
const MSUsersForm = lazy(() => import("../../components/Module/ModuleCore/ModulesCoreUser/MSUsersForm"));
const MSUsersCsv = lazy(() => import("../../components/Module/ModuleCore/ModulesCoreUser/MSUsersCsv"));
const MSUsersRoles = lazy(() => import("../../components/Module/ModuleCore/ModulesCoreUser/MSUsersRoles"));
const MSUsersPermissions = lazy(() => import("../../components/Module/ModuleCore/ModulesCoreUser/MSUsersPermissions"));
const MSCategoriesList = lazy(() => import("../../components/Module/ModuleCore/ModuleCoreCategories/MSCategoriesList"));
const MSCategoriesForm = lazy(() => import("../../components/Module/ModuleCore/ModuleCoreCategories/MSCategoriesForm"));
const PartnerExaminers = lazy(() => import("../../components/TrainingModule/PartnersExaminers/PartnerExaminersList"));
const EnquiresMain = lazy(() => import("../TrainingModule/Enquires/EnquiresMain"));
const Partners = lazy(() => import("../../components/TrainingModule/Partners/PartnersList"));
const Activity = lazy(() => import("components/Activity/List"));
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
const Courses = lazy(() => import("../TrainingModule/Courses/CourseMain"));
const CoursePath = lazy(() => import("../TrainingModule/CoursePath/CoursePathMain"));
const FormatsList = lazy(() => import("../TrainingModule/Formats/FormatsList"));
const AwaitingApprovalList = lazy(() => import("components/Module/ModuleCore/ModulesCoreUser/AwaitingApprovalList"));
const MSAuthorizationsList = lazy(() => import("../Module/ModuleCore/ModulesCoreUser/Authorizations/MSAuthorizationsList"));
const MSAuthorizationsRoles = lazy(() => import("../../components/Module/ModuleCore/ModulesCoreUser/Authorizations/MSAuthorizationsRoles"));
const TrainingMyCoursesMain = lazy(() => import("../../components/TrainingModule/TrainingMyCourses/TrainingMyCoursesMain"));
const NewMyCoursesPreview = lazy(() => import("components/schoolModule/MyCourses/Preview"));
const GroupExaminationView = lazy(() => import("../Trainer/Examinate/Group/GroupExaminationView"));
const GroupExaminationViewForQuestion = lazy(() => import("../Trainer/Examinate/Group/GroupExaminationViewForQuestion"));
const IndividualExaminationView = lazy(() => import("../Trainer/Examinate/Individual/IndividualExaminationView"));
const ArchitectSetupClassForm = lazy(() => import("../Architect/ArchitectSetupClass/ArchitectSetupClassForm"));

/* Teacher*/
const WelcomeExaminationView = lazy(() => import("../Trainer/Examinate/Welcome/WelcomeExaminationView"));
const Reports = lazy(()=> import ("../Reports/Reports"));
const ReportsForm = lazy(()=> import ("../Reports/ReportTraineeForm"));
const ReportsPreview = lazy(()=> import ("../Reports/ReportTraineePreview"));
const ProgramTrainerEdit = lazy(() => import("../Program/ProgramTrainer/ProgramTrainerEdit/ProgramTrainerEdit"));
const ProgramTrainerPreview = lazy(() => import("../Program/ProgramTrainer/ProgramTrainerPreview/ProgramTrainerPreview"));
const OldDashboard = lazy(() => import("../Dashboard/Dashboard"));
const Dashboard = lazy(() => import("../common/DashboardWidgets/SwitchByRoles/TrainerSessionManagerDashboard"));
const TrainingTrainerDashboard = lazy(() => import("../../components/TrainingModule/Dashboard/Trainer/TrainerDashboard"));
/* Student*/
const Schedule = lazy(() => import("../../components/Schedule/Schedule"));
const HomeworksList = lazy(() => import("../../components/Trainee/Homeworks/HomeworksList"));
const GradebooksMain = lazy(() => import("../../components/Gradebooks/GradebooksMain"));
const TraineeMyCourses = lazy(() => import("../../components/Trainee/MyCourses/TraineeMyCourses"));
const ExploreCourses = lazy(() => import("../../components/Explore/ExploreSessions/ExploreSessions"));
const NewMyCourses = lazy(() => import("components/schoolModule/MyCourses"));
// My Space
const VirtualCoach = lazy(() => import("../../components/CognitiveSpace/VirtualCoach/VirtualCoach.js"));
const MyResources = lazy(() => import("../../components/CognitiveSpace/MyResources/MyResources.js"));
const Performance = lazy(() => import("../../components/CognitiveSpace/MyProgress/Performance.js"));
/* For New UserModule*/
const NewMSUsersList = lazy(() => import("../../components/Evvo/ModulesCoreUser/MSUsersList"));
const NewMSUsersForm = lazy(() => import("../../components/Evvo/ModulesCoreUser/MSUsersForm"));
const NewMSUsersCsv = lazy(() => import("../../components/Evvo/ModulesCoreUser/MSUsersCsv"));
const NewMSUsersRoles = lazy(() => import("../../components/Evvo/ModulesCoreUser/MSUsersRoles"));
const NewAwaitingApprovalList = lazy(() => import("components/Module/ModuleCore/New-ModulesCoreUser/AwaitingApprovalList"));
const NewMSAuthorizationsList = lazy(() => import("../../components/Evvo/ModulesCoreUser/Authorizations/MSAuthorizationsList"));
const NewMSAuthorizationsRoles = lazy(() => import("../../components/Evvo/ModulesCoreUser/Authorizations/MSAuthorizationsRoles"));
const NewMSUsersPermissions = lazy(() => import("../../components/Evvo/ModulesCoreUser/MSUsersPermissions"));
const TeamList = lazy(() => import("../../components/Evvo/ModulesCoreUser/Teams/TeamList"));
const TeamsAccess = lazy(() => import("../../components/Evvo/ModulesCoreUser/Authorizations/TeamList"))
const Credits = lazy(() => import("../Credits/Credits"))
const AllTeamsStats = lazy(() => import("../../components/Evvo/ModulesCoreUser/Teams/AllTeamsStats"));
const CompareTeams = lazy(() => import("../../components/Evvo/ModulesCoreUser/Teams/CompareTeams"));
const BCTestRegistration = lazy(() => import("../../components/Evvo/ModulesBCTestRegistration/UserList"));
const BCTestRegistrationTeam = lazy(() => import("../../components/Evvo/ModulesBCTestRegistration/TeamList"));
const BCTestRegistrationNadQnad = lazy(() => import("../../components/Evvo/CognitiveSpace/BCResultForGroup/NadQnad"));
const BCTestRegistrationStrongWeak = lazy(() => import("../../components/Evvo/CognitiveSpace/BCResultForGroup/StrongWeak"));
const BCTestRegistrationInterDimension = lazy(() => import("../../components/Evvo/CognitiveSpace/BCResultForGroup/InterDimension"));
const BCTestRegistrationIntraDimension = lazy(() => import("../Evvo/CognitiveSpace/BCResultForGroup/IntraDimension"));
const BCTestRegistrationEmotional = lazy(() => import("../../components/Evvo/CognitiveSpace/BCResultForGroup/EmotionalIntelligence"));
const BCTestRegistrationCostTime = lazy(() => import("../Evvo/CognitiveSpace/BCResultForGroup/CostTimeReport"));
/* Interactive CS  */
const MyProjectsAutoMatedProjectCS = lazy(() => import("../../components/Evvo/MyProjects/InteractiveCS/AutomatedProjectCS"));
const MyProjectsCustomProjects = lazy(() => import("../Evvo/MyProjects/InteractiveCS/CustomProjects"));
const MyProjectsEmployeeManagement = lazy(() => import("../Evvo/MyProjects/InteractiveCS/EmployeeManagement"));
const MyProjectsRecuriting = lazy(() => import("../Evvo/MyProjects/InteractiveCS/Recuriting"));
/* NeuroFunctions */
const Behaviourist = lazy(() => import("../Evvo/MyProjects/NeuroFunctions/Behaviourist"));
const CareerProjects = lazy(() => import("../Evvo/MyProjects/NeuroFunctions/CareerProjects"));
const DysFunctioningGroup = lazy(() => import("../Evvo/MyProjects/NeuroFunctions/DysFunctioningGroup"));
const ManagementStyles = lazy(() => import("../Evvo/MyProjects/NeuroFunctions/ManagementStyles"));
const PsyRisks = lazy(() => import("../Evvo/MyProjects/NeuroFunctions/PsyRisks"));
const TeamCreation = lazy(() => import("../Evvo/MyProjects/NeuroFunctions/TeamCreation"));
const Gamification = lazy(() => import("../Evvo/MyProjects/NeuroFunctions/GamificationContests"));
const NewMSUsersStatic = lazy(() => import("../../components/Evvo/ModulesCoreUser/StaticRoles"));
/* My Diary */
const MyDiary = lazy(() => import("../Evvo/MyDiary/Diary"));
/* My Users */
const MyUsers = lazy(() => import("../Evvo/MyUsers/Users"));
const BCTestUsers = lazy(() => import("../Evvo/ModulesBCTestRegistration/Users/Users"));
const TestResults = lazy(() => import("../Evvo/TeamsResults/TeamsResults"));
const FullTrainee = lazy(() => import("../../components/TrainingModule/Sessions/NSession/FullTrainee/FullTrainee"));
/* OLD ARCHITECT */
const NCurriculumMain = lazy(() => import("../Module/ModuleCore/ModulesCoreCurriculae/NewCurriculum/NCurriculumMain"));
const ArchitectClassesList = lazy(() => import("../Architect/ArchitectClassesList"));
const SourceMaterialsMain = lazy(() => import("../TrainingModule/SourceMaterials/SourceMaterialsMain"));
const ReportsSettings = lazy(() => import("../Reports/ReportsSettings/ReportsSettings"));
// OLD GENERAL
const MyLibrary = lazy(() => import("../../components/Library/MyLibrary/MyLibrary"));
const Explore = lazy(() => import("../../components/Explore/New/Explore"));
const ContentFactory = lazy(() => import("../../components/Content/ContentFactory/Welcome"));
// OLD LIBRARIAN
const AcceptingLibraryContentList = lazy(() => import("../../components/Library/ModuleLibrary/AcceptingLibraryContentList"));
const AcceptingLibraryContent = lazy(() => import("../../components/Library/ModuleLibrary/AcceptingLibraryContent"));
const AcceptingLibraryCourseList = lazy(() => import("../../components/Library/ModuleLibrary/AcceptingLibraryCourseList"));
const AcceptingLibraryCourse = lazy(() => import("../../components/Library/ModuleLibrary/AcceptingLibraryCourse"));
export default function XModuleManagerRole() {
    return (
        <Routes>
            <Route path="/modules-core/academic-year" element={<MSAcademicYearList />} />
            <Route path="/modules-core/academic-year/:yearId" element={<MSAcademicYearForm />} />
            <Route path="/modules-core/subjects-categories" element={<MSCategoriesList />} />
            <Route path="/modules-core/subjects-categories/:categoryId" element={<MSCategoriesForm />} />
            <Route path="/modules-core/subjects" element={<MSSubjectsList />} />
            <Route path="/modules-core/subjects/:subjectId" element={<MSSubjectsForm />} />
            <Route path="/modules-core/users" element={<MSUsersList />} />
            <Route path="/modules-core/users/form/:userId" element={<MSUsersForm />} />
            <Route path="/modules-core/users/import-export" element={<MSUsersCsv />} />
            <Route path="/modules-core/users/roles" element={<MSUsersRoles />} />
            <Route path="/activities" element={<Activity />} />
            <Route path="/program-trainer-preview" element={<ProgramTrainerPreview/>}/>
            <Route path="/program-edit" element={<ProgramTrainerEdit/>}/>
            <Route path="/reports" element={<Reports/>}/>
            <Route path="/report-preview/:traineeId/:reportId" element={<ReportsPreview/>}/>
            <Route path="/report-form/:groupId/:traineeId/:reportId" element={<ReportsForm/>}/>
            <Route path="/inspector-content" element={<AcceptingLibraryContentList/>}/>
            <Route path="/inspector-content/:contentId" element={<AcceptingLibraryContent/>}/>
            <Route path="/old-dashboard" element={<OldDashboard/>}/>
            <Route path="/dashboard" element={<Dashboard/>}/>
            <Route path="/training-dashboard" element={<TrainingTrainerDashboard/>}/>
            {/* authorizations */}
            <Route path="/modules-core/authorizations" element={<MSAuthorizationsList />} />
            <Route path="/modules-core/authorizations/roles" element={<MSAuthorizationsRoles />} />

            {/*Not using right now - old type view*/}
            <Route path="/modules-core/users/permissions" element={<MSUsersPermissions />} />
            {/*------------------------------------*/}

            <Route path="/modules-core/classes" element={<MSClassesList />} />

            {/*ModuleManager can only add class - form using only for add new class*/}
            <Route path="/modules-core/classes/:classId" element={<MSCLassesForm />} />
            {/*------------------------------------*/}

            <Route path="/modules-core/grading-scales" element={<MSGradingScalesList />} />
            <Route path="/modules-core/grading-scales/:gradingScaleId" element={<MSGradingScalesForm />} />

            {/*for t-ModuleManager Partners*/}
            <Route path="/partners" element={<Partners />} />
            {/*------------------------------------*/}

            {/*is using?*/}
            <Route path="/partner-examiners" element={<PartnerExaminers />} />
            {/*------------------------------------*/}

            <Route path="/enquires" element={<EnquiresMain />} />

            {/*TRAINING-MODULE*/}
            <Route path="/certifications/certificates" element={<CertificatesList />} />
            <Route path="/certifications/certification" element={<Certification />} />
            <Route path="/certifications/certification-preview" element={<CertificationPreview />} />
            <Route path="/certifications/certificate/:certificateId" element={<CertificateForm />} />
            <Route path="/certifications/competenceBlocks" element={<CompetenceBlocksList />} />
            <Route path="/certifications/competenceBlock/:competenceBlockId" element={<CompetenceBlock />} />
            <Route path="/certifications/templates" element={<TemplatesList />} />
            <Route path="/certifications/template/:templateId" element={<TemplateForm />} />
            <Route path="/courses/:courseId" element={<Courses />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/coursePath" element={<CoursePath />} />
            <Route path="/sessions" element={<Sessions />} />
            <Route path="/sessions/:sessionId" element={<Sessions />} />
            <Route path="/sessions-free" element={<SessionsWithoutCompany />} />
            <Route path="/sessions-free/:sessionId" element={<SessionsWithoutCompany />} />
            <Route path="/formats" element={<FormatsList />} />
            <Route path="/approve-verifications" element={<AwaitingApprovalList />} />
            <Route path="/source-materials" element={<SourceMaterialsMain />} />
            <Route path="/reports-settings" element={<ReportsSettings />} />
            <Route path="/training-my-courses" element={<TrainingMyCoursesMain/>}/>
            <Route path="/training-my-courses-bc" element={<TrainingMyCoursesMain/>}/>
            <Route path="/examinate" element={<WelcomeExaminationView/>}/>
            <Route path="/examinate/:eventId" element={<GroupExaminationView/>}/>
            <Route path="/examinate/:eventId/:userId" element={<IndividualExaminationView trainerMode={true}/>}/>
            <Route path="/examinate/content/:contentId/group/:groupId" element={<GroupExaminationView/>}/>
            <Route path="/examinate/event/:eventId/questions" element={<GroupExaminationViewForQuestion/>}/>
            <Route path="/examinate/content/:contentId/group/:groupId/questions" element={<GroupExaminationViewForQuestion/>}/>
            <Route path="/accepting-library-content" element={<AcceptingLibraryContentList/>}/>
            <Route path="/accepting-library-content/:contentId" element={<AcceptingLibraryContent/>}/>
            <Route path="/accepting-library-course" element={<AcceptingLibraryCourseList/>}/>
            <Route path="/accepting-library-course/:courseId" element={<AcceptingLibraryCourse/>}/>
            <Route path="/modules-core/curriculae/:curriculumId" element={<NCurriculumMain/>}/>
            <Route path="/modules-core/curriculae" element={<NCurriculumMain/>}/>
            <Route path="/architect-classes/:classId" element={<ArchitectClassesList/>}/>
            <Route path="/architect-classes" element={<ArchitectClassesList/>}/>
            <Route path="/architect-setup-class/:classId" element={<ArchitectSetupClassForm/>}/>

            <Route path="/schedule" element={<Schedule/>}/>
            <Route path="/traineeHomeworks" element={<HomeworksList/>}/>
            <Route path="/gradebooks-main" element={<GradebooksMain/>}/>
            <Route path="/trainee-myCourses" element={<TraineeMyCourses/>}/>
            <Route path="/my-courses" element={<NewMyCourses/>}/>
            <Route path="/my-courses/preview/" element={<NewMyCoursesPreview/>}/>
            <Route path="/explore-courses" element={<ExploreCourses/>}/>
            <Route path="/courses" element={<Courses />} />
            <Route path="/virtualcoach" element={<VirtualCoach />}/>
            <Route path="/myresources" element={<MyResources />}/>
            <Route path="/myprogress" element={<Performance />}/>

            {/* For New Module */}
            <Route path="/sentinel/myusers/users" element={<NewMSUsersList />} />
            <Route path="/new-modules-core/users/form/:userId" element={<NewMSUsersForm />} />
            <Route path="/sentinel/myusers/users/import-export" element={<NewMSUsersCsv />} />
            <Route path="/new-modules-core/users/roles" element={<NewMSUsersRoles />} />
            <Route path="/sentinel/myteams/teams" element={<TeamList />} />
            <Route path="/new-modules-core/users/permissions" element={<NewMSUsersPermissions />} />
            <Route path="/sentinel/myteams/BC-test-registrations/users" element={<BCTestRegistration />} />
            <Route path="/sentinel/myteams/BC-test-registrations/teams" element={<BCTestRegistrationTeam />} />
            <Route path="/BC-test-registrations/nad-qnad" element={<BCTestRegistrationNadQnad />} />
            <Route path="/BC-test-registrations/strong-weakpoint" element={<BCTestRegistrationStrongWeak />} />
            <Route path="/BC-test-registrations/interpersonal-dimension" element={<BCTestRegistrationInterDimension />} />
            <Route path="/BC-test-registrations/intrapersonal-dimension" element={<BCTestRegistrationIntraDimension />} />
            <Route path="/BC-test-registrations/emotional-inteligence" element={<BCTestRegistrationEmotional />} />
            <Route path="/BC-test-registrations/cost-time" element={<BCTestRegistrationCostTime />} />
            <Route path="/sentinel/admin/authorizations/" element={<NewMSAuthorizationsList />} />
            <Route path="/sentinel/admin/teams-access/" element={<TeamsAccess />} />
            <Route path="/sentinel/admin/credits/" element={<Credits />} />

            <Route path="/new-modules-core/authorizations/roles" element={<NewMSAuthorizationsRoles />} />

            <Route path="/users/roles" element={NewMSUsersStatic}/>

            {/* Interactive CS */}
            <Route path="/my-projects/interactive-cs/automated-projects-cs" element={<MyProjectsAutoMatedProjectCS />} />
            <Route path="/my-projects/interactive-cs/custom-projects" element={<MyProjectsCustomProjects />} />
            <Route path="/my-projects/interactive-cs/employee-management" element={<MyProjectsEmployeeManagement />} />
            <Route path="/my-projects/interactive-cs/recuriting" element={<MyProjectsRecuriting />} />

            {/* NeuroFunctions */}
            <Route path="/my-projects/neuro-functions/behaviourist" element={<Behaviourist />} />
            <Route path="/my-projects/neuro-functions/career-projects" element={<CareerProjects />} />
            <Route path="/my-projects/neuro-functions/dys-functioning-group" element={<DysFunctioningGroup />} />
            <Route path="/my-projects/neuro-functions/management-styles" element={<ManagementStyles />} />
            <Route path="/my-projects/neuro-functions/psy-risks" element={<PsyRisks />} />
            <Route path="/my-projects/neuro-functions/team-creation" element={<TeamCreation />} />
            <Route path="/my-projects/neuro-functions/gamification" element={<Gamification />} />

            {/* MyDiary */}
            <Route path="/my-projects/my-diary/diary" element={<MyDiary />} />

            {/* MyUsers */}
            <Route path="/users/users" element={<MyUsers />} />
            <Route path="/users/roles" element={NewMSUsersStatic}/>

            <Route path="/sentinel/myusers/Braincoretestregistrations/users" element={<BCTestUsers />} />

            <Route path="/sentinel/myteams/Statistics" element={<AllTeamsStats />} />
            <Route path="/sentinel/myteams/Compare" element={<CompareTeams />} />
            <Route path="/sentinel/myteams/Results" element={<TestResults />} />
            <Route path="/BCTestRegistrations/teams" element={<TeamList />} />

            <Route path="/FullTrainee/:userId/:sessionId" element={<FullTrainee />} />
            {/*------------------------------------*/}
        </Routes>
    )
}