import React, { useEffect, useState } from 'react';
import { NewEDataGrid } from "new_styled_components";
import SettingsIcon from "@material-ui/icons/Settings";
import { makeStyles } from "@material-ui/core/styles";
import { BsPencil} from "react-icons/bs";
import {AiFillDelete} from "react-icons/ai";
import {HiPencil} from "react-icons/hi";
import IconButton from "@material-ui/core/IconButton";
import { useTranslation } from "react-i18next";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { Badge } from "@mui/material";
import { EUserRoleChip } from "styled_components";
import { useMainContext } from 'components/_ContextProviders/MainDataContextProvider/MainDataProvider';
import Avatar from "@material-ui/core/Avatar";
import './authorizations.scss';
import moduleCoreService from "services/module-core.service";
import ConfirmActionModal from "../../../common/ConfirmActionModal";
import StyledEIconButton from 'new_styled_components/IconButton.js/IconButton.styled';


export default function 

RoleTable(props) {
    const { F_showToastMessage, F_hasPermissionTo } = useMainContext();
    const {
        MSRoles = [],
        setEditFormHelper = () => { },
    } = props;
    const { t } = useTranslation(['common', 'sentinel-Admin-Auth']);
    const [rows, setRows] = useState([]);
    const [userIdToDelete,setUserIdToDelete]=useState(0);
    const [actionModal, setActionModal] = useState({ isOpen: false, returnedValue: false });
    const MSRoleList = MSRoles.length > 0 ? MSRoles.map((item, index) =>
    ({
      
        id:item._id,
        name: item.name,
        description: item.description,
        disable:item?.protected
    })) : [];

    useEffect(() => {
        setRows(MSRoleList);
    }, [MSRoles]);
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

    const remove = (id) => {
        moduleCoreService.deleteRole(id).then(res => {
            F_showToastMessage(t("sentinel-Admin-Auth:ROLE_REMOVED", "success"))
            setEditFormHelper({ isOpen: true, openType: 'PREVIEW', userId: undefined, isBlocking: false })
             
            setEditFormHelper({ isOpen: false, openType: 'PREVIEW', userId: undefined, isBlocking: false })
        }
        ).catch(error => F_showToastMessage(error.response.data.message, "error"))
    }
    const columns = [
        // { field: 'name', headerName: t('Name'), width: 120, flex: 1, sortable: false, disableColumnMenu: true },
       

        {
            field: 'name', cellClassName:'tableRowContent', headerName: t('common:ROLE'), flex: 1, minWidth: 200,
            renderCell: (params) => (
                <>
                     {params.row.name}
                </>
            )
        },

        {
            field: t('common:ACTION'),
            minWidth: 200,
            sortable: false,
            disableColumnMenu: true,
            headerAlign: 'center',
            cellClassName: 'super-app-theme--cell',
            align: 'center',
            filterable:false,

            // renderHeader: () => ('Action'),
            renderCell: (params) => (
                <div className='actionBtns'>
               <StyledEIconButton color="primary" size="medium" disabled={params.row.disable}
                    onClick={() => {
                        //navigate(`/modules-core/users/form/${params.row.userId}`)
                        if (F_hasPermissionTo('update-user')) {
                            setEditFormHelper({ isOpen: true, openType: 'EDIT', userId: params.row.id, isBlocking: false });
                        } else {
                            F_showToastMessage({ message: t('common:CANT_EDIT_USER'), severity: 'error' });
                        }
                    }}>
                    <HiPencil />
                </StyledEIconButton> 
                <StyledEIconButton color="primary" size="medium"  disabled={params.row.disable}
                onClick={()=>{
                    console.log("id",params.row.id)
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
        <div className='tableRoleList' style={{ width: 'auto', height: 'auto' }}>
            <NewEDataGrid
                className='tableRL'
                rows={rows}
                columns={columns}
                setRows={setRows}
                originalData={MSRoleList}
            />
             <ConfirmActionModal actionModal={actionModal}
                setActionModal={setActionModal}
                actionModalTitle={t("sentinel-Admin-Auth:REMOVING_ROLE")}
                actionModalMessage={t("sentinel-Admin-Auth:CONFIRM_REMOVE_ROLE")}
            />
        </div>
    );
}
