import React, {useEffect, useState} from "react";
import EventService from "services/event.service";
import {makeStyles} from "@material-ui/core/styles";
import {useTranslation} from "react-i18next";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import Typography from "@material-ui/core/Typography";
import MenuItem from "@material-ui/core/MenuItem";
import SubjectAverageTable from "./SubjectAverageTable";
import {renderCellExpand} from "components/common/Table/renderCellExpand"
import Tooltip from "@material-ui/core/Tooltip";
import GroupService from "services/group.service"
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
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
    }
}))

export default function GradebookSubjectsAverage({setIsBlocking}){
    const { t } = useTranslation();

    const classes = useStyles();
    const [classes1, setClasses1] = useState([]);
    const [periods, setPeriods] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [model, setModel]= useState({assignedClass: "",assignedPeriod:""});
    const [tableRows, setTableRows] = useState([]);
    const [isTableLoading,setIsTableLoading] = useState(false);
    const [children,setChildren] = useState([]);
    const initialColumns = [
        { field: 'id', headerClassName: classes.verticalText, headerName: ' ', width: 50, hide: false, sortable: false, disableColumnMenu: true, flex: 1},
        { field: 'userName', headerClassName: classes.verticalText, headerName: t('Name | Surname'), minWidth: 150, width: 200, renderCell:renderCellExpand },
    ]
    const [tableColumns, setTableColumns]= useState(initialColumns);
    // setCurrentRoute
    const {setMyCurrentRoute, F_showToastMessage, F_getHelper, currentScreenSize} = useMainContext();
    const {userPermissions, user} = F_getHelper();

    useEffect(()=>{
        setIsTableLoading(true)
        setIsBlocking(false)
        func1().then(res=>{
            func12(res).then(res1=>{
                func2(res1);
            })
        })
        setMyCurrentRoute("Subject average")
    },[])

    const func1 = async()=>{
        try{
            const {data, status} = await EventService.getMyClasses();
            let data1 = userPermissions.isParent? data.groups:data;
            if(status===200){
                setChildren(data.children||[]);
                if(data1.length>0){
                    data1[0].currentClassId = data1[0]._id;
                    data1[0].periodId = user.selectedPeriod|| data1[0].academicYear.periods.find(p=>new Date(p.startDate)<=new Date() && new Date(p.endDate)>=new Date())?._id||data1[0].academicYear.periods[0]._id;
                    setClasses1(data1);
                    setModel(p=>({...p,assignedClass:data1[0]._id,assignedPeriod:data1[0].periodId}));
                }
                return {groups:data1,children:data.children};
            }else{throw status}
        }catch(error){console.log(error)}
    }

    const func12 = async(data1,opt2)=>{
        let data = data1.groups
        let class1 = opt2?classes1.find(el=>el._id===data[0].currentClassId):data.find(el=>el._id===data[0].currentClassId);

        try{
            setPeriods(class1.academicYear.periods);
            data[0].periodId = user.selectedPeriod || class1.academicYear.periods.find(p=>new Date(p.startDate)<=new Date() && new Date(p.endDate)>=new Date())?._id||class1.academicYear.periods[0]._id;
            setModel(p=>({...p,assignedPeriod:data[0].periodId}));
            return {groups:data,children:data1.children};
        }catch(error){console.log(error)}
    }

    const func2 = async(data)=>{
        let groups = data.groups;
        if(groups.length>0){
            try{
                const response = await GroupService.getTraineesSubjectsAverages(groups[0].currentClassId,groups[0].periodId);
                if(response.status===200){
                    // console.log("getSubjectsInClass >>>",response.data);
                    if(response.data?.subjects?.length>0){
                        // let titleHeight = Math.min(300,Math.max(130,Math.max(...(response.data.subjects.map(el => el.name.length*10)))))
                        document.documentElement.style.setProperty('--gradebook-title-height',`${190}px`);
                        document.documentElement.style.setProperty('--gradebook-window-top',`${197}px`);
                        setSubjects(groups);
                        if(userPermissions.isTrainee){
                            let filteredTrainees = response.data?.trainees.filter(tr=>tr._id === user.id);
                            setTableValue({subjects: response.data.subjects, trainees: filteredTrainees})
                            return {currentClassId: groups[0]?.currentClassId, subjectsArray: response.data.subjects, trainees: filteredTrainees};
                        }else if(userPermissions.isParent){
                            let filteredTrainees = response.data?.trainees.filter(tr=>data.children.find(el=>el===tr._id));
                            setTableValue({subjects: response.data.subjects, trainees: filteredTrainees})
                            return {currentClassId: groups[0]?.currentClassId, subjectsArray: response.data.subjects, trainees: filteredTrainees};
                        } else{
                            setTableValue(response.data)
                            return {currentClassId: groups[0]?.currentClassId, subjectsArray: response.data.subjects, trainees: response.data?.trainees};
                        }

                    }
                }else{throw response}
            }catch(error){console.log(error)}
        }else{
            setIsTableLoading(false);
        }
    }

    const getPeriods = async(currentClassId)=>{
        let req = {groups:[{currentClassId}],children};
        func12(req,true).then(res2=>{
            func2(res2)
        });
        getTrainingModule(currentClassId,model?.assignedPeriod);
    }

    const getTrainingModule =(currentClassId,periodId)=>{
        setIsTableLoading(true)
        setTableColumns([
            { field: 'id', headerClassName: classes.verticalText, headerName: 'ID', width: 50, hide: false, sortable: false, disableColumnMenu: true},
            { field: 'userName', headerClassName: classes.verticalText, headerName: t('Name | Surname'), minWidth: 150, width: 200, renderCell:renderCellExpand },
        ])
        let req = {groups:[{currentClassId, periodId}],children};
        func2(req).then(res2=>{});
    };

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
        //console.log("setTableValue >>>",data);
        let subjects = [];
        if(data && data?.subjects) {
            data.subjects.map((item, index) => {
                subjects.push({
                    index: index,
                    headerClassName: classes.verticalText2,
                    field: t(`${(++index)}-${item?.name || "-"}`),
                    headerName: t(`${item?.name || "-"}`),
                    minWidth: 80,
                    flex: 1,
                    renderHeader: () => {
                        return (
                            <Tooltip title={t(`${item?.name ?? "-"}`)}>
                                            <span>
                                                {shortString(t(`${item?.name ?? "-"} `))}
                                            </span>
                            </Tooltip>)
                    },
                    renderCell: (params)=>{
                        let subject = params.row.subjectsAverages.filter(sa=>(sa.subjectId === item._id))
                        if(subject.length>0){
                            let valToReturn = subject[0] ? Number(subject[0].average).toFixed(2) : 0.0
                            return !isNaN(valToReturn) ? valToReturn : 0.0;
                        }else{
                            return "-"
                        }
                    }
                })
            })
        }
        setTableColumns([...initialColumns, ...subjects]);
        let trainees = [];
        if(data && data.trainees){
            data.trainees.map((tr, index)=>{
                trainees.push({id: index+1, userName: `${tr.name} ${tr.surname}`, subjectsAverages: tr.subjectsAverages})
            })
        }
        setTableRows(trainees);
        setIsTableLoading(false);
    }

    const classesList = classes1.length >0 ? classes1.map((item,index)=><MenuItem key={item._id} value={item._id}>{item.name}</MenuItem>): [];
    const periodsList = periods.length >0 ? periods.map((item,index)=><MenuItem key={item._id} value={item._id}>{item.name}</MenuItem>): [];

    return(
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Grid continer spacing={1} className="px-2">
                        <Grid item xs={12} md={6}>
                            {/*<FormControl style={{width: isWidthUp('sm',currentScreenSize) ? "25%" : "80%"}} className={isWidthUp('sm',currentScreenSize) && "mr-5"} variant="filled">*/}
                                <FormControl fullWidth={true} style={{maxWidth:'400px', minWidth:'150px'}} margin="dense" variant="filled">
                                <InputLabel id="demo-simple-select-label">{t("Select class")}</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={model.assignedClass}
                                    //input={<Input/>}
                                    onChange={(e) => {
                                        setModel(p=>({...p,assignedClass:e.target.value, assignedPeriod:""}));
                                        getPeriods(e.target.value);
                                    }}
                                >
                                    {classesList}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            {/*<FormControl style={{width: isWidthUp('sm',currentScreenSize) ? "20%" : "70%"}} className={isWidthUp('sm',currentScreenSize) && ""} variant="filled">*/}
                                <FormControl fullWidth={true} style={{maxWidth:'400px', minWidth:'150px'}} margin="dense" variant="filled">
                                <InputLabel id="demo-simple-select-label">{t("Select period")}</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    disabled={model.assignedClass === ""}
                                    value={model.assignedPeriod}
                                    //input={<Input/>}
                                    onChange={(e) => {
                                        setModel(p=>({...p,assignedPeriod:e.target.value}));
                                        getTrainingModule(model.assignedClass, e.target.value);
                                    }}
                                >
                                    {periodsList}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item xs={12}>
                    <Paper elevation={10} className="p-0 ourGradebook">
                        <div className="d-flex pt-2 px-2 justify-content-between">
                            <Typography variant="h5" component="h2" className="text-left" style={{color: `rgba(82, 57, 112, 1)`}}>
                                {t("Gradebook: Subjects Averages")}
                            </Typography>
                        </div>
                        <hr className="mt-2" style={{backgroundColor:"#fff" }}/>
                        <SubjectAverageTable tableRows={tableRows} tableColumns={tableColumns} isTableLoading={isTableLoading}/>
                    </Paper>
                </Grid>
            </Grid>
    )
}