import React, { useEffect, useState } from 'react';
import { makeStyles } from "@material-ui/core/styles";
import {AiFillDelete} from "react-icons/ai";
import {HiPencil} from "react-icons/hi";
import { BiCheck } from "react-icons/bi";
import IconButton from "@mui/material/IconButton";
import { useTranslation } from "react-i18next";
import { useMainContext } from 'components/_ContextProviders/MainDataContextProvider/MainDataProvider';
import Avatar from "@mui/material/Avatar";
import './authorizations.scss';
import moduleCoreService from "services/module-core.service";
import ConfirmActionModal from "../../../common/ConfirmActionModal";
import StyledEIconButton from 'new_styled_components/IconButton.js/IconButton.styled';
// import { Popover, Typography } from '@mui/material';
import PopOverText from './PopOverText';
import { NewEDataGrid } from 'new_styled_components';
import StyledButton from 'new_styled_components/Button/Button.styled';
import AddTeamDrawer from './AddTeamDrawer';
import ModuleCoreService from "services/module-core.service";
import Container from '@mui/material/Container';
import { new_theme } from "NewMuiTheme";
import { Divider } from "@mui/material";
import { Typography, ThemeProvider } from "@mui/material";  
import Grid from "@mui/material/Grid";



export default function TeamList() {
    const { F_getHelper, F_handleSetShowLoader, F_showToastMessage, F_t} = useMainContext();
    const { t } = useTranslation(['common', 'sentinel-MyTeams-Results', 'sentinel-Admin-Teams']);
    const [rows, setRows] = useState([]);
    const [userIdToDelete,setUserIdToDelete]=useState(0);
    const [actionModal, setActionModal] = useState({ isOpen: false, returnedValue: false });

    const [assignTraineeSecondHelper, setAssignTraineeSecondHelper] = useState({ isOpen: true});
    const [isOpenDrawer, setIsOpenDrawer] = useState({ isOpen: false,  });
    const [updatedUsers, setUpdatedUsers] = useState([])
    const [selectedUser, setSelectedUser] = useState({})
    const [users, setUsers] = useState([])
    const { manageScopeIds } = F_getHelper();
    

    useEffect(() => {
        F_handleSetShowLoader(true);
        ModuleCoreService.readAllModuleUsers(manageScopeIds?.moduleId)
            .then((res) => {
                setUsers(res?.data)
                F_handleSetShowLoader(false);
            })
            .catch((err) => {
                F_handleSetShowLoader(false);
                F_showToastMessage(err.response.data.message, 'error');
                console.error(err)
            });
    }, [isOpenDrawer]);

    useEffect(()=>{
        const usersList = users.length > 0 ? users.map((item,index)=>
        ({ ...item, id: index+1 })) : []
        setRows(usersList)
        setUpdatedUsers(usersList)
    },[users])

    useEffect(() => {
        if (actionModal.returnedValue) {
            // remove(userIdToDelete);
        }
    }, [actionModal.returnedValue]);
    useEffect(()=>{
        if(userIdToDelete!==0){
            setActionModal({ isOpen: true, returnedValue: false })
        }
    },[userIdToDelete])
    

    const columns = [
        { 
            field: 'id', cellClassName:'tableRowContent', headerName: t('common:ID'), minWidth: 80, maxWidth: 80, flex:1, 
        },

        { 
            field: 'name', cellClassName:'tableRowContent txt-ellipses', headerName: t('common:FULL NAME'), minWidth: 180,  flex:1, 
            renderCell: (params) => (
               <span >{params.row?.name + ' ' + params.row?.surname}</span>
            )
        },

        {
            field: 'trainee', cellClassName:'tableRowContent', headerName: F_t("sentinel-MyTeams-Results:TEAMS"), minWidth: 300, flex: 1,
            renderCell: (params) => (
                <>
                    {params.row?.isModuleAdministrator && t("sentinel-Admin-Teams:ALL_TEAMS")}
                    {!params.row?.isModuleAdministrator && <>
                        {params.row?.enabledTeams?.length > 0 ? 
                        <span>{params.row.enabledTeams.map((item, index) =>{
                            return  (index ? ', ' : '') + item?.name;
                        })}</span> : '-'}
                    </>}
                </>
            )
        },
        {
            field: 'Add', cellClassName:'tableRowContent', headerName: t('sentinel-Admin-Teams:ADD'), align:'center', headerAlign:'center',  minWidth: 250, maxWidth: 250, flex: 1, sortable: false, disableColumnMenu: true,
            renderCell: (params) => (
                <>
                      <StyledButton eVarient="primary" eSize="xsmall" style={{margin:0}}  onClick={() => {
                            if (assignTraineeSecondHelper.isOpen) {
                                setSelectedUser(params?.row)
                                setIsOpenDrawer({
                                    isOpen: true                                            
                                })
                            }
                        }}>{t("sentinel-Admin-Teams:ADD_NEW")} </StyledButton>
                </>
            )
        },

    ];
    return (
        <ThemeProvider theme={new_theme}>
            <Container maxWidth="xl" className="mainContainerDiv Auth_Module">
                <div className="admin_content">
                        <Grid item xs={12}>
                            <div className="admin_heading">
                                <Grid>
                                    <Typography variant="h1" className="typo_h5">{F_t("sentinel-Admin-Teams:TEAM_ACESSES")}</Typography>
                                    <Divider variant="insert" className='heading_divider' />
                                </Grid>
                            </div>
                        </Grid>
                </div>
                <div className='tableRoleList permissionTable' style={{ width: 'auto', height: 'auto' }}>
                    <NewEDataGrid
                        className='tableRL'
                        rows={rows}
                        columns={columns}
                        setRows={setRows}
                        originalData={updatedUsers}
                        isVisibleToolbar = {true}
                    />
                    <AddTeamDrawer isOpenDrawer={isOpenDrawer} setIsOpenDrawer={setIsOpenDrawer} selectedUser={selectedUser}/>
                </div>
            </Container>
        </ThemeProvider>
    );
}
