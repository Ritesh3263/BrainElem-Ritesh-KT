import React, {useEffect, useState} from "react";
import {Card, CardHeader} from "@material-ui/core";
import CardContent from "@material-ui/core/CardContent";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { makeStyles} from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Chip from "@material-ui/core/Chip";
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import {useTranslation} from "react-i18next";
import Typography from "@material-ui/core/Typography";
import CourseService from "services/course.service";
import SourceMaterialService from "services/source_material.service";
import ConfirmActionModal from "components/common/ConfirmActionModal";
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import {Paper} from "@material-ui/core";
import ManageAuthors from "./ManageAuthors/ManageAuthors";
import { theme } from "MuiTheme";
import {EButton} from "../../../styled_components";
import FormHelperText from "@material-ui/core/FormHelperText";
import Confirm from "components/common/Hooks/Confirm";

const useStyles = makeStyles(theme=>({}));

const internshipSourceMaterialState={
    name:'',
    ISBN: '',
    authors:[],
    publishers:[],
    year: '',
    category: null,
    level: 'BEGINNER',
    status: true,
};

const manageDrawerTypes = {
    'AUTHOR':'AUTHOR',
    'PUBLISHER':'PUBLISHER',
}

export default function SourceMaterialsForm(props){
    const{
        editFormHelper,
        setEditFormHelper,
        tooltip8,
        tooltip9,
        tooltip10,
        tooltip11,
        tooltip12,
    }=props;
    const {t} = useTranslation();
    const { isConfirmed } = Confirm();
    const classes = useStyles();
    const {F_showToastMessage, F_handleSetShowLoader} = useMainContext();

    const [actionModal, setActionModal] = useState({isOpen: false, returnedValue: false, removeId: undefined});
    const [manageAuthorsDrawerHelper, setManageAuthorsDrawerHelper] = useState({isOpen: false, openType: manageDrawerTypes.AUTHOR});
    const [sourceMaterial, setSourceMaterial] = useState(internshipSourceMaterialState);
    const [categories, setCategories] = useState([]);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        setErrors({});
        F_handleSetShowLoader(true);
        if(editFormHelper.isOpen && editFormHelper?.sourceMaterialId){

            CourseService.getCategoryRefs().then((res) => {
                if(res.status === 200 && res.data){
                    setCategories(res.data);
                    F_handleSetShowLoader(false);
                }
            }).catch(err=>console.log(err));


            if(editFormHelper.sourceMaterialId === 'NEW'){
                setSourceMaterial(internshipSourceMaterialState);
            }else{
                SourceMaterialService.read(editFormHelper.sourceMaterialId).then(res=>{
                    if(res.status === 200 && res.data){
                        setSourceMaterial(p=>({...p,...res.data}));
                        F_handleSetShowLoader(false);
                    }
                }).catch(error=>console.log(error));
            };
        }
    }, [editFormHelper.isOpen, editFormHelper.sourceMaterialId]);

    useEffect(()=>{
        if(actionModal.returnedValue){
            remove(actionModal.removeId);
        }
    },[actionModal.returnedValue]);


    function save(){
        if(editFormHelper.openType === 'ADD' && editFormHelper.sourceMaterialId === 'NEW'){
            SourceMaterialService.add(sourceMaterial).then(res=>{
                F_showToastMessage(t(res.data.message),"success");
                setEditFormHelper({isOpen: false, openType: undefined, sourceMaterialId: undefined});
            }).catch(err=>{
                setErrors(err?.response?.data?.errors)
            });
        }
        else{
            SourceMaterialService.update(sourceMaterial).then(res=>{
                F_showToastMessage(t(res.data.message),"success");
                setEditFormHelper({isOpen: false, openType: undefined, sourceMaterialId: undefined});
            }).catch(err=>{
                setErrors(err?.response?.data?.errors)
            });
        }
    };

    function remove(){
        SourceMaterialService.remove(sourceMaterial?._id).then(res=>{
            F_showToastMessage(t(res.data.message),"success");
            setEditFormHelper({isOpen: false, openType: undefined, sourceMaterialId: undefined});
        }).catch(err=>console.log(err))
    }



    const handleManageAssignedItems=(itemType, actionType, item)=>{
        switch (itemType) {
            case manageDrawerTypes.AUTHOR: {
                if(actionType === 'ADD'){
                    setSourceMaterial(p=>({...p, authors: [...p.authors,item]}));
                }else if(actionType === 'REMOVE'){
                    setSourceMaterial(p=>({...p, authors: p.authors.filter(a => a._id !== item._id)}));
                }
                break;
            }
            case manageDrawerTypes.PUBLISHER: {
                if(actionType === 'ADD'){
                    setSourceMaterial(p=>({...p, publishers: [...p.publishers,item]}));
                }else if(actionType === 'REMOVE'){
                    setSourceMaterial(p=>({...p, publishers: p.publishers.filter(a => a._id !== item._id)}));
                }
                break;
            }
            default: break;
        }
    };

    const sampleDataHandler=()=>{
        setSourceMaterial(p=>({
            ...p,
            name: 'New source name',
            ISBN: 'ISBN-123456789',
            year: 2020,
            category: categories?.length>0 ? categories[0]._id : null,
            authors: [],
            publishers: [],
        }))
    }

    const categoriesList = categories?.length>0 ? categories.map((item) => (<MenuItem key={item._id} value={item._id}>{item.name}</MenuItem>)):[];


    return(
        <Card className="p-0 d-flex flex-column m-0">
            <CardHeader className='pb-0' title={(
                <Typography variant="h3" component="h5" className="text-left" style={{fontSize:"32px", color:theme.palette.primary.lightViolet}}>
                { sourceMaterial?.name || t("New book")}
                </Typography>
            )} 
            // avatar={<Chip label={getFormType(editFormHelper.openType)} color="primary" />}
            />
            <CardContent>
                <Grid container>
                    <Grid item xs={12}>
                        <small style={{color: `rgba(82, 57, 112, 1)`}} className="mt-3">{t("General information")}</small>
                    </Grid>
                    <Grid item xs={12} md={6} className='d-flex justify-content-center px-1'>
                        <TextField label="Source name" style={{maxWidth:'400px'}}
                                   InputProps={{
                                       readOnly: editFormHelper.openType === 'PREVIEW'
                                   }}
                                   error={errors?.name}
                                   helperText={errors?.name && errors?.name?.message}
                                   inputRef={tooltip8}
                                   fullWidth={true}
                                   required={true}
                                   margin="normal"
                                   name='name'
                                   variant="filled"
                                   InputLabelProps={{
                                       shrink: true,
                                   }}
                                   onClick={({target:{isOnBoarding=false}})=>{
                                       if (isOnBoarding) sampleDataHandler();
                                   }}
                                   value={sourceMaterial.name}
                                   onChange={({target:{name,value}})=>{
                                       setSourceMaterial(p=>({...p,[name]: value}));
                                   }}
                        />
                    </Grid>
                    <Grid item xs={12} md={6} className='d-flex justify-content-center px-1'>
                        <TextField label="ISBN" style={{maxWidth:'400px'}}
                                   InputProps={{
                                       readOnly: editFormHelper.openType === 'PREVIEW'
                                   }}
                                   fullWidth={true}
                                   margin="normal"
                                   name='ISBN'
                                   variant="filled"
                                   InputLabelProps={{
                                       shrink: true,
                                   }}
                                   value={sourceMaterial.ISBN}
                                   onChange={({target:{name,value}})=>{
                                       setSourceMaterial(p=>({...p,[name]: value}));
                                   }}
                        />
                    </Grid>

                    <Grid item xs={12} md={6} className='d-flex justify-content-center px-1'>
                        <TextField label="Year" style={{maxWidth:'400px'}}
                                   InputProps={{
                                       readOnly: editFormHelper.openType === 'PREVIEW'
                                   }}
                                   type="number"
                                   fullWidth={true}
                                   margin="normal"
                                   name='year'
                                   variant="filled"
                                   InputLabelProps={{
                                       shrink: true,
                                   }}
                                   value={sourceMaterial.year}
                                   onChange={({target:{name,value}})=>{
                                       if(value !== ""){
                                           if(Number(value)>0 && Number(value)<2999){
                                               setSourceMaterial(p=>({...p,[name]: value}));
                                           }
                                       }
                                   }}
                        />
                    </Grid>

                    <Grid item xs={12} md={6} className='d-flex justify-content-center px-1'>
                        <FormControl style={{maxWidth:'400px'}} margin="normal" variant="filled" fullWidth={true} required error={errors?.category}>
                            <InputLabel id="demo-simple-select-label" shrink>{t('Select category')}</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                readOnly={editFormHelper.openType === 'PREVIEW'}
                                name='category'
                                id="demo-simple-select"
                                value={sourceMaterial.category}
                                onChange={({target:{name,value}})=>{
                                    setSourceMaterial(p=>({...p,[name]: value}));
                                }}
                            >
                                {categoriesList}
                            </Select>
                            <FormHelperText error={errors?.category} className="text-center">{errors?.category && 'Category is required'}</FormHelperText>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} md={6} className='d-flex justify-content-center px-1'>
                        <FormControl style={{maxWidth:'400px'}} margin="normal" variant="filled" fullWidth={true} >
                            <InputLabel id="demo-simple-select-label">{t('Level')}</InputLabel>
                            <Select
                                readOnly={editFormHelper.openType === 'PREVIEW'}
                                labelId="demo-simple-select-label"
                                name='level'
                                id="demo-simple-select"
                                value={sourceMaterial.level}
                                onChange={({target:{name,value}})=>{
                                    setSourceMaterial(p=>({...p,[name]: value}));
                                }}
                            >
                                <MenuItem value={'BEGINNER'}>{t("Beginner")}</MenuItem>
                                <MenuItem value={'INTERMEDIATE'}>{t("Intermediate")}</MenuItem>
                                <MenuItem value={'ADVANCED'}>{t("Advanced")}</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} md={6} className='d-flex justify-content-center px-1'>
                        <FormControl style={{maxWidth:'400px'}} margin="normal" variant="filled" fullWidth={true}>
                            <InputLabel id="demo-simple-select-label">{t("Status")}</InputLabel>
                            <Select
                                inputProps={{
                                    className: `${sourceMaterial?.status ? 'text-success' : 'text-danger'}`
                                }}
                                readOnly={editFormHelper.openType === 'PREVIEW'}
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                name='status'
                                value={sourceMaterial?.status ? 1 : 0}
                                onChange={({target:{name, value}})=>{
                                    setSourceMaterial(p=>({...p,[name]: !!value}));
                                }}
                            >
                                <MenuItem value={1} className="text-success">{t("Active")}</MenuItem>
                                <MenuItem value={0} className="text-danger">{t("InActive")}</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>


                    <Grid item xs={12} className="mt-3">
                        <small style={{color: `rgba(82, 57, 112, 1)`}} className="mt-3">{`${t("Authors")} / ${t("Publishers")}`}</small>
                    </Grid>
                    <Grid item xs={6} className='d-flex justify-content-start align-items-start px-1 mt-3'>
                        <Grid container>
                            <Grid item xs={12}>
                                <EButton eSize="small" eVariant="contained"
                                        disabled={editFormHelper.openType === 'PREVIEW'}
                                         cptRef={tooltip9}
                                        startIcon={<ManageAccountsIcon/>}
                                        onClick={()=>{setManageAuthorsDrawerHelper({isOpen: true, openType: manageDrawerTypes.AUTHOR})}}
                                >{t("Manage authors")}</EButton>
                            </Grid>
                            <Grid item xs={12} className="mt-3">
                                <Paper elevation={12} style={{borderRadius: '8px'}} className='d-flex flex-column align-items-start p-2'>
                                    {sourceMaterial?.authors?.length>0 ? sourceMaterial.authors.map(item=>(
                                        <Chip key={item._id} label={`${item?.name} ${item?.lastname}`} className='m-1'
                                              style={{backgroundColor:'rgba(82, 57, 112, 1)', color: 'rgba(255,255,255,0.9)'}}
                                              disabled={editFormHelper.openType === 'PREVIEW'}
                                              onDelete={()=>{handleManageAssignedItems(manageDrawerTypes.AUTHOR,'REMOVE',item)}}
                                        />
                                    )) : <p>{t('No data')}</p>}
                                </Paper>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} md={6} className='d-flex justify-content-start align-items-start px-1 mt-3'>
                        <Grid container>
                            <Grid item xs={12}>
                                <EButton eSize="small" eVariant="contained"
                                        disabled={editFormHelper.openType === 'PREVIEW'}
                                        startIcon={<ManageAccountsIcon/>}
                                         cptRef={tooltip11}
                                        onClick={()=>{setManageAuthorsDrawerHelper({isOpen: true, openType: manageDrawerTypes.PUBLISHER})}}
                                >{t("Manage publishers")}</EButton>
                            </Grid>
                            <Grid item xs={12} className="mt-3">
                                <Paper elevation={12} style={{borderRadius: '8px'}} className='d-flex flex-column align-items-start p-2'>
                                    {sourceMaterial?.publishers?.length>0 ? sourceMaterial.publishers.map(item=>(
                                        <Chip key={item._id} label={`${item?.name} ${item?.lastname}`} className='m-1'
                                              style={{backgroundColor:'rgba(82, 57, 112, 1)', color: 'rgba(255,255,255,0.9)'}}
                                              disabled={editFormHelper.openType === 'PREVIEW'}
                                              onDelete={()=>{handleManageAssignedItems(manageDrawerTypes.PUBLISHER,'REMOVE',item)}}
                                        />
                                    )) : <p>{t('No data')}</p>}
                                </Paper>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </CardContent>
            <CardActionArea>
                <CardActions className="d-flex justify-content-between align-items-center" >
                    <Grid container>
                        <Grid item xs={6}>
                            <Button variant="contained" size="small" color="secondary" onClick={() =>  {
                                F_showToastMessage("No change",)
                                setEditFormHelper({isOpen: false, openType: undefined, internshipId: undefined});
                            }}>
                                {t("Dismiss")}
                            </Button>
                        </Grid>
                        <Grid item xs={6} className="p-0 d-flex justify-content-end">
                            {editFormHelper.openType === 'EDIT' && (
                                <Button variant="contained" size="small" color="inherit"
                                        onClick={async () => {
                                            let confirm = await isConfirmed("Are you sure you want to remove this source material?", {promptHeader: "Remove source material"})
                                            if (confirm) {
                                                setActionModal({isOpen: true, returnedValue: false, removeId: sourceMaterial._id})
                                            } else {
                                                F_showToastMessage("No change",)
                                            }
                                        }}
                                >
                                    {t("Remove")}
                                </Button>
                            )}
                            {editFormHelper.openType !== 'PREVIEW' &&(
                                <Button size="small" variant="contained" color="primary"
                                        ref={tooltip12}
                                        onClick={save} className="ml-5"
                                >{t("Save")}</Button>
                            )}
                        </Grid>
                    </Grid>
                </CardActions>
            </CardActionArea>
            <ManageAuthors manageAuthorsDrawerHelper={manageAuthorsDrawerHelper}
                           setManageAuthorsDrawerHelper={setManageAuthorsDrawerHelper}
                           manageDrawerTypes={manageDrawerTypes}
                           sourceMaterial={sourceMaterial}
                           tooltip10={tooltip10}
                           tooltip11={tooltip11}
                           handleManageAssignedItems={handleManageAssignedItems}
            />
            <ConfirmActionModal actionModal={actionModal}
                                setActionModal={setActionModal}
                                actionModalTitle={t("Removing book")}
                                actionModalMessage={t("Are you sure you want to remove this book? The action is not reversible!")}
            />
        </Card>
    )
}