import React,{useState} from 'react';
import {useTranslation} from "react-i18next";
import { useLocation } from "react-router-dom";

// MUI v5
import SvgIcon from "@mui/material/SvgIcon";
import EMenu from "styled_components/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from '@mui/material/Divider';
import { MoreVert } from '@mui/icons-material';
import { ThemeProvider, Typography, Box } from '@mui/material';
import {EButton} from "styled_components";
import Switch from '@mui/material/Switch';
// Icons
import { ReactComponent as MoreIcon } from '../../icons/icons_32/More_32.svg';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { new_theme } from 'NewMuiTheme';
import { IconButton } from '@mui/material';
import StyledEIconButton from 'new_styled_components/IconButton.js/IconButton.styled';
import { useEffect } from 'react';


export default function OptionsButton(props) {
    const { t} = useTranslation();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const location = useLocation();
    // const label = { inputProps: { 'aria-label': 'Switch demo' } };
    const {
        btns,
        fullWidth,
        btnName,
        disabled = false,
        eSize='medium',
        currentItemId=undefined,
    } = props;
    const [updatedBtns, setUpdatedBtns] = useState([]);
    const menuItems = btns?.map((i) =>{
        if (i?.name === 'divider') return ( <Divider key={i.id}/>)
        else return (
                <>
                {location.pathname.includes('examinate') ? <>
                    {i.id == 1 && <Typography variant="subtitle1" component="h6" sx={{ borderBottom: `2px solid ${new_theme.palette.newSecondary.NSIconBorder}`, fontWeight: '700', padding: '8px 12px 6px 12px' }}>{t("Display")}</Typography>}
                    {i.id == 1 || i.id == 2 ? <>
                        <Box className='switchUnderPop' sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${new_theme.palette.newSecondary.NSIconBorder}`, padding: '8px 12px 6px 12px' }}>
                            <Typography variant="body4" component="h6">{i.id == 1 ? t("Single page") : t("Separated pages")}</Typography>
                            <Switch checked={i?.isToggle} onChange={(event) => {
                                event.stopPropagation()
                                setAnchorEl(null)
                                i.action({ currentItemId: currentItemId ? currentItemId : null, type: i?.type ? i.type : undefined })
                            }} />
                        </Box>
                    </> : <></>
                    }
                    {i.id == 3 && <Typography variant="subtitle1" component="h6" sx={{ borderBottom: `2px solid ${new_theme.palette.newSecondary.NSIconBorder}`, fontWeight: '700', padding: '8px 12px 6px 12px' }}>{t("File")}</Typography>}
                    {i.id == 3 || i.id == 4 ? <>
                        <MenuItem
                            className='menu_list'
                            sx={{ borderBottom: `1px solid ${new_theme.palette.newSecondary.NSIconBorder}` }}
                            disabled={!!i?.disabled} key={i.id}
                            onClick={(event) => {
                                event.stopPropagation()
                                setAnchorEl(null)
                                i.action({ currentItemId: currentItemId ? currentItemId : null, type: i?.type ? i.type : undefined })
                            }}>

                            {i.icon && <div style={{ paddingRight: '8px' }}>{i.icon}</div>}
                            <Typography variant="body4" component="span">{t(i.name)}</Typography>
                            {(i?.primary) && (!!i?.disabled) && (<small style={{ paddingLeft: '5px' }}>{i.primary}</small>)}
                        </MenuItem>
                    </> : <></>
                    }
                </> :
                    <>
                        <MenuItem
                            className='menu_list'
                            sx={{ borderBottom: `1px solid ${new_theme.palette.newSecondary.NSIconBorder}` }}
                            disabled={!!i?.disabled} key={i.id}
                            onClick={(event) => {
                                event.stopPropagation()
                                setAnchorEl(null)
                                i.action({ currentItemId: currentItemId ? currentItemId : null, type: i?.type ? i.type : undefined })
                            }}>

                            {i.icon && <div style={{ paddingRight: '8px' }}>{i.icon}</div>}
                            <span>{t(i.name)}</span>
                            {(i?.primary) && (!!i?.disabled) && (<small style={{ paddingLeft: '5px' }}>{i.primary}</small>)}
                        </MenuItem>
                    </>}
                </>
            )
    })

    return (
        <ThemeProvider theme={new_theme}>
            {props.iconButton || props.iconbutton ? 
            <StyledEIconButton {...props} size="large" color="primary" disabled={disabled}
            onClick={(event)=>{
                event.stopPropagation();
                setAnchorEl(event.currentTarget)}
            }>
                <MoreVert /> 
            </StyledEIconButton>:
            <EButton
                
                id="demo-customized-button"
                aria-controls="basic-menu"
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                
                disabled={disabled}
                onClick={({currentTarget})=>{setAnchorEl(currentTarget)}}
                endIcon={<KeyboardArrowDownIcon />}
            >
                {`${btnName ? t(btnName) : t("Options")}`}
            </EButton>}
            {menuItems.length > 0 && <EMenu
                
                PaperProps={{  
                    style: {  
                      width: 230, 
                      backgroundColor: new_theme.palette.primary.PWhite
                    },  
                 }} 
                id="basic-menu"
                anchorEl={anchorEl}
                // anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                open={open}
                onClose={(event)=>{event.stopPropagation(); setAnchorEl(null)}}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                {menuItems}
            </EMenu>}
        </ThemeProvider>
    );
}