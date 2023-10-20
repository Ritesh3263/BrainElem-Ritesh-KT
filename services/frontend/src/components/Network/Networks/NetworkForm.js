import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import SubscriptionService from "../../../services/subscription.service";
import {
  Row,
  Col,
  ListGroup,
} from "react-bootstrap";
import Button from '@material-ui/core/Button';
import { makeStyles} from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import TextField from "@material-ui/core/TextField";
import Avatar from "@material-ui/core/Avatar";
import SettingsIcon from "@material-ui/icons/Settings";
import IconButton from "@material-ui/core/IconButton";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import { CardHeader } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import DeleteIcon from "@material-ui/icons/Delete";
import {useTranslation} from "react-i18next";
import ConfirmActionModal from "../../common/ConfirmActionModal";
import Typography from "@material-ui/core/Typography";
import Chip from "@material-ui/core/Chip";
import {useMainContext} from "../../_ContextProviders/MainDataContextProvider/MainDataProvider";
import FormHelperText from "@material-ui/core/FormHelperText";


const useStyles = makeStyles(theme=>({}))

export default function NetworkForm() {
  const { t, i18n, translationsLoaded } = useTranslation();
  const { F_showToastMessage, F_getErrorMessage, F_getHelper, F_handleSetShowLoader } = useMainContext();
  const {manageScopeIds} = F_getHelper();
  const navigate = useNavigate();
  const classes = useStyles();
  const { subscriptionId } = useParams();
  const [currentSubscription, setCurrentSubscription] = useState(0);
  const [usersList, setUsersList] = useState([]);
  const [modulesList, setModulesList] = useState([]);
  const [assignedUsers, setAssignedUsers] = useState([]);

  const [schoolCenter, setSchoolCenter] = useState(0);
  const [trainingCenter, setTrainingCenter] = useState(0);
  const [cognitiveCenter, setCognitiveCenter] = useState(0);

  const [allSubscriptionOwners, setAllSubscriptionOwners]=useState([]);
  const [currentSubscriptionOwner, setCurrentSubscriptionOwner]=useState({});
  const [actionModal, setActionModal] = useState({isOpen: false, returnedValue: false});
  const [actionModalModule, setActionModalModule] = useState({isOpen: false, returnedValue: false, indexToRemove: null});
  const [_errors, _setErrors] = useState([]);

    useEffect(()=>{
        if(actionModal.returnedValue){
            removeSubscription();
        }
    },[actionModal.returnedValue]);

    useEffect(()=>{
        if(actionModalModule.returnedValue){
            removeModule(actionModalModule.indexToRemove);
        }
    },[actionModalModule.returnedValue]);

  useEffect(() => {
    F_handleSetShowLoader(true)
    SubscriptionService.getAllFreeSubscriptionOwners(subscriptionId).then(res=>{
        if(res.data.length > 0){
          let data = res.data.map(({ _id, name, surname  }) => ({_id, name, surname}))
          setAllSubscriptionOwners(data);
          // setCurrentSubscriptionOwner(data[0]);
        }
    },[]);
    if (subscriptionId !== "new") {
      SubscriptionService.getSubscriptionOwner(subscriptionId)
      .then((res2) => {
        let data2 = res2.data? {_id:res2.data._id, name:res2.data.name, surname:res2.data.surname}: {};

        setCurrentSubscriptionOwner(data2);
      })
      .catch((error) => console.error(error));

      SubscriptionService.getSubscriptions()
        .then(
          (res) => {
            res.data.forEach((sub) => {
              if (sub._id === subscriptionId) {
                setCurrentSubscription(sub);
                sub.modules.forEach((mod) => {
                  switch (mod.moduleType) {
                    case "SCHOOL":
                      pushModule("SCHOOL", mod);
                      setSchoolCenter((p) => p + 1);
                      break;
                    case "TRAINING":
                      setTrainingCenter((p) => p + 1);
                      pushModule("TRAINING", mod);
                      break;
                    case "COGNITIVE":
                      setCognitiveCenter((p) => p + 1);
                      break;
                    default:
                      break;
                  }
                });
              }
            });
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
          }
        )
        .catch((error) => console.error(error));
    } else {
      setCurrentSubscription({
        name: "",
        description: "",
      });
        F_handleSetShowLoader(false);
    }
  }, []);

  function saveChanges(e) {
    e.preventDefault();
    if (subscriptionId !== "new") {
      SubscriptionService.update(
        currentSubscription._id,
        currentSubscription.name,
        currentSubscription.description,
        modulesList,
        currentSubscriptionOwner
      )
        .then((response) => {
            _setErrors([]);
            F_showToastMessage(t("Data was updated"), "success");
            navigate("/networks");
          }
        ).catch(err => {
          _setErrors(err.response.data?.field || err.response.data);
          F_showToastMessage(t("Correct wrong fields"), "warning");
      });
    } else {
      SubscriptionService.add(
        //helper.user.ecosystems[0]._id,
        manageScopeIds.ecosystemId,
        currentSubscription.name,
        currentSubscription.description,
        modulesList,
        currentSubscriptionOwner
      )
        .then((response) => {
            _setErrors([]);
              F_showToastMessage(t("Data was created"), "success");
            navigate("/networks");
          }
        ).catch(err => {
          _setErrors(err.response.data?.field || err.response.data);
          F_showToastMessage(t("Correct wrong fields"), "warning");
      });
    }
  }


  async function removeSubscription() {
    await SubscriptionService.remove(subscriptionId)
      .then((res) => {
        navigate("/networks");
          F_showToastMessage(t("Data was removed"), "success");
      })
      .catch((error) => console.error(error));
  }

  const modulesListView =
    modulesList.length >= 1
      ? modulesList.map((mod, index) => (
            <ListGroup.Item className="pl-2 pr-2 py-0 d-flex justify-content-between align-items-center mb-2" key={index} style={{backgroundColor:`rgba(255,255,255,0.35)`, borderRadius:"8px"}}
          >
            <Col md={1}>
              <Avatar style={{ width: "25px", height: "25px" }}>
                {index + 1}
              </Avatar>
            </Col>
            <Col>{t(mod.moduleType)}</Col>
            <Col>
              <TextField
                label={t("Module name")}
                style={{ margin: 8 }}
                margin="normal"
                error={_errors.includes(`module.${index}.name`)}
                helperText={_errors.includes(`module.${index}.name`) && t('Incorrect name [3-20 characters]')}
                InputLabelProps={{
                  shrink: true,
                }}
                value={mod.name}
                onInput={(e) => {
                  setModulesList((p) => {
                    let val = Object.assign([], p);
                    val[index].name = e.target.value;
                    return val;
                  });
                }}
              />
            </Col>
            <Col>
              <TextField
                label={t("Module description")}
                style={{ margin: 8 }}
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
                value={mod.description}
                onInput={(e) => {
                  setModulesList((p) => {
                    let val = Object.assign([], p);
                    val[index].description = e.target.value;
                    return val;
                  });
                }}
              />
            </Col>
            <Col xs={1} className="d-flex justify-content-end pr-2">
              <IconButton className="text-danger" size="small"  disabled={false}>
                <DeleteIcon onClick={()=>{
                    setActionModalModule({isOpen: true, returnedValue: false, indexToRemove: index})
                }}/>
              </IconButton>
            </Col>
          </ListGroup.Item>
        ))
      : null;

  function pushModule(type, module) {
    setModulesList((p) => {
      let val = Object.assign([], p);
      module['moduleType'] = type;
      val.push(module);
      return val;
    });
  };


  function removeModule(index){
      setModulesList((p) => {
          let val = Object.assign([], p);
          val.splice(index,1);
          return val;
      });
      setActionModalModule(p=>({...p, indexToRemove: null}));
  }

  const allSubscriptionOwnersList = allSubscriptionOwners.map((owner, index)=><MenuItem key={owner._id} value={owner}>{owner.name+" "+owner.surname}</MenuItem>);

  return (
      <Card elevation={17} style={{height:"100vh"}} className="p-2 d-flex flex-column m-0">
      {/*<CardHeader title={` ${currentSubscription ? currentSubscription.name : t("Network name")}`}/>*/}
          <CardHeader title={(
              <Typography variant="h3" component="h3" className="text-left" style={{fontSize:"32px"}}>
                  {` ${currentSubscription?.name || t("Network name")}`}
              </Typography>
          )} 
          />
      <CardContent>
        <Grid container>
          <Grid item xs={6} className="d-flex flex-column">
            <TextField
                label={t("Network name")}
                variant="filled"
                style={{ width: "50%" }}
                margin="normal"
                name='name'
                error={_errors.includes('network_name')}
                helperText={_errors.includes('network_name') && t('Incorrect name [3-20 characters]')}
                InputLabelProps={{
                  shrink: true,
                }}
                value={currentSubscription.name}
                onInput={(e) => {
                  setCurrentSubscription((p) => {
                    let val = Object.assign({}, p);
                    val.name = e.target.value;
                    return val;
                  });
                }}
            />
            <TextField
                fullWidth
                margin="normal"
                variant="filled"
                InputLabelProps={{
                  shrink: true,
                }}
                style={{width:"75%"}}
                multiline
                id="outlined-multiline-static"
                label={t("Description")}
                placeholder={t("Description")}
                value={currentSubscription.description}
                onInput={(e) =>
                    setCurrentSubscription((p) => {
                      let val = Object.assign({}, p);
                      val.description = e.target.value;
                      return val;
                    })
                }
            />
          </Grid>
          <Grid item xs={6}>
            <Row>
              <FormControl style={{width:"50%"}} margin="normal"  variant="filled">
                  <InputLabel id="demo-simple-select-label">{t("Assign owner")}</InputLabel>
                  <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={currentSubscriptionOwner}
                      error={_errors.includes('owner')}
                      //helperText={_errors.includes('name') && t('Assign owner, if list is empty first create them')}
                      renderValue={p=> (p.name? p.name+" "+p.surname: "-")}
                      //input={<Input/>}
                      onChange={(e) => {
                          setCurrentSubscriptionOwner(p=>{
                              let val = Object.assign({},p);
                              val = e.target.value;
                              return val;
                          })
                      }}
                  >
                      {allSubscriptionOwnersList}
                  </Select>
                  <FormHelperText error={_errors.includes('owner')}>
                      {_errors.includes('owner') && t('Assign owner, if list is empty first create them')}
                  </FormHelperText>
              </FormControl>
              {!allSubscriptionOwnersList.length && subscriptionId === "new" && (<Button style={{height:"50%"}} className="ml-3 mt-4" margin="normal" size="small" variant="contained" color="primary" startIcon={<AddCircleOutlineIcon/>} onClick={()=>{
                            navigate("/networks/owners/form/new");
                    }}
                    >{t("Create owner")}</Button>)}
              </Row>
          </Grid>
          <Grid item xs={12} className="d-flex flex-column">
              <h4 className="mt-5">{t("Adding Modules")}</h4>
              <FormHelperText error={_errors.includes('modules')}>
                  {_errors.includes('modules') && t('Add module')}
              </FormHelperText>
              <Button
                  classes={{root: classes.root}} size="small" variant="contained" color="primary"
                  startIcon={<AddCircleOutlineIcon/>}
                  style={{ width: "30%" }}
                  className="mt-4"
                  onClick={(e) => {
                      setModulesList((p) => {
                          let val = Object.assign([], p);
                          val.push({
                              // _id : Math.ceil(Math.random()*1000),
                              moduleType: "SCHOOL",
                              name: "",
                              description: "",
                              usersLimit: 100, // default limit, then set by moduleManager
                              createdAt: new Date(),
                          });
                          return val;
                      });
                  }}
              >
                  {t("Add school center")}
              </Button>
              <Button
                  classes={{root: classes.root}} size="small" variant="contained" color="primary"
                  startIcon={<AddCircleOutlineIcon/>}
                  style={{ width: "30%" }}
                  className="mt-4"
                  onClick={(e) => {
                      setModulesList((p) => {
                          let val = Object.assign([], p);
                          val.push({
                              // _id : Math.ceil(Math.random()*1000),
                              moduleType: "TRAINING",
                              name: "",
                              description: "",
                              usersLimit: 100, // default limit, then set by moduleManager
                          });
                          return val;
                      });
                  }}
              >
                  {t("Add training center")}
              </Button>
              <Button
                  classes={{root: classes.root}} size="small" variant="contained" color="primary"
                  startIcon={<AddCircleOutlineIcon/>}
                  style={{ width: "30%" }}
                  className="mt-4"
                  disabled={true}
                  onClick={(e) => {
                      setModulesList((p) => {
                          let val = Object.assign([], p);
                          val.push({
                              // _id : Math.ceil(Math.random()*1000),
                              moduleType: "COGNITIVE",
                              name: "",
                              description: "",
                          });
                          return val;
                      });
                  }}
              >
                  {t("Add cognitive center")}
              </Button>
          </Grid>
            <Grid item xs={12}>
                {modulesList.length >= 1 ? (
                    <>
                        <hr />
                        <List>
                            <div className="pl-2 pr-2 pb-1 d-flex justify-content-between align-items-center">
                                <Col md={1} className="">No.</Col>
                                <Col className=""><small>{t("Type")}</small></Col>
                                <Col className=""><small>{t("Module name")}</small></Col>
                                <Col className=""><small>{t("Module description")}</small></Col>
                                <Col xs={1} className=" text-right">
                                    <SettingsIcon />
                                </Col>
                            </div>
                            {modulesListView}
                        </List>
                    </>
                ) : null}
            </Grid>
        </Grid>
      </CardContent>
      <CardActionArea>
      <CardActions className="d-flex justify-content-between align-items-center " >
        <Grid container className="d-flex justify-content-between align-items-center ">
            <Button
                classes={{root: classes.root}} variant="contained" size="small" color="secondary"
                onClick={() => {
                    F_showToastMessage(t("No change"));
                  navigate("/networks");
                }}
            >
                {t("Back")}
            </Button>
            {subscriptionId !== "new" ? (
                <Button classes={{root: classes.root}} variant="contained" size="small" color="inherit"
                        onClick={()=>setActionModal({isOpen: true, returnedValue: false})}>
                    {t("Remove")}
                </Button>
            ) : null}
            <Button onClick={(e)=>{saveChanges(e)
            }} classes={{root: classes.root}} size="small" variant="contained" color="primary" className="ml-5">
                {t("Save")}
            </Button>
        </Grid>
      </CardActions>
      </CardActionArea>
          <ConfirmActionModal actionModal={actionModal}
                              setActionModal={setActionModal}
                              actionModalTitle={t("Removing Network")}
                              actionModalMessage={t("Are you sure you want to remove your Network? The action is not reversible!")}
          />
          <ConfirmActionModal actionModal={actionModalModule}
                              setActionModal={setActionModalModule}
                              actionModalTitle={t("Removing Module")}
                              actionModalMessage={t("Are you sure you want to remove your Module? Swaps will be entered when you select save on the network form, after that action is not reversible!")}
          />
    </Card>
  );
}
