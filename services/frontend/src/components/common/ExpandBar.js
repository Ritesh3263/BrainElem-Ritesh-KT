import Grid from '@mui/material/Grid';

//Icons
import SvgIcon from "@mui/material/SvgIcon";
import { ReactComponent as ArrowDownIcon } from 'icons/icons_48/Arrow small D.svg';
import { ReactComponent as ArrowUpIcon } from 'icons/icons_48/Arrow small U.svg';

// MUI v5
import { Accordion, AccordionSummary, AccordionDetails, Typography } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { styled } from '@mui/material/styles';

// Styled components
import EIconButton from 'styled_components/EIconButton';

// MUI v4
import { theme } from "../../MuiTheme";

const StyledAccordion = styled(Accordion)((props) => {
    return{ 
        '&.MuiPaper-root': { 
            width: '100%',
            background: 'transparent',
            boxShadow: 'none'
        },
        '&.MuiAccordion-root':{
            //marginBottom: '24px'
        },
        '&.MuiAccordion-root::before': {
            height: 0, 
            width: 0
        }
    }
})

const Bar = styled(AccordionSummary)((props) => {
    return {
        '&.MuiAccordionSummary-root': {
            background: props.barColor,
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            // height: '40px',
            minHeight: 'unset',
            padding: '8px',

        },
        '&.MuiAccordionSummary-root::before': props.expanded ? {
            content: '" "',
            zIndex: -1,
            height: '5px',
            width: '5px',
            background: props.childColor,
            position: 'absolute',
            bottom: 0,
            right: 0
        } : {},
        '&.MuiAccordionSummary-root::after': props.expanded ? {
            content: '" "',
            zIndex: -1,
            height: '5px',
            width: '5px',
            background: props.childColor,
            position: 'absolute',
            bottom: 0,
            left: 0
        } : {},
        '& .MuiAccordionSummary-content':{
            overflow: 'hidden',
            margin: '0px !important'
        }
    }
})

const Label = styled(Typography)((props) => {
    return {
        color: props.textColor,
        whiteSpace: 'nowrap',
        textOverflow: `ellipsis !important`,
        overflow: 'hidden',
        width: '100%'
    }
})


const Child = styled(AccordionDetails)((props) => {
    return {
        "&.MuiAccordionDetails-root": {
            ...(props.padding ? {} : {padding: '0px'}),
            background: props.childColor,
            borderBottomLeftRadius: '8px',
            borderBottomRightRadius: '8px',
        }
    }
})



export default function ExpandBar({ text, value, setValue, children, textColor = theme.palette.primary.darkViolet, barColor = theme.palette.shades.white70, childColor = theme.palette.shades.white30, padding=true, ...props}) {

    return (
        <StyledAccordion defaultExpanded={value} expanded={value} onChange={() => {setValue(!value) }} {...props}>
            <Bar
                expanded={value}
                barColor={barColor}
                childColor={childColor}
                expandIcon={<EIconButton size={"small"} variant="contained" color="secondary">
                    <SvgIcon viewBox={"12 12 24 24"} component={ArrowDownIcon} />
                </EIconButton>}

            >
                <Label sx={{ ...theme.typography.p, fontSize: 18, color: textColor }}>
                    {text}
                </Label>
            </Bar>
            {<Child childColor={childColor} padding={padding}>
                {children}
            </Child>}
        </StyledAccordion>
    )
}
