import React, {useEffect, useState} from 'react';
import {EDataGrid} from "styled_components";
import SettingsIcon from "@material-ui/icons/Settings";
import { makeStyles} from "@material-ui/core/styles";
import {useNavigate} from "react-router-dom";
import {BsPencil} from "react-icons/bs";
import IconButton from "@material-ui/core/IconButton";
import {useTranslation} from "react-i18next";

const useStyles = makeStyles(theme=>({}))

export default function ArchitectClassesTable(props) {
    const{
        MSClasses=[],
        editFormHelper,
        setEditFormHelper=({isOpen= false, openType= undefined, classId= undefined})=>{}
    }=props;
    const { t } = useTranslation();
    const classes = useStyles();
    const navigate = useNavigate();
    const [rows, setRows] = useState([]);

    const MSClassesList = MSClasses.length>0 ? MSClasses.map((item,index)=>
        ({  id: index+1,
            name: item.name,
            level: item.level ? item.level  : "-",
            classManager: item.classManager && item.classManager ? `${item.classManager.name} ${item.classManager.surname}`: "-",
            programs: item.program ? item.program.length  : "-",
            academicYear: item.academicYear ? item.academicYear.name  : "-",
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
            classId: item._id
        })) : [];

    useEffect(()=>{
        setRows(MSClassesList);
    },[MSClasses]);

    const columns = [
        { field: 'id', headerName: 'ID', width: 50, hide: false, sortable: false, disableColumnMenu: true},
        { field: 'name', headerName: t('Class name'), width: 120, flex: 1, renderCell: (params)=> params.row.name ? <span className={params.row.name === "New empty class" && "text-danger"}>{params.row.name}</span> : "-"},
        { field: 'level', headerName: t('Level'), width: 120, flex: 1 ,
            renderCell: (params)=> t(params.row.level)
        },
        { field: 'classManager', headerName: t('Class manager'), width: 120, flex: 1 },
        { field: 'programs', headerName: t('Assigned Programs'), width: 120, flex: 1 },
        { field: 'academicYear', headerName: t('Academic year'), width: 120, flex: 1 },
        { field: 'createdAt', headerName: t('Created At'), width: 120, type: 'date', flex: 1, hide: true,
            renderCell: (params)=> params.row.createdAt ? (new Date (params.row.createdAt).toLocaleDateString()) : ("-")
        },
        { field: 'updatedAt', headerName: t('Updated At'), width: 120, type: 'date', flex: 1, hide: true,
            renderCell: (params)=> params.row.createdAt ? (new Date (params.row.updatedAt).toLocaleDateString()) : ("-")
        },
        { field: 'action',
            width: 50,
            sortable: false,
            disableColumnMenu: true,
            headerAlign: 'center',
            cellClassName: 'super-app-theme--cell',
            align: 'center',
            hide: true,
            renderHeader: ()=>(<SettingsIcon/>),
            renderCell: ({row:{classId}}) =>(
                <IconButton color="secondary" size="small"
                     onClick={()=>{
                        navigate(`/architect-setup-class/${classId}`)
                     }
                }><BsPencil/>
                </IconButton>
            )
        },
        { field: 'action2',
            width: 50,
            sortable: false,
            disableColumnMenu: true,
            headerAlign: 'center',
            cellClassName: 'super-app-theme--cell',
            align: 'center',
            hide: false,
            renderHeader: ()=>(<SettingsIcon/>),
            renderCell: ({row:{classId}}) =>(
                <IconButton color="secondary" size="small" disabled={editFormHelper.isOpen}
                            onClick={()=>{
                                //navigate(`/architect-setup-class/${classId}`)
                                setEditFormHelper({isOpen: true, openType: 'EDIT', classId})
                            }
                            }><BsPencil/>
                </IconButton>
            )
        }
    ];


    return (
        <div style={{width: 'auto', height: "auto"}}>
                <EDataGrid
                    rows={rows}
                    setRows={setRows}
                    columns={columns}
                    originalData={MSClassesList}
                    isVisibleToolbar={false}
                />
        </div>
    );
}
