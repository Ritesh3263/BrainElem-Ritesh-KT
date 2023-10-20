import * as React from 'react';
import { DataGrid, GridToolbar } from '@material-ui/data-grid';
import SettingsIcon from "@material-ui/icons/Settings";
import Button from '@material-ui/core/Button';
import { makeStyles} from "@material-ui/core/styles";
import {Link, useNavigate} from "react-router-dom";
import VisibilityIcon from "@material-ui/icons/Visibility";
import {BsPencil} from "react-icons/bs";
import IconButton from "@material-ui/core/IconButton";
import {useTranslation} from "react-i18next";

const useStyles = makeStyles(theme => ({
    darkViolet: {
        color: theme.palette.primary.darkViolet
    },
}))

export default function CertificationPreviewTable({certificates, setFormIsOpen}) {
    const { t, i18n, translationsLoaded } = useTranslation();
    const classes = useStyles();
    const navigate = useNavigate();
    const columns = [
        { field: 'id', headerName: 'ID', width: 35, hide: false, flex: 1},
        { field: 'name', headerName: t('Certificate name'), width: 120, flex: 1 },
        { field: 'session', headerName: t('Session name'), width: 35, flex: 1 },
        // { field: 'grade', headerName: 'Grade (avg)', width: 35, flex: 1},
        // { field: 'attendance', headerName: 'Attendance [%]', width: 35, flex: 1},
        { field: 'verifiedDate', headerName: t('Verified date'), width: 120, type: 'date', flex: 1,
            renderCell: (params)=> params.row.verifiedDate ? (new Date (params.row.verifiedDate).toLocaleDateString()) : ("-")
        },
        { field: 'createdAt', headerName: t('Created At'), width: 120, type: 'date', flex: 1,
            renderCell: (params)=> params.row.createdAt ? (new Date (params.row.createdAt).toLocaleDateString()) : ("-")
        },
        { field: 'status', headerName: t('Status'), width: 35, flex: 1, renderCell: (params) => params.row.status ? <span style={{color: "green"}}>{t("Certified")}</span> : <span style={{color: "red"}}>{t("Waiting")}</span> },
        { field: 'action',
            width: 150,
            sortable: false,
            disableColumnMenu: true,
            headerAlign: 'center',
            flex: 1,
            cellClassName: 'super-app-theme--cell',
            align: 'center',
            renderHeader: ()=>(<SettingsIcon/>),
            renderCell: (params) =>(
                <IconButton size="small" className={`${classes.darkViolet}`}
                     onClick={()=>{
                        //navigate(`/certifications/certificate/${params.row.certificateId}`)
                        setFormIsOpen({isOpen: true, isNew: false, userCertificateId: params.row.userCertificateId});
                    }}><VisibilityIcon/>
                </IconButton>
            )
        }
    ];

    const certificatesList = certificates?.length>0 ? certificates.map((item,index)=>
        ({  id: index+1,
            name: item.certificationSession?.certificate?.name,
            session: item.certificationSession?.name,
            // attendance: item.attendance??"-",
            // grade: Number(item.details.reduce((s,i)=>{
            //     return i.competenceBlocks.reduce((s2,i2)=>{ 
            //         return i2.competences.reduce((s3,i3)=>(parseInt(i3.grade) + s3),0)/i2.competences.length + s2
            //     },0)/i.competenceBlocks.length + s
            // },0)/item.details.length).toFixed(2)??"-",
            verifiedDate: item.details?.reduce((a,b)=>((new Date(a.verificationDate))>(new Date(b.verificationDate))?a:b))?.verificationDate??"-",
            createdAt: item.createdAt,
            status: item.status,
            userCertificateId: item._id
        })) : [];

    return (
        <div style={{width: '100%', height: (certificatesList.length>0) && 400}} className={classes.root}>
            {certificatesList.length>0 ?(
                <DataGrid rows={certificatesList}
                          columns={columns}
                          pageSize={5}
                          rowsPerPageOptions={[5, 10, 25]}
                          disableSelectionOnClick={true}
                          classes={{root: classes.root}}
                          components={{
                              Toolbar: GridToolbar
                          }}
                          getCellClassName={params => (params.value == null ? 'emptyCell' : 'valueCell')}
                />
            ):(
                <span>{t("You don't have any certificates")}</span>
            )}
        </div>
    );
}
