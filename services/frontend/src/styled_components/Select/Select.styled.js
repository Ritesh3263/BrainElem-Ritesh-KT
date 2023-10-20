import React from "react";

// MUI v5
import { styled } from '@mui/material/styles';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
//Icons
import SvgIcon from "@mui/material/SvgIcon";
import { ReactComponent as arrowBig } from 'icons/icons_48/Arrow big D.svg';
import { ReactComponent as ArrowDownIcon } from 'icons/icons_32/Sort_D_32.svg';
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
        fontFamily: 'Roboto',
        fontWeight: '400',
        fontSize: 15,
        color: palette.neutrals.darkestGrey,
        top: 11,
        '&.MuiInputLabel-shrink': {
            top: 11,
            color: palette.neutrals.darkestGrey,
        }
    },
})

const StyledRoundInputLabel = styled(StyledInputLabel)({
    '&.MuiInputLabel-root': {
        fontSize: 16,
        top: -7,
        '&.MuiInputLabel-shrink': {
            top: 0,
        }
    },
})

const SelectWithStyles = styled((props) => (
    <Select disableUnderline {...props} />
))(({ theme }) => ({
    '&.MuiFilledInput-root': {
        height: 64,
        fontFamily: "Nunito",
        color: palette.neutrals.darkestGrey,
        backgroundColor: palette.neutrals.white,
        opacity: 0.7,
        borderBottom: `2px solid ${palette.primary.green}`,
        borderRadius: '8px 8px 0px 0px',

        "&.MuiInputBase-sizeSmall": {
            height: '40px'
        },

        "&.Mui-disabled": {
            opacity: 0.4,
            backgroundColor: palette.neutrals.white,
            borderBottom: `2px solid ${palette.neutrals.darkestGrey}`,
            '&:hover': {
                opacity: 0.4,
                backgroundColor: palette.neutrals.white,
                borderBottom: `2px solid ${palette.neutrals.darkestGrey}`,
            }
        },
        '&:hover': {
            opacity: 0.75,
            backgroundColor: palette.neutrals.white,
            borderBottom: `2px solid ${palette.secondary.violetSelect}`,
            '&:before': {
                borderBottom: `none !important`
            },
        },
        '&.Mui-focused': {
            opacity: 0.9,
            backgroundColor: palette.neutrals.white,
            borderBottom: `2px solid ${palette.primary.violet}`,
            '&:hover': {
                opacity: 0.9,
                backgroundColor: palette.neutrals.white,
                borderBottom: `2px solid ${palette.primary.violet}`,
            }
        },
        '&:before': {
            borderBottom: `none`
        },
        '&:after': {
            borderBottom: `none`
        },

    },
    '& .MuiFilledInput-input': {
        fontFamily: 'Roboto',
        fontWeight: '400',
        fontSize: 15,
        color: palette.neutrals.almostBlack,

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

    }

}));

const RoundSelectWithStyles = styled(SelectWithStyles)({

    '&.MuiFilledInput-root': {
        borderRadius: 16,
        height: 40,
        border: `1px solid ${palette2.secondary.SBorderGrey}`,
        backgroundColor: `transparent !important`,
        color: palette2.primary.PBorderColor,
        "&.Mui-disabled": {
            border: `1px solid ${palette.neutrals.darkestGrey}`,
            '&:hover': {
                border: `1px solid ${palette.neutrals.darkestGrey}`,
            }
        },
        '&:hover': {
            border: `1px solid ${palette2.secondary.SBorderGrey}`,
            '&:before': {
                border: `none !important`
            },
        },
        '&.Mui-focused': {
            border: `1px solid rgba(217, 220, 221, 0.8)`,
            '&:hover': {
                border: `1px solid ${palette.primary.violet}`,
            }
        },
    },
    '& .MuiFilledInput-input': {
        paddingTop: 10
    },
    '& .MuiFilledInput-input:focus': {
        backgroundColor: 'transparent'
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
        <SvgIcon {...props} viewBox="0 0 32 32" component={ArrowDownIcon} />
    );
  }
function DropdownRoundIcon(props) {
    return (
        <SvgIcon {...props} sx={{"path": {stroke: palette.primary.darkViolet, strokeWidth: '1.5px'}}} viewBox="-5 -5 58 58" component={arrowBig} />
    );
}



export default function StyledSelect(props) {
    const SelectComponent = getSelectComponent(props.type)
    const LabelComponent  = getLabelComponent(props.type)
    return (
        <FormControl fullWidth>
            {props.label && <LabelComponent id="select-label">{props.label}</LabelComponent>}
            <SelectComponent
                IconComponent = {props.type != 'round' ? DropdownIcon : DropdownRoundIcon }
                labelId="select-label"
                {...props}
                variant='filled'
            >
            </SelectComponent>
        </FormControl>
    )
}