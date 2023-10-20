import React, { useEffect, useState } from 'react';
import { NewEDataGrid } from 'new_styled_components';
import { useTranslation } from "react-i18next";
import { useMainContext } from 'components/_ContextProviders/MainDataContextProvider/MainDataProvider';
import "./BCTestRegistration.scss"

//Components
import WarningCredits from "components/Credits/WarningCredits";
import BrainCoreTestInvitationCalendar from "components/common/BrainCoreTestInvitationCalendar"
import StyledButton from 'new_styled_components/Button/Button.styled';
import MoreIcon from "components/Evvo/ModulesCoreUser/MoreIcon";

// MUI v5
import { Grid, ThemeProvider, Box} from '@mui/material';

// Services
import ContentService from "services/content.service";
import BCTestService from '../../../services/bcTestRegistration.service';

//Icons
import { BsFillCircleFill } from 'react-icons/bs';

//Others
import dayjs from 'dayjs';
import STATUSES from '../../../enums/statusEnum';
import { useToasts } from 'react-toast-notifications';
import { new_theme } from 'NewMuiTheme';

export default function UserTable(props) {
    const { addToast } = useToasts();
    const [calendarOpen, setCalendarOpen] = React.useState(false);
    const [calendarUserId, setCalendarUserId] = React.useState();

    const [users, setUsers] = useState([])


    const { F_handleSetShowLoader, F_formatSeconds, F_getHelper, F_t } = useMainContext();
    const {user} = F_getHelper()
    const { t } = useTranslation(['translation', 'common', 'sentinel-MyUsers-BCTestRegistration']);
    // const classes = useStyles();
    const [rows, setRows] = useState([]);

    useEffect(() => {

        fetchUserData();

    }, []);

    function fetchUserData() {
        F_handleSetShowLoader(true);
        BCTestService.getBCTestUsersByModuleId().then((res) => {
            let rowsData = res?.data?.data.map((row) => {

                var activeTime = '-'
                if (row?.latestBrainCoreTestResult){
                    let spent = row?.latestBrainCoreTestResult?.timeSpent
                    let inactive = row?.latestBrainCoreTestResult?.inactiveTime
                    let away = row?.latestBrainCoreTestResult?.awayTime

                    let calculatedActiveTime = spent-inactive-away
                    if (calculatedActiveTime > 60) activeTime = F_formatSeconds(calculatedActiveTime, false)
                }

                return {
                    '_id': row._id,
                    'username': row.name + " " + row.surname,
                    'email': row.email,
                    'registerDate': row?.brainCoreTest?.registerDate,
                    'completionDate': row?.brainCoreTest?.completionDate,
                    'teamNames': row?.teams?.length>0 ?  row?.teams.map(team=>team.name).join(', ') : '-',
                    'status': row?.brainCoreTest?.status,
                    'hasAccessToPlatform': row?.settings?.isActive??false,
                    'activeTime': activeTime,
                    'latestBrainCoreTestResult': row?.latestBrainCoreTestResult

                }
            })
            setRows(rowsData);
            setUsers(rowsData)
            F_handleSetShowLoader(false);
            addToast(t('sentinel-MyUsers-BCTestRegistration:USERS_FETCHED'), { appearance: 'success', autoDismiss: true });
        }).catch((err) => {
            addToast(err.message, { appearance: 'error', autoDismiss: true });
            F_handleSetShowLoader(false);
        });
    }

    const columns = [
        // { field: '_id', headerName: 'ID', cellClassName:'tableRowContent', width: 80, hide: false, sortable: false, disableColumnMenu: true , className:'txtHead' },
        {
            field: 'username', cellClassName: 'tableRowContent', headerName: t('common:FULL NAME'), minWidth: 200, flex: 1, sortable: true, disableColumnMenu: true,
            renderCell: (params) => (
                <>
                    {params.row.username}
                </>
            )
        },
        {
            field: 'email', cellClassName: 'tableRowContent', headerName: t('common:E-MAIL'), minWidth: 200, flex: 1, sortable: true, disableColumnMenu: true,
            renderCell: (params) => (
                <>
                    {params.row.email}
                </>
            )
        },
        {
            field: 'registerDate', cellClassName: 'tableRowContent', headerName: t('common:DUE DATE'), minWidth: 180, flex: 1,
            renderCell: (params) => (

                <>
                    {params.row?.registerDate && params.row?.status !== STATUSES.NOT_COMPLETED ? dayjs(params.row?.registerDate).format('DD/MM/YYYY HH:mm') : 
                    <StyledButton eVariant="primary" eSize="xsmall" className="btnSaveSmall" {...params}
                                  onClick={()=>{setCalendarUserId(params.row._id); setCalendarOpen(true)}}
                    >
                        {params.row?.status == STATUSES.NOT_COMPLETED ? t("sentinel-MyUsers-BCTestRegistration:SEND AGAIN") : t("sentinel-MyUsers-BCTestRegistration:SEND REQUEST")}
                    </StyledButton>
                    }
                </>
            )
        },
        {
            field: 'completionDate', cellClassName: 'tableRowContent', headerName: t('common:COMPLETION DATE'), minWidth: 200, flex: 1,
            renderCell: (params) => (
                <>
                    {params.row?.completionDate ? dayjs(params.row?.completionDate).format('DD/MM/YYYY HH:mm') : '-'}
                </>
            )
        },
        {
            field: 'activeTime', cellClassName: 'tableRowContent', headerName: t('common:TIME'), minWidth: 80, flex: 1,
            renderCell: (params) => (
                <>
                    {params.row?.activeTime}
                </>
            )
        },
        { field: 'teamNames', headerName: F_t('sentinel-MyTeams-Results:TEAMS'), hide: false, flex: 1,  minWidth: 150},
        {
            field: 'status', cellClassName: 'tableRowContent', headerName: t('sentinel-MyUsers-BCTestRegistration:STATUS'), minWidth: 180, flex: 1, headerAlign: 'center', align: 'center',
            renderCell: (params) => {
                return <>
                    {params.row?.latestBrainCoreTestResult?.blockedByCredits && <WarningCredits enableRequest={params.row?.latestBrainCoreTestResult?.inviter==user.id}></WarningCredits>}
                    {params.row?.status === STATUSES.COMPLETED && <Box  className='btnStatusCompleted'><BsFillCircleFill className='statusFill' /></Box >}
                    {params.row?.status === STATUSES.NOT_COMPLETED && <Box className='btnStatusNotCompleted'><BsFillCircleFill className='statusFill' /></Box>}
                    {params.row?.status === STATUSES.REQUEST_SENT && <Box className='btnStatusSent'><BsFillCircleFill className='statusFill' /></Box>}
                    {params.row?.status === undefined && <Box className='btnStatusNoTest'><BsFillCircleFill className='statusFill' /></Box>}
                </>
            }
        },
        {
            field: 'hasAccessToPlatform', headerName: t('common:ACCESS TO PLATFORM'),headerAlign: 'center', align: 'center', disableColumnMenu: true, hide: false, flex: 1,  minWidth: 180, filterable:false,

            //renderCell: (params) => params.row.status ? <span style={{color: "green"}}>{t("Active")}</span> : <span style={{color: "red"}}>{t("InActive")}</span> },
            renderCell: (params) => params.row.hasAccessToPlatform ? t("common:YES") : t("common:NO")
        },
        {
            field: 'action-edit',
            minWidth:'130',
            filterable:false,
            sortable: false,
            disableColumnMenu: true,
            headerAlign: 'center',
            cellClassName: 'super-app-theme--cell',
            align: 'center',
            headerName: t('common:ACTIONS'),
            // renderHeader: () => (<SettingsIcon />),
            renderCell: (params) => (
                <Grid style={{gap:5, display:'flex'}}>
                    <MoreIcon userId={params.row._id} result={params.row.latestBrainCoreTestResult} callback={()=>fetchUserData()}></MoreIcon>
                </Grid>
                
            )
        }
        // {
        //     field: 'Action',
        //     width: 80,
        //     sortable: false,
        //     disableColumnMenu: true,
        //     headerAlign: 'center',
        //     cellClassName: 'super-app-theme--cell',
        //     align: 'center',
        //     // renderHeader: () => ('Action'),
        //     renderCell: (params) => (
        //         <div className='actionBtns'>
        //         <IconButton size="small" className={`${classes.darkViolet}`}
        //             onClick={() => {
        //                 //navigate(`/modules-core/users/form/${params.row.userId}`)
        //                 if (F_hasPermissionTo('update-user')) {
        //                     setEditFormHelper({ isOpen: true, openType: 'EDIT', userId: params.row.userId, isBlocking: false });
        //                 } else {
        //                     F_showToastMessage({ message: t('You do not have permission to edit user'), severity: 'error' });
        //                 }
        //             }}>
        //             <HiPencil />
        //         </IconButton> 
        //         <IconButton size="small" className={`${classes.darkViolet}`}
        //         >
        //             <AiFillDelete />
        //         </IconButton>

        //         </div>
        //     )
        // }
    ];

    return (
        <ThemeProvider theme={new_theme}>
        <div className='tableRoleList' style={{ width: 'auto', height: 'auto' }}>
            <NewEDataGrid
                className='tableRL'
                rows={rows}
                getRowId={(row) => row._id}
                columns={columns}
                setRows={setRows}
                originalData={users}
                isVisibleToolbar={true}
            />
            <BrainCoreTestInvitationCalendar 
                calendarOpen={calendarOpen} 
                setCalendarOpen={setCalendarOpen}
                usersIds={[calendarUserId]}
                callback={fetchUserData}
                testType={ContentService.getBraincoreTestTypeForInvitation()}
            >
            </BrainCoreTestInvitationCalendar>
        </div>
        </ThemeProvider>
    );
}
