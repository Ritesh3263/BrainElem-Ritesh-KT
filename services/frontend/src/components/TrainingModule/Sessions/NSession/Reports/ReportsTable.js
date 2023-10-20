import * as React from 'react';
import {EDataGrid} from "styled_components";
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

export default function ReportsTable({currentTraineeReports=[], reportPreviewHelper, setReportPreviewHelper}) {
    const { t } = useTranslation();
    const classes = useStyles();
    const {
        isOpenSessionForm,
    } = useSessionContext();
    const [searchText, setSearchText] = useState('');
    const [rows, setRows] = useState([]);
    const [pageSize, setPageSize] = useState(10);
    const {F_getHelper} = useMainContext();
    const {user} = F_getHelper();


    const ReportsList = currentTraineeReports.length>0 ? currentTraineeReports.map((item,index)=>
        ({  id: index+1,
            name: item.softSkillsTemplate?.name,
            createdAt: item.createdAt || "-",
            author: item.creator ? `${item.creator?.name} ${item.creator?.surname}` : "-",
            reportId: item._id
        })) : [];

    useEffect(()=>{
        setRows(ReportsList);
    },[currentTraineeReports]);

    const columns = [
        { field: 'id', headerName: 'ID', width: 50, hide: false, sortable: false, disableColumnMenu: true},
        { field: 'name', headerName: t('Template name'), width: 120, flex: 1 },
        { field: 'author', headerName: t('Author'), width: 120, flex: 1 },
        { field: 'createdAt', headerName: t('Created At'), width: 120, type: 'date', flex: 1,
            renderCell: (params)=> params.row.createdAt ? (new Date (params.row.createdAt).toLocaleDateString()) : ("-")
        },
        { field: 'action',
            width: 50,
            sortable: false,
            disableColumnMenu: true,
            headerAlign: 'center',
            cellClassName: 'super-app-theme--cell',
            align: 'center',
            renderHeader: ()=>(<SettingsIcon/>),
            renderCell: (params) =>(
                <IconButton size="small"
                            style={{width:'45px', height: '45px'}}
                            onClick={()=>{setReportPreviewHelper({isOpen: true, type: 'PREVIEW', reportId: params.row.reportId})}}
                >
                    <VisibilityIcon style={{fill: "rgba(82, 57, 112, 1)"}} />
                </IconButton>
            )
        },
        { field: 'action2',
            hide: (isOpenSessionForm.type === 'PREVIEW') || (user.role !== 'TrainingManager'),
            width: 50,
            sortable: false,
            disableColumnMenu: true,
            headerAlign: 'center',
            cellClassName: 'super-app-theme--cell',
            align: 'center',
            renderHeader: ()=>(<SettingsIcon/>),
            renderCell: (params) =>(
                <IconButton size="small"
                            style={{width:'45px', height: '45px'}}
                            disabled={(isOpenSessionForm.type === 'PREVIEW') || (user.role !== 'TrainingManager')}
                            onClick={()=>{setReportPreviewHelper({isOpen: true, type: 'EDIT', reportId: params.row.reportId})}}
                            >
                    <BsPencil style={{fill: "rgba(82, 57, 112, 1)"}} />
                </IconButton>
            )
        }
    ];

    return (
        <div style={{width: '100%', height: 'auto'}} >
            <EDataGrid rows={rows}
                      columns={columns}
                      autoHeight={true}
                      rowsPerPageOptions={[5, 10, 25]}
                      disableSelectionOnClick={true}
                      isVisibleToolbar={false}
                      classes={{root: classes.root}}
                      pageSize={pageSize}
                      onPageSizeChange={(e)=>setPageSize(e.pageSize)}
                      components={{ Toolbar: TableToolbar, NoRowsOverlay: CustomNoRowsOverlay, }}
                      componentsProps={{
                          toolbar: {
                              value: searchText,
                              onChange: (e) => TableSearch(e.target.value,ReportsList,setSearchText, setRows),
                              clearSearch: () => TableSearch('',ReportsList,setSearchText, setRows),
                          },
                      }}
            />
        </div>
    );
}
