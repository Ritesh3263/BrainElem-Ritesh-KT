import * as React from 'react';
import {EDataGrid} from "styled_components";
import SettingsIcon from "@material-ui/icons/Settings";
import Button from '@material-ui/core/Button';
import { makeStyles} from "@material-ui/core/styles";
import {Link, useNavigate} from "react-router-dom";
import VisibilityIcon from "@material-ui/icons/Visibility";
import {Badge} from "react-bootstrap";
import {useTranslation} from "react-i18next";
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import {isWidthUp} from "@material-ui/core/withWidth";
import CustomNoRowsOverlay from "components/common/Table/CustomNoRowsOverlay";
import {useState} from "react";
import Grid from "@material-ui/core/Grid";
import {ETab, ETabBar} from "styled_components";

const useStyles = makeStyles(theme=>({}))

const rows = [
    { id: 1, contentType: 'contentType', name: 'name', level: "level", updatedAt: "" },
];


export default function MyGradesDashboard({myGrades=[]}) {

    const {t} = useTranslation();
    const {F_getHelper} = useMainContext();
    const {userPermissions} = F_getHelper();
    const classes = useStyles();
    const {currentScreenSize} = useMainContext();
    const [_pageSize, _setPageSize] = useState(5);
    const navigate = useNavigate();
    const [currentTab, setCurrentTab] = useState(0);
    const isColumnVisible=()=>{
        if(!userPermissions.isParent){
            return true
        }else{
            return !isWidthUp('sm',currentScreenSize);
        }
    }
    const getTableHeight=()=>{
        if(isWidthUp('sm',currentScreenSize)){
            return 380;
        }else{
            return 220;
        }
    }
    const columns = [
        { field: 'id', headerName: 'ID', width: 50, hide: true, disableColumnMenu: true, sortable: false},
        { field: 'name', headerName: t('Child'), width: 120, hide: isColumnVisible(), flex: 1,
            renderCell: (params)=>(<Badge key={params.row._id} variant="secondary">{params.row.name}</Badge>)    
         },
        { field: 'content', headerName: t('Name'), width: 120, flex: 1 },
        { field: 'grade', headerName: t('Grade'), width: 120, flex: 1 },
        { field: 'subject', headerName: t('Subject'), width: 120, flex: 1 },
        { field: 'points', hide: true, headerName: t('Points'), width: 120, flex: 1 },
        { field: 'percentage', hide: true, headerName: t('Percentage'), width: 120, flex: 1 },
        { field: 'updatedAt', headerName: t('Date'), width: 120, type: 'date', flex: 1, hide: isColumnVisible(),
            renderCell: (params)=>(
                new Date (params.row.updatedAt).toLocaleDateString()
            )
        },
        { field: 'action',
            width: 100,
            sortable: false,
            disableColumnMenu: true,
            headerAlign: 'center',
            cellClassName: 'super-app-theme--cell',
            align: 'center',
            renderHeader: ()=>(<SettingsIcon/>),
            renderCell: (params) => params.row.contentId? (<Button classes={{root: classes.root}} size="small" variant="contained" color="primary"
                                   startIcon={<VisibilityIcon/>}
                                   onClick={()=>{window.open(`/content/display/${params.row.contentId}`, '_blank')}}
                ><small>{t("Exam")}</small></Button>) : (<small>{t("Exam in Class")}</small>)
        }
    ];

    const myGradesList = myGrades.length>0 ? myGrades.filter(x=>!!x.grade).map((item,index)=>
        ({
            id: index+1, 
            content: item.event?.name ?? item.content?.title ,
            name: userPermissions.isParent? item.user.name:"-",
            grade: item.grade, 
            subject: item.event?.assignedSubject?.name ?? item.content?.trainingModule?.name, 
            points: item.points?? "-" , 
            percentage: item.percentage?? "-", 
            updatedAt: item.updatedAt,
            contentId: item.content?._id
        })) : [];


    return (
        <div style={{width: 'auto', height: 'auto'}}>
            <Grid item xs={12} md={6}>
                <ETabBar style={{minWidth:'200px'}}   className="mt-3"
                    value={currentTab}
                    onChange={(e,i)=>setCurrentTab(i)}
                    eSize='small'
                >
                    <ETab  style={{minWidth:'100px'}}  label='Latest grades' eSize='small'/>
                    <ETab   style={{minWidth:'100px'}}  label='Avarages' eSize='small'/>
                </ETabBar>
            </Grid>
                <EDataGrid
                    rows={myGradesList}
                    setRows={()=>{}}
                    columns={columns}
                    isVisibleToolbar={false}
                    pageSize={_pageSize}
                    originalData={myGradesList}
                          />
        </div>
    );
}
