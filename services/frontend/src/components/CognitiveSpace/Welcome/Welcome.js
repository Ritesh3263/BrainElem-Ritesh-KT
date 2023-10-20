import React,{useState} from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import ContentService from "services/content.service";
import Abstract_brain from "../../../../src/img/login_screen/brainstorn.png";

// Components
import TestSelection from "components/common/BrainCoreTestSelectionModal"

// MUI v5
import { Box, Container, Divider } from "@mui/material";
import Grid from "@mui/material/Grid";
import Typography from '@mui/material/Typography';
import { ThemeProvider } from "@mui/system";
import { new_theme } from "NewMuiTheme";
import StyledButton from "new_styled_components/Button/Button.styled";
import  BCTestService  from 'services/bcTestRegistration.service'
import Dialog from '@mui/material/Dialog';


// MUI v4

const palette = new_theme.palette

export default function Welcome() {
    const { t } = useTranslation(['mySpace-myResults:']);
    const navigate = useNavigate();
    const [openChoice,setOpenChoice]=useState(false);
    const handleTakeTest=()=>{
        let type='pedagogy';
        const user=ContentService.getItemFromLocalStorage('user');
        console.log("Hi------",user?.age);

        if(user?.age==null || (user?.age>=18 && user?.age<=24)){
            setOpenChoice(!openChoice);
            return;
        }else if(user?.age!=null && user?.age>24){
           type="adult";
        }
       
        navigate(`/content/display/${ContentService.getBraincoreTestId(type)}`)
    }
    return (
        <ThemeProvider theme={new_theme}>
            <Box className="brainstorn">
                <Container maxWidth="xl">
                    <Grid container style={{ backgroundColor: "white", borderRadius: "16px" }} sx={{ padding: { xs: '15px', md: '20px 0 20px 20px', lg: '30px 0px 30px 30px', xl: '40px 0 40px 40px' } }}>
                        <Grid item xs={12}>
                            <Grid container>
                                <Grid item xs={12} md={6} sx={{pr: {md: 3}}}>
                                    <div className="heading" style={{ marginBottom: '30px' }}>
                                        <Typography variant="h1" component="h1">
                                            {t("mySpace-myResults:BRAINCORE TEST")}
                                        </Typography>
                                        <Divider className="heading_divider"></Divider>
                                    </div>
                                    <Typography variant="body3" component="p" sx={{ mb: 4, whiteSpace: 'pre-line' }}>
                                        {t("mySpace-myResults:BRAINCORE WELCOME MESSAGE")}
                                    </Typography>
                                    {BCTestService.getItemFromLocalStorage('user').enableTest && <StyledButton sx={{ mb: 5}} eVariant="primary" eSize='medium'
                                        onClick={ handleTakeTest }>
                                        {t("mySpace-myResults:TAKE TEST")}
                                    </StyledButton>}
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <img src={`${Abstract_brain}`} style={{ width: '100%' }} />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
            <TestSelection openChoice={openChoice} setOpenChoice={setOpenChoice}></TestSelection>
        </ThemeProvider>

    )
}
