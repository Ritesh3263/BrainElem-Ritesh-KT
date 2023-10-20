import React from 'react';
import Grid from "@material-ui/core/Grid";
import Chip from "@material-ui/core/Chip";
import Typography from "@material-ui/core/Typography";
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import Checkbox from "@material-ui/core/Checkbox";
import {courseManageActions} from "app/features/CourseManage/data";
import IconButton from "@material-ui/core/IconButton";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import {theme} from "MuiTheme";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";
import AutoFixHighOutlinedIcon from "@mui/icons-material/AutoFixHighOutlined";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import ContentChips from "components/Content/Display/ContentChips";
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import CommonDataService from "services/commonData.service";

const ContentsList=()=> {
    const { F_getHelper } = useMainContext();
    const { user:{role} } = F_getHelper();
    const { t } = useTranslation();
    const {item={},openItemHelper} = useSelector(_=>_.courseManage);
    const dispatch = useDispatch();

    const assignedContentsList = item?.assignedContents?.length>0 ? item?.assignedContents.map((c,index)=>(
                    <Grid container key={c._id} className='px-2 my-2 py-2' style={{backgroundColor:'rgba(255,255,255,0.45)', borderRadius:'8px'}}>
                        <Grid item xs={1} className="d-flex justify-content-center align-items-center">
                            <Checkbox checked={!!c?.isDone} size="small" style={{padding:'3px'}} name="check"
                                      onChange={()=>{
                                          dispatch(courseManageActions.doneItem({type:'CONTENT', isDone: !c?.isDone, chapterId: c._id, contentId: c._id, trainingModule: item?.trainingModule}));

                                          dispatch(courseManageActions.openItemHelper({type:'CHECK_CONTENT',
                                              payload: {contentIndex: index}}));
                                      }}
                            />
                        </Grid>
                        <Grid item xs={10} className="d-flex align-items-center" wrap='nowrap'>
                            <Typography variant="body2" component="span" className="text-left" style={{fontSize:"18px", color:`rgba(82, 57, 112, 1)`}}>
                                {`${openItemHelper.chapterIndex+1}.${index+1}. ${c?.title ||'-'}`}
                            </Typography>
                        </Grid>
                       <Grid item xs={1} className="d-flex justify-content-center align-items-center">
                            <IconButton style={{border:"1px solid #A85CFF"}}  variant="contained" size="small"
                                        onClick={() =>  {
                                            dispatch(courseManageActions.openItemHelper({type:'OPEN_CONTENT',
                                                payload: {contentIndex: index, contentId: c._id}}));
                                        }}>
                                <ChevronRightIcon style={{fill:theme.palette.primary.lightViolet,color:"red"}}/>
                            </IconButton>
                        </Grid>
                        <Grid item xs={12} className="pl-4">
                            <ContentChips content={c} event={{}} hidelabels={+true} elements={true}/>
                            {/*<Chip color="primary" className="mx-2" variant="outlined" size="small" label={<EmojiEventsOutlinedIcon style={{fontSize:'18px'}}/>} style={{backgroundColor:'rgba(255,255,255,0.6)',color:'rgba(73, 81, 81, 1)', borderColor:'rgba(73, 81, 81, 1)'}}/>*/}
                            {/*<Chip color="primary" className="mx-2" variant="outlined" size="small" label={<CreateOutlinedIcon style={{fontSize:'18px'}}/>} style={{backgroundColor:'rgba(255,255,255,0.6)',color:'rgba(73, 81, 81, 1)', borderColor:'rgba(73, 81, 81, 1)'}}/>*/}
                            {/*<Chip color="primary" className="mx-2" variant="outlined" size="small" label={<AutoFixHighOutlinedIcon style={{fontSize:'18px'}}/>} style={{backgroundColor:'rgba(255,255,255,0.6)',color:'rgba(73, 81, 81, 1)', borderColor:'rgba(73, 81, 81, 1)'}}/>*/}
                            {/*<Chip color="primary" className="mx-2" variant="outlined" size="small" label={<InsertDriveFileOutlinedIcon style={{fontSize:'18px'}}/>} style={{backgroundColor:'rgba(255,255,255,0.6)',color:'rgba(73, 81, 81, 1)', borderColor:'rgba(73, 81, 81, 1)'}}/>*/}
                        </Grid>
                    </Grid>
    ))
        :
        <Typography variant="body2" component="span" className="text-left ml-3" style={{fontSize:"14px", color:`rgba(82, 57, 112, 1)`}}>
            {t("No assigned contents")}
        </Typography>;

     return (
        <>
            {assignedContentsList}
        </>
     )
 }

export default ContentsList;