import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useMainContext } from "../../_ContextProviders/MainDataContextProvider/MainDataProvider";
import { useTranslation } from "react-i18next";
import { new_theme } from "NewMuiTheme";
import "../Header.scss";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { ThemeProvider, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

//Services
import commonService from 'services/common.service'
import Structure from "./Structure";

export default function Others({
  collapsed,
  accessPermissions,
  helper,
}) {
  const { t } = useTranslation([
    'translation', 
    'sentinel-MyTeams-Compare',
    'sentinel-Admin-Teams',
    'sentinel-Admin-Credits',
    'sentinel-MyUsers-BCTestRegistration',
    'sentinel-MyTeams-Results',
    'sentinel-MyTeams-Statistics'

  ]);
  const result = Structure();
  const current_url = window.location.href;
  return (
    <div className="menu_bar">
      <>
        <ThemeProvider theme={new_theme}>
          <div className="main_navigation">
            <nav className="nav_bar">
              {/* <ul className="main_menu"> */}

                {/* {isInCognitiveCenter ? */}
                  {/* <> */}
                    {/* Home  */}
                    {/* {permissions.home.access &&
                    <li className={current_url.includes("sentinel/home") ? 'active' : ''}>
                      <Link to={"/sentinel/home"} className="pro-item-content">
                        <Typography variant="body2" component="span">{t("Home")}</Typography>
                      </Link>
                    </li>} */}

                    {/* Admin */}
                    {/* {(permissions.admin_auth.access || permissions.admin_teams.access || permissions.admin_credits?.access) &&
                      <li className={`${current_url.includes("sentinel/admin/authorizations") || current_url.includes("teams-access") ||  current_url.includes("credits") ? 'menu_active' : ''}`}>
                        <Link to={permissions.admin_auth.access ? "/sentinel/admin/authorizations/" : (permissions.admin_teams.access ? "/sentinel/admin/teams-access/" : "/sentinel/admin/credits/")} className="pro-item-content">
                          <Typography variant="body2" component="span">{F_t("Admin")} </Typography>
                        </Link>
                        <ul className={`submenu`}>
                          {permissions.admin_auth.access &&
                            <li className={current_url.includes("sentinel/admin/authorizations") ? 'active' : ''}>
                              <Link to={"/sentinel/admin/authorizations/"} className="pro-item-content">
                                <Typography variant="body2" component="span">{t("Authorization​")}</Typography>
                              </Link>
                            </li>
                          }
                          {permissions.admin_teams.access &&
                            <li className={current_url.includes("/sentinel/admin/teams-access/") ? 'active' : ''}>
                              <Link to={"/sentinel/admin/teams-access/"} className="pro-item-content">
                                <Typography variant="body2" component="span">{F_t("sentinel-Admin-Teams:TEAM_ACESSES")}</Typography>
                              </Link>
                            </li>
                          }
                          {permissions.admin_credits?.access &&
                            <li className={current_url.includes("/sentinel/admin/credits/") ? 'active' : ''}>
                              <Link to={"/sentinel/admin/credits/"} className="pro-item-content">
                                <Typography variant="body2" component="span">{t("sentinel-Admin-Credits:CREDITS")}</Typography>
                                <Typography sx={{fontSize: '8px !important'}} component="span">{' (In progress)'}</Typography>
                              </Link>
                            </li>
                          }
                        </ul>
                      </li>
                    } */}
                    {/*  My Team*/} 
                    {/* TODOJULY-review : seeing some new varitey of permissions! */}
                    {/* {user.permissions.find(o => (o.moduleName == 'My Teams - Teams' || o.moduleName == 'My Teams - BC Test Registrations' || o.moduleName == 'My Teams - BC Results for Team - NAD/QNAD' || o.moduleName == 'My Teams - BC Results for Team - interpersonal dimensions' || o.moduleName == 'My Teams - BC Results for Team - emotional intelligence' || o.moduleName == 'My Teams - BC Results for Team - cost/time report' || o.moduleName === 'My Teams - Results' || o.moduleName === 'My Teams - Statistics'))?.access &&
                      <li className={`${current_url.includes("/sentinel/myteams/teams") || current_url.includes("BC-test-registrations") || current_url.includes("Results") || current_url.includes("/sentinel/myteams/Statistics") || current_url.includes("/Compare")? 'menu_active' : ''}`}>
                        <Link to={permissions.mt_teams.access ? '/sentinel/myteams/teams' : permissions.mt_bcTestReg.access ? '/sentinel/myteams/BC-test-registrations/users' : '/sentinel/myteams/Results'}><Typography variant="body2" component="span">{F_t("My Teams")} </Typography></Link>
                        <ul className="submenu">
                          {permissions.mt_teams.access &&
                            <li className={`${current_url.includes("/sentinel/myteams/teams") ? 'active' : ''}`}>
                              <Link to={"/sentinel/myteams/teams/"} className="pro-item-content">
                                <Typography variant="body2" component="span">
                                  {F_t("Teams")}
                                </Typography>
                              </Link>
                            </li>
                          }
                          {permissions.mt_bcTestReg.access &&
                            <li className={`${current_url.includes("sentinel/myteams/BC-test-registrations/users") ? 'active' : current_url.includes("/sentinel/myteams/BC-test-registrations/teams") ? 'active' : ''}`}>
                              <Link to={"/sentinel/myteams/BC-test-registrations/users"} className="pro-item-content">
                                <Typography variant="body2" component="span">
                                  {t("sentinel-MyUsers-BCTestRegistration:BRAINCORE_TEST_REGISTRATION")}
                                </Typography>
                              </Link>
                            </li>
                          }
                          {permissions.mt_results.access &&

                          <li className={`${current_url.includes("Results") ? 'active' : ''}`}>
                            <Link to={"/sentinel/myteams/Results"} className="pro-item-content">
                              <Typography variant="body2" component="span">
                                {t("sentinel-MyTeams-Results:RESULTS")}
                              </Typography>
                            </Link>
                          </li>}
                          {permissions.mt_statistics.access &&
                          <li className={`${current_url.includes("sentinel/myteams/Statistics") ? 'active' : ''}`}>
                            <Link to={"/sentinel/myteams/Statistics"} className="pro-item-content">
                              <Typography variant="body2" component="span">
                                {t("sentinel-MyTeams-Statistics:STATISTICS")}
                              </Typography>
                            </Link>
                          </li>}
                          {permissions.mt_statistics.access && commonService.isDevelopment() &&
                          <li className={`${current_url.includes("sentinel/myteams/Compare") ? 'active' : ''}`}>
                            <Link to={"/sentinel/myteams/Compare"} className="pro-item-content">
                              <Typography variant="body2" component="span">
                                {t("sentinel-MyTeams-Compare:COMPARE_TEAMS")}
                              </Typography>
                              <Typography sx={{fontSize: '8px !important'}} component="span">{' (Beta)'}</Typography>
                            </Link>
                          </li>}
                        </ul>
                      </li>
                    } */}
                    {/* My Project */}
                    {/* {permissions.myProjects.access &&
                      <li className={`${current_url.includes("interactive-cs") || current_url.includes("neuro-functions") ? 'menu_active' : ''}`}>
                        <Link to="/my-projects/interactive-cs/automated-projects-cs" className="pro-item-content">
                          <Typography variant="body2" component="span">
                            {t("My Projects")}
                          </Typography>
                        </Link> */}
                        {/* <ul className="submenu">
                          <li className={`${current_url.includes("automated-projects-cs") ? 'active' : ''}`}>
                            <Link to="/my-projects/interactive-cs/automated-projects-cs" className="pro-item-content">
                              <Typography variant="body2" component="span">
                                {t("Automated Projects")}
                              </Typography>
                            </Link>
                          </li>
                          <li className={`${current_url.includes("recuriting") ? 'active' : ''}`}>
                            <Link to={"/my-projects/interactive-cs/recuriting"} className="pro-item-content">
                              <Typography variant="body2" component="span">
                                {t("Recruting​")}
                              </Typography>
                            </Link>
                          </li>
                          <li className={`${current_url.includes("custom-projects") ? 'active' : ''}`}>
                            <Link to={"/my-projects/interactive-cs/custom-projects"} className="pro-item-content">
                              <Typography variant="body2" component="span">
                                {t("Custom Projects​")}
                              </Typography>
                            </Link>
                          </li>
                          <li className={`${current_url.includes("neuro-functions") ? 'active' : ''}`}>
                            <Link to={"/my-projects/interactive-cs/employee-management"} className="pro-item-content">
                              <Typography variant="body2" component="span">
                                {t("Employee Management​")}
                              </Typography>
                            </Link>
                          </li>
                        </ul> */}
                        {/* <ul className="submenu">
                          {user.permissions.find(o => o.moduleName === 'Interactive CS - authomatized projects - potential group')?.access &&
                            <li className={`hassubs ${current_url.includes("interactive-cs") ? 'active' : ''}`}>
                              <Link className="pro-item-content">
                                <Typography variant="body2" component="span">
                                  {t("Interactive CS​")} <KeyboardArrowDownIcon />
                                </Typography>
                              </Link>
                              <ul className="submenu">
                                <li className="hassubs">
                                  <Link to="/my-projects/interactive-cs/automated-projects-cs" className="pro-item-content">
                                    <Typography variant="body2" component="span">
                                      {t("Automated Projects CS​")}
                                    </Typography>
                                  </Link>
                                </li>
                                <li>
                                  <Link to={"/my-projects/interactive-cs/recuriting"} className="pro-item-content">
                                    <Typography variant="body2" component="span">
                                      {t("Recruting​")}
                                    </Typography>
                                  </Link>
                                </li>
                                <li>
                                  <Link to={"/my-projects/interactive-cs/custom-projects"} className="pro-item-content">
                                    <Typography variant="body2" component="span">
                                      {t("Custom Projects​")}
                                    </Typography>
                                  </Link>
                                </li>
                                <li>
                                  <Link to={"/my-projects/interactive-cs/employee-management"} className="pro-item-content">
                                    <Typography variant="body2" component="span">
                                      {t("Employee Management​")}
                                    </Typography>
                                  </Link>
                                </li>
                              </ul>
                            </li>
                          }
                          <li className={`hassubs ${current_url.includes("neuro-functions") ? 'active' : ''}`}>
                            <Link className="pro-item-content">
                              <Typography variant="body2" component="span">
                                {t("Neuro Functions​")} <KeyboardArrowDownIcon />
                              </Typography>
                            </Link>
                            <ul className="submenu">
                              <li>
                                <Link to={"/my-projects/neuro-functions/dys-functioning-group"} className="pro-item-content">
                                  <Typography variant="body2" component="span">
                                    {t("Dysfunctioning groups matrix​")}
                                  </Typography>
                                </Link>
                              </li>
                              <li>
                                <Link to={"/my-projects/neuro-functions/team-creation"} className="pro-item-content">
                                  <Typography variant="body2" component="span">
                                    {t("Team creation ​")}
                                  </Typography>
                                </Link>
                              </li>
                              <li>
                                <Link to={"/my-projects/neuro-functions/career-projects"} className="pro-item-content">
                                  <Typography variant="body2" component="span">
                                    {t("Career Project")}
                                  </Typography>
                                </Link>
                              </li>
                              <li>
                                <Link to={"/my-projects/neuro-functions/psy-risks"} className="pro-item-content">
                                  <Typography variant="body2" component="span">
                                    {t("Psy Risks (Quiet Quitter /opportunist)")}
                                  </Typography>
                                </Link>
                              </li>
                              <li>
                                <Link to={"/my-projects/neuro-functions/behaviourist"} className="pro-item-content">
                                  <Typography variant="body2" component="span">
                                    {t("Behaviourist Matrix")}
                                  </Typography>
                                </Link>
                              </li>
                              <li>
                                <Link to={"/my-projects/neuro-functions/management-styles"} className="pro-item-content">
                                  <Typography variant="body2" component="span">
                                    {t("Management Style Advices")}
                                  </Typography>
                                </Link>
                              </li>
                              <li>
                                <Link to={"/my-projects/neuro-functions/gamification"} className="pro-item-content">
                                  <Typography variant="body2" component="span">
                                    {t("Gamification / contests")}
                                  </Typography>
                                </Link>
                              </li>
                            </ul>
                          </li>
                        </ul> */}
                      {/* </li>
                    } */}

                    {/* My User */}
                    {/* {(permissions.mu_users.access || permissions.mu_bcTestReg.access) &&
                      <li className={`${current_url.includes("/sentinel/myusers/users") || current_url.includes("Braincoretestregistrations/users") ? 'menu_active' : ''}`}>
                        <Link to={permissions.mu_users.access ? "/sentinel/myusers/users" : "/sentinel/myusers/Braincoretestregistrations/users"} className="pro-item-content">
                          <Typography variant="body2" component="span">
                            {F_t("My Users")}
                          </Typography>
                        </Link>
                        <ul className="submenu">
                          {permissions.mu_users.access &&
                            <li className={current_url.includes("/sentinel/myusers/users") ? 'active' : ''}>
                              {!user.permissions.some(item => item.moduleName === "My Users - Users") ? (
                                  <span className="pro-item-content">
                                    <Typography variant="body2" component="span">
                                      {t("Users")}
                                    </Typography>
                                  </span>
                                ) : (
                                  <Link to="/sentinel/myusers/users" className="pro-item-content">
                                    <Typography variant="body2" component="span">
                                      {t("Users")}
                                    </Typography>
                                  </Link>
                                )}
                            </li>}
                          {(permissions.mu_bcTestReg.access || permissions.mt_bcTestReg.access) &&
                            <li className={current_url.includes("sentinel/myusers/Braincoretestregistrations/users") ? 'active' : ''}>
                              <Link to={"/sentinel/myusers/Braincoretestregistrations/users"} className="pro-item-content">
                                <Typography variant="body2" component="span">
                                  {t("sentinel-MyUsers-BCTestRegistration:BRAINCORE_TEST_REGISTRATION")}
                                </Typography>
                              </Link>
                            </li>}
                        </ul>
                      </li>} */}
                    {/* My Folder */}
                    {/* { // permissions.myFolders.access &&
                      <li className={`${current_url.includes("folder-system") ? 'menu_active' : ''}`}>
                        <Link to={"/folder-system"} className="pro-item-content">
                          <Typography variant="body2" component="span">
                            {t("My Folders​")}
                          </Typography>
                        </Link>
                        <ul className="submenu">
                          { // permissions.myFolders.access &&
                            <li className={current_url.includes("folder-system") ? 'active' : ''}>
                              <Link to={"/folder-system"} className="pro-item-content">
                                <Typography variant="body2" component="span">
                                  {t("Folders")}
                                </Typography>
                              </Link>
                            </li>}
                        </ul>
                      </li>} */}

                    {/* My Trainings */}
                    {/* For the moment hide for EDU - when ready it willbe enabled */}
                    {/* {permissions.bcTrainer.access && !isEdu &&
                      <li className={`${current_url.includes("/mytrainings") || current_url.includes("/sessions-free") ? 'menu_active' : ''}`}>
                        <Link to={"/sessions-free"} className="pro-item-content">
                          <Typography variant="body2" component="span">
                            {F_t("My Trainings")}
                          </Typography>
                        </Link>
                        <ul className="submenu">
                          {permissions.bcTrainer.access &&
                            <li className={(current_url.includes("/mytrainings") || current_url.includes("/sessions-free")) ? 'active' : ''}>
                              <Link to={"/sessions-free"} className="pro-item-content">
                                <Typography variant="body2" component="span">
                                  {t("BrainCore Trainer")}
                                </Typography>
                              </Link>
                            </li>}
                        </ul>
                      </li>} */}
                    {/* My Diary */}
                    {/* {(permissions.myDiary.access) &&
                      <li className={`${current_url.includes("my-diary") ? 'menu_active' : ''}`}>
                        <Link to={"/my-projects/my-diary/diary"} className="pro-item-content">
                          <Typography variant="body2" component="span">
                            {t("My Diary")}
                          </Typography>
                        </Link>
                        <ul className="submenu hidetext">
                          <li className={current_url.includes("my-diary/diary") ? 'active' : ''}>
                            <Link to={"/my-projects/my-diary/diary"} className="pro-item-content">
                              <Typography variant="body2" component="span">
                                {t("Diary")}
                              </Typography>
                            </Link>
                          </li>
                        </ul>
                      </li>} */}
                  {/* </> */}
                  {/* : <>
                       <li className={`${current_url.includes("sentinel/home") || current_url.includes("activities") ? 'menu_active' : ''}`}>
                         <Link to={"/sentinel/home"}><Typography variant="body2" component="span">{t("General")}</Typography></Link>
                         <ul className="submenu">
                           <li className={current_url.includes("sentinel/home") ? 'active' : ''}>
                             <Link to={"/sentinel/home"} className="pro-item-content">
                               <Typography variant="body2" component="span">{t("Dashboard")}</Typography>
                             </Link>
                           </li>
                           <li className={current_url.includes("activities") ? 'active' : ''}>
                             <Link to={"/activities"} className="pro-item-content">
                               <Typography variant="body2" component="span">{t("Activities")}</Typography>
                             </Link>
                           </li>
                         </ul>
                       </li>
                       <li className={`${current_url.includes("academic-year") || current_url.includes("sentinel/myusers/users") || current_url.includes("modules-core/subjects") || current_url.includes("modules-core/classes") ? 'menu_active' : ''}`}>
                         <Link to={"/sentinel/myusers/users"}><Typography variant="body2" component="span">{t("Management")} </Typography></Link>
                         <ul className="submenu">
                           {!isInTrainingCenter && (
                             <li className={current_url.includes("academic-year") ? 'active' : ''}>
                               <Link
                                 to={"/modules-core/academic-year"}
                                 className="pro-item-content"
                               >
                                 <Typography variant="body2" component="span">
                                   {t("School year")}
                                 </Typography>

                               </Link>
                             </li>
                           )}
                           {F_hasPermissionTo("manage-user") && (
                             <>
                               <li className={current_url.includes("/sentinel/myusers/users") ? 'active' : ''}>
                                 <Link to={"/sentinel/myusers/users"} className="pro-item-content">
                                   <Typography variant="body2" component="span">
                                     {F_t("My Users")}
                                   </Typography>
                                 </Link>
                               </li>
                             </>

                           )}
                           {F_hasPermissionTo("create-subjects-and-chapters") && (
                             <li className={current_url.includes("subjects") ? 'active' : ''}>
                               <Link to={"/modules-core/subjects"} className="pro-item-content">
                                 <Typography variant="body2" component="span">
                                   {t(isInTrainingCenter ? "Subjects/Categories" : "Subjects")}
                                 </Typography>
                               </Link>
                             </li>
                           )}
                           {!isInTrainingCenter && (
                             <li className={current_url.includes("classes") ? 'active' : ''}>
                               <Link to={"/modules-core/classes"} className="pro-item-content">
                                 <Typography variant="body2" component="span">
                                   {t("Classes")}
                                 </Typography>
                               </Link>
                             </li>
                           )}
                           <li className={current_url.includes("grading-scales") ? 'active' : ''}>
                             <Link
                               to={"/modules-core/grading-scales"}
                               className="pro-item-content"
                             >
                               <Typography variant="body2" component="span">
                                 {t("Grading scales")}
                               </Typography>
                             </Link>
                           </li>
                         </ul>
                       </li>
                     </>} */}


                {/* {isInTrainingCenter && (
                  <li className={`${current_url.includes("courses") && current_url.includes("-") || current_url.includes("coursePath") || current_url.includes("internships") || current_url.includes("competenceBlocks") || current_url.includes("formats") ? 'menu_active' : ''}`}>
                    <Link to={"/courses"}><Typography variant="body2" component="span">{t("Catalogue")} </Typography></Link>
                    <ul className="submenu">
                      {F_hasPermissionTo("create-course") && (
                        <li className={current_url.includes("courses") ? 'active' : ''}>
                          <Link to={"/courses"} className="pro-item-content">
                            <Typography variant="body2" component="span">
                              {t("Course")}
                            </Typography>
                          </Link>
                        </li>

                      )}
                      {F_hasPermissionTo("create-course-path") && (
                        <li className={current_url.includes("coursePath") ? 'active' : ''}>
                          <Link to={"/coursePath"} className="pro-item-content">
                            <Typography variant="body2" component="span">
                              {t("Course path")}
                            </Typography>
                          </Link>
                        </li>
                      )}
                      {F_hasPermissionTo("create-internship") && (
                        <li className={current_url.includes("internships") ? 'active' : ''}>
                          <Link to={"/internships"} className="pro-item-content">
                            <Typography variant="body2" component="span">
                              {t("Internships")}
                            </Typography>
                          </Link>
                        </li>
                      )}
                      {F_hasPermissionTo("create-competences") && (
                        <li className={current_url.includes("competenceBlocks") ? 'active' : ''}>
                          <Link
                            to={"/certifications/competenceBlocks"}
                            className="pro-item-content"
                          >
                            <Typography variant="body2" component="span">
                              {t("Certificate Templates")}
                            </Typography>
                          </Link>
                        </li>
                      )}
                      <li className={current_url.includes("formats") ? 'active' : ''}>
                        <Link to={"/formats"} className="pro-item-content">
                          <Typography variant="body2" component="span">
                            {t("Formats")}
                          </Typography>
                        </Link>

                      </li>
                    </ul>
                  </li>
                )}
                {isInTrainingCenter && (
                  <li className={`${current_url.includes("sessions-free") || current_url.includes("sessions") || current_url.includes("approve-verifications") || current_url.includes("enquires") || current_url.includes("partners") ? 'menu_active' : ''}`}>
                    <Link to={"/sessions-free"}><Typography variant="body2" component="span">{t("My Stuff")} </Typography></Link>
                    <ul className="submenu">
                      {F_hasPermissionTo("manage-session") && (
                        <>
                          <li className={current_url.includes("sessions-free") ? 'active' : ''}>
                            <Link to={"/sessions-free"} className="pro-item-content">
                              <Typography variant="body2" component="span">
                                {t("Sessions")}
                              </Typography>
                            </Link>
                          </li>
                          <li className={current_url.includes("sessions") ? 'active' : ''}>
                            <Link to={"/sessions"} className="pro-item-content">
                              <Typography variant="body2" component="span">
                                {t("Sessions (BC)")}
                              </Typography>
                            </Link>
                          </li>
                          <li className={current_url.includes("approve-verifications") ? 'active' : ''}>
                            <Link
                              to={"/approve-verifications"}
                              className="pro-item-content"
                            >
                              <Typography variant="body2" component="span">
                                {t("Approve Verifications")}
                              </Typography>
                            </Link>
                          </li>
                        </>
                      )}
                      {F_hasPermissionTo("answer-to-inquiry") && (
                        <li className={current_url.includes("enquires") ? 'active' : ''}>
                          <Link to={"/enquires"} className="pro-item-content">
                            <Typography variant="body2" component="span">
                              {t("Enquires")}
                            </Typography>
                          </Link>
                        </li>
                      )}
                      {F_hasPermissionTo("create-company") && (
                        <>
                          {isInTrainingCenter && (
                            <li className={current_url.includes("partners") ? 'active' : ''}>
                              <Link to={"/partners"} className="pro-item-content">
                                <Typography variant="body2" component="span">
                                  {t("Partners")}
                                </Typography>
                              </Link>
                            </li>
                          )}
                        </>
                      )}
                    </ul>
                  </li>
                )}
                {!isInCognitiveCenter && <>
                  <li className={`${current_url.includes("explore") || current_url.includes("create-content") || current_url.includes("my-library") ? 'menu_active' : ''}`}>
                    <Link to={isInTrainingCenter ? "/explore-courses" : "/explore"}><Typography variant="body2" component="span">{t("Library")} </Typography></Link>
                    <ul className="submenu">
                      <li className={current_url.includes("explore-courses") ? 'active' : ''}>
                        <Link
                          to={isInTrainingCenter ? "/explore-courses" : "/explore"}
                          className="pro-item-content"
                        >
                          <Typography variant="body2" component="span">
                            {t("Explore")}
                          </Typography>
                        </Link>
                      </li>
                      <li className={current_url.includes("create-content") ? 'active' : ''}>
                        <Link to={"/create-content"} className="pro-item-content">
                          <Typography variant="body2" component="span">
                            {t("Create")}
                          </Typography>
                        </Link>
                      </li>
                      <li className={current_url.includes("my-library") ? 'active' : ''}>
                        <Link to={"/my-library"} className="pro-item-content">
                          <Typography variant="body2" component="span">
                            {t("My Library")}
                          </Typography>
                        </Link>
                      </li>
                    </ul>
                  </li></>} */}
              {/* // </ul> */}
              <ul className="main_menu">
                {result?.map((item, i) => ( 
                  result[item]?.visible &&
                  (result[item]?.submenu ? 
                    <>
                    <li key={i} className={`${result[item]?.active ? 'menu_active' : ''}`}>
                            <Link to={result[item].to} className="pro-item-content">
                              <Typography variant="body2" component="span">{result[item]?.name} </Typography>
                            </Link>
                            <ul className={`submenu`}>
                              {result[item]?.menu?.map((sub, index) =>(
                                <>
                               {sub?.visible && <li className={current_url.includes(sub?.to) ? 'active' : ''} key={index}>
                                  <Link to={sub?.to} className="pro-item-content">
                                    <Typography variant="body2" component="span">{sub?.name}</Typography>
                                  </Link>
                                </li>}
                                </>
                              ))}
                            </ul>
                          </li>  
                    </>  :
                    <>
                      <li key={i} className={current_url.includes(result[item].to) ? 'active' : ''}>
                          <Link to={result[item].to} className="pro-item-content">
                            <Typography variant="body2" component="span">{result[item].name}</Typography>
                          </Link>
                        </li>
                    </> 
                )))}
              </ul>
            </nav>
          </div>
        </ThemeProvider>
      </>
    </div>
  );
}
