import * as React from 'react';
import { DataGrid} from '@material-ui/data-grid';
import SettingsIcon from "@material-ui/icons/Settings";
import { makeStyles} from "@material-ui/core/styles";
import {useNavigate} from "react-router-dom";
import {BsPencil} from "react-icons/bs";
import IconButton from "@material-ui/core/IconButton";
import {useTranslation} from "react-i18next";
import TableToolbar from "../../../common/Table/TableToolbar";
import TableSearch from "../../../common/Table/TableSearch";
import CustomNoRowsOverlay from "../../../common/Table/CustomNoRowsOverlay";
import {useEffect, useState} from "react";

const useStyles = makeStyles(theme=>({}))

export default function Table_Ex({MSCurriculae, setEditFormHelper}) {
    const { t } = useTranslation();
    const classes = useStyles();
    const navigate = useNavigate();
    const [searchText, setSearchText] = useState('');
    const [rows, setRows] = useState([]);
    const [pageSize, setPageSize] = useState(10);

    const isHasPeriods = (item)=>{
        if(item.assignedPeriod && item.assignedYear && item.assignedYear.periods.length>0){
            let foundedIndex = item.assignedYear.periods.findIndex(x=> x._id === item.assignedPeriod);
            if(foundedIndex >-1){
                return item.assignedYear.periods[foundedIndex].name;
            }else{
                return "-"
            }
        }else{
            return "-"
        }
    }

    const MSCurriculaeList = MSCurriculae.length>0 ? MSCurriculae.map((item,index)=>
        ({  id: index+1,
            name: item.name,
            assignedYear: item.assignedYear && item.assignedYear.name ? item.assignedYear.name : "-",
            period: isHasPeriods(item),
            type: item.type ? item.type : "-",
            assignedSubjects: item.trainingModules ? item.trainingModules.length : "-",
            createdAt: item.createdAt ? item.createdAt : "-",
            updatedAt: item.updatedAt ? item.updatedAt : "-",
            curriculumId: item._id
        })) : [];

    useEffect(()=>{
        setRows(MSCurriculaeList);
    },[MSCurriculae]);

    const columns = [
        { field: 'id', headerName: 'ID', width: 50, hide: false, sortable: false, disableColumnMenu: true},
        { field: 'name', headerName: t('Curriculum name'), width: 120, flex: 1 },
        { field: 'assignedYear', headerName: t('Assigned year'), width: 120, flex: 1 },
        { field: 'period', headerName: t('Period'), width: 120, flex: 1 },
        { field: 'type', headerName: t('Type'), width: 120, flex: 1 },
        { field: 'assignedSubjzects', headerName: t('Assigned subjects'), width: 120, flex: 1 },
        { field: 'createdAt', headerName: t('Created At'), width: 120, type: 'date', flex: 1,
            renderCell: (params)=> params.row.createdAt ? (new Date (params.row.createdAt).toLocaleDateString()) : ("-")
        },
        { field: 'updatedAt', headerName: t('Updated At'), width: 120, type: 'date', flex: 1,
            renderCell: (params)=> params.row.updatedAt ? (new Date (params.row.updatedAt).toLocaleDateString()) : ("-")
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
                <IconButton size="small" color="secondary"
                     onClick={()=>{setEditFormHelper({isOpen: true, curriculumId: params.row.curriculumId})}}><BsPencil/>
                </IconButton>
            )
        }
    ];

    return (
        <div className={classes.root} >
            <DataGrid rows={rows}
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
                              onChange: (e) => TableSearch(e.target.value,MSCurriculaeList,setSearchText, setRows),
                              clearSearch: () => TableSearch('',MSCurriculaeList,setSearchText, setRows),
                          },
                      }}
                      getCellClassName={params => (params.value == null ? 'emptyCell' : 'valueCell')}
            />
        </div>
    );
}
