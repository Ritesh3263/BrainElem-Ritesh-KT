import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {makeStyles} from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import {Tooltip} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import Typography from "@material-ui/core/Typography";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import SettingsIcon from "@material-ui/icons/Settings";
import ContentsTable from "./ContentsTable";
import {useCurriculumContext} from "../../../../../../../../../_ContextProviders/CurriculumProvider/CurriculumProvider";
import AddContent from "./AddContent";

const useStyles = makeStyles(theme=>({}));

export default function ContentsList(){
    const classes = useStyles();
    const { t } = useTranslation();
    const [isOpenSidebarAddContent, setIsOpenSidebarAddContent] = useState(false);

    /** CurriculumContext ------------------------------------------**/
    const {
        currentChapter,
        setCurrentChapter,
        setIsOpenEditChapterForm,
        setEditFormHelper,
    } = useCurriculumContext();
    /**-------------------------------------------------------------**/

    return(
        <Paper elevation={10} className="p-3">
            <Grid container>
                <Grid item xs={12}>
                    <Grid container >
                        <Grid item xs={1} className="d-flex align-items-center justify-content-start">
                            <Tooltip title={t("Back to chapters list")}>
                                <IconButton style={{fill:'rgba(255, 255, 255, 0.9)', backgroundColor:'rgba(255, 255, 255, 0.9)'}} size="small"
                                            onClick={()=>{
                                                setIsOpenEditChapterForm({isOpen: false, chapterId: undefined});
                                                setEditFormHelper(p=>({...p,openType: 'GENERAL'}));
                                                setCurrentChapter({});
                                            }}
                                >
                                    <NavigateBeforeIcon style={{fill:'rgba(82, 57, 112, 1)'}}/>
                                </IconButton>
                            </Tooltip>
                        </Grid>
                        <Grid item xs={10} className="d-flex flex-column align-items-center justify-content-center" style={{backgroundColor: `rgba(255,255,255, 0.4)`}}>
                            <Typography variant="h5" component="h2" className="text-left" style={{color: `rgba(82, 57, 112, 1)`}}>
                                {currentChapter?.chapter?.name??"-"}
                            </Typography>
                        </Grid>
                        <Grid item xs={1} className="d-flex align-items-center justify-content-end">
                            {t("")}
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} className="mt-3">
                    <Button classes={{root: classes.root}} size="small" variant="contained" color="primary"
                            startIcon={<AddCircleOutlineIcon/>}
                            onClick={()=>{setIsOpenSidebarAddContent(true)}}
                    >{t("Add content")}</Button>
                </Grid>
                <Grid item xs={12} className="d-flex flex-column align-items-center justify-content-center">
                    <Typography variant="h6" component="h2" className="text-left" style={{color: `rgba(82, 57, 112, 1)`}}>
                        {t("Manage contents")}
                    </Typography>
                </Grid>
                <Grid item xs={12} className="mt-3">
                    <Grid container>
                        <Grid item xs={1} style={{borderRight:'1px solid rgba(255,255,255, 0.8)'}}>
                            {t("")}
                        </Grid>
                        <Grid item xs={1} className="pl-1" style={{borderRight:'1px solid rgba(255,255,255, 0.8)'}}>
                            {t("Id")}
                        </Grid>
                        <Grid item xs={1} className="pl-1" style={{borderRight:'1px solid rgba(255,255,255, 0.8)'}}>
                            {t("Type")}
                        </Grid>
                        <Grid item xs={5} className="pl-1" style={{borderRight:'1px solid rgba(255,255,255, 0.8)'}}>
                            {t("Name")}
                        </Grid>
                        <Grid item xs={2} className="pl-1" style={{borderRight:'1px solid rgba(255,255,255, 0.8)'}}>
                            {`${t("Time")} [h]`}
                        </Grid>
                        <Grid item xs={1} className="d-flex justify-content-center" style={{borderRight:'1px solid rgba(255,255,255, 0.8)'}}>
                            <RemoveCircleOutlineIcon/>
                        </Grid>
                        <Grid item xs={1} className="d-flex justify-content-center">
                            <SettingsIcon/>
                        </Grid>
                        <Grid item xs={12} className="mt-1 p-0">
                            <ContentsTable />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <AddContent isOpenSidebarAddContent={isOpenSidebarAddContent}
                        setIsOpenSidebarAddContent={setIsOpenSidebarAddContent}/>
        </Paper>
    )
}