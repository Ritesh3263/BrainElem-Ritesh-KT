import React, {useEffect, useState} from "react";
import {Card, CardHeader, Checkbox, ListItemIcon, ListItemSecondaryAction,ListSubheader, Paper} from "@mui/material";
import CardContent from "@mui/material/CardContent";
import CardActionArea from "@mui/material/CardActionArea";
import CardActions from "@mui/material/CardActions";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import {useNavigate} from "react-router-dom";
import CompetenceService from "services/competence.service"
import CompetenceBlockService from "services/competence_block.service"
import CertificateService from "services/certificate.service"
import CommonService from "services/common.service";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import VisibilityIcon from "@material-ui/icons/Visibility";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import DeleteIcon from "@material-ui/icons/Delete";
import {useTranslation} from "react-i18next";
import ConfirmActionModal from "components/common/ConfirmActionModal";
import SearchField from "components/common/Search/SearchField";
import TableSearch from "components/common/Table/TableSearch";
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import { theme } from "MuiTheme";
import {ETabBar, ETab, EButton} from "new_styled_components";

import { new_theme } from "NewMuiTheme";
import { ThemeProvider } from "@mui/material";
import StyledButton from "new_styled_components/Button/Button.styled";
import { Typography } from "@mui/material";
import { Divider } from "@mui/material";
import "./certificate.scss"
import CancelIcon from '@mui/icons-material/Cancel';

export default function CompetenceBlockForm({formIsOpen, setFormIsOpen}){
    const { t } = useTranslation();
    const {F_showToastMessage} = useMainContext();
    const navigate = useNavigate();
    const [tags, setTags] = useState([]);
    const [isOpenCompetenceSidebar, setIsOpenCompetenceSidebar] = useState(false);
    const [actionModal, setActionModal] = useState({isOpen: false, returnedValue: false});
    const [searchingText, setSearchingText] = useState('');
    const [filteredData,setFilteredData] = useState([]);
    const [activeTab, setActiveTab] = useState(0)
    const [categories, setCategories] = useState([
        {
            _id: "o78fhgw7ed",
            name: "Category 1"
        },
        {
            _id: "9peyfg9r",
            name: "Category 2"
        }
    ]);

    const [gradingScales, setGradingScales] = useState([])
    const [allCompetences, setAllCompetences] = useState([])

    const [competenceBlock, setCompetenceBlock] = useState({
        title: "",
        identificationCode: "",
        competences: [],
        additionalCompetences: [{_id:"",name:""}],
        assesmentMethod: {name: "", file: ""},
        assesmentCriteria: {name: "", file: ""},
        templateFile: "",
    });

    useEffect(()=>{
        if(actionModal.returnedValue){
            remove();
        }
    },[actionModal.returnedValue]);

    useEffect(()=>{
        setFilteredData(allCompetences)
    },[allCompetences, isOpenCompetenceSidebar])

    useEffect(()=>{
        CommonService.getAllInterests().then(response => {
            let tags = [];
            response.data.forEach(interest => {
                interest.subinterests.forEach(subinterest => {
                    if(competenceBlock.tags && competenceBlock.tags.length>0){
                        competenceBlock.tags.map(t=> {
                                if(subinterest._id === t){
                                    tags.push(subinterest.name);
                                }
                            })
                    }
                })

            })
            setTags(tags)
        }).catch(error=>console.log(error))

        CertificateService.readAllGradingScales().then(res=>{
            setGradingScales(res.data)
        })
        CompetenceService.readAll().then(res=>{
            setAllCompetences(res.data)
        })
    },[]);

    useEffect(()=>{
        CompetenceService.readAll().then(res=>{
            setAllCompetences(res.data);
            if(formIsOpen.competenceBlockId !== ""){
                CompetenceBlockService.read(formIsOpen.competenceBlockId).then(res2=>{
                    setCompetenceBlock(p=>({...p, ...res2.data }));

                    res.data.map(i=>{
                        res2.data.competences.map(x=>{
                            if(i._id === x._id){
                                i.isSelected = true;
                            }
                        });
                        return i;
                    })
                });
            } else{
                setCompetenceBlock({
                    title: "",
                    identificationCode: "",
                    competences: [],
                    additionalCompetences: [],
                    assesmentMethod: {name: "", file: ""},
                    assesmentCriteria: {name: "", file: ""},
                    templateFile: "",
                })
            }

        });

    },[formIsOpen]);

    function competenceAction(type, index, value){
        if(type === "ADD"){
            setCompetenceBlock(p=>{
                let val = Object.assign({},p);
                // val.competences.push({_id: IdGeneratorHelper(16), name: "Fill name", gradingScale: "Basic 1-10"})
                value.map(item=>{
                    if(item.isSelected){
                        delete item.isSelected;
                        val.competences.push(item);
                    }
                })
                return val;
            })
            setIsOpenCompetenceSidebar(false);
        }else if(type === "REMOVE"){
            setCompetenceBlock(p=>{
                let val = Object.assign({},p);
                val.competences.splice(index,1);
                return val;
            })
        }else if(type === "UPLOAD_NAME"){
            setCompetenceBlock(p=>{
                let val = Object.assign({},p);
                val.competences[index].name = value;
                return val;
            })
        }else if(type === "UPLOAD_SCALE"){
            setCompetenceBlock(p=>{
                let val = Object.assign({},p);
                val.competences[index].gradingScale = value;
                return val;
            })
        }
    }

    function save(){
        console.log("save");
        // refresh list and table
        formIsOpen.competenceBlockId===""?
        CompetenceBlockService.add(competenceBlock).then(res=>{
            setFormIsOpen({isOpen: false, isNew: false, competenceBlockId: ""});
            F_showToastMessage(res.data.message,"success");
        }).catch(error=>{
            F_showToastMessage("Competence block with this name already exists","error");
        }):
        CompetenceBlockService.update(competenceBlock).then(res=>{
            setFormIsOpen({isOpen: false, isNew: false, competenceBlockId: ""});
            F_showToastMessage(res.data.message,"success");
        }).catch(error=>{
            F_showToastMessage("Competence block with this name already exists","error");
        })
        

    }

    function remove(){
        console.log("remove");
        // refresh list and table
        CompetenceBlockService.remove(formIsOpen.competenceBlockId).then(res=>{
            competenceAction("REMOVE", null, formIsOpen.competenceBlockId);
            setAllCompetences(p=>p.filter(item=>item._id !== formIsOpen.competenceBlockId));
            setFormIsOpen({isOpen: false, isNew: false, competenceBlockId: ""});
            F_showToastMessage(res.data.message,"success");
        }).catch(error=>{
            F_showToastMessage(error.response.data.message,"error");
        })
    }


    // const categoriesList = categories.map((item, index)=><MenuItem key={item._id} value={item.name}>{item.name}</MenuItem>);
    // const gradingScalesList = gradingScales.map((item, index)=><MenuItem key={item._id} value={item}>{item.name}</MenuItem>);
    
    const assignedCompetencesList = competenceBlock.competences.map((item,index)=>(
        <Paper elevation={10} className="block-list-content" key={item._id} id={index}>
            <ListItem dense={true}>
                {/* <ListItemIcon>
                    <Avatar style={{width: "25px", height: "25px"}}>{index+1}</Avatar>
                </ListItemIcon> */}
                <ListItemText
                    className="mr-5"
                    primary={item.title}
                />
                {/*FOR NOW DISABLED - Karol 02.09.2021*/}
                {/*<ListItemText*/}
                {/*    style={{width:"40%"}}*/}
                {/*    primary={(*/}
                {/*        <FormControl style={{width:"80%"}}*/}
                {/*        >*/}
                {/*            <Select*/}
                {/*                labelId="demo-simple-select-label"*/}
                {/*                id="demo-simple-select"*/}
                {/*                value={competenceBlock.competences?.[index].gradingScale}*/}
                {/*                renderValue={p=> p.name}*/}
                {/*                input={<Input/>}*/}
                {/*                onChange={(e)=>*/}
                {/*                    competenceAction("UPLOAD_SCALE",index, e.target.value)*/}
                {/*                }*/}
                {/*            >*/}
                {/*                {gradingScalesList}*/}
                {/*            </Select>*/}
                {/*        </FormControl>*/}
                {/*    )}*/}
                {/*/>*/}
                <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="delete" onClick={()=>{
                        //competenceAction("REMOVE",index);
                        setAllCompetences(p=>{
                            let val = Object.assign([],p);
                            let foundedIndex = val.findIndex(i=> i._id === item._id);
                            val[foundedIndex].isSelected = !val[foundedIndex].isSelected;
                            return val;
                        });
                        setCompetenceBlock(p2=>{
                            let val = Object.assign({},p2);
                            val.competences.splice(index,1);
                            return val;
                        })
                    }}>
                        <CancelIcon />
                    </IconButton>
                </ListItemSecondaryAction>
            </ListItem>
        </Paper>
    ))

    const allCompetencesList = filteredData.map((item,index)=>(
        <ListItem key={index}>
            <ListItemIcon>
                <Checkbox
                    edge="start"
                    checked={!!item.isSelected}
                    tabIndex={-1}
                    disableRipple
                    //inputProps={{ 'aria-labelledby': labelId }}
                    onChange={()=>setAllCompetences(p=>{
                        let foundedIndex1 = allCompetences.findIndex(i=>i._id === item._id);
                        setSearchingText('');
                        let val = Object.assign([],p);
                        val[foundedIndex1].isSelected = !val[foundedIndex1].isSelected;

                        if(val[foundedIndex1].isSelected){
                            setCompetenceBlock(p2=>{
                                let val2 = Object.assign({},p2);
                                val2.competences.push(item);
                                return val2;
                            })
                        }else{
                            setCompetenceBlock(p2=>{
                                let val2 = Object.assign({},p2);
                                let foundIndex = val2.competences.findIndex(i=>i._id === item._id);
                                val2.competences.splice(foundIndex,1);
                                return val2;
                            })
                        }

                        return val;
                    })}
                />
            </ListItemIcon>
            <ListItemText primary={item.title}  secondary={`Id number: RNCP${item._id}`}/>
            <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="preview" onClick={()=>{window.open(`/certifications/competences`, '_blank')}}>
                    <VisibilityIcon />
                </IconButton>
            </ListItemSecondaryAction>
        </ListItem>
    ));

    const additionalCompetencesList = competenceBlock.additionalCompetences.map((item,index)=>(
        <Paper elevation={10}  className="block-list-content"  key={item._id} id={index}>
            <ListItem dense={true}>
                <ListItemIcon>
                    <Avatar style={{width: "25px", height: "25px"}}>{index+1}</Avatar>
                </ListItemIcon>
                <ListItemText
                    primary={(
                        <TextField className="legend-0" label={null} //style={{ width:"80%"}}
                                   InputLabelProps={{
                                       shrink: true,
                                   }}
                                   value={item.name}
                                   onChange={(e)=>
                                       additionalCompetencesAction("UPLOAD_NAME",index, e.target.value)
                                   }
                        />)}
                />
                {/*DISABLED FOR NOW - Karol 02.09.2021*/}
                {/*<ListItemText*/}
                {/*    style={{width:"40%"}}*/}
                {/*    primary={(*/}
                {/*        <FormControl style={{width:"80%"}}*/}
                {/*        >*/}
                {/*            /!*<InputLabel id="demo-simple-select-label">Category</InputLabel>*!/*/}
                {/*            <Select*/}
                {/*                labelId="demo-simple-select-label"*/}
                {/*                id="demo-simple-select"*/}
                {/*                value={item.assignedScale}*/}
                {/*                // renderValue={p=> p.name}*/}
                {/*                input={<Input/>}*/}
                {/*                onChange={(e)=>*/}
                {/*                    additionalCompetencesAction("UPLOAD_SCALE",index, e.target.value)*/}
                {/*                }*/}
                {/*            >*/}
                {/*                {gradingScalesList}*/}
                {/*            </Select>*/}
                {/*        </FormControl>*/}
                {/*    )}*/}
                {/*/>*/}
                <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="close" onClick={()=>{additionalCompetencesAction("REMOVE",index)}}>
                        <CancelIcon />
                    </IconButton>
                </ListItemSecondaryAction>
            </ListItem>
        </Paper>
    ));

    function competenceAction(type, index, value){
        if(type === "ADD"){
            setCompetenceBlock(p=>{
                let val = Object.assign({},p);
                value.map(item=>{
                    if(item.isSelected){
                        delete item.isSelected;
                        val.competences.push(item);
                    }
                })
                return val;
            });
            setIsOpenCompetenceSidebar(false);
        }else if(type === "REMOVE"){
            setCompetenceBlock(p=>{
                let val = Object.assign({},p);
                val.competences.splice(index,1);
                return val;
            })
        }else if(type === "UPLOAD_SCALE"){
            setCompetenceBlock(p=>{
                let val = Object.assign({},p);
                val.competences[index].gradingScale = value;
                return val;
            })
        }
    };



    function additionalCompetencesAction(type, index, value){
        if(type === "ADD"){
            setCompetenceBlock(p=>{
                let val = Object.assign({},p);
                val.additionalCompetences.push({name: "Fill name", isNew: true})
                return val;
            })
        }else if(type === "REMOVE"){
            setCompetenceBlock(p=>{
                let val = Object.assign({},p);
                val.additionalCompetences.splice(index,1);
                return val;
            })
        }else if(type === "UPLOAD_NAME"){
            setCompetenceBlock(p=>{
                let val = Object.assign({},p);
                val.additionalCompetences[index].name = value;
                return val;
            })
        }else if(type === "UPLOAD_SCALE"){
            setCompetenceBlock(p=>{
                let val = Object.assign({},p);
                val.additionalCompetences[index].gradingScale = value;
                return val;
            })
        }
    }



    return(

        <Card className="p-0 d-flex flex-column m-0" sx={{boxShadow:'none'}}>
            {/*<CardHeader title={` ${competenceBlock.title}`}/>*/}
            {/* <CardHeader title={(
                <Typography variant="h3"  className="text-left" >
                    {` ${competenceBlock?.title || t("Competence block name")}`}
                </Typography>
            )} 
            /> */}
            
            <CardContent>
                <Grid item xs={12} className="admin_heading" sx={{mb:5}}>
                    <Grid>
                        <Typography variant="h1" component="h1">{` ${competenceBlock?.title || t("Competence block name")}`}</Typography>
                        <Divider variant="insert" className='heading_divider' />
                    </Grid>
                </Grid> 
                <Grid item xs={12} className="content_tabing">
                    <ETabBar
                        style={{ minWidth: "280px" }}
                        value={activeTab}
                        onChange={(e,i)=>setActiveTab(i)}
                        textColor="primary"
                        variant="fullWidth"
                        aria-label="tabs example"
                        className="tab_style"
                    >
                        <ETab label='General information' style={{minWidth:'50px'}} eSize='small'/>
                        <ETab label='Methods & Criteria' style={{minWidth:'50px'}} eSize='small'/>
                    </ETabBar>
                </Grid>
            {/* <ETabBar className="d-flex flex-fill justify-content-center mb-3"
                    
                    eSize='small'
                    value={activeTab}
                    onChange={(e,i)=>setActiveTab(i)}
                >
                    <ETab label='General information' style={{minWidth:'50px'}} eSize='small'/>
                    <ETab label='Methods & Criteria' style={{minWidth:'50px'}} eSize='small'/>
            </ETabBar> */}
                <Grid container spacing={1}>
                    <Grid item xs={12} className='d-flex flex-column'>
                        {activeTab === 0 ? (
                            <>
                                <Grid container>
                                    <Grid item xs={12}>
                                        <TextField label={t("Competence block name")} style={{maxWidth:"400px"}} margin="dense"
                                                   fullWidth={true}
                                                   variant="filled"
                                                   InputLabelProps={{
                                                       shrink: true,
                                                   }}
                                                   value={competenceBlock.title}
                                                   onChange={(e)=>
                                                       setCompetenceBlock(p=>({...p,title: e.target.value}))
                                                   }
                                        />
                                    </Grid>
                                </Grid>
                                <div className="d-flex flex-fill justify-content-between">
                                    {/* <TextField label={t("Identification number")} style={{ width:"40%"}} margin="normal"
                                               variant="filled"
                                               InputLabelProps={{
                                                   shrink: true,
                                               }}
                                            //    type="number"
                                               value={competenceBlock.customId}

                                               onChange={(e)=>{
                                                   setCompetenceBlock(p=>({...p,customId: e.target.value}))
                                               }}
                                    /> */}
                                </div>
                                <div className="d-flex flex-fill justify-content-between">
                                {/* <FormControl style={{width:"50%"}} margin="normal">
                                    <InputLabel id="demo-simple-select-label">Category</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={competenceBlock.category}
                                        // renderValue={p=> p.name}
                                        input={<Input/>}
                                        onChange={(e)=>
                                            setCompetenceBlock(p=>({...p,category: e.target.value}))
                                        }
                                    >
                                        {categoriesList}
                                    </Select>
                                </FormControl> */}
                                {/* <TextField label="Category" style={{ width:"50%"}} margin="normal"
                                       InputLabelProps={{
                                           shrink: true,
                                       }}
                                       InputProps={{
                                           readOnly: true,
                                       }}
                                       multiline={true}
                                       value={tags.length>0 ? tags.map(t=>t) : null}
                                /> */}
                                </div>
                                <hr/>
                                <Typography variant="h2" component="h2" style={{ color: new_theme.palette.newSupplementary.NSupText, textAlign:'left' }}>{t("Connect competences")}</Typography>
                                <Divider variant="insert" sx={{ mb: 4, my: 2 }}/>
                                <StyledButton eSize="large" eVariant="primary"
                                        style={{maxWidth:'400px'}}
                                        className="my-2"
                                        onClick={()=>{setIsOpenCompetenceSidebar(true)}}
                                >{t("Assign a competences")}</StyledButton>
                                {(competenceBlock.competences.length > 0) ? (
                                    <List sx={{display:'flex', flexWrap:'wrap', gap:'10px'}}>
                                        {assignedCompetencesList}
                                    </List>
                                ) : <span className="mt-2">{t("You don't have any assigned competences")}</span>}
                                {/*
                                <Button classes={{root: classes.root}} size="small" variant="contained" color="primary"
                                        className="my-3"
                                        style={{width:"33%"}}
                                        startIcon={<AddCircleOutlineIcon/>}
                                        onClick={()=>{competenceAction("ADD")}}
                                >Add a competence</Button>

                                {(competenceBlock.competences.length > 0) && (
                                    <List>
                                        {assignedCompetencesList}
                                    </List>
                                )} */}
                                <hr/>
                                {/* <small>{t("Additional competence (assigned by hand)")}</small> */}
                                <Typography variant="h2" component="h2" style={{ color: new_theme.palette.newSupplementary.NSupText, textAlign:'left' }}>{t("Additional competence (assigned by hand)")}</Typography>
                                <Divider variant="insert" sx={{ mb: 4, my: 2 }}/>

                                <StyledButton eSize="large" eVariant="primary"
                                        className="my-2"
                                        style={{maxWidth:'400px'}}
                                        onClick={()=>{additionalCompetencesAction("ADD")}}
                                >{t("Add competence by hand")}</StyledButton>
                                {(competenceBlock.additionalCompetences.length > 0) ? (
                                    <List sx={{display:'flex', flexWrap:'wrap', gap:'10px'}}>
                                        {additionalCompetencesList}
                                    </List>
                                ) : <span className="mt-2">{t("You don't have any assigned additional competence (is optional)")}</span>}
                            </>
                        ) : (
                            <>
                                <Typography variant="h2" component="h2" style={{ color: new_theme.palette.newSupplementary.NSupText, textAlign:'left', marginTop:'20px' }}>{t("Grading methods")}</Typography>
                                <Divider variant="insert" sx={{ mb: 4, my: 2 }}/>
                                <div className="d-flex-mb-clm">
                                <TextField label={t("Method description")} style={{ maxWidth:"400px"}} margin="dense"
                                           fullWidth={true}
                                           variant="filled"
                                           InputLabelProps={{
                                               shrink: true,
                                           }}
                                           multiline={true}
                                           placeholder='empty'
                                           value={competenceBlock.assesmentMethod.name}
                                        //    render={p=>p.name}
                                           onChange={(e)=>
                                               setCompetenceBlock(p=>({...p,assesmentMethod: {name: e.target.value, file: competenceBlock.assesmentMethod.file}}))
                                           }
                                />
                                <small className="mx-3" style={{alignSelf:'center'}}>{t("or")}</small>
                                <TextField label="Upload file with description" style={{maxWidth:"400px"}} margin="dense"
                                           fullWidth={true}
                                           InputLabelProps={{
                                               shrink: true,
                                           }}
                                           placeholder='empty'
                                           value={competenceBlock.assesmentMethod.file}
                                        //    render={p=>p.file}
                                           onChange={(e)=>
                                               setCompetenceBlock(p=>({...p,assesmentMethod: {name: competenceBlock.assesmentMethod.name, file: e.target.value}}))
                                           }
                                />
                                </div>
                                
                                
                                <Typography variant="h2" component="h2" style={{ color: new_theme.palette.newSupplementary.NSupText, textAlign:'left', marginTop:'20px' }}>{t("Certification criteria")}</Typography>
                                <Divider variant="insert" sx={{ mb: 4, my: 2 }}/>
                                <div className="d-flex-mb-clm">
                                <TextField label={t("Criteria description")} style={{maxWidth:"400px"}} margin="dense"
                                           fullWidth={true}
                                           variant="filled"
                                           InputLabelProps={{
                                               shrink: true,
                                           }}
                                           multiline={true}
                                           placeholder='empty'
                                           value={competenceBlock.assesmentCriteria.name}
                                        //    render={p=>p.name}
                                           onChange={(e)=>
                                               setCompetenceBlock(p=>({...p,assesmentCriteria: {name: e.target.value, file: competenceBlock.assesmentCriteria.file}}))
                                           }
                                />
                                <small className="mx-3" style={{alignSelf:'center'}}>{t("or")}</small>
                                <TextField label="Upload file with criteria " style={{maxWidth:"400px"}} margin="dense"
                                           fullWidth={true}
                                           InputLabelProps={{
                                               shrink: true,
                                           }}
                                           placeholder='empty'
                                           value={competenceBlock.assesmentCriteria.file}
                                        //    render={p=>p.file}
                                           onChange={(e)=>
                                               setCompetenceBlock(p=>({...p,assesmentCriteria: {name: competenceBlock.assesmentCriteria.name, file: e.target.value}}))
                                           }
                                /></div>
                            </>
                        )}
                    </Grid>
                </Grid>
            </CardContent>
            <CardActionArea>
                <CardActions >
                    <Grid container className="btn-flex btn-grid-mb">
                        <StyledButton eVariant="secondary" eSize="small" onClick={() =>  {
                            F_showToastMessage(t("No change"),)
                            setFormIsOpen({isOpen: false, isNew: false, competenceBlockId: ""});
                        }}>
                            {t("Dismiss")}
                        </StyledButton>
                        {
                            !formIsOpen.isNew && (
                                <StyledButton  eVariant="secondary" eSize="small" 
                                        onClick={()=>setActionModal({isOpen: true, returnedValue: false, competenceBlockId: competenceBlock._id})}
                                >
                                    {t("Remove")}
                                </StyledButton>
                            )
                        }
                        <StyledButton  eVariant="secondary" eSize="small"
                                onClick={save} className="ml-5" disabled={competenceBlock.title.length<1}
                        >{t("Save")}</StyledButton>
                    </Grid>
                </CardActions>
            </CardActionArea>
            <SwipeableDrawer
                PaperProps={{
                    style:{
                        backgroundColor: theme.palette.neutrals.white,
                        maxWidth:"450px"
                }}}
                anchor="right"
                open={isOpenCompetenceSidebar}
                onClose={()=>{
                    setIsOpenCompetenceSidebar(false);
                    setSearchingText('');
                }}
            >
                <List
                    component="nav"
                    aria-labelledby="nested-list-subheader"
                    subheader={
                        <>
                        <ListSubheader disableSticky= "true" component="div" id="nested-list-subheader">
                            <Grid container  className="py-2">
                                <Grid item xs={12}>
                                    <Typography variant="h3" component="h2" className="mt-2 text-left text-justify mb-2" style={{fontSize:"34px", color:new_theme.palette.primary.MedPurple}}>   
                                        {t("Assign competences")}
                                    </Typography>    
                                    <Divider variant="insert" className='heading_divider' />

                                </Grid>
                                <Grid item xs={12} style={{marginTop:20}}>
                                        <SearchField
                                            className="text-primary"
                                            value={searchingText}
                                            onChange={(e)=>{TableSearch(e.target.value, allCompetences, setSearchingText, setFilteredData)}}
                                            clearSearch={()=>TableSearch('', allCompetences, setSearchingText, setFilteredData)}
                                        />
                                </Grid>
                            </Grid>
                        </ListSubheader>
                        </>
                    }
                >
                    {allCompetencesList.length>0 ? allCompetencesList : <span className="ml-4">{t("Not Found")}</span>}
                </List>
            </SwipeableDrawer>
            <ConfirmActionModal actionModal={actionModal}
                                setActionModal={setActionModal}
                                actionModalTitle={t("Removing competence block")}
                                actionModalMessage={t("Are you sure you want to remove competence block? The action is not reversible!")}
            />
        </Card>
    )
}