import { styled } from "@mui/system";
import Tab from "@mui/material/Tab";

// MUI v4
// import { new_theme } from 'MuiTheme'
import { new_theme } from "NewMuiTheme";
const palette = new_theme.palette


// When updating, please adjust 
// values in returnMinHeight inside TabBar.styled.js
const returnTabHeight = (value) => {
    switch (value) {
        case 'xsmall': return '24px';
        case 'small': return '32px';
        default: return '32px';
    }
};

const returnTabFontSize = (value) => {
    switch (value) {
        case 'xsmall': return '12px';
        case 'small': return '16px';
        default: return '16px';
    }
};

const StyledTab = styled(({ cptRef, ...props }) => (
    <Tab {...props} ref={cptRef}/>
))((props) => {
    if (props?.etype == "working") return {
        height: '32px',
        fontFamily: 'Roboto',
        color: palette.primary.darkViolet,
        textTransform: props.isUppercase ? 'uppercase' : 'none',
        '& span':{
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            width: '100%',
            textAlign: 'left'
        },
        '& svg':{
            marginLeft: '0 !important'
        },
        '&.MuiTab-root': {
            minHeight: 'unset',
            minWidth: 'unset',
            height: '32px',
            width: props.label ? '150px' : '40px',
            padding: props.label ? "0px 16px" : 0,
            whiteSpace: 'nowrap',

            borderRadius: '8px 8px 0px 0px',
            background: props.background ? props.background : new_theme.palette.glass.opaque,
        },

        '&.Mui-selected': {
            color: palette.primary.white,
            background: palette.neutrals.grey,
        },
    }


    return {
        minWidth: '160px',
        minHeight: '22px',
        color: palette.primary.darkViolet,
        fontFamily: 'Nunito',
        borderRadius: `24px`,
        height: returnTabHeight(props.eSize),
        fontSize: returnTabFontSize(props.eSize),
        textTransform: props.isUppercase ? 'uppercase' : 'none',
        '&.Mui-selected': {
            background: palette.gradients.tab,
            color: "white",
            outlined: "none",
        },
        'span': {
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            display: 'inline-block',
            whiteSpace: 'nowrap'
        },
        '&.MuiButtonBase-root': {
            padding: 0,
            paddingRight: '16px',
            paddingLeft: '16px'
        }
    }
});


export default function ETab(props) {
    return (
        <StyledTab {...props}/>
    )
}