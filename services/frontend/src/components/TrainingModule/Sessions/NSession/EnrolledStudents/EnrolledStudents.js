import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useTranslation } from "react-i18next";
import LocationCityIcon from '@material-ui/icons/LocationCity';
import List from "@material-ui/core/List";
import { useSessionContext } from "components/_ContextProviders/SessionProvider/SessionProvider";
import GroupsList from "./GroupsList";
import { Box, IconButton, InputAdornment, TextField, Tooltip } from "@mui/material";
import Chip from "@material-ui/core/Chip";
import InfoIcon from "@material-ui/icons/Info";
import { useMainContext } from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import { ECard, EIconButton } from "styled_components";
import { EButton } from "styled_components";
import StyledButton from "new_styled_components/Button/Button.styled";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { ThemeProvider, Divider } from '@mui/material';
import { NewEDataGrid } from 'new_styled_components';
import { new_theme } from 'NewMuiTheme';
import "../SessionForm.scss";
import { useNavigate } from "react-router-dom";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import StyledEIconButton from "new_styled_components/IconButton.js/IconButton.styled";

// import { theme } from "MuiTheme";
// const palette = theme.palette


export default function EnrolledStudents(props) {
    const { showEnrolledStudents } = props;
    const navigate = useNavigate();;
    const { t } = useTranslation();
    const { F_getHelper } = useMainContext();
    const { userPermissions, user } = F_getHelper();
    const [groupName, setGroupName] = useState('');
    const [rows, setRows] = useState([]);
    const {
        currentSession,
        sessionDispatch,
        sessionReducerActionsType
    } = useSessionContext();

    const [assignTraineeSecondHelper, setAssignTraineeSecondHelper] = useState({ isOpen: true, currentGroupId: 0, currentGroupIndex: 0, groupName: currentSession.groups[0]?.name });
    const [isOpenDrawer, setIsOpenDrawer] = useState({ isOpen: false, groupId: undefined, groupIndex: 0, groupName: currentSession.groups[0].name });

    const addGroup = () => {
        // console.log('addGroup',groupName);
        sessionDispatch({ type: sessionReducerActionsType.ADD_GROUP, payload: groupName })
        setGroupName('');
    };

    useEffect(() => {
        const customRows = showEnrolledStudents
          ? currentSession?.groups[0]?.trainees
          : currentSession.groups[0].selected &&
            currentSession?.groups[0]?.trainees?.filter((tr) => tr.checked === true);
      
        setRows(customRows);
      }, [showEnrolledStudents, currentSession?.groups[0]?.trainees, currentSession.groups[0].selected]);
      


    const groupsList = currentSession?.groups?.length > 0 ? currentSession.groups.map((item, index) => (<GroupsList item={item} index={index} assignTraineeSecondHelper={assignTraineeSecondHelper}
        setAssignTraineeSecondHelper={setAssignTraineeSecondHelper}
        isOpenDrawer={isOpenDrawer}
        setIsOpenDrawer={setIsOpenDrawer}
    />))
        : <Typography>{t('No groups!')}</Typography>;

    const columns = [
        // { field: 'id', headerName: 'ID', minWidth: 50, maxWidth: 50, hide: false, sortable: false, disableColumnMenu: true},
        { field: '_id', headerName: t('ID'), minWidth: 160, flex: 1 },
        {
            field: 'name', headerName: t('Name'), minWidth: 120, type: 'date', flex: 1,
            renderCell: (params) => `${params.row.name} ${params.row.surname}`
        },
        {
            field: 'addedon', headerName: t('Added On'), minWidth: 120, type: 'date', flex: 1,
            renderCell: (params) => "-"
        },
        {
            field: 'lasttimeactive', headerName: t('Last Time Active'), minWidth: 180, type: 'date', flex: 1,
            renderCell: (params) => "-"
        },
        { field: 'cuurentlyat', headerName: t('Currently At'), minWidth: 150, flex: 1 },

        {
            field: 'action',
            headerName: t('Actions'),
            minWidth: 50,
            sortable: false,
            disableColumnMenu: true,
            headerAlign: 'center',
            cellClassName: 'super-app-theme--cell',
            align: 'center',
            
            renderCell: (params) => (
                <StyledEIconButton size="medium" color="primary" onClick={() => {navigate(`/FullTrainee/${params?.row?._id}/${currentSession?._id}`)}}>
                    <KeyboardArrowRightIcon />
                </StyledEIconButton>
            )
        },
    ];

    return (
        <ThemeProvider theme={new_theme}>
            <Grid container xs={12}>
                <Grid container>
                    <Grid item xs={12}>
                        <div className='enrolled_form_header'>
                            <Typography variant="h3" component="h3" sx={{ color: new_theme.palette.newSupplementary.NSupText, textAlign: 'left' }}>
                                {t("Training group")}
                            </Typography>
                            {!currentSession._id && <StyledButton eVariant="primary" eSize="small"
                                disabled={!assignTraineeSecondHelper.isOpen}
                                onClick={() => {
                                    if (assignTraineeSecondHelper.isOpen) {
                                        setIsOpenDrawer({
                                            isOpen: true,
                                            groupId: assignTraineeSecondHelper.currentGroupId,
                                            groupName: assignTraineeSecondHelper.groupName,
                                            groupIndex: assignTraineeSecondHelper.currentGroupIndex
                                        })
                                    }
                                }}
                            >
                                {t("Add Users")}
                            </StyledButton>}
                        </div>
                        {/* <Typography variant="h3" component="h3" style={{ fontSize: "28px" }} className="text-left" >
                            {t("EnrolledStudents")}
                            <Tooltip title={t("To move students to another group, remove them from the current group list, then open the target group, and assign. For assign students, first expand group.")}>
                                <Chip color="" size="small" className="ml-1"
                                    icon={<InfoIcon style={{ fill: "white" }} />}
                                />
                            </Tooltip>
                        </Typography> */}
                    </Grid>
                    <Grid item xs={12}>
                        <div style={{ width: 'auto', height: 'auto' }}>
                            <NewEDataGrid style={{ cursor: "pointer" }}
                                rows={rows}
                                columns={columns}
                                isVisibleToolbar={true}
                                setRows={setRows}
                                getRowId={(row) => row._id}
                            />
                        </div>
                    </Grid>
                    {/* <Grid xs={12} >
                        <ECard sx={{ display: "block", mt: 2 }}>
                            <Grid xs={12} >
                                <Typography variant="h3" component="span" style={{ fontSize: "32px" }} className="d-flex justify-content-center my-2">
                                    {t("User base summary")}
                                    <LocationCityIcon className="ml-1 mt-3 mr-2" />
                                </Typography>
                            </Grid>
                            <Grid xs={12} className="d-flex justify-content-center mt-4">
                                <Typography variant="body1" component="span" className="text-left" >
                                    {`${t("Trainees total")} : ${currentSession?.totalStudents || '-'}`}
                                </Typography>
                            </Grid>
                            <Grid xs={12} className="d-flex justify-content-center my-2 mb-3">
                                <Typography variant="body1" component="span" className="text-left">
                                    {`${t("Numbers of groups")} : ${currentSession?.groups?.length || '-'}`}
                                </Typography>
                            </Grid>
                        </ECard>
                    </Grid> */}
                </Grid>

                <Grid container item xs={12}>
                    <Grid item xs={12} md={7} >
                        <List
                            component="nav"
                            aria-labelledby="nested-list-subheader"
                        >
                            {groupsList}
                        </List>
                    </Grid>

                </Grid>
            </Grid>
        </ThemeProvider>
    )
}