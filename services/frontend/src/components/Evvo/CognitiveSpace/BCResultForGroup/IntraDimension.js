import React, { useEffect, useState } from "react";
import {
    Card,
    CardHeader,
    Divider,
    IconButton, ListSubheader,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import Container from '@mui/material/Container';
import Grid from "@mui/material/Grid";
import { useTranslation } from "react-i18next";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import "./BCRresultGroup.scss";
import StyledButton from "new_styled_components/Button/Button.styled";
import { new_theme } from "NewMuiTheme";
import { ThemeProvider } from "@mui/material";

const IntraDimension = () => {
    const { t } = useTranslation();
    const [age, setAge] = React.useState('');
    return (
        <ThemeProvider theme={new_theme}>
            <Container maxWidth="xl" className="mainContainerDiv">
                <Grid container>
                    <Grid item xs={12} sx={{ mb: 4 }}>
                        <Typography variant="h1" component="h1">
                            {t("Intrapersonal Dimensions​​")}
                        </Typography>
                        <Divider variant="insert" className='heading_divider' />
                    </Grid>
                </Grid>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={3} className="inner-inputField">
                        <FormControl variant="filled" fullWidth={true}>
                            <InputLabel id="demo-simple-select-label">{t("Select Teams")}</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                className="select-inner"
                                value={age}
                                label="Age"
                            >
                                <MenuItem>{t("Team 1")}</MenuItem>
                                <MenuItem>{t("Team 2")}</MenuItem>
                                <MenuItem>{t("Team 3")}</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={3} className="inner-inputField">
                        <FormControl variant="filled" fullWidth={true}>
                            <InputLabel id="demo-simple-select-label">{t("Select Users")}</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                className="select-inner"
                                value={age}
                                label="Age"
                            >
                                <MenuItem>{t("Team 1")}</MenuItem>
                                <MenuItem>{t("Team 2")}</MenuItem>
                                <MenuItem>{t("Team 3")}</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={3} >
                        <StyledButton eVariant="primary" eSize="medium" className="viewBbtn">
                            {t("View Result")}
                        </StyledButton>
                    </Grid>
                </Grid>
                <Grid container spacing={5} sx={{ mt: 1 }}>
                    <Grid item xs={12} md={6}>
                        <img src="/img/congnitive-space/cong_img2.png" className="congnitive-img" />
                    </Grid>
                    <Grid item xs={12} md={6} >
                        <div className="rightText">
                            <Typography variant="h2" component="h2" sx={{ mb: 2 }} style={{ color: new_theme.palette.newSupplementary.NSupText }}>
                                {t("Lorem ipsum dolor sit amet consectetur. ​")}
                            </Typography>
                            <Typography variant="body1" component="p">
                                {t("Lorem ipsum dolor sit amet consectetur. Sapien ipsum morbi ipsum pellentesque maecenas ornare placerat ut facilisis. In facilisi lacinia elementum elit massa fermentum eleifend. Tellus pharetra habitasse risus maecenas egestas aenean. Est nibh egestas diam urna.​")}
                            </Typography>

                            <Typography variant="body1" component="p" sx={{ mt: 2 }}>
                                {t("Lorem ipsum dolor sit amet consectetur. Sapien ipsum morbi ipsum pellentesque maecenas ornare placerat ut facilisis. In facilisi lacinia elementum elit massa fermentum eleifend. Tellus pharetra habitasse risus maecenas egestas aenean. Est nibh egestas diam urna.​")}
                            </Typography>
                        </div>
                    </Grid>
                </Grid>
            </Container>
        </ThemeProvider>
    );
};

export default IntraDimension;