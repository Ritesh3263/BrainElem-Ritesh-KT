import React from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

// Context
import { useMainContext } from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";


// Styled components
import { ECard, EIconButton } from "styled_components";

// Other components
import ContentChips from "./ContentChips";
import ActionsBar from "./TopBarActions";

// Detect size of the screen
// import { useTheme } from '@mui/material/styles';
// import useMediaQuery from '@mui/material/useMediaQuery';

// Icons
import SvgIcon from "@mui/material/SvgIcon";
import { ReactComponent as BackIcon } from 'icons/icons_48/Arrow small L.svg';

// MUI v5
import { Grid, Typography, IconButton } from "@mui/material";
import { ThemeProvider } from "@mui/system";
import StyledButton from "new_styled_components/Button/Button.styled";

// MUI v4
import { new_theme } from "NewMuiTheme";
const palette = new_theme.palette

// function useIsWidthUp(breakpoint) {
//     const theme = useTheme();
//     return useMediaQuery(theme.breakpoints.up(breakpoint));
// }

export default function ContentTopBar({ title, subtitle, content, event, hideBackButton, hideTopBarActions, onBackButton, isStartingPage, currentPageNumber, isContentFactory, reloadEvent = () => { }, reloadContent = () => { }, isPreview }) {
    const { } = useMainContext();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <ThemeProvider theme={new_theme}>
            <div className="topbar">
                {/* ACTIONS BAR */}
                {!hideTopBarActions && <ActionsBar content={content} event={event} isPreview={isPreview}
                    reloadContent={reloadContent}
                    reloadEvent={reloadEvent}
                    isStartingPage={isStartingPage}
                    currentPageNumber={currentPageNumber}
                    isContentFactory={isContentFactory}
                ></ActionsBar>}
            </div>
            {/* <Grid container>
                <Grid item xs={12}>
                    <ECard sx={{ p: 2, borderRadius: "8px 8px 0px 0px " }}>
                        {((!hideBackButton && onBackButton) || (location.key)) &&
                            <EIconButton variant="contained" color="secondary" onClick={() => {
                                if (onBackButton) onBackButton()
                                else if (location.key) navigate(-1)
                            }}>
                                <SvgIcon viewBox={"15 15 18 18"} component={BackIcon} />
                            </EIconButton>
                        }
                        <Grid container alignItems='flex-end' sx={{ wordBreak: 'break-all', overflow: 'hidden' }}>
                             //MAIN TITLE 
                            <Grid item xs={12}>
                                <Typography sx={{ textAlign: "left", fontSize: "24px", color: palette.primary.lightViolet, ml: 1, width: "100%", overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} variant="h3" component="h3">
                                    {!title && !event?.name && !content?.title && t("Example of title")}
                                    {title ? title : (event?.name ? event.name : content?.title)}
                                </Typography>
                            </Grid>
                            // SUB-TITLE and CHIPS 
                            <Grid container item xs={12} sx={{ pl: 1, pt: 1, display: { xs: subtitle ? 'flex' : 'none', sm: 'flex' } }} alignItems='center'>
                                // SUB-TITLE 
                                <Grid item>
                                    {subtitle && <Typography sx={{ mr: 1, pt: 0, fontSize: '16px', whiteSpace: 'nowrap' }} variant="h5" component="h5">
                                        {(event?.name ? event.name : content?.title)}
                                    </Typography>}
                                </Grid>
                               //CHIPS 
                                <Grid item alignItems='center' sx={{ display: { xs: 'none', sm: 'flex' } }} flexWrap='wrap'>
                                    <ContentChips content={content} event={event} elements={true}></ContentChips>
                                </Grid>
                            </Grid>
                        </Grid>
                    </ECard>
                </Grid>
            </Grid> */}
        </ThemeProvider>
    )
}