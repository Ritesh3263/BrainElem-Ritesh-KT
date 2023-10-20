import React, { useEffect, useState } from "react";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from '@mui/material/TextField';
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { now } from "moment";
import { KeyboardTimePicker, KeyboardDatePicker } from "@material-ui/pickers";
import EventService from "../../../services/event.service";
import StyledButton from "new_styled_components/Button/Button.styled";
import { makeStyles } from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";
import { useMainContext } from "../../_ContextProviders/MainDataContextProvider/MainDataProvider";
import FormControl from "@mui/material/FormControl";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import {theme} from "MuiTheme";
import { isWidthUp } from '@material-ui/core/withWidth';
import { new_theme } from "NewMuiTheme";
import { ThemeProvider } from "@mui/material";


const useStyles = makeStyles((theme) => ({}));

export default function EventModal({
  isOpen,
  setOpen,
  eventAction,
  eventInfo,
  fromContentDataForEvent,
  setFromContentDataForEvent,
  callFromComponent,
}) {
  const { t, i18n, translationsLoaded } = useTranslation();
  const { F_getHelper, currentScreenSize } = useMainContext();
  const { userPermissions, user } = F_getHelper();
  const classes = useStyles();
  const [eventInfoType, setEventInfoType] = useState({ type: "" });
  const [eventTypes, setEventTypes] = useState([]);
  const [classes1, setClasses1] = useState([]);
  const [currentEvent, setCurrentEvent] = useState({});
  const [trainingPath, setTrainingPath] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [contents, setContents] = useState([]);
  const [validators, setValidators] = useState(false);
  const [isExam] = useState(callFromComponent === "GRADEBOOK");
  const [startedFromExaminateView, setStartedFromExaminateView] = useState("");

  useEffect(() => {
    EventService.getEventTypes().then((res) => {
      setEventTypes(res.data);
    });
    // user.id this only yield logged user id >> so, this request is valid only for trainer login >> for other user we may use seperate service function and controller to get proper list of available classes

    if (userPermissions.isTrainer)
      EventService.getMyClasses().then((res) => {
        setClasses1(res.data);
      });
    else if (userPermissions.isParent)
      EventService.getParentClasses(user.id)
        .then((res) => {
          setClasses1(res.data);
        })
        .catch((error) => {
          console.log(error);
        });
  }, []);

  useEffect(() => {
    if (eventInfo.type === "update") {
      setEventInfoType({ type: eventInfo.type });

      // update for event
      // setCurrentEvent(eventInfo.data);
      setCurrentEvent((p) => {
        let val = Object.assign({}, p);
        val._id = eventInfo.data._id;
        val.eventType = eventInfo.data.eventType;
        val.assignedGroup = eventInfo.data.assignedGroup?._id;
        val.assignedSubject = eventInfo.data.assignedSubject?._id;
        val.assignedChapter = eventInfo.data.assignedChapter?._id;
        val.assignedContent = eventInfo.data.assignedContent?._id;
        val.durationTime = eventInfo.data.durationTime
          ? durationTimeHandler(eventInfo.data.durationTime)
          : "00:45";
        val.date = new Date(eventInfo.data.date).toISOString();
        val.examCoefficient = eventInfo.data.examCoefficient
          ? eventInfo.data.examCoefficient
          : "";
        val.note = eventInfo.data.note ? eventInfo.data.note : "";
        val.name = eventInfo.data.name ? eventInfo.data.name : "";
        val.urlToEvent = eventInfo.data.urlToEvent
          ? eventInfo.data.urlToEvent
          : "";
        val.allDay = eventInfo.data.allDay ? eventInfo.data.allDay : false;
        return val;
      });

      if (eventInfo.data.assignedGroup._id) {
        console.log("🚀 ~ file: EventModal.js ~ line 102 ~ useEffect ~ eventInfo.data", eventInfo.data)
        getSubjects(eventInfo.data.assignedGroup?._id).then((trainingPathId) => {
          if (eventInfo.data.assignedSubject?._id) {
            getChapters(eventInfo.data.assignedSubject?._id, trainingPathId);
            if (eventInfo.data.assignedChapter?._id) {
              getContents(eventInfo.data.assignedChapter?._id, trainingPathId);
            }
          }
        });
      }
    } else if (eventInfo.type === "ADD_FROM_GRADEBOOK") {
      if (eventInfo.data) {
        setEventInfoType({ type: eventInfo.type });

        // update for event
        // setCurrentEvent(eventInfo.data);
        setCurrentEvent((p) => {
          let val = Object.assign({}, p);
          val._id = eventInfo.data._id;
          val.eventType = eventInfo.data.eventType;
          val.assignedGroup = eventInfo.data.assignedGroup?._id;
          val.assignedSubject = eventInfo.data.assignedSubject?._id;
          val.assignedChapter = eventInfo.data.assignedChapter?._id;
          val.assignedContent = eventInfo.data.assignedContent?._id;
          val.durationTime = eventInfo.data.durationTime
            ? durationTimeHandler(eventInfo.data.durationTime)
            : "00:45";
          val.date = new Date(eventInfo.data.date).toISOString();
          val.examCoefficient = eventInfo.data.examCoefficient
            ? eventInfo.data.examCoefficient
            : "";
          val.note = eventInfo.data.note ? eventInfo.data.note : "";
          val.name = eventInfo.data.name ? eventInfo.data.name : "";
          val.urlToEvent = eventInfo.data.urlToEvent
            ? eventInfo.data.urlToEvent
            : "";
          val.allDay = eventInfo.data.allDay ? eventInfo.data.allDay : false;
          return val;
        });
  
        if (eventInfo.data.assignedGroup?._id) {
          getSubjects(eventInfo.data.assignedGroup._id).then((trainingPathId) => {
            if (eventInfo.data.assignedSubject?._id) {
              getChapters(eventInfo.data.assignedSubject._id, trainingPathId);
              if (eventInfo.data.assignedChapter?._id) {
                getContents(eventInfo.data.assignedChapter._id, trainingPathId);
              }
            }
          });
        }
      } else {
        setEventInfoType({ type: "addNew" });
        if(eventInfo.eventType == "Homework" || eventInfo.eventType == "Exam") setStartedFromExaminateView(true)
        setCurrentEvent({
          name: "",
          note: "",
          examCoefficient: undefined,
          date: checkDateHandler(eventInfo.date),
          allDay: false,
          eventType: eventInfo.eventType,
          assignedGroup: eventInfo.assignedGroup || undefined,
          assignedSubject: eventInfo.assignedSubject || undefined,
          assignedChapter: undefined,
          assignedContent: "Exam",
          durationTime: "00:45",
          urlToEvent: "",
        });
        if (!!eventInfo.assignedGroup) {
          getSubjects2(eventInfo.assignedGroup, eventInfo.assignedSubject);
        }
      }
    } else {
      setEventInfoType({ type: eventInfo.type });
      setCurrentEvent({
        name: "",
        note: "",
        examCoefficient: undefined,
        date: checkDateHandler(eventInfo.date),
        allDay: false,
        eventType: "Exam",
        assignedGroup: "",
        assignedSubject: "",
        assignedChapter: "",
        assignedContent: "",
        durationTime: "00:45",
        urlToEvent: "",
      });
    }
  }, [eventInfo]);

  useEffect(() => {
    if (
      fromContentDataForEvent !== null &&
      fromContentDataForEvent !== undefined
    ) {
      setEventInfoType({ type: "addNew" });
      setCurrentEvent((p) => {
        let val = Object.assign({}, p);
        if (fromContentDataForEvent.contentData.assignedContentType) {
          if (
            fromContentDataForEvent.contentData.assignedContentType ===
            "PRESENTATION"
          ) {
            val.eventType = "Online Class";
          } else if (
            fromContentDataForEvent.contentData.assignedContentType === "TEST"
          ) {
            val.eventType = "Exam";
          } else {
            val.eventType = "Homework";
          }
        }
        val.assignedGroup = fromContentDataForEvent.contentData.assignedGroup;
        val.assignedSubject =
          fromContentDataForEvent.contentData.assignedSubject;
        val.assignedChapter =
          fromContentDataForEvent.contentData.assignedChapter;
        val.assignedContent =
          fromContentDataForEvent.contentData.assignedContentId;
        return val;
      });

      getSubjects(fromContentDataForEvent.contentData.assignedGroup);
      getChapters(
        fromContentDataForEvent.contentData.originalTrainingModuleId,
        fromContentDataForEvent.contentData.trainingPathId
      );
      getContents(
        fromContentDataForEvent.contentData.assignedChapter,
        fromContentDataForEvent.contentData.trainingPathId
      );
    }
  }, [fromContentDataForEvent]);

  async function getSubjects(classId) {
    let trainingPathId = "";
    // missing periodId 
    await EventService.readTrainingModulesForEvents(classId).then((res) => {
      // this is a setTrainingPath, because inside trainingPath is TrainingModules
      setTrainingPath(res.data._id);
      trainingPathId = res.data._id;
      // od methode without filter by trainer class
      // setSubjects(res.data.trainingModules);

      if (res.data.trainingModules) {
        
        // other place like this: 
        // services/frontend/src/components/Program/ProgramTrainer/ProgramTrainerEdit/ProgramTrainerEdit.js ~170
        // trainers have acceess to their subjects , class manager has access to all subjcects in class
        let newData = res.data.trainingModules.filter(tr=> [...tr.trainers,res.data.classManager].some(tr1=>tr1==user.id)); // includes classmanager
                
        // trainers have acceess to their subjects , class manager has  access only to his class
        // let newData = res.data.trainingModules.filter(tr=> tr.trainers.some(tr1=>tr1===user.id));
        setSubjects(newData);
      }

      //old => without trainer filter setSubjects(res.data.trainingModules);
    });
    return trainingPathId;
  }

  async function getSubjects2(classId, subjectId) {
    let trainingPathId = "";
    // missing periodId 
    await EventService.readTrainingModulesForEvents(classId).then((res) => {
      setTrainingPath(res.data._id);
      trainingPathId = res.data._id;

      if (res.data.trainingModules) {
        setSubjects(res.data.trainingModules);
        let foundedIndex = res.data?.trainingModules.findIndex(
          (m) => m.originalTrainingModule === subjectId
        );
        if (foundedIndex > -1) {
          getChapters(
            res.data.trainingModules[foundedIndex].originalTrainingModule,
            res.data._id
          );
        }
      }
    });
    return trainingPathId;
  }

  function getChapters(trainingModuleId, trainingPathFromContent) {
    let trainingPathId = trainingPath;
    if (trainingPathFromContent) {
      trainingPathId = trainingPathFromContent;
    }
    EventService.readChapters(trainingModuleId, trainingPathId).then((res) => {
      setChapters(res.data);
    });
  }

  function getContents(chapterId, trainingPathFromContent) {
    let trainingPathId = trainingPath;
    if (trainingPathFromContent) {
      trainingPathId = trainingPathFromContent;
    }
    EventService.readContents(chapterId, trainingPathId).then((res) => {
      // Old methode=> for test =>
      // setContents(res.data);

      // filter by contentType
      let newData = [];
      if (res.data) {
        res.data.map((c) => {
          if (
            c.content.contentType === "PRESENTATION" &&
            currentEvent.eventType === "Online Class"
          ) {
            newData.push(c);
          } else if (
            c.content.contentType === "TEST" &&
            currentEvent.eventType === "Exam"
          ) {
            newData.push(c);
          } else {
            // Homework
            newData.push(c);
          }
        });
      }
      setContents(newData);
    });
  }

  function checkDateHandler(date) {
    let newDate = date;
    let date2 = new Date(date);
    if (date) {
      if (date2.getTime() - now() < 3000) {
        newDate = new Date(now()).toISOString();
      }
    }
    return newDate;
  }

  function durationTimeHandler(durationTime) {
    let hours = Math.floor(durationTime / 60);
    let minutes = durationTime % 60;
    if (hours < 9) {
      hours = `0${hours}`;
    }
    if (minutes < 9) {
      minutes = `0${minutes}`;
    }
    console.log(`${hours}:${minutes}`);
    return `${hours}:${minutes}`;
  }

  function save() {
    if (currentEvent.name && currentEvent.name.length >= 3 && 
      (currentEvent.eventType && 
      (currentEvent.eventType === "Homework"
      || currentEvent.eventType === "Exam"
      || currentEvent.eventType === "Online Class"
      ))) {
      setValidators(false);
      eventAction({
        type: eventInfoType.type === "addNew" ? "add" : "update",
        data: currentEvent,
      }).then(() => setOpen(false));
    } else {
      setValidators(true);
    }
  }

  const eventTypesList = eventTypes.map((event, index) => {
    if(startedFromExaminateView){
      return <MenuItem disabled={startedFromExaminateView} key={index} value={event.type}> {event.type} </MenuItem>
    }
    else {
      return <MenuItem key={index} value={event.type}> {event.type} </MenuItem>
    }
  });
  const classesList = classes1.map((currentClass, index) => (
    <MenuItem key={index} value={currentClass._id} name={currentClass.name}>
      {currentClass.name}
    </MenuItem>
  ));

  const subjectsList = subjects.map((item, index) => (
    <MenuItem
      key={item.originalTrainingModule}
      value={item.originalTrainingModule}
      orgTrId={item.originalTrainingModule}
    >
      {item.newName}
    </MenuItem>
  ));
  const chaptersList = chapters.map((item, index) => (
    <MenuItem
      key={item.chapter?._id}
      value={item.chapter?._id}
      orgChId={item.chapter?._id}
    >
      {item.chapter?.name}
    </MenuItem>
  ));
  const contentList = contents.map((item, index) => (
    <MenuItem
      key={item.content._id}
      value={item.content._id}
      contentTitle={item.content.title}
    >
      {item.content.title}
    </MenuItem>
  ));
  return (
    <ThemeProvider theme={new_theme}>
      <Dialog 
        PaperProps={{
                style:{borderRadius: "16px", padding: '10px', background: theme.palette.glass.opaque, backdropFilter: "blur(20px)"}
        }} 
        open={isOpen}
        fullWidth
        onClose={() => {
          setOpen(false);
          setFromContentDataForEvent(null);
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" className="text-center" style={{backgroundColor: new_theme.palette.shades.white60}}>
          <Typography variant="h3" component="h3" sx={{color: new_theme.palette.newSupplementary.NSupText}}>
            {isExam ? (eventInfo.type === "update" || eventInfo.data) ? t("Update column") :t("Create New Column") : t("Add new event")}
          </Typography>
        </DialogTitle>
        <DialogContent style={{backgroundColor: new_theme.palette.primary.PWhite}}>
          <Grid container spacing={isWidthUp('md',currentScreenSize) ? 1 : 0}>
            <Grid item xs={12} lg={6}>
              <TextField
                  style={{maxWidth:'400px'}}
                  label={isExam ? t("Exam name") : t("Event name")}
                  variant="filled"
                  margin="dense"
                  error={validators}
                  fullWidth={true}
                  required={true}
                  helperText={validators ? "required" : ""}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={currentEvent.name}
                  onInput={(e) => {
                    setCurrentEvent((p) => {
                      let val = Object.assign({}, p);
                      val.name = e.target.value;
                      return val;
                    });
                  }}
              />
            </Grid>
            {!isExam && <>
              <Grid item xs={12} lg={6}>
              <FormControl style={{ maxWidth: "400px" }} margin="dense"
                          variant="filled" required={true}
                          fullWidth={true}
              >
                <InputLabel id="demo-simple-select-label">{t('Event type')}</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    name='eventType'
                    value={currentEvent.eventType}
                    disabled={isExam}
                    error={validators}
                    required={true}
                    helperText={validators ? "required" : ""}
                    onChange={({target:{value}}) => {
                      setCurrentEvent(p=>({
                        ...p,
                        assignedGroup : "",
                        assignedSubject : "",
                        assignedChapter : "",
                        assignedContent : "",
                        eventType : value,
                      }))
                    }}
                >
                  {eventTypesList}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} lg={6}>
              <FormControl style={{ maxWidth: "400px" }} margin="dense"
                          variant="filled" required={true}
                          fullWidth={true}
              >
                <InputLabel id="demo-simple-select-label">{t('Select class')}</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    name='eventType'
                    value={currentEvent.assignedGroup}
                    onChange={({target:{value}}) => {
                      getSubjects(value);
                      setCurrentEvent(p=>({...p,
                        assignedGroup : value,
                        assignedSubject : '',
                        assignedChapter : '',
                        assignedContent : '',
                      }));
                    }}
                >
                  {classesList}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} lg={6}>
              <FormControl style={{ maxWidth: "400px" }} margin="dense"
                          variant="filled" required={true}
                          fullWidth={true}
              >
                <InputLabel id="demo-simple-select-label">{t('Select subject')}</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    name='subject'
                    disabled={!currentEvent.assignedGroup}
                    value={currentEvent.assignedSubject}
                    onChange={({target:{value}},{props:{orgTrId}}) => {
                      getChapters(orgTrId);
                      setCurrentEvent(p=>({...p,
                        assignedSubject : value,
                        assignedContent : '',
                        assignedChapter : '',
                      }));
                    }}
                >
                  {subjectsList}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} lg={6}>
              <KeyboardDatePicker
                  style={{maxWidth:'400px'}}
                  margin="dense"
                  id="date-picker-dialog"
                  label={t("Start day")}
                  inputVariant="filled"
                  format="DD.MM.yyyy"
                  fullWidth={true}
                  className="datePickerH"
                  minDate={new Date(now()).toISOString().split("T")[0]}
                  minDateMessage={"this event has already taken place"}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={currentEvent.date}
                  KeyboardButtonProps={{
                    "aria-label": "change date",
                  }}
                  onChange={(date) => {
                    if (date && date._isValid) {
                      setCurrentEvent((p) => ({
                        ...p, date:new Date(date).toISOString(),
                      }))
                    }}}
              />
            </Grid>
            </>}
            <Grid item xs={12} lg={6}>
            <FormControl style={{ maxWidth: "400px" }} margin="dense"
                        variant="filled" required={true}
                        fullWidth={true}
            >
              <InputLabel id="demo-simple-select-label">{t('Select chapter')}</InputLabel>
              <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  name='chapter'
                  disabled={!currentEvent.assignedSubject}
                  value={currentEvent.assignedChapter}
                  onChange={({target:{value}},{props:{orgChId}}) => {
                    getContents(orgChId);
                    setCurrentEvent(p=>({
                      ...p,
                      assignedChapter : value,
                      assignedContent : "",
                    }))
                  }}
              >
                {chaptersList}
              </Select>
            </FormControl>
            </Grid>

            {!isExam &&
                <Grid item xs={12} lg={6}>
              <KeyboardTimePicker
                  style={{maxWidth:'400px'}}
                  ampm={false}
                  fullWidth={true}
                  margin="dense"
                  id="time-picker"
                  className="datePickerH"
                  label={t("Start time")}
                  disabled={currentEvent.allDay}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={currentEvent.date}
                  inputVariant="filled"
                  KeyboardButtonProps={{
                    "aria-label": "change time",
                  }}
                  onChange={(date) => {
                    if (date && date._isValid) {
                      if(date._f === 'HH:mm'){
                        let newDate = new Date(currentEvent.date);
                        newDate.setHours(`${date._i.split(':')[0]}`);
                        newDate.setMinutes(`${date._i.split(':')[1]}`);
                        setCurrentEvent((p) => ({
                          ...p, date: new Date(newDate).toISOString(),
                        }));
                      }else{
                        setCurrentEvent((p) => ({
                          ...p, date: new Date(date).toISOString(),
                        }));
                      }
                    }
                  }}
              />
              {/* We dont use URL for the moment in event */}
              {/* <TextField
                  label={t("Url to event")}
                  margin="normal"
                  InputLabelProps={{
                      shrink: true,
                  }}
                  value={currentEvent.urlToEvent}
                  onInput={(e) => {
                      setCurrentEvent((p) => {
                      let val = Object.assign({}, p);
                      val.urlToEvent = e.target.value;
                      return val;
                      });
                  }}
                  />
              </>} */}
                </Grid>}

            {!isExam && <>
            <Grid item xs={12} lg={6}>
              <FormControl style={{ maxWidth: "400px" }} margin="dense"
                          variant="filled" required={true}
                          fullWidth={true}
              >
                <InputLabel id="demo-simple-select-label">{t('Select content')}</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    name='eventType'
                    disabled={!currentEvent.assignedChapter}
                    value={currentEvent.assignedContent}
                    onChange={({target:{value}},{props:{contentTitle='x'}}) => {
                      setCurrentEvent(p=>({
                        ...p,
                        assignedContent : value,
                        name: (p.name === "" ? `${p.eventType}-${contentTitle}` : p.name),
                      }))
                    }}
                >
                  {callFromComponent !== "GRADEBOOK" ? contentList : null}
                  {currentEvent.eventType === "Homework" && (
                      <MenuItem
                          value={"Homework"}
                          contentTitle={"Homework on paper"}
                      >
                        {t("Homework on paper")}
                      </MenuItem>
                  )}
                  {currentEvent.eventType === "Exam" && (
                      <MenuItem
                          value={"Exam"}
                          contentTitle={"Exam in class"}
                      >
                        {t("Exam in class")}
                      </MenuItem>
                  )}
                </Select>
              </FormControl>
            </Grid>
            </>}

            {(currentEvent.eventType === "Exam") && (
                <Grid item xs={12} lg={6}>
                <TextField
                    style={{maxWidth:'400px'}}
                    label={t("Coefficient")}
                    type={"number"}
                    fullWidth={true}
                    margin="dense"
                    variant="filled"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    InputProps={{ inputProps: { min: 0, max: 20 } }}
                    value={currentEvent.examCoefficient}
                    onInput={({target:{value}}) => {
                      setCurrentEvent((p) => ({
                        ...p, examCoefficient : value,
                      }));
                    }}
                />
                </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions className="d-flex justify-content-between pr-4 pl-4 pb-3" style={{backgroundColor: new_theme.palette.shades.white60}}>
          <StyledButton
            eVariant="secondary"
            eSize="medium"
            onClick={() => setOpen(false)}
          >
            {t("Back")}
          </StyledButton>
          <StyledButton
            eSize="medium"
            eVariant="primary"
            disabled={
              !(
                (!isExam && currentEvent.assignedContent) ||
                (isExam && currentEvent.name && currentEvent.examCoefficient && currentEvent.eventType) // && currentEvent.assignedChapter // can add this depending on whether is it required for exam to select a chapter from gradebook while adding/editing (currently set as not required)
                )
              }
              onClick={() => {
                save();
              }}
              >
            {t("Save")}
          </StyledButton>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
}
