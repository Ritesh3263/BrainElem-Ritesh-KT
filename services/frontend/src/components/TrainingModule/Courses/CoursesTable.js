import React from 'react';
import SettingsIcon from "@material-ui/icons/Settings";
import {BsPencil} from "react-icons/bs";
import IconButton from "@material-ui/core/IconButton";
import {useTranslation} from "react-i18next";
import {useCourseContext} from "components/_ContextProviders/CourseProvider/CourseProvider";
import {useEffect, useState} from "react";
import {EDataGrid} from "styled_components";
import { HiPencil } from 'react-icons/hi';
import { new_theme } from 'NewMuiTheme';

export default function CoursesTable({courses=[]}) {
    const {t} = useTranslation();
    const [rows, setRows] = useState([]);

    const {
        setEditFormHelper,
    } = useCourseContext();

    useEffect(()=>{
        setRows(coursesList);
    },[courses]);


    const columns = [
        { field: 'id', headerName: 'ID', width: 50, hide: false, disableColumnMenu: true, sortable: false},
        { field: 'name', headerName: 'Course name', width: 120, flex: 1 },
        { field: 'category', headerName: 'Category name', width: 120, flex: 1, hide: true },
        { field: 'level', headerName: 'Level', width: 120, flex: 1 },
        { field: 'type', headerName: 'Type', width: 120, flex: 1 },
        { field: 'access', headerName: 'Access', width: 120, flex: 1, hide: true },
        { field: 'createdAt', headerName: 'Created At', width: 120, type: 'date', flex: 1,
            renderCell: (params)=> params.row.createdAt ? (new Date (params.row.createdAt).toLocaleDateString()) : ("-")
        },
        { field: 'status', headerName: 'Status', width: 120, flex: 1, hide: true },
        { field: 'action-edit',
            width: 120,
            sortable: false,
            disableColumnMenu: true,
            headerAlign: 'center',
            //flex: 1,
            cellClassName: 'super-app-theme--cell',
            align: 'center',
            headerName: 'Action',
            renderCell: (params) =>(
                <IconButton size="medium" onClick={()=>{setEditFormHelper({isOpen: true, openType:'GENERAL' , courseId: params.row.courseId});}}>
                    <HiPencil style={{color: new_theme.palette.newSupplementary.NSupText}}/>
                </IconButton>
            )
        }
    ];

    const coursesList = courses.length>0 ? courses.map((item,index)=>
        ({  id: index+1,
            name: item.name,
            category: item.category?.name?? "-",
            level: item.level?? "-",
            createdAt: item.createdAt,
            status: item.status,
            type: item.type,
            access: item.access,
            courseId: item._id
        })) : [];

    return (
        <div style={{width: 'auto', height: 'auto'}}>
            <EDataGrid
                      autoHeight={true}
                      columns={columns}
                      rows={rows}
                      isVisibleToolbar={false}
                      setRows={setRows}
                      originalData={coursesList}


                      //isVisibleToolbar={true}
                      //defaultRowsPerPage={2}
                      //rowsPerPageOptions={[2,5,10]}
                      //hideFooterPagination={false}
                      //density='compact'
                      //rowsMargin={2}
            />
        </div>
    );
}
