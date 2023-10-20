import { styled } from '@mui/system';
import { IconButton } from "@mui/material";

// MUI v4
import { theme } from 'MuiTheme'
const palette = theme.palette

const StyledEIconButton = styled(({ cptRef, ...otherProps }) => (
  <IconButton {...otherProps} />
))((props) => {
  return {
    '&.Mui-disabled':{
      '& svg':{
        opacity: 0.3
      }
    },
    '&.MuiIconButton-sizeSmall': {// Smalll
      fontSize: '14px !important',
      lineHeight: '24px',
      width: '24px',
      height: '24px',
      "& .m-2": { // Fix for old edit icons inside tables which used margins
        margin: 'unset !important'
      }
    },
    '&.MuiIconButton-sizeMedium': {// Medium
      width: '32px',
      height: '32px'
    },
    '&.MuiIconButton-sizeLarge': {// Large
      width: '40px',
      height: '40px'
    },
    '&.MuiIconButton-sizeXlarge': {// xLarge
      width: '48px',
      height: '48px'
    },
    '&.MuiIconButton-colorPrimary': {
      background: palette.gradients.pink,
      color: palette.primary.creme,
      "&:hover": {
        backgroundColor: 'unset',
        background: `${palette.gradients.lila} !important`
      },
      "&:active": {
        background: `${palette.primary.yellow} !important`,
        color: palette.primary.darkViolet,
        border: 'none',
        "& svg":{
            "& line": {stroke: `${palette.primary.darkViolet} !important`},
            "& polyline": {stroke: `${palette.primary.darkViolet} !important`},
            "& path": {stroke: `${palette.primary.darkViolet} !important`},
            '& circle': {stroke: `${palette.primary.darkViolet} !important`},
            '& polygon':{stroke: `${palette.primary.darkViolet} !important`},
            '& rect':{stroke: `${palette.primary.darkViolet} !important`}
        }
      },
    },
    '&.MuiIconButton-colorSecondary': {
      backgroundColor: `${palette.shades.white70} !important`,
      color: `${palette.primary.darkViolet} !important`,
      border: `1px solid ${palette.neutrals.fadeViolet}`,

      '&:hover': {
        backgroundColor: `${palette.neutrals.fadeViolet} !important`,
      },
      "&:active": {
        background: `${palette.primary.violet} !important`,
        color: palette.neutrals.white,
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
      background: props.eVariant === 'primary' ? `linear-gradient(91.87deg, #15A3A5 -1.4%, #523970 101.59%)` : `linear-gradient(132.79deg, #C972FF 0%, #15A3A5 104.17%)`
    } : {},
  }
})

export default StyledEIconButton;