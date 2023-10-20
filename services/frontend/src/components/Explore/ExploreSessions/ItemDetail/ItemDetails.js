import React, {lazy, useEffect, useState} from 'react';
import {Card, CardHeader, CircularProgress, Paper} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import CardContent from "@material-ui/core/CardContent";
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import {useTranslation} from "react-i18next";
import Preview from "./Preview";
import moment from "moment";
import CertificationSessionService from "services/certification_session.service";
import ItemImage from "../ItemsList/ItemImage";
import {Button, DialogActions, DialogContent, DialogTitle} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import {useShoppingCartContext} from "components/_ContextProviders/ShoppingCartProvider/ShoppingCartProvider";
import CreateAccountModal from "components/Login/CreateAccountModal/CreateAccountModal";

import {EHorizontalProperty, EButton, ETakeCourseButton } from "styled_components";
import { theme } from "MuiTheme";

const EnquiryModal = lazy(() => import("../EnquiryModal/EnquiryModal"));

const useStyles = makeStyles((theme) => ({}));

export default function ItemDetails({setItemsHelper, itemsHelper, takeCourse, allUserSessions}){
    const classes = useStyles();
    const {t} = useTranslation();
    const {
        F_showToastMessage,
        F_getErrorMessage,
        F_getHelper
    } = useMainContext();
    const {user} = F_getHelper();
    const {userPermissions} = F_getHelper();
    const [currentItemDetails, setCurrentItemDetails] = useState({});
    const [isOpenEnquiryDialog, setIsOpenEnquiryDialog]=useState(false);

    const [createAccountModal,setCreateAccountModal] = useState({isOpen: false});

    const {
        getCurrency
    } = useShoppingCartContext();

    useEffect(()=>{
        if(user?.id){
            if(itemsHelper.contentId){
                CertificationSessionService.getCertificationSessionOverview(itemsHelper.contentId).then(res=>{
                    if(res?.status===200 && res?.data){
                        CertificationSessionService.readAllUserSessions().then(res2=>{
                            if(res2.status === 200){
                                setCurrentItemDetails({...res.data, isMySession: !!res2.data.find(session=>(session._id === res.data._id||session.origin === res.data._id))});

                            } else setCurrentItemDetails(res.data);
                        }).catch(err=>console.log(err));
           
                    }
                }).catch(err=>{
                    F_showToastMessage(F_getErrorMessage(err), "error");
                });
            }
        }else{
            if(itemsHelper.contentId){
                CertificationSessionService.newReadPublic(itemsHelper.contentId).then(res=>{
                    if(res?.status===200 && res?.data){
                        setCurrentItemDetails(res.data);
                    }
                }).catch(err=>{
                    F_showToastMessage(F_getErrorMessage(err), "error");
                });
            }
        }

    },[itemsHelper.contentId]);


    return(
        <Paper elevation={10} className="p-2" style={{borderRadius:'8px'}}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper elevation={10}>
                        <Card sx={{maxHeight: '250px'}}>
                                    <CardHeader
                                        avatar={
                                            <Avatar style={{backgroundColor: `rgba(82, 57, 112, 1)`}} aria-label="recipe">
                                                {currentItemDetails?.contentType}
                                            </Avatar>
                                        }
                                        action={
                                            currentItemDetails.paymentEnabled && 
                                            <IconButton aria-label="settings" size="medium"
                                                        className="mt-2"
                                                        style={{backgroundColor:'rgba(255,255,255,0.8)'}}>
                                                <LocalOfferIcon style={{color: `rgba(82, 57, 112, 1)`}}/>
                                            </IconButton>
                                        }
                                        title={`${t("Training manager")}: ${currentItemDetails?.trainingManager?.name??'-'} ${currentItemDetails?.trainingManager?.surname??'-'}`}
                                        subheader={`${t("Created at: ")} ${new Date(currentItemDetails?.createdAt).toLocaleDateString()}`}
                                    />
                                    <ItemImage image={currentItemDetails?.coursePath?.image}
                                               fromSingeItem={true}/>
                                    <CardContent>
                                        <Grid container>
                                            <Grid item xs={8}>
                                                <Typography variant="body1" component="span" className="text-left" style={{color: `rgba(82, 57, 112, 1)`}}>
                                                    {t("Course preview")}
                                                </Typography>
                                                <Typography variant="h5" component="h5" className="text-left" style={{color: `rgba(82, 57, 112, 1)`}}>
                                                    <strong>{currentItemDetails?.name}</strong>
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={4} className="d-flex flex-column align-items-center" style={{ whiteSpace: 'nowrap'}}>
                                                <ETakeCourseButton
                                                    course={currentItemDetails} 
                                                    takeCourse={takeCourse}
                                                    allUserSessions={allUserSessions}
                                                    isLoggedIn={user?.id}
                                                    eVariant='primary'
                                                    style={{width: '100%', maxWidth: '400px', whiteSpace: 'nowrap'}}
                                                />

                                                <Button className="mt-3" variant="outlined" size="small" color="default"
                                                        hidden={!userPermissions.isPartner}
                                                        fullWidth={true}
                                                        style={{maxWidth: '400px'}}
                                                        onClick={()=>{setIsOpenEnquiryDialog(true)}}
                                                >
                                                    {t("Business enquiry")}
                                                </Button>
                                            </Grid>
                                        </Grid>
                                        <Grid container className="mt-4">
                                                    <Grid item xs={6} lg={3}>
                                                        <EHorizontalProperty 
                                                            icon='time' color={theme.palette.neutrals.darkestGrey}
                                                            propery={t("Time")}
                                                            value={`${moment.duration(moment(currentItemDetails.endDate).diff(moment(currentItemDetails.startDate))).asDays().toFixed(0) || "-"} d`}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={6} lg={3}>
                                                        <EHorizontalProperty 
                                                            icon='user' color={theme.palette.neutrals.darkestGrey} 
                                                            // property={t("Students")}
                                                            value={`${currentItemDetails?.traineesCount || '-'}/${currentItemDetails?.traineesLimit || '-'}`}/>
                                                    </Grid>
                                                    {currentItemDetails.paymentEnabled && <Grid item xs={6} lg={3}>
                                                        <EHorizontalProperty icon='price' 
                                                            color={theme.palette.neutrals.darkestGrey} 
                                                            property={t("Price")}
                                                            value={`${currentItemDetails?.price} ${getCurrency()}`}/>
                                                    </Grid>}
                                                    <Grid item xs={6} lg={3}>
                                                        <EHorizontalProperty icon='location' 
                                                            color={theme.palette.neutrals.darkestGrey} 
                                                            value={t("Remote")}/>
                                                    </Grid>
                                        </Grid>
                                    </CardContent>
                        </Card>
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <Preview currentItemDetails={currentItemDetails} />
                    <Button variant="contained" size="small" color="secondary"
                            fullWidth={false}
                            style={{maxWidth: '400px'}}
                            onClick={()=>{setItemsHelper({isOpen: false, contentId: undefined})}}
                    >
                        {t("Dismiss")}
                    </Button>
                </Grid>
            </Grid>
             <EnquiryModal isOpenEnquiryDialog={isOpenEnquiryDialog} setIsOpenEnquiryDialog={setIsOpenEnquiryDialog} currentItemDetails={currentItemDetails}/>
            <CreateAccountModal createAccountModal={createAccountModal} setCreateAccountModal={setCreateAccountModal}/>
        </Paper>
    )
}