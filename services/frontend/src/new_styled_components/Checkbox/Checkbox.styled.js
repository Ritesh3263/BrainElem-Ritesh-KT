
import React from "react";

// MUI v5
import { styled } from "@mui/system";
import Checkbox from '@mui/material/Checkbox';

// MUI v4
import { theme } from "../../MuiTheme";
const palette = theme.palette;

const CheckboxWithStyles = styled(Checkbox)({
    background: 'transparent',
    '&:hover': {
        background: palette.primary.creme,
    },
    "&:active": {
        background: palette.primary.yellow
    },
    color: palette.primary.violet,
    '&:not(.Mui-checked)':{
        '& svg': {
            fill: palette.secondary.violetSelect,
        }
    },
    '&.Mui-checked': {
        color: palette.primary.violet,
        '&:hover': {
            backgroundColor: `${palette.primary.creme} !important`,
        },
        // White background
        zIndex: 0,
        position: "relative",
        "&:after": {
            content: '""',
            left: 13,
            top: 13,
            height: 15,
            width: 15,
            position: "absolute",
            backgroundColor: palette.neutrals.white,
            zIndex: -1,
            borderColor: "transparent"
        }
    }
    
})

const StyledCheckbox = (props) => {
    return (
        <CheckboxWithStyles
            {...props}
        >
        </CheckboxWithStyles>

    )
}

export default StyledCheckbox;