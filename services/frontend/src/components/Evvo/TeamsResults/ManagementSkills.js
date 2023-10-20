import React, { useState, useEffect, lazy } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ReactComponent as IconDiamond } from "../../../img/cognitive_space/IconDiamond.svg";
import GaugeChart from 'react-advanced-gauge-chart';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Grid } from "@mui/material";
import { new_theme } from "NewMuiTheme";
import { ThemeProvider } from "@mui/material";
import "./TeamsResults.scss";
import StyledButton from "new_styled_components/Button/Button.styled";
import CircleIcon from '@mui/icons-material/Circle';
import { CircularGaugeComponent, AxesDirective, AxisDirective, PointersDirective, PointerDirective, RangesDirective, RangeDirective } from '@syncfusion/ej2-react-circulargauge';


export default function ManagementSkills(props) {
    const { data } = props;
    const { t } = useTranslation(['translation', 'tips', 'traits', 'profiles', 'issues', 'solutions', 'cognitiveSpace', 'cognitiveSpaceFAQ']);
    const navigate = useNavigate();
    const [currentTab, setCurrentTab] = useState(0);

    return (

        <ThemeProvider theme={new_theme}>
            <Grid item xs={12}>
                <Grid container spacing={2}>
                    <Box sx={{ mb: 4, p: "24px", backgroundColor: new_theme.palette.newSupplementary.SupCloudy, borderRadius: '10px' }}>
                        <Typography variant="h3" component="h3" sx={{ mb: 3, color: new_theme.palette.newSupplementary.NSupText, textAlign: 'left' }} >
                            {data['leadership'].shortName}
                        </Typography>
                        <div style={{ height: '200px' }}>
                            <CircularGaugeComponent id='circulargauge11' background="transparent" width="300px" height="300px">
                                <AxesDirective>
                                    <AxisDirective radius='80%' startAngle={270} endAngle={90} minimum={1} maximum={10}
                                        majorTicks={{ offset: 5 }} lineStyle={{ width: 0 }}
                                        minorTicks={{ offset: 5 }} labelStyle={{
                                            font: {
                                                fontFamily: 'inherit',
                                            },
                                            offset: -1
                                        }}>
                                        <PointersDirective>
                                            <PointerDirective value={Math.round(data['leadership'].normalizedValue)} radius='60%' pointerWidth={20} color= {new_theme.palette.primary.MedPurple}
                                                animation={{ enable: true, duration: 500 }}
                                                cap={{
                                                    radius: 8,
                                                    color: new_theme.palette.newSecondary.NSDisabled,
                                                    border: { width: 5, color:  new_theme.palette.primary.MedPurple }
                                                }} needleTail={{
                                                    length: '0%'
                                                }} />
                                        </PointersDirective>
                                        <RangesDirective>
                                            {Math.round(data['leadership'].min) > 0 && <RangeDirective
                                                start={0}
                                                end={Math.round(data['leadership'].min)}
                                                radius="108%"
                                                color={new_theme.palette.newSecondary.NSDisabled}
                                                startWidth={8}
                                                endWidth={8}
                                            />}
                                            <RangeDirective
                                                start={Math.round(data['leadership'].min)}
                                                end={Math.round(data['leadership'].max)}
                                                radius="108%"
                                                color= {new_theme.palette.primary.MedPurple}
                                                startWidth={8}
                                                endWidth={8}
                                            />
                                            {Math.round(data['leadership'].min) < 10 && <RangeDirective
                                                start={Math.round(data['leadership'].max)}
                                                end={10}
                                                radius="108%"
                                                color={new_theme.palette.newSecondary.NSDisabled}
                                                startWidth={8}
                                                endWidth={8}
                                            />}
                                        </RangesDirective>
                                    </AxisDirective>
                                </AxesDirective>
                            </CircularGaugeComponent>
                        </div>
                        <Typography sx={{ lineHeight: "24px", fontSize: "16px", color: new_theme.palette.neutrals.almostBlack }} >
                            {data['leadership'].mainDefinition}
                        </Typography>
                        <br />
                        <Box className="results_bubble" sx={{ backgroundColor: new_theme.palette.primary.PWhite, position: 'relative' }}>
                            <Box className="bubble_bg">
                                {data['leadership']["actions"].map((item, index) => <Box key={index} sx={{ my: 1, gap: "5px 20px", display: 'flex' }}>
                                    <CircleIcon sx={{ mt: .5, fontSize: 'medium', border: `2px solid ${new_theme.palette.newSupplementary.NSupText}`, color: 'transparent', borderRadius: '50%' }}></CircleIcon>
                                    <Typography variant="list1">{item}</Typography>
                                </Box>)}
                            </Box>
                        </Box>
                        {
                            data['leadership']['descriptions'].length &&
                            <>
                                <Box sx={{ backgroundColor: new_theme.palette.primary.PPurple, padding: '10px 12px', mt: 2, borderRadius: '8px' }}>
                                    {
                                        data['leadership']['descriptions'].map((item) => (
                                            <Typography variant="body2" component="p" sx={{ fontWeight: '500', color: new_theme.palette.primary.PWhite }}>{item}</Typography>
                                        ))
                                    }
                                </Box>
                            </>
                        }
                        {/* <Box sx={{ backgroundColor: new_theme.palette.primary.PPurple, padding: '10px 12px', mt: 2, borderRadius: '8px' }}>
                            <Typography variant="body2" component="p" sx={{ fontWeight: '500', color: new_theme.palette.primary.PWhite }}>{t("How to develop dimension_name")} &nbsp; <span style={{ fontWeight: '600' }}>{t("Aliquam non sit vitae vulputate sed imperdiet pellentesque dolor. Dictum id et amet commodo sed.")}</span></Typography>
                        </Box> */}
                        {/* <div className="list_item actions_list"style={{marginTop: '20px'}}>
                                    <Typography variant="body3" component="h6" sx={{ mb: 2, fontWeight: 'bold' }}>{t("Actions")}</Typography>
                                    <ul>
                                        {
                                            data['leadership']['actions'].length && data['leadership']['actions'].map((item) => (
                                                <li>{item}</li>

                                            ))
                                        }
                                    </ul>
                                </div>
                                <div className="list_item description_list">
                                    <Typography variant="body3" component="h6" sx={{ mb: 2, fontWeight: 'bold' }}>{t("Descriptions")}</Typography>
                                    <ul>
                                        {
                                            data['leadership']['actions'].length && data['leadership']['descriptions'].map((item) => (
                                                <li>{item}</li>

                                            ))
                                        }
                                    </ul>
                                </div> */}
                    </Box>
                    <Box sx={{ mb: 4, p: "24px", backgroundColor: new_theme.palette.newSupplementary.SupCloudy, borderRadius: '10px' }}>
                        <Typography variant="h3" component="h3" sx={{ mb: 3, color: new_theme.palette.newSupplementary.NSupText, textAlign: 'left' }} >
                            {data['risk-taking'].shortName}
                        </Typography>
                        <div style={{ height: '200px' }}>
                            <CircularGaugeComponent id='circulargauge12' background="transparent" width="300px" height="300px">
                                <AxesDirective>
                                    <AxisDirective radius='80%' startAngle={270} endAngle={90} minimum={1} maximum={10}
                                        majorTicks={{ offset: 5 }} lineStyle={{ width: 0 }}
                                        minorTicks={{ offset: 5 }} labelStyle={{
                                            font: {
                                                fontFamily: 'inherit',
                                            },
                                            offset: -1
                                        }}>
                                        <PointersDirective>
                                            <PointerDirective value={Math.round(data['risk-taking'].normalizedValue)} radius='60%' pointerWidth={20} color= {new_theme.palette.primary.MedPurple}
                                                animation={{ enable: true, duration: 500 }}
                                                cap={{
                                                    radius: 8,
                                                    color: new_theme.palette.newSecondary.NSDisabled,
                                                    border: { width: 5, color:  new_theme.palette.primary.MedPurple }
                                                }} needleTail={{
                                                    length: '0%'
                                                }} />
                                        </PointersDirective>
                                        <RangesDirective>
                                            {Math.round(data['risk-taking'].min) > 0 && <RangeDirective
                                                start={0}
                                                end={Math.round(data['risk-taking'].min)}
                                                radius="108%"
                                                color={new_theme.palette.newSecondary.NSDisabled}
                                                startWidth={8}
                                                endWidth={8}
                                            />}
                                            <RangeDirective
                                                start={Math.round(data['risk-taking'].min)}
                                                end={Math.round(data['risk-taking'].max)}
                                                radius="108%"
                                                color= {new_theme.palette.primary.MedPurple}
                                                startWidth={8}
                                                endWidth={8}
                                            />
                                            {Math.round(data['risk-taking'].min) < 10 && <RangeDirective
                                                start={Math.round(data['risk-taking'].max)}
                                                end={10}
                                                radius="108%"
                                                color={new_theme.palette.newSecondary.NSDisabled}
                                                startWidth={8}
                                                endWidth={8}
                                            />}
                                        </RangesDirective>
                                    </AxisDirective>
                                </AxesDirective>
                            </CircularGaugeComponent>
                        </div>
                        <Typography sx={{ lineHeight: "24px", fontSize: "16px", color: new_theme.palette.neutrals.almostBlack }} >
                            {data['risk-taking'].mainDefinition}
                        </Typography>
                        <br />
                        <Box className="results_bubble" sx={{ backgroundColor: new_theme.palette.primary.PWhite, position: 'relative' }}>
                            <Box className="bubble_bg">
                                {data['risk-taking']["actions"].map((item, index) => <Box key={index} sx={{ my: 1, gap: "5px 20px", display: 'flex' }}>
                                    <CircleIcon sx={{ mt: .5, fontSize: 'medium', border: `2px solid ${new_theme.palette.newSupplementary.NSupText}`, color: 'transparent', borderRadius: '50%' }}></CircleIcon>
                                    <Typography variant="list1">{item}</Typography>
                                </Box>)}
                            </Box>
                        </Box>
                        {
                            data['risk-taking']['descriptions'].length &&
                            <>
                                <Box sx={{ backgroundColor: new_theme.palette.primary.PPurple, padding: '10px 12px', mt: 2, borderRadius: '8px' }}>
                                    {
                                        data['risk-taking']['descriptions'].map((item) => (
                                            <Typography variant="body2" component="p" sx={{ fontWeight: '500', color: new_theme.palette.primary.PWhite }}>{item}</Typography>
                                        ))
                                    }
                                </Box>
                            </>
                        }
                        {/* <Box sx={{ backgroundColor: new_theme.palette.primary.PPurple, padding: '10px 12px', mt: 2, borderRadius: '8px' }}>
                            <Typography variant="body2" component="p" sx={{ fontWeight: '500', color: new_theme.palette.primary.PWhite }}>{t("How to develop dimension_name")} &nbsp; <span style={{ fontWeight: '600' }}>{t("Aliquam non sit vitae vulputate sed imperdiet pellentesque dolor. Dictum id et amet commodo sed.")}</span></Typography>
                        </Box> */}
                        {/* <div className="list_item actions_list"style={{marginTop: '20px'}}>
                                    <Typography variant="body3" component="h6" sx={{ mb: 2, fontWeight: 'bold' }}>{t("Actions")}</Typography>
                                    <ul>
                                        {
                                            data['risk-taking']['actions'].length && data['risk-taking']['actions'].map((item) => (
                                                <li>{item}</li>

                                            ))
                                        }
                                    </ul>
                                </div>
                                <div className="list_item description_list">
                                    <Typography variant="body3" component="h6" sx={{ mb: 2, fontWeight: 'bold' }}>{t("Descriptions")}</Typography>
                                    <ul>
                                        {
                                            data['risk-taking']['actions'].length && data['risk-taking']['descriptions'].map((item) => (
                                                <li>{item}</li>

                                            ))
                                        }
                                    </ul>
                                </div> */}
                    </Box>
                    <Box sx={{ mb: 4, p: "24px", backgroundColor: new_theme.palette.newSupplementary.SupCloudy, borderRadius: '10px' }}>
                        <Typography variant="h3" component="h3" sx={{ mb: 3, color: new_theme.palette.newSupplementary.NSupText, textAlign: 'left' }} >
                            {data['stress-management'].shortName}
                        </Typography>
                        <div style={{ height: '200px' }}>
                            <CircularGaugeComponent id='circulargauge13' background="transparent" width="300px" height="300px">
                                <AxesDirective>
                                    <AxisDirective radius='80%' startAngle={270} endAngle={90} minimum={1} maximum={10}
                                        majorTicks={{ offset: 5 }} lineStyle={{ width: 0 }}
                                        minorTicks={{ offset: 5 }} labelStyle={{
                                            font: {
                                                fontFamily: 'inherit',
                                            },
                                            offset: -1
                                        }}>
                                        <PointersDirective>
                                            <PointerDirective value={Math.round(data['stress-management'].normalizedValue)} radius='60%' pointerWidth={20} color= {new_theme.palette.primary.MedPurple}
                                                animation={{ enable: true, duration: 500 }}
                                                cap={{
                                                    radius: 8,
                                                    color: new_theme.palette.newSecondary.NSDisabled,
                                                    border: { width: 5, color:  new_theme.palette.primary.MedPurple }
                                                }} needleTail={{
                                                    length: '0%'
                                                }} />
                                        </PointersDirective>
                                        <RangesDirective>
                                            {Math.round(data['stress-management'].min) > 0 && <RangeDirective
                                                start={0}
                                                end={Math.round(data['stress-management'].min)}
                                                radius="108%"
                                                color={new_theme.palette.newSecondary.NSDisabled}
                                                startWidth={8}
                                                endWidth={8}
                                            />}
                                            <RangeDirective
                                                start={Math.round(data['stress-management'].min)}
                                                end={Math.round(data['stress-management'].max)}
                                                radius="108%"
                                                color= {new_theme.palette.primary.MedPurple}
                                                startWidth={8}
                                                endWidth={8}
                                            />
                                            {Math.round(data['stress-management'].min) < 10 && <RangeDirective
                                                start={Math.round(data['stress-management'].max)}
                                                end={10}
                                                radius="108%"
                                                color={new_theme.palette.newSecondary.NSDisabled}
                                                startWidth={8}
                                                endWidth={8}
                                            />}
                                        </RangesDirective>
                                    </AxisDirective>
                                </AxesDirective>
                            </CircularGaugeComponent>
                        </div>
                        <Typography sx={{ lineHeight: "24px", fontSize: "16px", color: new_theme.palette.neutrals.almostBlack }} >
                            {data['stress-management'].mainDefinition}
                        </Typography>
                        <br />
                        <Box className="results_bubble" sx={{ backgroundColor: new_theme.palette.primary.PWhite, position: 'relative' }}>
                            <Box className="bubble_bg">
                                {data['stress-management']["actions"].map((item, index) => <Box key={index} sx={{ my: 1, gap: "5px 20px", display: 'flex' }}>
                                    <CircleIcon sx={{ mt: .5, fontSize: 'medium', border: `2px solid ${new_theme.palette.newSupplementary.NSupText}`, color: 'transparent', borderRadius: '50%' }}></CircleIcon>
                                    <Typography variant="list1">{item}</Typography>
                                </Box>)}
                            </Box>
                        </Box>
                        {
                            data['stress-management']['descriptions'].length &&
                            <>
                                <Box sx={{ backgroundColor: new_theme.palette.primary.PPurple, padding: '10px 12px', mt: 2, borderRadius: '8px' }}>
                                    {
                                        data['stress-management']['descriptions'].map((item) => (
                                            <Typography variant="body2" component="p" sx={{ fontWeight: '500', color: new_theme.palette.primary.PWhite }}>{item}</Typography>
                                        ))
                                    }
                                </Box>
                            </>
                        }
                        {/* <Box sx={{ backgroundColor: new_theme.palette.primary.PPurple, padding: '10px 12px', mt: 2, borderRadius: '8px' }}>
                            <Typography variant="body2" component="p" sx={{ fontWeight: '500', color: new_theme.palette.primary.PWhite }}>{t("How to develop dimension_name")} &nbsp; <span style={{ fontWeight: '600' }}>{t("Aliquam non sit vitae vulputate sed imperdiet pellentesque dolor. Dictum id et amet commodo sed.")}</span></Typography>
                        </Box> */}
                        {/* <div className="list_item actions_list"style={{marginTop: '20px'}}>
                                    <Typography variant="body3" component="h6" sx={{ mb: 2, fontWeight: 'bold' }}>{t("Actions")}</Typography>
                                    <ul>
                                        {
                                            data['stress-management']['actions'].length && data['stress-management']['actions'].map((item) => (
                                                <li>{item}</li>

                                            ))
                                        }
                                    </ul>
                                </div>
                                <div className="list_item description_list">
                                    <Typography variant="body3" component="h6" sx={{ mb: 2, fontWeight: 'bold' }}>{t("Descriptions")}</Typography>
                                    <ul>
                                        {
                                            data['stress-management']['actions'].length && data['stress-management']['descriptions'].map((item) => (
                                                <li>{item}</li>

                                            ))
                                        }
                                    </ul>
                                </div> */}
                    </Box>
                    <Box sx={{ mb: 4, p: "24px", backgroundColor: new_theme.palette.newSupplementary.SupCloudy, borderRadius: '10px' }}>
                        <Typography variant="h3" component="h3" sx={{ mb: 3, color: new_theme.palette.newSupplementary.NSupText, textAlign: 'left' }} >
                            {data['emotional-intelligence-global'].shortName}
                        </Typography>
                        <div style={{ height: '200px' }}>
                            <CircularGaugeComponent id='circulargauge14' background="transparent" width="300px" height="300px">
                                <AxesDirective>
                                    <AxisDirective radius='80%' startAngle={270} endAngle={90} minimum={1} maximum={10}
                                        majorTicks={{ offset: 5 }} lineStyle={{ width: 0 }}
                                        minorTicks={{ offset: 5 }} labelStyle={{
                                            font: {
                                                fontFamily: 'inherit',
                                            },
                                            offset: -1
                                        }}>
                                        <PointersDirective>
                                            <PointerDirective value={Math.round(data['emotional-intelligence-global'].normalizedValue)} radius='60%' pointerWidth={20} color= {new_theme.palette.primary.MedPurple}
                                                animation={{ enable: true, duration: 500 }}
                                                cap={{
                                                    radius: 8,
                                                    color: new_theme.palette.newSecondary.NSDisabled,
                                                    border: { width: 5, color:  new_theme.palette.primary.MedPurple }
                                                }} needleTail={{
                                                    length: '0%'
                                                }} />
                                        </PointersDirective>
                                        <RangesDirective>
                                            {Math.round(data['emotional-intelligence-global'].min) > 0 && <RangeDirective
                                                start={0}
                                                end={Math.round(data['emotional-intelligence-global'].min)}
                                                radius="108%"
                                                color={new_theme.palette.newSecondary.NSDisabled}
                                                startWidth={8}
                                                endWidth={8}
                                            />}
                                            <RangeDirective
                                                start={Math.round(data['emotional-intelligence-global'].min)}
                                                end={Math.round(data['emotional-intelligence-global'].max)}
                                                radius="108%"
                                                color= {new_theme.palette.primary.MedPurple}
                                                startWidth={8}
                                                endWidth={8}
                                            />
                                            {Math.round(data['emotional-intelligence-global'].min) < 10 && <RangeDirective
                                                start={Math.round(data['emotional-intelligence-global'].max)}
                                                end={10}
                                                radius="108%"
                                                color={new_theme.palette.newSecondary.NSDisabled}
                                                startWidth={8}
                                                endWidth={8}
                                            />}
                                        </RangesDirective>
                                    </AxisDirective>
                                </AxesDirective>
                            </CircularGaugeComponent>
                        </div>
                        <Typography sx={{ lineHeight: "24px", fontSize: "16px", color: new_theme.palette.neutrals.almostBlack }} >
                            {data['emotional-intelligence-global'].mainDefinition}
                        </Typography>
                        <br />
                        <Box className="results_bubble" sx={{ backgroundColor: new_theme.palette.primary.PWhite, position: 'relative' }}>
                            <Box className="bubble_bg">
                                {data['emotional-intelligence-global']['actions'].map((item, index) => <Box key={index} sx={{ my: 1, gap: "5px 20px", display: 'flex' }}>
                                    <CircleIcon sx={{ mt: .5, fontSize: 'medium', border: `2px solid ${new_theme.palette.newSupplementary.NSupText}`, color: 'transparent', borderRadius: '50%' }}></CircleIcon>
                                    <Typography variant="list1">{item}</Typography>
                                </Box>)}
                            </Box>
                        </Box>
                        {
                            data['emotional-intelligence-global']['descriptions'].length &&
                            <>
                                <Box sx={{ backgroundColor: new_theme.palette.primary.PPurple, padding: '10px 12px', mt: 2, borderRadius: '8px' }}>
                                    {
                                        data['emotional-intelligence-global']['descriptions'].map((item) => (
                                            <Typography variant="body2" component="p" sx={{ fontWeight: '500', color: new_theme.palette.primary.PWhite }}>{item}</Typography>
                                        ))
                                    }
                                </Box>
                            </>
                        }
                        {/* <Box sx={{ backgroundColor: new_theme.palette.primary.PPurple, padding: '10px 12px', mt: 2, borderRadius: '8px' }}>
                            <Typography variant="body2" component="p" sx={{ fontWeight: '500', color: new_theme.palette.primary.PWhite }}>{t("How to develop dimension_name")} &nbsp; <span style={{ fontWeight: '600' }}>{t("Aliquam non sit vitae vulputate sed imperdiet pellentesque dolor. Dictum id et amet commodo sed.")}</span></Typography>
                        </Box> */}
                        {/* <div className="list_item actions_list"style={{marginTop: '20px'}}>
                                    <Typography variant="body3" component="h6" sx={{ mb: 2, fontWeight: 'bold' }}>{t("Actions")}</Typography>
                                    <ul>
                                        {
                                            data['emotional-intelligence-global']['actions'].length && data['emotional-intelligence-global']['actions'].map((item) => (
                                                <li>{item}</li>

                                            ))
                                        }
                                    </ul>
                                </div>
                                <div className="list_item description_list">
                                    <Typography variant="body3" component="h6" sx={{ mb: 2, fontWeight: 'bold' }}>{t("Descriptions")}</Typography>
                                    <ul>
                                        {
                                            data['emotional-intelligence-global']['actions'].length && data['emotional-intelligence-global']['descriptions'].map((item) => (
                                                <li>{item}</li>

                                            ))
                                        }
                                    </ul>
                                </div> */}
                    </Box>

                </Grid>
            </Grid>
        </ThemeProvider>
    )
}