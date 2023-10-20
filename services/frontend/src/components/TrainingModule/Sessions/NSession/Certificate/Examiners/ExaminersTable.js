import * as React from 'react';
import { NewEDataGrid } from 'new_styled_components';
import SettingsIcon from "@material-ui/icons/Settings";
import { makeStyles} from "@material-ui/core/styles";
import {useTranslation} from "react-i18next";
import TableSearch from "../../../../../common/Table/TableSearch";
import {useEffect, useState} from "react";
import VisibilityIcon from "@material-ui/icons/Visibility";
import {useSessionContext} from "../../../../../_ContextProviders/SessionProvider/SessionProvider";
import StyledEIconButton from 'new_styled_components/IconButton.js/IconButton.styled';

const useStyles = makeStyles(theme=>({}))

export default function ExaminersTable({assignedExaminers=[], setExaminerPreviewHelper }) {
    const { t } = useTranslation();
    const classes = useStyles();
    const {
        isOpenSessionForm,
    } = useSessionContext();
    const [searchText, setSearchText] = useState('');
    const [rows, setRows] = useState([]);
    const [pageSize, setPageSize] = useState(10);


    const ExaminersList = assignedExaminers.length>0 ? assignedExaminers.map((item,index)=>
        ({  id: index+1,
            name: item.name,
            surname: item.name,
            fullName: `${item?.name} ${item?.surname}`,
            createdAt: item?.createdAt || "-",
            role: item?.role??'-',
            examinerId: item._id
        })) : [];

    useEffect(()=>{
        setRows(ExaminersList);
    },[assignedExaminers]);

    const columns = [
        { field: 'id', headerName: 'ID', width: 50, hide: false, sortable: false, disableColumnMenu: true},
        { field: 'fullName', headerName: t('Examiner full name'), width: 120, flex: 1 },
        { field: 'role', headerName: t('Role'), width: 120, flex: 1 },
        { field: 'action',
            width: 50,
            sortable: false,
            disableColumnMenu: true,
            headerAlign: 'center',
            cellClassName: 'super-app-theme--cell',
            align: 'center',
            renderHeader: ()=>(<SettingsIcon/>),
            renderCell: (params) =>(
                <StyledEIconButton size="medium" color="primary" onClick={()=>setExaminerPreviewHelper({isOpen: true, examinerId: params.row.examinerId})}>
                    <VisibilityIcon />
                </StyledEIconButton>
            )
        },
    ];

    return (
        <div style={{width: '100%', height: 'auto'}} className={classes.root}>
            <NewEDataGrid rows={rows}
                      columns={columns}
                      disableSelectionOnClick={true}
                      onPageSizeChange={(e)=>setPageSize(e.pageSize)}
                      componentsProps={{
                          toolbar: {
                              value: searchText,
                              onChange: (e) => TableSearch(e.target.value,ExaminersList,setSearchText, setRows),
                              clearSearch: () => TableSearch('',ExaminersList,setSearchText, setRows),
                          },
                      }}
            />
        </div>
    );
}
