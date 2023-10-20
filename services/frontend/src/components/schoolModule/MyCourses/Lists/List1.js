import React, {useEffect, useState} from 'react';
import {useTranslation} from "react-i18next";
import {makeStyles} from "@material-ui/core/styles";
import SettingsIcon from "@material-ui/icons/Settings";
import IconButton from "@material-ui/core/IconButton";
import Visibility from "@material-ui/icons/Visibility";
import {BsPencil} from "react-icons/bs";
import {EDataGrid} from "styled_components";
import {useDispatch, useSelector} from "react-redux";
import {myCourseActions} from "app/features/MyCourses/data";
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import {theme} from "MuiTheme";

const useStyles = makeStyles(theme => ({
    darkViolet: {
        color: theme.palette.primary.darkViolet
    },
}))


const List1=()=> {
    const {t} = useTranslation();
    const classes = useStyles();
    const {F_getHelper} = useMainContext();
    const {user:{role}} = F_getHelper();
    const [_rows, _setRows] = useState([]);

    const dispatch = useDispatch();
    const {data, filteredData,isPending} = useSelector(_=>_.myCourses);

    const itemsList = filteredData.length>0 ? filteredData.map((item,index)=>{
        let period = item.group?.academicYear.periods.find(p=>p._id.toString()===item?.period?.toString());
        // let period = item.group.academicYear.periods.find(p=> new Date(p.startDate) <= new Date() && new Date(p.endDate) >= new Date()); // auto selects onGoing period
        return {  id: index+1,
            courseName: item?.trainingModule?.name||'-',
            class: item?.group?.name||'-',
            period: period?.name || 'period',
            updatedAt: item?.updatedAt,
            itemId: item?._id,
        }
    }) : [];

    const handleOnCellClick =  ({row:{itemId}}) =>{
        role === 'Trainee' ||  role ==='Parent' ?
        dispatch(myCourseActions.setFormHelper({isOpen: true, itemId}))
        :
        dispatch(myCourseActions.setFormHelper({isOpen: true, itemId, openType: "EDIT"}));
    }
    useEffect(()=>{
        _setRows(itemsList);
    },[filteredData]);

    const columns = [
        { field: 'id', headerName: 'ID', width: 50, hide: false, sortable: false, disableColumnMenu: true},
        { field: 'courseName', headerName: t('Course name'), width: 120, flex: 1 },
        { field: 'class', headerName: t('Class'), width: 50, flex: 0.4 },
        { field: 'period', headerName: t('Period'), width: 50, flex: 0.4 },
        { field: 'action-preview',
            width: 50,
            sortable: false,
            hide: role !== 'Trainee' && role !== 'Parent' ,
            disableColumnMenu: true,
            headerAlign: 'center',
            cellClassName: 'super-app-theme--cell',
            align: 'center',
            renderHeader: ()=>(<SettingsIcon/>),
            renderCell: ({row:{itemId}}) =>(
                <IconButton color="secondary" size="small" className={`${classes.darkViolet}`}
                            onClick={()=>{
                                dispatch(myCourseActions.setFormHelper({isOpen: true, itemId}));
                            }}><Visibility/>
                </IconButton>
            )
        },
        { field: 'action-edit',
            width: 50,
            hide: role === 'Trainee' ||  role ==='Parent',
            sortable: false,
            disableColumnMenu: true,
            headerAlign: 'center',
            cellClassName: 'super-app-theme--cell',
            align: 'center',
            renderHeader: ()=>(<SettingsIcon/>),
            renderCell: ({row:{itemId}}) =>(
                <IconButton color="secondary" size="small" className={`${classes.darkViolet}`}
                            onClick={()=>{
                                dispatch(myCourseActions.setFormHelper({isOpen: true, itemId, openType: "EDIT"}));
                            }}><ChevronRightIcon style={{fill:theme.palette.primary.lightViolet}}/>
                </IconButton>
            )
        }
    ];


     return (
         <div style={{width: 'auto', height: 'auto'}}>
             <EDataGrid style={{cursor: "pointer"}}
                initialState={{
                    sorting: {
                    sortModel: [{ field: 'period', sort: 'asc' }],
                    },
                }}
                 onCellClick={handleOnCellClick}
                 loading={isPending}
                 rows={_rows}
                 columns={columns}
                 isVisibleToolbar={false}
                 setRows={_setRows}
                 originalData={itemsList}
             />
         </div>
     )
 }

export default List1;