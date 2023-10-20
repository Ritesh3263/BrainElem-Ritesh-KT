// ######################################################
// Component used to preview existing styled_components##
// This component is used to check the consistency of  ##
// implemented components with their design in Figma.  ##
// ######################################################


import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

//MUIv5u
import { Box, Grid, Divider, Container, Typography, MenuItem, TextField } from '@mui/material';

// Custom components
import Navigation from "new_styled_components/Navigation/Navigation.styled";
import { ETextField, ESelect } from "new_styled_components";
import StyledEIconButton from 'new_styled_components/IconButton.js/IconButton.styled';
import StyledButton from "new_styled_components/Button/Button.styled";
import { NewEDataGrid } from 'new_styled_components';
import EAutocomplete from 'new_styled_components/Autocomplete/Autocomplete.styled';


// Context 
import { useMainContext } from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";

// Detect size of the screen
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

// Theme
import { new_theme } from "NewMuiTheme";

// Icons
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

function useIsWidthUp(breakpoint) {
    const theme = useTheme();
    return useMediaQuery(theme.breakpoints.up(breakpoint));
}
const rows = [{ id: 1, text: "Text1" }, { id: 2, text: "Text2" }, { id: 3, text: "Text3" }]
const columns = [
    { field: 'id', headerName: 'number', maxWidth: 80, type: 'number' },
    { field: 'text', headerName: 'text', flex: 1, type: 'text' }
]

const top100Films = [
    { label: 'The Shawshank Redemption', year: 1994 },
    { label: 'The Godfather', year: 1972 },
    { label: 'The Godfather: Part II', year: 1974 },
    { label: 'The Dark Knight', year: 2008 },
    { label: '12 Angry Men', year: 1957 },
    { label: "Schindler's List", year: 1993 },
    { label: 'Pulp Fiction', year: 1994 },
  ];

export default function Preview(props) {
    const { t } = useTranslation(['common', 'sentinel-Admin-Credits']);
    const navigate = useNavigate()
    const { F_showToastMessage, F_handleSetShowLoader } = useMainContext();

    const TABS = ['fonts', 'colors', 'buttons', 'tables']

    const [tab, setTab] = useState('fonts');
    const isSmUp = useIsWidthUp("sm");


    return (<>
        <Container sx={{ p: '32px', maxHeight: '100%' }} maxWidth="xl" footer-text={t('common:POWERED BY BRAINELEM') + " ® " + new Date().getFullYear()} className="mainContainerDiv main_results">
            <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'center' }}>
                <StyledEIconButton sx={{ mr: 3 }} color="primary" size="medium"
                    onClick={async () => {
                        navigate(-1)
                    }}>
                    <ChevronLeftIcon />
                </StyledEIconButton>
                <div className="admin_heading">
                    <Typography variant="h1" component="h1">{"Components"}</Typography>
                    <Divider variant="insert" className='heading_divider' />
                </div>
            </div>
            <Grid container sx={{ height: '80%', flexWrap: 'nowrap', flexDirection: isSmUp ? 'row' : 'column' }} >
                <Navigation triggerActiveIndex={TABS.indexOf(tab)} items={[
                    { name: t("Fonts"), onClick: () => { setTab('fonts') } },
                    { name: t("Colors"), onClick: () => { setTab('colors') } },
                    { name: t("Buttons"), onClick: () => { setTab('buttons') } },
                    { name: t("Tables"), onClick: () => { setTab('tables') } },
                    { name: t("Others"), onClick: () => { setTab('others') } },
                    { name: t("Textfield"), onClick: () => { setTab('Textfield') } },
                    { name: t("Select with Dropdown"), onClick: () => { setTab('SelectwithDropdown') } },
                    { name: t("AutoComplete"), onClick: () => { setTab('AutoComplete') } }
                ]}>
                </Navigation>
                <Grid item>

                    {/* FONTS ###################################################################### */}
                    {tab == "fonts" && <>
                        <Typography variant="body1" >{t("Variant: body1")}</Typography><br />
                        <Typography variant="h1" >{t("Variant: h1")}</Typography><br />
                        <Typography variant="h2" >{t("Variant: h2")}</Typography><br /> 
                        <Typography variant="h3" >{t("Variant: h3")}</Typography><br />
                        {/* ............................................. */}
                        {/* ............................................. */}
                        {/* ............................................. */}

                    </>}
                    {/* BUTTONS ###################################################################### */}
                    {tab == "buttons" && <>
                        <Box sx={{ p: 4, borderRadius: '10px', background: new_theme.palette.primary.PBorderColor }}>
                            <Typography sx={{ display: 'inline-block' }} variant="body1">{"Primary sm ---> "}</Typography>
                            <StyledEIconButton sx={{ m: 1 }} color="primary" size="small"></StyledEIconButton><br />
                            <Typography sx={{ display: 'inline-block' }} variant="body1">{"Primary md ---> "}</Typography>
                            <StyledEIconButton sx={{ m: 1 }} color="primary" size="medium"></StyledEIconButton><br />
                            <Typography sx={{ display: 'inline-block' }} variant="body1">{"Primary lg -----> "}</Typography>
                            <StyledEIconButton sx={{ m: 1 }} color="primary" size="large"></StyledEIconButton><br />


                            <StyledButton sx={{ m: 1 }} eSize='small' eVariant='primary'>{"Primary sm"}</StyledButton><br />
                            <StyledButton sx={{ m: 1 }} eSize='small' eVariant='secondary'>{"Secondary sm"}</StyledButton><br />
                        </Box>
                    </>}
                    {/* COLORS ###################################################################### */}
                    {tab == "colors" && <>
                        <Typography variant="h3">{"Primary"}</Typography>

                        <Typography sx={{ display: 'inline-block' }} variant="body1">{"primary.PPurple"}</Typography>
                        <Box sx={{ widht: '100px', height: '100px', background: new_theme.palette.primary.PPurple }}></Box>

                        <Typography sx={{ display: 'inline-block' }} variant="body1">{"primary.PBorderColor"}</Typography>
                        <Box sx={{ widht: '100px', height: '100px', background: new_theme.palette.primary.PBorderColor }}></Box>


                    </>}
                    {/* TABLES ###################################################################### */}
                    {tab == "tables" && <>
                        <NewEDataGrid
                            checkboxSelection={true}
                            rows={rows}
                            columns={columns}
                        />
                    </>}
                    {/* OTHERS ###################################################################### */}
                    {tab == "others" && <>
                        <StyledButton sx={{ m: 1 }} onClick={() => { F_showToastMessage('Error   message', 'error') }} eSize='small' eVariant='primary'>{"Toast - error"}</StyledButton><br />
                        <StyledButton sx={{ m: 1 }} onClick={() => { F_showToastMessage('Info    message', 'info') }} eSize='small' eVariant='primary'>{"Toast - info"}</StyledButton><br />
                        <StyledButton sx={{ m: 1 }} onClick={() => { F_showToastMessage('Success message', 'success') }} eSize='small' eVariant='primary'>{"Toast - success"}</StyledButton><br />

                        <StyledButton sx={{ m: 1 }} onClick={() => { F_handleSetShowLoader(true); setTimeout(() => { F_handleSetShowLoader(false) }, 1000) }} eSize='small' eVariant='primary'>{"Show loader"}</StyledButton><br />
                    </>}

                    {/* TextField ###################################################################### */}
                    {tab == "Textfield" && <>
                        <Typography sx={{ display: 'inline-block' }} variant="body1">{"Small ---> "}</Typography>
                        <ETextField label={t("Demo")} size="small" /><br /><br />

                        <Typography sx={{ display: 'inline-block' }} variant="body1">{"Medium ---> "}</Typography>
                        <ETextField label={t("Demo")} size="medium" />
                    </>
                    }

                    {tab == "SelectwithDropdown" && <>
                        <Typography sx={{ display: 'inline-block' }} variant="body1">{"Filled ---> "}</Typography><br />
                        <ESelect
                            variant="filled"
                            size="medium"
                            label={t("Select with Dropdown")}
                            sx={{minWidth: '300px'}}
                        >
                                <MenuItem> Menu 1</MenuItem>
                                <MenuItem> Menu 1</MenuItem>
                                <MenuItem> Menu 1</MenuItem>
                            
                        </ESelect>
                        <br /><br />

                        <Typography sx={{ display: 'inline-block' }} variant="body1">{"Outline ---> "}</Typography><br />
                        <ESelect
                            type="round"
                            size="medium"
                            label={t("Select with Dropdown")}
                        >
                                <MenuItem> Menu 1</MenuItem>
                                <MenuItem> Menu 1</MenuItem>
                                <MenuItem> Menu 1</MenuItem>
                            
                        </ESelect>
                    </>
                    }

                    {tab == "AutoComplete" && <>
                        {/* <Typography sx={{ display: 'inline-block' }} variant="body1">{"Filled ---> "}</Typography><br />
                        <EAutocomplete
                            variant="filled"
                            disableClearable={true}
                            size="medium"
                            label="Movie"
                            options={top100Films}
                            sx={{ width: 300 }}
                            renderInput={(params) => <TextField {...params} />}
                        />
                        <br /><br /> */}

                        <Typography sx={{ display: 'inline-block' }} variant="body1">{"Outline ---> "}</Typography><br />
                        <EAutocomplete
                            variant="outlined"
                            disableClearable={true}
                            size="medium"
                            label="Movie"
                            options={top100Films}
                            sx={{ width: 300 }}
                            fullWidth={true}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </>
                    }



                </Grid>

            </Grid>


        </Container>

    </>
    )

}