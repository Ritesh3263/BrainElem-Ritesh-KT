import React from "react";

// MUIv5
import { styled } from "@mui/system";
import Slider from '@mui/material/Slider';

// MUI v4
import { theme } from "MuiTheme";
import { new_theme } from "NewMuiTheme";
const palette = new_theme.palette

const StyledSlider= styled(Slider)({
    "&.MuiSlider-root": {
        height: 60

    },
    "& .MuiSlider-rail": {
        color: palette.neutrals.darkestGrey,
        height: 12,
        borderRadius: 4

    },
    "& .MuiSlider-track": {
        color: palette.primary.MedPurple,
        height: 12,
        borderRadius: 4
    },
    "& 	.MuiSlider-thumb": {
        color: palette.primary.MedPurple,
        height: 24,
        borderRadius: 4,
    },
    "& .MuiSlider-valueLabel": {
        color: palette.neutrals.darkestGrey,
        background: palette.neutrals.fadeViolet,
        borderRadius: 4,
        top: -20,
        height: 24,
        "& span": {
            height: '100%',
            color: palette.neutrals.darkestGrey,
            background: 'transparent',
            borderRadius: 0,
            transform: 'unset',
            "& *": {
                height: "unset",
                transform: 'unset'
            }
        }
    },
    "& .MuiSlider-mark": {
        width: 1,
        color: palette.neutrals.almostBlack,
        top: 66,
        height: 16
    },
    "& .MuiSlider-markActive": {
        width: 1,
        opacity: 1,
        backgroundColor: palette.neutrals.almostBlack,
    },
    "& .MuiSlider-markLabel": {
        opacity: 1,
        fontSize: 14,
        top: 85,
        color: palette.neutrals.almostBlack,
    },
    "& .MuiSlider-markLabelActive": {
        color: palette.neutrals.almostBlack,
    }
})

// Component 
const ESlider = (props) => {
    return (
        <StyledSlider {...props}></StyledSlider>
    )
}

export default ESlider;