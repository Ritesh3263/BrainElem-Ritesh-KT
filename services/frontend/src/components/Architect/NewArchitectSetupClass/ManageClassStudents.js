import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {ESwipeableDrawer} from "styled_components";
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import moduleCoreService from "services/module-core.service";
import {Checkbox, FormControlLabel, FormGroup} from "@material-ui/core";
import Visibility from "@material-ui/icons/Visibility";
import IconButton from "@mui/material/IconButton";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
    darkViolet: {
        color: theme.palette.primary.darkViolet
    },
}))

export default function ManageClassStudents(props){
    const{
        swipeableDrawerHelper={isOpen:false},
        setSwipeableDrawerHelper=({isOPen})=>{},
        assignedTrainees=[],
        manageStudents=(action)=>{},
        setIsOpenTraineeModal=({isOpen, traineeId})=>{},
    }=props;
    const { t } = useTranslation();
    const classes = useStyles();
    const {F_getHelper} = useMainContext();
    const {manageScopeIds} = F_getHelper();

    const [data,setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);

    useEffect(()=>{
        if(swipeableDrawerHelper.isOpen){
            getAllTrainees();
        }
    },[swipeableDrawerHelper.isOpen]);

    useEffect(()=>{
        if(swipeableDrawerHelper.isOpen && assignedTrainees.length>=0){
            getAllTrainees();
        }
    },[assignedTrainees]);

    const getAllTrainees=()=>{
        moduleCoreService.readAllTrainees(manageScopeIds.moduleId).then(res=>{
            if(res.data.length>0){
                if(assignedTrainees.length>0){
                    let selected = res.data.map(tr=>{
                        if(assignedTrainees.some(({_id})=> _id === tr._id)){
                            tr.isSelected = true;
                        }
                        return tr;
                    });
                    setData(selected);
                    setFilteredData(selected);
                }else{
                    setData(res.data.map(i=>({...i,isSelected: false})));
                    setFilteredData(res.data.map(i=>({...i,isSelected: false})));
                }
            }
        });
    }


    const itemsList = filteredData.length>0 ? filteredData.map((item)=>
        (
            <FormControlLabel
                label={
                        <div style={{display: 'flex'}}>
                            <div>{`${item.name||'-'} ${item.surname||'-'}`}</div>
                            <IconButton color="secondary" size="small"
                                        className={`${classes.darkViolet}`}
                                        style={{marginLeft: '25px'}}
                                        onClick={()=>{
                                            setIsOpenTraineeModal({isOpen: true, traineeId:item._id})
                                        }}><Visibility/>
                            </IconButton>
                        </div>
                }
                control={
                    <Checkbox style={{color:`rgba(82, 57, 112, 1)`}}
                              checked={!!item.isSelected}
                              name={item.name}
                              value={item._id}
                              onChange={(e,isS)=>{
                                  if(isS){
                                      manageStudents({type:'ADD',payload: item})
                                  }else{
                                      manageStudents({type:'REMOVE',payload: item._id})
                                  }
                              }}
                    />
                }
            />
        )): <p>{t("No data")}</p>;


    return(
            <ESwipeableDrawer
                swipeableDrawerHelper={swipeableDrawerHelper}
                setSwipeableDrawerHelper={setSwipeableDrawerHelper}
                header={assignedTrainees.length>0 ? t("Manage assigned students") : t("Assign students to class")}
                originalData={data}
                setFilteredData={setFilteredData}
            >
                <FormGroup className="pl-2">
                    {itemsList}
                </FormGroup>
            </ESwipeableDrawer>
    )
}