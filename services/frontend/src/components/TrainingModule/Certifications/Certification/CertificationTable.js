import * as React from 'react';
import { DataGrid, GridToolbar } from '@material-ui/data-grid';
import SettingsIcon from "@material-ui/icons/Settings";
import Button from '@material-ui/core/Button';
import { makeStyles} from "@material-ui/core/styles";
import {Link, useNavigate} from "react-router-dom";
import VisibilityIcon from "@material-ui/icons/Visibility";
import {BsPencil} from "react-icons/bs";
import IconButton from "@material-ui/core/IconButton";
import {useTranslation} from "react-i18next";
import TableToolbar from "../../../common/Table/TableToolbar";
import CustomNoRowsOverlay from "../../../common/Table/CustomNoRowsOverlay";
import {useEffect, useState} from "react";
import TableSearch from "../../../common/Table/TableSearch";

const useStyles = makeStyles(theme => ({
    darkViolet: {
        color: theme.palette.primary.darkViolet
    },
}));

export default function CertificationTable({certificates=[], setFormIsOpen}) {
    const { t } = useTranslation();
    const classes = useStyles();
    const [pageSize, setPageSize] = useState(10);
    const [searchText, setSearchText] = useState('');
    const [rows, setRows] = useState([]);

    useEffect(()=>{
        setRows(certificatesList);
    },[certificates]);

    const columns = [
        { field: 'id', headerName: 'ID', width: 50, hide: false, disableColumnMenu: true, sortable: false},
        { field: 'name', headerName: t('Certificate name'), width: 35, flex: 1 },
        { field: 'sessionName', headerName: t('Session name'), width: 120, flex: 1 },
        { field: 'EQFLevel', headerName: t('EQFLevel name'), width: 120, flex: 1 },
        { field: 'createdAt', headerName: t('Created At'), width: 120, type: 'date', flex: 1,
            renderCell: (params)=> params.row.createdAt ? (new Date (params.row.createdAt).toLocaleDateString()) : ("-")
        },
        { field: 'expirationDate', headerName: t('Expiration date'), width: 120, type: 'date', flex: 1,
            renderCell: (params)=> params.row.expirationDate ? (new Date (params.row.expirationDate).toLocaleDateString()) : ("-")
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
                <IconButton size="small" color="secondary" className={`${classes.darkViolet}`}
                     onClick={()=>{
                        setFormIsOpen({isOpen: true, isNew: false, certificateId: params.row.certificateId, certificationSessionId: params.row.certificationSessionId});
                        //setFormIsOpen({isOpen: true, isNew: false, certificateId: params.row.certificateId});
                    }}><BsPencil/>
                </IconButton>
            )
        }
    ];

    const certificatesList = certificates.length>0 ? certificates.map((item,index)=>
        ({  id: index+1,
            name: item.certificate?.name??'-',
            EQFLevel: item.certificate?.EQFLevel??"-",
            createdAt: item.createdAt,
            sessionName: item.name,
            expirationDate: item.certificate?.expires,
            certificateId: item.certificate?._id,
            certificationSessionId: item._id
        })) : [];

    return (
        <div style={{width: '100%', height:'auto'}} >
                <DataGrid rows={rows}
                          autoHeight={true}
                          columns={columns}
                          pageSize={pageSize}
                          onPageSizeChange={(e)=>setPageSize(e.pageSize)}
                          rowsPerPageOptions={[5, 10, 25]}
                          disableSelectionOnClick={true}
                          components={{ Toolbar: TableToolbar, NoRowsOverlay: CustomNoRowsOverlay, }}
                          componentsProps={{
                              toolbar: {
                                  value: searchText,
                                  onChange: ({target:{value}}) => TableSearch(value,certificatesList,setSearchText, setRows),
                                  clearSearch: () => TableSearch('',certificatesList,setSearchText, setRows),
                              },
                          }}
                          getCellClassName={params => (params.value == null ? 'emptyCell' : 'valueCell')}
                />
        </div>
    );
}
