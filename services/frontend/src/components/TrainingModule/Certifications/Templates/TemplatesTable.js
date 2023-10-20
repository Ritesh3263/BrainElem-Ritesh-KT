import * as React from 'react';
import {EDataGrid} from "styled_components";
import SettingsIcon from "@material-ui/icons/Settings";
import Button from '@material-ui/core/Button';
import { makeStyles} from "@material-ui/core/styles";
import {Link, useNavigate} from "react-router-dom";
import VisibilityIcon from "@material-ui/icons/Visibility";
import {BsPencil} from "react-icons/bs";
import IconButton from "@material-ui/core/IconButton";
import {useTranslation} from "react-i18next";
import {useEffect, useState} from "react";
import TableToolbar from "../../../common/Table/TableToolbar";
import TableSearch from "../../../common/Table/TableSearch";
import CustomNoRowsOverlay from "../../../common/Table/CustomNoRowsOverlay";

const useStyles = makeStyles(theme=>({}))

export default function TemplatesTable({templates, setFormIsOpen}) {
    const { t, i18n, translationsLoaded } = useTranslation();
    const classes = useStyles();
    const navigate = useNavigate();
    const [searchText, setSearchText] = useState('');
    const [rows, setRows] = useState([]);
    const [pageSize, setPageSize] = useState(10);

    const templatesList = templates.length>0 ? templates.map((item,index)=>
        ({  id: index+1,
            name: item.title,
            category: item.category ? item.category: "-",
            createdAt: item.createdAt,
            templateId: item._id
        })) : [];

    useEffect(()=>{
        setRows(templatesList);
    },[templates]);

    const columns = [
        { field: 'id', headerName: 'ID', width: 50, hide: false, sortable: false, disableColumnMenu: true},
        { field: 'name', headerName: t('Template name'), width: 120, flex: 1 },
        { field: 'category', headerName: t('Category name'), width: 120, flex: 1 },
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
                <IconButton size="small">
                    <button disabled={true} className="btn" onClick={()=>{
                        //navigate(`/certifications/template/${params.row.templateId}`)
                        setFormIsOpen({isOpen: true, isNew: false, templateId: params.row.templateId});
                    }}><BsPencil/></button>
                </IconButton>
            )
        }
    ];


    return (
        <div style={{width: '100%', height: 720}} className={classes.root}>
            {/*{templatesList.length>0 ?(*/}
                <EDataGrid rows={rows}
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
                                  onChange: (e) => TableSearch(e.target.value,templatesList,setSearchText, setRows),
                                  clearSearch: () => TableSearch('',templatesList,setSearchText, setRows),
                              },
                          }}
                />
            {/*):(*/}
            {/*    <span>{t("You don't have any templates yet")}</span>*/}
            {/*)}*/}
        </div>
    );
}
