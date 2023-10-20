import React, {useEffect, useState} from 'react';
import { NewEDataGrid } from 'new_styled_components';
import SettingsIcon from "@material-ui/icons/Settings";
import {useNavigate} from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import {useTranslation} from "react-i18next";
import Chip from "@mui/material/Chip";
import DeleteIcon from '@mui/icons-material/Delete';
import { HiPencil } from 'react-icons/hi';
import { new_theme } from 'NewMuiTheme';
import ConfirmActionModal from "../../../common/ConfirmActionModal";
import moduleCoreService from "services/module-core.service"
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";

export default function SubjectsTable(props) {
    const{
        MSSubjects=[],
        setEditFormHelper=(isOpen,openType,subjectId)=>{},
    }=props;
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [rows, setRows] = useState([]);
    const [subjectIdToDelete,setSubjectIdToDelete]=useState(0);
    const [actionModal, setActionModal] = useState({ isOpen: false, returnedValue: false });
    const {  F_showToastMessage } = useMainContext();

    const MSSubjectsList = MSSubjects.length>0 ? MSSubjects.map((item,index)=>
        ({  id: index+1,
            name: item.name,
            chapters: item.chapters ? item.chapters : [],
            numberOfChapters: item.chapters ? item.chapters.length : "-",
            categoryName: item.category ? item.category.name : "-",
            subjectId: item._id
        })) : [];

    useEffect(()=>{
        setRows(MSSubjectsList);
    },[MSSubjects]);
    useEffect(()=>{
        if(subjectIdToDelete!==0){
            setActionModal({ isOpen: true, returnedValue: false })
        }
    },[subjectIdToDelete])

    const remove = (id) => {
        var data={
            "_id":id
        }
        moduleCoreService.removeMSSubject(data).then(res => {
            F_showToastMessage("Subject was removed", "success")
            setEditFormHelper({ isOpen: true, openType: 'PREVIEW', userId: undefined, isBlocking: false })
             
            setEditFormHelper({ isOpen: false, openType: 'PREVIEW', userId: undefined, isBlocking: false })
        }
        ).catch(error => console.error(error))
    }

    useEffect(() => {
        if (actionModal.returnedValue) {
            remove(subjectIdToDelete);
        }
    }, [actionModal.returnedValue]);
    const columns = [
        { field: 'id', headerName: 'ID', minWidth: 50, maxWidth: 50, hide: false, sortable: false, disableColumnMenu: true},
        { field: 'name', headerName: t('Subject name'), minWidth: 200, flex: 1 },
        { field: 'numberOfChapters', headerName: t('Number of chapters'), minWidth: 250, flex: 1, },
        { field: 'chapters', headerName: t('Chapters'), minWidth: 250, hide: true, flex: 1 ,
            renderCell: (params)=> params.row.chapters ? params.row.chapters.map(i=><Chip color="primary" size="small" label={i.name}/>) : ("-")
        },
        { field: 'categoryName', headerName: t('Category name'), minWidth: 250, flex: 1 },
        { field: 'action',
            width: 100,
            sortable: false,
            disableColumnMenu: true,
            headerAlign: 'center',
            cellClassName: 'super-app-theme--cell',
            align: 'center',
            headerName: t('Actions'),
            renderCell: ({row:{subjectId}}) =>(
            <>
                <IconButton style={{color:new_theme.palette.newSupplementary.NSupText, padding:6}} size="medium"  
                onClick={()=>{
                    //navigate(`/modules-core/subjects/${params.row.subjectId}`)
                    setEditFormHelper(p=>({...p, isOpen: true, openType: 'EDIT', subjectId }))
                    }}>
                    <HiPencil/>
                </IconButton>
                <IconButton style={{color:new_theme.palette.newSupplementary.NSupText, padding:6}} size="medium">
                    <DeleteIcon onClick={()=>{
                    setSubjectIdToDelete(subjectId)
                    }}/>
                </IconButton>
            </>
            )
        }
    ];

    return (
        <div style={{width: 'auto', height: 'auto'}} >
                <NewEDataGrid
                    rows={rows}
                    columns={columns}
                    setRows={setRows}
                    originalData={MSSubjectsList}
                    isVisibleToolbar={false}
                />
                 <ConfirmActionModal actionModal={actionModal}
                setActionModal={setActionModal}
                actionModalTitle={t("Removing subject")}
                actionModalMessage={t("Are you sure you want to remove subject? The action is not reversible!")}
            />
        </div>
    );
}
