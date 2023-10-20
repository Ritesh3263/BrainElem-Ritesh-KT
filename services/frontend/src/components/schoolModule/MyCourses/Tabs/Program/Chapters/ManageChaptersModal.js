import React, {useEffect, useState} from 'react';
import {Dialog, DialogActions, DialogContent, Paper} from '@material-ui/core';
import {useTranslation} from "react-i18next";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import {EButton, EDataGrid, ETab, ETabBar} from "styled_components";
import {useDispatch, useSelector} from "react-redux";
import {myCourseActions} from "app/features/MyCourses/data";
import Typography from "@material-ui/core/Typography";
import {theme} from "MuiTheme";
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import Checkbox from "@material-ui/core/Checkbox";
import IdGeneratorHelper from "components/common/IdGeneratorHelper";
import TextField from "@material-ui/core/TextField";
import { useMainContext } from 'components/_ContextProviders/MainDataContextProvider/MainDataProvider';


const chapterInitialState ={
    // _id: IdGeneratorHelper(24),
    name:"",
    description: "",
    durationTime:"",
    assignedContents:[],
    type: "-",
    isSelected: true,
    isDone: false,
    isNew: true,
}

const ManageChaptersModal=()=> {

    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState(0);
    const dispatch = useDispatch();
    const [rows, setRows] = useState([]);
    const {chapterModalHelper, item, chapters} = useSelector(s=>s.myCourses);
    const [newChapter, setNewChapter] = useState()
    const {F_hasPermissionTo} = useMainContext();

    useEffect(() => {
        if(chapterModalHelper.isOpen){
            dispatch(myCourseActions.fetchChapters(item._id));
            setNewChapter(chapterInitialState);
            setActiveTab(0);
        }
    }, [chapterModalHelper]);


    useEffect(()=>{
       if(chapters.length>0){
           setRows(chaptersList)
       }
    },[chapters]);

    const chaptersList = chapters.length>0 ? chapters.map((item,index)=>
        ({ id: index+1,
            name: item.fromProgram? item.name+" (from program)" : item.name,
            description: item.description,
            durationTime: item.durationTime,
            isSelected: !!item?.isSelected,
            assignedContents: item.assignedContent,
            isDone: !!item?.isDone,
            type: item.type,
            origin: item.origin,
            chapterId: item._id,
        })):[];

    const columns = [
        { field: 'id', headerName: 'ID', width: 50, hide: false, sortable: false, disableColumnMenu: true},
        { field: 'name', headerName: t('Name'), width: 120, flex: 1 },
        { field: 'description', headerName: t('Description'), width: 120, flex: 1 },
        { field: 'durationTime', headerName: `${t('Duration time')} [min]`, width: 100, flex: 1 },
        { field: 'assignedContents', headerName: `${t('Assigned contents')}`, width: 80, flex: 1,
            renderCell: ({row:{assignedContents=[]}}) => assignedContents?.length
        },
        { field: 'action-check',
            width: 50,
            sortable: false,
            disableColumnMenu: true,
            headerAlign: 'center',
            cellClassName: 'super-app-theme--cell',
            align: 'center',
            renderHeader: ()=>(<CheckBoxIcon style={{color:'rgba(82, 57, 112, 1)'}}/>),
            renderCell: ({row:{isSelected, chapterId}}) =>(
                <Checkbox checked={isSelected} size="small" style={{padding:'3px'}} name="check"
                          className="mr-1"
                          onClick={(e,v)=>{
                              setRows(ch=>{
                                  return ch.map(i=>{
                                            if(i.chapterId === chapterId){
                                                i.isSelected = !i?.isSelected;
                                            }
                                          return i;
                                  })
                              })
                          }}
                />
            )
        }
    ];

     return (
         <Dialog
             open={chapterModalHelper.isOpen}
             onClose={()=>{
                dispatch(myCourseActions.chapterModalHelper('CLOSE'));
             }}
             maxWidth={'md'}
             fullWidth={true}
             aria-labelledby="alert-dialog-title"
             aria-describedby="alert-dialog-description"
         >
             <DialogTitle id="alert-dialog-title" className="text-center">
                     <Typography variant="h5" component="h2" className="text-center text-justify mt-0" style={{color: `rgba(168, 92, 255, 1)`, fontSize: '25px'}}>
                         {t("Manage chapters")}
                     </Typography>
                 <Grid container spacing={1}>
                     <Grid item xs={12}>
                         <Paper elevation={12} className="p-2 text-center d-flex justify-content-center">
                             <ETabBar  className="mt-2"
                                       value={activeTab}
                                       onChange={(e,i)=>setActiveTab(i)}
                                       eSize='small'
                             >
                                 <ETab label={t('Add chapter')} eSize='small'/>
                                 {F_hasPermissionTo('create-subjects-and-chapters') && <ETab  label={t('Create new chapter')} eSize='small'/>}
                                 {/* {F_hasPermissionTo('create-chapters') && <ETab  label={t('Create new chapter')} eSize='small'/>} */}
                             </ETabBar>
                         </Paper>
                     </Grid>
                 </Grid>
             </DialogTitle>
             <DialogContent>
                 {(activeTab === 0) && (
                     <div style={{width: 'auto', height: 'auto'}} >
                         <EDataGrid
                             rows={rows}
                             columns={columns}
                             isVisibleToolbar={true}
                             setRows={setRows}
                             originalData={chaptersList}
                         />
                     </div>
                 )}
                 {(activeTab === 1) && (
                    <Grid container spacing={2}>
                        <Grid item md={4} ms={12}>
                            <TextField label={t("Chapter name")} margin="dense"
                                       fullWidth
                                       variant="filled"
                                       InputLabelProps={{
                                           shrink: true,
                                       }}
                                       required
                                       helperText={newChapter.name.length>0 ? "": t("Required")}
                                       value={newChapter.name}
                                       onInput={({target:{value}}) => {
                                           setNewChapter(p=>({...p,name: value}))
                                       }}
                            />
                        </Grid>
                        <Grid item md={4} ms={12}>
                            <TextField label={t("Chapter description")} margin="dense"
                                       variant="filled"
                                       fullWidth
                                       InputLabelProps={{
                                           shrink: true,
                                       }}
                                       multiline={true}
                                       rowsMax={3}
                                       value={newChapter.description}
                                       onInput={({target:{value}}) => {
                                           setNewChapter(p=>({...p,description: value}))
                                       }}
                            />
                        </Grid>
                        <Grid item md={4} ms={12}>
                            <TextField label={`${t("Duration time")} [min]`} margin="dense"
                                       fullWidth
                                       variant="filled"
                                       InputLabelProps={{
                                           shrink: true,
                                       }}
                                       type="number"
                                       inputProps={{
                                           min: "0",
                                           max: "9999999",
                                           step: "1"
                                       }}
                                       onInput={({target:{value}}) => {
                                           setNewChapter(p=>({...p,durationTime: value}))
                                       }}
                            />
                        </Grid>
                    </Grid>
                 )}
             </DialogContent>
             <DialogActions className="d-flex justify-content-around ">
                 <EButton
                     eSize='small'
                     eVariant="secondary"
                     onClick={()=>{
                         dispatch(myCourseActions.chapterModalHelper('CLOSE'));
                     }}
                 >
                     {t("Dismiss")}
                 </EButton>
                 <EButton
                     eSize='small'
                     eVariant="primary"
                     onClick={()=>{
                         if(activeTab ===0){
                             dispatch(myCourseActions.updateChapters({type:'UPDATE',data:rows}));
                             dispatch(myCourseActions.chapterModalHelper('CLOSE'));
                         }else{
                            if (newChapter.name.length > 0) {
                             dispatch(myCourseActions.updateChapters({type:'NEW',data:newChapter}));
                             dispatch(myCourseActions.chapterModalHelper('CLOSE'));
                            }
                         }
                     }}
                 >
                     {activeTab === 0? t("Save"): t("Create")}
                 </EButton>
             </DialogActions>
         </Dialog>
     )
 }

export default ManageChaptersModal;