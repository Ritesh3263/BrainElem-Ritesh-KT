import React, {useEffect, useState} from 'react';
import {EDataGrid} from "styled_components";
import SettingsIcon from "@material-ui/icons/Settings";
import { makeStyles} from "@material-ui/core/styles";
import {useNavigate} from "react-router-dom";
import {BsPencil} from "react-icons/bs";
import IconButton from "@material-ui/core/IconButton";
import {useTranslation} from "react-i18next";
import {useEnquiryContext} from "components/_ContextProviders/EnquiryProvider/EnquiryProvider";

const useStyles = makeStyles(theme => ({
    darkViolet: {
        color: theme.palette.primary.darkViolet
    },
}))

export default function EnquiresTable({enquires=[]}) {
    const {t} = useTranslation();
    const classes = useStyles();
    const navigate = useNavigate();
    const [rows, setRows] = useState([]);

    useEffect(()=>{
        setRows(coursesList);
    },[enquires]);

    const {
        setEditFormHelper,
    } = useEnquiryContext();

    const columns = [
        { field: 'id', headerName: 'ID', width: 50, hide: false, disableColumnMenu: true, sortable: false},
        { field: 'name', headerName: 'Enquiry name', width: 120, flex: 1 },
        { field: 'companyName', headerName: 'Company name', width: 120, flex: 1},
        { field: 'contact', headerName: 'Contact name', width: 120, flex: 1, hide: true },
        { field: 'contactEmail', headerName: 'Contact email', width: 120, flex: 1, hide: true },
        { field: 'contactPhone', headerName: 'Contact phone', width: 120, flex: 1, hide: true },
        { field: 'startDate', headerName: 'Start date', width: 120, type: 'date', flex: 1,
            renderCell: (params)=> params.row.startDate ? (new Date (params.row.startDate).toLocaleDateString()) : ("-")
        },
        { field: 'endDate', headerName: 'End date', width: 120, type: 'date', flex: 1, hide: true,
            renderCell: (params)=> params.row.startDate ? (new Date (params.row.startDate).toLocaleDateString()) : ("-")
        },
        { field: 'traineesCount', headerName: 'Trainees count', width: 120, flex: 1 },
        { field: 'traineesLimit', headerName: 'Trainees limit', width: 120, flex: 1 },
        { field: 'status', headerName: 'Status', width: 120, flex: 1 },
        { field: 'action',
            width: 50,
            sortable: false,
            disableColumnMenu: true,
            headerAlign: 'center',
            cellClassName: 'super-app-theme--cell',
            align: 'center',
            renderHeader: ()=>(<SettingsIcon/>),
            renderCell: (params) =>(
                <IconButton size="small" color="secondary" className={`${classes.darkViolet}`}
                            onClick={()=>{
                    setEditFormHelper({isOpen: true, openType:'GENERAL' , enquiryId: params.row.enquiryId}
                    );
                }}>
                    <BsPencil className='m-2'/>
                </IconButton>
            )
        }
    ];

    const coursesList = enquires.length>0 ? enquires.map((item,index)=>
        ({  id: index+1,
            name: item?.name??'-',
            companyName: item?.company?.name??'-',
            contact: item?.contact ? (`${item?.contact?.name??'-'} ${item?.contact?.surname??'-'}`): '-',
            contactEmail: item?.contact ? item?.contact?.email: '-',
            contactPhone: item?.contact ? item?.contact?.phone: '-',
            startDate: item.startDate?? "-",
            endDate: item.endDate?? "-",
            traineesCount: item.trainees.length?? 0,
            traineesLimit: item.traineesLimit?? '-',
            status: item.status,
            enquiryId: item._id
        })) : [];

    return (
        <div style={{width: 'auto', height: 'auto'}}>
                <EDataGrid
                    rows={rows}
                    setRows={setRows}
                    columns={columns}
                    isVisibleToolbar={false}
                    originalData={coursesList}
                />
        </div>
    );
}
