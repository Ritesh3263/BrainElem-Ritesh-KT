import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {useNavigate} from "react-router-dom"
import { makeStyles} from "@material-ui/core/styles";
import SubscriptionService from "services/subscription.service";
import Grid from "@material-ui/core/Grid";
import NetworksTable from "./NetworksTable";
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import {EButton} from "styled_components";

const useStyles = makeStyles(theme=>({}))

export default function NetworksList(props){
    const { t } = useTranslation();
  let navigate = useNavigate();
  const [subscriptions, setSubscriptions] = useState([]);
  const classes = useStyles();
  const {setMyCurrentRoute, F_handleSetShowLoader} = useMainContext();
  const [editFormHelper, setEditFormHelper] = useState({isOpen: false, formatId: undefined});

  useEffect(()=>{
      F_handleSetShowLoader(true);
    SubscriptionService.getSubscriptions().then(
      (response) => {
        let numberOfNetworks = response.data.length
        let subscriptionArray = []
        response.data.forEach(async (s, i)=>{
          s.owner = (await SubscriptionService.getSubscriptionOwner(s._id)).data
          subscriptionArray.push(s)
          if (i+1===numberOfNetworks) setSubscriptions(subscriptionArray)
        })
          F_handleSetShowLoader(false);
      },
      (error) => {
        const _content =
          (error.response &&
            error.response.data &&
            error.response.data.detail) ||
          (error.response && error.response.data) ||
          error.message ||
          error.toString();
          F_handleSetShowLoader(false);
      }
    );
      setMyCurrentRoute("Network")
  },[]);

  return (
        <Grid container spacing={2}>
          <Grid item xs={12}>
                <div className="d-flex pt-2 px-2 pb-2 justify-content-between">
                    <EButton
                        eSize='small'
                        eVariant="primary"
                        onClick={()=>{navigate("/networks/form/new")}}
                    >{t("Add network")}</EButton>
                </div>
              <NetworksTable networks={subscriptions}/>
          </Grid>
        </Grid>
  );
};
