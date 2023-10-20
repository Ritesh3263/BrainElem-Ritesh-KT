import React, { useEffect, useState } from 'react';
import { EDataGrid } from "styled_components";
import { useTranslation } from "react-i18next";
import { useMainContext } from 'components/_ContextProviders/MainDataContextProvider/MainDataProvider';
import "./BCTestRegistration.scss"
import { Button } from '@mui/material';
import StyledButton from 'new_styled_components/Button/Button.styled';
import { BsFillCircleFill } from 'react-icons/bs';

import dayjs from 'dayjs';
import Stack from '@mui/material/Stack';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';

export default function UserTable(props) {
    const [value, setValue] = React.useState(dayjs('2014-08-18T21:11:54'));

    const handleChange = (newValue) => {
        setValue(newValue);
    };
    const { F_showToastMessage, F_hasPermissionTo } = useMainContext();
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
        // { field: 'id', headerName: 'ID', cellClassName:'tableRowContent', width: 80, hide: false, sortable: false, disableColumnMenu: true , className:'txtHead' },
        { field: 'user', headerName: t('USER'), width: 120, flex: 1, sortable: true, disableColumnMenu: true,
            renderCell: (params) => (
                <>
                    {params.row.name}
                </>
            )
        },
        { field: 'teamname', headerName: t('TEAM NAME'), width: 120, flex: 1, sortable: false, disableColumnMenu: true,
            renderCell: (params) => (
                <>
                    {params.row.name}
                </>
            )
        },
        {
            field: 'request', cellClassName:'tableRowContent', headerName: t('DUE DATE'), width: 100, flex: 1,
            renderCell: (params) => (
                <>
                    {/* <Button dateAdapter={AdapterDayjs} className='btnSaveSmall' onClick={handleChange}>Request</Button> */}
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Stack spacing={3}>
                            
                            <MobileDatePicker
                            className="btnSaveSmall"
                            label="Date mobile"
                            inputFormat="DD/MM/YYYY"
                            value={value}
                            onChange={handleChange}
                            renderInput={(params) => <Button className="btnSaveSmall" {...params} >Request</Button>}
                            />
        
                        </Stack>
                    </LocalizationProvider>
                </>
            )
        },
        { 
            field: 'complationdate', cellClassName:'tableRowContent', headerName: t('COMPLATION DATE'), width: 100, flex: 1,
            renderCell: (params) => (
                <>
                    {params.row.name}
                </>
            )
        },

        
        {
            field: 'status', cellClassName:'tableRowContent', headerName: t('STATUS'), width: 80, flex: 1, headerAlign: 'center', align: 'center',
            renderCell: (params) => (
                <>
                     <StyledButton eVariant="secondary" eSize="small" className='btnStatus'><BsFillCircleFill/>{t("sentinel-MyUsers-BCTestRegistration:STATUS_REQUEST_SENT")}</StyledButton>
                     
                </>
            )
        },

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
