import React, { lazy, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

// MUIv5
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import EDialog from "styled_components/Dialog";

import EVerticalProperty from "styled_components/VerticalProperty";

//Context
import { useMainContext } from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";

// MUI v4
import { theme } from "MuiTheme";

//Icons
import { ReactComponent as Grades } from 'icons/icons_32/Grade.svg';
import { ReactComponent as Comment } from 'icons/icons_32/Comment.svg';

// Component for dislaying simple dialog with results of single event
// result - result 
const ResultDialog = ({ result, ...props }) => {
    const { t } = useTranslation();

    const { F_getLocalTime } = useMainContext();



    return (
        <EDialog {...props} sx={{ '& .MuiDialog-paper': { background: theme.palette.glass.opaque } }}>
            <Grid container sx={{ p: '16px', width: {xs: 'unset', md: '400px'}, flexDirection: 'column', alignItems: 'flex-start' }}>
                <Typography sx={{ ...theme.typography.h5, fontSize: "24px", mb: 4, mt: 1 }}>{t("Preview of the results")}</Typography>

                <EVerticalProperty Icon={Grades} name={<Typography sx={{ ...theme.typography.p, fontSize: '18px' }}>{t("Grade")}</Typography>} value={result?.grade != undefined ? result.grade : '-'} description={<>{t("Grade")}</>} fontSize='16px'></EVerticalProperty>

                <hr style={{ marginTop: "8px", width: "100%" }} />

                <EVerticalProperty Icon={Comment} name={<Typography sx={{ ...theme.typography.p, fontSize: '18px' }}>{t("Comment")}</Typography>} value={""} description={<>{t("Comment left by the teacher")}</>} width='100%' fontSize='16px'></EVerticalProperty>
                <Typography sx={{ ...theme.typography.p, fontSize: '16px', mt: 1, paddingLeft: "36px", maxWidth: "300px" }}>{t(result?.comment ? result.comment : '-')}</Typography>

                <Grid item xs={12} sx={{ margin: "auto", mt: 2, color: theme.palette.primary.darkViolet }} >
                    <Typography sx={{ ...theme.typography.contextualItalic, justifyContent: "center" }} >
                        {t("Published on") + ": " + (result?.publishedAt ? F_getLocalTime(result?.publishedAt) : '-')}
                    </Typography>
                </Grid>

            </Grid>
        </EDialog>

    )
}

export default ResultDialog;