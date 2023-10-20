import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import { Box, Container, Divider, Menu, MenuItem } from "@mui/material";
import Grid from "@mui/material/Grid";
import Typography from '@mui/material/Typography';
import { new_theme } from "NewMuiTheme";
import {useNavigate, useParams} from "react-router-dom";
import { ThemeProvider } from "@mui/system";
import { ETabBar } from "new_styled_components";
import ETab from "new_styled_components/Tab/Tab.styled";
import CollapsibleTable from "./TraineeTbl";
import StyledEIconButton from "new_styled_components/IconButton.js/IconButton.styled";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import StyledButton from "new_styled_components/Button/Button.styled";
import Progress from "./Progress";
import TraineeInformation from "./TraineeInformation";
import BCTestService from 'services/bcTestRegistration.service';

export default function FullTrainee(){
    const {t} = useTranslation();
    const [currentTab, setCurrentTab] = useState(0);
    const [userData, setUserData] = useState({})
    async function switchTabHandler(i) {
        setCurrentTab(i);
    }
    const { userId, sessionId } = useParams();
    const navigate = useNavigate();


    useEffect(() => {
        BCTestService.getBCTestTeamsWithProgress(userId,sessionId).then(res => {
            if (res.status === 200 && res?.data) {
                console.log(res.data);
                setUserData(res.data)
            }
        }).catch(err => console.log(err))
    }, [userId]);

    // useEffect(() => {
    //     switch (currentTab) {
    //         case 0:
    //             break;
    //         case 1:
    //             Navigate("./Progress");
    //             break;
    //         case 2:
    //             Navigate("./TraineeInformation");
    //             break;
    //         default:
    //             break;
    //     }
    // }, [currentTab]);
    // useEffect(() => {
    //     switch (currentTab) {
    //         case 0:
    //             break;
    //         case 1:
    //             navigate("/sentinel/myteams/BC-test-registrations/teams");
    //             break;
    //         default:
    //             break;
    //     }
    // }, [currentTab])


    return(
       <ThemeProvider theme={new_theme}>
            <Container maxWidth="xl" className="mainContainerDiv mainBcDiv">
                <Grid container spacing={1}>
                    
                    <Grid item xs={12}>
                        <div className="admin_content">
                            <div className="admin_heading">
                                <div className="teams_header">
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <StyledEIconButton sx={{mr: 3}} color="primary" size="medium"
                                            onClick={async () => {
                                                navigate("/sessions-free")
                                            }}
                                            >
                                                <ChevronLeftIcon />
                                        </StyledEIconButton>
                                        <Grid>
                                            <Typography variant="h3" component="h3" style={{ marginRight: "2rem", color:new_theme.palette.newSupplementary.NSupText }}>{userData?.user?.name} {userData?.user?.surname}</Typography>
                                            {/* <Divider variant="insert" className='heading_divider' /> */}
                                        </Grid>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Grid item xs={12} className="content_tabing" style={{ display: "flex", marginTop: ".5rem" }}>
                            <ETabBar
                                style={{ minWidth: "280px" }}
                                value={currentTab}
                                textColor="primary"
                                variant="fullWidth"
                                onChange={(e, i) => { switchTabHandler(i) }}
                                aria-label="tabs example"
                                className="tab_style"
                            >
                                <ETab label={t("Progress")} eSize='small' />
                                <ETab label={t("Trainee information")} eSize='small' />
                            </ETabBar>
                        </Grid>

                        {currentTab==0 && userData?.progress && <Progress progressData={userData?.progress}/>}
                        {currentTab==1 && userData?.user && <TraineeInformation userData={userData?.user}/>}
                        
                        
                    </Grid>

                </Grid>
            </Container>
       </ThemeProvider>
    )
}