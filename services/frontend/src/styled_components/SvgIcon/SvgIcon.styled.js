import React from "react";
import SvgIcon from '@mui/material/SvgIcon';
import { styled } from '@mui/material/styles';
import { theme } from "../../MuiTheme";


let StyledSvgIcon = styled(SvgIcon)((props)=>{
    let color = theme.palette.primary.darkViolet
    let fill = 'transparent'
    let bg = 'transparent !important'
    if (props.color) color = props.color
    if (props.fill) fill = props.fill
    if (props.bg) bg = props.bg+ ' !important'
    return { 
        backgroundColor: bg,
        "& line": {
            stroke: color,
            fill
        },
        "& polyline": {
            stroke: color,
            fill
        },
        "& path": {
            stroke: color,
            fill
        },
        '& circle': {
            stroke: color,
            fill
        },
        '& polygon':{
            stroke: color,
            fill
        },
        '& rect':{
            stroke: color,
            fill
        }
    }
})

export default function ESvgIcon(props) {
    return (
        <StyledSvgIcon {...props} />
    )
}

