import React,{useEffect, useState} from 'react';
import {EDataGrid} from "styled_components";
import SettingsIcon from "@material-ui/icons/Settings";
import { makeStyles} from "@material-ui/core/styles";
import {useNavigate} from "react-router-dom";
import {BsPencil} from "react-icons/bs";
import IconButton from "@material-ui/core/IconButton";
import {useTranslation} from "react-i18next";
import DeleteIcon from '@mui/icons-material/Delete';
import { HiPencil } from 'react-icons/hi';
import { new_theme } from 'NewMuiTheme';


const useStyles = makeStyles(theme => ({
    darkViolet: {
        color: theme.palette.primary.darkViolet
    },
}))

export default function CategoriesTable(props) {
    const{
        MSCategories=[],
    }=props;
    const { t } = useTranslation();
    const classes = useStyles();
    const navigate = useNavigate();
    const [rows, setRows] = useState([]);

    const MSCategoriesList = MSCategories.length>0 ? MSCategories.map((item,index)=>
        ({  id: index+1,
            name: item.name,
            assignedSubjects: item.assignedSubjects ? item.assignedSubjects : "-",
            description: item.description,
            categoryId: item._id
        })) : [];

    useEffect(()=>{
        setRows(MSCategoriesList);
    },[MSCategories]);

    const columns = [
        { field: 'id', headerName: 'ID', minWidth: 50, maxWidth:50, hide: false, sortable: false, disableColumnMenu: true},
        { field: 'name', headerName: t('Category name'), minWidth: 200, flex: 1 },
        { field: 'assignedSubjects', headerName: t('Assigned subjects'), minWidth: 200, hide: true, flex: 1 },
        { field: 'description', headerName: t('Description'), minWidth: 250, flex: 1 },
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
                <IconButton style={{color:new_theme.palette.newSupplementary.NSupText, padding:6}} size="medium" onClick={()=>{navigate(`/modules-core/subjects-categories/${params.row.categoryId}`)}}>
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
        <div  style={{width: 'auto', height: 'auto'}} >
                <EDataGrid 
                    className="cat-tbl"
                    rows={rows}
                    columns={columns}
                    isVisibleToolbar={false}
                    originalData={MSCategoriesList}
                    setRows={setRows}
                />
        </div>
    );
}
