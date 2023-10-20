import React, {useEffect, useState} from "react";
import {
    Card,
    CardHeader, Checkbox,
    Divider, FormControlLabel,
    ListItemIcon,
    ListItemSecondaryAction,
    ListSubheader,
    Paper, Radio, RadioGroup
} from "@mui/material";
import { makeStyles} from "@material-ui/core/styles";
import CardContent from "@mui/material/CardContent";
import CardActionArea from "@mui/material/CardActionArea";
import CardActions from "@mui/material/CardActions";
import Grid from "@mui/material/Grid";
import Button from "@material-ui/core/Button";
import {useNavigate} from "react-router-dom";
import CertificateService from "services/certificate.service"
import CompetenceBlockService from "services/competence_block.service"
import CommonService from "services/common.service";
import TextField from "@mui/material/TextField";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import IdGeneratorHelper from "components/common/IdGeneratorHelper";
import VisibilityIcon from "@material-ui/icons/Visibility";
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import {useTranslation} from "react-i18next";
import ConfirmActionModal from "components/common/ConfirmActionModal";
import SearchField from "components/common/Search/SearchField";
import TableSearch from "components/common/Table/TableSearch";
import Typography from "@mui/material/Typography";
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import { theme } from "MuiTheme";
import {ETabBar, ETab, EButton} from "new_styled_components";
import {KeyboardDatePicker} from "@material-ui/pickers";
import { new_theme } from "NewMuiTheme";
import { ThemeProvider } from "@mui/material";
import StyledButton from "new_styled_components/Button/Button.styled";
import "../CompetenceBlocks/certificate.scss"
const useStyles = makeStyles(theme=>({
    object:{
        position:"relative",
        '&:hover': {
            transition: "transform 1s",
            transform: "  scale(1.2,1.2) translate(3em, -2em)",
            zIndex: '1'
         },
}}
))

export default function CertificateForm({formIsOpen, setFormIsOpen}){
    const { t } = useTranslation();
    const {F_showToastMessage} = useMainContext();
    const classes = useStyles();
    const navigate = useNavigate();

    const [isOpenCompetenceBlockSidebar, setIsOpenCompetenceBlockSidebar] = useState(false);
    const [openListItemDetail, setOpenListItemDetail] = useState(false);
    const [actionModal, setActionModal] = useState({isOpen: false, returnedValue: false});

    const [activeTab, setActiveTab] = useState(0);
    const [templates, setTemplates] = useState([]);
    const [competenceBlocks, setCompetenceBlocks] = useState([]);
    const [EQFLevels] = useState(['','Level 1','Level 2','Level 3','Level 4','Level 5','Level 6','Level 7','Level 8']);
    const [searchingText, setSearchingText] = useState('');
    const [filteredData,setFilteredData] = useState([]);
    const [tags, setTags] = useState([]);
    const [userCount, setUserCount] = useState(0);
    const [gradingScales, setGradingScales] = useState([
        {
            _id: "h789f7hyrf",
            name: "Basic 1-10"
        },
        {
            _id: "09w48gh489w",
            name: "FR 1-20"
        },
    ]);

    const [certificate, setCertificate] = useState({
        name: "",
        identificationCode: "",
        EQFLevel:"",
        expires: "",
        template: "TEMPLATE_1",
        description: "",

        additionalCompetences: [{_id:"",title:""}],
        assignedCompetenceBlocks: [{_id:"",name:""}],
    });

    useEffect(()=>{
        setFilteredData(competenceBlocks)
    },[competenceBlocks, isOpenCompetenceBlockSidebar])

    useEffect(()=>{
        if(actionModal.returnedValue){
            remove();
        }
    },[actionModal.returnedValue]);

    useEffect(()=>{
        CommonService.getAllInterests().then(response => {
            let tags = [];
            response.data.forEach(interest => {
                interest.subinterests.forEach(subinterest => {
                    if(certificate.tags && certificate.tags.length>0){
                        certificate.tags.map(t=> {
                                if(subinterest._id === t){
                                    tags.push(subinterest.name);
                                }
                            })
                    }
                })

            })
            setTags(tags)
        }).catch(error=>console.log(error))
        
        CertificateService.readAllTemplates().then(res=>{
            setTemplates(res.data);
        });

        CompetenceBlockService.readAll().then(res2=>{
            setCompetenceBlocks(res2.data);

            if(formIsOpen.certificateId !== ""){
                CertificateService.isCertificateInUse(formIsOpen.certificateId).then(res=>{
                    setUserCount(res.data.count)
                    CertificateService.read(formIsOpen.certificateId).then(res=>{
                        console.log(res.data)
                        setCertificate(p=>
                            ({...p,
                                _id: res.data._id ? res.data._id : "",
                                name: res.data.name ? res.data.name : "",
                                identificationCode: res.data.identificationCode ? res.data.identificationCode : "",
                                EQFLevel: res.data.EQFLevel ? res.data.EQFLevel : "",
                                expires: res.data.expires ? new Date (res.data.expires).toISOString() : "",
                                template: res.data.template ? res.data.template : "TEMPLATE_1",
                                description: res.data.description ? res.data.description : "",
    
                                additionalCompetences: res.data.externalCompetences ? res.data.externalCompetences : [],
                                assignedCompetenceBlocks: res.data.assignedCompetenceBlocks ? res.data.assignedCompetenceBlocks : [],
                            })
                        );
    
                        res2.data.map(i=>{
                            res.data.assignedCompetenceBlocks.map(x=>{
                                if(i._id === x._id){
                                    i.isSelected = true;
                                }
                            })
                        })
                    })
                })
            } else{
                setCertificate({
                    name: "",
                    identificationCode: "",
                    EQFLevel:"",
                    expires: "",
                    template: "TEMPLATE_1",
                    description: "",
                    additionalCompetences: [],
                    assignedCompetenceBlocks: [],
                });
            }
        });


    },[formIsOpen]);

    function competenceAction(type, index, value){
        if(type === "ADD"){
            setCertificate(p=>{
                let val = Object.assign({},p);
                val.additionalCompetences.push({_id: IdGeneratorHelper(16), title: "Fill name", isNew: true})
                return val;
            })
        }else if(type === "REMOVE"){
            setCertificate(p=>{
                let val = Object.assign({},p);
                val.additionalCompetences.splice(index,1);
                return val;
            })
        }else if(type === "UPLOAD_NAME"){
            setCertificate(p=>{
                let val = Object.assign({},p);
                val.additionalCompetences[index].title = value;
                return val;
            })
        }else if(type === "UPLOAD_SCALE"){
            setCertificate(p=>{
                let val = Object.assign({},p);
                val.additionalCompetences[index].assignedScale = value;
                return val;
            })
        }
    }

    function competenceBlocksAction(type, index, value){
        if(type === "ADD"){
            setCertificate(p=>{
                let val = Object.assign({},p);
                value.map(item=>{
                    if(item.isSelected){
                        delete item.isSelected;
                        val.assignedCompetenceBlocks.push(item);
                    }
                })
                return val;
            });
            setIsOpenCompetenceBlockSidebar(false);
        }else if(type === "REMOVE"){
            setCertificate(p=>{
                let val = Object.assign({},p);
                val.assignedCompetenceBlocks.splice(index,1);
                return val;
            })
        }
    }


    function save(){
        // console.log("save", certificate);
        // refresh list and table
        formIsOpen.certificateId!==""? 
        (userCount==0?
            CertificateService.update(certificate).then(res=>{
                console.log("UPDATE",res.data);
                setFormIsOpen({isOpen: false, isNew: false, certificateId: ""});
                F_showToastMessage(t("Data was updated"),"success")
            }): F_showToastMessage(t(`Can't update, certificate is in use for ${userCount} trainee(s)`),"error")):
        CertificateService.add(certificate).then(res=>{
            console.log("ADD",res.data);
            setFormIsOpen({isOpen: false, isNew: false, certificateId: ""});
            F_showToastMessage(t("Data was created"),"success");
        })
    }

    function remove(){
        if(userCount==0){
            CertificateService.remove(certificate._id).then(res=>{
                if(res){
                    setFormIsOpen({isOpen: false, isNew: false, certificateId: ""});
                    F_showToastMessage(t("Data was removed"),"success");
                }
            }).catch(err=>console.log(err));
        } else {
            F_showToastMessage(t(`Can't delete, certificate is in use for ${userCount} trainee(s)`),"error");
        }
    }


    const EQFLevelsList = EQFLevels.filter(x => x).map((item, index)=><MenuItem key={item} value={item}>{item}</MenuItem>);
    // const templatesList = templates.map((item, index)=><MenuItem key={item._id} value={item._id}>{item.name}</MenuItem>);
    // const gradingScalesList = gradingScales.map((item, index)=><MenuItem key={item._id} value={item._id}>{item.name}</MenuItem>);

    const additionalCompetencesList = certificate.additionalCompetences.map((item,index)=>(
        <Paper elevation={10} className="block-list-content" key={item._id} id={index}>
            <ListItem dense={true}>
                <ListItemIcon>
                    <Avatar style={{width: "25px", height: "25px"}}>{index+1}</Avatar>
                </ListItemIcon>
                <ListItemText
                    primary={(
                        <TextField className="legend-0" label=""
                                   InputLabelProps={{
                                       shrink: true,
                                   }}
                                   value={item.title}
                                   onChange={(e)=>
                                       competenceAction("UPLOAD_NAME",index, e.target.value)
                                   }
                        />)}
                />
                {/*DISABLED FOR NOW - Karol 03.09.2021*/}
                {/*<ListItemText*/}
                {/*    //primary={item.assignedScale}*/}
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
                {/*                    competenceAction("UPLOAD_SCALE",index, e.target.value)*/}
                {/*                }*/}
                {/*            >*/}
                {/*                {gradingScalesList}*/}
                {/*            </Select>*/}
                {/*        </FormControl>*/}
                {/*    )}*/}
                {/*/>*/}
                <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="delete" onClick={()=>{competenceAction("REMOVE",index)}}>
                        <DeleteIcon />
                    </IconButton>
                </ListItemSecondaryAction>
            </ListItem>
        </Paper>
    ));

    const assignedCompetenceBlocksList = certificate.assignedCompetenceBlocks.map((item,index)=>(
        <Paper elevation={10} className="block-list-content" key={item._id} id={index}>
            <ListItem dense={true}>
                {/* <ListItemIcon>
                    <Avatar style={{width: "25px", height: "25px"}}>{index+1}</Avatar>
                </ListItemIcon> */}
                <ListItemText
                    className="mr-5"
                    primary={item.title}
                    secondary={item.assesmentCriteria?.name??"-"}
                />
                <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="preview" onClick={()=>{window.open(`/certifications/competenceBlocks`, '_blank')}}>
                        <VisibilityIcon />
                    </IconButton>
                    <IconButton edge="end" aria-label="delete" onClick={()=>{
                        //competenceBlocksAction("REMOVE",index)
                        setCompetenceBlocks(p=>{
                            let val = Object.assign([],p);
                            let foundedIndex = val.findIndex(i=> i._id === item._id);
                            val[foundedIndex].isSelected = !val[foundedIndex].isSelected;
                            return val;
                        });

                        setCertificate(p2=>{
                            let val = Object.assign({},p2);
                            val.assignedCompetenceBlocks.splice(index,1);
                            return val;
                        })
                    }}>
                        <DeleteIcon />
                    </IconButton>
                </ListItemSecondaryAction>
            </ListItem>
        </Paper>
    ));

    const allCompetenceBlocksList = filteredData.map((item,index)=>(
        <ListItem key={index}>
            <ListItemIcon>
                <Checkbox
                    edge="start"
                    checked={!!item.isSelected}
                    tabIndex={-1}
                    disableRipple
                    //inputProps={{ 'aria-labelledby': labelId }}
                    onChange={()=>setCompetenceBlocks(p=>{
                        setSearchingText('');
                        let foundedIndex1 = competenceBlocks.findIndex(i=>i._id === item._id);
                        let val = Object.assign([],p);
                        val[foundedIndex1].isSelected = !val[foundedIndex1].isSelected;

                        if(val[foundedIndex1].isSelected){
                            setCertificate(p2=>{
                                let val2 = Object.assign({},p2);
                                val2.assignedCompetenceBlocks.push(item);
                                return val2;
                            })
                        }else{
                            setCertificate(p2=>{
                                let val2 = Object.assign({},p2);
                                let foundIndex = val2.assignedCompetenceBlocks.findIndex(i=>i._id === item._id);
                                val2.assignedCompetenceBlocks.splice(foundIndex,1);
                                return val2;
                            })
                        }

                        return val;
                    })}
                />
            </ListItemIcon>
            <ListItemText primary={item.title}  secondary={`Id number: RNCP${item._id}`}/>
            <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="preview" onClick={()=>{window.open(`/certifications/competenceBlocks`, '_blank')}}>
                    <VisibilityIcon />
                </IconButton>
            </ListItemSecondaryAction>
        </ListItem>
    ))

    return(
        <Card className="p-0 d-flex flex-column m-0" sx={{boxShadow:'none'}}>
            <CardContent className="pt-0" style={{overflow:"hidden"}}>
                
                <Grid item xs={12} className="admin_heading" sx={{mb:5}}>
                    <Grid>
                        <Typography variant="h1" component="h1">{` ${certificate?.name || t("Certification name")}`}
                        <span style={{fontSize:"10px", color:theme.palette.shades.white70}}>
                            {userCount>0 && (
                                <span>
                                    {`${userCount} user(s)`}
                                </span>
                            )}
                        </span>
                        {!formIsOpen.isNew && (
                            <IconButton className="p-2 mt-2"
                                size="small"
                                style={{float:"right"}}
                                onClick={()=>setActionModal({isOpen: true, returnedValue: false})}>
                                <DeleteForeverIcon style={{color:new_theme.palette.newSupplementary.NSupText}} />
                            </IconButton>
                        )}</Typography>
                        <Divider variant="insert" className='heading_divider' />
                    </Grid>
                </Grid> 

                <Grid item xs={12} className="content_tabing">
                    <ETabBar
                        style={{ minWidth: "280px" }}
                        textColor="primary"
                        variant="fullWidth"
                        aria-label="tabs example"
                        className="tab_style"
                        value={activeTab}
                        onChange={(e,i)=>setActiveTab(i)}
                    >
                        <ETab label='General information' style={{minWidth:'50px'}} eSize='small'/>
                        <ETab label='Competences' style={{minWidth:'50px'}} disabled={formIsOpen.partnerId === "new" || formIsOpen.partnerId === ""}  eSize='small'/>
                    </ETabBar>
                </Grid>
                <Grid container spacing={1}>
                    <Grid item xs={12} className='d-flex flex-column'>
                        {activeTab === 0 && (
                            <>

                                <Grid container spacing={1}>
                                    <Grid item xs={12} md={6} lg={4} >
                                        <TextField label={t("Certification name")} style={{ maxWidth:"400px"}} margin="dense"
                                                   fullWidth={true}
                                                   variant="filled"
                                                   InputLabelProps={{ shrink: true,  }}
                                                   value={certificate.name}
                                                   onChange={(e)=>setCertificate(p=>({...p,name: e.target.value}))
                                                   }
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6} lg={4} >
                                        <TextField label={t("Short description")} style={{ maxWidth:"400px"}} margin="dense"
                                                   fullWidth={true}
                                                   variant="filled"
                                                   multiline={true}
                                                   InputLabelProps={{ shrink: true, }}
                                                   value={certificate.description}
                                                   onChange={(e)=>
                                                       setCertificate(p=>({...p,description: e.target.value}))
                                                   }
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6} lg={4} >
                                        <KeyboardDatePicker label={t("Expiration date")} style={{maxWidth:"400px"}} margin="dense"
                                                   fullWidth={true}
                                                   variant="filled"
                                                   InputLabelProps={{
                                                       shrink: true,
                                                   }}
                                                   rightArrowIcon={null}
                                                   disablePast={true}
                                                   format="yyyy-MM-DD"
                                                   id="date-picker-dialog"
                                                   inputVariant="filled"
                                                   value={ certificate.expires ? certificate.expires.split('T')[0] : ""}
                                                   KeyboardButtonProps={{
                                                    "aria-label": "change date",
                                                    }}
                                                   onChange={(date) => {
                                                    if (date && date._isValid) {
                                                        setCertificate(p=>({...p, expires: new Date(date).toISOString()}))
                                                    }
                                                }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6} lg={4} >
                                        <FormControl style={{maxWidth:"400px"}} margin="dense" variant="filled" fullWidth={true}>
                                            <InputLabel id="demo-simple-select-label">{t("EQF level")}</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={certificate.EQFLevel}
                                                // renderValue={p=> p.name}
                                                //input={<Input/>}
                                                onChange={(e)=>
                                                    setCertificate(p=>({...p,EQFLevel: e.target.value}))
                                                }
                                            >
                                                {EQFLevelsList}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                    {/* <TextField label="Category" style={{ width:"50%"}} margin="normal"
                                       InputLabelProps={{ shrink: true, }}
                                       InputProps={{ readOnly: true, }}
                                       multiline={true}
                                       value={tags.length>0 ? tags.map(t=>t) : null}
                                    /> */}
                                    {/* <TextField label={t("Identification code")} style={{ width:"50%"}} margin="normal"
                                               variant="filled"
                                               InputLabelProps={{
                                                   shrink: true,
                                               }}
                                               value={certificate.identificationCode}
                                               onChange={(e)=>
                                                   setCertificate(p=>({...p,identificationCode: e.target.value}))
                                               }
                                    /> */}
                                <Grid container >
                                    <RadioGroup className='d-flex flex-row' defaultValue={"TEMPLATE_1"} value={certificate.template}>
                                        <Grid item xs={12} sx={{my:3}}>
                                            {/* <Typography variant="body1" component="h2" className="text-left">
                                                {t("Select template")}
                                            </Typography> */}
                                            <Typography variant="h2" component="h2" style={{ color: new_theme.palette.newSupplementary.NSupText, textAlign:'left' }}>{t("Select template")}</Typography>
                                            <Divider variant="insert" sx={{ mb: 4, my: 2 }}/>

                                        </Grid>
                                        <Grid item xs={12} sx={{display:'flex', justifyContent:'space-between', flexWrap:'wrap', width:'100%'}}>
                                            <FormControlLabel
                                                value={"TEMPLATE_1"}
                                                            onChange={({target:{value}})=> setCertificate(p=>({...p,template: value}))}
                                                            control={<Radio style={{color: new_theme.palette.secondary.DarkPurple, width: '20px', height: '20px', marginRight: '15px'}}/>}
                                                            label={
                                                                    <img className="cert-img" src='/img/cert_temp/template1.png' 
                                                                    alt='Course image'
                                                                    loading="lazy"
                                                                    style={{width:"100%", height:"225px",cursor:'pointer', border: `1px solid ${new_theme.palette.secondary.DarkPurple}`, borderRadius: '5px'}}  />                                                        
                                                                  }
                                                            />
                                            <FormControlLabel
                                                value={"TEMPLATE_2"}
                                                            onChange={({target:{value}})=> setCertificate(p=>({...p,template: value}))}
                                                            control={<Radio style={{color: new_theme.palette.secondary.DarkPurple, width: '20px', height: '20px',marginRight: '15px',}}/>}
                                                            label={  
                                                                    <img className="cert-img" src='/img/cert_temp/template2.png' 
                                                                    alt='Course image'
                                                                    loading="lazy"
                                                                    style={{ width:"100%", height:"225px",cursor:'pointer', border: `1px solid ${new_theme.palette.secondary.DarkPurple}`, borderRadius: '5px'}}  />                                                        
                                                                  }
                                                            />
                                        
                                            <FormControlLabel
                                                value={"TEMPLATE_3"}
                                                            onChange={({target:{value}})=> setCertificate(p=>({...p,template: value}))}
                                                            control={<Radio style={{color:`new_theme.palette.secondary.DarkPurple`, width: '20px', height: '20px', marginRight: '15px'}}/>}
                                                            label={
                                                                    <img className="cert-img" src='/img/cert_temp/template_elia.png' 
                                                                    alt='Course image'
                                                                    loading="lazy"
                                                                    style={{width:"100%", height:"225px",cursor:'pointer',border: `1px solid ${new_theme.palette.secondary.DarkPurple}`, borderRadius: '5px'}}  />                                                        
                                                                  }
                                                            /> 
                                            <FormControlLabel
                                                value={"TEMPLATE_4"}
                                                            onChange={({target:{value}})=> setCertificate(p=>({...p,template: value}))}
                                                            control={<Radio style={{color:`new_theme.palette.secondary.DarkPurple`, width: '20px', height: '20px', marginRight: '15px'}}/>}
                                                            label={
                                                                    <img className="cert-img" src='/img/cert_temp/template3.png' 
                                                                    alt='Course image'
                                                                    loading="lazy"
                                                                    style={{width:"100%", height:"225px",cursor:'pointer',border: `1px solid ${new_theme.palette.secondary.DarkPurple}`, borderRadius: '5px'}}  />                                                        
                                                                  }
                                                            /> 
                                                            
                                        </Grid>
                                    </RadioGroup>
                                </Grid>
                                {/*<FormControl style={{width:"50%"}} margin="normal" variant="filled">*/}
                                {/*    <InputLabel id="demo-simple-select-label">{t("Certification template")}</InputLabel>*/}
                                {/*    <Select*/}
                                {/*        labelId="demo-simple-select-label"*/}
                                {/*        id="demo-simple-select"*/}
                                {/*        value="Classical template"*/}
                                {/*        disabled={true}*/}
                                {/*        renderValue={p=> "Classical template"}*/}
                                {/*        // onChange={(e)=>*/}
                                {/*        //     setCertificate(p=>({...p,template: e.target.value}))*/}
                                {/*        // }*/}
                                {/*    >*/}
                                {/*        {templatesList}*/}
                                {/*    </Select>*/}
                                {/*</FormControl>*/}
                                {/*<TextField label="Attach the file" style={{ width:"50%"}} margin="normal"*/}
                                {/*           InputLabelProps={{*/}
                                {/*               shrink: true,*/}
                                {/*           }}*/}
                                {/*           placeholder='empty'*/}
                                {/*           value={certificate.file}*/}
                                {/*        //    render={p=>p.file}*/}
                                {/*           onChange={(e)=>*/}
                                {/*                setCertificate(p=>({...p,assesmentMethod: {name: certificate.assesmentMethod.name, file: e.target.value}}))*/}
                                {/*           }*/}
                                {/*/>*/}
                            </>
                        )}

                        {activeTab === 1 && (
                            <>
                                {/*<div className="d-flex">*/}
                                {/*<Button classes={{root: classes.root}} size="small" variant="contained" color="secondary"*/}
                                {/*        className="my-3"*/}
                                {/*        style={{width:"33%"}}*/}
                                {/*        startIcon={<AddCircleOutlineIcon/>}*/}
                                {/*        onClick={()=>{competenceAction("ADD")}}*/}
                                {/*>Assign a competence block</Button>*/}
                                {/*<Button classes={{root: classes.root}} size="small" variant="contained" color="secondary"*/}
                                {/*        className="my-3 ml-3"*/}
                                {/*        style={{width:"33%"}}*/}
                                {/*        startIcon={<AddCircleOutlineIcon/>}*/}
                                {/*        onClick={()=>{competenceAction("ADD")}}*/}
                                {/*>Add competence by hand</Button>*/}
                                {/*</div>*/}

                                <hr/>
                                <Typography variant="h2" component="h2" style={{ color: new_theme.palette.newSupplementary.NSupText, textAlign:'left', marginTop:'20px' }}>{t("Competence blocks")}</Typography>
                                <Divider variant="insert" sx={{ mb: 4, my: 2 }}/>

                                <StyledButton eSize="large" eVariant="primary"
                                          fullWidth={true}
                                        className="my-2"
                                        style={{maxWidth:"400px"}}
                                        startIcon={<AddCircleOutlineIcon/>}
                                        onClick={()=>{setIsOpenCompetenceBlockSidebar(true)}}
                                >{t("Assign a competence blocks")}</StyledButton>
                                {(certificate.assignedCompetenceBlocks.length > 0) ? (
                                    <List sx={{display:'flex', flexWrap:'wrap', gap:'10px'}}>
                                        {assignedCompetenceBlocksList}
                                    </List>
                                ) : <span className="mt-2">{t("You don't have any assigned competence blocks")}</span>}

                                
                                <Typography variant="h2" component="h2" style={{ color: new_theme.palette.newSupplementary.NSupText, textAlign:'left', marginTop:'20px' }}>{t("Additional competence (assigned by hand)")}</Typography>
                                <Divider variant="insert" sx={{ mb: 4, my: 2 }}/>

                                
                                <StyledButton eSize="large" eVariant="secondary"
                                        className="my-2"
                                        style={{maxWidth:"400px"}}
                                        startIcon={<AddCircleOutlineIcon/>}
                                        onClick={()=>{competenceAction("ADD")}}
                                >{t("Add competence by hand")}</StyledButton>
                                {(certificate.additionalCompetences.length > 0) ? (
                                    <List sx={{display:'flex', flexWrap:'wrap', gap:'10px'}}>
                                        {additionalCompetencesList}
                                    </List>
                                ) : <span className="mt-2">{t("You don't have any assigned additional competence (is optional)")}</span>}
                            </>
                        )}

                        {activeTab === 2 && (
                            <p>{t("soon")}...</p>
                        )}
                    </Grid>
                </Grid>
            </CardContent>
            <CardActionArea>
                <CardActions>
                    <Grid item xs={12} className="btn-flex btn-grid-mb">
                            <StyledButton eVariant="secondary" eSize="small" onClick={() =>  {
                                F_showToastMessage(t("No change"),)
                                setFormIsOpen({isOpen: false, isNew: false, certificateId: ""});
                            }}>
                                {t("Dismiss")}
                            </StyledButton>
                            <StyledButton  eVariant="primary" eSize="small"
                                    onClick={save} 
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
                onOpen=""
                open={isOpenCompetenceBlockSidebar}
                onClose={()=>{
                    setSearchingText('');
                    setIsOpenCompetenceBlockSidebar(false)
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
                                    {t("Assign competence blocks")}
                                </Typography>
                                </Grid>
                                <Grid item xs={12} className='px-3 mb-2'>
                                        <SearchField
                                            className="text-primary"
                                            value={searchingText}
                                            onChange={(e)=>{TableSearch(e.target.value, competenceBlocks, setSearchingText, setFilteredData)}}
                                            clearSearch={()=>TableSearch('', competenceBlocks, setSearchingText, setFilteredData)}
                                        />
                                </Grid>
                            </Grid>
                        </ListSubheader>
                    }
                >
                    {allCompetenceBlocksList.length>0 ? allCompetenceBlocksList : <span className="ml-5">{t("Not Found")}</span>}
                </List>
            </SwipeableDrawer>
            <ConfirmActionModal actionModal={actionModal}
                                setActionModal={setActionModal}
                                actionModalTitle={t("Removing certificate")}
                                actionModalMessage={t("Are you sure you want to remove certificate? The action is not reversible!")}
            />
        </Card>
    )
}