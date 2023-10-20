import React, { useState } from "react";
//import {GridToolbarDensitySelector, GridToolbarFilterButton, GridToolbarColumnsButton, GridToolbarExport} from "@material-ui/data-grid"; //old
import { GridToolbarDensitySelector, GridToolbarFilterButton, GridToolbarColumnsButton, GridToolbarExport } from '@mui/x-data-grid';
import TextField from "@material-ui/core/TextField";
import SearchIcon from "@material-ui/icons/Search";
import IconButton from "@material-ui/core/IconButton";
import ClearIcon from "@material-ui/icons/Clear";
import PropTypes from "prop-types";
import { createTheme, createStyles, makeStyles } from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";
import { BsX } from "react-icons/bs";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { theme } from "../../../MuiTheme";
import { styled } from "@mui/system";
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TuneIcon from '@mui/icons-material/Tune';
import { new_theme } from "NewMuiTheme";
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
        }),
    { defaultTheme },
);


StyledTableToolbar.propTypes = {
    clearSearch: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
};


const StyledGridToolbarFilterButton = styled(({ cptRef, ...otherProps }) => (
    <GridToolbarFilterButton {...otherProps} />
))`
    color: ${new_theme.palette.newSupplementary};
    margin-right: 3px;
    font-size: 16px;
    text-transform: capitalize;
    max-height: 30px;
    border: 1px solid rgba(217, 220, 221, 0.8);
    border-radius: 8px;
    padding:18px 22px;
    min-width:110px;
`;

const StyledGridToolbarColumnsButton = styled(({ cptRef, ...otherProps }) => (
    <GridToolbarColumnsButton {...otherProps} />
))`
   color: ${new_theme.palette.newSupplementary};
   margin-right: 3px;
   font-size: 16px;
   text-transform: capitalize;
   max-height: 30px;
   border: 1px solid rgba(217, 220, 221, 0.8);
   border-radius: 8px;
   padding:18px 22px;
   min-width:110px;
`;

const StyledGridToolbarDensitySelector = styled(({ cptRef, ...otherProps }) => (
    <GridToolbarDensitySelector {...otherProps} />
))`
   color: ${new_theme.palette.newSupplementary};
   margin-right: 3px;
   font-size: 16px;
   text-transform: capitalize;
   max-height: 30px;
   border: 1px solid rgba(217, 220, 221, 0.8);
   border-radius: 8px;
   padding:18px 22px;
   min-width:110px;
`;

const StyledGridToolbarExport = styled(({ cptRef, ...otherProps }) => (
    <GridToolbarExport {...otherProps} />
))`
    color: #fff;
    background: #f79c30;
    border-radius: 8px;
    border: 1px solid #f79c30;
    font-size: 16px;
    text-transform: capitalize;
    max-height: 30px;
    padding:18px 22px;
    min-width:110px;
`;


export default function StyledTableToolbar(props) {
    const { t } = useTranslation();
    const classes = useStyles();
    const [isToggled, setIsToggled] = useState(false);
    return (
        <>
            <div >
                {/* <IconButton variant="contained" className="mx-2 p-1" size="large"
                        onClick={() => { setIsToggled(p => !p) }}
                        style={{ backgroundColor: theme.palette.secondary.ui }}>
                        {isToggled ? (
                            <BsX />
                        ) : (
                            <HiOutlineDotsHorizontal />
                        )}
                    </IconButton> */}
                {/* {isToggled && ( */}

                <div className="filter">
                    <div className="filterRight-sec">
                        <StyledGridToolbarFilterButton />
                        <StyledGridToolbarColumnsButton />
                        <StyledGridToolbarDensitySelector />
                        <TextField
                        label="Search"
                        size="small"
                        variant="outlined"
                        value={props.value}
                        onChange={props.onChange}
                        placeholder={`${t("Search")}...`}
                        className={classes.textField}
                        InputProps={{
                            // startAdornment: <SearchIcon fontSize="small" />,
                            endAdornment: (
                                <IconButton
                                    title={t("Clear")}
                                    aria-label="Clear"
                                    size="small"
                                    style={{ visibility: props.value ? 'visible' : 'hidden' }}
                                    onClick={() => props.clearSearch()}
                                >
                                    <ClearIcon fontSize="small" />
                                </IconButton>
                            ),
                        }}
                    />
                    </div>
                    <div>
                        <StyledGridToolbarExport />
                    </div>
                </div>

                {/* )} */}
                {/* <TextField
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
                                onClick={() => props.clearSearch()}
                            >
                                <ClearIcon fontSize="small" />
                            </IconButton>
                        ),
                    }}
                /> */}
            </div>

            {/* <div className="filter">
                <div className="filterRight-sec">
                    <div className="fiterText"> <TuneIcon /> Filters</div>
                    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                        <InputLabel id="demo-select-small">Columns</InputLabel>
                        <Select
                            labelId="demo-select-small"
                            id="demo-select-small"
                            label="Columns"
                        >
                            <MenuItem value="ID">
                                <em>ID</em>
                            </MenuItem>
                            <MenuItem value="Username">Username</MenuItem>
                            <MenuItem value="Full name">Full name</MenuItem>
                            <MenuItem value="Role">Role</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                        <InputLabel id="demo-select-small">Operator</InputLabel>
                        <Select
                            labelId="demo-select-small"
                            id="demo-select-small"
                            label="Operator"
                        >
                            <MenuItem value="ID">
                                <em>ID</em>
                            </MenuItem>
                            <MenuItem value="Username">Username</MenuItem>
                            <MenuItem value="Full name">Full name</MenuItem>
                            <MenuItem value="Role">Role</MenuItem>
                        </Select>
                    </FormControl>

                    <TextField
                        label="Search"
                        size="small"
                        variant="outlined"
                        value={props.value}
                        onChange={props.onChange}
                        placeholder={`${t("Search")}...`}
                        className={classes.textField}
                        InputProps={{
                            // startAdornment: <SearchIcon fontSize="small" />,
                            endAdornment: (
                                <IconButton
                                    title={t("Clear")}
                                    aria-label="Clear"
                                    size="small"
                                    style={{ visibility: props.value ? 'visible' : 'hidden' }}
                                    onClick={() => props.clearSearch()}
                                >
                                    <ClearIcon fontSize="small" />
                                </IconButton>
                            ),
                        }}
                    />
                </div>
                <div>
                    <button class="btn_download">Download as CSV</button>
                </div>
            </div> */}
        </>

    );
}