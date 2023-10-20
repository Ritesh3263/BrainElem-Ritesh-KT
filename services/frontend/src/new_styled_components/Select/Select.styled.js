import React from "react";

// MUI v5
import { styled } from '@mui/material/styles';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { makeStyles } from "@material-ui/core/styles";
//Icons
import SvgIcon from "@mui/material/SvgIcon";
import { ReactComponent as arrowBig } from 'icons/icons_48/Arrow big D.svg';
import { ReactComponent as ArrowDownIcon } from 'icons/icons_32/keyboard_arrow_down.svg';
// MUI v4
import { new_theme } from "NewMuiTheme";
import { theme } from "../../MuiTheme";
const palette = theme.palette;

const palette2 = new_theme.palette;


// const StyledSelect = styled(ESelect)({
//sx={{ pl: 1, pb: 2, minWidth: 120 }} style={{ borderRadius: "16px" }}
// })

const StyledInputLabel = styled(InputLabel)({
    '&.MuiInputLabel-root': {
        fontFamily: 'Nunito',
        fontWeight: '400',
        fontSize: 16,
        color: palette2.newSupplementary.NSupText,
        top: -1,
        '&.MuiInputLabel-shrink': {
            top: 0,
            color: palette2.newSupplementary.NSupText,
            transform: 'translate(12px, 6px) scale(0.75)'
        }
    },
})

const StyledRoundInputLabel = styled(StyledInputLabel)({
    '&.MuiInputLabel-root': {
        fontFamily: 'Nunito',
        fontWeight: '400',
        fontSize: 16,
        color: palette2.newSupplementary.NSupText,
        top: -1,
        '&.MuiInputLabel-shrink': {
            top: -13,
            color: palette2.newSupplementary.NSupText,
        }
    },
})

const SelectWithStyles = styled((props) => (
    <Select disableUnderline {...props} />
))(({ theme }) => ({

    '&.MuiFilledInput-root': {
        height: 52,
        fontFamily: "Nunito",
        color: palette2.newSupplementary.NSupText,
        backgroundColor: palette.neutrals.white,
        opacity: 0.7,
        borderBottom: `2px solid ${palette.primary.green}`,
        borderRadius: '8px 8px 0px 0px',
        "&.MuiInputBase-sizeSmall": {
            height: '40px'
        },

        // "&.Mui-disabled": {
        //     opacity: 0.4,
        //     backgroundColor: palette.neutrals.white,
        //     borderBottom: `2px solid ${palette2.newSupplementary.NSupText}`,
        //     '&:hover': {
        //         opacity: 0.4,
        //         backgroundColor: palette.neutrals.white,
        //         borderBottom: `2px solid ${palette2.newSupplementary.NSupText}`,
        //     }
        // },
        // '&:hover': {
        //     opacity: 0.75,
        //     backgroundColor: palette.neutrals.white,
        //     borderBottom: `2px solid ${palette.secondary.violetSelect}`,
        //     '&:before': {
        //         borderBottom: `none !important`
        //     },
        // },
        // '&.Mui-focused': {
        //     opacity: 0.9,
        //     backgroundColor: palette.neutrals.white,
        //     borderBottom: `2px solid ${palette.primary.violet}`,
        //     '&:hover': {
        //         opacity: 0.9,
        //         backgroundColor: palette.neutrals.white,
        //         borderBottom: `2px solid ${palette.primary.violet}`,
        //     }
        // },
        // '&:before': {
        //     borderBottom: `none`
        // },
        // '&:after': {
        //     borderBottom: `none`
        // },
    },
    "&.MuiInputBase-root": {
        "&.MuiInputBase-sizeSmall": {
            height: '40px'
        },
        ".MuiOutlinedInput-notchedOutline": {
            borderColor: new_theme.palette.newSecondary.NSIconBorder,
        },
        '&:hover': {
            '.MuiOutlinedInput-notchedOutline': {
                borderColor: new_theme.palette.newSecondary.NSIconBorder,
            }
        },
        '&.Mui-focused': {
            '.MuiOutlinedInput-notchedOutline': {
                borderColor: new_theme.palette.secondary.Turquoise,
            }
        },
    },
    '& .MuiFilledInput-input': {
        fontFamily: 'Nunito',
        fontWeight: '400',
        fontSize: 16,
        color: palette2.newSupplementary.NSupText,

    },
    '& .MuiInputLabel-asterisk': {
        color: palette.semantic.error,
    },
    '& .MuiFilledInput-underline': {
        '&:after': {
            borderBottomColor: `none`
        },
        '&:before': {
            borderBottom: `none`
        },
        '&.Mui-focused': {
            '&:before': {
                borderBottom: `none`,
            },
            '&:after': {
                borderBottom: `none`,
            },
        },
        '&:hover': {
            '&:before': {
                borderBottom: `none`,
            },

        },
        "&.Mui-disabled": {
            '&:before': {
                borderBottom: `none`,
            },
        }

    },

    paper: {
        borderRadius: 12,
        marginTop: 8
    },
    list: {
        paddingTop: 0,
        paddingBottom: 0,
        "& li": {
            fontWeight: 200,
            paddingTop: 8,
            paddingBottom: 8,
            fontSize: "12px"
        },
        "& li.Mui-selected": {
            color: "white",
            background: "#6EC177"
        },
        "& li.Mui-selected:hover": {
            background: "#6EC177"
        }
    }

}));



const RoundSelectWithStyles = styled(SelectWithStyles)({
    '&.MuiOutlinedInput-root': {
        borderRadius: '8px',
        height: 52,
        borderColor: palette2.newSecondary.NSIconBorder,
        fontSize: '16px',
        "&.MuiInputBase-sizeSmall": {
            height: '46px'
        },
        ".MuiListItemText-root": {
            ".MuiListItemText-primary": {
                fontSize: '16px'   
            }
        },
        // '.MuiSelect-select': {
        //     fontSize: '16px'
        // },
        // '&.MuiSelect-root': {
        //     fontSize: '16px'
        // },
        '.MuiSelect-multiple': {
            display: 'flex',
            alignItems: 'center',
            fontSize: '16px'
        },
        '.MuiOutlinedInput-notchedOutline': {
            backgroundColor: 'transparent',
            '&:hover': {
                borderColor: palette2.newSecondary.NSIconBorder,
            }
        },
        "&.Mui-disabled": {
            border: `1px solid ${palette2.newSupplementary.NSupText}`,
            '&:hover': {
                border: `1px solid ${palette2.newSupplementary.NSupText}`,
            }
        },
        '&:hover': {
            borderColor: palette2.newSecondary.NSIconBorder,
            '&:before': {
                border: `none !important`
            },
        },
        '&.Mui-focused': {
            borderColor: palette2.secondary.Turquoise,
        },
    },
    
})
function getLabelComponent(type) {
    if (type == 'round') return StyledRoundInputLabel
    else return StyledInputLabel
}

function getSelectComponent(type) {
    if (type == 'round') return RoundSelectWithStyles
    else return SelectWithStyles
}
function DropdownIcon(props) {
    return (
        <SvgIcon {...props} viewBox="0 0 32 32" component={ArrowDownIcon} sx={{fontSize: '2.5rem'}} />
    );
  }
function DropdownRoundIcon(props) {
    return (
        <SvgIcon {...props} viewBox="0 0 32 32" component={ArrowDownIcon} sx={{fontSize: '2.5rem'}} />
    );
}

const useStyles = makeStyles(() => ({
    paper: {
      maxHeight: '350px !important'
    },
    list: {
      paddingTop: '0 !important',
      paddingBottom: '0 !important',
      "& li": {
        fontWeight: 400,
        padding: '12px 16px 12px 16px',
        fontSize: '16px',
        borderBottom: `1px solid ${new_theme.palette.newSecondary.NSIconBorder}`,
        "&:hover":{
            color: new_theme.palette.primary.PWhite,
            background: new_theme.palette.primary.MedPurple,
            "& .MuiCheckbox-root":{
                color: new_theme.palette.primary.PWhite,
            },
            "& .MuiListItemText-root .MuiListItemText-primary":{
                color: new_theme.palette.primary.PWhite,
            }
        }
      },
      "& li.Mui-selected": {
        color: new_theme.palette.primary.PWhite,
        background: new_theme.palette.primary.MedPurple,
        "& .MuiCheckbox-root":{
            color: new_theme.palette.primary.PWhite,
        },
        "& .MuiListItemText-root .MuiListItemText-primary":{
            color: new_theme.palette.primary.PWhite,
        }
      },
      "& li.Mui-selected:hover": {
        backgroundColor: new_theme.palette.primary.MedPurple,
        color: new_theme.palette.primary.PWhite,
      }
    }
  }));



export default function StyledSelect(props) {
    const SelectComponent = getSelectComponent(props.type)
    const LabelComponent  = getLabelComponent(props.type)
    const classes = useStyles();
    const menuProps = {
        classes: {
          list: classes.list,
          paper: classes.paper
        },
      };
    return (
        <FormControl fullWidth>
            {props.label && <LabelComponent id="select-label">{props.label}</LabelComponent>}
            <SelectComponent
                IconComponent = {props.type != 'round' ? DropdownIcon : DropdownRoundIcon }
                className="select_icon_style"
                labelId="select-label"
                MenuProps={menuProps}
                {...props}
            >   
            </SelectComponent>
        </FormControl>
    )
}