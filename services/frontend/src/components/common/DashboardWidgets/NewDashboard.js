import React, { lazy } from 'react';
import { useTranslation } from "react-i18next";
import { Box, Container } from "@mui/material";
import Grid from "@mui/material/Grid";
import Typography from '@mui/material/Typography';
import { ThemeProvider } from "@mui/system";
import { new_theme } from "NewMuiTheme";

const SwitchByRoles = lazy(() => import("./SwitchByRoles/SwitchByRoles"));

function NewDashboard() {
    const { t } = useTranslation();
    return (
        <>
            <ThemeProvider theme={new_theme}>
                <Box>
                    <Container maxWidth="xl">
                        <Grid container style={{ height: 'auto', backgroundColor: "white", borderRadius: "16px" }} sx={{ padding: { xs: '15px', md: '10px 10px 10px 10px', lg: '15px 15px 15px 15px', xl: '25px 25px 25px 25px' } }}>
                            <SwitchByRoles/>
                            {/* <div className='dashboard_dummy'>
                                <img src={dashboardimg} style={{width: '100%'}} />
                            </div> */}
                        </Grid>
                    </Container>
                </Box>
            </ThemeProvider>
            {/* <Grid container spacing={2} className='my-1 px-1'>
                <SwitchByRoles/>
            </Grid> */}
        </>
        
    );
}

export default NewDashboard;