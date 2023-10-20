import React, { useState, useEffect, useRef } from "react";
import Button from '@material-ui/core/Button';
import EcosystemService from "services/ecosystem.service";
import { useTranslation } from "react-i18next";
import { useNavigate} from "react-router-dom";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles} from "@material-ui/core/styles";
import Grid from '@material-ui/core/Grid';
import {Paper} from "@material-ui/core";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";

import EcosystemsTable from "./EcosystemsTable";
import Typography from "@material-ui/core/Typography";
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";

const useStyles = makeStyles(theme => ({
  darkViolet: {
    color: theme.palette.primary.darkViolet
  },
}))

//Single HTML for each ecosystem
const Ecosystem = (props) => {
  const { t } = useTranslation();
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [show, setShow] = useState(false);
  const [active, setActive] = useState(props.active);
  const [formHasBeenChanged, setFormHasBeenChanged] = useState(false);
  const [successful, setSuccessful] = useState(false);
  const [message, setMessage] = useState("");
  
  const handleShow = () => setShow(true);
  const handleClose = () => {
    setShow(false);
    setTimeout(() => {
      setMessage("");
      setSuccessful(false);
    }, 300);
  };
  const onChangeNewName = (e) => {
    const newName = e.target.value;
    setNewName(newName);
  };
  const onChangeNewDescription = (e) => {
    const newDescription = e.target.value;
    setNewDescription(newDescription);
  };

  const onChangeSetActive = (e) => {
    const active = e;
    setActive(active);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");
    setSuccessful(false);
    form.current.validateAll();
    if (checkBtn.current.context._errors.length === 0) {
      EcosystemService.update(props.id, newName, newDescription, active).then(
        (response) => {
          setMessage(`Ecosystem ${newName} has been updated`);
          props.loadEcosystemsFromDatabase();
          setSuccessful(true);
          setFormHasBeenChanged(false);
        },
        (error) => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.detail) ||
            error.message ||
            error.toString();
        }
      );
    }
  };

  useEffect(() => {
    if (newName || newDescription || active!==props.active) setFormHasBeenChanged(true);
    else setFormHasBeenChanged(false);
  }, [newName, newDescription, active]);

  const form = useRef();
  const checkBtn = useRef();

  return (
    <>
    </>
  );
};














export default function EcosystemsList(){
  const navigate = useNavigate();
  const [ecosystems, setEcosystems] = useState([]);
  const [ecosystemManagers, setEcosystemManagers] = useState([]);
  const [components, setComponents] = useState([]);
  const { t, i18n } = useTranslation();
  const classes = useStyles();
  // setCurrentRoute
  const {setMyCurrentRoute, F_showToastMessage, F_getErrorMessage, F_getHelper, F_handleSetShowLoader} = useMainContext();
  const [showDescription, setShowDescription] = useState(false);
  const [showAddingEcosystemModal, setShowAddingEcosystemModal] = useState(false);

  // function getComponents(active = true) {
  //   var components = [];
  //   ecosystems.forEach((data) => {
  //     let component = (
  //       <Ecosystem
  //         key={data._id}
  //         id={data._id}
  //         name={data.name}
  //         description={data.description}
  //         active={data.isActive}
  //         helper={props.helper}
  //         removeEcosystem={removeEcosystem}
  //         loadEcosystemsFromDatabase={loadEcosystemsFromDatabase}
  //       />
  //     );
  //     components.push(component);
  //   });
  //   return components;
  // }

  const removeEcosystem = async (id) => {
    EcosystemService.remove(id).then(
      (response) => {
        loadEcosystemsFromDatabase();
        // // other aproach
        // let ecosystemsWithoutRemovedEcosystem = ecosystems.filter((ecosystem)=>{return ecosystem._id!=id});
        // setEcosystems(ecosystemsWithoutRemovedEcosystem);
        F_showToastMessage(t("Ecosystem deleted"));
      },
      (error) => {
        let errorMessage = F_getErrorMessage(error);
        F_showToastMessage(errorMessage);
      }
    );
  };

  useEffect(() => {
    if (ecosystems) {
      // setComponents(getComponents());
      setMyCurrentRoute("Ecosystem")
    }
  }, [ecosystems, "fr"]);

  useEffect(() => {
    loadEcosystemsFromDatabase();
  }, []);

  const loadEcosystemsFromDatabase = () => {
    F_handleSetShowLoader(true);
    EcosystemService.getEcosystems().then(
      (response) => {
        let ecosystemsWithManagers = [] 
        Promise.all(response.data.map(async eco=>{
          let manager = await EcosystemService.getOneEcosystemManager(eco._id).catch(error=>console.log(error))
          ecosystemsWithManagers.push({...eco, assignedManager: manager.data});
        })).then(()=>{
          setEcosystems(ecosystemsWithManagers);
          F_handleSetShowLoader(false);
        }).catch(error=>console.log(error))
      },
      (error) => {
        const _content =
          (error.response &&
            error.response.data &&
            error.response.data.detail) ||
          (error.response && error.response.data) ||
          error.message ||
          error.toString();

        setEcosystems(_content);
        F_handleSetShowLoader(false);
      }
    );
    EcosystemService.getFreeEcosystemManagers().then(
      (response) => {
        setEcosystemManagers(response.data);
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
      }
    );
  };

  
  return (
        <Grid container spacing={2}>
          <Grid item xs={12}>
              <div className="d-flex pt-2 px-2 justify-content-between">
                <Typography variant="h5" component="h2" className="text-left" style={{color: `rgba(82, 57, 112, 1)`}}>
                  {t("Ecosystems")}
                  <IconButton size="small" className={`${classes.darkViolet} ml-3`}
                    onClick={()=>setShowDescription(p=>!p)}
                  >
                  </IconButton>
                </Typography>
                {ecosystems.length < 1 && ( // we allow now only on 1 ecosystem per instance 
                <Button classes={{root: classes.root}} size="small" variant="contained" color="primary"
                        startIcon={<AddCircleOutlineIcon/>}
                        onClick={()=>{navigate("/ecosystems/form/new")}}
                >{t("Add ecosystem")}</Button>
                )}
              </div>
              <hr className="mt-2"/>
              <EcosystemsTable ecosystems={ecosystems}/>
          </Grid>
        </Grid>
  );
};
