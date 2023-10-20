import React from "react";
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';

import { new_theme } from "../../NewMuiTheme";




const TooltipToBeStyled = ({ className, ...props }) => (
  <Tooltip {...props} classes={{ tooltip: className }} />
);

const TooltipWithStyles = styled(TooltipToBeStyled)`
  
  &.${tooltipClasses.popper} {
    display: inline-block;
    background: red;
  }
  &.${tooltipClasses.tooltip} {

    width: 158px;
    padding: 4px 8px;
    border-radius: 4px;
    border: 1px solid ${new_theme.palette.newSecondary.NSIconBorder};
    background: ${new_theme.palette.primary.PWhite};
    box-shadow: 0px 1px 8px -1px rgba(30, 20, 39, 0.15);
    backdrop-filter: blur(10px);


    color: black;
    text-align: center;
    font-family: Nunito;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 120%; /* 14.4px */
    
  }
  & .${tooltipClasses.arrow} {
    display: none;
    color: ${new_theme.palette.newSecondary.NSIconBorder};
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
