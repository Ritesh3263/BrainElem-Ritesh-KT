
import React from "react";

// MUI v5
import { styled } from "@mui/system";
import Checkbox from '@mui/material/Checkbox';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

// MUI v4
import { theme } from "../../MuiTheme";
const palette = theme.palette;


const RadioButtonWithStyles = styled(Checkbox)({
    background: 'transparent',
    '&:hover': {
        background: palette.primary.creme,
    },
    "&:active": {
        background: palette.primary.violet
    },
    color: palette.secondary.violetSelect,
    '&.Mui-checked': {
        color: palette.secondary.violetSelect,
        '&:hover': {
            backgroundColor: `${palette.primary.creme} !important`,
        },
    }
})

const StyledRadioButton = (props) => {
    return (
        <RadioButtonWithStyles
            icon={<RadioButtonUncheckedIcon />}
            checkedIcon={<RadioButtonCheckedIcon />}
            {...props}
        >

        </RadioButtonWithStyles>

    )
}

export default StyledRadioButton;