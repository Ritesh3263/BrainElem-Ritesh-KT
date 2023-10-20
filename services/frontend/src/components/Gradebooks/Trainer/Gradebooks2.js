import React, {lazy, useEffect, useState} from "react";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import TextField from '@material-ui/core/TextField';
import MenuItem from "@material-ui/core/MenuItem";
import Paper from "@material-ui/core/Paper";
import Tooltip from '@material-ui/core/Tooltip';
import ModuleCoreService from "services/module-core.service";
import ResultService from "services/result.service";
import EventService from "services/event.service"
import SubjectSessionService from "services/subject_session.service"
import Button from '@material-ui/core/Button';
import { makeStyles} from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import {useTranslation} from "react-i18next";
import GradbookTableGrades from "./GradebookTableGrades";
import {renderCellExpand} from "components/common/Table/renderCellExpand";
import OptionsButton from "components/common/OptionsButton";
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import {isWidthUp} from "@material-ui/core/withWidth";
import {now} from "moment";
import '../GradeBook2.css';
import {EButton} from "styled_components";
import Confirm from "components/common/Hooks/Confirm";
import { usePrompt } from 'components/common/Hooks/usePrompt';

const EventModal = lazy(() => import("../../Calendar/helpers/EventModal"));
const RemoveExamModal = lazy(() => import("./RemoveExamModal"));
const ManageExamModal = lazy(() => import("./ManageExamModal"));

const useStyles = makeStyles(theme => ({
    verticalText: {
        textAlign: "left",
        position: "absolute",
        overflow: "hidden",
        whiteSpace: "nowrap",
        padding: "0",
        margin: "0",
        lineHeight: "26px",
    },
    verticalText2 : {
        WebkitTransform: "rotate( -90deg)",
        transform: "rotate( -90deg)",
        MozTransform: "rotate(-90deg)",
        OTransform: "rotate(-90deg)",
        textAlign: "left",
        MsTransform: "rotate(-90deg)",
        WebkitTransformOrigin: "0 100%",
        MozTransformOrigin: "0 100%",
        OTransformOrigin: "0 100%",
        MsTransformOrigin: "0 100%",
        origin: "0 100%",
        display: "inline-block",
        position: "absolute",
        overflow: "visible",
        whiteSpace: "wrap",
        padding: "0",
        margin: "0",
        top: "12px",
        left: "38px",
        lineHeight: "51px",
    },

    More:{
        "& .MuiInputBase-input ": {
            color:   "black",
            fontWeight: 900,
        }  
    },

    Grade:{
        "& .MuiInputBase-input ": {
            color:   "black"
        }
    }

}));

export default function Gradebooks2({isBlocking,setIsBlocking}){
    const { t } = useTranslation();
    const { isConfirmed } = Confirm();
    const classes = useStyles();
    const [model, setModel]= useState({
        assignedClass: "",
        assignedPeriod: "",
        assignedSubject: "",
    });

    const [classes1, setClasses1] = useState([]);
    const [periods, setPeriods] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [events, setEvents] = useState([]);
    const [currentPeriodName, setCurrentPeriodName] = useState("");
    const [minmax, setMinmax] = useState({ max: "60", passPercentage: 60, passValue: "10"});

    usePrompt(isBlocking);

    // setCurrentRoute
    const {setMyCurrentRoute, F_showToastMessage, F_getHelper, currentScreenSize} = useMainContext();
    const {user, userPermissions} = F_getHelper();

    // for Table
    const [tableRows, setTableRows] = useState([]);
    const [isTableLoading,setIsTableLoading] = useState(false);
    const initialColumns = [
        { field: 'id', headerClassName: classes.verticalText, maxWidth:40, minWidth:40, headerName: " ", hide: false, sortable: false, disableColumnMenu: true, flex: 1},
        { field: 'userName', minWidth: 200, headerClassName: classes.verticalText, headerName: t('Name | Surname'), renderCell:renderCellExpand },
        { field: 'average',  headerClassName: classes.verticalText2, minWidth: 130, headerAlign: 'start', headerName: t('Average')},
    ]
    const [tableColumns, setTableColumns]= useState(initialColumns);


    // Create new event
    const [isOpenModal, setIsOpenModal] =useState(false);
    const [fromContentDataForEvent, setFromContentDataForEvent] = useState(null);
    const [eventInfo, setEventInfo] =useState({
        type:"ADD_FROM_GRADEBOOK",
        date: new Date(now()).toISOString(),
        eventType: "Exam",
        assignedGroup: "",
        assignedPeriod: "",
        assignedSubject: ""
    });

    // remove modal
    const [isOpenRemoveModal, setIsOpenRemoveModal] = useState(false);
    const [isOpenManageModal, setIsOpenManageModal] = useState(false);
    const [exams, setExams] = useState([]);
    const [refreshTable, setRefreshTable] = useState(false);


    // options Buttons
    const optionsBtn = [
        {id: 2, name: t("Manage columns"), action: ()=>{setIsOpenManageModal(true)},},
        {id: 3, name: t("Delete columns"), action: ()=>{setIsOpenRemoveModal(true)},}
    ]

    useEffect(()=>{
        setMyCurrentRoute("Gradebook");
        // ModuleCoreService.resetCurriculum('611ab380d26a78c075422076','61287dcaa4a86f63d4934a0f').then((res)=>{
        //     if(res.status === 200){
        //         console.log("resetCurriculum");
        //     }
        // })
        // ModuleCoreService.getMinmax().then((res)=>{
        //     if(res.status === 200){
        //         // commenting setting minimal/maximal/passPercentage values as they are causing fault with removing grades
        //         setMinmax(res.data);
        //     }
        // })
    },[])

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////

    const func1 = async()=>{
        try{
            const response = await EventService.getMyClasses();
            if(response.status===200){
                if(response.data.length>0){
                    response.data[0].currentClassId = response.data[0]._id;
                    setClasses1(response.data);
                    setModel(p=>({...p,assignedClass:response.data[0]._id, assignedSubject: "",}));
                }
                return response.data;
            }else{throw response}
        }catch(error){console.log(error)}
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////

    const func12 = async(data,opt2)=>{
        let class1 = opt2? classes1.find(el=>el._id===data[0].currentClassId):data.find(el=>el._id===data[0].currentClassId)
        try{
            
            // below dealing with automatic periods switching (and possiblity to add exams) in all 5 cases, can be done in a nicer way.. TODO
            // Possible situations:
            // - case1: first period is opened, second closed
            // - case2: second period is opened, first closed
            // - case3: both periods are closed
            // - case4: both periods have not started yet
            // - case5: break between periods
            let periodArray = [];
            let backupPeriodArray = [];
            let periodData = class1.academicYear.periods.map(x=>{
                if(x.startDate < new Date(now()).toISOString() && x.endDate > new Date(now()).toISOString()) {
                    periodArray.id = x._id;
                    periodArray.startDate = x.startDate;
                    periodArray.endDate = x.endDate;
                    return periodArray
                }
                else if((x.startDate < new Date(now()).toISOString() && x.endDate < new Date(now()).toISOString()) || (x.startDate > new Date(now()).toISOString() && x.endDate > new Date(now()).toISOString())) {
                    backupPeriodArray.id = x._id;
                    return backupPeriodArray
                }
            })
            periodData = periodData.find(x=>x)
            if(!periodData.startDate){
                let periodData = class1.academicYear.periods.map(x=>{
                    backupPeriodArray.id = x._id;
                    backupPeriodArray.startDate = x.startDate;
                    backupPeriodArray.endDate = x.endDate;
                    return backupPeriodArray
                })
                periodData = backupPeriodArray.find(x=>x)
            }
            data[0].periodId = periodData.id;
            setPeriods(class1.academicYear.periods);
            setModel(p=>({...p,assignedPeriod:periodData.id,assignedPeriodEndDate:periodData.endDate, assignedPeriodStartDate:periodData.startDate, assignedSubject: "",}));
            setCurrentPeriodName(class1.academicYear.periods.find(x=>x._id === data[0].periodId)?.name||'loading...');
            return data
        }catch(error){console.log(error)}
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////

    const func2 = async(data)=>{
        try{
            const response = await ModuleCoreService.getSubjectsInClass(data[0].currentClassId, data[0].periodId);
            if(response.status===200){
                if(response.data.length>0){
                    setSubjects(response.data);
                    setModel(p=>({...p,assignedSubject: response.data[0].id,}));
                }
                return {subjectsArray: response.data, periodId:data[0].periodId, currentClassId: data[0].currentClassId, periodEndDate: data[0].periodEndDate, periodStartDate: data[0].periodStartDate};
            }else{throw response}
        }catch(error){console.log(error)}
    }
    /////////////////////////////////////////////////////////////////////////////////////////////////////////

    
    const func3 = async(data)=>{
        if(data.subjectsArray.length>0){
            try{       
                const response22 = await SubjectSessionService.getPeriod(data.periodId);
                setModel(p=>({...p,periodId:data.periodId, assignedPeriodEndDate: response22.data.endDate, assignedPeriodStartDate: response22.data.startDate }));
                const response = await EventService.getExamListOfSubject(data.currentClassId, data.periodId, data.subjectsArray[0].id);
                if(response.status===200){
                    setTableValue(response.data)
                    setEvents(response.data.exams?.filter(x=>!x.hide));
                    document.documentElement.style.setProperty('--gradebook-title-height',`${190}px`);
                    document.documentElement.style.setProperty('--gradebook-window-top',`${197}px`);
                }else{throw response}
            }catch(error){console.log(error)}
            setRefreshTable(false);
        } else {
            setSubjects([]);
            setTableValue([]);
            setEvents([]);
            // setRefreshTable(false);
        }
    }
    useEffect(()=>{
        setIsTableLoading(true);
        func1().then(res=>{
            func12(res).then(res1=>{
                func2(res1).then(res2=>{
                    func3(res2).then(()=>{setIsTableLoading(false)}).catch(error=>console.log(error))
                })
            })
        })
    },[refreshTable]);

    useEffect(()=>{
        setIsTableLoading(true);
        setTableColumns(
            [
                { field: 'id',  _id: "BF_1", maxWidth:40, minWidth:40, headerClassName: classes.verticalText, headerName: " ", hide: false, sortable: false, disableColumnMenu: true},
                { field: 'userName', _id: "BF_2", minWidth: 200, headerClassName: classes.verticalText, headerName: t('Name | Surname'), description:"Name | Surname", renderCell:renderCellExpand },
                { field: 'average', _id: "BF_2", minWidth: 130, headerClassName: classes.verticalText2, headerAlign: 'start', headerName: t('AVERAGE'), description:"Weighted average"},
            ]
        );
        (async()=>{
            await setEventInfo(p=>({...p,assignedGroup: model.assignedClass, assignedPeriod:model.assignedPeriod, assignedSubject: model.assignedSubject}))
            }
        )()
    },[model.assignedSubject])

    const getPeriods = async(currentClassId)=>{
        let req = [{currentClassId}];
        func12(req,true).then(res2=>{
            func2(res2).then(res3=>{
                func3(res3)
            })

        })
    }

    const getTrainingModule =(currentClassId, periodId)=>{
        let req = [{currentClassId, periodId}];
        func2(req).then(res2=>{
            func3(res2);
        })
    };

    const getExamList2 =(currentClassId, periodId, subjectId)=>{
        let req = {currentClassId, periodId, subjectsArray: [{id: subjectId}]}
        func3(req);
    }

    const removeExam=(examsId)=>{
        EventService.removeByExam(examsId).then(res=>{
            setTableColumns(p=>{
                let val = Object.assign([],p);
                val = val.filter(i=> i._id !== examsId);
                return val;
            });
            getExamList2(model.assignedClass, model.assignedPeriod, model.assignedSubject)
        }).catch(error=> console.log(error));
        setIsOpenRemoveModal(false);
        // refreshTable
        setRefreshTable(true);
    }

    const manageExam=(examsId)=>{
        setEventInfo(p=>({...p,
            // type: "update",
            assignedGroup: model.assignedClass, 
            assignedPeriod: model.assignedPeriod,
            assignedSubject: model.assignedSubject,
            data: events.find(i=> i._id === examsId)
        }))
        setIsOpenModal(true)
    }

    const shortString = (str, max=38, sep="...") => {
        let len = str.length;
        if(len > max){
            let back = str.substr(str.lastIndexOf(" ")+1, len);
            let seplen = sep.length;
            let front = str.substr(0, max-seplen-back.length);
            front = front.substr(0, Math.min(front.length, front.lastIndexOf(" "))) //re-trim in case it is in the middle of a word
            return front + sep + back;    
        }
        return str;
    }

    const setTableValue=(data)=>{
        let exams = [];
        if(data && data.exams){
            data.exams.filter(x=>!x.hide).map((item, index)=>{
                exams.push({ headerClassName: classes.verticalText2, headerAlign: 'start', index: index,field: t(`${(++index)}-${item?.name||"-"}`), headerName: t(`${item?.name ||"-"}`), _id:item._id, name: item.name, flex: 1, disableClickEventBubbling: true, external: !item.assignedContent, // editable: true,
                    renderHeader: () => {
                        return (
                            !item.assignedContent ? (
                                <Tooltip  title={t(`${item?.name ?? "-"} [externalExam]`)}>
                                            <Typography variant="subtitle2">
                                                {shortString(t(`${item?.name ?? "-"}`))}
                                            </Typography>
                                </Tooltip>
                            ) : (
                                <Tooltip  title={t(`${item?.name ?? "-"} [systemExam]`)}>
                                            <Typography variant="subtitle2" >
                                                {shortString(t(`${item?.name ?? "-"}`))}
                                            </Typography>
                                </Tooltip>
                            ))
                    },
                    valueFormatter:((params)=>{
                        let grade = params.row.grades.filter(grade=>(item._id === grade.event || (item.assignedContent && item.assignedContent === grade.content?._id)));
                        return grade.length>0 ? (!item.assignedContent ? ( ((grade[0].grade !== "-") && (grade[0].grade !== "undefined")) ? grade[0].grade : "") : grade[0].grade): '';
                    }),
                    renderCell: (params)=>{
                        // checking if grade is linked to event or not, NOT condtion: item.assignedContent === grade.content._id
                        let grade = params.row.grades.filter(grade=>(item._id === grade.event || (item.assignedContent && item.assignedContent === grade.content?._id)));
                        if(grade.length>0){
                            return (
                                <TextField classes={{ root:  grade[0].coefficient > 1 ? classes.More :classes.Grade }}   color={!item.assignedContent&&grade[0].new?"secondary":false} focused={!item.assignedContent&&grade[0].new?true:false} 
                                     type={ "string"}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    InputProps={{ 
                                        disableUnderline: true,
                                        readOnly: !!item.assignedContent,
                                        step: "0.1",
                                    }}
                                    value={!item.assignedContent ? ( ((grade[0].grade !== "-") && (grade[0].grade !== "undefined")) ? grade[0].grade : "") : grade[0].grade}
                                    placeholder={"-"}
                                    onChange={(e) =>{
                                        // setShowDialog(true);
                                        setIsBlocking(true);
                                        setTableRows(p=>{
                                            let val = Object.assign([],p);
                                            let gradeIndex = params.row.grades.findIndex(item=> item._id === grade[0]._id);
                                            val[params.id-1].grades[gradeIndex].grade = e.target.value.replace(",",".")>minmax.max?minmax.max:e.target.value<minmax.min?minmax.min:e.target.value;
                                            val[params.id-1].grades[gradeIndex].new = true
                                            let newGrades = val[params.id-1].grades.filter(x=>(!['','-'].includes(x.grade)))
                                            val[params.id-1].average = newGrades?.length>0? Number(newGrades.reduce((s,i)=>(parseFloat(i.grade?.replace(",",".")||0)*i.coefficient+s),0)/(newGrades.reduce((s2,i2)=>(i2.coefficient+s2),0))).toFixed(2): 0
                                            params.api.updateRows(val);
                                            return val;
                                        })
                                    }}
                                />
                            )
                        }
                    // else if grade is inserted without event, so for TrainingCenter
                    else if(grade.length>0){ 
                        return grade[0].grade;
                    }
                        else return "-"
                    }
                },)
            })
            // add one empty column with transparent visibility at the end of exam when number of exam is bigger than 6
            if (exams.length>6) {
                exams.push({ headerClassName: classes.verticalText2, headerAlign: 'start', field: 'empty', headerName: "", disableClickEventBubbling: true, minWidth: 130*exams.length/12, flex:1,
                    renderHeader: () => {
                        return (
                            <div style={{width: 130*exams.length/12}}></div>
                        )
                    },
                    renderCell: (params)=>{
                        return (
                            <div style={{width: 130*exams.length/12}}></div>
                        )
                    }
                })
            }
        }
        setExams(exams);
        setTableColumns([...initialColumns, ...exams]);
        let trainees = [];
        if(data && data.trainees){
            data.trainees.map((tr, index)=>{
                trainees.push({id: index+1, userName: `${tr.trainee.name} ${tr.trainee.surname}`, average: tr.average, grades: tr.grades})
            })
        }
        setTableRows(trainees);
        setIsTableLoading(false);
    }

    async function saveGrades(){
        let confirm = await isConfirmed("Do you want to save the changes in grades?");
        if(!confirm) return;
        let data = {
            groupId: model.assignedClass,
            trainingModuleId : model.assignedSubject,
            trainees: tableRows,
        };
        if(model.assignedSubject !== ""){
            setIsBlocking(false);
            ResultService.updateGradeBookResults(data).then(res=>{
                F_showToastMessage("Grades were saved success","success");
            })
        }else{
            F_showToastMessage("Before save You have to select subject","warning");
        }

    }

    async function updateEvent({type, data}){

         let newData = {...data, addedFromGradebook: true}
        switch (type){
            case "add":{
                newData.assignedContent = "Exam"; // IMPORTANT , https://gitlab.elia.academy/root/elia/-/issues/428
                await EventService.add(newData).then(res=>{
                    F_showToastMessage("Event was added success", "success");
                    getExamList2(model.assignedClass,model.assignedPeriod, model.assignedSubject)
                }).catch(error=>console.log(error))
                break;
            }
            case "update":{
                await EventService.update(data).then(res=>{
                    F_showToastMessage("Event was updated success", "success");
                    getExamList2(model.assignedClass,model.assignedPeriod, model.assignedSubject)
                }).catch(error=>console.log(error))
                break;
            }
            case "remove":{
                await EventService.remove(data).then(res=>{
                    F_showToastMessage("Event was updated removed", "success");
                }).catch(error=>console.log(error))
                break
            }
            default: break;
        }
    }

    const addColumn=(action)=>{
    setIsOpenModal(true);setEventInfo(p=>({...p, data:undefined}))};

    const classesList = classes1.length >0 ? classes1.map((item,index)=><MenuItem key={item._id} value={item._id}>{item.name}</MenuItem>): [];
    const periodsList = periods.length >0 ? periods.map((item,index)=><MenuItem key={item._id} value={item._id}>{item.name}</MenuItem>): [];
    const trainingModulesList = subjects.map((item, index)=><MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>);
    // const gradingScaleList = gradingScale.grades.map((item, index)=><MenuItem key={index} value={item.label}>{item.label}</MenuItem>);

    return(
        <>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Grid container spacing={1} className="px-2">
                        <Grid item xs={12} md={4}>
                            {/*<FormControl style={{width:isWidthUp('sm',currentScreenSize) ? "25%" : "80%"}} className={isWidthUp('sm',currentScreenSize) && "mr-5"} variant="filled">*/}
                                <FormControl fullWidth={true} style={{maxWidth:'400px', minWidth:'150px'}} margin="dense" variant="filled">
                                <InputLabel id="demo-simple-select-label">{t("Select class")}</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={model.assignedClass}
                                    //input={<Input/>}
                                    onChange={async (e) => {
                                        if(isBlocking) {
                                            let confirm = await isConfirmed("Do you want to save the changes in grades?");
                                            if(!confirm) return;
                                        }
                                        setModel(p=>({...p,assignedClass:e.target.value, assignedSubject: "",assignedPeriod:""}));
                                        getPeriods(e.target.value);
                                    }}
                                >
                                    {classesList}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            {/*<FormControl style={{width:isWidthUp('sm',currentScreenSize) ? "20%" : "70%"}} className={isWidthUp('sm',currentScreenSize) && "mr-5"} variant="filled">*/}
                                <FormControl fullWidth={true} style={{maxWidth:'400px', minWidth:'150px'}} margin="dense" variant="filled">
                                <InputLabel id="demo-simple-select-label">{t("Select period")}</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    disabled={model.assignedClass === ""}
                                    value={model.assignedPeriod}
                                    //input={<Input/>}
                                    onChange={async (e) => {
                                        if(isBlocking) {
                                            let confirm = await isConfirmed("Do you want to save the changes in grades?");
                                            if(!confirm) return;
                                        }
                                        setModel(p=>({...p,assignedPeriod:e.target.value, assignedSubject: "",}));
                                        getTrainingModule(model.assignedClass, e.target.value);
                                        setCurrentPeriodName(periods.find(p=>p._id===e.target.value)?.name||"loading...");
                                    }}
                                >
                                    {periodsList}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            {/**Select TrainingModule = Select Subject**/}
                            {/*<FormControl style={{width:isWidthUp('sm',currentScreenSize) ? "25%" : "80%"}}  className={isWidthUp('sm',currentScreenSize) ? "mr-5" : "mt-3"} variant="filled">*/}
                                <FormControl fullWidth={true} style={{maxWidth:'400px', minWidth:'150px'}} margin="dense" variant="filled">
                                <InputLabel id="demo-simple-select-label">{t("Select subject")}</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    disabled={model.assignedClass === ""||model.assignedPeriod === ""}
                                    value={model.assignedSubject}
                                    //input={<Input/>}
                                    onChange={async (e,x) => {
                                        if(isBlocking) {
                                            let confirm = await isConfirmed("Do you want to save the changes in grades?");
                                            if(!confirm) return;
                                        }
                                        setModel(p=>({...p, assignedSubject: e.target.value,}));
                                        getExamList2(model.assignedClass, model.assignedPeriod, e.target.value);
                                    }}
                                >
                                    {trainingModulesList}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item xs={12}>
                    <Paper elevation={10} className="p-0 ourGradebook">
                        <div className={`d-flex pt-2 px-2 justify-content-between align-items-center ${!isWidthUp('sm',currentScreenSize) && "flex-column"}`}>
                            <Typography variant="h5" component="h2" className="text-left" style={{color: `rgba(82, 57, 112, 1)`}}>
                                {t("Gradebook")}
                            </Typography>
                                {!userPermissions.isParent && model.assignedSubject && !F_getHelper().manageScopeIds.isTrainingCenter && (model.assignedPeriodStartDate < new Date(now()).toISOString() && model.assignedPeriodEndDate > new Date(now()).toISOString()) ?
                                    <div className="d-flex justify-content-end align-items-center">
                                        <EButton eSize="small" eVariant="primary"
                                                 className='mr-3'
                                                onClick={saveGrades}>{t("Save")}
                                        </EButton>
                                        <EButton eSize="small" eVariant="secondary"
                                                 className='mr-3'
                                                onClick={addColumn}>{t("Add New Column")}
                                        </EButton>

                                        <OptionsButton iconButton={true} btns={optionsBtn} eSize="small"/>
                                        
                                    </div>
                                        : !userPermissions.isParent && model.assignedSubject && !F_getHelper().manageScopeIds.isTrainingCenter && model.assignedPeriodEndDate < new Date(now()).toISOString() ?
                                        <Typography variant="h5" component="h2" className="text-right" >
                                            {t("Period finished")}
                                        </Typography>
                                        :
                                        <Typography variant="h5" component="h2" className="text-right" >
                                            {t("Period yet not started")}
                                        </Typography>
                                }
                        </div>
                        <hr className="mt-2" style={{backgroundColor:"#fff"}} />
                        <GradbookTableGrades tableRows={tableRows} tableColumns={tableColumns} isTableLoading={isTableLoading}/>
                    </Paper>
                </Grid>
            </Grid>
            <EventModal isOpen={isOpenModal}
                        setOpen={setIsOpenModal}
                        eventInfo={eventInfo}
                        eventAction={updateEvent}
                        fromContentDataForEvent={fromContentDataForEvent}
                        setFromContentDataForEvent={setFromContentDataForEvent}
                        callFromComponent="GRADEBOOK"
            />
            <ManageExamModal
                        isOpen={isOpenManageModal}
                        setOpen={setIsOpenManageModal}
                        exams={exams}
                        manageExam={manageExam}
            />
            <RemoveExamModal
                        isOpen={isOpenRemoveModal}
                        setOpen={setIsOpenRemoveModal}
                        exams={exams}
                        removeExam={removeExam}
            />
        </>
    )
}