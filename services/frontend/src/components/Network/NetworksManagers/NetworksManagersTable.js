import React,{useEffect, useState} from 'react';
import {EDataGrid} from "styled_components";
import SettingsIcon from "@material-ui/icons/Settings";
import { makeStyles} from "@material-ui/core/styles";
import {useNavigate} from "react-router-dom";
import {BsPencil} from "react-icons/bs";
import IconButton from "@material-ui/core/IconButton";
import {useTranslation} from "react-i18next";
import CustomNoRowsOverlay from "components/common/Table/CustomNoRowsOverlay";
import TableSearch from "components/common/Table/TableSearch";

const useStyles = makeStyles(theme => ({
    darkViolet: {
        color: theme.palette.primary.darkViolet
    },
}))

export default function NetworksManagersTable(props) {
    const{
        networkManagers=[],
    }=props;
    const { t } = useTranslation();
    const classes = useStyles();
    const navigate = useNavigate();
    const [searchText, setSearchText] = useState('');
    const [rows, setRows] = useState([]);
    const [pageSize, setPageSize] = useState(10);

    const networkManagersList = networkManagers.length>0 ? networkManagers.map((item,index)=>
        ({  id: index+1,
            username: item?.username??"-",
            fullName: `${item?.name??"-"} ${item?.surname??"-"}`,
            role: item.settings?.role??"-",
            assignedEcosystems: item.assignedEcosystems ? item.assignedEcosystems : t("current"),
            createdAt: item?.createdAt??"-",
            status: item.settings && item.settings.isActive ? item.settings.isActive : false,
            email: item?.email??"-",
            userId: item._id
        })) : [];

    useEffect(()=>{
        setRows(networkManagersList);
    },[networkManagers]);

    const columns = [
        { field: 'id', headerName: 'ID', width: 50, hide: false, sortable: false, disableColumnMenu: true},
        { field: 'username', headerName: t('Username'), width: 120, flex: 1 },
        { field: 'fullName', headerName: t('Full name'), width: 120, flex: 1 },
        { field: 'role', headerName: t('Role'), width: 120, flex: 1 },
        { field: 'createdAt', headerName: t('Created At'), width: 120, type: 'date', flex: 1,
            renderCell: (params)=> params.row.createdAt ? (new Date (params.row.createdAt).toLocaleDateString()) : ("-")
        },
        { field: 'assignedEcosystems', headerName: t('Assigned ecosystems'), width: 120, flex: 1 },
        { field: 'status', headerName: t('Status'), width: 120, flex: 1, renderCell: (params) => params.row.status ? <span style={{color: "green"}}>{t("Active")}</span> : <span style={{color: "red"}}>{t("InActive")}</span> },
        { field: 'email', headerName: t('E-mail'), width: 120, flex: 1, hide: true },
        { field: 'action',
            width: 50,
            sortable: false,
            disableColumnMenu: true,
            headerAlign: 'center',
            cellClassName: 'super-app-theme--cell',
            align: 'center',
            renderHeader: ()=>(<SettingsIcon/>),
            renderCell: (params) =>(
        <IconButton color="secondary" size="small" className={`${classes.darkViolet}`} onClick={()=>{navigate(`/networks/owners/form/${params.row.userId}`)}}>
            <BsPencil/>
        </IconButton>
            )
        }
    ];


    return (
        <div style={{width: 'auto', height: 'auto'}}>
                <EDataGrid
                    rows={rows}
                    columns={columns}
                    isVisibleToolbar={false}
                    setRows={setRows}
                    originalData={networkManagersList}
                />
        </div>
    );
}
