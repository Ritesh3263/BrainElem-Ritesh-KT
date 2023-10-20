import * as React from 'react';
import {EDataGrid} from "styled_components";
import SettingsIcon from "@material-ui/icons/Settings";
import { makeStyles} from "@material-ui/core/styles";
import {useNavigate} from "react-router-dom";
import VisibilityIcon from "@material-ui/icons/Visibility";
import {BsPencil} from "react-icons/bs";
import IconButton from "@material-ui/core/IconButton";
import {useTranslation} from "react-i18next";
import TableToolbar from "../common/Table/TableToolbar";
import TableSearch from "../common/Table/TableSearch";
import CustomNoRowsOverlay from "../common/Table/CustomNoRowsOverlay";
import {useEffect, useState} from "react";
import {useMainContext} from "../_ContextProviders/MainDataContextProvider/MainDataProvider";
import {isWidthUp} from "@material-ui/core/withWidth";

const useStyles = makeStyles(theme=>({}))

export default function ReportTraineeTable({traineeReports, traineeDetails,groupId }) {
    const { t } = useTranslation();
    const { F_getHelper, currentScreenSize } = useMainContext();
    const {userPermissions} = F_getHelper();
    const classes = useStyles();
    const navigate = useNavigate();
    const [searchText, setSearchText] = useState('');
    const [rows, setRows] = useState([]);
    const [pageSize, setPageSize] = useState(10);

    const isColumnVisible=()=>{
        return !isWidthUp('sm',currentScreenSize);
    }

    const traineeReportsList = traineeReports.length>0 ? traineeReports.map((item,index)=>
        ({  id: index+1,
            name: traineeDetails && traineeDetails.name ? `${traineeDetails.name} ${traineeDetails.surname}` : "-",
            createdAt: item?.createdAt ||'-',
            updatedAt: item.updatedAt,
            author: item.creator ? `${item?.creator?.name} ${item?.creator?.surname}` : "-",
            group: item?.group??"-",
            traineeId: traineeDetails?._id||"-",
            reportId: item._id
        })) : [];
    useEffect(()=>{
        setRows(traineeReportsList);
    },[traineeReports]);


    const columns = [
        { field: 'id', hide: true, headerName: 'ID', width: 50, disableColumnMenu: true, sortable: false},
        { field: 'name', headerName: t('Full name'), width: 120, flex: 1 },
        { field: 'createdAt', headerName: t('Created At'), width: 120, type: 'date', flex: 1, hide: isColumnVisible(),
            renderCell: (params)=> params.row.createdAt !== "-" ? (new Date (params.row.createdAt).toLocaleDateString()) : ("-")
        }, // to correct date 
        { field: 'updatedAt', headerName: t('Updated At'), width: 120, type: 'date', flex: 1, hide: true,
            renderCell: (params)=> params.row.updatedAt !== "-" ? (new Date (params.row.updatedAt).toLocaleDateString()) : ("-")
        },
        { field: 'author', headerName: t('Author'), width: 120, flex: 1, hide: false }, // to populate author
        { field: 'preview',
            hide: false,
            width: 100,
            sortable: false,
            disableColumnMenu: true,
            headerAlign: 'center',
            cellClassName: 'super-app-theme--cell',
            align: 'center',
            headerName: t("Preview"),
            renderCell: (params) =>(
                <IconButton size="small"
                        onClick={()=>{navigate(`/report-preview/${params.row.traineeId}/${params.row.reportId}`)}}
                        //onClick={()=>{window.open(`/report-preview/${params.row.traineeId}/${params.row.reportId}`, '_blank')}}
                    >
                          <VisibilityIcon style={{color: `rgba(82, 57, 112, 1)`}}/>
                </IconButton>
            )
        },
        { field: 'action',
            width: 50,
            hide: (userPermissions.isParent || userPermissions.isInspector),
            sortable: false,
            disableColumnMenu: true,
            headerAlign: 'center',
            cellClassName: 'super-app-theme--cell',
            align: 'center',
            renderHeader: ()=>(<SettingsIcon/>),
            renderCell: (params) =>(
                <IconButton size="small" color="secondary"
                            disabled={userPermissions.isParent || userPermissions.isInspector}
                            onClick={()=>{navigate(`/report-form/${params.row.group}/${params.row.traineeId}/${params.row.reportId}`)}}
                            //onClick={()=>{window.open(`/report-form/${params.row.traineeId}/${params.row.reportId}`, '_blank')}}
                    >
                        <BsPencil/>
                </IconButton>
            )
        }
    ];

    return (
        <div style={{width: '100%', height: 'auto'}} >
                <EDataGrid rows={rows}
                          autoHeight={true}
                          columns={columns}
                          rowsPerPageOptions={[5, 10, 25]}
                          disableSelectionOnClick={true}
                          classes={{root: classes.root}}
                          pageSize={pageSize}
                          onPageSizeChange={(e)=>setPageSize(e.pageSize)}
                          components={{ Toolbar: TableToolbar, NoRowsOverlay: CustomNoRowsOverlay, }}
                          componentsProps={{
                              toolbar: {
                                  value: searchText,
                                  onChange: (e) => TableSearch(e.target.value,traineeReportsList,setSearchText, setRows),
                                  clearSearch: () => TableSearch('',traineeReportsList,setSearchText, setRows),
                              },
                          }}
                />
        </div>
    );
}
