import React, {useState} from "react";
import {Divider, FormControlLabel, ListItemIcon, ListItemSecondaryAction, Radio, RadioGroup} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import Chip from "@material-ui/core/Chip";
import {makeStyles} from "@material-ui/core/styles";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import List from "@material-ui/core/List";
import FormControl from "@material-ui/core/FormControl";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import IconButton from "@material-ui/core/IconButton";
import VisibilityIcon from "@material-ui/icons/Visibility";
import {useTranslation} from "react-i18next";

const useStyles = makeStyles(theme=>({}))

export default function AssignProgram_2({session, setSession, curriculums, editable}){
    const { t, i18n, translationsLoaded } = useTranslation();
    const classes = useStyles();
    const [isOpenSideDrawer, setIsOpenSideDrawer] = useState(false);


    function returnAssignedCertificate(assignedCurriculumId){
        let assignedCurriculum = {};
        assignedCurriculum = curriculums.find((item)=>item._id === assignedCurriculumId);
        if(assignedCurriculum){
            return(<Chip label={assignedCurriculum.name} onDelete={editable??(()=>{setSession(p=>({...p,trainingPath: ""}))})}/>);
        }else{
            return(<p>{t("You don't have assigned any curriculum yet")}</p>)
        }
    };

    const curriculumsList = curriculums.map((item,index)=>(
        <ListItem key={index} style={{width:"500px"}}>
            <ListItemIcon>
                <FormControlLabel value={item._id} control={<Radio />}/>
            </ListItemIcon>
            <ListItemText primary={item.name}  secondary={`${item.level}`}/>
            <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="preview" onClick={()=>{window.open(`/modules-core/curriculae/form/${item._id}/`, '_blank')}}>
                    <VisibilityIcon />
                </IconButton>
            </ListItemSecondaryAction>
        </ListItem>
    ));

    return(
        <>
            <small>{t("Assign curriculum")}</small>
            <Divider variant="insert" />
            <div className="d-flex justify-content-between align-items-center mb-5">
                <span>{returnAssignedCertificate(session.trainingPath)}</span>
                <Button classes={{root: classes.root}} size="small" variant="contained" color="secondary"
                        disabled={!editable}
                        className="my-2"
                        style={{width:"33%"}}
                        startIcon={<AddCircleOutlineIcon/>}
                        onClick={()=>{setIsOpenSideDrawer(true)}}
                >{t("Assign curriculum")}</Button>
            </div>
            <SwipeableDrawer
                PaperProps={{
                    style:{
                        backgroundColor:'rgba(255,255,255,0.75)'
                    }}}
                anchor="right"
                open={isOpenSideDrawer}
                onClose={()=>setIsOpenSideDrawer(false)}
            >
                <List
                    style={{width:"500px"}}
                    component="nav"
                    aria-labelledby="nested-list-subheader"
                >
                        <FormControl component="fieldset">
                            <RadioGroup aria-label="Internships" name="Internships-1"
                                        value={session.trainingPath}
                                        onChange={(e)=>{setSession(p=>({...p,trainingPath : e.target.value}))}}
                            >
                                {curriculumsList}
                            </RadioGroup>
                        </FormControl>
                </List>
            </SwipeableDrawer>
        </>
    )
}