import { styled } from "@mui/system";
import Tabs from "@mui/material/Tabs";

// MUI v4
import { theme } from 'MuiTheme'
const palette = theme.palette

const returnTabBarHeight = (value) => {
    switch (value) {
        case 'xsmall': return '24px';
        case 'small': return '32px';
        case 'medium': return '40px';
        case 'large': return '48px';
        case 'xlarge': return '56px';
        default: return '32px';
    }
};



// Based on Tab height + 2px
// When updating, please adjust 
// values in returnTabHeight  inside Tab.styled.js
const returnMinHeight = (value) => {
    switch (value) {
        case 'xsmall': return '26px';
        case 'small': return '34px';
        case 'medium': return '42px';
        case 'large': return '50px';
        case 'xlarge': return '58px';
        default: return '34px';
    }
};

const StyledTabs = styled(Tabs)(props=>{
    let styles = {
        padding: '0',
        width: 'fit-content',
        display: 'flex',
        alignItems: 'center',
        minHeight: returnMinHeight(props.eSize),
        borderBottom : '1px solid var(--PBorderColor)',
        '& .MuiTabs-scroller': {
            left: '1px'
        },
        '& .MuiTabs-flexContainer': {
            width: `calc(100% - 2px)`
        },
        '& .MuiTabs-indicator': {
            display: 'none',
        },
        "& .MuiTabScrollButton-root":{
            width: '32px',
            "& svg":{
                fill: 'black'
            }
        }
    }

    if (props?.etype == "working"){
        styles['& .MuiTabs-root'] = {height: '32px'}
        styles['& .MuiTabs-flexContainer'] = {display: 'block', height: '32px'}
        styles.background = 'transparent'
        styles.borderRadius = '0px'
        styles.width = "unset"
    }

    return styles


})
export default function ETabs(props) {
    return (
        <StyledTabs {...props}
        variant={props.etype == "working" ? "scrollable" : "standard"}
        scrollButtons={props.etype == "working"}
        allowScrollButtonsMobile={props.etype == "working"}
        />
    )
}
