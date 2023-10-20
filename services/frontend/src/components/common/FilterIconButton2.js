import React,{useState} from 'react';
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import {useTranslation} from "react-i18next";
import {EButton, EIconButton} from "styled_components";
import IconButton from "@material-ui/core/IconButton";
import SvgIcon from "@material-ui/core/SvgIcon";
import Grid from "@mui/material/Grid";
import { ReactComponent as MoreIcon } from 'icons/icons_32/oldicon.svg';
import { ReactComponent as RemoveIcon } from 'icons/icons_32/Remove _32.svg';
import Typography from "@material-ui/core/Typography";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Switch from "styled_components/Switch";
import {theme} from "MuiTheme";
import { Box } from '@mui/material';


export default function FilterIconButton2(props) {
    const {
        btns=[],
        selectFilterHandler=({})=>{},
        fullWidth,
        btnName,
        disabled = false,
        eSize='medium',
    } = props;
    const { t} = useTranslation();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);


    const btnsHelper=(btns)=>{
        return btns.map(btn=>(
            <div key={btn?.id}>
                <Grid item xs={12} >
                    <Typography variant="body2"
                                component="h6" className="text-left"
                                style={{color: `rgba(82, 57, 112, 1)`}}>
                        {btn?.name||'-'}
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <List dense={true}>
                        {btn?.items?.length>0 ? btn.items.map(i=>(
                            <ListItem
                                key={i?.id}
                                secondaryAction={
                                    <Switch
                                        size="small"
                                        edge="end"
                                        checked={!!i?.isSelected}
                                        sx={{
                                            '& .MuiSwitch-switchBase.Mui-checked': {
                                                color: 'rgba(168, 92, 255, 1)',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(168, 92, 255, 0.1)',
                                                },
                                            },
                                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                                backgroundColor: 'rgba(168, 92, 255, 1)',
                                            },
                                        }}
                                        inputProps={{ 'aria-labelledby': i?.id }}
                                        onChange={(e,state)=>{
                                            btn.action({type:'CHECK',payload:{groupId:btn.id,itemId:i.id,state}});
                                        }}
                                    />
                                }
                            >
                                <ListItemText id={i?.id}
                                              primary={(btn?.type !== 'FILTER') ? `${i?.name}` : i?.name}
                                />
                            </ListItem>
                        )):[]}
                    </List>
                </Grid>
            </div>
        ))
    }

    return (
        <Box sx={{ px: 2 }}>
            {props.iconButton ?
                <EIconButton
                    style={{backgroundColor: 'rgba(168, 92, 255, 1)',  }}
                    onClick={(e)=>{
                        e.stopPropagation();
                        setAnchorEl(e.currentTarget)
                    }} size="large" variant="contained"
                    color="secondary" >
                    <SvgIcon color={'white'} viewBox="0 0 32 32" component={!!open ? RemoveIcon : MoreIcon} style={{fontSize: '2.5rem'}} />
                </EIconButton>:
                <EButton
                    fullWidth={!!fullWidth}
                    eSize={eSize}
                    id="demo-customized-button"
                    aria-controls="basic-menu"
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    eVariant='secondary'
                    disabled={disabled}
                    onClick={({currentTarget})=>{setAnchorEl(currentTarget)}}
                    endIcon={<KeyboardArrowDownIcon />}
                >
                    {`${btnName ? t(btnName) : t("Options")}`}
                </EButton>}
            <Menu
                style={{top:'150px', left:'-45px'}}
                className="mt-5 justify-content-center"
                id="basic-menu"
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={(event)=>{event.stopPropagation(); setAnchorEl(null)}}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                <Grid  style={{minWidth:'300px'}} className='p-2 pl-3'>
                    <Grid item xs={12} hidden={true}>
                        <Typography variant="body1"
                                    component="h6" className="text-left"
                                    style={{color: `rgba(82, 57, 112, 1)`, fontWeight:'bold', fontSize:20}}>
                            {t("Filter")}
                        </Typography>
                    </Grid>
                    {btnsHelper(btns)}
                    <Grid item xs={12}>
                        <Grid container>
                            <Grid item xs={6} sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}} style={{zIndex: 9999}}>
                                <EButton eSize="small" eVariant="secondary"
                                         onClick={()=>{
                                             selectFilterHandler({type:'CLEAR',payload:true});
                                             setAnchorEl(null);
                                         }}
                                >{t("Clear")}</EButton>
                            </Grid>
                            <Grid item xs={6} sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}} >
                                <EButton eSize="small" eVariant="primary"
                                         onClick={()=>{
                                             selectFilterHandler({type:'SAVE',payload:true});
                                             setAnchorEl(null);
                                         }}
                                >{t("Apply")}</EButton>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Menu>
        </Box>
    );
}