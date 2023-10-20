import React, {useEffect, useState} from "react";
import EIconButton from "styled_components/EIconButton";
import ClearIcon from "@mui/icons-material/Clear";
import PropTypes from "prop-types";
import { ReactComponent as AddIcon } from 'icons/icons_32/Add2_32.svg';
import { ReactComponent as SearchIcon } from 'icons/icons_48/Search.svg';
import { ReactComponent as ArrowSDIcon } from 'icons/icons_48/Arrow small D.svg';
import {useTranslation} from "react-i18next";
import { theme } from 'MuiTheme';
import { Box, Grid, IconButton, InputBase, Paper, Menu, Typography, MenuItem, styled, alpha, Button } from "@mui/material";
import ESvgIcon from "styled_components/SvgIcon";
import { makeStyles } from "@material-ui/core/styles";
import { EButton } from "styled_components";
import {useNavigate} from "react-router-dom";

//Redux
import {useDispatch, useSelector} from "react-redux";
import { add, setType, setActiveIndex } from "app/features/ContentFactory/data"

const palette = theme.palette;

const useStyles = makeStyles(() =>({
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
                '& .MuiESvgIcon-root': {
                    marginRight: theme.spacing(0.5),
                },
                '& .MuiInput-underline:before': {
                    borderBottom: `1px solid ${palette.divider}`,
                },
            },
            inputRoot: {
                color: 'inherit',
            },
            
            inputInput: {
                padding: theme.spacing(1, 1, 1, 0),
                // vertical padding + font size from searchIcon
                paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
                transition: theme.transitions.create('width'),
                color: palette.neutrals.darkestGrey,
                '&::placeholder': {
                    color: palette.neutrals.white + ' !important',
                },
                '&::-webkit-input-placeholder': {
                    color: palette.neutrals.white + ' !important',
                },
                width: '100%',
                [theme.breakpoints.up('md')]: {
                    width: '20ch',
                },
            },
            search: {
                position: 'relative',
                borderRadius: '2rem',
                background: palette.glass.light,
                border:`1px solid ${palette.neutrals.white}`,
                opacity:'0.8',
                '&:hover': {
                    opacity: '1',
                },
                marginLeft: 8,
                width: '100%',
                [theme.breakpoints.up('sm')]: {
                    marginLeft: theme.spacing(3),
                    width: '480px',
                },
            },
            searchIcon: {
                padding: theme.spacing(0, 2),
                height: '100%',
                position: 'absolute',
                pointerEvents: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            },
            searchBar: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                padding: '2px 4px',
                borderRadius: '2rem !important',
                background: palette.shades.white50 + ' !important',
                border: `1px solid ${palette.shades.white70}`,
                boxShadow: 'none !important',
                '&:hover': {
                    background: palette.shades.white70,
                    border: '1px solid ' + palette.shades.white90,
                },
            },
            searchBarFocused: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                padding: '2px 4px',
                borderRadius: '2rem !important',
                background: palette.shades.white90 + ' !important',
                border: '1px solid ' + palette.neutrals.white,
                boxShadow: '0px 2px 10px 2px ' + palette.shades.lightGrey + ' !important',
                '&:hover': {
                    background: palette.shades.white90,
                    border: '1px solid ' + palette.neutrals.white,
                },
            },
        }));


StyledTableToolbar.propTypes = {
    clearSearch: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
};


export default function StyledTableToolbar(props) {
    const { t } = useTranslation();
    const classes = useStyles();
    const navigate = useNavigate();
    const [onFocus, setOnFocus] = useState(false);
    const [ showSearch, setShowSearch ] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    // Load state from Redux store
    const {activeIndex, contents} = useSelector(s=>s.contentFactory);
    const dispatch = useDispatch();

    // create a search bar component
    const SearchBar = () => {
        return (<Paper
            component="form"
            className={onFocus?classes.searchBarFocused:classes.searchBar}
            >
            <IconButton sx={{ p: '5px 2px 5px 10px' }} aria-label="search" style={{pointerEvents:'none'}}>
                <ESvgIcon transform="scale(-1 1)" color={(onFocus||props.value)?theme.palette.neutrals.darkestGrey:theme.palette.shades.white90} viewBox="4 5 40 40" component={SearchIcon} />
            </IconButton>
            <InputBase
                sx={{ ml: 1, flex: 1 }}
                classes={{
                    root: classes.inputRoot,
                    input: classes.inputInput,
                }}
                placeholder={`${t("Search")}...`}
                value={props.value}
                onChange={props.onChange}
                onFocus={()=>setOnFocus(true)}
                onBlur={()=>setOnFocus(false)}
                inputProps={{ 'aria-label': 'search' }}
                autoFocus={onFocus}  
            />
            {props.value && !onFocus && <IconButton type="button" sx={{ p: '5px 2px 5px 10px', color:theme.palette.neutrals.darkestGrey, ml:'-36px' }} aria-label="clear" onClick={()=>{console.log("heing here");props.clearSearch();}} >
                <ClearIcon />
            </IconButton>}
        </Paper>)
    }

    const StyledMenu = styled((props2) => (
        <Menu
          elevation={0}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          {...props2}
        />
      ))(({ theme }) => ({
        '& .MuiPaper-root': {
          borderRadius: 4,
          marginTop: theme.spacing(1),
          minWidth: 180,
          [theme.breakpoints.up('md')]: {
            minWidth: 240,
            },
          color: palette.neutrals.almostBlack,
          boxShadow:
            'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
          '& .MuiMenu-list': {
            padding: '4px 0',
          },
          '& .MuiMenuItem-root': {
            '& .MuiSvgIcon-root': {
              fontSize: 18,
              color: theme.palette.text.secondary,
              marginRight: theme.spacing(1.5),
            },
            '&:active': {
              backgroundColor: alpha(
                theme.palette.primary.main,
                theme.palette.action.selectedOpacity,
              ),
            },
          },
        },
      }));

      const handleMenuClick = (type) => {
        setAnchorEl(null);
        if (activeIndex > 0) dispatch(setType(type));
        else dispatch(add({ contentType: type}));
        navigate(props.navOptions.btnUrl);
      }


    return (
        <>
            <Grid container spacing={2} sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                {/* title */}
                <Grid item xs={2} sx={{justifyContent: 'flex-start', alignItems: 'center' }}>
                    <Typography variant="h5" id="tableTitle" component="h2" sx={{textAlign: 'left' }}>
                        {props.navOptions.title}
                    </Typography>
                </Grid>
                {/* three icon buttons */}
                <Grid item xs={10} container spacing={2} sx={{justifyContent: 'flex-end', alignItems: 'center', mt:0}}>
                    <Box display={{xs:"block", sm: 'block', md: 'none' }}>
                        <EIconButton
                            style={{backgroundColor: 'rgba(168, 92, 255, 1)', }}
                            onClick={(e)=>{
                                e.stopPropagation();
                                setShowSearch(p=>!p);
                            }} size="large" variant="contained" 
                            color={showSearch?"primary":"secondary"} >
                            <ESvgIcon color={showSearch?'white':theme.palette.primary.darkViolet} viewBox="0 0 48 48" component={SearchIcon} style={{fontSize: '2rem'}} />
                        </EIconButton>
                    </Box>
                    <Box display={{ xs: 'none', sm: 'none', md: 'block' }}>
                        <SearchBar />
                    </Box>
                    <Box display={{xs:"block", sm: 'block', md: 'none' }}>
                        <EIconButton
                            style={{backgroundColor: 'rgba(168, 92, 255, 1)', }}
                            onClick={(e)=>{
                                e.stopPropagation();
                                setAnchorEl(e.currentTarget);
                            }} size="large" variant="contained"
                            color="primary" >
                            <ESvgIcon color={'white'} viewBox="0 0 32 32" component={AddIcon} style={{fontSize: '2rem'}} />
                        </EIconButton>
                    </Box>
                    <Box display={{ xs: 'none', sm: 'none', md: 'block' }}>
                        <EButton
                            id="demo-customized-button"
                            aria-controls={open ? 'demo-customized-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                            eSize='medium'
                            disableElevation
                            sx={{p:'0 12px 0 14px !important'}}
                            onClick={(e)=>{ setAnchorEl(e.currentTarget); }}
                            endIcon={<ESvgIcon color={'white'} viewBox="16 16 16 16" component={ArrowSDIcon} style={{fontSize: '2rem'}} />}
                        >
                            {props.navOptions.btnLabel}
                        </EButton>
                    </Box>
                    <StyledMenu
                        id="demo-customized-menu"
                        MenuListProps={{
                        'aria-labelledby': 'demo-customized-button',
                        }}
                        anchorEl={anchorEl}
                        open={open}
                        onClose={()=>{setAnchorEl(null)}}
                    >
                        <MenuItem disableRipple onClick={()=>handleMenuClick("PRESENTATION")}>{t("Lesson")}</MenuItem>
                        <MenuItem disableRipple onClick={()=>handleMenuClick("TEST")}>{t("Test")}</MenuItem>
                        <MenuItem disableRipple onClick={()=>handleMenuClick("ASSET")}>{t("Asset")}</MenuItem>
                    </StyledMenu>
                </Grid>
                {/* extra row to appear when clicked on search or filter */}
                {showSearch && <Grid item component={Box} xs={12} display={{ xs: showSearch?"block":"none", sm: showSearch?"block":"none", md: "none" }}>
                    <SearchBar />
                </Grid>}
            </Grid>
        </>);
}