import React, {useState} from "react";
//import {GridToolbarDensitySelector, GridToolbarFilterButton, GridToolbarColumnsButton, GridToolbarExport} from "@material-ui/data-grid"; //old
import { GridToolbarDensitySelector, GridToolbarFilterButton, GridToolbarColumnsButton, GridToolbarExport } from '@mui/x-data-grid';
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
import {styled} from "@mui/system";

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

const StyledGridToolbarFilterButton = styled(({cptRef,...otherProps }) => (
    <GridToolbarFilterButton {...otherProps} />
))`
    color: rgba(168, 92, 255, 1);
    background: rgba(255,255,255,0.7);
    border-radius: 30px;
    margin-right: 3px;
    border: 1px solid rgba(168, 92, 255, 1);
    font-size: small;
    text-transform: capitalize;
    max-height: 30px;
`;

const StyledGridToolbarColumnsButton = styled(({cptRef,...otherProps }) => (
    <GridToolbarColumnsButton {...otherProps} />
))`
    color: rgba(168, 92, 255, 1);
    background: rgba(255,255,255,0.7);
    border-radius: 30px;
    margin-right: 3px;
    border: 1px solid rgba(168, 92, 255, 1);
    font-size: small;
    text-transform: capitalize;
    max-height: 30px;
`;

const StyledGridToolbarDensitySelector = styled(({cptRef,...otherProps }) => (
    <GridToolbarDensitySelector {...otherProps} />
))`
    color: rgba(168, 92, 255, 1);
    background: rgba(255,255,255,0.7);
    border-radius: 30px;
    margin-right: 3px;
    border: 1px solid rgba(168, 92, 255, 1);
    font-size: small;
    text-transform: capitalize;
    max-height: 30px;
`;

const StyledGridToolbarExport = styled(({cptRef,...otherProps }) => (
    <GridToolbarExport {...otherProps} />
))`
    color: rgba(168, 92, 255, 1);
    background: rgba(255,255,255,0.7);
    border-radius: 30px;
    margin-right: 3px;
    border: 1px solid rgba(168, 92, 255, 1);
    font-size: small;
    text-transform: capitalize;
    max-height: 30px;
`;


export default function StyledTableToolbar(props) {
    const { t } = useTranslation();
    const classes = useStyles();
    const [isToggled, setIsToggled] = useState(false);
    return (
        <div className={classes.root}>
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
                        <StyledGridToolbarFilterButton />
                        <StyledGridToolbarColumnsButton />
                        <StyledGridToolbarDensitySelector />
                        <StyledGridToolbarExport />
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