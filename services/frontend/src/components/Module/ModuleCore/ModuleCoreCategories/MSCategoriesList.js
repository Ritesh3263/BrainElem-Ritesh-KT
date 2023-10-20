import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import moduleCoreService from "services/module-core.service"
import Button from '@material-ui/core/Button';
import { makeStyles} from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import CategoriesTable from "./CategoriesTable";
import {useTranslation} from "react-i18next";
import {ETabBar, ETab, EButton} from "new_styled_components";
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import { new_theme } from "NewMuiTheme";
import { ThemeProvider } from "@mui/material";
import StyledButton from "new_styled_components/Button/Button.styled";
import { Typography } from "@mui/material";
import { Divider } from "@mui/material";
import Container from '@mui/material/Container';
import "./catagories.scss";
const useStyles = makeStyles(theme=>({}))

export default function MSCategoriesList(){
    const { t } = useTranslation();
    const classes = useStyles();
    const navigate = useNavigate();
    const [currentModuleId, setCurrentModuleId] = useState("");
    const [currentTab, setCurrentTab] = useState(1);
    const [MSCategories, setMSCategories] = useState([]);
    // setCurrentRoute
    const {setMyCurrentRoute, F_showToastMessage, F_getHelper, F_handleSetShowLoader} = useMainContext();
    const {manageScopeIds} = F_getHelper();

    useEffect(()=>{
        F_handleSetShowLoader(true)
        setCurrentTab(1);
        setCurrentModuleId(manageScopeIds.moduleId)
        moduleCoreService.readModuleCore(manageScopeIds.moduleId).then(res=>{
            if(res.data.categories){
                setMSCategories(res.data.categories)
                F_handleSetShowLoader(false)
            }
        }).catch(error=>console.error(error))
        setMyCurrentRoute("Category")
    },[])
    return(
            <ThemeProvider theme={new_theme}>
                <Container maxWidth="xl" className="mainContainerDiv mainCategoryDiv">
                    <Grid item xs={12} >
                        <div className="admin_content">
                            <div className="admin_heading">

                                <Grid>
                                    <Typography variant="h1" component="h1" >{t("Catagories")}</Typography>
                                    <Divider variant="insert" className='heading_divider' />
                                </Grid>

                                <div className="heading_buttons">
                                    <StyledButton eVariant="primary" eSize="large" 
                                            onClick={()=>{navigate("/modules-core/subjects-categories/new")}}
                                    >{t("Add category")}
                                    </StyledButton>
                                </div>
                            </div>
                            <div className="content_tabing">
                                <ETabBar
                                    style={{ minWidth: "280px" }}
                                    value={currentTab}
                                    textColor="primary"
                                    variant="fullWidth"
                                    // onChange={(e, i) => {
                                    //     switchTabHandler(i);
                                    // }}
                                    aria-label="tabs example"
                                    eSize="small"
                                    className="tab_style"
                                >
                                    <ETab
                                        label={t("Subjects")}
                                        eSize="small"
                                        classes="tab_style"
                                        onClick={()=>{navigate("/modules-core/subjects")}}
                                    />
                                    <ETab
                                        label={t("Catagories")}
                                        eSize="small"
                                        classes="tab_style"
                                    />
                                    
                                </ETabBar>
                            </div>
                            <div className="tabing_table">
                                {/* <UsersTable
                                    MSUsers={MSUsers}
                                    editFormHelper={editFormHelper}
                                    setEditFormHelper={setEditFormHelper}
                                />
                                <div className={editFormHelper.isOpen ? 'showUserList' : 'hideUserList'}>
                                    {editFormHelper.isOpen && editFormHelper.openType !== "IMPORT" && (
                                        <NewUserForm
                                            editFormHelper={editFormHelper}
                                            setEditFormHelper={setEditFormHelper}
                                        />
                                    )}
                                    <ModuleList
                                        open={openModuleList}
                                        setOpen={setOpenModuleList}
                                        user={user}
                                    /> */}
                                <Grid  item xs={12}>
                
                                    {/* <div className="d-flex pt-2 px-2 mb-3 justify-content-between">
                                        <EButton eSize="small"  eVariant='primary'
                                                onClick={()=>{navigate("/modules-core/subjects-categories/new")}}
                                        >{t("Add category")}</EButton>
                                    </div> */}
                                    <CategoriesTable MSCategories={MSCategories}/>
                        
                                </Grid>
                                
                            </div>
                        </div>
                    </Grid>
                    {/* <Grid item xs={12} className={editFormHelper.isOpen ? 'showUserList' : 'hideUserList'}>
                        <div>
                            {editFormHelper.isOpen && editFormHelper.openType !== "IMPORT" && (
                                <NewUserForm
                                    editFormHelper={editFormHelper}
                                    setEditFormHelper={setEditFormHelper}
                                />
                            )}
                            <ModuleList
                                open={openModuleList}
                                setOpen={setOpenModuleList}
                                user={user}
                            />
                        </div>
                    </Grid> */}

                </Container>
            </ThemeProvider>

            // <Grid container spacing={1}>
            //     <Grid item xs={12} className="d-flex justify-content-center mt-2">
            //         <div style={{width: "500px"}} >
            //             <ETabBar
            //                 value={currentTab}
            //                 textColor="primary"
            //                 variant="fullWidth"
            //                 onChange={(e,i)=>setCurrentTab(i)}
            //                 aria-label="tabs example"
            //                 eSize='small'
            //             >
            //                 <ETab label={t("Subjects")} eSize='small' onClick={()=>{navigate("/modules-core/subjects")}}/>
            //                 <ETab label={t("Categories")} eSize='small' />
            //             </ETabBar>
            //         </div>
            //     </Grid>
            //     {/*<Grid item xs={12}>*/}
            //     {/*    <Paper elevation={10} className="p-2">*/}
            //     {/*        <Button classes={{root: classes.root}} size="large" variant="contained" color="primary"*/}
            //     {/*                startIcon={<AddCircleOutlineIcon/>}*/}
            //     {/*                onClick={()=>{navigate("/modules-core/subjects-categories/new")}}*/}
            //     {/*        >{t("Add subject category")}</Button>*/}
            //     {/*    </Paper>*/}
            //     {/*</Grid>*/}
            //     <Grid item xs={12}>
                   
            //             <div className="d-flex pt-2 px-2 mb-3 justify-content-between">
            //                 <EButton eSize="small"  eVariant='primary'
            //                         onClick={()=>{navigate("/modules-core/subjects-categories/new")}}
            //                 >{t("Add category")}</EButton>
            //             </div>
            //            <CategoriesTable MSCategories={MSCategories}/>
                    
            //     </Grid>
            // </Grid>
    )
}