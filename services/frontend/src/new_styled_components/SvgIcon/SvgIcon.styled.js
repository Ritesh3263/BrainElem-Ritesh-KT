import React from "react";
import SvgIcon from '@mui/material/SvgIcon';
import { styled } from '@mui/material/styles';
// import { new_ } from "../../MuiTheme";
import { new_theme } from "NewMuiTheme";


let StyledSvgIcon = styled(SvgIcon)((props)=>{
    let color = new_theme.palette.newSupplementary.NSupText
    if (props.color) color = props.color
    return { 
        backgroundColor: 'transparent !important',
        "& line": {
            stroke: color,
            fill: 'transparent'
        },
        "& polyline": {
            stroke: color,
            fill: 'transparent'
        },
        "& path": {
            stroke: color,
            fill: 'transparent'
        },
        '& circle': {
            stroke: color,
            fill: 'transparent'
        },
        '& polygon':{
            stroke: color,
            fill: 'transparent'
        },
        '& rect':{
            stroke: color,
            fill: 'transparent'
        }
    }
})

export default function ESvgIcon(props) {
    return (
        <StyledSvgIcon {...props} />
    )
}

