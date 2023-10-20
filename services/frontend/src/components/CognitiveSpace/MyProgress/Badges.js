import React, { useState, useEffect } from "react";

// MUI v5
import { Box, Container } from "@mui/material";
import Grid from "@mui/material/Grid";
import Typography from '@mui/material/Typography';
import { ReactComponent as IconSmiley } from "../../../img/cognitive_space/icon_smiley.svg";
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { styled } from '@mui/material/styles';
import { new_theme } from "NewMuiTheme";
import { ThemeProvider } from "@mui/system";
import { ArrowBackIos } from '@mui/icons-material';
import { Divider } from "@mui/material";
import "./MyProgress.scss"

const Performance = () => {
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
            {/* Badges */}
            <Grid item xs={12}>
                <div className="top_heading" style={{ display: 'flex', alignItems: 'center' }}>
                    <div className="arrow_icon">
                        <ArrowBackIos />
                    </div>
                    <div>
                        <Typography variant="h1" component="h1" sx={{ pb: 1 }}>{t("Badges")}</Typography>
                        <Divider className="heading_divider" />
                    </div>
                </div>
                <Grid container spacing={4} sx={{ mt: 2 }}>
                    <Grid item xs={12} md={6}>
                        <Box className="sk_item skills_item" sx={{ display: 'flex', alignItems: 'center', border: `1px solid ${new_theme.palette.secondary.SGrey}`, borderRadius: '10px', padding: '12px' }}>
                            <Box sx={{ height: '75px', width: '75px', borderRadius: '50%', backgroundColor: new_theme.palette.secondary.Turquoise, marginRight: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none', padding: '10px' }}>
                                <IconSmiley />
                            </Box>
                            <div>
                                <div className="sk_content">
                                    <Typography variant="body2" component="h6" sx={{ mb: 1 }}>{t("#BadgeName")}</Typography>
                                    <Typography variant="subtitle3" component="p" sx={{ mb: 1, fontWeight: '500' }}>{t("Very short description for one line maximum two lines ")}</Typography>
                                </div>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
                                    <BorderLinearProgress variant="determinate" value={50} sx={{ width: '95%', marginRight: '12px' }} />
                                    <Typography variant="body2" component="h6" sx={{ fontWeight: '500' }}>{t("30/30")}</Typography>
                                </Box>
                            </div>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Box className="sk_item skills_item" sx={{ display: 'flex', alignItems: 'center', border: `1px solid ${new_theme.palette.secondary.SGrey}`, borderRadius: '10px', padding: '12px' }}>
                            <Box sx={{ height: '75px', width: '75px', borderRadius: '50%', backgroundColor: new_theme.palette.secondary.Turquoise, marginRight: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none', padding: '10px' }}>
                                <IconSmiley />
                            </Box>
                            <div>
                                <div className="sk_content">
                                    <Typography variant="body2" component="h6" sx={{ mb: 1 }}>{t("#BadgeName")}</Typography>
                                    <Typography variant="subtitle3" component="p" sx={{ mb: 1, fontWeight: '500' }}>{t("Very short description for one line maximum two lines ")}</Typography>
                                </div>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
                                    <BorderLinearProgress variant="determinate" value={50} sx={{ width: '95%', marginRight: '12px' }} />
                                    <Typography variant="body2" component="h6" sx={{ fontWeight: '500' }}>{t("30/30")}</Typography>
                                </Box>
                            </div>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Box className="sk_item skills_item" sx={{ display: 'flex', alignItems: 'center', border: `1px solid ${new_theme.palette.secondary.SGrey}`, borderRadius: '10px', padding: '12px' }}>
                            <Box sx={{ height: '75px', width: '75px', borderRadius: '50%', backgroundColor: new_theme.palette.secondary.Turquoise, marginRight: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none', padding: '10px' }}>
                                <IconSmiley />
                            </Box>
                            <div>
                                <div className="sk_content">
                                    <Typography variant="body2" component="h6" sx={{ mb: 1 }}>{t("#BadgeName")}</Typography>
                                    <Typography variant="subtitle3" component="p" sx={{ mb: 1, fontWeight: '500' }}>{t("Very short description for one line maximum two lines ")}</Typography>
                                </div>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
                                    <BorderLinearProgress variant="determinate" value={50} sx={{ width: '95%', marginRight: '12px' }} />
                                    <Typography variant="body2" component="h6" sx={{ fontWeight: '500' }}>{t("30/30")}</Typography>
                                </Box>
                            </div>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Box className="sk_item skills_item" sx={{ display: 'flex', alignItems: 'center', border: `1px solid ${new_theme.palette.secondary.SGrey}`, borderRadius: '10px', padding: '12px' }}>
                            <Box sx={{ height: '75px', width: '75px', borderRadius: '50%', backgroundColor: new_theme.palette.secondary.Turquoise, marginRight: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none', padding: '10px' }}>
                                <IconSmiley />
                            </Box>
                            <div>
                                <div className="sk_content">
                                    <Typography variant="body2" component="h6" sx={{ mb: 1 }}>{t("#BadgeName")}</Typography>
                                    <Typography variant="subtitle3" component="p" sx={{ mb: 1, fontWeight: '500' }}>{t("Very short description for one line maximum two lines ")}</Typography>
                                </div>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
                                    <BorderLinearProgress variant="determinate" value={50} sx={{ width: '95%', marginRight: '12px' }} />
                                    <Typography variant="body2" component="h6" sx={{ fontWeight: '500' }}>{t("30/30")}</Typography>
                                </Box>
                            </div>
                        </Box>
                    </Grid>
                </Grid>
            </Grid>
        </ThemeProvider>
    );
};

export default Performance;