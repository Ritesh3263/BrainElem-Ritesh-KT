import React, {useEffect, useState} from "react";
import {Button, ListSubheader, Paper} from "@material-ui/core";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import Grid from "@material-ui/core/Grid";
import SearchField from "../../common/Search/SearchField";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Checkbox from "@material-ui/core/Checkbox";
import ListItemText from "@material-ui/core/ListItemText";
import {useTranslation} from "react-i18next";
import {useStyles} from "@material-ui/pickers/DatePicker/DatePickerToolbar";
import CommonService from "../../../services/common.service";
import userService from "../../../services/user.service";
import DeepSearchF from "./DeepSearchF";

export default function DeepSearchMain({helper}){
    const classes = useStyles();
    const { t, i18n, translationsLoaded } = useTranslation();
    const [openSidebarDrawer, setOpenSidebarDrawer] = useState(true);
    const [searchingText, setSearchingText] = useState('');
    const [filteredData,setFilteredData] = useState([]);
    const [allInterest,setAllInterest] = useState([]);
    const [userInterest, setUserInterest] = useState(null);

    useEffect(()=>{
        userService.read(helper.user.id).then(res=>{
            setUserInterests(res.data);
        });
    },[])

    useEffect(()=>{
        setFilteredData(allInterest);
    },[openSidebarDrawer])

    function setUserInterests(data){
        CommonService.getAllInterests().then(res2 => {
            let userSubinterests = data.details.subinterests ? data.details.subinterests : [];
            let userInt = [];
            if(res2.data){
                let newData = res2.data.map(interest=>{
                    interest.subinterests && interest.subinterests.map(subinterest=>{
                        let newData2 =subinterest;
                        newData2.isSelected = false;
                        userSubinterests.map(int=>{
                            if(subinterest._id === int){
                                newData2.isSelected = true;
                                userInt.push({_id: subinterest._id, name: subinterest.name, isSelected: true})
                            }
                        })
                        return newData2;
                    });
                    return interest;
                });
                setUserInterest(userInt);
                if(userInt.length <=0){
                    setOpenSidebarDrawer(true)
                }
                setAllInterest(newData);
                setFilteredData(newData);
            }
        }).catch(error=>console.log(error))
    }


    return(
        <div>
        <Paper elevation={10} className="p-3">
            <Button variant="outlined" onClick={()=>setOpenSidebarDrawer(p=>!p)}>{openSidebarDrawer ? 'CLOSE' : 'OPEN'}</Button>
        </Paper>

    <SwipeableDrawer
        PaperProps={{
            style:{
                backgroundColor:'rgba(255,255,255,0.75)'
            }}}
        anchor="right"
        open={openSidebarDrawer}
        onClose={()=>{
            setOpenSidebarDrawer(false);
            setSearchingText('')
        }}
    >
        <ListSubheader component="div" id="nested-list-subheader0" hidden={false} style={{width: "600px", backgroundColor:"lightgray"}} >
            <Grid container style={{position: "relative", top:"0px", zIndex: 100}} className="py-2">
                <Grid item xs={6}>
                    {t("Manage interests")}
                </Grid>
                <Grid item xs={6}>
                    <Paper elevation={12} className="d-flex justify-content-end">
                        <SearchField
                            className="text-primary"
                            value={searchingText}
                            onChange={(e)=>{DeepSearchF(e.target.value, allInterest, setSearchingText, setFilteredData)}}
                            clearSearch={()=>DeepSearchF('', allInterest, setSearchingText, setFilteredData)}
                        />
                    </Paper>
                </Grid>
            </Grid>
        </ListSubheader>
        <List subheader={<li/>}>
            {filteredData.length>0 ? filteredData.map((section, index)=>(
                <li key={`section-${index}`}>
                    <ul className="p-0 text-center">
                        <ListSubheader style={{backgroundColor:"lightskyblue", zIndex: 0}} className="mt-0">{section.name}</ListSubheader>
                        {section.subinterests && section.subinterests.map((subInterest, ind)=>(
                            <ListItem key={ind}>
                                <ListItemText primary={subInterest.name}/>
                            </ListItem>
                        ))}
                    </ul>
                </li>
            )) : <span className="ml-5">Nothing found</span>}

        </List>
    </SwipeableDrawer>
    </div>
    )
}