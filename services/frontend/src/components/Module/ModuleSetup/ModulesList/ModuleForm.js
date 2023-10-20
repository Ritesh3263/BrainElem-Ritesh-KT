import React, { useEffect, useState } from "react";
import {Row } from "react-bootstrap";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import Input from "@material-ui/core/Input";
import MenuItem from "@material-ui/core/MenuItem";
import { useNavigate, useParams } from "react-router-dom";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import ModuleService from "../../../../services/module.service";
import Button from '@material-ui/core/Button';
import { makeStyles} from "@material-ui/core/styles"
import {now} from "moment";
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import { CardHeader } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import {useTranslation} from "react-i18next";
import ConfirmActionModal from "../../../common/ConfirmActionModal";
import {useMainContext} from "../../../_ContextProviders/MainDataContextProvider/MainDataProvider";
import Typography from "@material-ui/core/Typography";
import Chip from "@material-ui/core/Chip";

const useStyles = makeStyles(theme=>({}))

export default function ModuleForm() {
  const { t, i18n, translationsLoaded } = useTranslation();
  const { F_showToastMessage, F_getErrorMessage, F_getHelper, F_handleSetShowLoader } = useMainContext();
  const {manageScopeIds} = F_getHelper();
  const classes = useStyles();
  const navigate = useNavigate();
  const { moduleId } = useParams();

  const [currentModule, setCurrentModule] = useState({});
  //Send data to button component
  const [assignedManagers, setAssignedManagers] = useState([]);
  const [allManagersList, setAllManagersList] = useState([]);
  const [actionModal, setActionModal] = useState({isOpen: false, returnedValue: false});

  const [allManagers, setAllManagers] =useState([]);
  const [currentManager, setCurrentManager] =useState({});

    useEffect(()=>{
        if(actionModal.returnedValue){
            removeModule();
        }
        F_handleSetShowLoader(false)
    },[actionModal.returnedValue])

  useEffect(() => {
      F_handleSetShowLoader(true)
    if (moduleId !== "new") {
      ModuleService.read(moduleId).then((res) => {
        console.log("check module: ",res.data)
          setCurrentModule(res.data);
          ModuleService.getListOfFreeAllModuleManagers(moduleId).then((res2) => {

            setAllManagers(res2.data);

              ModuleService.getManagersInModule(res.data._id).then((res3) => {

                setCurrentManager(res3.data[0])

                setAssignedManagers(res3.data);
                let assignedManagerId = ""
                if (res3.data.length) assignedManagerId = res3.data[0]._id;
                let managersList = res2.data.map((mngr) => {
                  if (mngr._id === assignedManagerId) mngr.isSelected = true;
                  else mngr.isSelected = false;
                  return mngr
                })
                setAllManagersList(managersList);
                F_handleSetShowLoader(false);
              });
            }).catch((errors) => console.error(errors));
        }).catch((errors) => console.error(errors));
    } else {
      ModuleService.getListOfFreeAllModuleManagers(moduleId).then((res2) => { 
        setAllManagers(res2.data);
      })
      setCurrentModule({
        name: "",
        description: "",
        moduleType: "SCHOOL",
        // domainName: "",
        currentManager: {},
        usersLimit: 10,
        expires: new Date(now()).toISOString(), /// default expiry// never
        language: "fr",
        isActive: true,
      });
        F_handleSetShowLoader(false);
    }
  }, []);


  function saveChanges() {// need to find a way to provide respective subscriptionId (in the architecturally a module shall be under a subscription)
    currentModule.currentManager = currentManager;
    if (moduleId === "new") {
      ModuleService.add(currentModule, manageScopeIds.subscriptionId).then((res) => {
          //display res.message in toast
          console.log(res);
          F_showToastMessage(t("Data was created"), "success");
          navigate("/modules");
        }).catch((error) => console.error(error));
    } else {
      ModuleService.update(currentModule).then((res) => {
          //display res.message in toast
          console.log(res);
          F_showToastMessage(t("Data was updated"), "success");
          navigate("/modules");
        })
        .catch((error) => console.error(error));
    }
  }

  function removeModule() {
    ModuleService.remove(currentModule._id)
      .then((res) => {
        //display res in toast
        console.log(res);
          F_showToastMessage(t("Data was removed"), "success");
        navigate("/modules");
      })
      .catch((error) => console.error(error));
  }

  const allManagersList2 = allManagers.map((manager, index)=><MenuItem key={manager._id} value={manager}>{manager.name+" "+manager.surname}</MenuItem>);

  return (
    <Card style={{height:"100vh", borderRadius:"0px"}} className="p-2 d-flex flex-column ">
      {/*<CardHeader title={` ${currentModule.name ? currentModule.name : t("Module name")}`}/>*/}
          <CardHeader title={(
              <Typography variant="h3" component="h3" className="d-flex justify-content-between align-items-center">
                  {` ${currentModule?.name || t("Module name")}`}
                  {!allManagersList2.length && moduleId === "new" && (<Button  size="small" className="p-0 d-flex justify-content-end" variant="contained" color="primary" startIcon={<AddCircleOutlineIcon/>} onClick={()=>{
                            navigate("/modules/managers/form/new");
                    }}
                    >{t("Create manager")}</Button>)}
              </Typography>
          )}  />

      <CardContent style={{overflow:"hidden"}}>
        <Grid container spacing={1}>
          <Grid item xs={6} className="d-flex flex-column">
            <TextField
                variant="filled"
                label={t("Module name")}
                style={{ width: "50%" }}
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
                value={currentModule.name}
                onInput={(e) => {
                  setCurrentModule((p) => {
                    let val = Object.assign({}, p);
                    val.name = e.target.value;
                    return val;
                  });
                }}
            />
            <TextField
                variant="filled"
                label={t("Expires")}
                style={{ width: "50%" }}
                margin="normal"
                type="date"
                helperText={t("no selected = NEVER")}
                InputLabelProps={{
                  shrink: true,
                }}
                value={currentModule.expires}
                onChange={(e) => {
                  setCurrentModule((p) => {
                    let val = Object.assign({}, p);
                    val.expires = e.target.value;
                    return val;
                  });
                }}
            />
            <FormControl
                style={{ width: "50%", marginBottom: "15px" }}
                variant="filled" margin="normal"
            >
              <InputLabel id="demo-simple-select-label" >{t("Module type")}</InputLabel>
              <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={currentModule.moduleType === "SCHOOL" ? "SCHOOL" : "TRAINING"}
                  //input={<Input />}
                  onChange={(e) => {
                    setCurrentModule((p) => {
                      let val = Object.assign({}, p);
                      val.moduleType = e.target.value;
                      return val;
                    });
                  }}
              >
                <MenuItem value={"SCHOOL"}>{t("SCHOOL")}</MenuItem>
                <MenuItem value={"TRAINING"}>{t("TRAINING")}</MenuItem>
              </Select>
            </FormControl>
            <FormControl
                style={{ width: "50%", marginBottom: "15px" }}
                variant="filled" margin="normal"
            >
              <InputLabel id="demo-simple-select-label">{t("Language")}</InputLabel>
              <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={currentModule.language == "en" ? "en" : "fr"}
                  // input={<Input />}
                  onChange={(e) => {
                    setCurrentModule((p) => {
                      let val = Object.assign({}, p);
                      val.language = e.target.value;
                      return val;
                    });
                  }}
              >
                <MenuItem value={"en"}>EN</MenuItem>
                <MenuItem value={"fr"}>FR</MenuItem>
              </Select>
            </FormControl>
            <TextField
                margin="normal"
                variant="filled"
                style={{width: "75%"}}
                id="outlined-multiline-static"
                label={t("Description")}
                multiline
                rowsMax={2}
                placeholder="Enter description"
                value={currentModule.description}
                onInput={(e) =>
                    setCurrentModule((p) => {
                      let val = Object.assign({}, p);
                      val.description = e.target.value;
                      return val;
                    })
                }
            />
          </Grid>
          <Grid item xs={6} className="d-flex flex-column">
              {/*<MultiSelectButton*/}
              {/*  allManagersList={allManagersList}*/}
              {/*  assignedManagers={assignedManagers}*/}
              {/*  setAllManagersList={setAllManagersList}*/}
              {/*  setAssignedManagers={setAssignedManagers}*/}
              {/*  addNewRoute={"/modules/managers/form/new"}*/}
              {/*  directName={"Add new manager"}*/}
              {/*/>*/}
              <div>
              <FormControl style={{width:"50%"}} margin="normal" variant="filled">
                  <InputLabel id="demo-simple-select-label">{t("Assign manager")}</InputLabel>
                  <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={currentManager}
                      renderValue={p=> (p.name? p.name+" "+p.surname: "-")}
                      //input={<Input/>}
                      onChange={(e) => {
                          setCurrentManager(p=>{
                              let val = Object.assign({},p);
                              val = e.target.value;
                              return val;
                          })
                      }}
                  >
                      {allManagersList2}
                  </Select>
              </FormControl>
              </div>
              {/* <TextField
                  label={t("Domain")}
                  style={{ width: "50%" }}
                  margin="normal"
                  InputLabelProps={{
                      shrink: true,
                  }}
                  value={currentModule.domainName}
                  onInput={(e) => {
                      setCurrentModule((p) => {
                          let val = Object.assign({}, p);
                          val.domainName = e.target.value;
                          return val;
                      });
                  }}
              /> */}
              <TextField
                  variant="filled"
                  label={t("Users limit")}
                  style={{ width: "50%" }}
                  margin="normal"
                  InputLabelProps={{
                      shrink: true,
                  }}
                  type="number"
                  InputProps={{ inputProps: { min: 0, max: 1000 } }}
                  value={currentModule.usersLimit}
                  onInput={(e) => {
                      setCurrentModule((p) => {
                          let val = Object.assign({}, p);
                          val.usersLimit = e.target.value;
                          return val;
                      });
                  }}
              />
              <FormControl
                  style={{ width: "50%"}}
                  margin="normal"
                  variant="filled"
              >
                  <InputLabel id="demo-simple-select-label" margin="normal">{t("Status")}</InputLabel>
                  <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={currentModule.isActive ? 1 : 0}
                      // input={<Input className={currentModule.isActive ? "text-success" : "text-danger"}/>}
                      onChange={(e) => {
                          setCurrentModule((p) => {
                              let val = Object.assign({}, p);
                              val.isActive = e.target.value == 1 ? true : false;
                              return val;
                          });
                      }}
                  >
                      <MenuItem value={1} className="text-success">
                          {t("Active")}
                      </MenuItem>
                      <MenuItem value={0} className="text-danger">
                          {t("inActive")}
                      </MenuItem>
                  </Select>
              </FormControl>
          </Grid>
        </Grid>
      </CardContent>
      <CardActionArea className="mt-5">
      <CardActions className="d-flex justify-content-between align-items-center">
        <Grid container>
          <Grid item xs={6}>
            <Button
                classes={{root: classes.root}} variant="contained" size="small" color="secondary"
                onClick={() => {
                    F_showToastMessage(t("No change"));
                  navigate("/modules");
                }}
            >
                {t("Back")}
            </Button>
          </Grid>
          <Grid item xs={6} className="p-0 d-flex justify-content-end">
            {moduleId !== "new" ? (
                <Button classes={{root: classes.root}} variant="contained" size="small" color="inherit"
                        onClick={()=>setActionModal({isOpen: true, returnedValue: false})}>
                    {t("Remove")}
                </Button>
            ) : null}
            <Button onClick={saveChanges} classes={{root: classes.root}} size="small" variant="contained" color="primary" className="ml-5">
                {t("Save")}
            </Button>
          </Grid>
        </Grid>
      </CardActions>
      </CardActionArea>
          <ConfirmActionModal actionModal={actionModal}
                              setActionModal={setActionModal}
                              actionModalTitle={t("Removing Module")}
                              actionModalMessage={t("Are you sure you want to remove your Module? Swaps will be entered when you select save on the network form, after that action is not reversible!")}
          />
    </Card>
  );
}