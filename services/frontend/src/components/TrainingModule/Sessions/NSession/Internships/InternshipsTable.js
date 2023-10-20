import * as React from 'react';
import { DataGrid} from '@material-ui/data-grid';
import SettingsIcon from "@material-ui/icons/Settings";
import { makeStyles} from "@material-ui/core/styles";
import {BsPencil} from "react-icons/bs";
import IconButton from "@material-ui/core/IconButton";
import {useTranslation} from "react-i18next";
import TableToolbar from "../../../../common/Table/TableToolbar";
import TableSearch from "../../../../common/Table/TableSearch";
import CustomNoRowsOverlay from "../../../../common/Table/CustomNoRowsOverlay";
import {useEffect, useState} from "react";
import VisibilityIcon from "@material-ui/icons/Visibility";
import {useSessionContext} from "../../../../_ContextProviders/SessionProvider/SessionProvider";
import {useMainContext} from "../../../../_ContextProviders/MainDataContextProvider/MainDataProvider";

const useStyles = makeStyles(theme=>({}))

export default function InternshipsTable({internships=[], setIsOpenInternshipHelper}) {
    const { t } = useTranslation();
    const classes = useStyles();
    const {
        isOpenSessionForm,
    } = useSessionContext();
    const [searchText, setSearchText] = useState('');
    const [rows, setRows] = useState([]);
    const [pageSize, setPageSize] = useState(10);
    const {F_getHelper} = useMainContext();
    const {userPermissions} = F_getHelper();


    const internshipsList = internships.length>0 ? internships.map((item,index)=>
        ({  id: index+1,
            name: item.name,
            createdAt: item.createdAt || "-",
            status: item.isActive ? "Active" : "Inactive",
            internshipId: item._id
        })) : [];

    useEffect(()=>{
        setRows(internshipsList);
    },[internships]);

    const columns = [
        { field: 'id', headerName: 'ID', width: 50, hide: false, sortable: false, disableColumnMenu: true},
        { field: 'name', headerName: t('Internship name'), width: 120, flex: 1 },
        { field: 'status', headerName: t('Status'), width: 120, flex: 1 },
        { field: 'createdAt', headerName: t('Created At'), width: 120, type: 'date', flex: 1,
            renderCell: (params)=> params.row.createdAt ? (new Date (params.row.createdAt).toLocaleDateString()) : ("-")
        },
        { field: 'action',
            hide: (userPermissions.isArchitect || userPermissions.isTrainingManager || userPermissions.isCoordinator),
            width: 50,
            sortable: false,
            disableColumnMenu: true,
            headerAlign: 'center',
            cellClassName: 'super-app-theme--cell',
            align: 'center',
            renderHeader: ()=>(<SettingsIcon/>),
            renderCell: (params) =>(
                <IconButton color="secondary" size="small" className={`${classes.darkViolet}`}
                    onClick={()=>{setIsOpenInternshipHelper({isOpen: true, type: 'PREVIEW', internshipId: params.row.internshipId})}}>
                    <BsPencil/>
                </IconButton>
            )
        },
        { field: 'action2',
            hide: (!userPermissions.isArchitect && !userPermissions.isTrainingManager && !userPermissions.isCoordinator),
            width: 50,
            sortable: false,
            disableColumnMenu: true,
            headerAlign: 'center',
            cellClassName: 'super-app-theme--cell',
            align: 'center',
            renderHeader: ()=>(<SettingsIcon/>),
            renderCell: (params) =>(
                <IconButton color="secondary" size="small" className={`${classes.darkViolet}`}
                    disabled={(isOpenSessionForm.type === 'PREVIEW' && (!userPermissions.isArchitect && !userPermissions.isTrainingManager && !userPermissions.isCoordinator))}
                    onClick={()=>{setIsOpenInternshipHelper({isOpen: true, type: 'EDIT', internshipId: params.row.internshipId})}}>
                    <BsPencil/>
                </IconButton>
            )
        }
    ];

    return (
        <div style={{width: '100%', height: 'auto'}} className={classes.root}>
            <DataGrid rows={rows}
                      columns={columns}
                      autoHeight={true}
                      rowsPerPageOptions={[5, 10, 25]}
                      disableSelectionOnClick={true}
                      classes={{root: classes.root}}
                      pageSize={pageSize}
                      onPageSizeChange={(e)=>setPageSize(e.pageSize)}
                      components={{ Toolbar: TableToolbar, NoRowsOverlay: CustomNoRowsOverlay, }}
                      componentsProps={{
                          toolbar: {
                              value: searchText,
                              onChange: (e) => TableSearch(e.target.value,internshipsList,setSearchText, setRows),
                              clearSearch: () => TableSearch('',internshipsList,setSearchText, setRows),
                          },
                      }}
                      getCellClassName={params => (params.value == null ? 'emptyCell' : 'valueCell')}
            />
        </div>
    );
}
