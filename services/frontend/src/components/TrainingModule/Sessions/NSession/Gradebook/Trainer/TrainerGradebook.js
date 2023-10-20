import React, {lazy, useEffect, useState} from "react";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import FormControl from "@material-ui/core/FormControl";
import {isWidthUp} from "@material-ui/core/withWidth";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import {useTranslation} from "react-i18next";
import {useMainContext} from "../../../../../_ContextProviders/MainDataContextProvider/MainDataProvider";
import CoursePathService from "../../../../../../services/course_path.service";
import {useSessionContext} from "../../../../../_ContextProviders/SessionProvider/SessionProvider";
import MenuItem from "@material-ui/core/MenuItem";
import EventService from "../../../../../../services/event.service";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import {renderCellExpand} from "../../../../../common/Table/renderCellExpand";
import {makeStyles} from "@material-ui/core/styles";
import GradbookTableGrades from "../../../../../Gradebooks/Trainer/GradebookTableGrades";
import Button from '@material-ui/core/Button';
import OptionsButton from "../../../../../common/OptionsButton";
import ResultService from "../../../../../../services/result.service";
import {now} from "moment";
import ManageEventModal from "./ManageEventModal";
import {EButton} from "styled_components";


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

export default function TrainerGradebook(){
    const { t } = useTranslation();
    const classes = useStyles();
    const {currentScreenSize, F_getHelper, F_showToastMessage} = useMainContext();
    const {userPermissions, user:{role}} = F_getHelper();
    const {
        currentSession,
    } = useSessionContext();
    const [tableRows, setTableRows] = useState([]);
    const [isTableLoading,setIsTableLoading] = useState(false);
    const initialColumns = [
                { field: 'id', headerClassName: classes.verticalText, maxWidth:40, minWidth:40, headerName: currentSession.enrollmentEndDate?.substring(0,4), hide: false, sortable: false, disableColumnMenu: true, flex: 1},

        { field: 'userName', minWidth: 200, headerClassName: classes.verticalText, headerName: t('Name | Surname'), renderCell:renderCellExpand },
        { field: 'average',  headerClassName: classes.verticalText2, minWidth: 130, headerAlign: 'start', headerName: t('Average')},
    ]
    const [tableColumns, setTableColumns]= useState(initialColumns);

    const [exams, setExams] = useState([]);
    const [assignedModel, setAssignedModel]= useState({assignedCourse: '', assignedGroup: ''});
    const [courses, setCourses] = useState([]);
    // const [groups, setGroups] = useState([]);

    const [eventModalHelper, setEventModalHelper] = useState({isOpen: false, type: 'ADD', assignedModel: undefined});
    const [eventInfo, setEventInfo] =useState({
        assignedGroup: "",
        assignedPeriod: "",
        assignedSubject: ""
    });

    // options Buttons
    const optionsBtn = [
        {id: 2, name: t("Manage columns"), action: ()=>{setEventModalHelper({isOpen: true, type: 'MANAGE', action:'EDIT', assignedModel})},},
        {id: 3, name: t("Remove columns"), action: ()=>{setEventModalHelper({isOpen: true, type: 'MANAGE', action:'DELETE', assignedModel})},}
    ]


    useEffect(()=>{
        if(currentSession?.groups?.[0]?.duplicatedCoursePath?._id){
            CoursePathService.read(currentSession?.groups?.[0]?.duplicatedCoursePath?._id).then(res => {
                if(res?.data && res?.status === 200){
                    setCourses(res.data?.courses);
                    autoSelect();
                }
            }).catch(err=>console.log(err));
        }
    },[]);

    const getExamsList=(groupId, courseId)=>{
            if(courseId && groupId){
                EventService.getExamListOfCourse(groupId, courseId).then(res=>{
                    if(res.status === 200 && res.data){
                        setTableValue(res.data)
                    }
                }).catch(err=>console.log(err));
            }
    };

    function saveGrades(){
        console.log("update-tableRows",tableRows);
        let data = {
            //trainingModuleId : model.assignedSubject, => new replaced with courseId
            groupId: assignedModel.assignedGroup,
            courseId: assignedModel.assignedCourse,
            trainees: tableRows,
        };
        if(assignedModel.assignedGroup !== ""){
            ResultService.updateGradeBookResults(data).then(res=>{
                F_showToastMessage("Grades were saved success","success");
            })
        }else{
            F_showToastMessage("Before save You have to select subject","warning");
        }
    }

    const autoSelect=()=>{
        if(currentSession?.groups?.length>0){
            setAssignedModel(
                {assignedGroup: currentSession.groups[0]._id,
                    assignedCourse: currentSession.groups[0]?.duplicatedCoursePath?.courses[0]._id}
            );
            setCourses(currentSession.groups[0]?.duplicatedCoursePath?.courses);
            getExamsList(currentSession.groups[0]._id, currentSession.groups[0]?.duplicatedCoursePath?.courses[0]._id);
        }
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
        if(data?.exams?.length){
            data.exams.filter(x=>!x.hide).map((item, index)=>{
                exams.push({ headerClassName: classes.verticalText2, headerAlign: 'start',
                    index: index,field: t(`${(++index)}-${item?.name||"-"}`), headerName: t(`${item?.name ||"-"}`), _id:item._id,
                    examItem: item,
                    name: item.name, flex: 1, disableClickEventBubbling: true, external: !item.assignedContent, // editable: true,
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
                        // params.row.grades value becomes empty when user click on the select course SECOND time.
                        let grade = params.row.grades.filter(grade=>(item._id === grade.event || (item.assignedContent && item.assignedContent === grade.content?._id)));
                        return grade.length? (!item.assignedContent ? ( ((grade[0].grade !== "-") && (grade[0].grade !== "undefined")) ? grade[0].grade : "") : grade[0].grade): "-";
                    }),
                    renderCell: (params)=>{
                        // checking if grade is linked to event or not, NOT condtion: item.assignedContent === grade.content._id
                        let grade = params.row.grades.filter(grade=>(item._id === grade.event || (item.assignedContent && item.assignedContent === grade.content?._id)));
                        if(grade.length>0){
                            return (
                                <TextField classes={{ root:  grade[0].coefficient > 1 ? classes.More :classes.Grade }} color={!item.assignedContent&&grade[0].new?"secondary":false} focused={!item.assignedContent&&grade[0].new?true:false}
                                           type={ "string"}
                                           InputLabelProps={{
                                               shrink: true,
                                           }}
                                           InputProps={{
                                               disableUnderline: true,
                                               readOnly: !!item.assignedContent||!['Trainer','TrainingManager','Architect'].includes(role),
                                               step: "0.1",
                                           }}
                                           value={!item.assignedContent ? ( ((grade[0].grade !== "-") && (grade[0].grade !== "undefined")) ? grade[0].grade : "") : grade[0].grade}
                                           placeholder={"-"}
                                           onChange={(e) =>{
                                                // allow only numbers and dot and comma
                                                let value = e.target.value;
                                                if(value.match(/^[0-9.,]+$/)||value.length===0){
                                                    setTableRows(p=>{
                                                        let val = Object.assign([],p);
                                                        let gradeIndex = params.row.grades.findIndex(item=> item._id === grade[0]._id);
                                                        val[params.id-1].grades[gradeIndex].grade = e.target.value.replace(",",".")>20?20:e.target.value<0?0:e.target.value;
                                                        val[params.id-1].grades[gradeIndex].new = true
                                                        let newGrades = val[params.id-1].grades.filter(x=>(!['','-'].includes(x.grade)))
                                                        val[params.id-1].average = newGrades?.length>0? Number(newGrades.reduce((s,i)=>(parseFloat(i.grade?.replace(",",".")||0)*i.coefficient+s),0)/(newGrades.reduce((s2,i2)=>(i2.coefficient+s2),0))).toFixed(2): 0
                                                        params.api.updateRows(val);
                                                        return val;
                                                    })
                                                }
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
        }
        setExams(exams);
        setTableColumns([...initialColumns, ...exams]);
        let trainees = [];
        if(data?.trainees?.length){
            data.trainees.map((tr, index)=>{
                trainees.push({id: index+1, userName: `${tr.trainee.name} ${tr.trainee.surname}`, average: tr.average, grades: tr.grades})
            })
        }
        setTableRows(trainees);
        setIsTableLoading(false);
    }

    const addColumn=(action)=>{
        setEventModalHelper({isOpen: true, type: 'ADD', assignedModel})}


    const groupsList = currentSession?.groups.length >0 ? currentSession.groups.map((item,index)=><MenuItem key={item._id} value={item._id}>{item.name}</MenuItem>): [];
    const coursesList = courses.length >0 ? courses.map((item,index)=><MenuItem key={item._id} value={item._id}>{item.name}</MenuItem>): [];


    return(
        <Grid container spacing={3}>
            <Grid item xs={12} className='mt-2'>
                    <FormControl style={{width:isWidthUp('sm',currentScreenSize) ? "25%" : "80%"}} className={isWidthUp('sm',currentScreenSize) && "mr-5"} variant="filled">
                        <InputLabel id="demo-simple-select-label">{t("Select group")}</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={assignedModel.assignedGroup}
                            onChange={({target:{value}}) => {
                                setAssignedModel({assignedGroup: value, assignedCourse: ""});
                                setCourses(p=>{
                                    let group = currentSession.groups.find(item=>item._id === value);
                                    return group?.duplicatedCoursePath?.courses||[];
                                });
                            }}
                        >
                            {groupsList}
                        </Select>
                    </FormControl>
                    <FormControl style={{width:isWidthUp('sm',currentScreenSize) ? "25%" : "80%"}} className={isWidthUp('sm',currentScreenSize) && "mr-5"} variant="filled">
                        <InputLabel id="demo-simple-select-label">{t("Select course")}</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            disabled={assignedModel.assignedGroup === ""}
                            id="demo-simple-select"
                            value={assignedModel.assignedCourse}
                            onChange={({target:{value}}) => {
                                setAssignedModel(p=>({...p, assignedCourse: value}))
                                // getExamsList(groupId,courseId);
                                // getExamsList('119911111119900000000000','20000000008000000000000a');
                                getExamsList(assignedModel.assignedGroup,value);
                            }}
                        >
                            {coursesList}
                        </Select>
                    </FormControl>
            </Grid>

            <Grid item xs={12}>
                <Paper elevation={10} className="p-0 ourGradebook">
                    <div className={`d-flex pt-2 px-2 justify-content-end align-items-center ${!isWidthUp('sm',currentScreenSize) && "flex-column"}`}>
                        {(userPermissions.isTrainer && assignedModel.assignedGroup) && (
                            <div className="d-flex justify-content-end">
                                <EButton size="small" variant="contained" color="primary" className="mr-2"
                                        onClick={()=>{
                                            saveGrades()
                                        }}>{t("Save")}
                                </EButton>
                                <EButton eSize="small" eVariant="secondary"
                                         className='mr-3'
                                        onClick={addColumn}>{t("Add New Column")}
                                </EButton>
                                <OptionsButton iconButton={true} btns={optionsBtn} eSize="small"/>
                            </div>
                        )}
                    </div>
                    <hr className="mt-2" style={{backgroundColor:"#fff"}} />
                    <GradbookTableGrades tableRows={tableRows} tableColumns={tableColumns} isTableLoading={isTableLoading}/>
                </Paper>
            </Grid>
            <ManageEventModal
                eventModalHelper={eventModalHelper}
                setEventModalHelper={setEventModalHelper}
                exams={exams}

                getExamsList={getExamsList}
                assignedModel={assignedModel}
            />
        </Grid>
    )
}