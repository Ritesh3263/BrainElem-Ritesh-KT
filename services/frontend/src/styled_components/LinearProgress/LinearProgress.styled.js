import React from "react";

// MUIv5
import { styled } from "@mui/system";
import LinearProgress from '@mui/material/LinearProgress';

// MUI v4
import { theme } from "MuiTheme";
import { new_theme } from "NewMuiTheme";


const StyledLinearProgress = styled(LinearProgress)({
    '&.MuiLinearProgress-root':{
        backgroundColor: new_theme.palette.newSupplementary.SupCloudy
    },
    '& .MuiLinearProgress-bar': {
        backgroundColor: new_theme.palette.primary.MedPurple
    }
})

// Component 
const ELinearProgress = (props) => {
    return (
        <StyledLinearProgress {...props}></StyledLinearProgress>
    )
}

export default ELinearProgress;