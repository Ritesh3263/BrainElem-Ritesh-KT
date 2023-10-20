import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

// MUI v5
import { Box, Container } from "@mui/material";
import Grid from "@mui/material/Grid";
import Typography from '@mui/material/Typography';
import { ReactComponent as IconStarSkills } from "../../../img/cognitive_space/icon_starskills.svg";
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { styled } from '@mui/material/styles';
import { new_theme } from "NewMuiTheme";
import { ThemeProvider } from "@mui/system";
import { ArrowBackIos } from '@mui/icons-material';
import { ArrowForwardIos } from "@mui/icons-material";
import { Divider } from "@mui/material";
import "./MyProgress.scss"


const Performance = () => {
    const { t } = useTranslation(['translation', 'tips', 'traits', 'profiles', 'issues', 'solutions', 'cognitiveSpace', 'cognitiveSpaceFAQ']);


    const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
        height: 10,
        borderRadius: 5,
        [`&.${linearProgressClasses.colorPrimary}`]: {
            backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
        },
        [`& .${linearProgressClasses.bar}`]: {
            borderRadius: 5,
            backgroundColor: theme.palette.mode === 'light' ? `${new_theme.palette.primary.MedPurple}` : `${new_theme.palette.primary.MedPurple}`,
        },
    }));

    return (
        <ThemeProvider theme={new_theme}>
            {/* Skills */}
            <Grid item xs={12}>
                <div className="top_heading" style={{ display: 'flex', alignItems: 'center' }}>
                    <div className="arrow_icon">
                        <ArrowBackIos />
                    </div>
                    <div>
                        <Typography variant="h1" component="h1" sx={{ pb: 1 }}>{t("Skills")}</Typography>
                        <Divider className="heading_divider" />
                    </div>
                </div>
                <Grid container spacing={4} sx={{ mt: 2 }}>
                    <Grid item xs={12} md={6}>
                        <Box className="sk_item skills_item" sx={{ border: `1px solid ${new_theme.palette.secondary.SGrey}`, borderRadius: '10px', padding: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <IconStarSkills style={{ marginRight: '8px', height: '30px' }} />
                                    <Typography variant="body2" component="h6" sx={{ mb: 0 }}>{t("#SkillName")}</Typography>
                                </div>
                                <Typography variant="body2" component="h6" sx={{ fontWeight: '500' }}>{t("Lavelname")}</Typography>
                            </div>
                            <div className="sk_content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div>
                                    <Typography variant="subtitle3" component="p" sx={{ fontWeight: '500', paddingRight: '12px' }}>{t("Very short description for one line maximum two lines ")}</Typography>
                                </div>
                                <div style={{ height: '35px', width: '35px', border: `1px solid ${new_theme.palette.primary.PBorderColor}`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
                                    <ArrowForwardIos style={{ height: '15px', cursor: 'pointer' }} />
                                </div>
                            </div>
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                <BorderLinearProgress variant="determinate" value={50} sx={{ width: '70%', marginRight: '12px' }} />
                                <Typography variant="body2" component="h6" sx={{ fontWeight: '500' }}>{t("30/30")}</Typography>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Box className="sk_item skills_item" sx={{ border: `1px solid ${new_theme.palette.secondary.SGrey}`, borderRadius: '10px', padding: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <IconStarSkills style={{ marginRight: '8px', height: '30px' }} />
                                    <Typography variant="body2" component="h6" sx={{ mb: 0 }}>{t("#SkillName")}</Typography>
                                </div>
                                <Typography variant="body2" component="h6" sx={{ fontWeight: '500' }}>{t("Lavelname")}</Typography>
                            </div>
                            <div className="sk_content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div>
                                    <Typography variant="subtitle3" component="p" sx={{ fontWeight: '500', paddingRight: '12px' }}>{t("Very short description for one line maximum two lines ")}</Typography>
                                </div>
                                <div style={{ height: '35px', width: '35px', border: `1px solid ${new_theme.palette.primary.PBorderColor}`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
                                    <ArrowForwardIos style={{ height: '15px', cursor: 'pointer' }} />
                                </div>
                            </div>
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                <BorderLinearProgress variant="determinate" value={50} sx={{ width: '70%', marginRight: '12px' }} />
                                <Typography variant="body2" component="h6" sx={{ fontWeight: '500' }}>{t("30/30")}</Typography>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Box className="sk_item skills_item" sx={{ border: `1px solid ${new_theme.palette.secondary.SGrey}`, borderRadius: '10px', padding: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <IconStarSkills style={{ marginRight: '8px', height: '30px' }} />
                                    <Typography variant="body2" component="h6" sx={{ mb: 0 }}>{t("#SkillName")}</Typography>
                                </div>
                                <Typography variant="body2" component="h6" sx={{ fontWeight: '500' }}>{t("Lavelname")}</Typography>
                            </div>
                            <div className="sk_content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div>
                                    <Typography variant="subtitle3" component="p" sx={{ fontWeight: '500', paddingRight: '12px' }}>{t("Very short description for one line maximum two lines ")}</Typography>
                                </div>
                                <div style={{ height: '35px', width: '35px', border: `1px solid ${new_theme.palette.primary.PBorderColor}`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
                                    <ArrowForwardIos style={{ height: '15px', cursor: 'pointer' }} />
                                </div>
                            </div>
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                <BorderLinearProgress variant="determinate" value={50} sx={{ width: '70%', marginRight: '12px' }} />
                                <Typography variant="body2" component="h6" sx={{ fontWeight: '500' }}>{t("30/30")}</Typography>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Box className="sk_item skills_item" sx={{ border: `1px solid ${new_theme.palette.secondary.SGrey}`, borderRadius: '10px', padding: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <IconStarSkills style={{ marginRight: '8px', height: '30px' }} />
                                    <Typography variant="body2" component="h6" sx={{ mb: 0 }}>{t("#SkillName")}</Typography>
                                </div>
                                <Typography variant="body2" component="h6" sx={{ fontWeight: '500' }}>{t("Lavelname")}</Typography>
                            </div>
                            <div className="sk_content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div>
                                    <Typography variant="subtitle3" component="p" sx={{ fontWeight: '500', paddingRight: '12px' }}>{t("Very short description for one line maximum two lines ")}</Typography>
                                </div>
                                <div style={{ height: '35px', width: '35px', border: `1px solid ${new_theme.palette.primary.PBorderColor}`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
                                    <ArrowForwardIos style={{ height: '15px', cursor: 'pointer' }} />
                                </div>
                            </div>
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                <BorderLinearProgress variant="determinate" value={50} sx={{ width: '70%', marginRight: '12px' }} />
                                <Typography variant="body2" component="h6" sx={{ fontWeight: '500' }}>{t("30/30")}</Typography>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Grid>
        </ThemeProvider>
    );
};

export default Performance;