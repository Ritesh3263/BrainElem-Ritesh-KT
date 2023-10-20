import React, {lazy, useEffect, useState} from 'react';
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import {EButton} from "styled_components";
import OptionsButton from "components/common/OptionsButton";
import {useTranslation} from "react-i18next";
import GradbookTableGrades from "components/Gradebooks/Trainer/GradebookTableGrades";
// import TraineeGradebook from "components/Gradebooks/Trainee/TraineeGradebook2";
import {renderCellExpand} from "components/common/Table/renderCellExpand";
import {makeStyles} from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import TextField from "@material-ui/core/TextField";
import {useDispatch, useSelector} from "react-redux";
import {myCourseActions} from "app/features/MyCourses/data";
import '../../../../Gradebooks/GradeBook2.css'
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";


const ManageEventModal = lazy(() => import("./ManageEventModal"));

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
}));

const Gradebook=(props)=> {
    const{
        currentTab,
    }=props;
    const {F_getHelper} = useMainContext();
    const {user, userPermissions} = F_getHelper();
    const {t} = useTranslation();
    const classes = useStyles();
    const {item, itemDetails, formHelper} = useSelector(s=>s.myCourses);
    const dispatch = useDispatch();
    const [tableRows, setTableRows] = useState([]);
    const [isTableLoading,setIsTableLoading] = useState(false);
    const [exams, setExams] = useState([]);
    const [eventModalHelper, setEventModalHelper] = useState({isOpen: false, type: 'ADD'});
    const initialColumns = [
        { field: 'id', headerClassName: classes.verticalText, maxWidth:40, minWidth:40, headerName: ' ', hide: false, sortable: false, disableColumnMenu: true, flex: 1},
        { field: 'userName', minWidth: 200, headerClassName: classes.verticalText, headerName: t('Name | Surname'), renderCell:renderCellExpand },
        { field: 'average',  headerClassName: classes.verticalText2, minWidth: 130, headerAlign: 'start', headerName: t('Average')},
    ]
    const [tableColumns, setTableColumns]= useState(initialColumns);


    const buttons = [
        {id: 1, name: t("Add column"), action: ()=>{setEventModalHelper({isOpen: true, type: 'ADD'})}},
        {id: 2, name: t("Manage columns"), action: ()=>{setEventModalHelper({isOpen: true, type: 'MANAGE', action:'EDIT'})},},
        {id: 3, name: t("Remove columns"), action: ()=>{setEventModalHelper({isOpen: true, type: 'MANAGE', action:'DELETE'})},}
    ]

    useEffect(()=>{
        if(currentTab === 3)
        dispatch(myCourseActions.fetchItemDetails({type: 'GRADEBOOK', itemId: {subjectSessionId: formHelper.itemId, courseId: item._id}}));
    },[currentTab]);

    useEffect(()=>{
        if(itemDetails?.trainees && itemDetails?.exams){
            setTableValue(itemDetails);
        }
    },[itemDetails]);


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
                                <TextField color={!item.assignedContent&&grade[0].new?"secondary":false} focused={!item.assignedContent&&grade[0].new?true:false}
                                           type={ "string"}
                                           InputLabelProps={{
                                               shrink: true,
                                           }}
                                           InputProps={{
                                               disableUnderline: !!item.assignedContent,
                                               readOnly: !!item.assignedContent,
                                               step: "0.1",
                                           }}
                                           value={!item.assignedContent ? ( ((grade[0].grade !== "-") && (grade[0].grade !== "undefined")) ? grade[0].grade : "") : grade[0].grade}
                                           placeholder={"-"}
                                           onChange={(e) =>{
                                               setTableRows(p=>{
                                                   let val = Object.assign([],p);
                                                   let gradeIndex = params.row.grades.findIndex(item=> item._id === grade[0]._id);
                                                   val[params.id-1].grades[gradeIndex].grade = e.target.value>20?20:e.target.value<0?0:e.target.value;
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
        }
        setExams(exams);
        setTableColumns([...initialColumns, ...exams]);
        let trainees = [];
        if(data?.trainees?.length){
            let selectedTrainees = data.trainees
            if(userPermissions.isTrainee) selectedTrainees = selectedTrainees.filter(x=>(x.trainee._id[0] === user.id))
            selectedTrainees.map((tr, index)=>{
                trainees.push({id: index+1, userName: `${tr.trainee.name} ${tr.trainee.surname}`, average: tr.average, grades: tr.grades})
            })
        }
        setTableRows(trainees);
        setIsTableLoading(false);
    }

     return (
         <Grid container >
             <Grid item xs={12}>
                 <Paper elevation={10} style={{borderRadius:'0px 0px 6px 6px'}} className='p-3 ourGradebook'>
                     <Grid container spacing={2}>
                         <Grid item xs={10}>
                             <Typography variant="h6" component="h2" className="text-left font-weight-bold" style={{color: `rgba(82, 57, 112, 1)`}}>
                                 {t("Gradebook")}
                             </Typography>
                         </Grid>
                         {formHelper.openType !== 'PREVIEW' && (
                             <Grid item xs={2} className='d-flex justify-content-center align-items-end'>
                                 <EButton eSize="small" eVariant="primary"
                                          className='mr-4'
                                          onClick={()=>{

                                          }}
                                 >{t("Save")}</EButton>
                                 <OptionsButton btns={buttons} btnName={t('Options')} eSize="small"/>
                             </Grid>
                         )}
                         <Grid item xs={12} className='pl-3 pb-5'>
                                 <GradbookTableGrades tableRows={tableRows} tableColumns={tableColumns} isTableLoading={isTableLoading}/>
                         </Grid>
                     </Grid>
                 </Paper>
             </Grid>
             <ManageEventModal
                 eventModalHelper={eventModalHelper}
                 setEventModalHelper={setEventModalHelper}
                 exams={exams}
             />
         </Grid>
     )
 }

export default Gradebook;