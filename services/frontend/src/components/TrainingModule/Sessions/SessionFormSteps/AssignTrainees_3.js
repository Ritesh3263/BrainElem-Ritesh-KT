import React, {useState} from "react";
import {Checkbox, Divider, ListItemIcon, ListItemSecondaryAction, ListSubheader, Paper} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import {makeStyles} from "@material-ui/core/styles";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import IconButton from "@material-ui/core/IconButton";
import Avatar from "@material-ui/core/Avatar";
import DeleteIcon from "@material-ui/icons/Delete";
import {useTranslation} from "react-i18next";
import {useMainContext} from "../../../_ContextProviders/MainDataContextProvider/MainDataProvider";

const useStyles = makeStyles(theme=>({}))

export default function AssignTrainees_3({allTrainees, setAllTrainees, session, setSession, editable}){
    const { t, i18n, translationsLoaded } = useTranslation();
    const {F_getHelper} = useMainContext();
    const {userPermissions} = F_getHelper();
    const classes = useStyles();
    const [isOpenSidebarDrawer, setIsOpenSidebarDrawer]=useState(false);

    const allTraineesList = allTrainees.map((item,index)=>(
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
                        setAllTrainees(p=>{
                        let val = Object.assign([],p);
                        val[index].isSelected = !val[index].isSelected;
                        if(val[index].isSelected){
                            setSession(p2=>{
                                let val2 = Object.assign({},p2);
                                // let foundedIndex = val2.findIndex(i=> i._id === item._id);
                                val2.trainees.push({_id: item._id, name: item.name, surname: item.surname, email: item.email})
                                return val2;
                            })
                        }else{
                            setSession(p2=>{
                                let val2 = Object.assign({},p2);
                                let foundedIndex = val2.trainees.findIndex(i=> i._id === item._id);
                                val2.trainees.splice(foundedIndex,1);
                                return val2;
                            })
                        }
                        return val;
                    })}
                />
            </ListItemIcon>
            <ListItemText primary={`${item.name} ${item.surname}`}  secondary={`email: ${item.email}`}/>
        </ListItem>
    ));

    const traineesList = session.trainees.map((item,index)=>(
        <Paper elevation={10} className="mt-1 p-0" key={item._id} id={index}>
            <ListItem dense={true}>
                <ListItemIcon>
                    <Avatar style={{width: "25px", height: "25px", backgroundColor: `rgba(82, 57, 112, 1)`}}>{index+1}</Avatar>
                </ListItemIcon>
                <ListItemText
                    // style={{width:"40%"}}
                    primary={`${item.name} ${item.surname}`}
                />
                <ListItemText
                    style={{width:"40%"}}
                    primary={item?.email??"-"}
                />
                <ListItemSecondaryAction>
                    <IconButton disabled={!!item.old} edge="end" aria-label="delete" onClick={()=>{
                        setSession(p=>{
                            let val = Object.assign({},p);
                            val.trainees.splice(index,1);
                            return val;
                        });
                        setAllTrainees(p=>{
                            let val = Object.assign([],p);
                            let foundedIndex = val.findIndex(i=> i._id === item._id);
                            val[foundedIndex].isSelected = !val[foundedIndex].isSelected;
                            return val;
                        })
                    }}>
                        <DeleteIcon />
                    </IconButton>
                </ListItemSecondaryAction>
            </ListItem>
        </Paper>
    ));



    return(
        <>
            <small>{t("Assigned trainees")}</small>
            <Divider variant="insert" />
            <div className="text-right">
            <Button classes={{root: classes.root}} size="small" variant="contained" color="secondary"
                    className="my-2"
                    //style={{width:"33%"}}
                    startIcon={<AddCircleOutlineIcon/>}
                    onClick={()=>{setIsOpenSidebarDrawer(true)}}
            >{t("Assign trainees")}</Button>
            </div>
            {(session.trainees.length > 0) ? (
                <List>
                    {traineesList}
                </List>
            ) : <span className="mt-2">{t("You don't have any assigned trainees yet")}</span>}

            <SwipeableDrawer
                PaperProps={{
                    style:{
                        backgroundColor:'rgba(255,255,255,0.75)'
                    }}}
                anchor="right"
                open={isOpenSidebarDrawer}
                onClose={()=>setIsOpenSidebarDrawer(false)}
            >
                <List
                    style={{width:"500px"}}
                    component="nav"
                    aria-labelledby="nested-list-subheader"
                    subheader={
                        <ListSubheader component="div" id="nested-list-subheader">
                            {t("Assign trainees")}
                        </ListSubheader>
                    }
                >
                    {allTraineesList}
                </List>
            </SwipeableDrawer>
        </>
    )
}