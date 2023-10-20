import React, {useEffect, useState} from 'react';
import { NewEDataGrid } from 'new_styled_components';
import SettingsIcon from "@mui/icons-material/Settings";
import {BsPencil} from "react-icons/bs";
import StyledEIconButton from 'new_styled_components/IconButton.js/IconButton.styled';
import {useTranslation} from "react-i18next";
import {useCoursePathContext} from "components/_ContextProviders/CoursePathProvider/CoursePathProvider";
import { HiPencil } from 'react-icons/hi';
import { AiFillDelete } from 'react-icons/ai';
import { new_theme } from 'NewMuiTheme';


export default function CoursePathTable(props) {
    const{
        coursePaths=[]
    }=props;
    const {t} = useTranslation();
    const [rows, setRows] = useState([]);
    const {
        setEditFormHelper,
    } = useCoursePathContext();

    useEffect(()=>{
        setRows(coursePathsList);
    },[coursePaths]);

    const columns = [
        { field: 'id', headerName: 'ID', flex: 1, minWidth: 50, maxWidth: 50, hide: false, disableColumnMenu: true, sortable: false},
        { field: 'name', headerName: 'C. path name', minWidth: 350, flex: 1 },
        { field: 'createdAt', headerName: 'Created At', minWidth: 120, type: 'date', flex: 1,
            renderCell: (params)=> params.row.createdAt ? (new Date (params.row.createdAt).toLocaleDateString()) : ("-")
        },
        { field: 'action-edit',
            minWidth: 100,
            sortable: false,
            disableColumnMenu: true,
            headerAlign: 'center',
            cellClassName: 'super-app-theme--cell',
            align: 'center',
            headerName: 'Action',
            renderCell: (params) =>(
                <>
                <StyledEIconButton size="medium" onClick={()=>{setEditFormHelper({isOpen: true, openType:'GENERAL' , coursePathId: params.row.coursePathId});}}>
                    <HiPencil style={{color: new_theme.palette.newSupplementary.NSupText}}/>
                </StyledEIconButton>
                <StyledEIconButton size="medium" onClick={()=>{setEditFormHelper({isOpen: true, openType:'GENERAL' , coursePathId: params.row.coursePathId});}}>
                    <AiFillDelete style={{color: new_theme.palette.newSupplementary.NSupText}}/>
                </StyledEIconButton>
                </>
            )
        }
    ];

    const coursePathsList = coursePaths.length>0 ? coursePaths.map((item,index)=>
        ({  id: index+1,
            name: item?.name,
            createdAt: item?.createdAt,
            coursePathId: item?._id
        })) : [];

    return (
        <div style={{width: 'auto', height: 'auto'}}>
                <NewEDataGrid
                    rows={rows}
                    setRows={setRows}
                    isVisibleToolbar={false}
                    columns={columns}
                    originalData={coursePathsList}
                />
        </div>
    );
}
