import React, {useEffect, useState} from "react";
import Grid from "@mui/material/Grid";
import {Paper} from "@material-ui/core";
import {useTranslation} from "react-i18next";
import Typography from "@material-ui/core/Typography";
import Chip from "@material-ui/core/Chip";
import moment, {now} from "moment";
import ItemImage from "./ItemImage";
import {useMainContext} from "../../../_ContextProviders/MainDataContextProvider/MainDataProvider";
import {EButton, EHorizontalProperty, ETakeCourseButton} from "styled_components";
import CertificationSessionService from "services/certification_session.service";
import { theme } from "MuiTheme";
import {useShoppingCartContext} from "components/_ContextProviders/ShoppingCartProvider/ShoppingCartProvider";

export default function ItemsList({items=[], itemsHelper, setItemsHelper, takeCourse, allUserSessions }){
    const {t} = useTranslation();
    const [userSessions, setUserSessions] = useState(undefined);

    const {
        F_getHelper
    } = useMainContext();


    const {
        getCurrency
    } = useShoppingCartContext();

    const {user} = F_getHelper();

    useEffect(()=>{
        CertificationSessionService.readAllUserSessions().then(res=>{
            if(res.status === 200){
                setUserSessions(res.data);
            }
        })
    },[]);


    const itemsList = items.map(i=>(
        <Grid item md={itemsHelper.isOpen ? 12 : 12} lg={itemsHelper.isOpen ? 12 : 6} xl={itemsHelper.isOpen ? 12 : 4} style={{overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
            <Paper elevation={10} className="p-2 d-flex flex-row" style={{background:(i._id === itemsHelper.contentId) ? theme.palette.shades.white50 : "", height:'220px',borderRadius: '8px'}}>
                <Grid container>
                    <Grid item xs={5}>
                        <ItemImage image={i?.coursePath?.image}/>
                    </Grid>
                    <Grid item xs={7} className="d-flex flex-grow-1">
                        <Grid container className="pl-2">
                            <Grid item xs={9}>
                                <Typography variant="h5" component="h5" className="text-left" style={{color: (i._id === itemsHelper.contentId)  ? `rgba(168, 92, 255, 1)`:`rgba(82, 57, 112, 1)`, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    <strong>{i?.name?.slice(0,50)}</strong>
                                </Typography>
                            </Grid>
                            <Grid item xs={3} className="d-flex flex-wrap justify-content-end align-items-start">
                                <Chip label={
                                        i.coursePath?.courses?.[0]?.chosenChapters?.[0]?.chosenContents?.[0]?.content?.contentType?.[0].toUpperCase() ||
                                        i.course?.chosenChapters?.[0]?.chosenContents?.[0]?.content?.contentType?.toUpperCase() ||
                                         "-"}
                                      className="mr-1"
                                      size="small" variant="outlined"
                                      style={{color: `rgba(82, 57, 112, 1)`, backgroundColor:'rgba(255,255,255,0.9)'}}
                                />
                            </Grid>
                            <Grid item xs={12} style={{overflow: 'hidden', textOverflow: "ellipsis"}}>
                                <span>{i.coursePath?.description||i.course?.description}</span>
                            </Grid>
                            <Grid container item xs={12}>
                                <Grid item xs={6} lg={4}>
                                    <EHorizontalProperty 
                                        icon='time' color={theme.palette.neutrals.darkestGrey} 
                                        property={t("Time")}
                                        value={`${moment.duration(moment(i.endDate).diff(moment(i.startDate))).asDays().toFixed(0) || "-"} d`}/>
                                </Grid>
                                {i.paymentEnabled && <Grid item xs={6} lg={4}>
                                    <EHorizontalProperty 
                                        icon='price' color={theme.palette.neutrals.darkestGrey} 
                                        property={`${t("Price")}`}
                                        value={`${i.price} ${getCurrency()}`}/>
                                </Grid>}
                                <Grid item lg={4}  sx={{ display: { lg: 'block', xs: 'none' } }}>
                                    <EHorizontalProperty 
                                        icon='location' color={theme.palette.neutrals.darkestGrey}
                                        value={t("Remote")}
                                    />
                                </Grid>
                            </Grid>
                            <Grid item xs={12} className="d-flex align-items-end justify-content-between pb-1" style={{overflow: 'hidden'}}>
                                <EButton eVariant='primary'
                                         style={{width: '50%'}}
                                         //disabled={itemsHelper.isOpen}
                                         onClick={()=>{setItemsHelper({isOpen: true, contentId: i._id})}}
                                >
                                    {t("Learn more")}
                                </EButton>
                                <ETakeCourseButton
                                    course={i} 
                                    takeCourse={takeCourse}
                                    allUserSessions={allUserSessions}
                                    isLoggedIn={user?.id}
                                    eVariant='secondary'
                                    style={{width: '50%', whiteSpace: 'nowrap'}}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Paper>
        </Grid>
    ));
    return(
        <>
            {itemsList}
        </>
    )
}