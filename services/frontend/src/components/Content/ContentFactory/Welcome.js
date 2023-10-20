import React, {lazy, useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

// Services
import ContentService from "services/content.service";

// Contexts
import { useMainContext } from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";

// MUI v4
import { theme } from "MuiTheme";

// MUI v5
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// Styled components
import ContentImageList from "components/Item/ImageList"
import { ECard } from "styled_components";
import EIconButton from "styled_components/EIconButton";
import ESvgIcon from "styled_components/SvgIcon";

// Icons
import { ReactComponent as ImportIcon } from 'icons/icons_32/Upload_32.svg';
import { ReactComponent as AddIcon } from 'icons/icons_32/Add2_32.svg';
import { ReactComponent as Lesson } from "icons/icons_32/Lesson.svg";
import { ReactComponent as Exam } from "icons/icons_32/Exam.svg";
import { ReactComponent as Asset } from "icons/icons_32/Asset.svg";


import { ReactComponent as HomeIcon } from 'icons/icons_32/Home_32.svg';
import { ReactComponent as CloseIcon } from 'icons/icons_32/Close_32.svg';

//Redux
import {useDispatch, useSelector} from "react-redux";
import { add, setType, setActiveIndex } from "app/features/ContentFactory/data"


// 
const CreateContent = lazy(() => import("components/Content/ContentFactory/CreateContent"));

export default function Welcome() {
    const navigate = useNavigate();

    // Load state from Redux store
    const {activeIndex, contents} = useSelector(s=>s.contentFactory);
    
    const dispatch = useDispatch();

    // Properties passed in program preview
    const params = new URLSearchParams(window.location.search)
    const { contentId } = useParams();


    const [fileContentType, setFileContentType] = useState(null)
    const [recentContents, setRecentContents] = useState([])

    // setCurrentRoute
    const { setMyCurrentRoute, F_getErrorMessage, F_showToastMessage, F_handleSetShowLoader, F_gotoDefaultView, F_getHelper } = useMainContext();
    const { user } = F_getHelper()
    const { t, i18n, translationsLoaded } = useTranslation();
    const inputFile = useRef(null)

    const containerRef = useRef(null);

    // Show onboarding message
    var onbarding = localStorage.getItem('onbarding')
    onbarding = onbarding ? JSON.parse(onbarding) : {}
    const [showOnboardingMessage, setShowOnboardingMessage] = useState(!onbarding?.CF_1?.isCompleted)

    // Load most recent contents
    const loadRecentContents = () => {
        F_handleSetShowLoader(true)
        ContentService.getContents(null, 'owned-recent').then(response => {
            setRecentContents(response.data.slice(0, 8))
            setTimeout(()=>F_handleSetShowLoader(false), 500)
        })
    }

    const uploadFile = (contentType) => {
        setFileContentType(contentType)
        inputFile.current.click();
    }

    const onUploadFile = () => {
        F_handleSetShowLoader(true)
        var formData = new FormData();
        formData.append("file", inputFile.current.files[0])
        ContentService.uploadFile(formData).then(
            (response) => {
                let file = response.data;

                dispatch(add({ contentType: fileContentType, externalFile: file}));
            },
            (error) => {
                F_handleSetShowLoader(false)
                F_showToastMessage(t("Could not uplad this file"), "error");
            }
        )

    }

    useEffect(() => {
        if (containerRef?.current && activeIndex==0){
            loadRecentContents()
            containerRef?.current?.scroll(0,0)
        }
    }, [containerRef?.current, activeIndex]);




    useEffect(() => {
        // Welcome page and content `id` already exists - starting editing some content
        console.log('home tab', activeIndex, contentId)

        if (activeIndex>0){//Opeing some tab
            // Old tab with content with 'id` - old tab for editing some content
            if (contents[activeIndex-1]._id){
                navigate(`/edit-` + contents[activeIndex-1].contentType.toLowerCase() + "/" + contents[activeIndex-1]._id)
            }
            // Old tab with new cotnent without _id
            else navigate(`/create-content`, {replace: true})
        }
    }, [activeIndex]);

    useEffect(() => {
        setMyCurrentRoute("Content Factory");
    }, []);

    useEffect(() => {
        if (contentId){
            let index = contents.findIndex(c=>c._id==contentId)
            if (index>=0) dispatch(setActiveIndex(index+1))
            else {
                loadContentIntoNewTab()
            }
        }
    }, [contentId]);

    const loadContentIntoNewTab = () => {
        ContentService.getContent(contentId).then(
            (response) => {
                console.log(user.id, response.data)
                if (response.data.canEdit){
                    dispatch(add(response.data))
                }else if (ContentService.isOwnerOrCocreator(user.id, response.data)){
                    // In case user is the creator but is not authorized to edit
                    // it means that the content has been already approved and can't be modified
                    // New version of the content will be created
                    F_showToastMessage(t("This content has been already approved. You are creating a new version which will have to be approved again."))
                    let oldVersion = response.data
                    let newVersionNumber = (oldVersion.version??1)+1
                    let newVersion = {...response.data, _id: undefined, origin: oldVersion._id, version: newVersionNumber}

                    dispatch(add(newVersion))
                }else{
                    F_showToastMessage(t("You are not allowed to edit this content."), 'error')
                    F_gotoDefaultView()
                }

            },
            (error) => {
                let errorMessage = F_getErrorMessage(error)
                F_showToastMessage(errorMessage, 'error')
            }
        )
    }

    const getBlock = (name, description, Icon, onOpen, onImport, disabled=false) => {

        return <Grid item style={{ width: "372px", padding: '16px', cursor: 'pointer' }} onClick={(e)=>{onOpen()}} >
            <ECard sx={{ p: '16px', opacity: (disabled ? '0.4' : '1') }}>
                <Grid container item xs={12}>
                    <Grid container item xs={3} md={2} sx={{alignItems: "center"}} >
                        <Icon sx={{ width: "50px", height: "50px" }} component={Icon}></Icon>
                    </Grid>
                    <Grid item xs={6} md={9} container sx={{px: '16px', overflow: 'hidden', flexDirection: 'column', alignItems: "flex-start", justifyContent: 'center'}}>
                        <Typography sx={{ ...theme.typography.h6, textAlign: "start", color: theme.palette.primary.lightViolet, fontSize: "21px" }}>
                            {name}
                        </Typography>
                        <Typography sx={{ ...theme.typography.p14, textAlign: "start", fontSize: "14px" }}>
                            {description}
                        </Typography>
                    </Grid>
                    <Grid container item xs={3} md={1} sx={{ justifyContent: 'end' }} >
                        <Box sx={{ display: 'inline-grid' }}>
                            <EIconButton
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onOpen()}}
                                size="medium" variant="contained" color="primary">
                                <ESvgIcon color={'white'} viewBox="0 0 32 32" component={AddIcon} />
                            </EIconButton>
                            <EIconButton size="medium" sx={{ mt: 1 }}
                                onClick={(e) => {e.stopPropagation();  onImport()}}
                                variant="contained" color="secondary">
                                <ESvgIcon viewBox="-4 -4 40 40" component={ImportIcon} />
                            </EIconButton>
                        </Box>
                    </Grid>
                </Grid>
            </ECard>
        </Grid>

    }

    const getOnboardingBlock = (description, image) => {

        return <Grid item sx={{ width: {xs:"372px", md:"744px", lg: "372px"}, padding: '16px' }} >
            <ECard sx={{ p:1 , background: theme.palette.popups.onboarding}}>
                <Grid container item xs={12} sx={{alignItems: 'stretch'}}>
                    <Grid container item sx={{width: '40px', alignItems: "center"}} >
                        <img src={image} alt="onboarding" />
                    </Grid>
                    <Grid item container sx={{width: 'calc(100% - 60px)', alignItems: "center", px: '16px', overflow: 'hidden'}}>
                        <Typography sx={{ ...theme.typography.p14, textAlign: "start", fontSize: "14px" }}>
                            {description}
                        </Typography>
                    </Grid>
                    <Grid container item sx={{width: '20px'}}>
                            <ESvgIcon viewBox="0 0 32 32" component={CloseIcon} onClick={()=>{
                                setShowOnboardingMessage(false)
                                let current = localStorage.getItem('onbarding')
                                current = current ? JSON.parse(current) : {}
                                current.CF_1={isCompleted: true}
                                localStorage.setItem('onbarding', JSON.stringify(current));
                            }}sx={{cursor: 'pointer'}}/>
                    </Grid>
                </Grid>
            </ECard>
        </Grid>

    }


    return (<>
        {(activeIndex > 0 && (contents[activeIndex-1]?.contentType || contents[activeIndex-1]?._id)) ?
            <CreateContent contentType={contents[activeIndex-1]?.contentType}/>
        :
        <div style={{overflowY: 'auto'}} ref={containerRef}>
            <input style={{ display: 'None' }} type='file' id='file' onChange={onUploadFile} ref={inputFile} />
            <Grid container sx={{justifyContent: 'center', padding: {xs: '0px', md: '16px'}}} >
                 {showOnboardingMessage && getOnboardingBlock(
                    t("Create new lessons and tests. To upload already exisiting content from SCORM, Powerpoint etc click on import icon."), 
                    "/img/icons/Lighbulb.svg", 
                )}
                {getBlock(
                    t("Lesson"), 
                    t("Lesson and presentation"), 
                    Lesson, 
                    () => {
                        if (activeIndex > 0) dispatch(setType("PRESENTATION"));
                        else dispatch(add({ contentType: "PRESENTATION"}));
                    },
                    ()=> uploadFile('PRESENTATION')
                )}
                {getBlock(
                    t("Test"), 
                    t("Quiz, Exam, Survey"), 
                    Exam, 
                    () =>{
                        if (activeIndex > 0) dispatch(setType("TEST"));
                        else dispatch(add({ contentType: "TEST"}));
                    },
                    ()=> uploadFile('TEST')
                )}
                {getBlock(
                    t("Asset"), 
                    t("Smart Object sharable across all documents"), 
                    Asset, 
                    () => {
                        if (activeIndex > 0) dispatch(setType("ASSET"));
                        else dispatch(add({ contentType: "ASSET"}));
                    },
                    
                    ()=> uploadFile('ASSET'),
                    false
                )}
                <Grid item xs={12} sx={{px: {xs: '8px', sm: 0}}}>
                    <Box sx={{ my: '16px', width: '100%', height: '1px',
                      background: theme.palette.glass.light,
                    justifyContent: 'center'}}></Box>
                </Grid>
                {activeIndex===0 && recentContents.length > 0 &&
                    <>
                        <Grid item xs={12} sx={{px: {xs: '8px', sm: 0}}}>
                            <Typography sx={{...theme.typography.p, pb: '16px', fontSize: '16px'}}>
                                {t("Recent materials")}
                            </Typography>
                        </Grid>

                        <ContentImageList elements={recentContents} deleteElementCallback={loadRecentContents} editElementCallback={loadRecentContents}></ContentImageList>
                    </>}
            </Grid>
        </div>}
        </>
    );
};
