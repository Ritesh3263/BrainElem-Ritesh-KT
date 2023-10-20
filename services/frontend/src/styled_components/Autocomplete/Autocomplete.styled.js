import React, { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";

// Contexts
import { useMainContext } from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";

// MUI v5
import Paper from "@mui/material/Paper"
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { styled } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';

// Icons
import ESvgIcon from "styled_components/SvgIcon";
import ETextField from "styled_components/TextField";
import { ReactComponent as SearchIcon } from "icons/icons_32/Search_32.svg";

// MUI v4
import { theme } from 'MuiTheme';
import { new_theme } from 'NewMuiTheme';
const StyledPaper = function (props) {
    return (<Paper {...props} style={{ color: theme.palette.neutrals.darkestGrey, backdropFilter: 'blur(4px)', background: theme.palette.glass.opaque }} />)
}


const StyledAutocomplete = styled(Autocomplete)({
    width: '100%',
    maxWidth: '310px',
})

const StyledTextField = styled(ETextField)({
    '& .MuiFilledInput-root':{
        paddingTop: '4px !important'
    },
    '& .MuiInputAdornment-positionStart':{
        marginTop: '0px !important',
        width: '16px'
    }
})


// ONLY FOR EXPLORE ############################
const ExploreAutocomplete = styled(Autocomplete)({
    height: '40px',
    width: '100%',
    maxWidth: '310px',
    border: '1px solid white',
    borderRadius: '32px',
    background: theme.palette.glass.light,
    backdropFilter: 'blur(4px)',
    '& fieldset': { display: 'none' },
    '&.Mui-focused': {
        border: 'none',
        background: theme.palette.glass.opaque,
    },
    'paper': {
        background: 'yellow'
    }
})
// ONLY FOR EXPLORE ############################
const ExpoloreTextField = styled(TextField)({
    height: '40px',
    width: '100%',
    maxWidth: '310px',
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
        '& svg': {
            "& path": { stroke: theme.palette.neutrals.darkestGrey },
            "& circle": { stroke: theme.palette.neutrals.darkestGrey },
            "& line": { stroke: theme.palette.neutrals.darkestGrey }
        }
    }


})






// Autocomplete - used as search filed
// - suggestions - list of suggestions to be displayed
// - getSuggestions - optional - when provided new suggestion will be loaded on input changes
// - explore - rounded input for Explore 
export default function EAutocomplete({ suggestions = [], getSuggestions, explore = false, ...props }) {
    const { t } = useTranslation();
    const [options, setOptions] = useState(suggestions)
    const [openOptions, setOpenOptions] = useState(false)
    const [loading, setLoading] = useState(false)

    const { F_handleSetShowLoader } = useMainContext();
    useEffect(() => {
        // This timeout will prevent running this code on every letter
        // It will run only once per x miliseconds
        const timeOutId = setTimeout(async () => {
            if (getSuggestions) {
                setOptions([])
                if (props.inputValue) {
                    setLoading(true)
                    try {
                        let newOptions = await getSuggestions(props.inputValue)
                        newOptions = [...new Set(newOptions)].slice(0, 30)
                        setOptions(newOptions)
                        setLoading(false)
                    } catch (e) {
                        setLoading(false)
                    }

                } else setOptions([])
            }
        }, 200);
        return () => clearTimeout(timeOutId);
    }, [props.inputValue]);

    let SelectedAutocomplete = explore ? ExploreAutocomplete : StyledAutocomplete
    let SelectedTextField = explore ? ExpoloreTextField : StyledTextField
    let SelectedIcon = explore ? <ESvgIcon sx={{ transform: "scale(-1,1)" }} color={theme.palette.shades.white70} viewBox="2 2 28 28"  component={SearchIcon} /> : <ESvgIcon viewBox="-2 -2 36 36" color={theme.palette.neutrals.darkestGrey} component={SearchIcon} />
    return (
        <SelectedAutocomplete
            {...props}
            open={openOptions}
            onOpen={() => setOpenOptions(true)}
            onClose={() => setOpenOptions(false)}

            loading={loading}
            loadingText={t("Loading...")}
            PaperComponent={StyledPaper}
            // Makes it possible to edit selected value
            isOptionEqualToValue={(option, value) => option.value === value}
            options={options}
            clearIcon={false}
            //{...(filterOptions ? { filterOptions: filterOptions } : {})}
            renderInput={(params) => <SelectedTextField
                {...params}
                autoComplete='off'
                placeholder={props.placeholder}
                onKeyDown={e => {

                    if (e.keyCode === 13) {
                        console.log(props.inputValue, props.value)
                        if (props.inputValue && (props.inputValue == props.value)) {
                            // Fake loading screen when searching the same query
                            F_handleSetShowLoader(true)
                            setOpenOptions(false)
                            setTimeout(() => F_handleSetShowLoader(false), 300)
                        }
                    }
                }}
                InputProps={{
                    ...params.InputProps,
                    startAdornment: undefined,
                    startAdornment: (
                        <InputAdornment position="start">
                            {SelectedIcon}
                        </InputAdornment>
                    )
                }}

            />}
        />
    );
}