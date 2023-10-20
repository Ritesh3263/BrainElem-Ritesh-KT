import React, {useEffect, useState} from "react";
import {Accordion, Card, Col, ListGroup, Row} from "react-bootstrap";
import Avatar from "@mui/material/Avatar";
import {Link, useNavigate} from "react-router-dom"
import Icon from '@mui/material/Icon';
import Chip from '@mui/material/Chip';
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ContentService from "services/content.service";
import UserService from "services/user.service"
import Button from '@mui/material/Button';
import CommonService from "services/common.service";
import Grid from "@mui/material/Grid";
import {Container, Divider, Paper} from "@mui/material";
import MyProfileDashboard from "components/Dashboard/DashboardWidgets/MyProfileDashboard";
import { useTranslation } from "react-i18next";
import TextField from "@mui/material/TextField";
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import Typography from "@mui/material/Typography";
import InputAdornment from "@mui/material/InputAdornment";
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import FacebookIcon from '@mui/icons-material/Facebook';
import {EUserRoleChip} from "styled_components";
import { isWidthUp } from "@mui/material/Hidden/withWidth";
import {ThemeProvider} from "@mui/material";
import { new_theme } from "NewMuiTheme";
import StyledButton from "new_styled_components/Button/Button.styled";
import "./SettingsProfile/profile.scss"


export default function ProfileOverview(){
    const navigate = useNavigate();
    // setCurrentRoute
    const {setMyCurrentRoute, F_getHelper, F_showToastMessage, currentScreenSize} = useMainContext();
    const {user, userPermissions} = F_getHelper();
    const [currentUSer, setCurrentUser] = useState({
        details:{
            phone:"",
            aboutMe:"",
        }
    });
    const [cognitiveTestId, setCognitiveTestId] =useState(null);
    const [userInterest, setUserInterest] = useState(null);
    const { t } = useTranslation();
    const [isOpenCognitiveDrawer, setIsOpenCognitiveDrawer] = useState({isOpen: false, cognitiveTestId: undefined});

    useEffect(()=>{
            UserService.read(user.id).then(res=>{
                setCurrentUser(res.data);

                CommonService.getAllInterests().then(res2=>{
                    let newData = [];
                    if(res.data.details && res.data.details.subinterests.length>0){
                        res.data.details.subinterests.map(useSubinterest=>{
                            res2.data.map(int=>{
                                int.subinterests.map(subInt=>{
                                    if(useSubinterest === subInt._id){
                                        newData.push({_id: subInt._id, name: subInt.name})
                                    }
                                })
                            })
                        })
                    }
                    setUserInterest(newData);
                })
            }).catch(error=>console.log(error))
            // setCurrentUser(AuthService.getCurrentUser());
        setMyCurrentRoute("Profile overview")
    },[])

    const changeRoute = (value) => {
        navigate(value);
        // handleMenuClose();
    }

    const userInterestsList = userInterest ? userInterest.map((item,index)=>
        <Chip
            className="m-1 new-chip"
            key={item._id}
            label={item.name}
        />
    ) : [];

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

    return(
        <ThemeProvider theme={new_theme}>
            <Container maxWidth="xl" className="mainContainerDiv Auth_Module">
                <div className="admin_content">
                    <Grid item xs={12}>
                        <div className="admin_heading">
                            <Grid>
                                <Typography variant="h1" className="typo_h5">{t("Profile Overview")}</Typography>
                                <Divider variant="insert" className='heading_divider' />
                            </Grid>
                        </div>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid className="overview-parent" item md={12} lg={8}>
                            <Grid container maxWidth="xl" className="overview-block" >
                                <Grid xs={12}>
                                    <Typography variant="h3" component="h3" sx={{mb:2}} textAlign="start" color={new_theme.palette.newSupplementary.NSupText}>{t("Overview")}</Typography>
                                </Grid>
                                <Grid item xs={12} md={6} className="ov-p" >
                                    <Grid container className="ov" >
                                        <Grid item xs={12} sm={3}>
                                            <Avatar className="overview-avtar" src={`/img/user_icons_by_roles/${renderUserAvatar(currentUSer?.settings?.role)}.png`} alt="user-icon-avatar"/>
                                        </Grid>
                                        <Grid item xs={12} sm={9} className="ov-txt">
                                            <Grid container>
                                                <Grid item xs={12}>
                                                    <Typography variant="body2">{t("Name of")}</Typography>
                                                    <Typography className="ov-role-name" variant='h3' component='h4' textAlign="left" style={{color: new_theme.palette.primary.MedPurple}}>
                                                        {`${currentUSer?.name??'-'} ${currentUSer?.surname??'-'}`}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={12} my={1}>
                                                    <Chip className="new-chip" label={currentUSer?.settings?.role} role={currentUSer?.settings?.role}/>
                                                    {currentUSer?.settings?.level && (
                                                        <Chip label={currentUSer.settings.level} className='ml-4' size="medium" style={{backgroundColor:new_theme.palette.primary.PWhite, fontWeight:600}}/>
                                                    )}
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>

                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Grid container className="det" >
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} display="flex" alignItems="center">
                                                <div className="ov-icon-box">
                                                    <img src="/img/icons/mailVector.svg"></img>
                                                </div>
                                                <TextField label={t("E-mail")}
                                                    margin="dense"
                                                    variant="standard"
                                                    value={currentUSer?.email??"-"}
                                                    InputLabelProps={{
                                                        shrink: true,

                                                    }}
                                                    InputProps={{
                                                        readOnly: true,
                                                        disableUnderline: true,
                                                        
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} display="flex" alignItems="center">
                                                <div className="ov-icon-box">
                                                    <img src="/img/icons/phoneVector.svg"></img>
                                                </div>

                                                <TextField label={t("Phone")}
                                                    margin="dense"
                                                    variant="standard"
                                                    value={currentUSer.details && currentUSer.details.phone ? currentUSer.details.phone : "-"}
                                                    InputLabelProps={{
                                                        shrink: true,

                                                    }}
                                                    InputProps={{
                                                        readOnly: true,
                                                        disableUnderline: true,
                                                        
                                                    }}
                                                />
                                                
                                            </Grid>
                                            <Grid item xs={12} display="flex" alignItems="center">
                                                <div className="ov-icon-box">
                                                    <img src="/img/icons/FacebookVector.svg"></img>
                                                </div>
                                                <TextField label={t("Facebook")}
                                                        margin="dense"
                                                        variant="standard"
                                                        value={currentUSer.details.socialMedia?.facebook}
                                                        InputLabelProps={{
                                                            shrink: true,

                                                        }}
                                                        InputProps={{
                                                            readOnly: true,
                                                            disableUnderline: true,
                                                            
                                                        }}
                                                />


                                            </Grid>
                                        </Grid>
                                    </Grid>

                                </Grid>
                            </Grid>
                            <Grid container maxWidth="xl" className="about-block" >
                                <Grid item xs={12}>
                                    <Typography variant="h3" component="h3" textAlign="start" sx={{mb:1}} style={{color: new_theme.palette.newSupplementary.NSupText}}>
                                        {t("About")}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="body2" component="h3">
                                    {currentUSer.details && currentUSer.details.aboutMe ? currentUSer.details.aboutMe : "-"}
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Grid container maxWidth="xl" className="about-block" >
                                <Grid item xs={12}>
                                    <Typography variant="h3" component="h3" textAlign="start" sx={{mb:1}} style={{color: new_theme.palette.newSupplementary.NSupText}}>
                                        {t("Intrest")}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    {userInterestsList.length>0 ? userInterestsList : "-"}
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid className="right-parent" item xs={12} md={12} lg={4}>
                            <Grid container className="braincore-block" >
                                <img src="./img/icons/braincore-green-icon.svg"></img>
                                <Typography variant="h2" component="h2" color={new_theme.palette.primary.MedPurple}>{t("Braincore Test")}</Typography>
                                <Typography  variant="h3" component="h3" color={new_theme.palette.newSupplementary.NSupText}>{t("Improve Your Brain")}</Typography>
                                <StyledButton eVariant="primary" eSize="large" >{t("Take the Test")}</StyledButton>
                            </Grid>
                            <Grid container className="recomend-block" >
                                <div className="recommend-img">
                                <img src="./img/icons/recommend-icon.svg"></img>
                                <StyledButton onClick={() => changeRoute("/profile-settings")} eVariant="primary" eSize="large" >{t("Refine Recommendations")}</StyledButton>
                                </div>
                            </Grid>
    
                        </Grid>
                    </Grid>
                </div>
            </Container>


            {/* <Paper elevation={10} style={{height:'100vh'}} className='p-2'>
                <Grid container spacing={2}>
                    <Grid item xs={12} lg={8}>
                        <Paper elevation={10} lg={7} className="p-2">
                            <Grid container className='mt-0'>
                                <Grid item xs={12}>
                                    <Typography variant="h5" component="h2" className="text-left">
                                        {t("Overview")}
                                    </Typography>
                                    <Divider />
                                </Grid>
                                <Grid item xs={12} className='mt-3'>
                                    <Grid container>
                                        <Grid item xs={7} className='d-flex align-items-center'>
                                            <Grid container>
                                                <Grid item xs={3} className="d-flex justify-content-center">
                                                    <Avatar style={{width: isWidthUp('md',currentScreenSize) ? "100px" : "50px", height: isWidthUp('md',currentScreenSize) ? "100px" : "50px"}} src={`/img/user_icons_by_roles/${renderUserAvatar(currentUSer?.settings?.role)}.png`} alt="user-icon-avatar"/>
                                                </Grid>
                                                <Grid item xs={9}>
                                                    <Grid container>
                                                        <Grid item xs={12}>
                                                            <Typography variant={isWidthUp('md',currentScreenSize) ? 'h3' : 'body1'} component='h4' className="text-left" >
                                                                {`${currentUSer?.name??'-'} ${currentUSer?.surname??'-'}`}
                                                            </Typography>
                                                        </Grid>
                                                        <Grid item xs={12}>
                                                            <EUserRoleChip label={currentUSer?.settings?.role} role={currentUSer?.settings?.role} style={{width:'150px'}}/>
                                                            {currentUSer?.settings?.level && (
                                                                <Chip label={currentUSer.settings.level} className='ml-4' size="small"/>
                                                            )}
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid item xs={5}>
                                            <TextField label={t("e-mail")}
                                                    margin="dense"
                                                    variant="standard"
                                                    value={currentUSer?.email??"-"}
                                                    InputLabelProps={{
                                                        shrink: true,

                                                    }}
                                                    InputProps={{
                                                        readOnly: true,
                                                        disableUnderline: true,
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <AlternateEmailIcon />
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                            />
                                            <TextField label={t("Phone")}
                                                    margin="dense"
                                                    variant="standard"
                                                    value={currentUSer.details && currentUSer.details.phone ? currentUSer.details.phone : "-"}
                                                    InputLabelProps={{
                                                        shrink: true,

                                                    }}
                                                    InputProps={{
                                                        readOnly: true,
                                                        disableUnderline: true,
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <LocalPhoneIcon />
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                            />
                                            <TextField label={t("Facebook")}
                                                    margin="dense"
                                                    variant="standard"
                                                    value={currentUSer.details.socialMedia?.facebook}
                                                    InputLabelProps={{
                                                        shrink: true,

                                                    }}
                                                    InputProps={{
                                                        readOnly: true,
                                                        disableUnderline: true,
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <FacebookIcon />
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} className='mt-4'>
                                    <Typography variant="h5" component="h2" className="text-left">
                                        {t("About")}
                                    </Typography>
                                    <Divider style={{width:'90%'}}/>
                                    <TextField label={t("")} style={{ width:"90%"}} margin="dense"
                                            variant="standard"
                                            multiline={true}
                                            InputLabelProps={{
                                                shrink: true,
                                                readOnly: true,
                                            }}
                                            InputProps={{
                                                readOnly: true,
                                                disableUnderline: true,
                                            }}
                                            value={currentUSer.details && currentUSer.details.aboutMe ? currentUSer.details.aboutMe : "-"}
                                    />
                                </Grid>
                                <Grid item xs={12} className='mt-4'>
                                    <Typography variant="h5" component="h2" className="text-left">
                                        {t("Interest")}
                                    </Typography>
                                    <Divider style={{width:'90%'}}/>
                                        <div className="align-items-center justify-content-start mt-2" style={{width:"90%"}}>
                                            {userInterestsList.length>0 ? userInterestsList : "-"}
                                        </div>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                </Grid>
            </Paper> */}

        </ThemeProvider>

    )
}