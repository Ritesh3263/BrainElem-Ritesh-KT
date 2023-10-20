import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Grid from "@material-ui/core/Grid";
import Button from '@material-ui/core/Button';
import { makeStyles} from "@material-ui/core/styles";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import softSkillsTemplateService from "services/soft_skills_template.service"
import UserService from "services/user.service"
import ReportTraineeTable from "./ReportTraineeTable";
import {useTranslation} from "react-i18next";
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import {isWidthUp} from "@material-ui/core/withWidth";

const useStyles = makeStyles(theme=>({}))


export default function Reports(){
    const { t } = useTranslation();
    const { F_showToastMessage, F_getErrorMessage, F_getHelper, currentScreenSize } = useMainContext();
    const {userPermissions} = F_getHelper();
    const classes = useStyles();
    const navigate = useNavigate();
    const [groups, setGroups] = useState([]);
    const [trainees, setTrainees] = useState([]);
    const [children, setChildren] = useState(null);
    const [currentTraineeReport, setCurrentTraineeReport] = useState([]);
    const [model, setModel] =useState({
        // selectedGroup: JSON.parse(window.sessionStorage.getItem("selectedGroupForReport")),
        // selectedTrainee: JSON.parse(window.sessionStorage.getItem("selectedTraineeForReport")),
        selectedGroup: "",
        selectedTrainee: "",
    });

    // setCurrentRoute
    const {setMyCurrentRoute} = useMainContext();

    useEffect(()=>{
        // window.sessionStorage.clear()
        softSkillsTemplateService.readGroups().then(res=>{
            if(res.status === 200) {
                if(res.data.class){
                    setGroups(res.data.class)
                    setChildren(res.data.children)
                    if(res.data.class.length>0){
                        setModel(p=>({...p,selectedGroup: res.data.class[0]._id}))
                        getTrainees(res.data.class[0]._id,res.data.children)
                    }
                } else {
                    if(res?.data?.length>0){
                            setModel(p=>({...p,selectedGroup: res.data[0]._id}))
                            getTrainees(res.data[0]._id)
                        setGroups(res?.data)
                    }
                }
            }
        }).catch(error=>console.log(error))

        // if (model.selectedGroup) getTrainees(model.selectedGroup)
        //if (model.selectedTrainee) readTraineeReports(model.selectedTrainee)
        setMyCurrentRoute("Reports")
    },[]);

    function getTrainees(groupId, children2){
        softSkillsTemplateService.readTraineesInGroup(groupId).then(res=>{
            if(res.status === 200) {
                if(userPermissions.isParent && res.data){
                    let children3 = children2 || children;
                    let childrenList = res.data.filter(x=>children3.includes(x._id));
                    setTrainees(childrenList);
                    if(childrenList.length>0){
                        console.log(childrenList)
                        setModel(p=>({...p, selectedTrainee: childrenList[0]}))
                        readTraineeReports(childrenList[0]._id, groupId)
                    }
                } else{
                    setTrainees(res.data);

                    if(res.data?.length>0){
                        setModel(p=>({...p, selectedTrainee: res.data[0]}))
                        readTraineeReports(res.data[0]._id, groupId)
                    }
                }
            }
        }).catch(error=>console.log(error))
    };

    function readTraineeReports(traineeId, selectedGroup){
        let selectedGroupx = selectedGroup || model.selectedGroup;
        UserService.getReports(traineeId).then(res=>{
            if(res.status === 200){
                setCurrentTraineeReport(res.data.filter(x=>x.group === selectedGroupx));
            }
        }).catch(error=>console.log(error))
    }

    const groupsList = groups.length >0 ? groups.map((item,index)=><MenuItem key={item._id} value={item._id}>{item.name}</MenuItem>): [];
    const traineesList = trainees.length >0 ? trainees.map((item,index)=><MenuItem key={item._id} value={item._id} trObj={item}>{`${item.name} ${item.surname}`}</MenuItem>): [];

    return(
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <div className="p-2 text-center">
                        <FormControl style={{width:isWidthUp('sm',currentScreenSize) ? "25%" : "80%"}} className={isWidthUp('sm',currentScreenSize) && "mr-5"} variant="filled">
                            <InputLabel id="demo-simple-select-label">{t("Select class")}</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={model.selectedGroup}
                                //input={<Input/>}
                                onChange={(e) => {
                                    setModel(p=>({...p,selectedGroup:e.target.value, selectedTrainee: null,}));
                                    // window.sessionStorage.setItem("selectedGroupForReport", JSON.stringify(e.target.value));
                                    getTrainees(e.target.value);
                                }}
                            >
                                {groupsList}
                            </Select>
                        </FormControl>
                        <FormControl style={{width:isWidthUp('sm',currentScreenSize) ? "25%" : "80%"}}  className={isWidthUp('sm',currentScreenSize) ? "ml-5 mr-5" : "mt-3"} variant="filled">
                            <InputLabel id="demo-simple-select-label">{`${userPermissions.isParent ? t("Select children") : t("Select student")}`}</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                disabled={!!!model.selectedGroup}
                                value={model.selectedTrainee}
                                renderValue={p=>(p.name+" "+p.surname)}
                                //input={<Input/>}
                                onChange={(e,{props}) => {
                                    setModel(p=>({...p,selectedTrainee: props.trObj,}));
                                    // window.sessionStorage.setItem("selectedTraineeForReport", JSON.stringify( e.target.value));
                                    readTraineeReports(e.target.value);
                                }}
                            >
                                {traineesList}
                            </Select>
                        </FormControl>
                    </div>
                    <div className=" text-center mt-3">
                        <div className="d-flex pt-2 px-2 justify-content-between">
                            {!userPermissions.isParent && !userPermissions.isInspector && (
                                    <Button classes={{root: classes.root}} size="small" variant="contained" color="primary"
                                            disabled={!!!model.selectedTrainee}
                                            startIcon={<AddCircleOutlineIcon/>}
                                            onClick={()=>{
                                                navigate(`/report-form/${model.selectedGroup}/${model?.selectedTrainee?._id}/new`);
                                            }}
                                    >{t("Add new student report")}</Button>
                            )}
                        </div>
                                <ReportTraineeTable traineeReports={currentTraineeReport}
                                                    traineeDetails={model.selectedTrainee}
                                                    groupId={model.selectedGroup}
                                />
                    </div>
                </Grid>
            </Grid>
    )
}