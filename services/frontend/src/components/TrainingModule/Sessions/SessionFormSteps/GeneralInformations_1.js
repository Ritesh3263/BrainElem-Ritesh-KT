import React, {useState} from "react";
import {Checkbox, Divider, FormControlLabel, ListItemIcon, ListItemSecondaryAction, ListSubheader, Paper, Radio, RadioGroup} from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import {makeStyles} from "@material-ui/core/styles";
import Chip from "@material-ui/core/Chip";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import List from "@material-ui/core/List";
import FormControl from "@material-ui/core/FormControl";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import IconButton from "@material-ui/core/IconButton";
import VisibilityIcon from "@material-ui/icons/Visibility";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import Input from "@material-ui/core/Input";
import MenuItem from "@material-ui/core/MenuItem";
import {useTranslation} from "react-i18next";

const useStyles = makeStyles(theme=>({}))

// todo assigned certificate in progress

export default function GeneralInformations_1({session, setSession, internships, certificates, allManagers, setAllManagers, editable}){
    const { t, i18n, translationsLoaded } = useTranslation();
    const classes = useStyles();
    const [isOpenSideDrawer, setIsOpenSideDrawer] = useState({isOpen: false, type: ""});

    function returnAssignedInternship(internshipId){
        let internship = {};
        internship = internships.find((item)=>item._id?.toString()==internshipId?.toString());
        if(internship){
            return(<Chip label={internship.name} onDelete={editable ?? (()=>{setSession(p=>({...p,internship: ""}))})}/>);
        }else{
            return(<p>You haven't assigned any internship yet</p>)
        }
    };

    function returnAssignedCertificate(certificateId){
        let certificate = {};
        certificate = certificates.find((item)=>item._id === certificateId);
        if(certificate){
            return(<Chip label={certificate.name} onDelete={editable ?? (()=>{setSession(p=>({...p,certificate: ""}))})}/>);
        }else{
            return(<p>{t("You haven't assigned any certificate yet")}</p>)
        }
    };

    const internshipsList = internships.map((item,index)=>(
        <ListItem key={index} style={{width:"500px"}}>
            <ListItemIcon>
                <FormControlLabel value={item._id} control={<Radio />}/>
            </ListItemIcon>
            <ListItemText primary={item.name} />
            <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="preview" onClick={()=>{window.open(`/internships/`, '_blank')}}>
                    <VisibilityIcon />
                </IconButton>
            </ListItemSecondaryAction>
        </ListItem>
    ));

    const certificatesList = certificates.map((item,index)=>(
        <ListItem key={index} style={{width:"500px"}}>
            <ListItemIcon>
                <FormControlLabel value={item._id} control={<Radio />}/>
            </ListItemIcon>
            <ListItemText primary={item.name}  secondary={`${item.description}`}/>
            <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="preview" onClick={()=>{window.open(`certifications/certificates/`, '_blank')}}>
                    <VisibilityIcon />
                </IconButton>
            </ListItemSecondaryAction>
        </ListItem>
    ));

    const allManagersList = allManagers.map((item,index)=>(
        <ListItem key={index}>
            <ListItemIcon>
                <Checkbox
                    edge="start"
                    checked={!!item.isSelected}
                    disabled={!!item.old}
                    tabIndex={-1}
                    disableRipple
                    //inputProps={{ 'aria-labelledby': labelId }}
                    onChange={()=>
                        setAllManagers(p=>{
                        let val = Object.assign([],p);
                        val[index].isSelected = !val[index].isSelected;
                        if(val[index].isSelected){
                            setSession(p2=>{
                                let val2 = Object.assign({},p2);
                                // let foundedIndex = val2.findIndex(i=> i._id === item._id);
                                val2.examiners.push({_id: item._id, name: item.name, surname: item.surname, email: item.email})
                                return val2;
                            })
                        }else{
                            setSession(p2=>{
                                let val2 = Object.assign({},p2);
                                let foundedIndex = val2.examiners.findIndex(i=> i._id === item._id);
                                val2.examiners.splice(foundedIndex,1);
                                return val2;
                            })
                        }
                        return val;
                    })}
                />
            </ListItemIcon>
            <ListItemText primary={`${item.name} ${item.surname}`}  secondary={item.details.company?`company: ${item.details.company.name}`:null}/>
        </ListItem>
    ));

    const managersList = session.examiners.length>0 ? session.examiners.map((m,index)=>(<Chip label={`${m.name} ${m.surname}`} onDelete={!m.old ?? (()=>{
        setSession(p=>{
            let val = Object.assign({},p);
            val.examiners.splice(index,1);
            return val;
        })
        setAllManagers(p=>{
            let val = Object.assign([],p);
            let foundedIndex = val.findIndex(i=> i._id === m._id);
            val[foundedIndex].isSelected = !val[foundedIndex].isSelected;
            return val;
        })
    })}/>)):(<p>{t("You haven't assigned any examiners yet")}</p>);

    return(
        <>
            <small>{t("General informations")}</small>
            <Divider variant="insert" />
            <Grid container spacing={3} className="mt-2">
                <Grid item xs={6} className="d-flex flex-column">
                    <TextField label={t("Session name")} style={{ width:"50%"}} margin="normal"
                               variant="filled"
                               InputLabelProps={{
                                   shrink: true,
                               }}
                               value={session.name}
                               onChange={(e)=>
                               setSession(p=>({...p,name: e.target.value}))}
                    />
                    <FormControl style={{width:"50%"}} margin="normal" variant="filled">
                        <InputLabel id="demo-simple-select-label">{t("Level")}</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={session.level}
                            // renderValue={p=> p.name}
                            //input={<Input/>}
                            onChange={(e)=>
                                setSession(p=>({...p,level: e.target.value}))
                            }
                        >
                            <MenuItem value={"BEGINNER"}>{t("BEGINNER")}</MenuItem>
                            <MenuItem value={"INTERMEDIATE"}>{t("INTERMEDIATE")}</MenuItem>
                            <MenuItem value={"ADVANCED"}>{t("ADVANCED")}</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField label={t("Start date")} style={{ width:"50%"}} margin="normal"
                               variant="filled"
                               type="date"
                               InputLabelProps={{
                                   shrink: true,
                               }}
                               value={ session.startDate ? session.startDate.split('T')[0] : ""}
                               onInput={(e) => {
                                   setSession(p=>({...p,startDate: e.target.value}))
                               }}
                    />
                    <TextField label={t("End date")} style={{ width:"50%"}} margin="normal"
                               variant="filled"
                               type="date"
                               InputLabelProps={{
                                   shrink: true,
                               }}
                               value={ session.endDate ? session.endDate.split('T')[0] : ""}
                               onInput={(e) => {
                                   setSession(p=>({...p,endDate: e.target.value}))
                               }}
                    />
                </Grid>
                <Grid item xs={6}>

                    <small>{t("Assign examiners")}</small>
                    <Divider variant="insert" />
                    <div className="d-flex justify-content-between align-items-center mb-5">
                        {/* <span>{returnAssignedManager2(session.examiners)}</span> */}
                        <span>{managersList}</span>
                        <Button classes={{root: classes.root}} size="small" variant="contained" color="secondary"
                                className="my-2"
                                style={{width:"33%"}}
                                startIcon={<AddCircleOutlineIcon/>}
                                onClick={()=>{setIsOpenSideDrawer({isOpen: true, type: "MANAGER"})}}
                        >{t("Assign examiners")}</Button>
                    </div>
                    {/* {(session.examiners.length > 0) ? (
                        <List>
                            {managersList}
                        </List>
                    ) : <span className="mt-2">You don't have any assigned managers</span>} */}


                    <small>{t("Assign certificate")}</small>
                    <Divider variant="insert" />
                    <div className="d-flex justify-content-between align-items-center mb-5">
                        <span>{returnAssignedCertificate(session.certificate)}</span>
                        <Button classes={{root: classes.root}} size="small" variant="contained" color="secondary"
                                disabled={!editable}
                                className="my-2"
                                style={{width:"33%"}}
                                startIcon={<AddCircleOutlineIcon/>}
                                onClick={()=>{setIsOpenSideDrawer({isOpen: true, type: "CERTIFICATE"})}}
                        >{t("Assign certificate")}</Button>
                    </div>

                    <small>Assign internship</small>
                    <Divider variant="insert" />
                    <div className="d-flex justify-content-between align-items-center">
                        <span>{returnAssignedInternship(session.internships?.[0]||session.internships)}</span>
                        <Button classes={{root: classes.root}} size="small" variant="contained" color="secondary"
                                disabled={!editable}
                                className="my-2"
                                style={{width:"33%"}}
                                startIcon={<AddCircleOutlineIcon/>}
                                onClick={()=>{setIsOpenSideDrawer({isOpen: true, type: "INTERNSHIP"})}}
                        >Assign internship</Button>
                    </div>
                </Grid>
            </Grid>
            <SwipeableDrawer
                PaperProps={{
                    style:{
                        backgroundColor:'rgba(255,255,255,0.75)'
                    }}}
                anchor="right"
                open={isOpenSideDrawer.isOpen}
                onClose={()=>setIsOpenSideDrawer({isOpen: false, type: ""})}
            >
                <List
                    style={{width:"500px"}}
                    component="nav"
                    aria-labelledby="nested-list-subheader"
                >
                    {isOpenSideDrawer.type === "INTERNSHIP" && (
                        <FormControl component="fieldset">
                            <RadioGroup aria-label="Internships" name="Internships-1"
                                        value={session.internships}
                                        onChange={(e)=>{setSession(p=>({...p,internship : e.target.value}))}}
                            >
                                {internshipsList}
                            </RadioGroup>
                        </FormControl>
                    )}
                    {isOpenSideDrawer.type === "CERTIFICATE" && (
                        <FormControl component="fieldset">
                            <RadioGroup aria-label="Internships" name="Internships-1"
                                        value={session.certificate}
                                        onChange={(e)=>{setSession(p=>({...p,certificate : e.target.value}))}}
                            >
                                {certificatesList}
                            </RadioGroup>
                        </FormControl>
                    )}
                    {isOpenSideDrawer.type === "MANAGER" && (
                        <FormControl component="fieldset">
                            {/* <RadioGroup aria-label="Internships" name="Internships-1"
                                        value={session.examiners}
                                        onChange={(e)=>{setSession(p=>({...p,examiners : e.target.value}))}}
                            >
                                {managersList}
                            </RadioGroup> */}
                            <List
                                style={{width:"500px"}}
                                component="nav"
                                aria-labelledby="nested-list-subheader"
                                subheader={
                                    <ListSubheader component="div" id="nested-list-subheader">
                                        {t("Assign examiners")}
                                    </ListSubheader>
                                }
                            >
                                {allManagersList}
                            </List>
                        </FormControl>
                    )}

                </List>
            </SwipeableDrawer>
        </>
    )
}