import React, {useEffect, useState} from 'react';
import {Dialog, DialogActions, DialogContent, Paper} from '@material-ui/core';
import {myCourseActions} from "app/features/MyCourses/data";
import {useDispatch, useSelector} from "react-redux";
import DialogTitle from "@material-ui/core/DialogTitle";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import {EButton, EDataGrid, ETab, ETabBar} from "styled_components";
import {useTranslation} from "react-i18next";
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import Checkbox from "@material-ui/core/Checkbox";
import {Badge} from "@mui/material";
import SettingsIcon from "@material-ui/icons/Settings";
import IconButton from "@material-ui/core/IconButton";
import {activityActions} from "../../../../../../../app/features/Activity/data";
import Visibility from "@material-ui/icons/Visibility";
import { GRID_CHECKBOX_SELECTION_COL_DEF } from '@mui/x-data-grid';
import Tooltip from "@mui/material/Tooltip";
import IndeterminateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox';

const ManageCoursesModal=(props)=> {
    const { F_getHelper } = useMainContext();
    const {  user: {id: userId} } = F_getHelper();
    const {contentModalHelper, item, contents, dndHelper:{dndChapter:{chapterId}}} = useSelector(s=>s.myCourses);
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState(0);
    const [rows, setRows] = useState([]);
    const dispatch = useDispatch();
    const [selectionModel, setSelectionModel] = useState([]);

    useEffect(()=>{
        if(contentModalHelper.isOpen){
            setSelectionModel([]);
            if(activeTab === 0){
                dispatch(myCourseActions.fetchContents({type: 'PUBLIC'}))
            }else if(activeTab === 1){
                dispatch(myCourseActions.fetchContents({type: 'PRIVATE',userId}))
            }else if(activeTab === 2){
                dispatch(myCourseActions.fetchContents({type: 'LIBRARY_CHAPTER',chapterId}))
            }
        }
    },[contentModalHelper, activeTab]);

    useEffect(()=>{
        if(contents.length>=0){
           // let list = contentsList.sort((a,b)=> b?.isSelected - a?.isSelected);
            setRows(contentsList)
        }
    },[contents]);


    const contentsList = contents.length>0 ? contents.map((item,index)=>
        ({ id: index+1,
            name: item.title,
            contentType: item.contentType,
            approvedByLibrarian: item.approvedByLibrarian,
            updatedAt: item.updatedAt,
            isSelected: !!item?.isSelected,
            contentId: item._id,
        })):[];

    const columns = [
        { field: 'action-check',
            width: 50,
            sortable: false,
            disableColumnMenu: true,
            headerAlign: 'center',
            cellClassName: 'super-app-theme--cell',
            align: 'center',
            renderHeader: ()=>(
                <>
                    {selectionModel?.length>0 ? (
                        <Tooltip title={t("Unselect all")}>
                            <IndeterminateCheckBoxIcon style={{color:'rgba(82, 57, 112, 1)'}} onClick={()=>{
                                setSelectionModel([]);
                            }}/>
                        </Tooltip>
                    ):(
                        <Tooltip title={t("Select all")}>
                            <CheckBoxIcon style={{color:'rgba(82, 57, 112, 1)'}} onClick={()=>{
                                if(rows?.length>0){
                                    let selectedList = rows.map(r=> r.contentId);
                                    let concat = selectionModel.concat(selectedList);
                                    let uniq = [...new Set(concat)]
                                    setSelectionModel(uniq);
                                }
                            }}/>
                        </Tooltip>
                    )}

                </>
            ),
            renderCell: ({row:{isSelected, contentId}}) =>(
                <Checkbox checked={selectionModel.some(i=> i === contentId)} size="small" style={{padding:'3px'}} name="check"
                          className="mr-1"
                          onClick={({target:{checked}},v)=>{
                              if(!checked){
                                  setSelectionModel(p=> p.filter(i=> i !== contentId));
                              }else{
                                  setSelectionModel(p=>[...p,contentId]);
                              }
                              //dispatch(myCourseActions.updateChapters({type:'SELECT_CONTENT', data: {isSelected, contentId}}))
                          }}
                />
            )
        },
        { field: 'id', headerName: 'ID', width: 50, hide: false, sortable: false, disableColumnMenu: true},
        { field: 'name', headerName: t('Name'), width: 120, flex: 1 },
        { field: 'contentType', headerName: t('Type'), width: 120, flex: 1 },
        // { field: 'approvedByLibrarian', headerName: t('Approved by Librarian'), width: 120, flex: 1, align: 'center',
        //     renderCell:({row:{approvedByLibrarian=false}})=> <Badge color={approvedByLibrarian ? 'success' : 'error'} variant="dot"/>
        // },
        // { field: 'updatedAt', headerName: 'Last activity', width: 120, type: 'date', flex: 1,
        //     renderCell: ({row:{updatedAt}})=> updatedAt ? (new Date (updatedAt).toLocaleDateString()) : ("-")
        // },
        { field: 'action-preview',
            width: 50,
            sortable: false,
            disableColumnMenu: true,
            headerAlign: 'center',
            cellClassName: 'super-app-theme--cell',
            align: 'center',
            renderHeader: ()=>(<SettingsIcon style={{color:'rgba(82, 57, 112, 1)'}}/>),
            renderCell: ({row:{contentId}}) =>(
                <IconButton color="secondary" size="small" style={{color:'rgba(82, 57, 112, 1)'}}
                            onClick={()=>{window.open(`/content/preview/${contentId}`, '_blank')}}
                >
                    <Visibility/>
                </IconButton>
            )
        },
        // {
        //     ...GRID_CHECKBOX_SELECTION_COL_DEF,
        //     width: 100,
        // },
    ];

     return (
         <Dialog
             open={contentModalHelper.isOpen}
             onClose={()=>{
                 dispatch(myCourseActions.contentModalHelper('CLOSE'));
             }}
             maxWidth={'md'}
             fullWidth={true}
             aria-labelledby="alert-dialog-title"
             aria-describedby="alert-dialog-description"
         >
             <DialogTitle id="alert-dialog-title" className="text-center">
                 <Typography variant="h5" component="h2" className="text-center text-justify mt-0" style={{color: `rgba(168, 92, 255, 1)`, fontSize: '25px'}}>
                     {t("Assign contents")}
                 </Typography>
                 <Grid container spacing={1}>
                     <Grid item xs={12}>
                         <Paper elevation={12} className="p-2 text-center d-flex justify-content-center">
                             <ETabBar  className="mt-2"
                                       style={{width: '600px'}}
                                       value={activeTab}
                                       onChange={(e,i)=>setActiveTab(i)}
                                       eSize='small'
                             >
                                 <ETab label={t('Public library contents')} eSize='small'/>
                                 <ETab  label={t('Private contents')} eSize='small'/>
                                 <ETab disabled label={t('For selected chapter')} eSize='small'/>
                             </ETabBar>
                         </Paper>
                     </Grid>
                     {selectionModel?.length>0 && (
                         <Grid item xs={12}>
                             <Typography variant="body1" component="h6" className="text-left"
                                         style={{color: `rgba(21, 163, 165, 1)`, fontSize:12}}>
                                 {`${t('Selected contents')}: ${selectionModel?.length}`}
                             </Typography>
                         </Grid>
                     )}
                 </Grid>
             </DialogTitle>
             <DialogContent>
                 <div style={{width: 'auto', height: 'auto'}} >
                     <EDataGrid
                     //     checkboxSelection
                     //     keepNonExistentRowsSelected
                     //     selectionModel={selectionModel}
                     //     onSelectionModelChange={(ids)=>{
                     //         console.log(ids)
                     //         const selectedIDs = new Set(ids);
                     //         //setSelectionModel(ids)
                     //         const selectedRowData = rows.filter((row) => selectedIDs.has(row.id))
                     //         console.log(selectedRowData);
                     // }}
                         //getRowClassName={({row:{itemId}})=>`${params.row.id}theme-selected-item`}
                         getRowClassName={({row:{contentId}})=> selectionModel.some(i => i === contentId) ? 'theme-selected-item' : null}
                         rows={rows}
                         columns={columns}
                         isVisibleToolbar={true}
                         setRows={setRows}
                         originalData={contentsList}
                     />
                 </div>
             </DialogContent>
             <DialogActions className="d-flex justify-content-around ">
                 <EButton
                     eSize='small'
                     eVariant="secondary"
                     onClick={()=>{
                         dispatch(myCourseActions.contentModalHelper('CLOSE'));
                     }}
                 >
                     {t("Dismiss")}
                 </EButton>
                 <EButton
                     eSize='small'
                     eVariant="primary"
                     onClick={()=>{
                         dispatch(myCourseActions.updateChapters({type:'ADD_CONTENT', data:selectionModel}));
                         dispatch(myCourseActions.contentModalHelper('CLOSE'));
                     }}
                 >
                     {t("Save")}
                 </EButton>
             </DialogActions>
         </Dialog>
     )
 }

export default ManageCoursesModal;