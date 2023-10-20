import React from "react";
import PropTypes from "prop-types";
import TextField from "@material-ui/core/TextField";
import SearchIcon from "@material-ui/icons/Search";
import IconButton from "@material-ui/core/IconButton";
import ClearIcon from "@material-ui/icons/Clear";
import {createTheme, createStyles, makeStyles} from "@material-ui/core/styles";
import {useTranslation} from "react-i18next";

const defaultTheme = createTheme();
const useStyles = makeStyles(
    (theme) =>
        createStyles({
            root: {
                padding: theme.spacing(0.5, 0.5, 0),
                justifyContent: 'space-between',
                display: 'flex',
                alignItems: 'flex-start',
                flexWrap: 'wrap',
            },
            textField: {
                // [theme.breakpoints.down('xs')]: {
                //     width: '100%',
                // },
                width: '100%',
                margin: theme.spacing(1, 0.5, 1.5),
                '& .MuiSvgIcon-root': {
                    marginRight: theme.spacing(0.5),
                },
                '& .MuiInput-underline:before': {
                    borderBottom: `1px solid ${theme.palette.darkViolet}`,
                },
            },

        }),
    { defaultTheme },
);

SearchField.propTypes = {
    clearSearch: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
};

export default function SearchField(props){
    const { t } = useTranslation();
    const classes = useStyles();
    return(
        <div className={classes.root}>
            <TextField
                variant="standard"
                value={props.value}
                onChange={props.onChange}
                placeholder={`${t("Search")}...`}
                className={classes.textField}
                InputProps={{
                    startAdornment: <SearchIcon fontSize="small" style={{color:`rgba(82, 57, 112, 1)`}}/>,
                    endAdornment: (
                        <IconButton
                            title={t("Clear")}
                            aria-label="Clear"
                            size="small"
                            style={{ visibility: props.value ? 'visible' : 'hidden' }}
                            onClick={()=>props.clearSearch()}
                        >
                            <ClearIcon fontSize="small" style={{color:`rgba(82, 57, 112, 1)`}}/>
                        </IconButton>
                    ),
                }}
            />
        </div>
    )
}