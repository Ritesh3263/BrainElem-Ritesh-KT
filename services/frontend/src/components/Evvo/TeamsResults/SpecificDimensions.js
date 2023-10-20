import React, { useState, useEffect, lazy } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import SpecificDimension from "../../../img/cognitive_space/specific_dimension.svg";
import { Grid } from "@mui/material";
import { new_theme } from "NewMuiTheme";
import { ThemeProvider } from "@mui/material";
import "./TeamsResults.scss";

export default function SpecificDimensions() {
    const { t } = useTranslation(['translation', 'tips', 'traits', 'profiles', 'issues', 'solutions', 'cognitiveSpace', 'cognitiveSpaceFAQ']);
    const navigate = useNavigate();
    const [currentTab, setCurrentTab] = useState(0);

    // for Tab Bars
    async function switchTabHandler(i) {
        setCurrentTab(i);
    }

    return (

        <ThemeProvider theme={new_theme}>
            <Grid item xs={12}>
                <div className="dimension_sec">
                    <img src={SpecificDimension} />
                    <div className="">
                        <Typography variant="result_title" component="h5" sx={{ mb: 1 }}>{t("Dimension name")}</Typography>
                        <Typography variant="subtitle3" component="p" sx={{ fontWeight: '500', mb: 1 }}>{t("Very short ddescription for example for the status")}</Typography>
                        <Typography variant="body2" component="p" sx={{ fontWeight: '500', mb: 1 }}>{t("Amet dolor auctor pretium massa vitae. Imperdiet blandit eu non velit fermentum nunc purus vivamus amet. Nibh id amet odio neque feugiat velit elementum. Cursus augue integer risus ultricies elementum purus condimentum quam arcu. Magna leo justo eu non massa urna maecenas. Dignissim et hac risus egestas odio nibh. Fusce vel arcu nascetur ut auctor vitae. Gravida molestie ridiculus faucibus neque vestibulum lectus etiam amet.")}</Typography>
                    </div>
                </div>
                <div className="dimension_sec">
                    <img src={SpecificDimension} />
                    <div className="">
                        <Typography variant="result_title" component="h5" sx={{ mb: 1 }}>{t("Dimension name")}</Typography>
                        <Typography variant="subtitle3" component="p" sx={{ fontWeight: '500', mb: 1 }}>{t("Very short ddescription for example for the status")}</Typography>
                        <Typography variant="body2" component="p" sx={{ fontWeight: '500', mb: 1 }}>{t("Amet dolor auctor pretium massa vitae. Imperdiet blandit eu non velit fermentum nunc purus vivamus amet. Nibh id amet odio neque feugiat velit elementum. Cursus augue integer risus ultricies elementum purus condimentum quam arcu. Magna leo justo eu non massa urna maecenas. Dignissim et hac risus egestas odio nibh. Fusce vel arcu nascetur ut auctor vitae. Gravida molestie ridiculus faucibus neque vestibulum lectus etiam amet.")}</Typography>
                    </div>
                </div>
                <div className="dimension_sec">
                    <img src={SpecificDimension} />
                    <div className="">
                        <Typography variant="result_title" component="h5" sx={{ mb: 1 }}>{t("Dimension name")}</Typography>
                        <Typography variant="subtitle3" component="p" sx={{ fontWeight: '500', mb: 1 }}>{t("Very short ddescription for example for the status")}</Typography>
                        <Typography variant="body2" component="p" sx={{ fontWeight: '500', mb: 1 }}>{t("Amet dolor auctor pretium massa vitae. Imperdiet blandit eu non velit fermentum nunc purus vivamus amet. Nibh id amet odio neque feugiat velit elementum. Cursus augue integer risus ultricies elementum purus condimentum quam arcu. Magna leo justo eu non massa urna maecenas. Dignissim et hac risus egestas odio nibh. Fusce vel arcu nascetur ut auctor vitae. Gravida molestie ridiculus faucibus neque vestibulum lectus etiam amet.")}</Typography>
                    </div>
                </div>
                <div className="dimension_sec">
                    <img src={SpecificDimension} />
                    <div className="">
                        <Typography variant="result_title" component="h5" sx={{ mb: 1 }}>{t("Dimension name")}</Typography>
                        <Typography variant="subtitle3" component="p" sx={{ fontWeight: '500', mb: 1 }}>{t("Very short ddescription for example for the status")}</Typography>
                        <Typography variant="body2" component="p" sx={{ fontWeight: '500', mb: 1 }}>{t("Amet dolor auctor pretium massa vitae. Imperdiet blandit eu non velit fermentum nunc purus vivamus amet. Nibh id amet odio neque feugiat velit elementum. Cursus augue integer risus ultricies elementum purus condimentum quam arcu. Magna leo justo eu non massa urna maecenas. Dignissim et hac risus egestas odio nibh. Fusce vel arcu nascetur ut auctor vitae. Gravida molestie ridiculus faucibus neque vestibulum lectus etiam amet.")}</Typography>
                    </div>
                </div>
            </Grid>
        </ThemeProvider>
    )
}