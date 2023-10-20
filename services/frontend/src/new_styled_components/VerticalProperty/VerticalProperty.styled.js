
import React from "react";

import Box from '@mui/material/Box';
import ETooltip from 'styled_components/Tooltip'
import EBadge from 'styled_components/Badge';
import SvgIcon from "@mui/material/SvgIcon";
import { styled } from '@mui/material/styles';
import { ReactComponent as InfoIcon } from '../../icons/icons_32/Info base_32.svg';

import { theme } from "../../MuiTheme";

const Wrapper = styled(Box)({
    width: "100%",
    height: '25px',
    display: 'inline-flex',
    flexWrap: 'nowrap',
    fontFamily: 'Nunito',
    whiteSpace: 'nowrap',

    fontSize: '18px',
    lineHeight: '25px',
    color: theme.palette.neutrals.darkestGrey,
    fontFamily: 'Nunito',
})

const IconParent = styled(Box)({
    paddingRight: '10.5px',
    display: 'flex',
    justifyContent: 'center'
})

const BadgeParent = styled(Box)({
    paddingRight: '10.5px',
    display: 'flex',
    justifyContent: 'center'
})


const FlexibleBox = styled(Box)((props) => ({
    flex: '0 1 auto',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap'
}))

const MultilineBox = styled(Box)((props) => ({
    flex: '0 1 auto',
    whiteSpace: 'break-spaces',
    maxWidth: 250,
    height: 80,
    display: '-webkit-box',
    '-webkit-line-clamp': '3',
    '-webkit-box-orient': 'vertical',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
}))

const FixedBox = styled(Box)((props) => ({
    flex: '1 0 auto',
    whiteSpace: 'nowrap',
}))


const StyledTooltipIcon = styled(SvgIcon)`
    height: 16px;
    width: 16px;
    border-radius: 50%;
    vertical-align: top;
    cursor: pointer;
    & line: {
        stroke: ${theme.palette.primary.darkViolet};
    },
    & circle: {
        fill: ${theme.palette.primary.darkViolet};
    },
    &:hover: {
        background: ${theme.palette.primary.violet} !important;
        & line: {
            stroke: ${theme.palette.primary.creme};
        },
        & circle: {
            fill: ${theme.palette.primary.creme};
        },
    }
  `


const getStyledIcon = (Icon, iconStyles) => {
    return styled(Icon)({
        "& line": {
            stroke: theme.palette.neutrals.almostBlack,
            fill: 'transparent'
        },
        "& polyline": {
            stroke: theme.palette.neutrals.almostBlack,
            fill: 'transparent'
        },
        "& path": {
            stroke: theme.palette.neutrals.almostBlack,
            fill: 'transparent',
            mask: 'none'
        },
        '& circle': {
            stroke: theme.palette.neutrals.almostBlack,
            fill: 'transparent'
        },
        ...iconStyles
    })

}

export default function StyledVerticalProperty(props) {
    return (
        <Wrapper sx={{ fontSize: props.fontSize ? props.fontSize : '18px', width: props.width ?? "100%" }}>

            {props.badgeColor &&
                <BadgeParent sx={{ height: props.multiline ? "50px" : "25px" }}>
                    <EBadge sx={{ marginTop: props.multiline ? "25px" : "12.5px" }} ecolor={props.badgeColor} variant="dot" />
                </BadgeParent>
            }
            {props.Icon &&
                <IconParent sx={{ height: props.multiline ? "50px" : "25px" }}>
                    <SvgIcon sx={{ height: props.multiline ? "50px" : "25px", width: props.multiline ? "50px" : "25px" }} viewBox="0 0 48 48" component={getStyledIcon(props.Icon, props.iconStyles)} />
                </IconParent>
            }
            {props.multiline ? <MultilineBox>{props.name}</MultilineBox> : <FlexibleBox >{props.name}</FlexibleBox>}
            <FixedBox>

                {props.description &&
                    <Box sx={{ pl: 1, display: 'inline-block' }}>
                        <ETooltip {...props} title={props.description}>
                            <StyledTooltipIcon viewBox="0 0 32 32" component={InfoIcon} style={{ background: props.iconbackgroundcolor ? props.iconbackgroundcolor : 'white' }} />
                        </ETooltip>
                    </Box>
                }

                {props.value !== undefined && props.value !==null &&
                    <Box sx={{ pl: 4, float: 'right', display: 'inline-block' }}>{props.value}</Box>
                }
            </FixedBox>

        </Wrapper>
    )
}
