import React, {useEffect} from 'react';
import Paper from "@material-ui/core/Paper";
import {useSelector, useDispatch} from "react-redux";
import {myCourseActions} from "app/features/MyCourses/data";
import {Card, CardHeader, CardContent, CardActionArea, CardActions, Divider} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import {theme} from "MuiTheme";
import {useTranslation} from "react-i18next";
import {Stack} from "@mui/material";
import {EAccordion, EButton} from "styled_components";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Chip from "@material-ui/core/Chip";
import {isWidthUp} from "@material-ui/core/withWidth";
import Avatar from "@material-ui/core/Avatar";
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";

const Preview=(props)=> {
    const{
        previewHelper={isOpen:false, itemId: null},
        setPreviewHelper=({})=>{},
    }=props;

    const {t} = useTranslation();
    const {F_getHelper, currentScreenSize} = useMainContext();
    const {user, userPermissions} = F_getHelper();
    const {itemDetails} = useSelector(s=>s.myCourses);
    const dispatch = useDispatch();


    useEffect(()=>{
        if(previewHelper.isOpen){
            dispatch(myCourseActions.fetchItemDetails({itemId: previewHelper.itemId, type: 'STUDENT'}));
        }
    },[previewHelper]);

    const renderUserAvatar=(role)=>{
        switch (role){
            case "Root": return "Root";
            case "EcoManager": return "EcoMan";
            case "NetworkManager": return "NetworkMan";
            case "ModuleManager": return "ModuleMan";
            case "Assistant": return "ModuleMan";
            case "Architect": return "Architect";
            case "Librarian": return "Librarian";
            case "Trainee": return "Student";
            case "Parent": return "Parent";
            case "Trainer": return userPermissions.isClassManager? "ClassMan" : "Teacher";
            default:  return "Student";
        }
    }

    const solutionsList = itemDetails?.solutions?.length>0 ? itemDetails?.solutions.map(item=>(
        <EAccordion
            key={item.id}
            className='mt-3'
            //headerName={item?.name || '-'}
            headerName={(
                <div className='d-flex'>
                    <Typography variant="body2" component="h5" className="text-left" style={{fontSize:"20px", color:theme.palette.primary.lightViolet}}>
                        {item?.name ||'-'}
                    </Typography>
                <Chip
                      label={item?.contentType||'-'}
                      className="ml-5 mt-1"
                      size="small" variant="outlined"
                      style={{color: `rgba(82, 57, 112, 1)`, backgroundColor:'rgba(255,255,255,0.45)',borderRadius:'6px', borderColor:'rgba(82, 57, 112, 1)'}}
                />
                </div>
            )}
        >
            <Grid container>
                <Grid item xs={12}>
                    <TextField
                        variant="standard"
                        label="Details"
                        name='details'
                        fullWidth={true}
                        style={{ maxWidth: "400px" }}
                        margin="dense"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        InputProps={{
                            readOnly: true,
                            disableUnderline: true,
                        }}
                        value={item?.details||'-'}
                    />
                </Grid>
            </Grid>
        </EAccordion>
    )): [];

     return (
         <Card className="p-0 d-flex flex-column m-0">
             <CardHeader title={(
                 <Typography variant="h6" component="h5" className="text-left" style={{fontSize:"26px", color:theme.palette.primary.lightViolet}}>
                     {t('Profile preview')}
                 </Typography>
             )}
             />
             <CardContent className='pt-0'>
                 <Grid container>
                     <Grid item xs={8}>
                        <Grid container>
                            <Grid item xs={12}>
                                <TextField
                                    variant="standard"
                                    label="Name"
                                    name='name'
                                    fullWidth={true}
                                    style={{ maxWidth: "400px" }}
                                    margin="dense"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    InputProps={{
                                        readOnly: true,
                                        disableUnderline: true,
                                    }}
                                    value={`${itemDetails?.name||'-'} ${itemDetails?.surname||'-'}`}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    variant="standard"
                                    label="Date of birth"
                                    name='dateOfBirth'
                                    fullWidth={true}
                                    style={{ maxWidth: "400px" }}
                                    margin="dense"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    InputProps={{
                                        readOnly: true,
                                        disableUnderline: true,
                                    }}
                                    value={`${itemDetails?.details?.dateOfBirth ? new Date(itemDetails?.details?.dateOfBirth).toLocaleDateString() :"-"}`}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    variant="standard"
                                    label="Level"
                                    name='level'
                                    fullWidth={true}
                                    style={{ maxWidth: "400px" }}
                                    margin="dense"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    InputProps={{
                                        readOnly: true,
                                        disableUnderline: true,
                                    }}
                                    value={itemDetails?.level}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    variant="standard"
                                    label="Email"
                                    name='email'
                                    fullWidth={true}
                                    style={{ maxWidth: "400px" }}
                                    margin="dense"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    InputProps={{
                                        readOnly: true,
                                        disableUnderline: true,
                                    }}
                                    value={itemDetails?.email}
                                />
                            </Grid>
                            {itemDetails.assignedParent && (
                                <>
                                    <Grid item xs={12}>
                                        <small style={{color: `rgba(82, 57, 112, 1)`}} className="mt-3">{t("Assigned parent")}</small>
                                        <Divider variant="insert" />
                                        <TextField
                                            variant="standard"
                                            label="Name"
                                            name='name'
                                            fullWidth={true}
                                            style={{ maxWidth: "400px" }}
                                            margin="dense"
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            InputProps={{
                                                readOnly: true,
                                                disableUnderline: true,
                                            }}
                                            value={`${itemDetails?.assignedParent?.name||'-'} ${itemDetails?.assignedParent?.surname||'-'}`}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            variant="standard"
                                            label="Phone"
                                            name='phone'
                                            fullWidth={true}
                                            style={{ maxWidth: "400px" }}
                                            margin="dense"
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            InputProps={{
                                                readOnly: true,
                                                disableUnderline: true,
                                            }}
                                            value={itemDetails?.assignedParent?.details?.phone||'-'}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            variant="standard"
                                            label="Emial"
                                            name='email'
                                            fullWidth={true}
                                            style={{ maxWidth: "400px" }}
                                            margin="dense"
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            InputProps={{
                                                readOnly: true,
                                                disableUnderline: true,
                                            }}
                                            value={itemDetails?.assignedParent?.email||'-'}
                                        />
                                    </Grid>
                                </>
                            )}
                        </Grid>
                     </Grid>
                     <Grid item xs={4} className='d-flex justify-content-center align-items-start'>
                         <Avatar style={{width: isWidthUp('md',currentScreenSize) ? "100px" : "50px", height: isWidthUp('md',currentScreenSize) ? "100px" : "50px"}} src={`/img/user_icons_by_roles/${renderUserAvatar(user?.settings?.role)}.png`} alt="user-icon-avatar"/>
                     </Grid>
                     {itemDetails?.solutions && (
                         <Grid item xs={12}>
                             <small style={{color: `rgba(82, 57, 112, 1)`}} className="mt-3">{t("Solutions")}</small>
                             <Divider variant="insert" />
                             {solutionsList}
                         </Grid>
                     )}
                 </Grid>
             </CardContent>
             <CardActionArea>
                 <CardActions className="d-flex justify-content-between align-items-center">
                     <Stack direction='row' alignItems="center" justifyContent="space-between" spacing={0} className="d-flex flex-fill">
                         <EButton eSize='small' eVariant='secondary'
                                  onClick={()=>{setPreviewHelper({isOpen:false, itemId: null})}}
                         >{t('Back')}</EButton>
                     </Stack>
                 </CardActions>
             </CardActionArea>
         </Card>
     )
 }

export default Preview;