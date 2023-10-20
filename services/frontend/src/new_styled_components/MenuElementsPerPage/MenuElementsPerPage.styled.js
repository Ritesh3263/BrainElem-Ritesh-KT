import React, { useState } from "react";
import { useTranslation } from "react-i18next";

// MUIv5
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';


import EMenu from 'styled_components/Menu';
import MenuItem from '@mui/material/MenuItem';


// Icons
import { EIconButton } from "styled_components";
import SvgIcon from '@mui/material/SvgIcon';
import { ReactComponent as MoreIcon } from 'icons/icons_32/Sort_D_32.svg';

// MUI v4
import { theme } from "MuiTheme";

// Component for dislaying list pagination - contains button
// `maxPerPage` - how many elements on the single page
// `options` - what options to select
const MenuElementsPerPage = ({ maxPerPage, setMaxPerPage, options = [3, 5, 15] }) => {
    const { t } = useTranslation();

    // Element for opening pages menu
    const [pagesElement, setPagesElement] = useState(null);
    const openPagesMenu = Boolean(pagesElement);

    return (
        <>
            <Grid container sx={{ justifyContent: 'center', pb: '16px' }}>


                <Grid container
                    sx={{ width: 'fit-content', borderRadius: '16px', justifyContent: 'flex-end', alignItems: 'center', background: theme.palette.shades.white70 }}
                >
                    <Typography sx={{ ...theme.typography.p, fontSize: 14, pl: '8px', pr:'2px' }}>{t("View No") + ":"}</Typography>
                    <Typography sx={{ ...theme.typography.p, fontSize: 16, pr: '8px' }}>{maxPerPage}</Typography>
                    <EIconButton onClick={(e) => { setPagesElement(e.currentTarget) }} size="small" color="primary" sx={{}}>
                        <SvgIcon sx={{ '& path': { stroke: "white" } }} viewBox="0 0 32 32" component={MoreIcon} />
                    </EIconButton>
                </Grid>
                <EMenu
                    anchorEl={pagesElement}
                    open={openPagesMenu}
                    onClose={() => { setPagesElement(null) }}
                >

                    {options.map((num, index) =>
                        <MenuItem key={index} onClick={() => { setMaxPerPage(num); setPagesElement(null) }}>
                            <Typography sx={{ ...theme.typography.p, fontSize: 14 }}>{num}</Typography>
                        </MenuItem>
                    )}


                </EMenu>
            </Grid>
        </>
    )
}

export default MenuElementsPerPage;