import { ThemeProvider, Typography, Grid, IconButton, Box, Avatar, TextField, TableContainer, Paper, Table, TableCell, TableHead, TableRow, TableBody } from '@mui/material';
import { new_theme } from 'NewMuiTheme';
import { useMainContext } from 'components/_ContextProviders/MainDataContextProvider/MainDataProvider';
import React,{useEffect, useState} from 'react';
import { Col } from 'react-bootstrap';
import { useTranslation } from "react-i18next";
import { AiFillDelete, AiOutlineCheck } from 'react-icons/ai';
import { BsFillEyeFill } from 'react-icons/bs';
import moduleCoreService from "services/module-core.service"


const StaticRoles = () => {
    const { t } = useTranslation();
    function createData(name, calories, fat, carbs, protein) {
        return { name, calories, fat, carbs, protein };
    }
    const [rolePermissions, setRolePermissions] = useState([])
    const [isActive,setIsActive]=useState()
    const [cardData,setCardData]=useState()

   
    
    const [currentModuleCore, setCurrentModuleCore] = useState({});
    const { F_showToastMessage, F_getHelper } = useMainContext();
    const { manageScopeIds } = F_getHelper();
    const rows = [
        createData('Frozen yoghurt', 159, 1, 24, 4.0),
        createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
        createData('Eclair', 262, 16.0, 24, 6.0),
        createData('Cupcake', 305, 3.7, 67, 4.3),
        createData('Gingerbread', 356, 16.0, 49, 3.9),
      ];
      useEffect(() => {
        moduleCoreService.readModuleCore(manageScopeIds.moduleId).then(res => {
            if (res.data?.rolePermissions) {
                setRolePermissions(res.data.rolePermissions);
                setIsActive(res.data.rolePermissions[0]._id)
                const filt=res.data?.rolePermissions.find((u)=>u._id===res.data.rolePermissions[0]._id)
                 setCardData(filt)
                
            }
            setCurrentModuleCore(res.data)
        }).catch(error => console.error(error))
    }, [])
const activeHandler=(id)=>{
setIsActive(id)
const filt=rolePermissions.find((u)=>u._id===id)
setCardData(filt)

}


    return (
        <ThemeProvider theme={new_theme}>
            <Grid sx={{mt:3}}>
                <Typography variant='body2' component='span'>{t('Roles inside the system')}</Typography>
            </Grid>
            <Grid>
                <Typography variant='subtitle1' component='span'>{t('Learn more about the roles inside the system and permission users can have')}</Typography>
            </Grid>
            <Grid className='Grid_container' sx={{ flexGrow: 1, justifyContent:'space-between', gap:'20px' }} container spacing={2}>
                <Grid className='role-cards-container' item md={4} xs={12} >
                   {rolePermissions.map((u)=>{
                    return(
                    <div onClick={()=>activeHandler(u._id)} className={`role-card ${isActive===u._id && 'active'}`} key={u._id}>
                        <div>
                            <img className='role-card-img' alt='profile' src='/img/explore/avatar.png'></img>
                            <Typography variant='body2' component='span'>{u.name}</Typography>
                        </div>
                        <IconButton>
                            <BsFillEyeFill/>
                        </IconButton>

                    </div> 
                    )

                   })
                   
                   }
                   
                </Grid>
                <Grid className='role-permission-container' item xs={12} md={8}>
                    <div className='perm-card'>
                        <img className='role-permission-img' alt='profile' src='/img/explore/avatar.png'></img>
                        <div className='perm-card-text'>
                            <Typography variant='body2' component='span'>{t('Trainee')}</Typography>
                            <Typography variant='subtitle1' component='span'>{t('Trainee')}</Typography>
                        </div>
                    </div>
                    <Grid>
                    <TableContainer className='perm-table' component='div' sx={{mt:3}}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                            <TableRow>
                                <TableCell> </TableCell>
                                <TableCell align="center">Access </TableCell>
                                <TableCell align="center">Edit</TableCell>
                            </TableRow> 
                            </TableHead>
                            <TableBody> 
                            {cardData?.permissions?.map((permission)=>{
                              return  ( <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }} >
                                 <TableCell component="td" scope="row">
                                    {permission.name}
                                 </TableCell>
                                 <TableCell align="center">{permission.access ?<AiOutlineCheck/>:'X' }</TableCell>
                                 <TableCell align="center"> {permission.edit ? <AiOutlineCheck/> : 'X'}</TableCell> 
                                 </TableRow>)
                            })
                               
                                
                          }
                            </TableBody>
                        </Table>
                    </TableContainer>
                    </Grid>
                </Grid>
            </Grid>
        </ThemeProvider>
    );
};

export default StaticRoles;