import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

// MUI v5
import { Box, Container } from "@mui/material";
import Grid from "@mui/material/Grid";
import Typography from '@mui/material/Typography';
import StyledButton from "new_styled_components/Button/Button.styled";
import MissionImg from "../../../img/cognitive_space/mission_img.svg";
import TestNameImg from "../../../img/cognitive_space/test_name_thumbnail.png";
import BlueBoredImg from "../../../img/cognitive_space/Blue_LVL3_Bored.svg";

import { ReactComponent as IconStarSkills } from "../../../img/cognitive_space/icon_starskills.svg";
import { new_theme } from "NewMuiTheme";
import { ThemeProvider } from "@mui/system";
import { ArrowBackIos } from '@mui/icons-material';
import { Divider } from "@mui/material";
import "./MyProgress.scss"

const Performance = ({ setCurrentTab }) => {
    const { t } = useTranslation(['translation', 'tips', 'traits', 'profiles', 'issues', 'solutions', 'cognitiveSpace', 'cognitiveSpaceFAQ']);

    return (
        <ThemeProvider theme={new_theme}>
            {/* My Progress*/}
            <Grid item xs={12}>
                <div className="top_heading" style={{ display: 'flex', alignItems: 'center' }}>
                    <div className="arrow_icon">
                        <ArrowBackIos />
                    </div>
                    <div>
                        <Typography variant="h1" component="h1" sx={{ pb: 1 }}>{t("My progress")}</Typography>
                        <Divider className="heading_divider" />
                    </div>
                </div>
                <Box sx={{ mt: 4, display: 'flex', alignItems: 'center', backgroundColor: new_theme.palette.newSupplementary.SupCloudy, padding: '26px 20px', borderRadius: '10px', mb: 4, flexDirection: { xs: 'column', md: 'row' } }}>
                    <img src={MissionImg} className="mb_img" />
                    <div className="mission_skills">
                        <Typography variant="result_title" component="h2" sx={{ mb: 2, textAlign: 'left', color: new_theme.palette.newSupplementary.NSupText, mb: 2 }}>{t("Mission")} : {t("Earn Skill")}</Typography>
                        <Typography variant="h3" component="p" sx={{ fontWeight: '500', color: new_theme.palette.newSupplementary.NSupText, textAlign: 'left' }}>{t("Take our test and earn a badge! Demonstrate your knowledge and skills by completing our test, and receive a badge to showcase your achievement.")}</Typography>
                    </div>
                </Box>

                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={6} lg={4}>
                        <div className="sk_item skills_item" style={{ border: `1px solid ${new_theme.palette.primary.PBorderColor}`, borderRadius: '8px', padding: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <div style={{ flex: 'none', height: '64px', width: '64px', marginRight: '10px', backgroundColor: new_theme.palette.primary.MedPurple, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <IconStarSkills className="w_white" style={{ color: new_theme.palette.primary.PWhite, height: '35px' }} />
                                </div>
                                <div style={{}}>
                                    <Typography variant="body2" component="h6" sx={{ mb: 0 }}>{t("#SkillName")}</Typography>
                                    <Typography variant="subtitle3" component="p" sx={{ fontWeight: '500' }}>{t("Very short description for one line maximum two lines ")}</Typography>
                                </div>
                            </div>
                        </div>
                    </Grid>
                    <Grid item xs={12} sm={6} md={6} lg={4}>
                        <div className="sk_item skills_item" style={{ border: `1px solid ${new_theme.palette.primary.PBorderColor}`, borderRadius: '8px', padding: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <div style={{ flex: 'none', height: '64px', width: '64px', marginRight: '10px', backgroundColor: new_theme.palette.primary.MedPurple, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <IconStarSkills className="w_white" style={{ color: new_theme.palette.primary.PWhite, height: '35px' }} />
                                </div>
                                <div style={{}}>
                                    <Typography variant="body2" component="h6" sx={{ mb: 0 }}>{t("#SkillName")}</Typography>
                                    <Typography variant="subtitle3" component="p" sx={{ fontWeight: '500' }}>{t("Very short description for one line maximum two lines ")}</Typography>
                                </div>
                            </div>
                        </div>
                    </Grid>
                    <Grid item xs={12} sm={6} md={6} lg={4}>
                        <div className="sk_item skills_item" style={{ border: `1px solid ${new_theme.palette.primary.PBorderColor}`, borderRadius: '8px', padding: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <div style={{ flex: 'none', height: '64px', width: '64px', marginRight: '10px', backgroundColor: new_theme.palette.primary.MedPurple, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <IconStarSkills className="w_white" style={{ color: new_theme.palette.primary.PWhite, height: '35px' }} />
                                </div>
                                <div style={{}}>
                                    <Typography variant="body2" component="h6" sx={{ mb: 0 }}>{t("#SkillName")}</Typography>
                                    <Typography variant="subtitle3" component="p" sx={{ fontWeight: '500' }}>{t("Very short description for one line maximum two lines ")}</Typography>
                                </div>
                            </div>
                        </div>
                    </Grid>
                    <Grid item xs={12} sm={6} md={6} lg={4}>
                        <div className="sk_item skills_item" style={{ border: `1px solid ${new_theme.palette.primary.PBorderColor}`, borderRadius: '8px', padding: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <div style={{ flex: 'none', height: '64px', width: '64px', marginRight: '10px', backgroundColor: new_theme.palette.primary.MedPurple, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <IconStarSkills className="w_white" style={{ color: new_theme.palette.primary.PWhite, height: '35px' }} />
                                </div>
                                <div style={{}}>
                                    <Typography variant="body2" component="h6" sx={{ mb: 0 }}>{t("#SkillName")}</Typography>
                                    <Typography variant="subtitle3" component="p" sx={{ fontWeight: '500' }}>{t("Very short description for one line maximum two lines ")}</Typography>
                                </div>
                            </div>
                        </div>
                    </Grid>
                    <Grid item xs={12} sm={6} md={6} lg={4}>
                        <div className="sk_item skills_item" style={{ border: `1px solid ${new_theme.palette.primary.PBorderColor}`, borderRadius: '8px', padding: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <div style={{ flex: 'none', height: '64px', width: '64px', marginRight: '10px', backgroundColor: new_theme.palette.primary.MedPurple, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <IconStarSkills className="w_white" style={{ color: new_theme.palette.primary.PWhite, height: '35px' }} />
                                </div>
                                <div style={{}}>
                                    <Typography variant="body2" component="h6" sx={{ mb: 0 }}>{t("#SkillName")}</Typography>
                                    <Typography variant="subtitle3" component="p" sx={{ fontWeight: '500' }}>{t("Very short description for one line maximum two lines ")}</Typography>
                                </div>
                            </div>
                        </div>
                    </Grid>
                    <Grid item xs={12} sm={6} md={6} lg={4}>
                        <div className="sk_item skills_item" style={{ border: `1px solid ${new_theme.palette.primary.PBorderColor}`, borderRadius: '8px', padding: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <div style={{ flex: 'none', height: '64px', width: '64px', marginRight: '10px', backgroundColor: new_theme.palette.primary.MedPurple, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <IconStarSkills className="w_white" style={{ color: new_theme.palette.primary.PWhite, height: '35px' }} />
                                </div>
                                <div style={{}}>
                                    <Typography variant="body2" component="h6" sx={{ mb: 0 }}>{t("#SkillName")}</Typography>
                                    <Typography variant="subtitle3" component="p" sx={{ fontWeight: '500' }}>{t("Very short description for one line maximum two lines ")}</Typography>
                                </div>
                            </div>
                        </div>
                    </Grid>
                </Grid>
            </Grid>

            {/* Test Name */}
            <Grid item xs={12}>
                <div className="top_heading" style={{ display: 'flex', alignItems: 'center' }}>
                    <div className="arrow_icon">
                        <ArrowBackIos />
                    </div>
                    <div>
                        <Typography variant="h1" component="h1" sx={{ pb: 1 }}>{t("Test_name")}</Typography>
                        <Divider className="heading_divider" />
                    </div>
                </div>
                <Box sx={{ flexDirection: { xs: 'column', md: 'row' }, mt: 4, display: 'flex', alignItems: 'center', backgroundColor: new_theme.palette.newSupplementary.SupCloudy, padding: '26px 35px', borderRadius: '10px', mb: 4 }}>
                    <div className="content" style={{ paddingRight: '15px' }}>
                        <Typography variant="result_title" component="h2" sx={{ mb: 2, textAlign: 'left', color: new_theme.palette.newSupplementary.NSupText, mb: 2 }}>{t("Mission")} : {t("Earn Skill")}</Typography>
                        <Typography variant="h3" component="p" sx={{ fontWeight: '500', color: new_theme.palette.newSupplementary.NSupText, textAlign: 'left' }}>{t("Take our test and earn a badge! Demonstrate your knowledge and skills by completing our test, and receive a badge to showcase your achievement.")}</Typography>
                        <div className="test_skill_btns" style={{ marginTop: '16px' }}>
                            <StyledButton eVariant="primary" eSize="medium" sx={{ mr: 2 }}>{t("Start")}</StyledButton>
                            <StyledButton eVariant="secondary" eSize="medium">{t("Cancel")}</StyledButton>
                        </div>
                    </div>
                    <img src={TestNameImg} className="width_res" />
                </Box>
            </Grid>

            {/* Test Done */}
            <Grid item xs={12}>
                <div className="top_heading" style={{ display: 'flex', alignItems: 'center' }}>
                    <div className="arrow_icon">
                        <ArrowBackIos />
                    </div>
                    <div>
                        <Typography variant="h1" component="h1" sx={{ pb: 1 }}>{t("Test_name")}</Typography>
                        <Divider className="heading_divider" />
                    </div>
                </div>
                <Box sx={{ flexDirection: { xs: 'column', md: 'row' }, mt: 4, display: 'flex', alignItems: 'center', backgroundColor: new_theme.palette.newSupplementary.SupCloudy, padding: '26px 35px', borderRadius: '10px', mb: 4 }}>
                    <div className="content" style={{ paddingRight: '15px' }}>
                        <Typography variant="result_title" component="h2" sx={{ mb: 2, textAlign: 'left', color: new_theme.palette.newSupplementary.NSupText, mb: 2 }}>{t("Well done! You’ve earned")}</Typography>
                        <Typography variant="h3" component="p" sx={{ mb: 2, fontWeight: '500', textAlign: 'left', color: new_theme.palette.secondary.Turquoise }}>{t("#Skill_name")}</Typography>
                        <Typography variant="h3" component="p" sx={{ fontWeight: '500', color: new_theme.palette.newSupplementary.NSupText, textAlign: 'left' }}>{t("You have passed the knowledge test on basic level with 90 % result in this area. ")}</Typography>
                        <div className="test_skill_btns" style={{ marginTop: '16px' }}>
                            <StyledButton eVariant="primary" eSize="medium" sx={{ mr: 2 }}>{t("My Performance")}</StyledButton>
                            <StyledButton eVariant="secondary" eSize="medium">{t("Skip")}</StyledButton>
                        </div>
                    </div>
                    <img src={BlueBoredImg} className="width_res" />
                </Box>
            </Grid>
        </ThemeProvider>
    );
};

export default Performance;