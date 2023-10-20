import React, {useEffect, useState} from 'react';
import SettingsIcon from "@material-ui/icons/Settings";
import { makeStyles} from "@material-ui/core/styles";
import {useNavigate} from "react-router-dom";
import {BsPencil} from "react-icons/bs";
import IconButton from "@material-ui/core/IconButton";
import Chip from '@material-ui/core/Chip';
import {useTranslation} from "react-i18next";
import {EDataGrid} from "styled_components";

const useStyles = makeStyles(theme => ({
    darkViolet: {
        color: theme.palette.primary.darkViolet
    },
}))

export default function EcosystemsTable(props) {
    const{
        MSAcademicYears=[]
    }=props;
    const { t } = useTranslation();
    const classes = useStyles();
    const navigate = useNavigate();
    const [rows, setRows] = useState([]);

    const MSAcademicYearsList = MSAcademicYears.length>0 ? MSAcademicYears.map((item,index)=>
        ({  id: index+1,
            schoolYearName: item?.name??"-",
            numbersOfPeriod: item.periods ? item.periods.length : "-",
            periods: item?.periods??[],
            status: item?.isActive??"-",
            schoolYearId: item._id
        })) : [];

    useEffect(()=>{
        setRows(MSAcademicYearsList);
    },[MSAcademicYears]);

    const columns = [
        { field: 'id', headerName: 'ID', width: 50, hide: false, sortable: false, disableColumnMenu: true},
        { field: 'schoolYearName', headerName: t('School year name'), width: 120, flex: 1 },
        { field: 'periods', headerName: t('Periods'), width: 120 , flex: 1,
            renderCell: (params)=> params.row.periods ? params.row.periods.map(i=> <Chip color="primary" className="mx-1" label={i?.name}/>) : "-"
        },
        { field: 'numbersOfPeriod', headerName: t('Numbers of period'), width: 70, flex: 1 },
        { field: 'action',
            headerName: t("Actions"),
            width: 50,
            sortable: false,
            disableColumnMenu: true,
            headerAlign: 'center',
            cellClassName: 'super-app-theme--cell',
            align: 'center',
            renderHeader: ()=>(<SettingsIcon/>),
            renderCell: (params) =>(
            <IconButton color="secondary" size="small" className={`${classes.darkViolet}`} onClick={()=>{navigate(`/modules-core/academic-year/${params.row.schoolYearId}`)}}>
                <BsPencil/>
            </IconButton>
            )
        }
    ];

    return (
        <div style={{width: 'auto', height:'auto'}}>
                <EDataGrid
                    rows={rows}
                    setRows={setRows}
                    originalData={MSAcademicYearsList}
                    columns={columns}
                    isVisibleToolbar={false}
                />
        </div>
    );
}
