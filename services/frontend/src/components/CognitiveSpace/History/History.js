import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
// Components
import MenuItem from '@mui/material/MenuItem';

import EVerticalProperty from "styled_components/VerticalProperty";

import Box from '@mui/material/Box';
import { Grid } from "@mui/material";
import { Radar, RadarChart, PolarGrid, BarChart, Bar, PolarAngleAxis, PolarRadiusAxis, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Line, Legend } from 'recharts';

// Services
import AuthService from "services/auth.service";

// Context 
import { useMainContext } from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";

import { Divider } from "@mui/material";
import Typography from '@mui/material/Typography';
import { ThemeProvider } from "@mui/material";
import { new_theme } from "NewMuiTheme";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import "./History.scss"
import filterFn from "components/common/Filters/Filter";
import StyledButton from "new_styled_components/Button/Button.styled";
import StyledEIconButton from "new_styled_components/IconButton.js/IconButton.styled";

export default function History({ results, setResults, setHistory }) {
    console.log(results)
    const { t } = useTranslation(['mySpace-myResults', 'traits']);
    // Chart
    const [radarChartData, setRadarChartData] = useState([])
    const [radarChartElements, setRadarChartElements] = useState()

    const [radarChartResults1, setRadarChartResults1] = useState()
    const [radarChartResults2, setRadarChartResults2] = useState()

    // Selceted value
    const [activeLegendElement, setActiveLegendElement] = useState('current-performance-indicator')

    const { F_getLocalTime } = useMainContext();

    // // When component is loaded
    // useEffect(() => {
    //     // By default set latest results(first and second in the array)
    //     if (results?.length) {
    //         setRadarChartResults1(results[0])
    //         setRadarChartResults2(results[1])
    //     }
    // }, []);

    // // When component is loaded
    // useEffect(() => {
    //     // By default set latest result(first in the array)
    //     if (radarChartResults1 && radarChartResults2) {
    //         // Set data for chart ###############################################################################
    //         var data = [
    //             { abbreviation: 'QNAD' },//1
    //             { abbreviation: 'A1' },//2
    //             { abbreviation: 'A2' },//3
    //             { abbreviation: 'D' },//4
    //             { abbreviation: 'N2' },//5
    //             { abbreviation: 'N1' }//6

    //         ];

    //         [radarChartResults1, radarChartResults2].forEach(result => {
    //             if (result?.traits) {
    //                 data[0][result._id] = result.traits['current-performance-indicator'].normalizedValue/10
    //                 data[1][result._id] = result.traits['communication-strategy'].normalizedValue
    //                 data[2][result._id] = result.traits['cooperation'].normalizedValue
    //                 data[3][result._id] = result.traits['regularity'].normalizedValue
    //                 data[4][result._id] = result.traits['self-confidence'].normalizedValue
    //                 data[5][result._id] = result.traits['self-activation'].normalizedValue

    //             }
    //         })
    //         setRadarChartData(data)

    //         // Render chart
    //         setRadarChartElements(<>{[radarChartResults1, radarChartResults2].map(result => {
    //             return <Radar key={result._id+new Date()} name={F_getLocalTime(result.createdAt, true)} dataKey={result._id} stroke={getColorForChart(result)} fill={getColorForChart(result)} fillOpacity={0.3} />
    //         })}
    //         </>)
    //     }
    // }, [radarChartResults1, radarChartResults2]);






    const getLineChart = (name, traits, percentageTraits = []) => {
        // const trait_name = ['self-activation', 'self-confidence', 'communication-strategy', 'cooperation', 'regularity', 'self-motivation', 'self-knowledge', 'self-control', 'adaptability', 'intuition']
        var data = [];
        results.slice().reverse().forEach(result => {
            let element = { "date": F_getLocalTime(result.createdAt, true) }
            traits.forEach(traitName => {
                element[traitName] = Math.round(result.traits[traitName].normalizedValue * 10) / 10
            })
            percentageTraits.forEach(traitName => {
                element[traitName] = Math.round(result.traits[traitName].normalizedValue * 10) / 10
            })
            data.push(element)
        })

        const colorsfill = (index, name) => {
            switch (name) {
                case 'self-activation':
                    return new_theme.palette.primary.PinkPurple
                case 'self-confidence':
                    return new_theme.palette.secondary.Yellow
                case 'communication-strategy':
                    return new_theme.palette.secondary.Turquoise
                case 'cooperation':
                    return new_theme.palette.primary.MedPurple
                case 'regularity':
                    return new_theme.palette.secondary.DarkPurple
                case 'self-motivation':
                    return new_theme.palette.primary.PinkPurple
                case 'self-knowledge':
                    return new_theme.palette.secondary.Yellow
                case 'self-control':
                    return new_theme.palette.secondary.Turquoise
                case 'adaptability':
                    return new_theme.palette.primary.MedPurple
                case 'intuition':
                    return new_theme.palette.secondary.DarkPurple
                default:
                    return new_theme.palette.secondary.Lavender
            }
        }

        return (
            <ThemeProvider theme={new_theme}>
                <Box style={{ boxShadow: 'none', display: "block" }}>
                    <Grid container>
                        {/* CHART */}
                        <Grid item xs={12} lg={12} >
                            <div className="bar_graph" style={{ backgroundColor: new_theme.palette.newSupplementary.SupCloudy, border: `1px solid ${new_theme.palette.newSecondary.NSIconBorder}`, padding: '24px', borderRadius: '10px' }}>
                                <div className="graph_heading">
                                    <Typography variant="subtitle0" component="h3" sx={{ p: 0, }}>
                                        {name}
                                    </Typography>
                                    <Typography variant="subtitle3" component="p" sx={{ p: 0, fontWeight: '400' }}>
                                        {F_getLocalTime(results[results.length - 1].createdAt, true) + " - " + F_getLocalTime(results[0].createdAt, true)}
                                    </Typography>

                                </div>
                                <ResponsiveContainer width="100%" height={400}>
                                    <LineChart data={data}>
                                        <CartesianGrid yAxisId='left' stroke={new_theme.palette.shades.white70} />
                                        <XAxis
                                            tickFormatter={(date) => { return (date == F_getLocalTime(results[0].createdAt, true)) ? "" : date }}
                                            tickMargin={15} tickLine={false} dx={40} tick={{ fill: new_theme.palette.neutrals.darkGrey }} dataKey="date" stroke={new_theme.palette.shades.white70} />
                                        <YAxis tickLine={false} tick={{ fill: new_theme.palette.neutrals.darkGrey }} type="number" stroke={new_theme.palette.shades.white70} scale="linear" yAxisId='left' domain={[0, 10]} />
                                        {percentageTraits.length &&
                                            <YAxis tickLine={false} tick={{ fill: new_theme.palette.neutrals.darkGrey }} type="number" stroke={new_theme.palette.shades.white70} scale="linear" yAxisId='right' orientation="right" unit="%" domain={[0, 100]} />
                                        }
                                        {traits.map(traitName =>
                                            <Line key={traitName} yAxisId='left'
                                                strokeOpacity={(!activeLegendElement || activeLegendElement == traitName) ? 1 : 0.3}
                                                strokeWidth={(activeLegendElement == traitName) ? 5 : 2}
                                                dot={{ fill: colorsfill(traits.indexOf(traitName), traitName), strokeWidth: (activeLegendElement == traitName) ? 4 : 2, strokeHeight: (activeLegendElement == traitName) ? 4 : 2, borderRadius: '50%' }}
                                                name={t(`traits:${traitName}-short-name`)}
                                                // name={t(`traits:${traitName}`)}
                                                dataKey={traitName}
                                                // stroke={colors[traits.indexOf(traitName)]}
                                                stroke={colorsfill(traits.indexOf(traitName), traitName)}
                                                sx={{ borderRadius: '50%' }}
                                            />
                                        )}
                                        {percentageTraits.map(traitName =>
                                            <Line key={traitName} yAxisId='right'
                                                strokeOpacity={(!activeLegendElement || activeLegendElement == traitName) ? 1 : 0.3}
                                                strokeWidth={(activeLegendElement == traitName) ? 5 : 2}
                                                dot={{ fill: colorsfill(traits.indexOf(traitName), traitName), strokeWidth: (activeLegendElement == traitName) ? 4 : 2, strokeHeight: (activeLegendElement == traitName) ? 4 : 2, borderRadius: '50%' }}
                                                name={t(`traits:${traitName}-short-name`)}
                                                // name={t(`traits:${traitName}`)}
                                                dataKey={traitName}
                                                // stroke='#ccb723'
                                                stroke={colorsfill(traits.indexOf(traitName), traitName)}
                                                sx={{ borderRadius: '50%' }}
                                            />
                                        )}
                                        <Legend
                                            onClick={(e) => {
                                                if (e.dataKey == activeLegendElement) setActiveLegendElement(undefined)
                                                else setActiveLegendElement(e.dataKey)
                                            }}
                                            align="left"
                                            wrapperStyle={{ paddingTop: '40px', paddingLeft: '60px', cursor: 'pointer' }}
                                            formatter={(value, entry, index) => {
                                                let style = { paddingRight: 20, color: new_theme.palette.neutrals.darkGrey }
                                                // if (activeLegendElement == entry.dataKey) style.fontWeight = '800'
                                                return (<span style={style}>{value}</span>)

                                            }}
                                            iconType={'rect'}>
                                        </Legend>
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </Grid>
                    </Grid>
                </Box>
            </ThemeProvider>
        )
    }

    return (
        <>
            <ThemeProvider theme={new_theme}>
                <Grid item xs={12}>
                    <div style={{display: 'flex', alignItems: 'center', marginBottom: '20px'}}>
                        <StyledEIconButton color="primary" size="medium" onClick={() => setHistory(false)} sx={{mr: 2}}>
                                <ChevronLeftIcon />
                            </StyledEIconButton>
                        <div>
                            <Typography variant="h1" component="h1">{t("mySpace-myResults:HISTORY")}</Typography>
                            <Divider variant="insert" className='heading_divider' />
                        </div>
                        {/* <StyledButton eVariant="primary" eSize="medium" onClick={() => setHistory(false)}>
                            {t("Back")}
                        </StyledButton> */}
                    </div>

                </Grid>
                <Grid item xs={12}>
                    <Grid container spacing={6}>
                        <Grid item xs={12} xl={6}>
                            {getLineChart(t("mySpace-myResults:NAD VALUES"), ['self-activation', 'self-confidence', 'communication-strategy', 'cooperation', 'regularity'], ['current-performance-indicator'])}
                        </Grid>
                        <Grid item xs={12} xl={6}>
                            {getLineChart(t("traits:intrapersonal-intelligence-short-name"), ["self-motivation", "self-knowledge", "self-control", "adaptability", "intuition"])}
                        </Grid>
                    </Grid>
                </Grid>
                
                {/* 
                <Grid item xs={6}></Grid>
                <Grid container item xs={12} xl={6} sx={{ pt: 1, pr: { xs: 0, lg: 1 }, pb: 1, alignContent: "flex-start" }}>
                    {getLineChart(t("traits:self-development-short-name"), ["self-esteem", "stress-management", "sense-of-mastery", "risk-taking"])}
                </Grid>
                <Grid item xs={6}></Grid>
                <Grid container item xs={12} xl={6} sx={{ pt: 1, pr: { xs: 0, lg: 1 }, pb: 1, alignContent: "flex-start" }}>
                    {getLineChart(t("traits:self-assertion-short-name"), ["assertiveness", "extraversion", "ambition", "emotional-distance", "respect"])}
                </Grid>
                <Grid item xs={6}></Grid>
                <Grid container item xs={12} xl={6} sx={{ pt: 1, pr: { xs: 0, lg: 1 }, pb: 1, alignContent: "flex-start" }}>
                    {getLineChart(t("traits:leadership-short-name"), ["mediation-and-influence", "empathy", "need-for-independence", "motivation", "methodology-and-organization"])}
                </Grid> */}
                {/* <Grid container item xs={12} lg={7} sx={{pt:1, pr:{xs:0, lg:1}, pb:1, alignContent: "flex-start"}} >
                    <ECard style={{display:"block"}}>
                        <Grid container  xs={12} sx={{p:"24px"}}>
                            <Grid xs={12}>
                                <Typography  sx={{ fontFamily: "Nunito" ,lineHeight:"36px", fontSize: "24px", color:new_theme.palette.primary.lightViolet, fontWeight:"bold" }} >
                                    {t('Self-managment')} 
                                </Typography>
                            </Grid> 
                            <Grid xs={12}>
                                <Typography sx={{lineHeight:"24px",fontStyle: 'italic', fontFamily:"Roboto", fontSize: "16px", color: new_theme.palette.neutrals.almostBlack }} >
                                    {t("Individual factors")}
                                </Typography>
                            </Grid>
                            <Grid container sx={{ pt:2}} xs={12} lg={12}>
                                <ResponsiveContainer width="95%" height={400}>
                                    <BarChart  data={data2}>
                                        <XAxis dataKey="name"/>
                                        <YAxis/>
                                        <Bar dataKey="Self-knowledge" fill="#15A3A5"  radius={[18, 18, 18, 18]} />
                                        <Bar dataKey="Self-control" fill="#A85CFF"  radius={[18, 18, 18, 18]}/>
                                        <Bar dataKey="Self-esteem" fill="#F765A3"  radius={[18, 18, 18, 18]} />
                                        <Bar dataKey="Stress Management" fill="#DCA3FF"  radius={[18, 18, 18, 18]} />
                                        <Bar dataKey="Emotional distance" fill="#82F0FF"   radius={[18, 18, 18, 18]}/>
                                        <Legend ></Legend>
                                    </BarChart>
                                </ResponsiveContainer>
                            </Grid>
                        </Grid>
                    </ECard>              
                </Grid> */}
            </ThemeProvider>

        </>
    )
}