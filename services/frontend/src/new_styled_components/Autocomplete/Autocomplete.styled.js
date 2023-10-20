import React, { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";

// Contexts
import { useMainContext } from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";

// MUI v5
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { styled } from '@mui/material/styles';

// Icons
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

// MUI v4
import { theme } from 'MuiTheme';
import { new_theme } from 'NewMuiTheme';

// ONLY FOR EXPLORE ############################
const OutlinedAutocomplete = styled(Autocomplete)({
    '& .MuiInputLabel-root': {
        fontFamily: 'Nunito',
        fontWeight: '400',
        fontSize: 16,
        color: new_theme.palette.newSupplementary.NSupText,
        '&.Mui-focused': {
            color: new_theme.palette.newSupplementary.NSupText,
        },
        '&.MuiInputLabel-shrink': {
            color: new_theme.palette.newSupplementary.NSupText,
        }
    },
    "& .MuiInputBase-root": {
        height: '52px',
        fontSize: '16px',
        borderRadius: '8px',
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
        ".MuiAutocomplete-popupIndicator": {
            padding: '3px 10px'
        }
    },
})
// ONLY FOR EXPLORE ############################
const FilledAutocomplete = styled(TextField)({
    "&.MuiAutocomplete-root": {
        height: '40px',
        width: '100%',
        maxWidth: '350px',
    },
    
    "& .MuiInputBase-root": {
        height: '40px',
        paddingTop: 0,
        paddingBottom: 0,
        paddingLeft: '20px',
        fontSize: '16px',
        color: new_theme.palette.newSupplementary.NSupText//theme.palette.neutrals.darkestGrey
    },
    '& .MuiInputAdornment-root': {
        marginRight: 0
    },
    '& .Mui-focused': {
        "&.MuiInputBase-root": {
            color: theme.palette.neutrals.darkestGrey
        },
    }
})

function getSelectComponent(type) {
    if (type == 'outlined') {
        return OutlinedAutocomplete
    }
    else{
        return FilledAutocomplete
    } 
}

// Autocomplete - used as search filed
// - suggestions - list of suggestions to be displayed
// - getSuggestions - optional - when provided new suggestion will be loaded on input changes
// - explore - rounded input for Explore 

export default function EAutocomplete(props) {
    const AutocompleteComponent = getSelectComponent(props.variant)
    return (
        <AutocompleteComponent
            {...props}
            variant="filled"
            disablePortal
            id="autocomplete_field"
            options={props.options}
            fullWidth={props.fullWidth}
            renderInput={(params) => <TextField {...params} label={props.label}/>}
            popupIcon={<KeyboardArrowDownIcon sx={{color: new_theme.palette.newSupplementary.NSupText }} />}
            />
    );
}