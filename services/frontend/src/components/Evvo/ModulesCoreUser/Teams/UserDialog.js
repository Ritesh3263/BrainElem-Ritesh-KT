import React, { useState } from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import useComponentVisible from 'hooks/useComponentVisible';
import { useEffect } from 'react';
import { new_theme } from "NewMuiTheme";
import StyledButton from "new_styled_components/Button/Button.styled";
import { Box, Drawer, SwipeableDrawer, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from "react-i18next";




const UserDialog = ({row,openUsers,setOpenUsers}) => {
    const { t } = useTranslation();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [assignChildrenDrawer, setAssignChildrenDrawer] = useState(false);
    
    const { ref, isComponentVisible,setIsComponentVisible } = useComponentVisible(openUsers==row.userId);
    
    return (
        <>
            <span className='user-color' onClick={()=>{
                setIsComponentVisible(true)
                
                    setOpenUsers(row.userId)
                
                }}>   
                {row.count}  
            </span>


            {/* {(openUsers==row.userId && isComponentVisible) &&  */}
            {/* // <div ref={ref} style={{position:'absolute',backgroundColor:'white',left:'40%', top:'0',}}>
            //     <List>
            //         { row.trainee.map((trainee)=>{
            //             return <ListItem>
                            
            //                 <ListItemText primary={trainee.username} />
            //             </ListItem>
            //         })}
            //     </List>
            //  </div> */}

            <Drawer
                anchor="right"
                open={openUsers==row.userId && isComponentVisible}
                onClose={() => setIsComponentVisible(false)}>
                <Box role="presentation" sx={{ padding: '14px 16px', width: '350px', height: '100vh', overflow: 'auto', display: 'flex', alignItems: 'inherit', justifyContent: 'space-between', flexDirection: 'column' }}>
                    <div>
                        <div className="top_header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Typography variant="h3" component="h3" sx={{ textAlign: 'left', color: new_theme.palette.primary.MedPurple }}>{row.name}</Typography>
                            {/* <CloseIcon onClick={() => setIsComponentVisible(false)} sx={{cursor: 'pointer'}} /> */}
                        </div>
                        <hr />
                        <List
                            component="nav"
                            aria-labelledby="nested-list-subheader"
                        >
                            { row.trainee.map((trainee)=>{
                                return <ListItem sx={{paddingLeft: '8px'}}>
                                    <ListItemText primary={trainee.name +  " " + trainee.surname} sx={{fontSize:'18px', }} />
                                </ListItem>
                            })}
                            {row.trainee.length == 0 && 
                                <>
                                    <Typography variant='list1' component='span'>No employee assigned yet</Typography>
                                </>
                            }
                        </List>
                    </div>

                    <div className="bottom_button text-center">
                         <StyledButton eVariant="secondary"  eSize="small" onClick={() => setIsComponentVisible(false)} >{t("Close")}</StyledButton> 
                    </div>
                </Box>
            </Drawer>
            
        </>
       
    );
};

export default UserDialog;