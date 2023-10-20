import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useMainContext } from "../../_ContextProviders/MainDataContextProvider/MainDataProvider";
import { useTranslation } from "react-i18next";
import { new_theme } from "NewMuiTheme";
import { ThemeProvider, Typography } from "@mui/material";
import "../Header.scss";
import TraineeStructure from "./TraineeStructure";

export default function Trainee({ collapsed }) {
  const { t } = useTranslation(['translation', 'common', 'mySpace-myResults', 'mySpace-virtualCoach', 'mySpace-myResources']);
  const { myCurrentRoute, F_getHelper, F_handleSetShowLoader, F_showToastMessage, F_getErrorMessage, F_t } = useMainContext();
  const isInTrainingCenter = F_getHelper().manageScopeIds.isTrainingCenter;
  const permissions = F_getHelper().userPermissions;
  const {user, isEdu} = F_getHelper();
  const [navSubItems, setNavSubItems] = useState(['tab-library', 'tab-session-setup', 'tab-general', 'tab-learning']);
  const current_url = window.location.href;
  const toggleHandler = (item) => {
    if (navSubItems.includes(item)) {
      setNavSubItems(p => p.filter(i => i !== item))
    } else {
      setNavSubItems(p => ([...p, item]))
    }
  };
  const result = TraineeStructure();

  return (
    <ThemeProvider theme={new_theme}>
      <div className="menu_bar">
        <div className="main_navigation">
          <nav className="nav_bar">
            {/* <ul className="main_menu">
              {(permissions.ms_myResults?.access || permissions.ms_virtualCoach?.access || permissions.ms_myResources?.access) &&
                <li className={`${current_url.includes("myspace") || current_url.includes("virtualcoach") || current_url.includes("myresources") || current_url.includes("myprogress") ? 'menu_active' : ''}`}>
                  <Link to={(permissions.ms_myResults?.access ? "/myspace" : (permissions.ms_virtualCoach?.access ? "/virtualcoach" : "/myresources"))}><Typography variant="body2" component="span">{t("common:MY SPACE")} </Typography></Link>
                  <ul className="submenu">
                    {permissions.ms_myResults?.access &&
                      <li className={current_url.includes("myspace") ? 'active' : ''}>
                        <Link to={"/myspace"} className="pro-item-content">
                          <Typography variant="body2" component="span">{t("mySpace-myResults:MY RESULTS")}</Typography>
                        </Link>
                      </li>
                    }
                    {results?.length > 0 && 
                      <>
                        {permissions.ms_virtualCoach?.access && <li className={current_url.includes("virtualcoach") ? 'active' : ''}>
                          <Link to={"/virtualcoach"} className="pro-item-content">
                            <Typography variant="body2" component="span">{t("mySpace-virtualCoach:VIRTUAL COACH")}</Typography>
                          </Link>
                        </li>}
                        {permissions.ms_myResources?.access && <li className={current_url.includes("myresources") ? 'active' : ''}>
                          <Link to={"/myresources"} className="pro-item-content">
                            <Typography variant="body2" component="span">{t("mySpace-myResources:MY RESOURCES")}</Typography>
                          </Link>
                        </li>}
                        <li className={current_url.includes("myprogress") ? 'active' : ''}>
                          <Link to={"/myprogress"} className="pro-item-content">
                            <Typography variant="body2" component="span">{t("My Performance")}</Typography>
                          </Link>
                        </li>
                      </>
                    }
                  </ul>
                </li>
              } */}
              {/* for BC COACH CANDIDATE  PERMISSION: /training-my-courses as "My Trainings" */}
              {/* {(permissions.bcCoach?.access || permissions.bcCoach?.access) && !isEdu &&
              <li className={`${current_url.includes("/coaches") ? 'menu_active' : ''}`}>
                <Link to={"/coaches"} className="pro-item-content">
                  <Typography variant="body2" component="span">{F_t("My Trainings")}</Typography>
                </Link>
                <ul className="submenu">
                  {permissions.bcCoach?.access && 
                    <li className={current_url.includes("/coaches") ? 'active' : ''}>
                      <Link to={"coaches"} className="pro-item-content">
                        <Typography variant="body2" component="span">{t("BrainCore Coach")}</Typography>
                      </Link>
                    </li>
                  }
                </ul>
              </li>} */}
              {/* {isInTrainingCenter && (
                <li className={`${current_url.includes("training-my-courses") ? 'menu_active' : ''}`}>
                  <Link ><Typography variant="body2" component="span">{t("Session setup")} </Typography></Link>
                  <ul className="submenu hidetext">
                    <li className={current_url.includes("training-my-courses") ? 'active' : ''}>
                      <Link to={"/training-my-courses"} className="pro-item-content">
                        <Typography variant="body2" component="span">{t("Sessions")}</Typography>
                      </Link>
                    </li>
                  </ul>
                </li>
              )} */}
              {/* <li className={`${current_url.includes("explore") || current_url.includes("create-content") || current_url.includes("my-library") ? 'menu_active' : ''}`}>
                <Link to={(isInTrainingCenter ? "/explore-courses" : "/explore")}><Typography variant="body2" component="span">{t("Library")} </Typography></Link>
                <ul className="submenu">
                  <li className={current_url.includes("explore") ? 'active' : ''}>
                    <Link to={(isInTrainingCenter ? "/explore-courses" : "/explore")} className="pro-item-content">
                      <Typography variant="body2" component="span">{t("Explore")}</Typography>
                    </Link>
                  </li>
                  <li className={current_url.includes("create-content") ? 'active' : ''}>
                    <Link to={"/create-content"} className="pro-item-content">
                      <Typography variant="body2" component="span">{t("Create")}</Typography>
                    </Link>
                  </li>
                  <li className={current_url.includes("my-library") ? 'active' : ''}>
                    <Link to={"/my-library"} className="pro-item-content">
                      <Typography variant="body2" component="span">{t("My Library")}</Typography>
                    </Link>
                  </li>
                  <li>
                    <Link to={"/courses"} className="pro-item-content">
                      <Typography variant="body2" component="span"> {t("My Courses")}  </Typography>
                    </Link>
                  </li>
                </ul>
              </li> */}
              {/* {!isInTrainingCenter && (
                <li className={`${current_url.includes("schedule") || current_url.includes("my-courses") || current_url.includes("gradebooks-main") || current_url.includes("trainee-myCourses") || current_url.includes("traineeHomeworks") ? 'menu_active' : ''}`}>
                  <Link to={"/schedule"}><Typography variant="body2" component="span">{t("Learning")} </Typography></Link>
                  <ul className="submenu">
                    <li className={current_url.includes("schedule") ? 'active' : ''}>
                      <Link to={"/schedule"} className="pro-item-content">
                        <Typography variant="body2" component="span">{t("Schedule")}</Typography>
                      </Link>
                    </li>
                    <li className={current_url.includes("my-courses") ? 'active' : ''}>
                      <Link to={"/my-courses"} className="pro-item-content">
                        <Typography variant="body2" component="span">{t("My courses")}</Typography>
                      </Link>
                    </li>
                    <li className={current_url.includes("gradebooks-main") ? 'active' : ''}>
                      <Link to={"/gradebooks-main"} className="pro-item-content">
                        <Typography variant="body2" component="span">{t("My gradebook")}</Typography>
                      </Link>
                    </li>
                    <li className={current_url.includes("trainee-myCourses") ? 'active' : ''}>
                      <Link to={"trainee-myCourses"} className="pro-item-content">
                        <Typography variant="body2" component="span">{t("My program")}</Typography>
                      </Link>
                    </li>
                    <li className={current_url.includes("traineeHomeworks") ? 'active' : ''}>
                      <Link to={"/traineeHomeworks"} className="pro-item-content">
                        <Typography variant="body2" component="span">{t("Homeworks")}</Typography>
                      </Link>
                    </li>
                  </ul>
                </li>
              )} 
            </ul> */}
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




        {/* {collapsed ? (
        <>
          {isInTrainingCenter ? (
            <MenuItem
              className={`collapsed-icon ${t(myCurrentRoute) === t("Dashboard") && "currActiveArchitect"
                }`}
              title={t("Dashboard")}
              icon={
                <Icon style={{ textAlign: "center", height: "26px", width: "26px", fontSize: "0rem", overflow: "visible", }}>
                  <img src="/img/icons/sidebar_dashboard.svg" style={{ height: "100%" }} />
                </Icon>}>
              <Link to={"/dashboard"} className="pro-item-content">
                {t("Dashboard")}
              </Link>
            </MenuItem>
          ) : (
            <MenuItem
              className={`collapsed-icon ${t(myCurrentRoute) === t("Dashboard") && "currActiveArchitect"
                }`}
              title={t("Dashboard")}
              icon={
                <Icon style={{ textAlign: "center", height: "26px", width: "26px", fontSize: "0rem", overflow: "visible", }}>
                  <img src="/img/icons/sidebar_dashboard.svg" style={{ height: "100%" }} />
                </Icon>}>
              <Link to={"/dashboard"} className="pro-item-content">
                {t("Dashboard")}
              </Link>
            </MenuItem>
          )}
          <MenuItem
            hidden={!CommonService.isDevelopment()}
            className={`collapsed-icon ${t(myCurrentRoute) === t("Cognitive space") && "currActiveArchitect"
              }`}
            title={t("Cognitive space")}
            icon={
              <Icon style={{ textAlign: "center", height: "26px", width: "26px", fontSize: "0rem", overflow: "visible", }}>
                <img src="/img/icons/Lighbulb.svg" style={{ height: "100%" }} />
              </Icon>}>
            <Link to={"/myspace"} className="pro-item-content">
              {t("Cognitive space")}
            </Link>
          </MenuItem>
          {isInTrainingCenter && (
            <MenuItem
              className={`collapsed-icon ${t(myCurrentRoute) === t("") && "currActiveArchitect"
                }`}
              title={t("")}
              icon={
                <Icon style={{ textAlign: "center", height: "26px", width: "26px", fontSize: "0rem", overflow: "visible", }} >
                  <img src="/img/icons/sidebar_statistics.svg" style={{ height: "100%", opacity: "0.4" }} />
                </Icon>
              }
            >

            </MenuItem>
          )}
          {isInTrainingCenter && (<hr />)}
          {isInTrainingCenter && (
            <MenuItem
              className={`collapsed-icon ${t(myCurrentRoute) === t("My courses") && "currActiveExam"
                }`}
              title={t("Certificates")}
              icon={
                <Icon
                  style={{
                    textAlign: "center",
                    height: "26px",
                    width: "26px",
                    fontSize: "0rem",
                    overflow: "visible",
                  }}
                >
                  <img src="/img/icons/sidebar_myCourses.svg" style={{ height: "100%" }} />
                </Icon>
              }
            >
              <Link
                Link to={"/training-my-courses"}
                className="pro-item-content"
              >
                {t("Certificates")}
              </Link>
            </MenuItem>
          )}
          <hr />
          <MenuItem
            className={`collapsed-icon ${t(myCurrentRoute) === t("Explore") && "currActiveExplore"
              }`}
            title={t("Explore")}
            icon={
              <Icon style={{ textAlign: "center", height: "26px", width: "26px", fontSize: "0rem", overflow: "visible", }} >
                <img src="/img/icons/explore.svg" style={{ height: "100%" }} />
              </Icon>
            }
          >
            <Link to={(isInTrainingCenter ? "/explore-courses" : "/explore")} className="pro-item-content">
              {t("Explore")}
            </Link>
          </MenuItem>

          <MenuItem
            className={`collapsed-icon ${t(myCurrentRoute) === t("Content Factory") && "currActiveExplore"
              }`}
            title={t("Create content")}
            icon={
              <Icon style={{ textAlign: "center", height: "26px", width: "26px", fontSize: "0rem", overflow: "visible", }} >
                <img src="/img/icons/create.svg" style={{ height: "100%" }} />
              </Icon>
            }
          >
            <Link to={"/create-content"} className="pro-item-content">
              {t("Create content")}
            </Link>
          </MenuItem>
          <MenuItem
            className={`collapsed-icon ${t(myCurrentRoute) === t("Library") && "currActiveExplore"
              }`}
            title={t("My Library")}
            icon={
              <Icon style={{ textAlign: "center", height: "26px", width: "26px", fontSize: "0rem", overflow: "visible", }} >
                <img src="/img/icons/my_library.svg" style={{ height: "100%" }} />
              </Icon>
            }
          >
            <Link to={"/my-library"} className="pro-item-content">
              {t("My Library")}
            </Link>
          </MenuItem>
          <hr />
          {!isInTrainingCenter && (
            <MenuItem
              className={`collapsed-icon ${t(myCurrentRoute) === t("Schedule") && "currActiveExam"
                }`}
              title={t("Schedule")}
              icon={
                <Icon style={{ textAlign: "center", height: "26px", width: "26px", fontSize: "0rem", overflow: "visible", }} >
                  <img src="/img/icons/sidebar_schedule.svg" style={{ height: "100%" }} />
                </Icon>
              }
            >
              <Link to={"/schedule"} className="pro-item-content">
                {t("Schedule")}
              </Link>
            </MenuItem>
          )}
          {!isInTrainingCenter && (
            <MenuItem
              className={`collapsed-icon ${t(myCurrentRoute) === t("My courses") && "currActiveExam"
                }`}
              title={t("My courses")}
              icon={
                <Icon style={{ textAlign: "center", height: "25px", width: "25px", fontSize: "0rem", overflow: "visible", }} >
                  <img src="/img/icons/sidebar_myCourses.svg" style={{ height: "100%" }} />
                </Icon>
              }
            >
              <Link to={"/my-courses"} className="pro-item-content">
                {t("My courses")}
              </Link>
            </MenuItem>
          )}
          {!isInTrainingCenter && (
            <MenuItem
              className={`collapsed-icon ${(t(myCurrentRoute) === t("Gradebook") ||
                t(myCurrentRoute) === t("Subject average")) &&
                "currActiveExam"
                }`}
              title={t("Grade book")}
              icon={
                <Icon style={{ textAlign: "center", height: "26px", width: "26px", fontSize: "0rem", overflow: "visible", }} >
                  <img src="/img/icons/sidebar_gradebook.svg" style={{ height: "100%" }} />
                </Icon>
              }
            >
              <Link to={"/gradebooks-main"} className="pro-item-content">
                {t("Grade book")}
              </Link>
            </MenuItem>
          )}
          {!isInTrainingCenter && (
            <MenuItem
              className={`collapsed-icon ${t(myCurrentRoute) === t("My program") && "currActiveExam"
                }`}
              title={t("My program")}
              icon={
                <Icon style={{ textAlign: "center", height: "26px", width: "26px", fontSize: "0rem", overflow: "visible", }} >
                  <img
                    src="/img/icons/sidebar_programs.svg"
                    style={{ height: "100%" }}
                  />
                </Icon>
              }
            >
              <Link to={"/trainee-myCourses"} className="pro-item-content">
                {t("My program")}
              </Link>
            </MenuItem>
          )}
          {!isInTrainingCenter && (
            <MenuItem
              className={`collapsed-icon ${t(myCurrentRoute) === t("Homework") && "currActiveExam"
                }`}
              title={t("Homeworks")}
              icon={
                <Icon style={{ textAlign: "center", height: "26px", width: "26px", fontSize: "0rem", overflow: "visible", }} >
                  <img
                    src="/img/icons/sidebar_homeworks.svg"
                    style={{ height: "100%" }}
                  />
                </Icon>
              }
            >
              <Link to={"/traineeHomeworks"} className="pro-item-content">
                {t("Homeworks")}
              </Link>
            </MenuItem>
          )}

        </>
      ) : (
        <>
          <ListItemButton style={{ justifyContent: "space-between", marginTop: 10, marginBottom: 8 }} dense
            onClick={() => toggleHandler('tab-general')}
          >
            <span id="generals" > {t("General")}</span>
            {navSubItems.includes('tab-general') ? (<ExpandLessIcon id="generals-big" />) : (<ExpandMoreIcon id="generals-big" />)}
          </ListItemButton>
          {isInTrainingCenter ? (
            <Fade in={navSubItems.includes('tab-general')} timeout={1000}>
              <MenuItem
                hidden={!navSubItems.includes('tab-general')}
                className={
                  t(myCurrentRoute) === t("Dashboard") && "currActiveArchitect"
                }
                icon={<></>}
                id="general"
                prefix={
                  <Icon style={{ textAlign: "center", height: "25px", width: "25px", fontSize: "0rem", overflow: "visible", }}>
                    <img src="/img/icons/sidebar_dashboard.svg" style={{ height: "100%" }} />
                  </Icon>}>
                <Link to={"/dashboard"} className="pro-item-content">
                  {t("Dashboard")}
                </Link>
              </MenuItem>
            </Fade>
          ) : (
            <Fade in={navSubItems.includes('tab-general')} timeout={1000}>
              <MenuItem
                hidden={!navSubItems.includes('tab-general')}
                className={
                  t(myCurrentRoute) === t("Dashboard") && "currActiveArchitect"
                }
                icon={<></>}
                id="general"
                prefix={
                  <Icon style={{ textAlign: "center", height: "25px", width: "25px", fontSize: "0rem", overflow: "visible", }}>
                    <img src="/img/icons/sidebar_dashboard.svg" style={{ height: "100%" }} />
                  </Icon>}>
                <Link to={"/dashboard"} className="pro-item-content">
                  {t("Dashboard")}
                </Link>
              </MenuItem>
            </Fade>
          )}
          <Fade in={navSubItems.includes('tab-general')} timeout={1000}>
            <MenuItem
              hidden={!CommonService.isDevelopment() || !navSubItems.includes('tab-general')}
              className={
                t(myCurrentRoute) === t("Cognitive space") && "currActiveArchitect"
              }
              icon={<></>}
              id="general"
              prefix={
                <Icon style={{ textAlign: "center", height: "25px", width: "25px", fontSize: "0rem", overflow: "visible", }}>
                  <img src="/img/icons/Lighbulb.svg" style={{ height: "100%" }} />
                </Icon>}>
              <Link to={"/myspace"} className="pro-item-content">
                {t("Cognitive space")}
              </Link>
            </MenuItem>
          </Fade>
          {isInTrainingCenter && (
            <ListItemButton style={{ justifyContent: "space-between", marginTop: 10, marginBottom: 8 }} dense
              onClick={() => toggleHandler('tab-session-setup')}
            >
              <span id="generals2" > {t("Session setup")}</span>
              {navSubItems.includes('tab-session-setup') ? (<ExpandLessIcon id="generals2-big" />) : (<ExpandMoreIcon id="generals2-big" />)}
            </ListItemButton>
          )}
          {isInTrainingCenter && (
            <Fade in={navSubItems.includes('tab-session-setup')} timeout={1000}>
              <MenuItem
                hidden={!navSubItems.includes('tab-session-setup')}
                className={
                  t(myCurrentRoute) === t("My courses") && "currActiveExam"
                }
                id="general4"
                icon={<></>}
                prefix={
                  <Icon style={{ textAlign: "center", height: "25px", width: "25px", fontSize: "0rem", overflow: "visible", }}>
                    <img src="/img/icons/sidebar_myCourses.svg" style={{ height: "100%" }} />
                  </Icon>}>
                <Link to={"/training-my-courses"} className="pro-item-content">
                  {t("Sessions")}
                </Link>
              </MenuItem>
            </Fade>
          )}

          <ListItemButton style={{ justifyContent: "space-between", marginTop: 10, marginBottom: 8 }} dense
            onClick={() => toggleHandler('tab-library')} >
            <span id="generals3" > {t("Library")}</span>
            {navSubItems.includes('tab-library') ? (<ExpandLessIcon id="generals3-big" />) : (<ExpandMoreIcon id="generals3-big" />)}
          </ListItemButton>
       

          <Fade in={navSubItems.includes('tab-library')} timeout={1000}>
            <MenuItem
              hidden={!navSubItems.includes('tab-library')}
              className={
                t(myCurrentRoute) === t("Explore") && "currActiveExplore"
              }
              icon={<></>}
              id="explore_create"
              prefix={
                <Icon style={{ textAlign: "center", height: "25px", width: "25px", fontSize: "0rem", overflow: "visible", }} >
                  <img src="/img/icons/explore.svg" style={{ height: "100%" }} />
                </Icon>
              }
            >
              <Link to={(isInTrainingCenter ? "/explore-courses" : "/explore")} className="pro-item-content">
                {t("Explore")}
              </Link>
            </MenuItem>
          </Fade>

          <Fade in={navSubItems.includes('tab-library')} timeout={1000}>
            <MenuItem
              hidden={!navSubItems.includes('tab-library')}
              className={
                t(myCurrentRoute) === t("Content Factory") && "currActiveExplore"
              }
              icon={<></>}
              id="explore_create"
              prefix={
                <Icon style={{ textAlign: "center", height: "25px", width: "25px", fontSize: "0rem", overflow: "visible", }} >
                  <img src="/img/icons/create.svg" style={{ height: "100%" }} />
                </Icon>
              }
            >
              <Link to={"/create-content"} className="pro-item-content">
                {t("Create")}
              </Link>
            </MenuItem>
          </Fade>
          <Fade in={navSubItems.includes('tab-library')} timeout={1000}>
            <MenuItem
              hidden={!navSubItems.includes('tab-library')}
              className={t(myCurrentRoute) === t("Library") && "currActiveExplore"}
              icon={<></>}
              id="explore_create"
              prefix={
                <Icon style={{ textAlign: "center", height: "25px", width: "25px", fontSize: "0rem", overflow: "visible", }} >
                  <img src="/img/icons/my_library.svg" style={{ height: "100%" }} />
                </Icon>
              }
            >
              <Link to={"/my-library"} className="pro-item-content">
                {t("My Library")}
              </Link>
            </MenuItem>
          </Fade>

          {!isInTrainingCenter && (
            <ListItemButton style={{ justifyContent: "space-between", marginTop: 10, marginBottom: 8 }} dense
              onClick={() => toggleHandler('tab-learning')}
            >
              <span id="generals4" > {t("Learning")}</span>
              {navSubItems.includes('tab-learning') ? (<ExpandLessIcon id="generals4-big" />) : (<ExpandMoreIcon id="generals4-big" />)}
            </ListItemButton>
          )}
          {!isInTrainingCenter && (
            <Fade in={navSubItems.includes('tab-learning')} timeout={1000}>
              <MenuItem
                className={
                  t(myCurrentRoute) === t("Schedule") && "currActiveExam"
                }
                icon={<></>}
                id="general4"
                prefix={
                  <Icon style={{ textAlign: "center", height: "25px", width: "25px", fontSize: "0rem", overflow: "visible", }} >
                    <img src="/img/icons/sidebar_schedule.svg" style={{ height: "100%" }} />
                  </Icon>
                }
              >
                <Link to={"/schedule"} className="pro-item-content">
                  {t("Schedule")}
                </Link>
              </MenuItem>
            </Fade>
          )}
          {!isInTrainingCenter && (
            <Fade in={navSubItems.includes('tab-learning')} timeout={1000}>
              <MenuItem
                className={
                  t(myCurrentRoute) === t("My courses") && (isInTrainingCenter ? "currActiveArchitect" : "currActiveExam")
                }
                icon={<></>}
                id={(isInTrainingCenter ? "general" : "general4")}
                prefix={
                  <Icon style={{ textAlign: "center", height: "25px", width: "25px", fontSize: "0rem", overflow: "visible", }} >
                    <img src="/img/icons/sidebar_myCourses.svg" style={{ height: "100%" }} />
                  </Icon>
                }
              >
                <Link to={"/my-courses"} className="pro-item-content">
                  {t("My courses")}
                </Link>
              </MenuItem>
            </Fade>
          )}
          {!isInTrainingCenter && (
            <Fade in={navSubItems.includes('tab-learning')} timeout={1000}>
              <MenuItem
                className={
                  (t(myCurrentRoute) === t("Gradebook") ||
                    t(myCurrentRoute) === t("Subject average")) &&
                  "currActiveExam"
                }
                icon={<></>}
                id="general4"
                prefix={
                  <Icon style={{ textAlign: "center", height: "25px", width: "25px", fontSize: "0rem", overflow: "visible", }} >
                    <img src="/img/icons/sidebar_gradebook.svg" style={{ height: "100%" }} />
                  </Icon>
                }
              >
                <Link to={"/gradebooks-main"} className="pro-item-content">
                  {t("My gradebook")}
                </Link>
              </MenuItem>
            </Fade>
          )}
          {!isInTrainingCenter && (
            <Fade in={navSubItems.includes('tab-learning')} timeout={1000}>
              <MenuItem
                className={
                  t(myCurrentRoute) === t("My program") &&
                  "currActiveExam"
                }
                icon={<></>}
                id="general4"
                prefix={
                  <Icon style={{ textAlign: "center", height: "25px", width: "25px", fontSize: "0rem", overflow: "visible", }} >
                    <img
                      src="/img/icons/sidebar_programs.svg"
                      style={{ height: "100%" }}
                    />
                  </Icon>
                }
              >
                <Link to={"trainee-myCourses"} className="pro-item-content">
                  {t("My program")}
                </Link>
              </MenuItem>
            </Fade>
          )}
          {!isInTrainingCenter && (
            <Fade in={navSubItems.includes('tab-learning')} timeout={1000}>
              <MenuItem
                className={
                  t(myCurrentRoute) === t("Homework") && "currActiveExam"
                }
                icon={<></>}
                id="general4"
                prefix={
                  <Icon style={{ textAlign: "center", height: "25px", width: "25px", fontSize: "0rem", overflow: "visible", }} >
                    <img
                      src="/img/icons/sidebar_homeworks.svg"
                      style={{ height: "100%" }}
                    />
                  </Icon>
                }
              >
                <Link to={"/traineeHomeworks"} className="pro-item-content">
                  {t("Homeworks")}
                </Link>
              </MenuItem>
            </Fade>
          )}
        </>
      )} */}
      </div>
    </ThemeProvider>
  );
}
