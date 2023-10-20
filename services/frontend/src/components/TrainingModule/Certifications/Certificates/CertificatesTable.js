import React, {useEffect, useState}  from 'react';
import { NewEDataGrid } from 'new_styled_components';
import { HiPencil } from 'react-icons/hi';
import IconButton from "@mui/material/IconButton";
import {useTranslation} from "react-i18next";
import { new_theme } from 'NewMuiTheme';


export default function CertificatesTable(props) {
    const{
        certificates=[],
        setFormIsOpen=()=>{},
    }=props;
    const { t } = useTranslation();
    const [rows, setRows] = useState([]);

    const certificatesList = certificates.length>0 ? certificates.map((item,index)=>
        ({  id: index+1,
            name: item?.name??"-",
            EQFLevel: item.EQFLevel??"-",
            createdAt: item?.createdAt??"-",
            competenceBlocks: item.assignedCompetenceBlocks?.length??"-",
            expirationDate: item?.expires,
            certificateId: item._id
        })) : [];

    useEffect(()=>{
        setRows(certificatesList);
    },[certificates]);

    const columns = [
        { field: 'id', headerName: 'ID', minWidth: 50, maxWidth: 50, hide: false, sortable: false, disableColumnMenu: true},
        { field: 'name', headerName: t('Certificate name'), minWidth: 200, flex: 1 },
        { field: 'competenceBlocks', headerName: t('Competence blocks'), minWidth: 200, flex: 1 },
        { field: 'EQFLevel', headerName: t('EQFLevel name'), minWidth: 180, flex: 1 },
        { field: 'createdAt', headerName: t('Created At'), minWidth: 150, type: 'date', flex: 1,
            renderCell: (params)=> params.row.createdAt ? (new Date (params.row.createdAt).toLocaleDateString()) : ("-")
        },
        { field: 'expirationDate', headerName: t('Expiration date'), minWidth: 180, type: 'date', flex: 1,
            renderCell: (params)=> params.row.expirationDate ? (new Date (params.row.expirationDate).toLocaleDateString()) : ("-")
        },
        { field: 'action',
            minWidth: 100,
            sortable: false,
            headerName: t('Actions'),
            disableColumnMenu: true,
            headerAlign: 'center',
            cellClassName: 'super-app-theme--cell',
            align: 'center',
            // renderHeader: ()=>(<SettingsIcon/>),
            
            renderCell: (params) =>(
                <IconButton style={{color:new_theme.palette.newSupplementary.NSupText, padding:6}} size="medium"
                     onClick={()=>{
                        //navigate(`/certifications/certificate/${params.row.certificateId}`)
                        setFormIsOpen({isOpen: true, isNew: false, certificateId: params.row.certificateId});
                    }}><HiPencil/>
                </IconButton>
            )
        }
    ];

    return (
        <div style={{width: 'auto', height: 'auto'}}>
                <NewEDataGrid
                    rows={rows}
                    columns={columns}
                    isVisibleToolbar={false}
                    setRows={setRows}
                    originalData={certificatesList}
                />
        </div>
    );
}
