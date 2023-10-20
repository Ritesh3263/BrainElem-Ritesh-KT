import React, { useState, useEffect, lazy } from "react";

//MUIv5u
import { Grid, Typography } from '@mui/material';

import { styled } from "@mui/system";
import { new_theme } from "NewMuiTheme";

// Detect size of the screen
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';


function useIsWidthUp(breakpoint) {
    const theme = useTheme();
    return useMediaQuery(theme.breakpoints.up(breakpoint));
}

const NavigationContainerVertical = styled(Grid)({
    width: '215px',
    height: '100%',
    marginRight: '48px',
    flexDirection: 'column',
    flexWrap: 'nowrap',
    //Borders/border-secondary
    borderRight: `1px solid ${new_theme.palette.newSecondary.NSIconBorder}`
})

const NavigationContainerHorizontal = styled(Grid)({
    width: '100%',
    marginBottom: '24px',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    borderBottom: `1px solid ${new_theme.palette.secondary.SGrey}`
})

const NavigationItemVertical = styled(Typography)((props) => {
    return {
        padding: '8px 16px',
        cursor: 'pointer',
        textAlign: 'right',
        fontFamily: 'Nunito',
        fontSize: '18px',
        fontStyle: 'normal',
        fontHeight: '400',
        lineHeight: '150%',
        marginRight: '-1px',
        //minWidth: '160px',
        fontWeight: props.active ? '700' : '400',
        borderRight: props.active ? `2px ${new_theme.palette.primary.MedPurple} solid` : 'none',
    }
})

const NavigationItemHorizontal = styled(Typography)((props) => {
    return {
        padding: '8px 16px',
        cursor: 'pointer',
        fontSize: '14px !important',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        marginBottom: '-1px',
        fontWeight: props.active ? '700' : '400',
        borderBottom: props.active ? `2px ${new_theme.palette.primary.MedPurple} solid` : 'none',
    }
})


// items - array of objects to be displayed in navigation - [{name: 'foo', onClick: ()=>{}}]
// triggerActiveIndex - optional - used to trigger index change from parent component
export default function Navigation({ items, triggerActiveIndex }) {
    const [activeIndex, setActiveIndex] = useState()


    useEffect(() => {
        setActiveIndex(triggerActiveIndex)
    }, [triggerActiveIndex])

    const isSmUp = useIsWidthUp("sm");

    const NavigationContainer = isSmUp ? NavigationContainerVertical : NavigationContainerHorizontal
    const NavigationItem = isSmUp ? NavigationItemVertical : NavigationItemHorizontal
    return (
        <NavigationContainer container item>
            {items.map((item, index) =>
                <NavigationItem active={index == activeIndex} sx={{
                }}
                    onClick={() => { item.onClick(); setActiveIndex(index) }}>{item.name}</NavigationItem >
            )}
        </NavigationContainer>
    )

}