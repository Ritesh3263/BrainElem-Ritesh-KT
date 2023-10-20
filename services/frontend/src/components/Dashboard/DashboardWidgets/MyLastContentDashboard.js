import * as React from 'react';
import {EDataGrid} from "styled_components";
import SettingsIcon from "@material-ui/icons/Settings";
import Button from '@material-ui/core/Button';
import { makeStyles} from "@material-ui/core/styles";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {renderCellExpand} from "../../common/Table/renderCellExpand";
import {isWidthUp} from "@material-ui/core/withWidth";
import {useMainContext} from "../../_ContextProviders/MainDataContextProvider/MainDataProvider";
import {useState} from "react";
import CustomNoRowsOverlay from "../../common/Table/CustomNoRowsOverlay";

const useStyles = makeStyles(theme=>({}))

const rows = [
    
];

export default function MyLastContentDashboard({lastContent=[]}) {
    const {t} = useTranslation();
    const classes = useStyles();
    const navigate = useNavigate();
    const [_pageSize, _setPageSize] = useState(5);
    const {currentScreenSize} = useMainContext();


    const isColumnVisible=()=>{
        return !isWidthUp('sm',currentScreenSize);
    }

    const getTableWidth=()=>{
        if(isWidthUp('sm',currentScreenSize)){
            return 380;
        }else{
            return 220;
        }
    }

    const columns = [
        { field: 'id', headerName: 'ID', width: 50, hide: true, disableColumnMenu: true, sortable: false},
        { field: 'contentType', headerName: t('Type'), width: 110,
            headerClassName: 'super-app-theme--header',
        },
        { field: 'name', headerName: t('Name'), width: 120, flex: 1, renderCell:renderCellExpand},
        { field: 'level', headerName: t('Level'), width: 120, flex: 1,  hide: isColumnVisible(), },
        { field: 'updatedAt', headerName: t('Updated At'), width: 120, type: 'date', flex: 1,
            hide: isColumnVisible(),
            renderCell: ({row:{updatedAt}})=>(
                updatedAt ? new Date (updatedAt).toLocaleDateString() : '-'
            )
        },
        { field: 'action',
            width: 80,
            sortable: false,
            disableColumnMenu: true,
            headerAlign: 'center',
            cellClassName: 'super-app-theme--cell',
            align: 'center',
            renderHeader: ()=>(<SettingsIcon/>),
            renderCell: (params) =>(
                <Button classes={{root: classes.root}} size="small" variant="contained" color="primary" onClick={()=>{
                    if(params.row.contentType === "PRESENTATION"){
                        navigate(`edit-presentation/${params.row.contentId}`)
                    }else{
                        navigate(`edit-test/${params.row.contentId}`)
                    }
                }
                }><small>{t("Continue")}</small></Button>
            )
        }
    ];

    const lastContentList = lastContent.length>0 ? lastContent.map((item,index)=>
        ({id: index+1, contentType: item.contentType[0], name: item.title, level: item.level, updatedAt: item.updatedAt, contentId: item._id})) : rows;


    return (
        <div style={{width: '100%', height: 'auto'}}>
                <EDataGrid rows={lastContentList}
                          autoHeight={true}
                          columns={columns}
                          isVisibleToolbar={false}
                          pageSize={_pageSize}
                          onPageSizeChange={({pageSize})=>_setPageSize(pageSize)}
                          rowsPerPageOptions={[5, 10, 25]}
                          disableSelectionOnClick={true}
                          components={{NoRowsOverlay: CustomNoRowsOverlay}}
                         />
        </div>
    );
}
