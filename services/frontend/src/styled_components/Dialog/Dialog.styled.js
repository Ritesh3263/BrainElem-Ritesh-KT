
import React from "react";
import Dialog from '@mui/material/Dialog';

import { styled } from '@mui/system';

// Detect size of the screen
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

// MUI v4
import { theme } from 'MuiTheme'
const palette = theme.palette

function useIsWidthUp(breakpoint) {
    const theme = useTheme();
    return useMediaQuery(theme.breakpoints.up(breakpoint));
}


const StyledDialog = styled(Dialog)((props) => {


    return {
        zIndex: 1023,
        '& .MuiBackdrop-root': {
            background: 'rgba(16, 40, 101, 0.5)',
        },
        '& .MuiDialog-paper': {
            borderRadius: '16px',
            boxShadow: `0px 1px 24px -1px rgba(0, 0, 0, 0.1)`,
            background: 'transparent',
            ...(props.isSmUp ? {} : { paddingLeft: 0, paddingRight: 0, marginLeft: 0, marginRight: 0, width: '100%', maxWidth: 'unset' })
        }
    }
})


export default function EDialog(props) {
    const isSmUp = useIsWidthUp('sm')

    return (
        <StyledDialog isSmUp={isSmUp} {...props} scroll={'body'}>
            {props.children}
        </StyledDialog>

    )
}