import React, {useEffect, useState} from 'react';
import Typography from "@material-ui/core/Typography";
import {useTranslation} from "react-i18next";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import {ListSubheader, Paper} from "@material-ui/core";
import Slider from "@material-ui/core/Slider";
import AdvancedSetupSkill from "./AdvancedSetupSkill";
import TextField from "@material-ui/core/TextField";
import IdGeneratorHelper from "../../../../../common/IdGeneratorHelper";
import {IconButton} from "@mui/material";
import BuildCircleIcon from "@mui/icons-material/BuildCircle";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import SearchField from "../../../../../common/Search/SearchField";
import DeepSearchFunction from "../../../../../common/Search/DeepSearchFunction";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Checkbox from "@material-ui/core/Checkbox";
import ListItemText from "@material-ui/core/ListItemText";
import reportService from "../../../../../../services/soft_skills_template.service";
import { theme } from "../../../../../../MuiTheme";

const marks = [
    {
        value: 0,
        label: '0',
    },
    {
        value: 1,
        label: '1',
    },
    {
        value: 2,
        label: '2',
    },
    {
        value: 3,
        label: '3',
    },
    {
        value: 4,
        label: '4',
    },
    {
        value: 5,
        label: '5',
    },
    {
        value: 6,
        label: '6',
    },
];

export default function SoftSkills({currentTemplate, setCurrentTemplate}){
    const { t } = useTranslation();
    const [openSidebarDrawer, setOpenSidebarDrawer] = useState(false);
    const [searchingText, setSearchingText] = useState('');
    const [allSoftSkills, setAllSoftSkills] = useState([]);
    const [filteredData, setFilteredData] = useState([]);

    useEffect(()=>{
        reportService.readAllSoftSkills().then(res=>{
            if(res.status === 200 && res?.data?.length>0){
                let newData = res.data.map(i=>{
                    if(currentTemplate?.softSkills){
                        currentTemplate.softSkills.map(x=>{
                            if(i._id === x._id){
                                i.isSelected = true;
                            }
                        })
                    }
                    return i;
                });
                setAllSoftSkills(newData);
            }
        }).catch(err=>console.log(err));
    },[currentTemplate]);

    useEffect(()=>{
        setFilteredData(allSoftSkills);
    },[allSoftSkills])


    const skillHelper=(type, ind)=>{
        switch(type) {
            case "ADD": {
                let newItem = {
                    _id: IdGeneratorHelper(13),
                    name: 'New Skill',
                    label: 1,
                    value: 1,
                }
                setCurrentTemplate(p => ({...p, softSkills: [...p.softSkills, newItem]}));
                break;
            }
            case "REMOVE": {
                setCurrentTemplate(p => {
                    let val = Object.assign({}, p);
                    val.softSkills.splice(ind, 1);
                    return val;
                })
            }
            default: break;

        }
    }

    const skillsItemsList = currentTemplate?.softSkills?.length>0 ? currentTemplate?.softSkills.map((item,index)=>(
        <Grid item className="mt-1 p-2" xs={12} md={6} lg={4} key={index}>
            <Paper elevation={10} className="px-3 pt-3 pb-1">
                <Grid container >
                    <Grid item xs={12} className="d-flex justify-content-end">
                        <IconButton size="small"
                                    style={{width:'20px', height: '20px'}}
                                    onClick={()=>skillHelper('REMOVE', index)}
                        >
                            <DeleteForeverIcon style={{fill: "rgba(82, 57, 112, 1)", width:'20px', height: '20px'}} />
                        </IconButton>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField label={t("Skill name")} margin=""
                                   className='mb-3'
                                   InputProps={{
                                       readOnly: true,
                                       disableUnderline: true,
                                   }}
                                   name='skillName'
                                   fullWidth
                                   style={{maxWidth: "400px"}}
                                   variant='standard'
                                   required={false}
                                   InputLabelProps={{
                                       shrink: true,
                                   }}
                                   value={item?.name}
                                   onInput={(e) => {
                                       setCurrentTemplate(p=>{
                                           let val = Object.assign({},p);
                                           val.items[index].name = e.target.value;
                                           return val;
                                       })
                                   }}
                        />
                    </Grid>
                    {true && <Grid item xs={12}>
                        <Slider // slider is not needed when we design softSkills template
                            style={{color: `rgba(82, 57, 112, 1)`}}
                            defaultValue={0}
                            value={item?.value}
                            // getAriaValueText={"sd"}
                            aria-labelledby={`discrete-slider=${index}`}
                            valueLabelDisplay="auto"
                            step={0}
                            marks={marks}
                            min={0}
                            max={6}
                            disabled={true}
                            //disabled={reportPreviewHelper.type === "PREVIEW"}
                            onChange={(e,newVal)=>{
                                //updateReport('SKILL',newVal, index);
                            }}
                        />
                    </Grid>}
                </Grid>
            </Paper>
        </Grid>
    )):[];

    // const skillsEditItemsList = currentTemplate?.items?.length>0 ? currentTemplate?.items.map((item,index)=>(<AdvancedSetupSkill item={item} index={index}/>)):[];


    return(
        <>
            <Grid container>
                <Grid item xs={12} className="mt-3">
                    <Typography variant="body1"
                                component="h6" className="text-left"
                                style={{color: `rgba(82, 57, 112, 1)`}}>
                        {t("Soft skills")}
                    </Typography>
                </Grid>
                <Grid item xs={12} className="my-3">
                    {/*<Button size="small" variant="contained" color="primary"*/}
                    {/*        startIcon={<AddCircleOutlineIcon/>}*/}
                    {/*        onClick={()=>skillHelper('ADD')}*/}
                    {/*>{t('Add soft skill')}</Button>*/}
                    <Button size="small" variant="contained" color="primary"
                            startIcon={<AddCircleOutlineIcon/>}
                            onClick={()=>setOpenSidebarDrawer(true)}
                    >{t('Assign soft skills')}</Button>
                </Grid>
                {/*{skillsEditItemsList}*/}
                {skillsItemsList}
            </Grid>
            <SwipeableDrawer
                PaperProps={{
                    style:{
                    backgroundColor: theme.palette.neutrals.white,
                    maxWidth:"450px"
                }}}
                anchor="right"
                onOpen=''
                open={openSidebarDrawer}
                onClose={()=>{
                    setOpenSidebarDrawer(false)
                    setSearchingText('')
                }}
            >
                <ListSubheader disableSticky= "true" component="div" id="nested-list-subheader0" hidden={false}>
                    <Grid container style={{ position: "relative", top:"0px", zIndex: 100}} className="py-2">
                        <Grid item xs={12}>
                         <Typography variant="h3" component="h2" className="text-center text-justify mt-2" style={{fontSize:"32px"}}>
                            {t("Manage soft skills")}
                         </Typography>    
                        </Grid>
                        <Grid item xs={12}>
                                <SearchField
                                    className="text-primary"
                                    value={searchingText}
                                    onChange={(e)=>{DeepSearchFunction(e.target.value, allSoftSkills, setSearchingText, setFilteredData)}}
                                    clearSearch={()=>DeepSearchFunction('', allSoftSkills, setSearchingText, setFilteredData)}
                                />
                        </Grid>
                    </Grid>
                </ListSubheader>
                <List subheader={<li/>}>
                    {filteredData.length>0 ? filteredData.map((ss, index)=>(
                        <ListItem key={index}>
                            <ListItemIcon>
                                <Checkbox
                                    edge="start"
                                    checked={!!ss.isSelected}
                                    tabIndex={index}
                                    size="small"
                                    color="primary"
                                    inputProps={{ 'aria-labelledby': index }}
                                    onChange={(e,isS)=>{
                                        if(isS){
                                            setCurrentTemplate(p => ({...p, softSkills: [...p.softSkills, {...ss, isSelected: true}]}));
                                        }else{
                                            setCurrentTemplate(p => ({...p, softSkills: [...p.softSkills.filter(i=> i._id !== ss._id)]}));
                                        }
                                    }}
                                />
                            </ListItemIcon>
                            <ListItemText primary={ss?.name}/>
                        </ListItem>
                    )) : <span className="ml-5">{t("No Data")}</span>}

                </List>
            </SwipeableDrawer>
        </>
    )
}