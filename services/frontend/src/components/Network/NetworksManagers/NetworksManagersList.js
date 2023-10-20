import React, {useEffect, useState} from "react"
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import {useNavigate} from "react-router-dom";
import SubscriptionService from "services/subscription.service";
import Button from '@material-ui/core/Button';
import { makeStyles} from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import NetworksManagersTable from "./NetworksManagersTable";
import {useTranslation} from "react-i18next";
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";

const useStyles = makeStyles(theme=>({}))

export default function NetworksManagersList(){
    const { t } = useTranslation();
    const classes = useStyles();
    const navigate =useNavigate();
    const {setMyCurrentRoute, F_getHelper, F_handleSetShowLoader} = useMainContext();
    const {manageScopeIds} = F_getHelper();
    useEffect(()=>{
        F_handleSetShowLoader(true)
        subOwners();
        setMyCurrentRoute("Network managers")
    },[])

    const [subscriptionUsers,setSubscriptionUsers] = useState([]);

     function subOwners (){
        SubscriptionService.getAllSubscriptionOwners(manageScopeIds.ecosystemId).then(ownerList=>{
            setSubscriptionUsers(ownerList.data);
            F_handleSetShowLoader(false)
        }).catch(error=>console.error(error))
    }

        return(
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                            <div className="d-flex pt-2 px-2 mb-3 justify-content-between">
                                <Button classes={{root: classes.root}} size="small" variant="contained" color="primary"
                                        startIcon={<AddCircleOutlineIcon/>}
                                        onClick={()=>{navigate("/networks/owners/form/new")}}
                                >{t("Add network manager")}</Button>
                            </div>
                           <NetworksManagersTable networkManagers={subscriptionUsers}/>
                    </Grid>
                </Grid>
    )
}