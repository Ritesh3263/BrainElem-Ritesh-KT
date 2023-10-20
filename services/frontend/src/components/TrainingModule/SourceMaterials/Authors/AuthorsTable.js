import React,{useEffect, useState} from 'react';
import {EDataGrid} from "styled_components";
import SettingsIcon from "@material-ui/icons/Settings";
import { makeStyles} from "@material-ui/core/styles";
import {BsPencil} from "react-icons/bs";
import IconButton from "@material-ui/core/IconButton";
import {useTranslation} from "react-i18next";

const useStyles = makeStyles(theme => ({
    darkViolet: {
        color: theme.palette.primary.darkViolet
    },
}))


export default function AuthorsTable(props) {
    const{
        authors=[],
        setEditFormHelper=()=>{},
        tooltip5,
    }=props;
    const {t} = useTranslation();
    const classes = useStyles();
    const [_rows, _setRows] = useState([]);


    const sourceMaterialsList = authors.length>0 ? authors.map((item,index)=>
        ({  id: index+1,
            name: item?.name,
            surname: item?.lastname,
            authorId: item?._id,
        })) : [];

    useEffect(()=>{
        _setRows(sourceMaterialsList);
    },[authors]);


    const columns = [
        { field: 'id', headerName: 'ID', width: 50, hide: false, sortable: false, disableColumnMenu: true},
        { field: 'name', headerName: 'Name', width: 120, flex: 1 },
        { field: 'surname', headerName: 'Surname', width: 120, flex: 1 },
        { field: 'action-edit',
            width: 50,
            sortable: false,
            disableColumnMenu: true,
            headerAlign: 'center',
            cellClassName: 'super-app-theme--cell',
            align: 'center',
            renderHeader: ()=>(<SettingsIcon/>),
            renderCell: ({row:{authorId}}) =>(
                <IconButton color="secondary" size="small" className={`${classes.darkViolet}`}
                            ref={tooltip5}
                            onClick={()=>{
                                setEditFormHelper({isOpen: true, openType: 'EDIT', authorId});
                            }}><BsPencil/>
                </IconButton>
            )
        }
    ];

    return (
        <div style={{width: 'auto', height: 'auto'}}>
            <EDataGrid
                rows={_rows}
                columns={columns}
                isVisibleToolbar={false}
                setRows={_setRows}
                originalData={sourceMaterialsList}
            />
        </div>
    );
}
