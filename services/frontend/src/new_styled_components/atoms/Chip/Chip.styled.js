
import { styled } from "@mui/system";

// MUI v5
import Chip from '@mui/material/Chip';
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


const StyledChip = styled(Chip)((props) => {

    // By default it will hide labels on mobile
    // When `hidelabels` is set it will always hide labesl
    // When `showlabels` is set it will always show labels 
    const isMdUp = useIsWidthUp("md");
    let hideLabel = props.icon && (props.hidelabels || (!props.showlabels && !isMdUp))


    let labelColor = props.labelcolor ? props.labelcolor : palette.primary.darkViolet;
    let backgroundColor = props.background ? props.background : palette.neutrals.fadeViolet;
    let borderColor = props.bordercolor ? props.bordercolor : palette.neutrals.darkestGrey 

    return {
        fontSize: '10px',
        lineHeight: '18px !important',
        borderRadious: '12px',
        fontFamily: 'Roboto',
        color: labelColor,
        background: backgroundColor,
        border: (props.icon || props.border) ? `solid 1px ${borderColor}` : "none",
        "& svg": {
            backgroundColor: 'unset !important'
        },
        ...(props.firstletter ? {
            width: '30px',
            '& span': {
                textAlign: 'center',
                lineHeight: '100%',
                fontSize: 0,
                '&:first-letter': {
                    fontSize: 10,
                    lineHeight: '18px'
                }
            }
        } : {}),
        ...(hideLabel ? {
            position: 'relative',
            width: '36px',
            "& .MuiChip-icon ": {
                position: 'absolute',
                left: '4px',
            },
            "& .MuiChip-iconMedium": {
                left: '3px',
            },
            "& .MuiChip-iconLarge": {
                left: '3px',
            },
            "& .MuiChip-label": {
                display: 'none',
            }
        } : {}),


    }
})

export default StyledChip;