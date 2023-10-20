import React, { useEffect, useState } from "react";

// MUI v5
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';

// MUI v4
import { theme } from "../../MuiTheme";
import { param } from "jquery";
const palette = theme.palette;

const TextFieldWithStyles = styled((props) => (
    <TextField InputProps={{ disableUnderline: true }} {...props} />
))(({ theme }) => ({
    width: '100%',
    '& .MuiFilledInput-root': {
        height: '56px',
        fontFamily: "Nunito",
        color: palette.neutrals.darkestGrey,
        backgroundColor: palette.neutrals.white,
        opacity: 0.7,
        borderBottom: `2px solid ${palette.primary.green}`,
        borderRadius: '8px 8px 0px 0px',


        "&.Mui-error":{
            borderBottom: `2px solid ${palette.semantic.error} !important`
        },

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
        "& .MuiInputBase-readOnly":{
            cursor: 'default'
    
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

    },
    '& .MuiInputLabel-root': {
        fontFamily: 'Roboto',
        fontWeight: '400',
        fontSize: 15,
        color: palette.neutrals.darkestGrey,
        top: 3,
        "&.Mui-error":{
            color: `${palette.semantic.error} !important`
        },
        '&.MuiInputLabel-shrink': {
            top: 0,
            color: palette.neutrals.darkestGrey,
        },
        '&.MuiInputLabel-sizeSmall': {
            top: -2,
            '&.MuiInputLabel-shrink': {
                top: 0
            }
        },
    },
    '& .MuiFilledInput-input': {
        fontFamily: 'Roboto',
        fontWeight: '400',
        fontSize: 15,
        color: palette.neutrals.almostBlack,
        "&.MuiInputBase-inputSizeSmall": {
            paddingTop: '19px'
        },
        '&.MuiInputBase-inputSizeSmall.MuiInputBase-inputHiddenLabel': {
            paddingTop: '14px'
            
        },
    },
    '& .MuiInputLabel-asterisk': {
        color: palette.semantic.error,
    },
    "& .MuiInputAdornment-positionStart": {
        marginTop: '16px'
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


export default function StyledTextField(props) {
    // Local state value - Use when you want to have independant state. Used for:
    // 1. To call saving function only when user finish to write the text(eg. GroupExaminationTableWithActions)
    // 2. When you use a reference, and you want to controll it (eg. DisplayTestResults)
    const [localValue, setLocalValue] = useState();
    const [lastBluredLocalValue, setLastBluredLocalValue] = useState();

    useEffect(() => {
        setLocalValue(props.localValue)
    }, [props.localValue]);

    return (

        <TextFieldWithStyles
            sx={{ mb: 2 }}
            variant='filled'
            inputProps={{
                pattern: ".*\\S+.*",
                title: "This field contains only whitespaces. Please remove them.",
            }}
            InputLabelProps={
                (props.type == 'number') ? { shrink: true } : {}}
            {...props}
            
            //  Local state value ###########################################################################
            //  This does not affect normal usage of TextField
            {...(props.localValue !== undefined ? {
                value: localValue,
                dafaultValue: localValue,
                onChange: (event)=>{
                    // User provided his own onChange function
                    if (props.localOnChange){
                        props.localOnChange(event, localValue, setLocalValue)
                    }
                    // By default just modify local value
                    else setLocalValue(event.target.value)
                },
                onBlur: (event) => {
                    if ((props.localOnBlur && lastBluredLocalValue && lastBluredLocalValue !== event.target.value) ||
                        (props.localOnBlur && !lastBluredLocalValue && props.localValue !== event.target.value))
                        props.localOnBlur(event, localValue, setLocalValue)
                    setLastBluredLocalValue(event.target.value)
                },
                onKeyUp: (event) => {if (event.key === 'Enter') event.target.blur()},
            } : {})}
            //##################################################################################################

        >
        </TextFieldWithStyles>
    )
}