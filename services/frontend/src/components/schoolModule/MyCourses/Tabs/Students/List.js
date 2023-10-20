import React, {useEffect, useState} from 'react';
import {EDataGrid} from "styled_components";
import SettingsIcon from "@material-ui/icons/Settings";
import { makeStyles} from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import {Badge} from "@mui/material";
import Visibility from "@material-ui/icons/Visibility";

const useStyles = makeStyles(theme=>({}))

const CoursePathTable=(props)=> {
    const{
        setPreviewHelper=({})=>{},
    }=props;
    const {t} = useTranslation();
    const classes = useStyles();
    const {item:{trainees=[]}} = useSelector(s=>s.myCourses);
    const [rows, setRows] = useState([]);

    useEffect(()=>{
        setRows(itemsList);
    },[trainees]);


    const itemsList = trainees.length>0 ? trainees.map((item,index)=>
        ({  id: index+1,
            name: `${item?.name||'-'} ${item?.surname||'-'}`,
            level: item?.level||'-',
            itemId: item?._id
        })) : [];

    const columns = [
        { field: 'id', headerName: 'ID', width: 50, hide: false, disableColumnMenu: true, sortable: false},
        { field: 'name', headerName: 'Student name', width: 120, flex: 1 },
        { field: 'level', headerName: 'Level', width: 120, flex: 1 },
        { field: 'action-preview',
            width: 50,
            sortable: false,
            disableColumnMenu: true,
            headerAlign: 'center',
            cellClassName: 'super-app-theme--cell',
            align: 'center',
            renderHeader: ()=>(<SettingsIcon/>),
            renderCell: ({row:{itemId}}) =>(
                <IconButton size="small" color="secondary" onClick={()=>{setPreviewHelper({isOpen:true,itemId})}}>
                    <Visibility style={{color: `rgba(82, 57, 112, 1)`}}/>
                </IconButton>
            )
        }
    ];

    return (
        <div style={{width: 'auto', height: 'auto'}}>
            <EDataGrid
                rows={rows}
                setRows={setRows}
                isVisibleToolbar={false}
                columns={columns}
                originalData={itemsList}
                rowsMargin={3}
                density='compact'
            />
        </div>
    );
}

export default CoursePathTable;