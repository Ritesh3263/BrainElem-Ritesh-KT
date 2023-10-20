import React, {useState} from "react";
import {GridToolbarDensitySelector, GridToolbarFilterButton, GridToolbarColumnsButton, GridToolbarExport} from "@material-ui/data-grid"; //old
//import { GridToolbarDensitySelector, GridToolbarFilterButton, GridToolbarColumnsButton, GridToolbarExport } from '@mui/x-data-grid';
import TextField from "@material-ui/core/TextField";
import SearchIcon from "@material-ui/icons/Search";
import IconButton from "@material-ui/core/IconButton";
import ClearIcon from "@material-ui/icons/Clear";
import PropTypes from "prop-types";
import {createTheme, createStyles, makeStyles} from "@material-ui/core/styles";
import {useTranslation} from "react-i18next";
import { BsX} from "react-icons/bs";
import {HiOutlineDotsHorizontal} from "react-icons/hi";
import { theme } from "../../../MuiTheme";

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
                [theme.breakpoints.down('xs')]: {
                    width: '100%',
                },
                margin: theme.spacing(1, 0.5, 1.5),
                '& .MuiSvgIcon-root': {
                    marginRight: theme.spacing(0.5),
                },
                '& .MuiInput-underline:before': {
                    borderBottom: `1px solid ${theme.palette.divider}`,
                },
            },
            z1: { zIndex: "1" },
            z10: { zIndex: "10" },
            z100: { zIndex: "100" },
        }),
    { defaultTheme },
);


TableToolbar.propTypes = {
    clearSearch: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
};

export default function TableToolbar(props) {
    const { t } = useTranslation();
    const classes = useStyles();
    const [isToggled, setIsToggled] = useState(false);
    return (
        <div className={`${classes.root} ${classes.z10}`}>
            <div>
                <IconButton variant="contained"  className="mx-2 p-1" size="large"
                            onClick={()=>{setIsToggled(p=>!p)}}
                            style={{ backgroundColor: theme.palette.secondary.ui}}>
                    {isToggled ? (
                        <BsX />
                    ) : (
                        <HiOutlineDotsHorizontal />
                    )}
                </IconButton>
                {isToggled&&(
                    <>
                    <GridToolbarFilterButton />
                    <GridToolbarColumnsButton />
                    <GridToolbarDensitySelector />
                    <GridToolbarExport />
                    </>
                )}
            </div>
            <TextField
                variant="standard"
                value={props.value}
                onChange={props.onChange}
                placeholder={`${t("Search")}...`}
                className={classes.textField}
                InputProps={{
                    startAdornment: <SearchIcon fontSize="small" />,
                    endAdornment: (
                        <IconButton
                            title={t("Clear")}
                            aria-label="Clear"
                            size="small"
                            style={{ visibility: props.value ? 'visible' : 'hidden' }}
                            onClick={()=>props.clearSearch()}
                        >
                            <ClearIcon fontSize="small" />
                        </IconButton>
                    ),
                }}
            />
        </div>
    );
}