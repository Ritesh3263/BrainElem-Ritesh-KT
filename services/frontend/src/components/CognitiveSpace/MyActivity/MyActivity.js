import React from "react";
import { useTranslation } from "react-i18next";

// MUI v5
import { Box, Container } from "@mui/material";
import Grid from "@mui/material/Grid";
import Typography from '@mui/material/Typography';
import { ThemeProvider } from "@mui/system";
import { new_theme } from "NewMuiTheme";


const MyActivity = () => {
    const { t } = useTranslation(['translation', 'tips', 'traits', 'profiles', 'issues', 'solutions', 'cognitiveSpace', 'cognitiveSpaceFAQ']);
    return (
        <ThemeProvider theme={new_theme}>
            <Box sx={{width: '100%'}}>
                <Container maxWidth="xl">
                    <Grid container style={{ height: '350px', backgroundColor: "white", borderRadius: "16px" }} sx={{ padding: { xs: '15px', md: '20px 0 20px 20px', lg: '30px 0px 30px 30px', xl: '40px 0 40px 40px' } }}>
                        <div className="under_contruction" style={{height: '100%', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '20'}}>
                            <img src="/img/brand/webtest2.png" height={160} />
                            <Typography variant="h1" component="h1" sx={{textAlign: 'center'}}>{t("Page under construction")}</Typography>
                        </div>
                    </Grid>
                </Container>
            </Box>
        </ThemeProvider>
    );
};

export default MyActivity;