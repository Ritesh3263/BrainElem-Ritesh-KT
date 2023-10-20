import React, { useEffect, useState } from "react";

// MUI v5
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';

// MUI v4
import { theme } from "../../MuiTheme";
import { new_theme } from "NewMuiTheme";
import { param } from "jquery";
const palette = theme.palette;
const palette2 = new_theme.palette

const TextFieldWithStyles = styled((props) => (
    <TextField InputProps={{ disableUnderline: true }} {...props} />
))(({ theme }) => ({
    width: '100%',
    '& .MuiFilledInput-root': {
        height: '52px',
        fontFamily: "Nunito",
        color: palette2.newSupplementary.NSupText,
        backgroundColor: palette.neutrals.white,
        opacity: 0.7,
        borderBottom: `2px solid ${palette.primary.green}`,
        borderRadius: '8px 8px 0px 0px',


        "&.Mui-error":{
            borderBottom: `2px solid ${palette.semantic.error} !important`
        },

        "&.MuiInputBase-sizeSmall": {
            height: '45px'
        },
        "&.Mui-disabled": {
            opacity: 0.4,
            backgroundColor: palette.neutrals.white,
            borderBottom: `2px solid ${palette2.newSupplementary.NSupText}`,
            '&:hover': {
                opacity: 0.4,
                backgroundColor: palette.neutrals.white,
                borderBottom: `2px solid ${palette2.newSupplementary.NSupText}`,
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
        fontFamily: 'Nunito',
        fontWeight: '400',
        fontSize: 16,
        color: palette2.newSupplementary.NSupText,
        top: -1,
        "&.Mui-error":{
            color: `${palette2.newSupplementary.NSupText} !important`
        },
        '&.MuiInputLabel-shrink': {
            top: 0,
            color: palette2.newSupplementary.NSupText,
            transform: "translate(12px, 6px) scale(0.75)",
        },
        '&.MuiInputLabel-sizeSmall': {
            top: -2,
        },
    },
    '& .MuiFilledInput-input': {
        fontFamily: 'Nunito',
        fontWeight: '400',
        fontSize: 16,
        color: palette.neutrals.almostBlack,
        height: 0,
        "&.MuiInputBase-inputSizeSmall": {
            paddingTop: '19px',
            height: '15px'
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