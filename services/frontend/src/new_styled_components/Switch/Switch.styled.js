import React from "react";
import Switch, { switchClasses } from '@mui/material/Switch';
import { styled } from '@mui/material/styles';
import { theme } from "../../MuiTheme";

const palette = theme.palette

const StyledSwitch = styled(Switch)`
  // ANIMATIONS #######################
  @keyframes animatedCheckedBackground {
    from {
      background: none;
    }
    to {
      background: rgba(179 114 255 / 40%);
    }
  }

  @keyframes animatedUncheckedBackground {
    from {
      background: none;
    }
    to {
      background: rgb(225 225 228 / 30%);
    }
  }
  // ####################################

  // ROOT ###############################
  &.${switchClasses.root} {
    padding: 9px;
    box-sizing: content-box;

    // SMALL ###################
    &.${switchClasses.sizeSmall}{

      height: 24px;
      width: 48px;
      & .${switchClasses.switchBase}{
        top: 9px;
        left: 9px;
        &.${switchClasses.checked}{
          left: 17px;
        }
        & .MuiTouchRipple-root {
          width: 40px;
          height: 40px;
          top: -8px;
          left: -8px;
        }
      }
      & .${switchClasses.thumb} {
        height: 24px;
        width: 24px;
      }
    }

    // MEDIUM ###################
    &.${switchClasses.sizeMedium}{
      height: 32px;
      width: 64px;
      & .${switchClasses.switchBase}{
        top: 9px;
        left: 9px;
        &.${switchClasses.checked}{
          left: 21px;
        }
      }
      & .MuiTouchRipple-root {
        width: 48px;
        height: 48px;
        top: -8px;
        left: -8px;
      }
      & .${switchClasses.thumb} {
        height: 32px;
        width: 32px;
      }


    }
  }

  // SWITCH BASE
  & .${switchClasses.switchBase} {
    padding: 0px;

    & .MuiTouchRipple-root{
      z-index: -1;
      filter: blur(2px);  
    }
    & .${switchClasses.thumb} {
      border: 1px ${palette.neutrals.lightGrey} solid;
      color: ${palette.neutrals.white}  !important;
      opacity: 1  !important;
    }
    &.${switchClasses.disabled} {
      .${switchClasses.thumb} {
        border: none !important;
      }
    }
    &.${switchClasses.checked}{
      & .${switchClasses.thumb} {
        border: 1px ${palette.primary.violet} solid;
      }
      &:hover{
        & .MuiTouchRipple-root{
          background: rgba(179 114 255 / 40%);
          animation: animatedCheckedBackground 0.5s linear;
        }
      }
      & .MuiTouchRipple-rippleVisible {
        opacity: 0.7;
        color: ${palette.primary.violet} !important;
      }
    }
    &:not(.${switchClasses.checked}){
      &:hover{
        & .MuiTouchRipple-root{
          background: rgb(225 225 228 / 30%);
          animation: animatedUncheckedBackground 0.5s linear;
        }
      }
    }
  }






  // TRACK ##########################################
  & .${switchClasses.track} {
    opacity: 1  !important;
    border-radius: 16px  !important;
    background-color: ${palette.neutrals.lightGrey}  !important;
    box-shadow: inset 1px 0px 2px rgba(0, 0, 0, 0.25), inset 0px 1px 2px rgba(0, 0, 0, 0.25)  !important;
  }
  & .${switchClasses.checked} + .${switchClasses.track} {
    opacity: 1  !important;
    background-color: ${palette.primary.violet}  !important;
  }

  & .${switchClasses.disabled} + .${switchClasses.track} {
    opacity: 0.4 !important;
  }



`;

export default function ESwitch(props) {
  return (
    <StyledSwitch {...props} size={props.size ? props.size : 'small'} />
  )
}