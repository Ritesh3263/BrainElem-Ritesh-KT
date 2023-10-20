import React from "react";
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';

import { theme } from "../../MuiTheme";




const TooltipToBeStyled = ({ className, ...props }) => (
  <Tooltip {...props} classes={{ tooltip: className }} />
);

const TooltipWithStyles = styled(TooltipToBeStyled)`
  
  &.${tooltipClasses.popper} {
    display: inline-block;
    background: red;
  }
  &.${tooltipClasses.tooltip} {
    color: ${theme.palette.primary.darkViolet};
    background: ${theme.palette.primary.creme};
    padding: 8px 16px;
    border-radius: 12px;
    font-family: "Roboto";
    font-size: 10px;
    line-height: 12px;
    letter-spacing: 0em;
  }
  & .${tooltipClasses.arrow} {
    color: ${theme.palette.primary.creme};
  }
`;

export default function StyledTooltip(props) {
  return (

    <TooltipWithStyles {...props} arrow>
      <div>
        {props.children}
      </div>
    </TooltipWithStyles>
  )
}
