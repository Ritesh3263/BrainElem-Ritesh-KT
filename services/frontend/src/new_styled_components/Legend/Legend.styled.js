// MUI v5
import { styled } from '@mui/material/styles';
import { Grid } from '@mui/material';

import EBadge from "styled_components/Badge";

// Detect size of the screen
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';


// MUI v4
import { theme } from 'MuiTheme'
const palette = theme.palette




function useIsWidthUp(breakpoint) {
    const theme = useTheme();
    return useMediaQuery(theme.breakpoints.up(breakpoint));
}

const StyledBar = styled(Grid)({
    overflow: 'hidden',
    margin: "auto",
    borderRadius: "16px",
    backgroundColor: palette.shades.white30,
    justifyContent: 'space-between',
    flexWrap: 'nowrap'
})

const StyledElement = styled(Grid)({
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden'
})




const StyledLegend = (props) => {
    const showPrefix = useIsWidthUp("xl");
    return (
        <StyledBar container xs={12} md={10} sx={{mt: 2, py: 1, px: {xs: 1, lg: 3} }}>
            {props.elements.map(element =>
                <StyledElement>
                    {showPrefix ? element.prefix+" " : ''}
                    <EBadge ecolor={element.ecolor} variant="dot" sx={{ ml: 1, mr: 1, marginTop: "auto", marginBottom: "auto" }} />
                    <span >{element.name}</span>
                </StyledElement>)
            }
        </StyledBar>
    )
}


export default StyledLegend;
