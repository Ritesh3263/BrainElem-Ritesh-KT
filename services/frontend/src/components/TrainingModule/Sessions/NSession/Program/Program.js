import React, { lazy, useEffect, useState } from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { useTranslation } from "react-i18next";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import { useSessionContext } from "components/_ContextProviders/SessionProvider/SessionProvider";
import MenuItem from "@material-ui/core/MenuItem";
import CertificationSessionService from "services/certification_session.service";
import CourseTable from "./CourseTable";
import OptionsButton from "components/common/OptionsButton";
import Tooltip from '@material-ui/core/Tooltip';
import Chip from "@material-ui/core/Chip";
import InfoIcon from "@material-ui/icons/Info";
import { EButton } from "styled_components/index";
import { useMainContext } from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import EventService from "services/event.service";
import "./program.scss";

const ManageChapters = lazy(() => import("./Manage/ManageChapters"));

export default function Program() {
    const { t } = useTranslation();
    const [selectedGroup, setSelectedGroup] = useState(undefined);
    const [courses, setCourses] = useState(undefined);
    const [currentCourse, setCurrentCourse] = useState(undefined);
    const [currentCourseObject, setCurrentCourseObject] = useState(undefined);
    const [currentContentStatuses, setCurrentContentStatuses] = useState(undefined);
    const [manageChaptersHelper, setManageChaptersHelper] = useState({ isOpen: false, });
    const [isOpenChapterSecondHelper, setIsOpenChapterSecondHelper] = useState(false);
    const [manageContentHelper, setManageContentHelper] = useState({ isOpen: false, contentType: 'PUBLIC' });
    const [customEvents, setCustomEvents] = useState([]);
    const { F_getHelper, F_showToastMessage } = useMainContext();
    const { userPermissions, user } = F_getHelper();
    const {
        currentSession,
        setIsOpenSessionForm,
    } = useSessionContext();

    useEffect(() => {
        if (currentSession?.groups?.length > 0) {
            handleSelectGroup(currentSession.groups[0]);
        } else {
            setSelectedGroup(undefined);
            setCourses(undefined);
            setCurrentCourse(undefined);
            setCurrentCourseObject(undefined);
        }

    }, [])

    const handleSelectGroup = (group) => {
        if (group) {
            setSelectedGroup(group);
            setCurrentCourse(undefined);
            setCurrentCourseObject(undefined);
            if (group?.course) {
                setCourses([group.course]);
                handleSelectCourse(group.course);
            } else {
                setCourses(group.duplicatedCoursePath.courses);
                handleSelectCourse(group.duplicatedCoursePath.courses[0]);
            }
        }
    };

    const handleSelectCourse = (course) => {
        if (course) {
            setCurrentCourse(course);
            CertificationSessionService.newReadCourse(course?._id).then(res => {
                if (res.status === 200 && res?.data) {
                    setCurrentCourseObject(res.data);
                }
            }).catch(err => console.log(err))
            // if BC COACH CANDIDATE:
            let selectedTrainee = '64b1081b32865c07f90fbbab'; // TODO:  load selected trainee ID here, 
            let bcCoach = userPermissions.bcCoach.access ? user.id : selectedTrainee;
            CertificationSessionService.readAllContentProgressOfUserInSession(bcCoach , currentSession._id).then(res => {
                if(res.status === 200 && res?.data){
                    setCurrentContentStatuses(res.data);
                }
            }).catch(err => console.log(err))
        }
    };

    const handleSaveProgramChange = () => {
        CertificationSessionService.newUpdateCourse(currentCourseObject).then(res => {
            if (res.status === 200) {
                setIsOpenSessionForm({ isOpen: false, type: 'PREVIEW', sessionId: undefined, active: undefined });
                F_showToastMessage("Program was updated", "success");
            }
        });
    }

    const optionsBtn = [
        { id: 1, name: t("Public library"), action: () => { setManageContentHelper({ isOpen: true, contentType: 'PUBLIC' }) }, },
        { id: 2, name: t("Private library"), action: () => { setManageContentHelper({ isOpen: true, contentType: 'PRIVATE' }) }, },
        { id: 3, name: t("Co-created"), action: () => { setManageContentHelper({ isOpen: true, contentType: 'CO_CREATED' }) }, }
    ];

    const groupsList = currentSession?.groups?.length > 0 ? currentSession?.groups.map((gr, index) => (<MenuItem key={index} value={gr}>{gr?.name}</MenuItem>)) : [];
    const coursesList = courses?.length > 0 ? courses.map((cou, index) => (<MenuItem key={index} value={cou}>{cou?.name}</MenuItem>)) : [];

    const refreshEvents = () => {
        if (currentSession._id) {

            // find group where trainee belongs too
            let insideGroup = undefined; // no need to define it for trainers
            if (userPermissions.bcCoach.access) {
                currentSession.groups.map(x => {
                    if (x.trainees.some(e => e._id === user.id)) {
                        insideGroup = x._id
                    }
                })
            }
            EventService.readEventsFromSession(currentSession._id, insideGroup).then(res => {
                if (res.status === 200 && res.data?.length > 0) {
                    setCustomEvents(res.data.filter(event => event.eventType !== 'Certification'));
                }
            }).catch(err => console.log(err));
        }
    }

    useEffect(() => {
        refreshEvents();
    }, [currentSession]);

    const handleAddEvent=(clickedContent)=>{ // getting content data from clicked item in table
        // preparing an event document from available data in this component
        let newEvent = {
            name: currentCourseObject.name,
            description: currentCourseObject.description,
            creator: user.id,
            eventType: 'Certification', // could be 'Online Class', 'Exam', 'Quiz', 'Homework', 'Certification'.. or something else
            assignedGroup: selectedGroup._id,
            assignedPeriod: selectedGroup.period,
            assignedSubject: currentCourseObject._id,
            assignedChapter: clickedContent.chapter,
            assignedContent: clickedContent._id,
            assignedCourse: currentCourseObject._id,
            assignedTrainer: user.id,
            assignedSession: currentSession._id,
            assignedCompany: undefined,
            allDay: false,
            addedFromGradebook: false,
            date: new Date(),
            // endDate: new Date(),
            durationTime: clickedContent.durationTime||45,
            examCoefficient: 1,
            allowExtraAttemptFor: [],
            attendees: [],
            // lastEmit: new Date(),
        }
        EventService.addAlt(newEvent).then(res=>{
            if(res.status === 200 && res.data){
                refreshEvents();
                F_showToastMessage("Event was added","success");
            }
        }).catch(err=>console.log(err));
    }

    const savedEvents = () => {
        if (currentSession?.groups?.length > 0) {
            handleSelectGroup(currentSession.groups[0]);
        } else {
            setSelectedGroup(undefined);
            setCourses(undefined);
            setCurrentCourse(undefined);
            setCurrentCourseObject(undefined);
        }
    }


    return (
        <Grid container>
            {/* <Grid item xs={12} className='d-flex align-items-center'>
                <Typography variant="h5" component="h2" className="text-left" style={{color: `rgba(82, 57, 112, 1)`}}>
                    {t("Program")}
                </Typography>
                <Tooltip title={t("To manage chapters, select group and course name, then you be able to add and remove chapters, to manage contents in chapter, expand chapter item, then you can add and remove contents.")}>
                    <Chip color="" size="small" className="ml-1"  style={{backgroundColor:`rgba(255,255,255,0)`}}
                          icon={<InfoIcon style={{fill:"white"}}/>}
                    />
                </Tooltip>
            </Grid> */}
            <Grid item xs={12}>
                {currentCourseObject ? (
                    <CourseTable currentCourseObject={currentCourseObject}
                        setCurrentCourseObject={setCurrentCourseObject}
                        setIsOpenChapterSecondHelper={setIsOpenChapterSecondHelper}
                        manageContentHelper={manageContentHelper}
                        setManageContentHelper={setManageContentHelper}
                        groupId={selectedGroup}
                        onClose={savedEvents}
                    />
                ) : (
                    <div className="text-center mt-5">
                        <Typography variant="body1" component="span" className="text-left" style={{ color: `rgba(82, 57, 112, 1)` }}>
                            {t("Select Group, then select course to see data")}
                        </Typography>
                    </div>
                )}
            </Grid>
            {/* <Grid item xs={12}>
                <Grid container>
                    <Grid item xs={2} className="p-1">
                        <FormControl fullWidth margin="normal" required={true} style={{maxWidth: "400px"}}
                                     error={false}
                                     variant='filled'
                        >
                            <InputLabel id="selectedGroup-select-label">{t("Select group")}</InputLabel>
                            <Select
                                name='selectedGroup'
                                labelId="selectedGroup-select-label"
                                id="eventType-select"
                                value={selectedGroup}
                                onChange={(e) =>handleSelectGroup(e.target.value)}
                            >
                                {groupsList}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth margin="normal" required={true} style={{maxWidth: "400px"}}
                                     error={false}
                                     variant='filled'
                                     className='mb-3'
                        >
                            <InputLabel id="courseName-select-label">{t("Course name")}</InputLabel>
                            <Select
                                name='courseName'
                                labelId="courseName-select-label"
                                id="eventType-select"
                                value={currentCourse}
                                disabled={!selectedGroup}
                                onChange={(e) =>handleSelectCourse(e.target.value)}
                            >
                                {coursesList}
                            </Select>
                        </FormControl>
                        {(userPermissions.isArchitect || userPermissions.isAssistant || userPermissions.isModuleManager || userPermissions.isTrainer) && (
                          <>
                              <EButton
                                  disabled={!currentCourseObject || isOpenChapterSecondHelper}
                                  className='mb-4'
                                  fullWidth
                                  eSize='medium'
                                  eVariant='secondary'
                                  onClick={()=>{setManageChaptersHelper(p=>({...p, isOpen: true}))}}>
                                  {t("Manage chapters")}
                              </EButton>
                              <OptionsButton
                                  fullWidth
                                  btnName='Assign from'
                                  disabled={!currentCourseObject || !isOpenChapterSecondHelper}
                                  btns={optionsBtn}
                              />

                              <EButton
                                  disabled={!currentCourseObject}
                                  className='mt-4'
                                  fullWidth
                                  eSize='medium'
                                  eVariant='primary'
                                  onClick={handleSaveProgramChange}>
                                  {t("Save program")}
                              </EButton>
                          </>
                        )}
                    </Grid>
                </Grid>
            </Grid> */}
            <ManageChapters
                manageChaptersHelper={manageChaptersHelper}
                setManageChaptersHelper={setManageChaptersHelper}
                chosenChapters={currentCourseObject?.chosenChapters}
                setCurrentCourseObject={setCurrentCourseObject}
            />
        </Grid>
    )
}