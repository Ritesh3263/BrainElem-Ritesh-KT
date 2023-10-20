import * as React from 'react';
import {EDataGrid} from "styled_components";
import SettingsIcon from "@material-ui/icons/Settings";
import { makeStyles} from "@material-ui/core/styles";
import {useNavigate} from "react-router-dom";
import {BsPencil} from "react-icons/bs";
import IconButton from "@material-ui/core/IconButton";
import {useTranslation} from "react-i18next";
import {useEffect, useState} from "react";
import { HiPencil } from 'react-icons/hi';
import { AiFillDelete } from 'react-icons/ai';
import DeleteIcon from '@mui/icons-material/Delete';
import "./gradingscale.scss"
import { new_theme } from 'NewMuiTheme';
import ConfirmActionModal from "../../../common/ConfirmActionModal";


export default function GradingScaleTable(props) {
    const{
        MSScale=[],
    }=props;
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [rows, setRows] = useState([]);
    const [actionModal, setActionModal] = useState({ isOpen: false, returnedValue: false });
    const [idToDelete,setIdToDelete]=useState(0);

    const MSScaleList = MSScale.length>0 ? MSScale.map((item,index)=>
        ({  id: index+1,
            name: item.name,
            isDefault: item.isDefault,
            createdAt: item.createdAt,
            scaleId: item._id
        })) : [];
    useEffect(()=>{
        setRows(MSScaleList);
    },[MSScale]);
    useEffect(()=>{
        if(idToDelete!==0){
            setActionModal({ isOpen: true, returnedValue: false })
        }
    },[idToDelete])
    const columns = [
        { field: 'id', headerName: 'ID', minWidth: 50, maxWidth:50, hide: false, sortable: false, disableColumnMenu: true},
        { field: 'name', headerName: t('Scale name'), minWidth: 180, flex: 1 },
        { field: 'isDefault', headerName: t('Default scale'), minWidth: 180, flex: 1 },
        { field: 'createdAt', cellClassName:'text_regular' , headerName: t('Created At'), minWidth: 190, type: 'date', flex: 1,
            renderCell: (params)=> params.row.createdAt ? (new Date (params.row.createdAt).toLocaleDateString()) : ("-")
        },
        { field: 'action',
            minWidth: 100,
            sortable: false,
            disableColumnMenu: true,
            headerAlign: 'center',
            cellClassName: 'super-app-theme--cell',
            align: 'center',
            headerName: t('Actions'),
            renderCell: (params) =>(
                <>
                    <IconButton style={{color:new_theme.palette.newSupplementary.NSupText, padding:6}} size="medium" onClick={()=>{navigate(`/modules-core/grading-scales/${params.row.scaleId}`)}}>
                        <HiPencil/>
                    </IconButton>
                    <IconButton style={{color:new_theme.palette.newSupplementary.NSupText, padding:6}} size="medium">
                        <DeleteIcon/>
                    </IconButton>
                </>
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
                    originalData={MSScaleList}
                />
                 <ConfirmActionModal actionModal={actionModal}
                setActionModal={setActionModal}
                actionModalTitle={t("Removing user")}
                actionModalMessage={t("Are you sure you want to remove user? The action is not reversible!")}
            />
        </div>
    );
}
