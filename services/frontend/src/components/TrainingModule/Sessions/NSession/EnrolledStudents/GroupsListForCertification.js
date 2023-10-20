import React from "react";
import { ThemeProvider, Typography, Grid, List, ListItem, ListItemText, Paper, Box } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Avatar from "@material-ui/core/Avatar";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import Collapse from "@material-ui/core/Collapse";
import { isWidthUp } from "@material-ui/core/withWidth";
import IconButton from "@material-ui/core/IconButton";
import { useMainContext } from "../../../../_ContextProviders/MainDataContextProvider/MainDataProvider";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { useTranslation } from "react-i18next";
import { useSessionContext } from "../../../../_ContextProviders/SessionProvider/SessionProvider";
import AssignTraineesDrawer from "./AssignTraineesDrawer";
import AddIcon from '@mui/icons-material/Add';
import Tooltip from '@material-ui/core/Tooltip';
import InternshipService from "../../../../../services/internship.service";
import {HiPencil} from "react-icons/hi";
import StyledEIconButton from "new_styled_components/IconButton.js/IconButton.styled";
import { new_theme } from "NewMuiTheme";
import "../Certificate/Certificate.scss";

export default function GroupsList(props) {
    const {
        item,
        index,
        formCertificate,
        setStudentFormHelper,
        fromSessionInternship = false,
        assignTraineeSecondHelper = {},
        setAssignTraineeSecondHelper = () => { },
        setIsOpenDrawer = () => { },
        isOpenDrawer = {},
    } = props;
    const { t } = useTranslation();
    const { currentScreenSize, F_showToastMessage } = useMainContext();
    const { F_getHelper } = useMainContext();
    const { userPermissions } = F_getHelper();
    const {
        currentSession,
        sessionDispatch,
        sessionReducerActionsType
    } = useSessionContext();

    const addCredit = (traineeId) => {
        if (currentSession._id && traineeId) {
            InternshipService.addCredit(currentSession._id, traineeId).then(res => {
                if (res.status === 200) {
                    //=> update
                    sessionDispatch({
                        type: sessionReducerActionsType.UPDATE_INTERNSHIP_TRAINEE_STATUS,
                        payload: { type: 'UPDATE', traineeId, groupId: item._id, groupIndex: index }
                    });
                    F_showToastMessage('Data was added', 'success');
                }
            }).catch(err => console.log(err))
        }
    };

    const studentsList = item?.trainees?.length > 0 ? item?.trainees.map((st, ind) => (
        <ListItem key={ind} className="student_list_item">
            <Paper elevation={10} sx={{ boxShadow: 'none', display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                {/* <ListItemIcon className="pl-4" edge="end">
                    <Avatar style={{ width: "25px", height: "25px", }}>
                        <Typography variant="body2" component="span" className="text-center">
                            <small>{`${index + 1}.${ind + 1}`}</small>
                        </Typography>
                    </Avatar>
                </ListItemIcon> */}
                <ListItemText primary={`${st?.name || "-"} ${st?.surname || "-"}`} />
                <ListItemText primary={<small>{`${st?.companyName || "-"}`}</small>} />
                <ListItemText primary={<small>{`${st?.gender || "-"}`}</small>} />
                {/* FOR THE MOMENT HIDING EYE ICON IN ENROLLED STUDENTS tab */}
                {/* <IconButton edge="end" aria-label="add event" className="mr-2" onClick={()=>{
                    if(formCertificate){
                        setStudentFormHelper({isOpen: true, type:'PREVIEW', groupIndex: index, studentId: st?._id})
                    }
                }}>
                    <VisibilityIcon />
                </IconButton> */}
                {fromSessionInternship && (
                    <>
                        {(st.certificates.find(x => x.certificationSession === currentSession._id)?.internshipStatus === false) ? (
                            <>
                                {(userPermissions.isCoordinator) ? (
                                    <>
                                        <Tooltip title={t("Add credit")}>
                                            <IconButton edge="end" aria-label="add event" className="mr-2" onClick={() => {
                                                addCredit(st._id);
                                            }}>
                                                <AddIcon style={{ fill: new_theme.palette.secondary.DarkPurple }} />
                                            </IconButton>
                                        </Tooltip>
                                        <span className='text-danger p-2'> ({t("Uncompleted internship")}) </span>
                                    </>
                                ) : (
                                    <span className='text-danger p-2'> ({t("Uncompleted internship")}) </span>
                                )}
                            </>
                        ) : (
                            <span className='text-success p-2'> ({t("Completed internship")}) </span>
                        )}
                    </>
                )}

                {formCertificate && (
                    <StyledEIconButton size="medium" color="primary" onClick={() => setStudentFormHelper({ isOpen: true, type: 'EDIT', groupIndex: index, studentId: st?._id })}>
                        <HiPencil />
                </StyledEIconButton>
                    // <EditIcon className="tbl_edit_icon" onClick={() => setStudentFormHelper({ isOpen: true, type: 'EDIT', groupIndex: index, studentId: st?._id })} />
                )}
            </Paper>
        </ListItem>
    )) : (
        <ListItem button className={`my-3 py-0 pr-0 ${isWidthUp('sm', currentScreenSize) ? "pl-5" : "pl-0"}`}>
            <Paper elevation={10} className="d-flex align-items-center flex-fill">
                <span>{t("List is empty, assign trainees to this group")}</span>
            </Paper>
        </ListItem>
    );

    return (
        <ThemeProvider theme={new_theme}>
            <Box>
                <Typography variant="h3" component="h3" sx={{ color: new_theme.palette.newSupplementary.NSupText, textAlign: 'left' }}>{t("Session Group")}</Typography>
                <hr style={{ marginTop: '8px' }} />

                {/* <ListItem button onClick={() => {
                    setAssignTraineeSecondHelper(p => (
                        {
                            isOpen: p.currentGroupId === item._id ? !p.isOpen : true,
                            currentGroupId: p.currentGroupId === item._id ? undefined : item._id,
                            groupName: p.currentGroupId === item._id ? undefined : item.name,
                            currentGroupIndex: p.currentGroupId === item._id ? undefined : index
                        }))
                }}
                    className={!(assignTraineeSecondHelper.isOpen && assignTraineeSecondHelper.currentGroupId === item._id) && "mb-3"}
                    style={{
                        borderRadius: '8px'
                    }}>
                    <ListItemText primary={item?.name || "-"} />
                    {(assignTraineeSecondHelper.isOpen && assignTraineeSecondHelper.currentGroupId === item._id) ? <ExpandLess /> : <ExpandMore />}
                </ListItem> */}

                {/* <Collapse in={(assignTraineeSecondHelper.isOpen && assignTraineeSecondHelper.currentGroupId === item._id)} timeout="auto" unmountOnExit> */}
                <ul></ul>
                <List component="div" sx={{ padding: 0 }}>
                    {studentsList}
                </List>
            </Box>
            {/* </Collapse> */}
            <AssignTraineesDrawer isOpenDrawer={isOpenDrawer} setIsOpenDrawer={setIsOpenDrawer} />
        </ThemeProvider>
    )
}