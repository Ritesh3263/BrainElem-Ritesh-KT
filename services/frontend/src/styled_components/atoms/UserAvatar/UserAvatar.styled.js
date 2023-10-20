import React from "react";
import {Box, Typography} from '@mui/material';
import { styled } from '@mui/material/styles';
import { theme } from "MuiTheme";

const StyledBox = styled(Box)((props)=> {return {
    width: '24px',
    height: '24px',
    background: theme.palette.neutrals.white,
    border: `2px solid ${props.color ? props.color : theme.palette.semantic.error}`,
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textTransform: 'uppercase',
}})

export default function ESwitch(props) {
    return (
        <StyledBox {...props}>
            <Typography sx={{ ...theme.typography.p, fontSize: 10 }}>
                {Array.from(props.name)[0] + Array.from(props.surname)[0]}
            </Typography>
        </StyledBox>
    )
}