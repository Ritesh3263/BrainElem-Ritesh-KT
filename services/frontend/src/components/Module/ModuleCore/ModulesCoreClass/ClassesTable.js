import React, {useEffect, useState} from 'react';
import {EDataGrid} from "styled_components";
import SettingsIcon from "@material-ui/icons/Settings";
import { makeStyles} from "@material-ui/core/styles";
import {useNavigate} from "react-router-dom";
import {BsPencil} from "react-icons/bs";
import IconButton from "@material-ui/core/IconButton";
import {useTranslation} from "react-i18next";
import TableSearch from "components/common/Table/TableSearch";
import CustomNoRowsOverlay from "components/common/Table/CustomNoRowsOverlay";
import DeleteIcon from '@mui/icons-material/Delete';
import ConfirmActionModal from "../../../common/ConfirmActionModal";
import { useMainContext } from 'components/_ContextProviders/MainDataContextProvider/MainDataProvider';

const useStyles = makeStyles(theme => ({
    darkViolet: {
        color: theme.palette.primary.darkViolet
    },
}))

export default function ClassesTable(props) {
    const{
        MSClasses=[],
        removeClass=(s)=>{}
    }=props;
    const { t } = useTranslation();
    const classes = useStyles();
    const navigate = useNavigate();
    const [searchText, setSearchText] = useState('');
    const [rows, setRows] = useState([]);
    const {F_showToastMessage, F_hasPermissionTo} = useMainContext();
    const [pageSize, setPageSize] = useState(10);
    const [actionModal, setActionModal] = useState({isOpen: false, returnedValue: false, subjectId: undefined});

    const MSClassesList = MSClasses.length>0 ? MSClasses.map((item,index)=>
        ({  id: index+1,
            name: item.name,
            level: item.level ? item.level  : "-",
            classManager: item.classManager && item.classManager ? `${item.classManager.name} ${item.classManager.surname}`: "-",
            programs: item.program ? item.program.length  : "-",
            academicYear: item.academicYear ? item.academicYear.name  : "-",
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
            subjectId: item._id
        })) : [];

    useEffect(()=>{
        setRows(MSClassesList);
    },[MSClasses]);

    useEffect(()=>{
        if(actionModal.returnedValue){
            removeClass(actionModal.subjectId)
        }
    },[actionModal.returnedValue]);


    const columns = [
        { field: 'id', headerName: 'ID', width: 50, hide: false, disableColumnMenu: true, sortable: false},
        { field: 'name', headerName: t('Class name'), width: 120, flex: 1, renderCell: (params)=> params.row.name ? <span className={params.row.name === "New empty class" && "text-danger"}>{params.row.name}</span> : "-"},
        { field: 'level', headerName: t('Level'), width: 120, flex: 1 ,
            renderCell: (params)=> params.row.level ? t(params.row.level) : ("-")
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
            hide: false,
            disableColumnMenu: true,
            headerAlign: 'center',
            cellClassName: 'super-app-theme--cell',
            align: 'center',
            renderHeader: ()=>(<SettingsIcon/>),
            renderCell: ({row:{subjectId}}) =>(
            <IconButton color="secondary" disabled={false} size="small" className={`${classes.darkViolet}`}
                        // onClick={()=>{F_hasPermissionTo('remove-class')?setActionModal({isOpen: true, returnedValue: false, subjectId}):F_showToastMessage(t('You do not have permission to remove class'))}}>
                           onClick={()=>{setActionModal({isOpen: true, returnedValue: false, subjectId})}}>
                <DeleteIcon style={{color:'darkred'}}/>
            </IconButton>
            )
        }
    ];

    return (
        <div style={{width: 'auto', height: 'auto'}}>
                <EDataGrid
                    rows={rows}
                    setRows={setRows}
                    originalData={MSClassesList}
                    columns={columns}
                    isVisibleToolbar={false}
                />
            <ConfirmActionModal actionModal={actionModal}
                                setActionModal={setActionModal}
                                actionModalTitle={t("Removing class")}
                                actionModalMessage={t("Are you sure you want to remove class? The action is not reversible!")}
            />
        </div>
    );
}
