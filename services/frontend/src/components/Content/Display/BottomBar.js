import React, {useEffect, useRef} from "react";

import { useTranslation } from "react-i18next";

import LinearProgress from '@mui/material/LinearProgress';
import ELinearProgress from "new_styled_components/LinearProgress/LinearProgress.styled";
//Components
import { Box, Grid, IconButton } from '@mui/material';

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';


import { Typography } from '@mui/material';
import { useMainContext } from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";

import { EButton } from 'styled_components';

// import { theme } from "MuiTheme";
import { new_theme } from "NewMuiTheme";
import { ThemeProvider } from "@mui/material";

import ContentService from "services/content.service";
import {useLocation} from 'react-router-dom';



export default function BottomBar({ content, contentModel, classes, pagesCount, isEmpty, isFirstPage, isLastPage, setIsConfirmationPage, isCompletedPage, setUpdateStatus, setIsStartingPage }) {
    const { t } = useTranslation(['translation', 'braincoreTest']);
    const { F_getHelper, F_handleSetShowLoader } = useMainContext();
    const { userPermissions } = F_getHelper();
    const isBC = ContentService.isBraincoreTest(content?._id)
    const contentModelRef = useRef();
    const location = useLocation();
    
    contentModelRef.current = contentModel;
    const getLabel = (label) => {
        if (!isBC) return <></>
        else return <Typography component="h3" sx={{ fontFamily: 'Roboto', color: new_theme.palette.neutrals.darkestGrey, fontSize: '12px', mb: '8px', textAlign: "center" }}>
            {label}
        </Typography>
    }

    useEffect(() => {
        if(userPermissions.bcCoach.access && location.pathname[1] != "c"){
            if (setUpdateStatus) setUpdateStatus(true);
        }
      },[])
    
      const saveResults = () => {
        if(userPermissions.bcTrainer.access){
            contentModelRef.current.doComplete();
        }
        setIsConfirmationPage(true)
      }
    return (
        <ThemeProvider theme={new_theme}>
            <Grid container justifyContent={isCompletedPage ? 'flex-end' : "center"} sx={{ p: 2 }}>
                {/* BAR */}
                <Grid container justifyContent="center" alignItems="center" flexWrap="nowrap" height="5rem">
                    <Grid item sx={{ mr: 2, }}>
                        {!isEmpty && !isFirstPage && !isCompletedPage && contentModel.showPrevButton &&
                            <Grid container sx={{alignItems: 'center', flexDirection: 'column'}}>
                                {getLabel(t("braincoreTest:Previous"))}
                                <IconButton style={{ backgroundColor: 'white', borderRadius: '50%', border: `1px solid ${new_theme.palette.primary.PBorderColor}` }} color="secondary" onClick={() => contentModel.prevPage()}>
                                    <ChevronLeftIcon style={{ color: new_theme.palette.newSupplementary.NSupText, stroke: new_theme.palette.newSupplementary.NSupText }} />
                                </IconButton>
                            </Grid>
                        }
                    </Grid>
                    <Grid item sx={{marginTop: isBC ? '28px' : '-1.7rem'}}>
                        {!isBC && !isCompletedPage && pagesCount > 0 &&
                            <Typography variant="subtitle3" component="h3" sx={{ color: new_theme.palette.neutrals.darkestGrey, fontWeight: 'bold', mb: '8px', textAlign: "center" }}>
                                {t("Page")} {contentModel?.currentPageNo + 1} {t("of ")} {pagesCount}
                            </Typography>
                        }

                        {!isCompletedPage && (pagesCount > 0) &&
                            <ELinearProgress
                                className={isBC ? classes.newLinearProgress : undefined}
                                sx={{
                                     mb: '0px',
                                     borderRadius: "40px", height: "10px", width: '400px', maxWidth: 'calc(100vw - 190px)'
                                }}
                                variant="determinate" value={100 * ((contentModel?.currentPageNo + 1) / pagesCount)}
                            />}
                    </Grid>
                    <Grid item sx={{ ml: 2}}>
                        { !isEmpty && !(isLastPage || pagesCount == 1) && !isCompletedPage &&
                            <Grid container sx={{alignItems: 'center', flexDirection: 'column'}}>
                                {getLabel(t("braincoreTest:Next"))}
                                <IconButton style={{  backgroundColor: 'white', borderRadius: '50%', border: `1px solid ${new_theme.palette.primary.PBorderColor}` }} color="primary" onClick={() => contentModel.nextPage()}>
                                    <ChevronRightIcon style={{ color: new_theme.palette.newSupplementary.NSupText, stroke: new_theme.palette.newSupplementary.NSupText }} />
                                </IconButton>
                            </Grid>
                        }
                        {(isLastPage || pagesCount == 1) && <Grid container sx={{alignItems: 'center', flexDirection: 'column'}}>
                            {getLabel(t("braincoreTest:Previous"))}
                            {/* <IconButton style={{ backgroundColor: 'white', borderRadius: '50%', border: `1px solid ${new_theme.palette.primary.PBorderColor}` }} color="primary" onClick={() => {
                                setIsConfirmationPage(true)
                            }}> */}
                            <IconButton style={{ backgroundColor: 'white', borderRadius: '50%', border: `1px solid ${new_theme.palette.primary.PBorderColor}` }} color="primary" onClick={saveResults}>
                                <ChevronRightIcon style={{ color: new_theme.palette.newSupplementary.NSupText, stroke: new_theme.palette.newSupplementary.NSupText }} />
                            </IconButton>
                        </Grid>
                        }
                    </Grid>
                </Grid>
            </Grid>
        </ThemeProvider>
    );
}
