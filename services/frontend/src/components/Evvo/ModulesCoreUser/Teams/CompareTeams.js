// Compare BrinCore values of selected teams
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";


// MuiV5
import Container from '@mui/material/Container';
import Grid from "@mui/material/Grid";
import MenuItem from '@mui/material/MenuItem';
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";

//Recharts
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend } from 'recharts';

//Services
import TeamService from "services/team.service"

// Context 
import { useMainContext } from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";


import Typography from '@mui/material/Typography';
import { ThemeProvider } from "@mui/material";
import { new_theme } from "NewMuiTheme";


// Compare BrinCore values of selected teams
export default function Compare() {
    const { t } = useTranslation(['sentinel-MyTeams-Compare', 'common']);
    // Chart
    const [radarChartData, setRadarChartData] = useState([])
    const [radarChartElements, setRadarChartElements] = useState()

    const [radarChartData1, setRadarChartData1] = useState()
    const [radarChartData2, setRadarChartData2] = useState()

    const [teams, setTeams] = useState()
    const [teamSelected1, setTeamSelected1] = useState()
    const [teamSelected2, setTeamSelected2] = useState()

    const { F_showToastMessage, F_handleSetShowLoader } = useMainContext();


    // When component is loaded
    // Fetch list of available teams
    useEffect(() => {
        F_handleSetShowLoader(true)
        TeamService.readAllTeam().then(res => {
            if (res.status === 200) {
                setTeams(res.data.data);
                console.log(teams)

                setTeamSelected1(res.data.data[0])
                setTeamSelected2(res.data.data[1])
                F_handleSetShowLoader(false)
            }
        })
    }, []);

    useEffect(() => {// Load results for team if exist when team is selected
        if (teamSelected1) getData(teamSelected1, setRadarChartData1)
    }, [teamSelected1]);

    useEffect(() => {// Load results for team if exist when team is selected
        if (teamSelected2) getData(teamSelected2, setRadarChartData2)
    }, [teamSelected2]);


    // Load results for team if exist
    function getData(team, setData) {
        F_handleSetShowLoader(true)
        TeamService.teamModule({
            usersIds: team.trainee.map(u => u._id),
            "traitsKeys": [
                "current-performance-indicator",
                "self-activation",
                "self-confidence",
                "communication-strategy",
                "cooperation",
                "regularity"
            ]
        }, 'employee').then(res => {
            setData(res.data)
            F_handleSetShowLoader(false)
        }).catch(error => {
            setRadarChartElements(undefined)
            F_handleSetShowLoader(false)

        })
    }



    // When resuts for both teams exists
    // Prepare graph component
    useEffect(() => {
        // By default set latest result(first in the array)
        if (radarChartData1 && radarChartData2) {
            F_handleSetShowLoader(true)
            // Set data for chart ###############################################################################
            var data = [
                { abbreviation: 'QNAD' },//1
                { abbreviation: 'A1' },//2
                { abbreviation: 'A2' },//3
                { abbreviation: 'D' },//4
                { abbreviation: 'N2' },//5
                { abbreviation: 'N1' }//6

            ];

            [radarChartData1, radarChartData2].forEach((radarData, index) => {
                var traits = radarData?.traits
                if (traits) {
                    data[0][index] = traits['current-performance-indicator'].normalizedValue / 10
                    data[1][index] = traits['communication-strategy'].normalizedValue
                    data[2][index] = traits['cooperation'].normalizedValue
                    data[3][index] = traits['regularity'].normalizedValue
                    data[4][index] = traits['self-confidence'].normalizedValue
                    data[5][index] = traits['self-activation'].normalizedValue

                }
            })
            setRadarChartData(data)

            // Render chart
            let Radar1 = <Radar key={teamSelected1.name + new Date()} name={teamSelected1.name} dataKey={0} stroke={new_theme.palette.secondary.Yellow} fill={new_theme.palette.secondary.Yellow} fillOpacity={0} />
            let Radar2 = <Radar key={teamSelected2.name + new Date()} name={teamSelected2.name} dataKey={1} stroke={new_theme.palette.secondary.Turquoise}  fill={new_theme.palette.secondary.Turquoise} fillOpacity={0} />
            setRadarChartElements(<>{Radar1}{Radar2}</>)
            F_handleSetShowLoader(false)
        }
    }, [radarChartData1, radarChartData2]);






    return (
        <>

            <ThemeProvider theme={new_theme}>
                <Container maxWidth="xl" className="mainContainerDiv team_list">
                    <Grid container spacing={1}>
                        <Grid item xs={12} className="minHeight-60vh">


                            <Grid className="admin_heading" container alignItems="center" justifyContent="space-between">
                                <Grid>
                                    <Typography variant="h1" component="h1" >
                                        {t("sentinel-MyTeams-Compare:COMPARE_TEAMS")}
                                    </Typography>
                                    <Divider variant="insert" className='heading_divider' />
                                </Grid>

                                <Grid xs={12}>
                                    <Typography sx={{ lineHeight: "24px", fontStyle: 'italic', fontFamily: "Roboto", pt: "16px", mb: "16px", fontSize: "16px", color: new_theme.palette.neutrals.almostBlack }} >
                                        {t("sentinel-MyTeams-Compare:SELECT_TEAMS_TO_COMPARE")}
                                    </Typography>
                                </Grid>
                                <Grid container xs={12}>
                                    <Grid container spacing={2} sx={{ maxWidth: '600px !important' }} >
                                        <Grid item xs={12} sm={6}>

                                            <FormControl margin="dense" fullWidth={true}
                                                variant={"filled"}
                                            >
                                                <InputLabel id="select-team1-label">{t("sentinel-MyTeams-Compare:SELECT_TEAM")}</InputLabel>
                                                <Select
                                                    labelId="select-team1-label"
                                                    id="select-team1"
                                                    value={teamSelected1?._id ?? ''}
                                                    onChange={(e) => setTeamSelected1(teams.find((t) => t._id === e.target.value))}
                                                >
                                                    {teams?.map(function (team, i) {
                                                        return <MenuItem
                                                            disabled={team._id == teamSelected2?._id}
                                                            value={team._id}
                                                            key={team._id}>
                                                            {team.name}
                                                            <Typography component="span" sx={{ pl: '4px', fontSize: '10px !important' }}>
                                                                {" ( " + t("sentinel-MyTeams-Compare:{{NUMBER_OF_TEAM_MEMBERS_WITH_RESULT}}/{{NUMBER_OF_TEAM_MEMBERS}} MEMBERS", { NUMBER_OF_TEAM_MEMBERS: team.trainee.length, NUMBER_OF_TEAM_MEMBERS_WITH_RESULT: team?.brainCoreTest?.completed }) + " )"}
                                                            </Typography>
                                                        </MenuItem>
                                                    })}
                                                </Select>
                                            </FormControl>

                                        </Grid>
                                        <Grid item xs={12} sm={6}>


                                            <FormControl margin="dense" fullWidth={true}
                                                variant={"filled"}
                                            >
                                                <InputLabel id="select-team2-label">{t("sentinel-MyTeams-Compare:SELECT_TEAM")}</InputLabel>
                                                <Select
                                                    labelId="select-team2-label"
                                                    id="select-team2"
                                                    value={teamSelected2?._id ?? ''}
                                                    onChange={(e) => setTeamSelected2(teams.find((t) => t._id === e.target.value))}
                                                >
                                                    {teams?.map(function (team, i) {
                                                        return <MenuItem
                                                            disabled={team._id == teamSelected1?._id}
                                                            value={team._id}
                                                            key={team._id}>
                                                            {team.name}
                                                            <Typography component="span" sx={{ pl: '4px', fontSize: '10px !important' }}>
                                                                {" ( " + t("sentinel-MyTeams-Compare:{{NUMBER_OF_TEAM_MEMBERS_WITH_RESULT}}/{{NUMBER_OF_TEAM_MEMBERS}} MEMBERS", { NUMBER_OF_TEAM_MEMBERS: team.trainee.length, NUMBER_OF_TEAM_MEMBERS_WITH_RESULT: team?.brainCoreTest?.completed }) + " )"}
                                                            </Typography>
                                                        </MenuItem>
                                                    })}
                                                </Select>
                                            </FormControl>


                                        </Grid>
                                    </Grid>
                                </Grid>
                                {/* CHART */}
                                {radarChartElements && <Grid container sx={{ margin: "auto", justifyContent: "center", pt: 5 }} xs={12} lg={6}>
                                    <RadarChart height={300} width={300}

                                        outerRadius="80%" data={radarChartData}>
                                        <PolarGrid />
                                        <PolarAngleAxis dataKey="abbreviation" />
                                        <PolarRadiusAxis angle={30} domain={[1, 10]} />
                                        {radarChartElements}
                                        <Legend ></Legend>
                                    </RadarChart>
                                </Grid>}
                                {!radarChartElements &&
                                    <Typography sx={{ maxWidth: '600px', lineHeight: "24px", fontStyle: 'italic', fontFamily: "Roboto", pt: "16px", mb: "16px", fontSize: "16px", color: new_theme.palette.neutrals.almostBlack }} >
                                        {t("sentinel-MyTeams-Compare:NO_RESULTS")}
                                    </Typography>

                                }
                            </Grid>
                        </Grid>
                    </Grid>
                </Container>
            </ThemeProvider>

        </>
    )
}