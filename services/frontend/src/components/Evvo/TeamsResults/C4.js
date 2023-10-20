import React, { useState, useEffect, lazy } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ReactComponent as IconDiamond } from "../../../img/cognitive_space/IconDiamond.svg";
import GaugeChart from 'react-advanced-gauge-chart';
import Typography from '@mui/material/Typography';
import StyledButton from "new_styled_components/Button/Button.styled";
import Box from '@mui/material/Box';
import { Grid } from "@mui/material";
import { ThemeProvider } from "@mui/material";
import { new_theme } from "NewMuiTheme";
import "./TeamsResults.scss";
import CircleIcon from '@mui/icons-material/Circle';
import { CircularGaugeComponent, AxesDirective, AxisDirective, PointersDirective, PointerDirective, RangesDirective, RangeDirective } from '@syncfusion/ej2-react-circulargauge';

export default function C4(props) {
    const { data } = props;
    const { t } = useTranslation(['translation', 'tips', 'traits', 'profiles', 'issues', 'solutions', 'cognitiveSpace', 'cognitiveSpaceFAQ']);
    const navigate = useNavigate();
    const [currentTab, setCurrentTab] = useState(0);
    // const actions = null;
    // const descrip = data['communication']['descriptions'];

    // const Actions = () => {
    //     data['communication']['actions'].ReactComponent
    // }
    // data['communication']['actions'].ReactComponent()


    return (

        <ThemeProvider theme={new_theme}>
            <Grid item xs={12}>
                <Grid container spacing={2}>
                    <Box sx={{ mb: 4, p: "24px", backgroundColor: new_theme.palette.newSupplementary.SupCloudy, borderRadius: '10px' }}>
                        <Typography variant="h3" component="h3" sx={{ mb: 3, color: new_theme.palette.newSupplementary.NSupText, textAlign: 'left' }} >
                            {data['communication'].shortName}
                        </Typography>
                        <div style={{ height: '200px' }}>
                            <CircularGaugeComponent id='circulargauge3' background="transparent" width="300px" height="300px">
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
                                            <PointerDirective value={Math.round(data['communication'].normalizedValue)} radius='60%' pointerWidth={20} color={new_theme.palette.primary.MedPurple}
                                                animation={{ enable: true, duration: 500 }}
                                                cap={{
                                                    radius: 8,
                                                    color: new_theme.palette.newSecondary.NSDisabled,
                                                    border: { width: 5, color: new_theme.palette.primary.MedPurple }
                                                }} needleTail={{
                                                    length: '0%'
                                                }} />
                                        </PointersDirective>
                                        <RangesDirective>
                                            {Math.round(data['communication'].min) > 0 && <RangeDirective
                                                start={0}
                                                end={Math.round(data['communication'].min)}
                                                radius="108%"
                                                color={new_theme.palette.newSecondary.NSDisabled}
                                                startWidth={8}
                                                endWidth={8}
                                            />}
                                            <RangeDirective
                                                start={Math.round(data['communication'].min)}
                                                end={Math.round(data['communication'].max)}
                                                radius="108%"
                                                color={new_theme.palette.primary.MedPurple}
                                                startWidth={8}
                                                endWidth={8}
                                            />
                                            {Math.round(data['communication'].min) < 10 && <RangeDirective
                                                start={Math.round(data['communication'].max)}
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
                            {data['communication'].mainDefinition}
                        </Typography>
                        <br />
                        <Box className="results_bubble" sx={{ backgroundColor: new_theme.palette.primary.PWhite, position: 'relative' }}>
                            <Box className="bubble_bg">
                                {data['communication']["actions"].map((item, index) => <Box key={index} sx={{ my: 1, gap: "5px 20px", display: 'flex' }}>
                                    <CircleIcon sx={{ mt: .5, fontSize: 'medium', border: `2px solid ${new_theme.palette.newSupplementary.NSupText}`, color: 'transparent', borderRadius: '50%' }}></CircleIcon>
                                    <Typography variant="list1">{item}</Typography>
                                </Box>)}
                            </Box>
                        </Box>
                        {
                          data['communication']['descriptions'].length && 
                          <>
                            <Box sx={{ backgroundColor: new_theme.palette.primary.PPurple, padding: '10px 12px', mt: 2, borderRadius: '8px' }}>
                                {
                                    data['communication']['descriptions'].map((item) => (
                                        <Typography variant="body2" component="p" sx={{ fontWeight: '500', color: new_theme.palette.primary.PWhite }}>{item}</Typography>
                                    ))
                                }
                            </Box>
                          </>  
                        }
                        
                        {/* <div className="list_item actions_list"style={{marginTop: '20px'}}>
                            <Typography variant="body3" component="h6" sx={{ mb: 2, fontWeight: 'bold' }}>{t("Actions")}</Typography>
                            <ul>
                                {
                                    data['communication']['actions'].length && data['communication']['actions'].map((item) => (
                                        <li>{item}</li>

                                    ))
                                }
                            </ul>
                        </div>
                        <div className="list_item description_list">
                            <Typography variant="body3" component="h6" sx={{ mb: 2, fontWeight: 'bold' }}>{t("Descriptions")}</Typography>
                            <ul>
                                {
                                    data['communication']['actions'].length && data['communication']['descriptions'].map((item) => (
                                        <li>{item}</li>

                                    ))
                                }
                            </ul>
                        </div> */}
                    </Box>
                    <Box sx={{ mb: 4, p: "24px", backgroundColor: new_theme.palette.newSupplementary.SupCloudy, borderRadius: '10px' }}>
                        <Typography variant="h3" component="h3" sx={{ mb: 3, color: new_theme.palette.newSupplementary.NSupText, textAlign: 'left' }} >
                            {data['collaboration'].shortName}
                        </Typography>
                        <div style={{ height: '200px' }}>
                            <CircularGaugeComponent id='circulargauge4' background="transparent" width="300px" height="300px">
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
                                            <PointerDirective value={Math.round(data['collaboration'].normalizedValue)} radius='60%' pointerWidth={20} color= {new_theme.palette.primary.MedPurple}
                                                animation={{ enable: true, duration: 500 }}
                                                cap={{
                                                    radius: 8,
                                                    color: new_theme.palette.newSecondary.NSDisabled,
                                                    border: { width: 5, color: new_theme.palette.primary.MedPurple }
                                                }} needleTail={{
                                                    length: '0%'
                                                }} />
                                        </PointersDirective>
                                        <RangesDirective>
                                            {Math.round(data['collaboration'].min) > 0 && <RangeDirective
                                                start={0}
                                                end={Math.round(data['collaboration'].min)}
                                                radius="108%"
                                                color={new_theme.palette.newSecondary.NSDisabled}
                                                startWidth={8}
                                                endWidth={8}
                                            />}
                                            <RangeDirective
                                                start={Math.round(data['collaboration'].min)}
                                                end={Math.round(data['collaboration'].max)}
                                                radius="108%"
                                                color={new_theme.palette.primary.MedPurple}
                                                startWidth={8}
                                                endWidth={8}
                                            />
                                            {Math.round(data['collaboration'].min) < 10 && <RangeDirective
                                                start={Math.round(data['collaboration'].max)}
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
                            {data['collaboration'].mainDefinition}
                        </Typography>
                        <br />
                        <Box className="results_bubble" sx={{ backgroundColor: new_theme.palette.primary.PWhite, position: 'relative' }}>
                            <Box className="bubble_bg">
                                {data['collaboration']["actions"].map((item, index) => <Box key={index} sx={{ my: 1, gap: "5px 20px", display: 'flex' }}>
                                    <CircleIcon sx={{ mt: .5, fontSize: 'medium', border: `2px solid ${new_theme.palette.newSupplementary.NSupText}`, color: 'transparent', borderRadius: '50%' }}></CircleIcon>
                                    <Typography variant="list1">{item}</Typography>
                                </Box>)}
                            </Box>
                        </Box>
                        {
                            data['collaboration']['descriptions'].length &&
                            <>
                                <Box sx={{ backgroundColor: new_theme.palette.primary.PPurple, padding: '10px 12px', mt: 2, borderRadius: '8px' }}>
                                    {
                                        data['collaboration']['descriptions'].map((item) => (
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
                                            data['collaboration']['actions'].length && data['collaboration']['actions'].map((item) => (
                                                <li>{item}</li>

                                            ))
                                        }
                                    </ul>
                                </div>
                                <div className="list_item description_list">
                                    <Typography variant="body3" component="h6" sx={{ mb: 2, fontWeight: 'bold' }}>{t("Descriptions")}</Typography>
                                    <ul>
                                        {
                                            data['collaboration']['actions'].length && data['collaboration']['descriptions'].map((item) => (
                                                <li>{item}</li>

                                            ))
                                        }
                                    </ul>
                                </div> */}
                    </Box>
                    <Box sx={{ mb: 4, p: "24px", backgroundColor: new_theme.palette.newSupplementary.SupCloudy, borderRadius: '10px' }}>
                        <Typography variant="h3" component="h3" sx={{ mb: 3, color: new_theme.palette.newSupplementary.NSupText, textAlign: 'left' }} >
                            {data['creativity'].shortName}
                        </Typography>
                        <div style={{ height: '200px' }}>
                            <CircularGaugeComponent id='circulargauge5' background="transparent" width="300px" height="300px">
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
                                            <PointerDirective value={Math.round(data['creativity'].normalizedValue)} radius='60%' pointerWidth={20} color= {new_theme.palette.primary.MedPurple}
                                                animation={{ enable: true, duration: 500 }}
                                                cap={{
                                                    radius: 8,
                                                    color: new_theme.palette.newSecondary.NSDisabled,
                                                    border: { width: 5, color: new_theme.palette.primary.MedPurple }
                                                }} needleTail={{
                                                    length: '0%'
                                                }} />
                                        </PointersDirective>
                                        <RangesDirective>
                                            {Math.round(data['creativity'].min) > 0 && <RangeDirective
                                                start={0}
                                                end={Math.round(data['creativity'].min)}
                                                radius="108%"
                                                color={new_theme.palette.newSecondary.NSDisabled}
                                                startWidth={8}
                                                endWidth={8}
                                            />}
                                            <RangeDirective
                                                start={Math.round(data['creativity'].min)}
                                                end={Math.round(data['creativity'].max)}
                                                radius="108%"
                                                color={new_theme.palette.primary.MedPurple}
                                                startWidth={8}
                                                endWidth={8}
                                            />
                                            {Math.round(data['creativity'].min) < 10 && <RangeDirective
                                                start={Math.round(data['creativity'].max)}
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
                            {data['creativity'].mainDefinition}
                        </Typography>
                        <br />
                        <Box className="results_bubble" sx={{ backgroundColor: new_theme.palette.primary.PWhite, position: 'relative' }}>
                            <Box className="bubble_bg">
                                {data['creativity']["actions"].map((item, index) => <Box key={index} sx={{ my: 1, gap: "5px 20px", display: 'flex' }}>
                                    <CircleIcon sx={{ mt: .5, fontSize: 'medium', border: `2px solid ${new_theme.palette.newSupplementary.NSupText}`, color: 'transparent', borderRadius: '50%' }}></CircleIcon>
                                    <Typography variant="list1">{item}</Typography>
                                </Box>)}
                            </Box>
                        </Box>
                        {
                            data['creativity']['descriptions'].length &&
                            <>
                                <Box sx={{ backgroundColor: new_theme.palette.primary.PPurple, padding: '10px 12px', mt: 2, borderRadius: '8px' }}>
                                    {
                                        data['creativity']['descriptions'].map((item) => (
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
                                            data['creativity']['actions'].length && data['creativity']['actions'].map((item) => (
                                                <li>{item}</li>

                                            ))
                                        }
                                    </ul>
                                </div>
                                <div className="list_item description_list">
                                    <Typography variant="body3" component="h6" sx={{ mb: 2, fontWeight: 'bold' }}>{t("Descriptions")}</Typography>
                                    <ul>
                                        {
                                            data['creativity']['actions'].length && data['creativity']['descriptions'].map((item) => (
                                                <li>{item}</li>

                                            ))
                                        }
                                    </ul>
                                </div> */}
                    </Box>
                    <Box sx={{ mb: 4, p: "24px", backgroundColor: new_theme.palette.newSupplementary.SupCloudy, borderRadius: '10px' }}>
                        <Typography variant="h3" component="h3" sx={{ mb: 3, color: new_theme.palette.newSupplementary.NSupText, textAlign: 'left' }} >
                            {data['critical-thinking'].shortName}
                        </Typography>
                        <div style={{ height: '200px' }}>
                            <CircularGaugeComponent id='circulargauge6' background="transparent" width="300px" height="300px">
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
                                            <PointerDirective value={Math.round(data['critical-thinking'].normalizedValue)} radius='60%' pointerWidth={20} color= {new_theme.palette.primary.MedPurple}
                                                animation={{ enable: true, duration: 500 }}
                                                cap={{
                                                    radius: 8,
                                                    color: new_theme.palette.newSecondary.NSDisabled,
                                                    border: { width: 5, color: new_theme.palette.primary.MedPurple }
                                                }} needleTail={{
                                                    length: '0%'
                                                }} />
                                        </PointersDirective>
                                        <RangesDirective>
                                            {Math.round(data['critical-thinking'].min) > 0 && <RangeDirective
                                                start={0}
                                                end={Math.round(data['critical-thinking'].min)}
                                                radius="108%"
                                                color={new_theme.palette.newSecondary.NSDisabled}
                                                startWidth={8}
                                                endWidth={8}
                                            />}
                                            <RangeDirective
                                                start={Math.round(data['critical-thinking'].min)}
                                                end={Math.round(data['critical-thinking'].max)}
                                                radius="108%"
                                                color={new_theme.palette.primary.MedPurple}
                                                startWidth={8}
                                                endWidth={8}
                                            />
                                            {Math.round(data['critical-thinking'].min) < 10 && <RangeDirective
                                                start={Math.round(data['critical-thinking'].max)}
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
                            {data['critical-thinking'].mainDefinition}
                        </Typography>
                        <br />
                        <Box className="results_bubble" sx={{ backgroundColor: new_theme.palette.primary.PWhite, position: 'relative' }}>
                            <Box className="bubble_bg">
                                {data['critical-thinking']["actions"].map((item, index) => <Box key={index} sx={{ my: 1, gap: "5px 20px", display: 'flex' }}>
                                    <CircleIcon sx={{ mt: .5, fontSize: 'medium', border: `2px solid ${new_theme.palette.newSupplementary.NSupText}`, color: 'transparent', borderRadius: '50%' }}></CircleIcon>
                                    <Typography variant="list1">{item}</Typography>
                                </Box>)}
                            </Box>
                        </Box>
                        {
                            data['critical-thinking']['descriptions'].length &&
                            <>
                                <Box sx={{ backgroundColor: new_theme.palette.primary.PPurple, padding: '10px 12px', mt: 2, borderRadius: '8px' }}>
                                    {
                                        data['critical-thinking']['descriptions'].map((item) => (
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
                                            data['critical-thinking']['actions'].length && data['critical-thinking']['actions'].map((item) => (
                                                <li>{item}</li>

                                            ))
                                        }
                                    </ul>
                                </div>
                                <div className="list_item description_list">
                                    <Typography variant="body3" component="h6" sx={{ mb: 2, fontWeight: 'bold' }}>{t("Descriptions")}</Typography>
                                    <ul>
                                        {
                                            data['critical-thinking']['actions'].length && data['critical-thinking']['descriptions'].map((item) => (
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