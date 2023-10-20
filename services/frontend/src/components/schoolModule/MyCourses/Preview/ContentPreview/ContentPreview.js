import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import Grid from "@material-ui/core/Grid";
import { Card, CardContent, CardHeader } from "@material-ui/core";
import { theme } from "MuiTheme";
import Typography from "@material-ui/core/Typography";
import { courseManageActions } from "app/features/CourseManage/data";
import { useTranslation } from "react-i18next";
import { useStyles } from "../../MyCourseForm";
import DisplayContent from "components/Content/Display/DisplayContent";

import { useMainContext } from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";

const ContentPreview = (props) => {
    const { } = props;
    const { t } = useTranslation();
    const classes = useStyles();
    const { openItemHelper, itemDetails } = useSelector(_ => _.courseManage);
    const dispatch = useDispatch();

    const { F_getHelper } = useMainContext();
    const { userPermissions } = F_getHelper();

    // useEffect(()=>{
    //     if((openItemHelper.isOpenChapter && openItemHelper.contentId)){
    //         dispatch(courseManageActions.fetchContent(openItemHelper.contentId));
    //     }
    // },[openItemHelper.contentId]);


    return (
        <Grid container>
            <Grid item xs={12}>
                <Card classes={{ root: classes.card }} style={{ height: '100%', width: '100%' }}>
                    {!(openItemHelper.isOpenChapter && openItemHelper.contentId) && <CardHeader className='py-0 px-0 pt-3'
                        style={{ background: theme.palette.glass.medium, borderRadius: "8px 8px 0 0 " }}
                        title={(
                            <Grid container>
                                <Grid item xs={12} className='py-3'>
                                    <Typography variant="h5" component="h2" className="text-center" classes={{ root: classes.cardHeaderTypo }}>
                                        {t("Select, content from sidebar to open")}
                                    </Typography>
                                </Grid>


                            </Grid>
                        )} />}
                    <>
                        {(openItemHelper.isOpenChapter && openItemHelper.contentId) && (
                            <Grid container style={{ height: '100%', width: '100%' }} >
                                <Grid style={{ height: '100%', width: '100%' }} item>
                                    <DisplayContent
                                        isPreview={userPermissions.isTrainee ? false : true} contentId={openItemHelper.contentId} hideBackButton={true}
                                    />
                                </Grid>
                            </Grid>
                        )}
                    </>
                </Card>
            </Grid>
        </Grid>
    )
}

export default ContentPreview;