
import React from "react";
import { useNavigate, useParams } from "react-router-dom";

import { styled } from '@mui/system';
import { Typography, Grid } from '@mui/material';

// Detect size of the screen
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

//Services
import CommonService from "services/common.service";


// MUI v4
import { theme } from 'MuiTheme'
const palette = theme.palette


function useIsWidthUp(breakpoint) {
    const theme = useTheme();
    return useMediaQuery(theme.breakpoints.up(breakpoint));
}


const StyledGrid = styled(Grid)({
    cursor: 'pointer',
    height: '72px',
    width: '242px',
    paddingLeft: 20,
    position: 'absolute',
    alignItems: 'center',
    right: 0,
    top: 'auto',
    zIndex: 1000,
    color: 'white',
    background: theme.palette.gradients.pink,

    borderTopLeftRadius: 32,
    borderBottomLeftRadius: 32,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    boxShadow: "0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)",
    '&:hover': {
        filter: "brightness(92%)"
    }
})


export default function EBrainCoreLabel(props) {
    const isSmUp = useIsWidthUp('sm')
    const navigate = useNavigate()

    return (<>
        {<StyledGrid container onClick={() => navigate('/myspace')}>
            <img alt='' style={{width: 42, height: 51, marginRight: '8px'}}  src="/img/icons/braincore-icon.svg" />
            <Typography sx={{ ...theme.typography.h, fontSize: '24px', color: theme.palette.primary.creme }}>{"BrainCore test"}</Typography>
        </StyledGrid>
        }</>

    )
}