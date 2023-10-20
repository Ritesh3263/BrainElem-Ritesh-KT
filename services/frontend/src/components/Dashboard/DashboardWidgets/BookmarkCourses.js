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

export default function BookmarkCourses({lastContent=[]}) {
    const {t} = useTranslation();
    const classes = useStyles();
    const navigate = useNavigate();
    const [_pageSize, _setPageSize] = useState(5);
    const {currentScreenSize} = useMainContext();



    const columns = [
        { field: 'id', headerName: 'ID', width: 50, hide: true, disableColumnMenu: true, sortable: false},
        { field: 'name', headerName: t('Name'), width: 120, flex: 1, renderCell:renderCellExpand, disableColumnMenu: true,},
        { field: 'level', headerName: t('Level'), width: 120, flex: 1, disableColumnMenu: true,},
        { field: 'action',
            width: 80,
            sortable: false,
            disableColumnMenu: true,
            headerAlign: 'center',
            cellClassName: 'super-app-theme--cell',
            align: 'center',
            renderHeader: ()=>(<SettingsIcon/>),
            renderCell: (params) =>(
                <Button size="small" variant="contained" color="primary" onClick={()=>{
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
        ({id: index+1, name: item.title, level: item.level, contentId: item._id})) : [];


    return (
        <div style={{width: '100%', height: 'auto'}}>
            <EDataGrid rows={lastContentList}
                      isVisibleToolbar={false}
                      autoHeight={true}
                      columns={columns}
                      pageSize={_pageSize}
                      onPageSizeChange={({pageSize})=>_setPageSize(pageSize)}
                      rowsPerPageOptions={[5, 10, 25]}
                      disableSelectionOnClick={true}
                      components={{NoRowsOverlay: CustomNoRowsOverlay}}
            />
        </div>
    );
}
