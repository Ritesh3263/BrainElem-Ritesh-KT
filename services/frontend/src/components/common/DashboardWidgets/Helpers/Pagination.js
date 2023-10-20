import React, {useEffect, useState} from 'react';
import {Paper} from "@material-ui/core";
import Grid from "@mui/material/Grid";
import {EButton} from "styled_components";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import PlayArrowOutlinedIcon from "@mui/icons-material/PlayArrowOutlined";
import {useTranslation} from "react-i18next";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import MenuList from "@material-ui/core/MenuList";
import {useNavigate} from "react-router-dom";


const Pagination=(props)=> {
    const{
        disableViewAll = false,
        viewAllRoute = '',
        setShowData=(s)=>{},
        originalData =[]
    }=props;
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [viewItems, setViewItems] = useState(3);
    const [anchorEl, setAnchorEl] = useState(null);
    const menuOpen = Boolean(anchorEl);

    const menuItems = [2,3,5,10].map(i=>(
        <MenuItem key={i}
                  onClick={()=>{
                      setViewItems(i);
                      setAnchorEl(null);
                  }}
        >
            <Typography variant="body2" component='div'
                        style={{color: `rgba(82, 57, 112, 1)`, fontSize:12, padding:0}}
            >
                {i}
            </Typography>
        </MenuItem>
    ));

    useEffect(()=>{
        if(originalData.length>0){
            setShowData(originalData.slice(0,viewItems));
        }
    },[originalData, viewItems]);

    const viewItemsMenu = (
        <Menu
            anchorEl={anchorEl}
            open={menuOpen}
            onClose={()=>setAnchorEl(null)}
            MenuListProps={{
                'aria-labelledby': 'basic-button',
            }}
        >
            <MenuList dense disablePadding>
                {menuItems}
            </MenuList>
        </Menu>);

     return (
         <Paper elevation={12} sx={{position: 'relative'}}
                //hidden={originalData.length<=0}
         >
             <Grid container sx={{mt:2, mb:1}}>
                 <Grid item xs={4} sx={{ px: {xs: 1, md:0 , lg: 1}}}>
                     {viewAllRoute && <EButton sx={{maxHeight:"27px", minWidth:"75px", maxWidth:"75px",}} eSize='small' eVariant='primary'
                              disabled={disableViewAll}
                              onClick={()=>{
                                  //navigate("/schedule")
                                  navigate(`${viewAllRoute}`);
                              }}
                     >{t('View all')}</EButton>}
                 </Grid>
                 <Grid item xs={8} sx={{ px: {xs: 1, md:0 , lg: 1}, display:'flex', justifyContent: 'flex-end', alignItems: 'end'}}>
                     <Paper style={{borderRadius:'50px', paddingLeft:10, paddingRight:0, paddingTop:0, paddingBottom:0, width: '115px', height: '27px'}}>
                         <Grid container>
                             <Grid item xs={9} sx={{display:'flex', alignItems: 'center'}}>
                                 <Typography variant="body2" component='div'
                                             style={{color: `rgba(82, 57, 112, 1)`, fontSize:13, paddingRight:2, fontFamily:"'Nunito'"}}
                                 >
                                     {t("View No")}.: {viewItems}
                                 </Typography>
                             </Grid>
                             <Grid item xs={3} sx={{display:'flex', justifyContent:' flex-end'}}>
                                 <IconButton size="small" color="primary"
                                             onClick={({currentTarget})=>setAnchorEl(currentTarget)}
                                             style={{ backgroundColor:`#B372FF`, height:'27px', width:'27px'}}
                                 >
                                     <PlayArrowOutlinedIcon style={{fill:'white', rotate:'90deg', padding:'4px'}}/>
                                 </IconButton>
                                 {viewItemsMenu}
                             </Grid>
                         </Grid>
                     </Paper>
                 </Grid>

             </Grid>
         </Paper>
     )
 }

export default Pagination;