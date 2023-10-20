import React, { useEffect, useState } from 'react';
import { EDataGrid } from "styled_components";
import StyledEIconButton from 'new_styled_components/IconButton.js/IconButton.styled';
import { makeStyles } from "@material-ui/core/styles";
import {AiFillDelete} from "react-icons/ai";
import {HiPencil} from "react-icons/hi";
import { BiCheck } from "react-icons/bi";
import IconButton from "@mui/material/IconButton";
import { useTranslation } from "react-i18next";
import { useMainContext } from 'components/_ContextProviders/MainDataContextProvider/MainDataProvider';
import Avatar from "@mui/material/Avatar";
import './authorizations.scss';

const useStyles = makeStyles(theme => ({
    darkViolet: {
        color: theme.palette.primary.darkViolet
    },
}))

export default function RoleTable(props) {
    const { F_showToastMessage, F_hasPermissionTo } = useMainContext();
    const {
        MSRoles = [],
        setEditFormHelper = () => { },
    } = props;
    const { t } = useTranslation();
    const classes = useStyles();
    const [rows, setRows] = useState([]);

    const MSRoleList = MSRoles.length > 0 ? MSRoles.map((item, index) =>
    ({
        id: index + 1,
        name: item.name,
        picture: item.picture,
        userId: item._id,
    })) : [];

    useEffect(() => {
        setRows(MSRoleList);
    }, [MSRoles]);

    const columns = [
        // { field: 'id', headerName: 'ID', cellClassName:'tableRowContent', width: 80, hide: false, sortable: false, disableColumnMenu: true , className:'txtHead' },
        // { field: 'name', headerName: t('Name'), width: 120, flex: 1, sortable: false, disableColumnMenu: true },
        { 
            field: 'Permisssion', cellClassName:'tableRowContent', headerName: t('Permisssion'), width: 100, flex: 1,
            renderCell: (params) => (
                <>
                    {params.row.name}
                </>
            )
        },

        {
            field: 'View', cellClassName:'tableRowContent', headerName: t('View'), width: 100, flex: 1,
            renderCell: (params) => (
                <>
                     <BiCheck />
                </>
            )
        },
        {
            field: 'Edit', cellClassName:'tableRowContent', headerName: t('Edit'), width: 100, flex: 1,
            renderCell: (params) => (
                <>
                     <BiCheck />
                </>
            )
        },

        {
            field: 'Action',
            width: 80,
            sortable: false,
            disableColumnMenu: true,
            headerAlign: 'center',
            cellClassName: 'super-app-theme--cell',
            align: 'center',
            // renderHeader: () => ('Action'),
            renderCell: (params) => (
                <div className='actionBtns'>
                    <StyledEIconButton color="primary" size="medium"
                        onClick={() => {
                            //navigate(`/modules-core/users/form/${params.row.userId}`)
                            if (F_hasPermissionTo('update-user')) {
                                setEditFormHelper({ isOpen: true, openType: 'EDIT', userId: params.row.userId, isBlocking: false });
                            } else {
                                F_showToastMessage({ message: t('You do not have permission to edit user'), severity: 'error' });
                            }
                        }}>
                        <HiPencil />
                    </StyledEIconButton>
                    <StyledEIconButton color="primary" size="medium" >
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
        </div>
    );
}
