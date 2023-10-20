import React from "react";

// MUIv5
import { styled } from "@mui/system";
import Menu from '@mui/material/Menu';

// MUI v4
import { theme } from "MuiTheme";


const StyledMenu = styled(Menu)({
    '& .MuiPaper-root': {
        background: theme.palette.glass.opaque,
        backdropFilter: 'blur(10px)',
    },
    "& .MuiList-root":{
        padding: 0,
        width: '100%',
       
    },

    '& .MuiMenuItem-root':{
        ...theme.typography.p16,
        padding: '12px !important',
        background: theme.palette.neutrals.fadeViolet,
        '&:hover': {
            backgroundColor: `${theme.palette.primary.violet} !important`
        }
    },
})

// Component with menu
const EMenu = (props) => {

    return (
        <StyledMenu {...props}>
            {props.children}
        </StyledMenu>
    )
}

export default EMenu;