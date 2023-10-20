import React, {useEffect, useState} from "react";
import {Card, CardHeader, Divider, FormHelperText} from "@mui/material";
import CardContent from "@mui/material/CardContent";
import CardActionArea from "@mui/material/CardActionArea";
import CardActions from "@mui/material/CardActions";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InternshipService from "services/internship.service"
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import {useTranslation} from "react-i18next";
import Typography from "@mui/material/Typography";
import CourseService from "services/course.service";
import { theme } from "MuiTheme";
import ManageContents from "./ManageContents/ManageContents";
import ContentService from "services/content.service";
import FileUpload from "components/common/File";
import {EButton} from "styled_components";
import VisibilityIcon from "@material-ui/icons/Visibility";
import Confirm from "components/common/Hooks/Confirm";
import { new_theme } from "NewMuiTheme";
import { ThemeProvider } from "@mui/material";
import StyledButton from "new_styled_components/Button/Button.styled";


const internshipInitialState={
    name:'',
    description:'',
    company: undefined,
    category: {},
    isActive: true,
    guideline:'',
    durationTime: 45,
}

export default function InternshipForm({editFormHelper, setEditFormHelper}){
    const {t} = useTranslation();
    const { isConfirmed } = Confirm();
    const {F_showToastMessage} = useMainContext();
    const [companies, setCompanies] = useState([]);
    const [internship, setInternship] = useState(internshipInitialState);
    const [categories, setCategories] = useState([]);
    const [errorValidator, setErrorValidator]= useState({});
    const [manageContentHelper,setManageContentHelper] = useState({isOpen: false, contentType: 'PUBLIC'});
    const [pdfFile, setPdfFile] = useState(null);

    useEffect(() => {
        CourseService.getCategoryRefsFromModule().then((res) => {
            if(res.status === 200 && res.data){
                setCategories(res.data);
            }
        }).catch(err=>console.log(err));

        InternshipService.readAllCompanies().then(res=>{
            if(res.status === 200 && res.data){
                setCompanies(res.data);
            }
        }).catch(error=>console.log(error));
    }, []);


    useEffect(()=>{
        setErrorValidator({});
        if(editFormHelper.isOpen && editFormHelper.internshipId !== 'NEW'){
            InternshipService.read(editFormHelper.internshipId).then(res=>{
                if(res.status === 200 && res.data){
                    setInternship(res.data);
                    if(res.data?.guidelineFile){
                        ContentService.getFileDetails(res.data?.guidelineFile).then(res=>{
                            if(res.status===200){
                                setPdfFile(res.data)
                            }
                        })
                    }
                }
            })
        } else{
            setInternship(internshipInitialState);
        }
    },[editFormHelper.internshipId]);

    function save(){
        if(editFormHelper.openType === 'ADD' && editFormHelper.internshipId === 'NEW'){
            InternshipService.add(internship).then(res=>{
                F_showToastMessage(t(res.data.message),"success");
                setEditFormHelper({isOpen: false, openType: undefined, internshipId: undefined});
            }).catch(err=>{
                console.log(err)
                setErrorValidator(err.response.data.message.errors);
            })
        }
        else{
            InternshipService.update(internship).then(res=>{
                F_showToastMessage(t(res.data.message),"success");
                setEditFormHelper({isOpen: false, openType: undefined, internshipId: undefined});
            }).catch(err=>{
                console.log(err)
                setErrorValidator(err.response.data.message.errors);
            })
        }
    }

    async function remove(){
        let confirm = await isConfirmed("Are you sure you want to delete this internship?");
        if(!confirm) return;
        InternshipService.remove(editFormHelper.internshipId).then(res=>{
            F_showToastMessage(t(res.data.message),"success");
            setEditFormHelper({isOpen: false, openType: undefined, internshipId: undefined});
        }).catch(err=>console.log(err))
    }

    const updateAssignments=(type,payload)=>{
        if(type==='ADD'){
            setInternship(p=>({...p, content: payload}));
        }else if(type==='REMOVE'){
            setInternship(p=>({...p, content: null}));
        }
    }


    const getFormType=(type)=>{
        switch(type){
            case 'ADD': return t('Add');
            case 'EDIT': return t('Edit');
            default: return t('Preview');
        }
    };

    const categoriesList = categories?.length>0 ? categories.map((item) => (<MenuItem key={item._id} value={item._id}>{item.name}</MenuItem>)):[];
    const companiesList = companies.length>0 ? companies.map((item) => (<MenuItem key={item._id} value={item}>{item.name}</MenuItem>)):[];

    const optionsBtn = [
        {id: 1, name: t("Public library"), action: ()=>{setManageContentHelper({isOpen:true, contentType: 'PUBLIC'})},},
        {id: 2, name: t("Private library"), action: ()=>{setManageContentHelper({isOpen:true, contentType: 'PRIVATE'})},},
        {id: 3, name: t("Co-created"), action: ()=>{setManageContentHelper({isOpen:true, contentType: 'CO_CREATED'})},}
    ];

    const updateFile = (_file) => {
       if(_file._id){
           setInternship(p=>({...p, guidelineFile: _file._id}));
           setPdfFile(_file);
       }
    }

    return(
        <Card  sx={{boxShadow:'none'}}>
            <CardHeader  title={(
                <>
                    <Typography variant="h1" component="h1" className="text-left" style={{color:new_theme.palette.primary.MedPurple}}>
                    { internship?.name || t("New internship")}
                    </Typography>
                    <Divider variant="insert" className='heading_divider' />
                </>
            )}
            />
            

            <CardContent>

                <Grid container >
                    <Grid item xs={12} sx={{mt:3}}>
                        <Typography variant="h2" component="h2" style={{ color: new_theme.palette.newSupplementary.NSupText }}>{t("General information")}</Typography>
                        <Divider variant="insert" sx={{ mb: 4, my: 2 }} />
                    </Grid>
                    <Grid  item xs={12} sm={6} md={4} className='d-flex justify-content-center px-1'>
                        <TextField label="Internship name"  
                                   fullWidth={true}
                                   margin="dense"
                                   name='name'
                                   variant="filled"
                                   InputLabelProps={{
                                       shrink: true,
                                   }}
                                   value={internship?.name}
                                   onChange={({target:{name,value}})=>{
                                       setInternship(p=>({...p,[name]: value}));
                                   }}
                        />
                    </Grid>
                    <Grid  item xs={12} sm={6} md={4}  className='d-flex justify-content-center px-1'>
                        <TextField label="Short description" margin="dense"
                                    
                                   fullWidth={true}
                                   name='description'
                                   variant='filled'
                                   multiline={true}
                                   maxRows={2}
                                   InputLabelProps={{
                                       shrink: true,
                                   }}
                                   value={internship?.description}
                                   onChange={({target:{name,value}})=>{
                                       setInternship(p=>({...p,[name]: value}));
                                   }}
                        />
                    </Grid>
                    <Grid  item xs={12} sm={6} md={4}  className='d-flex justify-content-center px-1'>
                        <FormControl   margin="dense" variant="filled" fullWidth={true}>
                            <InputLabel id="demo-simple-select-label">{t('Select category')}</InputLabel>
                            <Select
                                error={'category' in errorValidator}
                                labelId="demo-simple-select-label"
                                name='category'
                                id="demo-simple-select"
                                value={internship?.category}
                                onChange={({target:{name,value}})=>{
                                    setInternship(p=>({...p,[name]: value}));
                                }}
                            >
                                {categoriesList}
                            </Select>
                            {'category' in errorValidator ? (<FormHelperText className="text-danger">{t("required")}</FormHelperText>) : null}
                        </FormControl>
                    </Grid>
                    <Grid  item xs={12} sm={6} md={4}  className='d-flex justify-content-center px-1'>
                        <TextField label="Duration (hours)" margin="dense"
                                    
                                   fullWidth={true}
                                   variant='filled'
                                   name='durationTime'
                                   type="number"
                                   InputLabelProps={{
                                       shrink: true,
                                   }}
                                   value={internship?.durationTime}
                                   onChange={({target:{name, value}})=>{
                                       if(value >=0 && value <= 999){
                                           setInternship(p=>({...p,[name]: value}));
                                       }else{
                                           setInternship(p=>({...p,[name]: 0}));
                                       }
                                   }}
                        />
                    </Grid>
                    <Grid  item xs={12} sm={6} md={4}  className='d-flex justify-content-center px-1'>
                        <FormControl   margin="dense" variant="filled" fullWidth={true}>
                            <InputLabel id="demo-simple-select-label">{t('Choose location')}</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                name='company'
                                id="demo-simple-select"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                value={internship.company}
                                renderValue={p=>p?.name}
                                onChange={({target:{name,value}})=>{
                                    setInternship(p=>({...p,[name]: value}));
                                }}
                            >
                                <MenuItem key={"demo"} value={""}>{t('Online')}</MenuItem>
                                {companiesList}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid  item xs={12} sm={6} md={4}  className='d-flex justify-content-center px-1'>
                        <FormControl   margin="dense" variant="filled" fullWidth={true}>
                            <InputLabel id="demo-simple-select-label">{t("Status")}</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                name='isActive'
                                value={internship?.isActive ? 1 : 0}
                                onChange={({target:{name, value}})=>{
                                    setInternship(p=>({...p,[name]: !!value}));
                                }}
                            >
                                <MenuItem value={1}>{t("Active")}</MenuItem>
                                <MenuItem value={0}>{t("InActive")}</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    {internship?.company && (
                        <>
                            <Grid item xs={12} sx={{mt:3}}>
                                <Typography variant="h2" component="h2" style={{ color: new_theme.palette.newSupplementary.NSupText }}>{t("Location details")}</Typography>
                                <Divider variant="insert" sx={{ mb: 4, my: 2 }} />
                            </Grid>
                            <Grid  item xs={12} sm={6} md={4}  className='d-flex justify-content-center px-1'>
                                <TextField label="City"  
                                           fullWidth={true}
                                           margin="dense"
                                           variant="filled"
                                           InputProps={{
                                               readOnly: true,
                                               disableUnderline: true
                                           }}
                                           InputLabelProps={{
                                               shrink: true,
                                           }}
                                           value={internship?.company?.city||'-'}
                                />
                            </Grid>
                            <Grid  item xs={12} sm={6} md={4}  className='d-flex justify-content-center px-1'>
                                <TextField label="Post code"  
                                           fullWidth={true}
                                           margin="dense"
                                           variant="filled"
                                           InputProps={{
                                               readOnly: true,
                                               disableUnderline: true
                                           }}
                                           InputLabelProps={{
                                               shrink: true,
                                           }}
                                           value={internship?.company?.postcode||'-'}
                                />
                            </Grid>
                            <Grid  item xs={12} sm={6} md={4}  className='d-flex justify-content-center px-1'>
                                <TextField label="Street"  
                                           fullWidth={true}
                                           margin="dense"
                                           variant="filled"
                                           InputProps={{
                                               readOnly: true,
                                               disableUnderline: true
                                           }}
                                           InputLabelProps={{
                                               shrink: true,
                                           }}
                                           value={internship?.company?.street||'-'}
                                />
                            </Grid>
                            <Grid  item xs={12} sm={6} md={4}  className='d-flex justify-content-center px-1'>
                                <TextField label="Build nr/flat"  
                                           fullWidth={true}
                                           margin="dense"
                                           variant="filled"
                                           InputProps={{
                                               readOnly: true,
                                               disableUnderline: true
                                           }}
                                           InputLabelProps={{
                                               shrink: true,
                                           }}
                                           value={internship?.company?.buildNr||'-'}
                                />
                            </Grid>
                        </>
                    )}
                    <Grid item xs={12} sx={{mt:3}}>
                        <Typography variant="h2" component="h2" style={{ color: new_theme.palette.newSupplementary.NSupText }}>{t("Trainer guidelines")}</Typography>
                        <Divider variant="insert" sx={{ mb: 4, my: 2 }} />
                    </Grid>
                    <Grid item xs={12} >
                        <Grid container alignItems="center">
                            <Grid  item xs={12} sm={6} md={5} sx={{mt:2}}>
                                <FileUpload
                                     
                                    name={t("Upload PDF file")}
                                    acceptTypes='application/pdf'
                                    //CustomIcon={CustomIcon}
                                    value={internship?.guidelineFile}
                                    setValue={(_file) => updateFile(_file)}
                                    uploadFunction={ContentService.uploadFile}
                                    getFileDetailsFunction={ContentService.getFileDetails}
                                    removeFunction={()=>{
                                        setPdfFile(null);
                                        setInternship(p=>({...p, guidelineFile: null}))
                                    }}
                                />
                            </Grid>
                            <Grid  item xs={12} sm={6} md={2} textAlign="center">
                                <Typography variant="body4" >{t("or")}</Typography>
                            </Grid>
                            <Grid  item xs={12} sm={6} md={5} >
                                <TextField label="Guidelines" 
                                    fullWidth={true}
                                    margin="normal"
                                    name='guideline'
                                    variant="filled"
                                    multiline={true}
                                    maxRows={8}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    value={internship?.guideline}
                                    onChange={({target:{name,value}})=>{
                                        setInternship(p=>({...p,[name]: value}));
                                    }}
                                />
                            </Grid>
                            
                        </Grid>
                        
                    </Grid>
                    <Grid  item xs={12} >
                        {pdfFile && (
                            <StyledButton
                                eVariant='secondary'
                                eSize='medium'
                                //onClick={()=>{ContentService.downloadFile(pdfFile._id)}}
                                onClick={()=>{window.open(`api/v1/contents/files/download/${pdfFile._id}`)}}
                                startIcon={<VisibilityIcon/>}
                            >{t("Preview pdf")}</StyledButton>
                        )}
                    </Grid>
                    <Grid item xs={12} className="mt-3">
                    </Grid>
                    <Grid item xs={12} className='d-flex justify-content-center px-1'>
                        
                    </Grid>
                    {/* <Grid item xs={12} className="mt-3">
                        <small className="mt-3">{t("Assign content from library")}</small>
                        <Divider variant="insert" />
                    </Grid>
                    <Grid item xs={12} className='d-flex justify-content-center px-1'>
                        <Grid container className='mt-3'>
                            <Grid item xs={6}>
                                <OptionsButton
                                    btnName='Assign from'
                                    disabled={false}
                                    btns={optionsBtn}
                                />
                            </Grid>
                            <Grid item xs={6} className='d-flex justify-content-start align-items-center'>
                                {internship?.content?._id ? (
                                    <Chip color="primary" label={internship.content.title}
                                          disabled={false}
                                          onDelete={()=>updateAssignments('REMOVE')}/>
                                ) : (
                                    <small className="">{t("No assigned content, yet")}</small>
                                )}
                            </Grid>
                        </Grid> */}

                    {/* </Grid> */}
                </Grid>
            </CardContent>
            <CardActionArea>
                <CardActions >
                    <Grid container textAlign="end">
                        
                        <Grid item xs={12} className="btn-flex btn-grid-mb">
                            <StyledButton eVariant="secondary" size="small" onClick={() =>  {
                                F_showToastMessage("No change",)
                                setEditFormHelper({isOpen: false, openType: undefined, internshipId: undefined});
                            }}>
                                {t("Dismiss")}
                            </StyledButton>
                            {editFormHelper.openType === 'EDIT' && (
                                    <StyledButton eVariant="secondary" size="small" onClick={remove}>
                                        {t("Remove")}
                                    </StyledButton>
                                )
                            }
                            {editFormHelper.openType !== 'PREVIEW' &&(
                                <StyledButton size="small" eVariant="primary" 
                                        onClick={save}
                                >{t("Save")}</StyledButton>
                            )}
                        </Grid>
                    </Grid>
                </CardActions>
            </CardActionArea>
            <ManageContents
                manageContentHelper={manageContentHelper}
                setManageContentHelper={setManageContentHelper}
                chosenContent={internship?.content}
                updateAssignments={updateAssignments}
            />
        </Card>
    )
}