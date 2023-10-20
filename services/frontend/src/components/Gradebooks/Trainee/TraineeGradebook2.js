import React, {lazy, useEffect, useState} from "react";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import TextField from '@material-ui/core/TextField';
import MenuItem from "@material-ui/core/MenuItem";
import Paper from "@material-ui/core/Paper";
import Tooltip from '@material-ui/core/Tooltip';
import EventService from "services/event.service"
import { makeStyles} from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import {useTranslation} from "react-i18next";
import GradbookTableGrades from "../Trainer/GradebookTableGrades";
import {renderCellExpand} from "components/common/Table/renderCellExpand";
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import {isWidthUp} from "@material-ui/core/withWidth";
import {now} from "moment";
import '../GradeBook2.css';

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

export default function TraineeGradebook2(){
    const { t } = useTranslation();

    const classes = useStyles();
    const [model, setModel]= useState({
        assignedClass: "",
        assignedPeriod: "",
        assignedSubject: "",
    });

    const [classes1, setClasses1] = useState([]);
    const [periods, setPeriods] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const {setMyCurrentRoute, F_getHelper, currentScreenSize} = useMainContext();
    const {user} = F_getHelper();

    const [tableRows, setTableRows] = useState([]);
    const [isTableLoading,setIsTableLoading] = useState(false);
const initialColumns = [
        { field: 'id', headerClassName: classes.verticalText, maxWidth:40, minWidth:40, headerName: ' ', hide: false, sortable: false, disableColumnMenu: true, flex: 1},
        { field: 'userName', minWidth: 200, headerClassName: classes.verticalText, headerName: t('Name | Surname'), renderCell:renderCellExpand },
        { field: 'average',  headerClassName: classes.verticalText2, minWidth: 130, headerAlign: 'start', headerName: t('Average')},
    ]
    const [tableColumns, setTableColumns]= useState(initialColumns);
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////

    const func1 = async()=>{
        try{
            const response = await EventService.getMyClasses();
            if(response.status===200){
                // console.log("getTrainerClasses -OK>>>",response.data.groups.length);
                if(response.data.length>0){
                    response.data[0].currentClassId = response.data[0]._id;
                    setClasses1(response.data);
                    setModel(p=>({...p,assignedClass:response.data[0]._id, assignedPeriod:"", assignedSubject: "",}));
                    return response.data;
                } 
            }else{throw response}
        }catch(error){console.log(error)}
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////

    const func12 = async(data,opt2)=>{//data==groups/sessions
        let class1 = opt2? classes1.find(el=>el._id===data[0].currentClassId):data.find(el=>el._id===data[0].currentClassId);
        
        try{
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
            data[0].periodName = class1.academicYear.periods[0].name;
            data[0].periodStartDate = class1.academicYear.periods[0].startDate;
            data[0].periodEndDate = class1.academicYear.periods[0].endDate;
            setPeriods(class1.academicYear.periods);
            setModel(p=>({...p,assignedPeriod:periodData.id,assignedPeriodEndDate:periodData.endDate, assignedPeriodStartDate:periodData.startDate, assignedSubject: "",}));
            return data
        }catch(error){console.log(error)}

    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////

    const func2 = async(data)=>{ //data==groups/sessions
        try{
            const response = await EventService.readTrainingModules(data[0].currentClassId, data[0].periodId);
            if(response.status===200){
                // console.log("getSubjectsInClass -OK>>>",response.data);
                if(response.data?.trainingModules?.length>0){
                    setSubjects(response.data.trainingModules);
                    setModel(p=>({...p,assignedSubject: response.data.trainingModules[0].originalTrainingModule,}));
                }
                return {currentClassId: data[0].currentClassId, periodId:data[0].periodId, subjectsArray: response.data.trainingModules,};
            }else{throw response}
        }catch(error){console.log(error)}
    }
    /////////////////////////////////////////////////////////////////////////////////////////////////////////

    const func3 = async(data)=>{
        try{
            const response = await EventService.getExamListOfSubject(data.currentClassId, data.periodId, data.subjectsArray[0].originalTrainingModule);
            console.log('res',response)
            if(response.status===200){
                let filteredTrainees = response.data?.trainees?.filter(tr=> tr?.trainee?._id === user.id);
                let newData = {...response.data, trainees: filteredTrainees}
                setTableValue(newData)
            }else{throw response}
        }catch(error){console.log(error)}
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////

    useEffect(()=>{
        setIsTableLoading(true);
        func1().then(res=>{
            func12(res).then(res1=>{
                func2(res1).then(res2=>{
                    func3(res2).then(()=>{setIsTableLoading(false)}).catch(error=>console.log(error))
                })
            })
        })
        setMyCurrentRoute("Gradebook")
    },[]);

    useEffect(()=>{
        setIsTableLoading(true);
        setTableColumns(
            [
                { field: 'id',  _id: "BF_1", maxWidth:40, minWidth:40, headerClassName: classes.verticalText, headerName: " ", hide: false, sortable: false, disableColumnMenu: true},
                { field: 'userName', _id: "BF_2", minWidth: 200, headerClassName: classes.verticalText, headerName: t('Name | Surname'), description:"Name | Surname", renderCell:renderCellExpand },
                { field: 'average', _id: "BF_2", minWidth: 130, headerClassName: classes.verticalText2, headerAlign: 'start', headerName: t('AVERAGE'), description:"Weighted average"},
            ]
        );
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
        let req = {currentClassId, periodId, subjectsArray: [{originalTrainingModule: subjectId}]}
        func3(req);
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
        console.log("setTableValue >>>",data);
        let exams = [];
        if(data && data.exams){
            data.exams.map((item, index)=>{
                exams.push({ index: index,field: t(`${(++index)}-${item?.name||"-"}`), headerClassName: classes.verticalText2, headerName: t(`${item?.name ||"-"}`), minWidth: 80, flex: 1, disableClickEventBubbling: true,
                    renderHeader: () => {
                        return (
                            !item.assignedContent ? (
                                <Tooltip title={t(`${item?.name ?? "-"} [externalExam]`)}>
                                            <span>
                                                {shortString(t(`${item?.name ?? "-"}`))}
                                            </span>
                                </Tooltip>
                            ) : (
                                <Tooltip title={t(`${item?.name ?? "-"} [systemExam]`)}>
                                            <span>
                                                {shortString(t(`${item?.name ?? "-"}`))}
                                            </span>
                                </Tooltip>
                            ))
                    },
                    renderCell: (params)=>{
                        // checking if grade is linked to event or not, NOT condtion: item.assignedContent === grade.content._id
                        let grade = params.row.grades.filter(grade=>(item._id === grade.event || (item.assignedContent && item.assignedContent === grade.content?._id)));
                        if(grade.length>0){
                            return (
                                <TextField classes={{ root:  grade[0].coefficient > 1 ? classes.More :classes.Grade }}
                                    type="string"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    InputProps={{
                                        disableUnderline: true,
                                        readOnly: true,
                                    }}
                                    value={!item.assignedContent ? ( ((grade[0].grade !== "-") && (grade[0].grade !== "undefined")) ? grade[0].grade : "-") : grade[0].grade}
                                    onChange={(e) =>{ // but a trainee may not be able to change grade!
                                        setTableRows(p=>{
                                            let newVal = e.target.value.replace(",","."); 
                                            let val = Object.assign([],p);
                                            let gradeIndex = params.row.grades.findIndex(item=> item._id === grade[0]._id);
                                            val[params.id-1].grades[gradeIndex].grade = newVal;
                                            val[params.id-1].grades[gradeIndex].new = true
                                            params.api.updateRows([...val]);
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
        }
        setTableColumns([...initialColumns, ...exams]);
        let trainees = [];
        if(data && data.trainees){
            data.trainees.map((tr, index)=>{
                trainees.push({id: index+1, userName: `${tr.trainee.name} ${tr.trainee.surname}`, average: tr.average, grades: tr.grades})
            })
        }
        setTableRows(trainees);
        setIsTableLoading(false);
    };

    const classesList = classes1.length >0 ? classes1.map((item,index)=><MenuItem key={item._id} value={item._id}>{item.name}</MenuItem>): [];
    const periodsList = periods.length >0 ? periods.map((item,index)=><MenuItem key={item._id} value={item._id}>{item.name}</MenuItem>): [];
    const trainingModulesList = subjects.map((item, index)=><MenuItem key={item.originalTrainingModule} value={item.originalTrainingModule}>{item.newName}</MenuItem>);
    // const gradingScaleList = gradingScale.grades.map((item, index)=><MenuItem key={index} value={item.label}>{item.label}</MenuItem>);


    return(
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
                                    onChange={(e) => {
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
                                    onChange={(e) => {
                                        setModel(p=>({...p,assignedPeriod:e.target.value, assignedSubject: "",}));
                                        getTrainingModule(model.assignedClass, e.target.value);
                                    }}
                                >
                                    {periodsList}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            {/**Select TrainingModule = Select Subject**/}
                            {/*<FormControl style={{width:isWidthUp('sm',currentScreenSize) ? "25%" : "80%"}}  className={isWidthUp('sm',currentScreenSize) ? "ml-5 mr-5" : "mt-3"} variant="filled">*/}
                                <FormControl fullWidth={true} style={{maxWidth:'400px', minWidth:'150px'}} margin="dense" variant="filled">
                                <InputLabel id="demo-simple-select-label">{t("Select subject")}</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    disabled={model.assignedClass === ""||model.assignedPeriod === ""}
                                    value={model.assignedSubject}
                                    //input={<Input/>}
                                    onChange={(e,x) => {
                                        setModel(p=>({...p, assignedSubject: e.target.value,}));
                                        getExamList2(model.assignedClass,model.assignedPeriod, e.target.value);
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
                        <div className="d-flex pt-2 px-2 justify-content-between">
                            <Typography variant="h5" component="h2" className="text-left" style={{color: `rgba(82, 57, 112, 1)`}}>
                                {t("Grade book")}
                            </Typography>
                        </div>
                        <hr className="mt-2" style={{backgroundColor:"#fff"}}/>
                        <GradbookTableGrades tableRows={tableRows} tableColumns={tableColumns} isTableLoading={isTableLoading}/>
                    </Paper>
                </Grid>
            </Grid>
    )
}