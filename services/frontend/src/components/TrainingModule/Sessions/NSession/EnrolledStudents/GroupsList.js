import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Avatar from "@material-ui/core/Avatar";
import ListItemText from "@material-ui/core/ListItemText";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import Collapse from "@material-ui/core/Collapse";
import List from "@material-ui/core/List";
import {isWidthUp} from "@material-ui/core/withWidth";
import IconButton from "@material-ui/core/IconButton";
import {useMainContext} from "../../../../_ContextProviders/MainDataContextProvider/MainDataProvider";
import {Paper} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import EditIcon from '@material-ui/icons/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import {useTranslation} from "react-i18next";
import {useSessionContext} from "../../../../_ContextProviders/SessionProvider/SessionProvider";
import AssignTraineesDrawer from "./AssignTraineesDrawer";
import AddIcon from '@mui/icons-material/Add';
import Tooltip from '@material-ui/core/Tooltip';
import {HiPencil} from "react-icons/hi";
import InternshipService from "../../../../../services/internship.service";
import StyledEIconButton from "new_styled_components/IconButton.js/IconButton.styled";

export default function GroupsList(props){
    const{
        item,
        index,
        formCertificate,
        setStudentFormHelper,
        fromSessionInternship = false,
        assignTraineeSecondHelper={},
        setAssignTraineeSecondHelper=()=>{},
        setIsOpenDrawer=()=>{},
        isOpenDrawer={},
    }=props;
    const { t } = useTranslation();
    const {currentScreenSize, F_showToastMessage} = useMainContext();
    const {F_getHelper} = useMainContext();
    const {userPermissions} = F_getHelper();
    const {
        currentSession,
        sessionDispatch,
        sessionReducerActionsType
    } = useSessionContext();

    const addCredit=(traineeId)=>{
        if(currentSession._id && traineeId){
            InternshipService.addCredit(currentSession._id,traineeId).then(res=>{
                if(res.status === 200){
                    //=> update
                    sessionDispatch({type: sessionReducerActionsType.UPDATE_INTERNSHIP_TRAINEE_STATUS,
                        payload: {type: 'UPDATE', traineeId, groupId: item._id, groupIndex: index}});
                    F_showToastMessage('Data was added','success');
                }
            }).catch(err=>console.log(err))
        }
    };

    const studentsList = item?.trainees?.length>0 ? item?.trainees.map((st, ind)=>(
        <ListItem button key={ind} className={`my-3 py-0 pr-0 ${isWidthUp('sm',currentScreenSize) ? "pl-5" : "pl-0"}`}>
            <Paper elevation={10} className="d-flex align-items-center flex-fill">
                <ListItemIcon className="pl-4" edge="end">
                    <Avatar style={{width: "25px", height: "25px", backgroundColor: "rgba(82, 57, 112, 1)"}}>
                        <Typography variant="body2" component="span" className="text-center">
                            <small>{`${index+1}.${ind+1}`}</small>
                        </Typography>
                    </Avatar>
                </ListItemIcon>
                <ListItemText primary={`${st?.name || "-"} ${st?.surname || "-"}`} />
                <ListItemText primary={<small>{`${st?.companyName || "-"}`}</small>} />
                <ListItemText primary={<small>{`${st?.gender || "-"}`}</small>} />
                {/* FOR THE MOMENT HIDING EYE ICON IN ENROLLED STUDENTS tab */}
                {/* <IconButton edge="end" aria-label="add event" className="mr-2" onClick={()=>{
                    if(formCertificate){
                        setStudentFormHelper({isOpen: true, type:'PREVIEW', groupIndex: index, studentId: st?._id})
                    }
                }}>
                    <VisibilityIcon style={{fill: "rgba(82, 57, 112, 1)"}} />
                </IconButton> */}
                {fromSessionInternship && (
                    <>
                        {(st.certificates.find(x=>x.certificationSession === currentSession._id)?.internshipStatus === false) ? (
                            <>
                                {(userPermissions.isCoordinator) ? (
                                    <>
                                    <Tooltip title={t("Add credit")}>
                                        <IconButton edge="end" aria-label="add event" className="mr-2" onClick={()=>{
                                            addCredit(st._id);
                                        }}>
                                            <AddIcon style={{fill: "rgba(82, 57, 112, 1)"}} />
                                        </IconButton>
                                    </Tooltip>
                                     <span  className='text-danger p-2'> ({t("Uncompleted internship")}) </span>
                                    </>
                                ) : (
                                    <span  className='text-danger p-2'> ({t("Uncompleted internship")}) </span>
                                )}
                            </>
                        ):(
                            <span  className='text-success p-2'> ({t("Completed internship")}) </span>
                        )}
                    </>
                )}

                { userPermissions.isTrainingManager && (
                    <IconButton edge="end" aria-label="add event" className="mr-2"
                                onClick={()=>{
                                    sessionDispatch({type: sessionReducerActionsType.TRAINEES_IN_GROUP_ACTION,
                                        payload: {type: 'REMOVE', traineeId: st?._id, groupId: item._id, groupIndex: index}});
                                }}>
                        <DeleteForeverIcon style={{fill: "rgba(82, 57, 112, 1)"}}/>
                    </IconButton>
                )}
                {formCertificate && (+
                    <StyledEIconButton size="medium" color="primary" onClick={()=>setStudentFormHelper({isOpen: true, type:'EDIT',groupIndex: index, studentId: st?._id})}>
                         <HiPencil />
                    </StyledEIconButton>
                    // <IconButton edge="end" aria-label="add event" className="mr-2" onClick={()=>setStudentFormHelper({isOpen: true, type:'EDIT',groupIndex: index, studentId: st?._id})}>
                    //     <EditIcon className="tbl_edit_icon" />
                    // </IconButton>
                )}
            </Paper>
        </ListItem>
    )) : (
        <ListItem button className={`my-3 py-0 pr-0 ${isWidthUp('sm',currentScreenSize) ? "pl-5" : "pl-0"}`}>
            <Paper elevation={10} className="d-flex align-items-center flex-fill">
                <span>{t("List is empty, assign trainees to this group")}</span>
            </Paper>
        </ListItem>
    );

    return(
        <>
            {/* <ListItem button onClick={()=>{
                setAssignTraineeSecondHelper(p=>(
                    {isOpen: p.currentGroupId === item._id ? !p.isOpen : true,
                    currentGroupId: p.currentGroupId === item._id ? undefined : item._id,
                    groupName: p.currentGroupId === item._id ? undefined : item.name,
                    currentGroupIndex: p.currentGroupId === item._id ? undefined : index}))
            }}
                      className={!(assignTraineeSecondHelper.isOpen && assignTraineeSecondHelper.currentGroupId === item._id) && "mb-3"}
                      style={{backgroundColor:'rgba(255,255,255,0.45)',
                          borderRadius: '8px'
                      }}>
                <ListItemIcon>
                    <Avatar style={{width: "25px", height: "25px", backgroundColor: "rgba(82, 57, 112, 1)"}}>{index+1}</Avatar>
                </ListItemIcon>
                <ListItemText primary={item?.name || "-"}/>
                {(assignTraineeSecondHelper.isOpen && assignTraineeSecondHelper.currentGroupId === item._id) ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={(assignTraineeSecondHelper.isOpen && assignTraineeSecondHelper.currentGroupId === item._id)} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    {studentsList}
                </List>
            </Collapse> */}
            <AssignTraineesDrawer isOpenDrawer={isOpenDrawer} setIsOpenDrawer={setIsOpenDrawer}/>
        </>
    )
}