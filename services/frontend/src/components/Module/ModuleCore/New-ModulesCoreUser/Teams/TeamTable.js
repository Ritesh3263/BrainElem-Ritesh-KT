import React, { useEffect, useState } from 'react';
import { NewEDataGrid } from "styled_components";
import {AiFillDelete} from "react-icons/ai";
import {HiPencil} from "react-icons/hi";
import IconButton from "@mui/material/IconButton";
import { useTranslation } from "react-i18next";
import { useMainContext } from 'components/_ContextProviders/MainDataContextProvider/MainDataProvider';
import "./teams.scss"

// const useStyles = makeStyles(theme => ({
//     darkViolet: {
//         color: theme.palette.primary.darkViolet
//     },
// }))

export default function TeamTable(props) {
    const { F_showToastMessage, F_hasPermissionTo, F_t } = useMainContext();
    const {
        MSRoles = [],
        setEditFormHelper = () => { },
    } = props;
    const { t } = useTranslation();
    // const classes = useStyles();
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
        { field: 'id', headerName: 'ID', width: 50, fontWeight: 'bold', hide: false, sortable: false, disableColumnMenu: true },
       
        { field: 'Team Name', headerName: F_t('Team Name'), width: 200, flex: 1,
        renderCell: (params) => (
            <>
            {params.row.name}
          </>
        )
    },
    { field: 'Total Users', headerName: F_t('Total Users'), width: 120, flex: 1,
    renderCell: (params) => (
        <>
         <span className='user-color'> 8 Users </span>
      </>
    )
},
        {
            field: 'role', headerName: t('Role'), width: 120, flex: 1,
            renderCell: (params) => t(params.row?.role || 'Librarian')
        },
        {
            field: 'Action',
            width: 80,
            sortable: false,
            disableColumnMenu: true,
            headerAlign: 'center',
            cellClassName: 'super-app-theme--cell',
            align: 'center',
            renderHeader: () => ('Action'),
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
                    <StyledEIconButton color="primary" size="medium">
                        <AiFillDelete />
                    </StyledEIconButton>
                </div>
            )
        }
    ];

    return (
        <div className='main-table' style={{ width: 'auto', height: 'auto' }}>
            <NewEDataGrid
                rows={rows}
                columns={columns}
                setRows={setRows}
                originalData={MSRoleList}
                
            />
        </div>
    );
}
