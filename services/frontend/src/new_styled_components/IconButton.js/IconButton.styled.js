import { styled } from '@mui/system';
import { IconButton } from "@mui/material";

// MUI v4
import { new_theme } from 'NewMuiTheme';
const palette = new_theme.palette


const StyledEIconButton = styled(({ cptRef, ...otherProps }) => (
    <IconButton {...otherProps} />
  ))((props) => {
    return {
      '&.Mui-disabled':{
        '& svg':{
          opacity: 0.3,
        }
      },
      '&.MuiIconButton-sizeSmall': {// Smalll
        // fontSize: '14px !important',
        // lineHeight: '24px',
        width: '25px',
        height: '25px',
        // border: `2px solid ${new_theme.palette.newSecondary.NSIconBorder}`,
        // "& .m-2": { // Fix for old edit icons inside tables which used margins
        //   margin: 'unset !important'
        // }
      },
      '&.MuiIconButton-sizeMedium': {// Medium
        width: '35px',
        height: '35px'
      },
      '&.MuiIconButton-sizeLarge': {// Large
        width: '40px',
        height: '40px'
      },
      '&.MuiIconButton-sizeXlarge': {// Large
        width: '48px',
        height: '48px'
      },
      '&.MuiIconButton-colorPrimary': {
        background: new_theme.palette.primary.PWhite,
        color: new_theme.palette.secondary.DarkPurple,
        border: `2px solid ${new_theme.palette.newSecondary.NSIconBorder}`,
        "&:hover": {
          backgroundColor: new_theme.palette.secondary.Turquoise,
          color: new_theme.palette.primary.PWhite,
          borderColor: new_theme.palette.secondary.Turquoise
        },
        "&:active": {
          background: `${new_theme.palette.secondary.Turquoise} !important`,
          color: new_theme.palette.primary.PWhite,
          border: new_theme.palette.secondary.Turquoise,
          "& svg":{
              "& line": {stroke: `${palette.primary.darkViolet} !important`},
              "& polyline": {stroke: `${palette.primary.darkViolet} !important`},
              "& path": {stroke: `${palette.primary.darkViolet} !important`},
              '& circle': {stroke: `${palette.primary.darkViolet} !important`},
              '& polygon':{stroke: `${palette.primary.darkViolet} !important`},
              '& rect':{stroke: `${palette.primary.darkViolet} !important`}
          }
        },
        "&:disabled":{
          '& svg' :{
            color: new_theme.palette.newSecondary.NSIconDisabled, 
          }
        }
      },
      '&.MuiIconButton-colorSecondary': {
        backgroundColor: `${palette.shades.white70} !important`,
        color: `${palette.neutrals.black} !important`,
        '&:hover': {
          backgroundColor: `${palette.shades.white70} !important`,
        },
        "&:active": {
          background: `${palette.neutrals.white} !important`,
          border: 'none',
          "& svg":{
              "& line": {stroke: `${palette.neutrals.white} !important`},
              "& polyline": {stroke: `${palette.neutrals.white} !important`},
              "& path": {stroke: `${palette.neutrals.white} !important`},
              '& circle': {stroke: `${palette.neutrals.white} !important`},
              '& polygon': {stroke: `${palette.neutrals.white} !important`},
              '& rect': {stroke: `${palette.neutrals.white} !important`},
          }
        },
  
      },
      '&:hover': {
        boxShadow: 'none'
      },
      '&:after': props.border ? {
        position: 'absolute',
        top: '-2px',
        bottom: '-2px',
        left: '-2px',
        right: '-2px',
        content: '""',
        zIndex: -1,
        borderRadius: '24px',
      } : {},
    }
  })
  
  export default StyledEIconButton;