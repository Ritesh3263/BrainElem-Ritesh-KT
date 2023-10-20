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

export default function SocialSkills(props) {
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
                            {data['emotional-intelligence-in-relation-with-others'].shortName}
                        </Typography>
                        <div style={{ height: '200px' }}>
                            <CircularGaugeComponent id='circulargauge7' background="transparent" width="300px" height="300px">
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
                                            <PointerDirective value={Math.round(data['emotional-intelligence-in-relation-with-others'].normalizedValue)} radius='60%' pointerWidth={20} color= {new_theme.palette.primary.MedPurple}
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
                                            {Math.round(data['emotional-intelligence-in-relation-with-others'].min) > 0 && <RangeDirective
                                                start={0}
                                                end={Math.round(data['emotional-intelligence-in-relation-with-others'].min)}
                                                radius="108%"
                                                color={new_theme.palette.newSecondary.NSDisabled}
                                                startWidth={8}
                                                endWidth={8}
                                            />}
                                            <RangeDirective
                                                start={Math.round(data['emotional-intelligence-in-relation-with-others'].min)}
                                                end={Math.round(data['emotional-intelligence-in-relation-with-others'].max)}
                                                radius="108%"
                                                color= {new_theme.palette.primary.MedPurple}
                                                startWidth={8}
                                                endWidth={8}
                                            />
                                            {Math.round(data['emotional-intelligence-in-relation-with-others'].min) < 10 && <RangeDirective
                                                start={Math.round(data['emotional-intelligence-in-relation-with-others'].max)}
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
                            {data['emotional-intelligence-in-relation-with-others'].mainDefinition}
                        </Typography>
                        <br />
                        <Box className="results_bubble" sx={{ backgroundColor: new_theme.palette.primary.PWhite, position: 'relative' }}>
                            <Box className="bubble_bg">
                                {data['emotional-intelligence-in-relation-with-others']["actions"].map((item, index) => <Box key={index} sx={{ my: 1, gap: "5px 20px", display: 'flex' }}>
                                    <CircleIcon sx={{ mt: .5, fontSize: 'medium', border: `2px solid ${new_theme.palette.newSupplementary.NSupText}`, color: 'transparent', borderRadius: '50%' }}></CircleIcon>
                                    <Typography variant="list1">{item}</Typography>
                                </Box>)}
                            </Box>
                        </Box>
                        {
                            data['emotional-intelligence-in-relation-with-others']['descriptions'].length &&
                            <>
                                <Box sx={{ backgroundColor: new_theme.palette.primary.PPurple, padding: '10px 12px', mt: 2, borderRadius: '8px' }}>
                                    {
                                        data['emotional-intelligence-in-relation-with-others']['descriptions'].map((item) => (
                                            <Typography variant="body2" component="p" sx={{ fontWeight: '500', color: new_theme.palette.primary.PWhite }}>{item}</Typography>
                                        ))
                                    }
                                </Box>
                            </>
                        }
                    </Box>
                    <Box sx={{ mb: 4, p: "24px", backgroundColor: new_theme.palette.newSupplementary.SupCloudy, borderRadius: '10px' }}>
                        <Typography variant="h3" component="h3" sx={{ mb: 3, color: new_theme.palette.newSupplementary.NSupText, textAlign: 'left' }} >
                            {data['emotional-intelligence-in-relation-with-oneself'].shortName}
                        </Typography>
                        <div style={{ height: '200px' }}>
                            <CircularGaugeComponent id='circulargauge8' background="transparent" width="300px" height="300px">
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
                                            <PointerDirective value={Math.round(data['emotional-intelligence-in-relation-with-oneself'].normalizedValue)} radius='60%' pointerWidth={20} color= {new_theme.palette.primary.MedPurple}
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
                                            {Math.round(data['emotional-intelligence-in-relation-with-oneself'].min) > 0 && <RangeDirective
                                                start={0}
                                                end={Math.round(data['emotional-intelligence-in-relation-with-oneself'].min)}
                                                radius="108%"
                                                color={new_theme.palette.newSecondary.NSDisabled}
                                                startWidth={8}
                                                endWidth={8}
                                            />}
                                            <RangeDirective
                                                start={Math.round(data['emotional-intelligence-in-relation-with-oneself'].min)}
                                                end={Math.round(data['emotional-intelligence-in-relation-with-oneself'].max)}
                                                radius="108%"
                                                color= {new_theme.palette.primary.MedPurple}
                                                startWidth={8}
                                                endWidth={8}
                                            />
                                            {Math.round(data['emotional-intelligence-in-relation-with-oneself'].min) < 10 && <RangeDirective
                                                start={Math.round(data['emotional-intelligence-in-relation-with-oneself'].max)}
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
                            {data['emotional-intelligence-in-relation-with-oneself'].mainDefinition}
                        </Typography>
                        <br />
                        <Box className="results_bubble" sx={{ backgroundColor: new_theme.palette.primary.PWhite, position: 'relative' }}>
                            <Box className="bubble_bg">
                                {data['emotional-intelligence-in-relation-with-oneself']["actions"].map((item, index) => <Box key={index} sx={{ my: 1, gap: "5px 20px", display: 'flex' }}>
                                    <CircleIcon sx={{ mt: .5, fontSize: 'medium', border: `2px solid ${new_theme.palette.newSupplementary.NSupText}`, color: 'transparent', borderRadius: '50%' }}></CircleIcon>
                                    <Typography variant="list1">{item}</Typography>
                                </Box>)}
                            </Box>
                        </Box>
                        {
                            data['emotional-intelligence-in-relation-with-oneself']['descriptions'].length &&
                            <>
                                <Box sx={{ backgroundColor: new_theme.palette.primary.PPurple, padding: '10px 12px', mt: 2, borderRadius: '8px' }}>
                                    {
                                        data['emotional-intelligence-in-relation-with-oneself']['descriptions'].map((item) => (
                                            <Typography variant="body2" component="p" sx={{ fontWeight: '500', color: new_theme.palette.primary.PWhite }}>{item}</Typography>
                                        ))
                                    }
                                </Box>
                            </>
                        }
                    </Box>
                    <Box sx={{ mb: 4, p: "24px", backgroundColor: new_theme.palette.newSupplementary.SupCloudy, borderRadius: '10px' }}>
                        <Typography variant="h3" component="h3" sx={{ mb: 3, color: new_theme.palette.newSupplementary.NSupText, textAlign: 'left' }} >
                            {data['respect'].shortName}
                        </Typography>
                        <div style={{ height: '200px' }}>
                            <CircularGaugeComponent id='circulargauge9' background="transparent" width="300px" height="300px">
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
                                            <PointerDirective value={Math.round(data['respect'].normalizedValue)} radius='60%' pointerWidth={20} color= {new_theme.palette.primary.MedPurple}
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
                                            {Math.round(data['respect'].min) > 0 && <RangeDirective
                                                start={0}
                                                end={Math.round(data['respect'].min)}
                                                radius="108%"
                                                color={new_theme.palette.newSecondary.NSDisabled}
                                                startWidth={8}
                                                endWidth={8}
                                            />}
                                            <RangeDirective
                                                start={Math.round(data['respect'].min)}
                                                end={Math.round(data['respect'].max)}
                                                radius="108%"
                                                color= {new_theme.palette.primary.MedPurple}
                                                startWidth={8}
                                                endWidth={8}
                                            />
                                            {Math.round(data['respect'].min) < 10 && <RangeDirective
                                                start={Math.round(data['respect'].max)}
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
                            {data['respect'].mainDefinition}
                        </Typography>
                        <br />
                        <Box className="results_bubble" sx={{ backgroundColor: new_theme.palette.primary.PWhite, position: 'relative' }}>
                            <Box className="bubble_bg">
                                {data['respect']["actions"].map((item, index) => <Box key={index} sx={{ my: 1, gap: "5px 20px", display: 'flex' }}>
                                    <CircleIcon sx={{ mt: .5, fontSize: 'medium', border: `2px solid ${new_theme.palette.newSupplementary.NSupText}`, color: 'transparent', borderRadius: '50%' }}></CircleIcon>
                                    <Typography variant="list1">{item}</Typography>
                                </Box>)}
                            </Box>
                        </Box>
                        {
                            data['respect']['descriptions'].length &&
                            <>
                                <Box sx={{ backgroundColor: new_theme.palette.primary.PPurple, padding: '10px 12px', mt: 2, borderRadius: '8px' }}>
                                    {
                                        data['respect']['descriptions'].map((item) => (
                                            <Typography variant="body2" component="p" sx={{ fontWeight: '500', color: new_theme.palette.primary.PWhite }}>{item}</Typography>
                                        ))
                                    }
                                </Box>
                            </>
                        }
                    </Box>
                    <Box sx={{ mb: 4, p: "24px", backgroundColor: new_theme.palette.newSupplementary.SupCloudy, borderRadius: '10px' }}>
                        <Typography variant="h3" component="h3" sx={{ mb: 3, color: new_theme.palette.newSupplementary.NSupText, textAlign: 'left' }} >
                            {data['empathy'].shortName}
                        </Typography>
                        <div style={{ height: '200px' }}>
                            <CircularGaugeComponent id='circulargauge10' background="transparent" width="300px" height="300px">
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
                                            <PointerDirective value={Math.round(data['empathy'].normalizedValue)} radius='60%' pointerWidth={20} color= {new_theme.palette.primary.MedPurple}
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
                                            {Math.round(data['empathy'].min) > 0 && <RangeDirective
                                                start={0}
                                                end={Math.round(data['empathy'].min)}
                                                radius="108%"
                                                color={new_theme.palette.newSecondary.NSDisabled}
                                                startWidth={8}
                                                endWidth={8}
                                            />}
                                            <RangeDirective
                                                start={Math.round(data['empathy'].min)}
                                                end={Math.round(data['empathy'].max)}
                                                radius="108%"
                                                color= {new_theme.palette.primary.MedPurple}
                                                startWidth={8}
                                                endWidth={8}
                                            />
                                            {Math.round(data['empathy'].min) < 10 && <RangeDirective
                                                start={Math.round(data['empathy'].max)}
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
                            {data['empathy'].mainDefinition}
                        </Typography>
                        <br />
                        <Box className="results_bubble" sx={{ backgroundColor: new_theme.palette.primary.PWhite, position: 'relative' }}>
                            <Box className="bubble_bg">
                                {data['empathy']["actions"].map((item, index) => <Box key={index} sx={{ my: 1, gap: "5px 20px", display: 'flex' }}>
                                    <CircleIcon sx={{ mt: .5, fontSize: 'medium', border: `2px solid ${new_theme.palette.newSupplementary.NSupText}`, color: 'transparent', borderRadius: '50%' }}></CircleIcon>
                                    <Typography variant="list1">{item}</Typography>
                                </Box>)}
                            </Box>
                        </Box>
                        {
                            data['empathy']['descriptions'].length &&
                            <>
                                <Box sx={{ backgroundColor: new_theme.palette.primary.PPurple, padding: '10px 12px', mt: 2, borderRadius: '8px' }}>
                                    {
                                        data['empathy']['descriptions'].map((item) => (
                                            <Typography variant="body2" component="p" sx={{ fontWeight: '500', color: new_theme.palette.primary.PWhite }}>{item}</Typography>
                                        ))
                                    }
                                </Box>
                            </>
                        }
                    </Box>
                </Grid>
            </Grid>
        </ThemeProvider>
    )
}