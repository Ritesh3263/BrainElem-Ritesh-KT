import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import ModuleService from "../../../../services/module.service";
import Button from '@material-ui/core/Button';
import { makeStyles} from "@material-ui/core/styles";
import ModuleManagersTable from "./ModuleManagersTable";
import Grid from "@material-ui/core/Grid";
import {Paper} from "@material-ui/core";
import {useTranslation} from "react-i18next";
import Typography from "@material-ui/core/Typography";
import {useMainContext} from "../../../_ContextProviders/MainDataContextProvider/MainDataProvider";

const useStyles = makeStyles(theme=>({}))

export default function ModuleManagers() {
  const { t } = useTranslation();
  const classes = useStyles();
  const navigate = useNavigate();
  const [allManagersList, setAllManagersList] = useState([]);
    // setCurrentRoute
    const {setMyCurrentRoute, F_getHelper, F_handleSetShowLoader} = useMainContext();
    const {manageScopeIds} = F_getHelper();

  useEffect(() => {
      F_handleSetShowLoader(true)
    ModuleService.getListAllModuleManagers(manageScopeIds.subscriptionId)
      .then((res) => {
        let allManagers = res.data;
        const allManagersWithMods = allManagers.map((usr) => {
            let modNames = [];
            usr.scopes.forEach((scope) => {
              if (scope.name.includes("modules:")) {
                let moduleId = scope.name.split(":").pop();
                if(moduleId.length===24)
                  ModuleService.read(moduleId).then((mod) => {
                      if(mod.data?.lengths>0){
                          modNames.push({_id: mod.data._id, name: mod.data.name});
                      }
                  }).catch(error=>console.log(error))
              }
            });
            return { ...usr, assignedModules: modNames };
        })
        setAllManagersList(allManagersWithMods);
          F_handleSetShowLoader(false)
      })
      .catch((errors) => console.error(errors));
      setMyCurrentRoute("Module managers")
  }, []);

  return (
      <>
          <Grid container spacing={3}>
              <Grid item xs={12}>
                      <div className="d-flex pt-2 px-2 mb-3 justify-content-between">
                          <Button classes={{root: classes.root}} size="small" variant="contained" color="primary"
                                  startIcon={<AddCircleOutlineIcon/>}
                                  onClick={()=>{navigate("/modules/managers/form/new")}}
                          >{t("Add module manager")}</Button>
                      </div>
                      <ModuleManagersTable moduleManagers={allManagersList}/>
              </Grid>
          </Grid>
      </>
  );
}
