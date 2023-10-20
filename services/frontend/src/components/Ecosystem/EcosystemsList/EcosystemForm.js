import React, {useEffect, useState} from "react";
import {Col, Form, Row} from "react-bootstrap";
import {Link, useNavigate, useParams} from "react-router-dom";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import Input from "@material-ui/core/Input";
import MenuItem from "@material-ui/core/MenuItem";
import EcosystemService from "../../../services/ecosystem.service"
import Button from '@material-ui/core/Button';
import { makeStyles} from "@material-ui/core/styles";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import { CardHeader } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import {useTranslation} from "react-i18next";
import ConfirmActionModal from "../../common/ConfirmActionModal";
import Typography from "@material-ui/core/Typography";
import Chip from "@material-ui/core/Chip";
import {useMainContext} from "../../_ContextProviders/MainDataContextProvider/MainDataProvider";

const useStyles = makeStyles(theme=>({}))

export default function EcosystemForm(){
    const { t, i18n, translationsLoaded } = useTranslation();
    const { F_showToastMessage, F_getErrorMessage, F_handleSetShowLoader } = useMainContext();
    const classes = useStyles();
    const { ecosystemId } = useParams();
    const navigate = useNavigate();
    const [currentEcosystem, setCurrentEcosystem] = useState({})
    const [allManagers, setAllManagers] = useState([]);
    const [currentManager, setCurrentManager] = useState(null);
    const [actionModal, setActionModal] = useState({isOpen: false, returnedValue: false});

    useEffect(()=>{
        if(actionModal.returnedValue){
            removeEcosystem();
        }
    },[actionModal.returnedValue])

    useEffect(()=>{
        F_handleSetShowLoader(true);
        if(ecosystemId !== "new") {
            EcosystemService.getEcosystems().then(res => {
                    res.data.map(eco => {
                        if (eco._id === ecosystemId) {
                            setCurrentEcosystem(eco);
                        } else {
                            setCurrentEcosystem(p => {
                                let val = Object.assign({}, p);
                                val.name = "";
                                val.description = ""
                                val.isActive = true;
                                return val;
                            })
                        }
                    })
                F_handleSetShowLoader(false);
                }
            ).catch(errors => console.error(errors))
            
            EcosystemService.getFreeEcosystemManagers(ecosystemId).then(res=>{
                setAllManagers(res.data);
                setCurrentManager(res.data.find(user=>user.scopes.find(scope=>scope.name === "ecosystems:all:"+ecosystemId)));
            }).catch(error=>console.error(error))
        }else{
            let val ={
                name: "",
                description: "",
                isActive: true,
            }
            setCurrentEcosystem(val);
            F_handleSetShowLoader(false);

            EcosystemService.getFreeEcosystemManagers().then(res=>{
                setAllManagers(res.data);
            }).catch(error=>console.error(error))
        }
        
    },[])

    ////////////////////////////////////////////////////////////////////////////

    function removeEcosystem(){
        EcosystemService.remove(currentEcosystem._id).then(res=>{
            F_showToastMessage(t("Ecosystem was removed"),"success");
            navigate("/ecosystems");
        }).catch(errors=>console.error(errors))
    }

    function saveChanges(e){
        e.preventDefault();
        if(ecosystemId !== "new"){
            EcosystemService.update({...currentEcosystem, manager:currentManager._id}).then(res=>{
                F_showToastMessage(t("Ecosystem data was changed successfully"),"success")
                navigate("/ecosystems");
            }).catch(errors=>console.error(errors))
        }else{
            EcosystemService.add({...currentEcosystem, manager:currentManager._id}).then(res=>{
                F_showToastMessage(t("New ecosystem was created"),"success")
                navigate("/ecosystems");
            }).catch(errors=>console.error(errors))
        }
    }

    const allManagersList2 = allManagers.map((manager, index)=><MenuItem key={manager._id} value={manager}>{manager.username}</MenuItem>);

    return(
        <Card className="p-0 d-flex flex-column m-0">
            {/*<CardHeader title={` ${currentEcosystem.name ? currentEcosystem.name : t("Ecosystem name")}`}/>*/}
            <CardHeader title={(
                <Typography variant="h5" component="h2" className="text-left" style={{color: `rgba(82, 57, 112, 1)`}}>
                    {` ${currentEcosystem?.name || t("Ecosystem name")}`}
                </Typography>
            )} avatar={<Chip label={ecosystemId==="new" ? t("Add"):t("Edit")} color="primary" />} />
            <CardContent>
                <Form as={Row}>
                    <Col md={6} className="d-flex flex-column">
                        <TextField label={t("Ecosystem name")} style={{ width:"50%"}} margin="normal"
                                   variant="filled"
                                   InputLabelProps={{
                                       shrink: true,
                                   }}
                                   value={currentEcosystem.name}
                                   onInput={(e) => {
                                       setCurrentEcosystem(p=>{
                                           let val = Object.assign({},p);
                                           val.name = e.target.value;
                                           return val;
                                       })
                                   }}
                        />
                        <TextField
                            id="outlined-multiline-static"
                            variant="filled"
                            label={t("Description")}
                            style={{width: "75%"}}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            margin="normal"
                            multiline
                            value={currentEcosystem.description}
                            onInput={(e) => setCurrentEcosystem(p=>{
                                let val = Object.assign({},p);
                                val.description = e.target.value;
                                return val;
                            })}
                        />
                    </Col>
                    <Col md={6} className="d-flex flex-column">
                        {/*<MultiSelectButton allManagersList={allManagersList} assignedManagers={assignedManagers}*/}
                        {/*                   setAllManagersList={setAllManagersList} setAssignedManagers={setAssignedManagers}/>*/}
                       <Row>
                        <FormControl style={{width:"50%"}} margin="normal" variant="filled">
                            <InputLabel id="demo-simple-select-label">{t("Assign manager")}</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={currentManager}
                                renderValue={p=> (p.name+" "+p.surname)}
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
                        {!allManagersList2.length && ecosystemId === "new" && (<Button style={{height:"50%"}} className="ml-3 mt-4" margin="normal" size="small" variant="contained" color="primary" startIcon={<AddCircleOutlineIcon/>} onClick={()=>{
                            navigate("/ecosystems/managers/form/new");
                    }}
                    >{t("Create Eco-manager")}</Button>)}
                    </Row>
                    <Row>
                        <FormControl style={{width:"50%"}} margin="normal" variant="filled">
                            <InputLabel id="demo-simple-select-label">{t("Status")}</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={currentEcosystem.isActive ? 1 : 0}
                                //input={<Input className={currentEcosystem.isActive ? "text-success" : "text-danger"}/>}
                                onChange={(e) => {
                                    setCurrentEcosystem(p=>{
                                        let val = Object.assign({},p);
                                        console.log(val.isActive)
                                        val.isActive = (e.target.value == 1) ? true : false;
                                        return val;
                                    })
                                }}
                            >
                                <MenuItem value={1} className="text-success">{t("Active")}</MenuItem>
                                <MenuItem value={0} className="text-danger">{t("inActive")}</MenuItem>
                            </Select>
                        </FormControl>
                        </Row>
                    </Col>
                </Form>

            </CardContent>
            <CardActionArea>
            <CardActions className="d-flex justify-content-between align-items-center" >
                <Grid container>
                    <Grid item xs={6}>
                        <Button classes={{root: classes.root}} variant="contained" size="small" color="secondary" onClick={() =>  {
                            F_showToastMessage(t("No change"),)
                            navigate("/ecosystems")
                        }}>
                            {t("Back")}
                        </Button>
                    </Grid>
                    <Grid item xs={6} className="p-0 d-flex justify-content-end">
                        {ecosystemId !== "new" ?
                            <Button classes={{root: classes.root}} variant="contained" size="small" color="inherit"
                                    onClick={()=>setActionModal({isOpen: true, returnedValue: false})}>
                                {t("Remove")}
                            </Button> : null}
                        <Button classes={{root: classes.root}} size="small" variant="contained" color="primary"
                                onClick={saveChanges} className="ml-5"
                        >{t("Save")}</Button>
                    </Grid>
                </Grid>
            </CardActions>
            </CardActionArea>
            <ConfirmActionModal actionModal={actionModal}
                                setActionModal={setActionModal}
                                actionModalTitle={t("Removing Ecosystem")}
                                actionModalMessage={t("Are you sure you want to remove your Ecosystem? The action is not reversible!")}
            />
        </Card>
    )
}