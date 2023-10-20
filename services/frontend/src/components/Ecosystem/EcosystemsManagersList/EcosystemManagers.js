import React, { useState, useEffect } from "react";
import EcosystemService from "../../../services/ecosystem.service";
import { useTranslation } from "react-i18next";
import { useNavigate} from "react-router-dom";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import Button from '@material-ui/core/Button';
import { makeStyles} from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import EcosystemsManagersTable from "./EcosystemsManagersTable";
import Typography from "@material-ui/core/Typography";
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";

const useStyles = makeStyles(theme=>({}))

export default function EcosystemManagers (){
  const navigate = useNavigate();
  const [ecosystemManagers, setEcosystemManagers] = useState([]);
  const [components, setComponents] = useState([]);
  const { t, i18n } = useTranslation();
  const classes = useStyles();
  // setCurrentRoute
  const {setMyCurrentRoute, F_showToastMessage, F_getErrorMessage, F_handleSetShowLoader} = useMainContext();
  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };
  const [showAddingEcosystemManagerModal, setShowAddingEcosystemManagerModal] = useState(false);


  const removeEcosystem = async (id) => {
    EcosystemService.removeManager(id).then(
      (response) => {
        loadEcosystemManagerFromDatabase();
        // // other aproach
        // let ecosystemsWithoutRemovedEcosystem = ecosystems.filter((ecosystem)=>{return ecosystem._id!=id});
        // setEcosystems(ecosystemsWithoutRemovedEcosystem);
        F_showToastMessage(t("Ecosystem manager deleted"));
      },
      (error) => {
        let errorMessage = F_getErrorMessage(error);
        F_showToastMessage(errorMessage);
      }
    );
  };

  useEffect(() => {
    if (ecosystemManagers) {
      //setComponents(getComponents());
      setMyCurrentRoute("Ecosystem managers")
    }
  }, [ecosystemManagers]);

  useEffect(() => {
    loadEcosystemManagerFromDatabase();
  }, []);

  const loadEcosystemManagerFromDatabase = () => {
    F_handleSetShowLoader(true)
    EcosystemService.getEcosystemManagers().then(
      (response) => {
        setEcosystemManagers(response.data);
        F_handleSetShowLoader(false)
      },
      (error) => {
        const _content =
          (error.response &&
            error.response.data &&
            error.response.data.detail) ||
          (error.response && error.response.data) ||
          error.message ||
          error.toString();

        setEcosystemManagers(_content);
        F_handleSetShowLoader(false)
      }
    );
  };

  return (
        <Grid container spacing={2}>
          <Grid item xs={12}>
              <div className="d-flex pt-2 px-2 justify-content-between">
                <Typography variant="h5" component="h2" className="text-left" style={{color: `rgba(82, 57, 112, 1)`}}>
                  {t("Ecosystem managers")}
                </Typography>
                <Button classes={{root: classes.root}} size="small" variant="contained" color="primary"
                        startIcon={<AddCircleOutlineIcon/>}
                        onClick={()=>{navigate("/ecosystems/managers/form/new")}}
                >{t("Add ecosystem manager")}</Button>
              </div>
              <hr className="mt-2"/>
              <EcosystemsManagersTable ecosystemManagers={ecosystemManagers}/>
          </Grid>
        </Grid>
  );
};
