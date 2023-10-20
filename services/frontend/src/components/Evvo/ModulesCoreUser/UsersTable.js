import React, { useEffect, useState } from 'react';
import { NewEDataGrid } from 'new_styled_components';
import { useTranslation } from "react-i18next";
import { useMainContext } from 'components/_ContextProviders/MainDataContextProvider/MainDataProvider';

// Serives
import moduleCoreService from "../../../services/module-core.service";


// MUI v5
import { Grid, Badge } from '@mui/material';


// Components
import StyledEIconButton from 'new_styled_components/IconButton.js/IconButton.styled';
import ConfirmActionModal from "../../common/ConfirmActionModal";
import MoreIcon from './MoreIcon';
import {AiFillDelete} from "react-icons/ai";
import {HiPencil} from "react-icons/hi";
// Icons
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

// Theme
import { new_theme } from 'NewMuiTheme';



export default function UsersTable(props) {
    const { F_showToastMessage, F_hasPermissionTo, F_getHelper, F_t } = useMainContext();
const { manageScopeIds, user } = F_getHelper();
    const {
        MSUsers = [],
        setEditFormHelper = () => { },
    } = props;
    const { t, i18n } = useTranslation(['translation', 'common', 'sentinel-MyTeams-Results']);
    const [rows, setRows] = useState([]);
    const [actionModal, setActionModal] = useState({ isOpen: false, returnedValue: false });
    const [userIdToDelete,setUserIdToDelete]=useState(false);
    const [deleteId, setDeleteId] = useState('')

    const MSUsersList = MSUsers.length > 0 ? MSUsers.map((item, index) =>
    ({
        id: index + 1,
        username: item.username,
        fullName: `${item.name} ${item.surname}`,
        role: item.settings && item.settings ? item.settings.roleMaster?.name : "-",
        dateOfBirth: item.details && item.details ? item.details.dateOfBirth : "-",
        createdAt: item.createdAt,
        email: item.email ? item.email : "-",
        phone: item.details && item.details.phone ? item.details.phone : "-",
        hasAccessToPlatform: item?.settings?.isActive??false,
        dueDate: item.brainCoreTest && item.brainCoreTest.registerDate ?  item.brainCoreTest.registerDate : '-',
        teamNames: item.teams?.length>0 ?  item.teams.map(team=>team.name).join(', ') : '-',
        userId: item._id,
        latestBrainCoreTestResult: item.latestBrainCoreTestResult
    })) : [];

    useEffect(() => {
        setRows(MSUsersList);
    }, [MSUsers]);


    const remove = (id) => {
        moduleCoreService.removeModuleUser(manageScopeIds.moduleId,id).then(res => {
            F_showToastMessage(t("common:USER_REMOVED", "success"))
            setEditFormHelper({ isOpen: true, openType: 'PREVIEW', userId: undefined, isBlocking: false })
             
            setEditFormHelper({ isOpen: false, openType: 'PREVIEW', userId: undefined, isBlocking: false })
        }
        ).catch(error => console.error(error))
    }
    useEffect(() => {
        setUserIdToDelete(false)
        if (actionModal.returnedValue) {
            remove(deleteId);
        }
    }, [actionModal]);
    useEffect(()=>{
        if(userIdToDelete){
            setActionModal({ isOpen: true, returnedValue: false })
        }
    },[userIdToDelete])

    const columns = [
        { field: 'id', headerName: 'SR',  fontWeight: 'bold', hide: false, sortable: true, disableColumnMenu: true, flex: 1, minWidth: 50, maxWidth: 50 },
        { field: 'username', headerName: t('common:USERNAME'), hide: true, flex: 1, minWidth: 150 },
        { field: 'fullName', headerName: t('common:FULL NAME'),  hide: false, flex: 1,  minWidth: 220},
        {
            field: 'role', headerName: t('common:ROLE'), flex: 1, hide: false, minWidth: 200,
            renderCell: (params) =>(
                <div className='txt-ellipses'>{params.row?.role || '-'}</div>
            ) 
        },
        {
            field: 'dateOfBirth', headerName: t('common:DATE OF BIRTH'),  type: 'date', hide: false, flex: 1,  minWidth: 140,
            renderCell: (params) => params.row.dateOfBirth ? (new Date(params.row.dateOfBirth).toLocaleDateString()) : ("-")
        },
        {
            field: 'createdAt', headerName: t('common:CREATED AT'), type: 'date', hide: true, flex: 1,  minWidth: 150,
            renderCell: (params) => params.row.createdAt ? (new Date(params.row.createdAt).toLocaleDateString()) : ("-")
        },
        { field: 'email', headerName: t('E-mail'), hide: false, flex: 1,  minWidth: 180, },
        { field: 'teamNames', headerName: F_t('sentinel-MyTeams-Results:TEAMS'), hide: false, flex: 1,  minWidth: 120},
        {
            field: 'hasAccessToPlatform', headerName: t('common:ACCESS TO PLATFORM'),headerAlign: 'center', align: 'center', disableColumnMenu: true, hide: false, flex: 1,  minWidth: 180, filterable:false,

            //renderCell: (params) => params.row.status ? <span style={{color: "green"}}>{t("Active")}</span> : <span style={{color: "red"}}>{t("InActive")}</span> },
            renderCell: (params) => params.row.hasAccessToPlatform ? t("common:YES") : t("common:NO")
        },
        // { field: 'action-preview',
        //     width: 50,
        //     sortable: false,
        //     disableColumnMenu: true,
        //     headerAlign: 'center',
        //     cellClassName: 'super-app-theme--cell',
        //     align: 'center',
        //     renderHeader: ()=>(<VisibilityIcon/>),
        //     renderCell: (params) =>(
        //     <IconButton  size="small" className={`${classes.darkViolet}`}
        //                 onClick={()=>{
        //                     //navigate(`/modules-core/users/form/${params.row.userId}`)
        //                     setEditFormHelper({isOpen: true, openType:'PREVIEW', userId: params.row.userId});
        //                 }}>
        //         <VisibilityIcon/>
        //     </IconButton>
        //     )
        // },
        {
            field: 'action-edit',
            filterable:false,
            sortable: false,
            disableColumnMenu: true,
            headerAlign: 'center',
            cellClassName: 'super-app-theme--cell',
            align: 'center',
            flex: 1,  
            minWidth: 130,
            headerName: t('common:ACTIONS'),
            // renderHeader: () => (<SettingsIcon />),
            renderCell: (params) => (
                <Grid style={{gap:5, display:'flex'}}>
                    <StyledEIconButton color="primary" size="medium" onClick={() => {
                        //navigate(`/modules-core/users/form/${params.row.userId}`)
                        if (F_hasPermissionTo('update-user')) {
                            setEditFormHelper({ isOpen: true, openType: 'EDIT', userId: params.row.userId, isBlocking: false });
                        } else {
                            F_showToastMessage({ message: t('common:CANT_EDIT_USER'), severity: 'error' });
                        }
                    }}>
                        <HiPencil />
                    </StyledEIconButton >

                    <StyledEIconButton color="primary" size="medium" disabled={params?.row?.userId === user?.id} onClick={()=> {setUserIdToDelete(true); setDeleteId(params?.row?.userId);}}>
                        {/* <BsTrashFill/> */}
                        <AiFillDelete />
                    </StyledEIconButton>

                    <MoreIcon userId={params.row.userId}  disabled={params.row.latestBrainCoreTestResult?.blockedByCredits} result={params.row.latestBrainCoreTestResult} callback={()=>{
                                    setEditFormHelper({ isOpen: true, openType: 'PREVIEW', userId: undefined, isBlocking: false })
                                    setEditFormHelper({ isOpen: false, openType: 'PREVIEW', userId: undefined, isBlocking: false })
                    }}></MoreIcon>
                </Grid>
                
            )
        }
    ];


    return (
        <div style={{ width: 'auto', height: 'auto' }}>
            <NewEDataGrid
                rows={rows}
                columns={columns}
                setRows={setRows}
                originalData={MSUsersList}
            />
            <ConfirmActionModal actionModal={actionModal}
                setActionModal={setActionModal}
                actionModalTitle={t("common:REMOVE_USER")}
                actionModalMessage={t("common:ARE_YOU_SURE_TO_REMOVE_USER")}
            />
        </div>
    );
}
