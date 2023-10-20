import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {makeStyles} from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import {Tooltip} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import Typography from "@mui/material/Typography";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import SettingsIcon from "@material-ui/icons/Settings";
import {useCourseContext} from "../../../../_ContextProviders/CourseProvider/CourseProvider";
import ContentsTable from "./ContentsTable";
import AddContent from "./AddContent";
import { new_theme } from "NewMuiTheme";
import { Divider } from "@mui/material";
import { ThemeProvider } from "@mui/material";
import StyledButton from "new_styled_components/Button/Button.styled";


export default function ContentsList(){
    const { t } = useTranslation();
    const [isOpenSidebarAddContent, setIsOpenSidebarAddContent] = useState(false);

    /** CourseContext ------------------------------------------**/
    const {
        currentChapter,

        setCurrentChapter,
        setIsOpenEditChapterForm,
        setEditFormHelper,
    } = useCourseContext();
    /**-------------------------------------------------------------**/

    return(
        <ThemeProvider theme={new_theme}>
        <Paper elevation={10} sx={{boxShadow:'none'}}>
            <Grid container>
                <Grid item xs={12}>
                    <Grid container >
                        {/* <Grid item xs={1} className="d-flex align-items-center justify-content-start">
                            
                        </Grid> */}
                        <Grid item xs={10} className="d-flex align-items-center justify-content-start" style={{backgroundColor: new_theme.palette.shades.white40}}>
                            <Tooltip title={t("Back to chapters list")}>
                                <IconButton style={{backgroundColor:new_theme.palette.newSupplementary.SupCloudy, marginRight:'20px'}} size="medium"
                                            onClick={()=>{
                                                setIsOpenEditChapterForm({isOpen: false, chapterId: undefined});
                                                setEditFormHelper(p=>({...p,openType: 'GENERAL'}));
                                                setCurrentChapter({});
                                            }}
                                >
                                    <NavigateBeforeIcon style={{fill:new_theme.palette.newSupplementary.NSupText}}/>
                                </IconButton>
                            </Tooltip>
                            <Grid>
                                <Typography variant="h2" component="h2" style={{alignSelf:'flex-start', color:new_theme.palette.newSupplementary.NSupText}}>
                                    {currentChapter?.chapter?.name??"-"}
                                </Typography>
                                
                            </Grid>
                        </Grid>
                        <Grid item xs={1} className="d-flex align-items-center justify-content-end">
                            {t("")}
                        </Grid>
                    </Grid>
                    <Divider sx={{ mb: 4, my: 2 }} variant="insert"/>
                </Grid>
                <Grid item xs={12} className="mt-3 text-right" >
                    <StyledButton eSize="small" eVariant="primary"
                            startIcon={<AddCircleOutlineIcon/>}
                            onClick={()=>{setIsOpenSidebarAddContent(true)}}
                    >{t("Add content")}</StyledButton>
                </Grid>
                {/* <Grid item xs={12} className="d-flex flex-column align-items-center justify-content-center">
                    <Typography variant="h6" component="h2" className="text-left" style={{color: new_theme.palette.secondary.DarkPurple}}>
                        {t("Manage contents")}
                    </Typography>
                </Grid> */}
                <Grid item xs={12} className="mt-3">
                    <Grid container>
                        {/* <Grid item xs={1} style={{borderRight: `1px solid ${new_theme.palette.shades.white80}`}}>
                            {t("")}
                        </Grid>
                        <Grid item xs={1} className="pl-1" style={{borderRight:`1px solid ${new_theme.palette.shades.white80}`}}>
                            {t("Id")}
                        </Grid>
                        <Grid item xs={1} className="pl-1" style={{borderRight:`1px solid ${new_theme.palette.shades.white80}`}}>
                            {t("Type")}
                        </Grid>
                        <Grid item xs={5} className="pl-1" style={{borderRight:`1px solid ${new_theme.palette.shades.white80}`}}>
                            {t("Name")}
                        </Grid>
                        <Grid item xs={2} className="pl-1" style={{borderRight:`1px solid ${new_theme.palette.shades.white80}`}}>
                            {`${t("Time")} [h]`}
                        </Grid>
                        <Grid item xs={1} className="d-flex justify-content-center" style={{borderRight: `1px solid ${new_theme.palette.shades.white80}`}}>
                            <RemoveCircleOutlineIcon/>
                        </Grid>
                        <Grid item xs={1} className="d-flex justify-content-center">
                            <SettingsIcon/>
                        </Grid> */}
                        <Grid item xs={12} className="mt-1 p-0">
                            <ContentsTable />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <AddContent isOpenSidebarAddContent={isOpenSidebarAddContent}
                        setIsOpenSidebarAddContent={setIsOpenSidebarAddContent}/>
        </Paper>
        </ThemeProvider>
    )
}