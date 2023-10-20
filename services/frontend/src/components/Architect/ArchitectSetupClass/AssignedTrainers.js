import React, {useEffect, useState} from "react";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import List from "@material-ui/core/List";
import {Checkbox, ListItemIcon, ListSubheader, Paper} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import {useTranslation} from "react-i18next";
import SearchField from "../../common/Search/SearchField";
import TableSearch from "../../common/Table/TableSearch";
import Grid from "@material-ui/core/Grid";
import Typography from '@material-ui/core/Typography';
import { theme } from "../../../MuiTheme";

const useStyles = makeStyles(theme=>({}))

export default function AssignedTrainers({isOpenSidebarDrawer, setIsOpenSidebarDrawer, allTrainers, setMSClass}){
    const { t, i18n, translationsLoaded } = useTranslation();
    const classes = useStyles();
    const [searchingText, setSearchingText] = useState('');
    const [filteredData,setFilteredData] = useState([]);
    const [allTrainersSelected, setAllTrainersSelected] = useState([]);

    useEffect(()=>{
        setAllTrainersSelected([]);
    },[])

    useEffect(()=>{
        setFilteredData(allTrainers)
    },[allTrainers, isOpenSidebarDrawer])

    useEffect(()=>{
        let newArray1 = [];
        // newArray1 = test.map(item=>{
        //     isOpenSidebarDrawer.assignedTrainers.map(i=>{
        //         if(item._id === i._id){
        //             item.isSelected = true;
        //         }else{
        //             //item.isSelected = false;
        //         }
        //     });
        //     return item;
        // });

        if(isOpenSidebarDrawer.assignedTrainers && isOpenSidebarDrawer.assignedTrainers.length >0){
            for(let i=0; i< allTrainers.length; i++){
                let trainer = allTrainers[i];
                trainer.isSelected = false;
                for(let j=0; j<isOpenSidebarDrawer.assignedTrainers.length; j++){
                    if(isOpenSidebarDrawer.assignedTrainers[j]._id === allTrainers[i]._id){
                        trainer.isSelected = true;
                    }
                }
                newArray1.push(trainer);
            }
        }else{
            newArray1 = allTrainers.map(i=> ({...i, isSelected:  false}));
        }

        setAllTrainersSelected(newArray1)
    },[isOpenSidebarDrawer.isOpen]);

    const allTrainersSelectedList = filteredData.map((item,index)=>(
        <ListItem key={index}>
            <ListItemIcon>
                <Checkbox
                    edge="start"
                    checked={!!item.isSelected}
                    tabIndex={-1}
                    value={index}
                    disableRipple
                    //inputProps={{ 'aria-labelledby': labelId }}
                    onChange={(e,isChecked)=>
                    {
                        setAllTrainersSelected(p=>{
                            let findIndex1 = allTrainersSelected.findIndex(i=> i._id === item._id)
                            let val = Object.assign([],p);
                            val[findIndex1].isSelected = !val[findIndex1].isSelected;
                            return val;
                        });

                        setMSClass(p=>{
                            let val = Object.assign({},p);
                            if(val.program[isOpenSidebarDrawer.currInd].assignment[isOpenSidebarDrawer.ind].trainers === undefined){
                                val.program[isOpenSidebarDrawer.currInd].assignment[isOpenSidebarDrawer.ind].trainers =[];
                            }
                            if(isChecked){
                                val.program[isOpenSidebarDrawer.currInd].assignment[isOpenSidebarDrawer.ind].trainers.push(item)
                            }else{
                                let foundedIndex = val.program[isOpenSidebarDrawer.currInd].assignment[isOpenSidebarDrawer.ind].trainers.findIndex(x=> x._id === item._id);
                                val.program[isOpenSidebarDrawer.currInd].assignment[isOpenSidebarDrawer.ind].trainers.splice(foundedIndex,1);
                            }
                            return val;})
                    }}
                />
            </ListItemIcon>
            <ListItemText primary={`${item.name} ${item.surname}`}  secondary={`email: ${item.email}`}/>
        </ListItem>
    ))

    return(
        <SwipeableDrawer
            PaperProps={{
                style:{
                    backgroundColor: theme.palette.neutrals.white,
                    maxWidth:"450px"
            }}}
            anchor="right"
            onOpen={()=>{}}
            open={isOpenSidebarDrawer.isOpen}
            onClose={()=>{
                setSearchingText('')
                setIsOpenSidebarDrawer({isOpen: false, assignedTrainers: [], currentIndex: null, ind: null,})
                setAllTrainersSelected([])
            }}

         >
            <List
                component="nav"
                aria-labelledby="nested-list-subheader"
                subheader={
                    <ListSubheader disableSticky= "true" component="div" id="nested-list-subheader">
                        <Grid container className="py-2">
                            <Grid item xs={12}>
                                <Typography variant="h3" component="h2" className="mt-2 text-center text-justify mb-2" style={{fontSize:"32px"}}>   
                                    {t("Assign trainers")}
                                </Typography>    
                            </Grid>
                            <Grid item xs={12} className='px-3 mb-2'>
                                    <SearchField
                                        className="text-primary"
                                        value={searchingText}
                                        onChange={(e)=>{TableSearch(e.target.value, allTrainersSelected, setSearchingText, setFilteredData)}}
                                        clearSearch={()=>TableSearch('', allTrainersSelected, setSearchingText, setFilteredData)}
                                    />
                            </Grid>
                        </Grid>
                    </ListSubheader>
                }
            >
                {allTrainersSelectedList.length>0 ? allTrainersSelectedList : <span className="ml-5">{t("Not Found")}</span>}
            </List>
        </SwipeableDrawer>
    )
}