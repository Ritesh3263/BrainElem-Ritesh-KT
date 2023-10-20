import React, { useEffect, useState } from 'react';
import { NewEDataGrid } from "styled_components";
import SettingsIcon from "@mui/icons-material/Settings";
import { BsPencil, BsTrash, BsTrashFill } from "react-icons/bs";
import IconButton from "@mui/material/IconButton";
import { useTranslation } from "react-i18next";
import { Badge } from "@mui/material";
import { useMainContext } from 'components/_ContextProviders/MainDataContextProvider/MainDataProvider';
import moduleCoreService from "../../../../services/module-core.service";
import Grid from "@mui/material/Grid";
import ConfirmActionModal from "../../../common/ConfirmActionModal";
import StyledEIconButton from 'new_styled_components/IconButton.js/IconButton.styled';

export default function UsersTable(props) {
    const { F_showToastMessage, F_hasPermissionTo, F_getHelper, F_handleSetShowLoader } = useMainContext();
const { manageScopeIds } = F_getHelper();
    const {
        MSUsers = [],
        setEditFormHelper = () => { },
    } = props;
    const { t } = useTranslation();
    const [rows, setRows] = useState([]);
    const [actionModal, setActionModal] = useState({ isOpen: false, returnedValue: false });
    const [userIdToDelete,setUserIdToDelete]=useState(0);

    const MSUsersList = MSUsers.length > 0 ? MSUsers.map((item, index) =>
    ({
        id: index + 1,
        username: item.username,
        fullName: `${item.name} ${item.surname}`,
        role: item.settings && item.settings ? item.settings.role : "-",
        dateOfBirth: item.details && item.details ? item.details.dateOfBirth : "-",
        createdAt: item.createdAt,
        email: item.email ? item.email : "-",
        phone: item.details && item.details.phone ? item.details.phone : "-",
        status: item.settings && item.settings.isActive ? item.settings.isActive : false,
        userId: item._id,
    })) : [];

    useEffect(() => {
        setRows(MSUsersList);
    }, [MSUsers]);


    const remove = (id) => {
        moduleCoreService.removeModuleUser(manageScopeIds.moduleId,id).then(res => {
            F_showToastMessage("User was removed", "success")
            setEditFormHelper({ isOpen: true, openType: 'PREVIEW', userId: undefined, isBlocking: false })
             
            setEditFormHelper({ isOpen: false, openType: 'PREVIEW', userId: undefined, isBlocking: false })
        }
        ).catch(error => console.error(error))
    }
    useEffect(() => {
        if (actionModal.returnedValue) {
            remove(userIdToDelete);
        }
    }, [actionModal.returnedValue]);
    useEffect(()=>{
        if(userIdToDelete!==0){
            setActionModal({ isOpen: true, returnedValue: false })
        }
    },[userIdToDelete])

    const columns = [
        { field: 'id', headerName: 'ID', width: 50, fontWeight: 'bold', hide: false, sortable: false, disableColumnMenu: true },
        { field: 'username', headerName: t('Username'), width: 120, flex: 1, hide: true },
        { field: 'fullName', headerName: t('Full name'), width: 120, flex: 1 },
        {
            field: 'role', headerName: t('Role'), width: 120, flex: 1,
            renderCell: (params) => t(params.row?.role || '-')
        },
        {
            field: 'dateOfBirth', headerName: t('Date of birth'), width: 120, type: 'date', flex: 1,
            renderCell: (params) => params.row.dateOfBirth ? (new Date(params.row.dateOfBirth).toLocaleDateString()) : ("-")
        },
        {
            field: 'createdAt', headerName: t('Created At'), width: 120, type: 'date', flex: 1, hide: true,
            renderCell: (params) => params.row.createdAt ? (new Date(params.row.createdAt).toLocaleDateString()) : ("-")
        },
        { field: 'email', headerName: t('E-mail'), width: 120, flex: 1 },
        { field: 'phone', headerName: t('Phone'), width: 120, flex: 1 },
        {
            field: 'status', headerName: t('Status'), width: 65, align: 'center', sortable: false, disableColumnMenu: true,
            //renderCell: (params) => params.row.status ? <span style={{color: "green"}}>{t("Active")}</span> : <span style={{color: "red"}}>{t("InActive")}</span> },
            renderCell: (params) => params.row.status ? <Badge color="success" variant="dot" /> : <Badge color="error" variant="dot" />
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
            width: 50,
            sortable: false,
            disableColumnMenu: true,
            headerAlign: 'center',
            cellClassName: 'super-app-theme--cell',
            align: 'center',
            renderHeader: () => (<SettingsIcon />),
            renderCell: (params) => (
                <Grid>
                    <StyledEIconButton color="secondary" size="small" onClick={() => {
                        //navigate(`/modules-core/users/form/${params.row.userId}`)
                        if (F_hasPermissionTo('update-user')) {
                            setEditFormHelper({ isOpen: true, openType: 'EDIT', userId: params.row.userId, isBlocking: false });
                        } else {
                            F_showToastMessage({ message: t('You do not have permission to edit user'), severity: 'error' });
                        }
                    }}>
                    <BsPencil />
                    </StyledEIconButton >

                    <StyledEIconButton color="secondary" size="small" onClick={()=>{
                    setUserIdToDelete(params.row.userId)
                    }}>
                        <BsTrashFill/>
                    </StyledEIconButton>

                
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
                actionModalTitle={t("Removing user")}
                actionModalMessage={t("Are you sure you want to remove user? The action is not reversible!")}
            />
        </div>
    );
}
