import React, {useEffect, useState} from "react";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import {FormControlLabel, FormGroup, ListSubheader, Paper} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import SearchField from "../../../../../common/Search/SearchField";
import DeepSearchFunction from "../../../../../common/Search/DeepSearchFunction";
import List from "@material-ui/core/List";
import {useTranslation} from "react-i18next";
import InternshipService from "../../../../../../services/internship.service";
import {useMainContext} from "../../../../../_ContextProviders/MainDataContextProvider/MainDataProvider";
import Button from "@material-ui/core/Button";
import {useSessionContext} from "../../../../../_ContextProviders/SessionProvider/SessionProvider";
import Typography from "@material-ui/core/Typography";
import { theme } from "../../../../../../MuiTheme";

export default function AssignInternships({openSidebarDrawer, setOpenSidebarDrawer}){
    const { t } = useTranslation();
    const {F_handleSetShowLoader} = useMainContext();
    const {
        currentSession,
        sessionReducerActionsType,
        sessionDispatch,
    } = useSessionContext();
    const [searchingText, setSearchingText] = useState('');
    const [internships, setInternships] = useState([]);
    const [filteredData, setFilteredData] = useState([]);

    useEffect(()=>{
        if(openSidebarDrawer){
            F_handleSetShowLoader(true);
            InternshipService.readAll().then(res=>{
                if(res.status === 200 && res.data){
                    filterData(res.data, currentSession.internships)
                    F_handleSetShowLoader(false);
                }
            }).catch(error=>console.log(error));
        }
    }, [openSidebarDrawer]);

    useEffect(()=>{
        setFilteredData(internships);
    },[internships]);

    const filterData=(allInternships=[], assignedInternships=[])=>{
        let selectedList = allInternships?.map(co=>{
            assignedInternships?.map(chC=>{
                if(co._id === chC._id){
                    co.isSelected = true;
                }
            })
            return co;
        });
        setInternships(selectedList);
    };

    const internshipsList = filteredData.map((i,index)=>(
        <FormControlLabel
            label={`${i.name}`}
            control={
                <Button variant="contained" size="small" color="primary"
                        className='mr-4'
                        // disabled={!!i.isSelected}
                        onClick={()=>{
                            if(!i.isSelected) sessionDispatch({
                                type: sessionReducerActionsType.UPDATE_INTERNSHIPS,
                                payload: {type: 'ADD', internship: {...i, new:true}}
                            })
                            else sessionDispatch({
                                type: sessionReducerActionsType.UPDATE_INTERNSHIPS,
                                payload: {type: 'REMOVE', internshipId: i._id}
                            })
                            setOpenSidebarDrawer(false);
                        }}>
                    <small>{t(i.isSelected?"Unassign":"Assign")}</small>
                </Button>
            }
        />
    ));

    return(
        <SwipeableDrawer
            PaperProps={{
                style:{
                backgroundColor: theme.palette.neutrals.white,
                maxWidth:"450px"
            }}}
            onOpen=''
            anchor="right"
            open={openSidebarDrawer}
            onClose={()=>{
                setOpenSidebarDrawer(false)
                setSearchingText('')
            }}
        >
            <ListSubheader disableSticky= "true" component="div" id="nested-list-subheader0" hidden={false}>
                <Grid container style={{position: "relative", top:"0px", zIndex: 100}} className="py-2">
                    <Grid item xs={12}>
                     <Typography variant="h3" component="h2" className="text-center text-justify mt-2" style={{fontSize:"32px"}}>
                        {t("Assign internships")}
                     </Typography>    
                    </Grid>
                    <Grid item xs={12}  className='px-3 mb-2'>
                            <SearchField
                                className="text-primary"
                                value={searchingText}
                                onChange={({target:{value}})=>{DeepSearchFunction(value, internships, setSearchingText, setFilteredData)}}
                                clearSearch={()=>DeepSearchFunction('', internships, setSearchingText, setFilteredData)}
                            />
                    </Grid>
                </Grid>
            </ListSubheader>
            <List subheader={<li/>}>
                <FormGroup className="pl-4">
                    {(internshipsList?.length>0) ? internshipsList : <span>{t("No data")}</span>}
                </FormGroup>
            </List>
        </SwipeableDrawer>
    )
}