import React,{useEffect, useState} from 'react';
import {EDataGrid} from "styled_components";
import SettingsIcon from "@material-ui/icons/Settings";
import { makeStyles} from "@material-ui/core/styles";
import {useNavigate} from "react-router-dom";
import {BsPencil} from "react-icons/bs";
import IconButton from "@material-ui/core/IconButton";
import {useTranslation} from "react-i18next";
import {Badge} from "react-bootstrap";

const useStyles = makeStyles(theme => ({
    darkViolet: {
        color: theme.palette.primary.darkViolet
    },
}))


export default function ModulesTable(props) {
    const{
        modules=[],
        setEditFormHelper= isOpen=>{},
    }=props;
    const {t} = useTranslation();
    const classes = useStyles();
    const navigate = useNavigate();
    const [rows, setRows] = useState([]);


    const modulesList = modules.length>0 ? modules.map((item,index)=>
        ({  id: index+1,
            name: item.name,
            moduleType: item.moduleType,
            assignedManagers: item.assignedManagers ? item.assignedManagers : false,
            createdAt: item.createdAt,
            language: item.language,
            status: item.isActive,
            moduleId: item._id
        })) : [];

    useEffect(()=>{
        setRows(modulesList);
    },[modules]);


    const columns = [
        { field: 'id', headerName: 'ID', width: 50, hide: false, sortable: false, disableColumnMenu: true},
        { field: 'name', headerName: t('Module name'), width: 120, flex: 1 },
        { field: 'moduleType', headerName: t('Type'), width: 70, flex: 1 },
        { field: 'assignedManagers', headerName: t('Assigned managers'), width: 120, flex: 1, 
            renderCell: (params)=> params.row.assignedManagers && params.row.assignedManagers.length >0 ? params.row.assignedManagers.map(mgo=> <Badge key={mgo._id} variant="secondary">{`${mgo?.name} ${mgo?.surname}`}</Badge>) : "-"},
        { field: 'createdAt', headerName: t('Created At'), width: 120, type: 'date', flex: 1,
            renderCell: (params)=> params.row.createdAt ? (new Date (params.row.createdAt).toLocaleDateString()) : ("-")
        },
        { field: 'status', headerName: t('Status'), width: 80, align: 'center', sortable: false, disableColumnMenu: true,
            renderCell: ({row:{status}}) => status ? <Badge color="success" variant="dot"/> : <Badge color="error" variant="dot"/> },
        { field: 'action',
            width: 50,
            sortable: false,
            disableColumnMenu: true,
            headerAlign: 'center',
            cellClassName: 'super-app-theme--cell',
            align: 'center',
            renderHeader: ()=>(<SettingsIcon/>),
            renderCell: ({row:{moduleId}}) =>(
            <IconButton color="secondary" size="small" className={`${classes.darkViolet}`}
                        onClick={()=>{
                            setEditFormHelper({isOpen: true, moduleId })
                            //navigate(`/modules/form/${moduleId}`)
                        }}>
                <BsPencil/>
            </IconButton>
            )
        }
    ];



    return (
        <div style={{width: 'auto', height: 'auto'}} >
                <EDataGrid
                    rows={rows}
                    columns={columns}
                    setRows={setRows}
                    originalData={modulesList}
                    isVisibleToolbar={true}
                    //defaultRowsPerPage={2}
                    //rowsPerPageOptions={[2,5,10]}
                    //hideFooterPagination={false}
                    //density='compact'
                    //rowsMargin={2}
                />
        </div>
    );
}
