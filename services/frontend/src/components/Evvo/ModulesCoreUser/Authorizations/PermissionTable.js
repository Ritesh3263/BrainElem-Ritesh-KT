import React, { useEffect, useState } from 'react';
import { EDataGrid } from "styled_components";
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



export default function PermissionTable(props) {
    const { F_showToastMessage, F_hasPermissionTo } = useMainContext();
    const {
        MSPermissions = [],
        setEditFormHelper = () => { },
    } = props;
    const { t } = useTranslation(['common', 'sentinel-Admin-Auth']);
    const [rows, setRows] = useState([]);
    const [userIdToDelete,setUserIdToDelete]=useState(0);
    const [actionModal, setActionModal] = useState({ isOpen: false, returnedValue: false });

    const MSRoleList = MSPermissions.length > 0 ? MSPermissions.map((item, index) =>
    ({
        id: item._id,
        name: item.name,
        access:item.access,
        edit:item.edit,
        disable:item?.protected,
        description: item.description

    })) : [];
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
    useEffect(() => {
        setRows(MSRoleList);
    }, [MSPermissions]);
    const remove = (id) => {
        moduleCoreService.deletePermission(id).then(res => {
            F_showToastMessage(t("sentinel-Admin-Auth:PERMISSION_REMOVED", "success"))
            setEditFormHelper({ isOpen: true, openType: 'PREVIEW', userId: undefined, isBlocking: false })
             
            setEditFormHelper({ isOpen: false, openType: 'PREVIEW', userId: undefined, isBlocking: false })
        }
        ).catch(error => console.error(error))
    };
    

    const columns = [
        { 
            field: t('sentinel-Admin-Auth:PERMISSION'), cellClassName:'tableRowContent', headerName: t('sentinel-Admin-Auth:PERMISSION'), minWidth: 150, maxWidth: 250, flex:1, 
            renderCell: (params) => (
                <>
                    {params.row.name}
                </>
            )
        },

        { 
            field: t('common:DESCRIPTION'), cellClassName:'tableRowContent tbl_description', headerName: t('common:DESCRIPTION'), minWidth: 400,  flex:1,
            renderCell: (params) => (
                <>
                    {params.row?.description}
                </>
                // <PopOverText  text={params.row?.description}/>
            )
        },

        {
            field: t('common:VIEW'), cellClassName:'tableRowContent', headerName: t('common:VIEW'), minWidth: 80, maxWidth: 200, flex: 1,
            renderCell: (params) => (
                <>
                    {params.row.access ? t('common:YES') : t('common:NO')}
                </>
            )
        },
        {
            field: t('common:EDIT'), cellClassName:'tableRowContent', headerName: t('common:EDIT'), minWidth: 80, maxWidth: 200, flex: 1,
            renderCell: (params) => (
                <>
                      {params.row.edit ? t('common:YES') : t('common:NO')}
                </>
            )
        },

        {
            field: t('common:ACTION'),
            minWidth: 80,
            sortable: false,
            disableColumnMenu: true,
            headerAlign: 'center',
            cellClassName: 'super-app-theme--cell',
            align: 'center',
            // renderHeader: () => ('Action'),
            renderCell: (params) => (
                <div className='actionBtns'>
                <StyledEIconButton color="primary" size="medium" disabled={params.row.disable}
                    onClick={() => {
                        //navigate(`/modules-core/users/form/${params.row.userId}`)
                        if (F_hasPermissionTo('update-user')) {
                            setEditFormHelper({ isOpen: true, openType: 'EditPermission', userId: params.row.id, isBlocking: false });
                        } else {
                            F_showToastMessage({ message: t('common:CANT_EDIT_USER'), severity: 'error' });
                        }
                    }}>
                    <HiPencil />
                </StyledEIconButton>
                <StyledEIconButton color="primary" size="medium" disabled={params.row.disable}  onClick={()=>{
                    setUserIdToDelete(params.row.id)
                    }}
                >
                    <AiFillDelete />
                </StyledEIconButton>

                </div>
            )
        }
    ];

    return (
        <div className='tableRoleList permissionTable' style={{ width: 'auto', height: 'auto' }}>
            <EDataGrid
                className='tableRL'
                rows={rows}
                columns={columns}
                setRows={setRows}
                originalData={MSRoleList}
                isVisibleToolbar = {false}
            />
             <ConfirmActionModal actionModal={actionModal}
                setActionModal={setActionModal}
                actionModalTitle={t("sentinel-Admin-Auth:REMOVING_PERMISSION")}
                actionModalMessage={t("sentinel-Admin-Auth:CONFIRM_REMOVE_PERMISSION")}
            />
        </div>
    );
}
