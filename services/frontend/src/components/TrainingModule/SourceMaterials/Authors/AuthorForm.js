import React, {useEffect, useState} from "react";
import {Card, CardHeader} from "@material-ui/core";
import CardContent from "@material-ui/core/CardContent";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { makeStyles} from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import {useTranslation} from "react-i18next";
import Typography from "@material-ui/core/Typography";
import SourceMaterialService from "services/source_material.service";
import ConfirmActionModal from "components/common/ConfirmActionModal";
import { theme } from "MuiTheme";
import {EButton} from "../../../../styled_components";
import Confirm from "components/common/Hooks/Confirm";


const useStyles = makeStyles(theme=>({}));

const initialAuthorState ={
    name:'',
    lastname:''
};

export default function AuthorForm(props){
    const{
        editFormHelper,
        setEditFormHelper,
        tooltip3,
        tooltip4,
    }=props;
    const {t} = useTranslation();
    const { isConfirmed } = Confirm();
    const classes = useStyles();
    const {F_showToastMessage, F_handleSetShowLoader} = useMainContext();

    const [actionModal, setActionModal] = useState({isOpen: false, returnedValue: false, removeId: undefined});
    const [author, setAuthor] = useState(initialAuthorState);
    const [categories, setCategories] = useState([]);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        setErrors({});
        F_handleSetShowLoader(true);
        if(editFormHelper.isOpen && editFormHelper?.authorId){
            if(editFormHelper.authorId === 'NEW'){
                setAuthor(initialAuthorState)
            }else{
                SourceMaterialService.readBookAuthor(editFormHelper.authorId).then(res=>{
                    if(res.status === 200 && res.data){
                        setAuthor(p=>({...p,...res.data}));
                        F_handleSetShowLoader(false);
                    }
                }).catch(error=>console.log(error));
            };
        }
    }, [editFormHelper.isOpen, editFormHelper.authorId]);


    useEffect(()=>{
        if(actionModal.returnedValue){
            remove(actionModal.removeId);
        }
    },[actionModal.returnedValue]);


    function save(){
        if(editFormHelper.openType === 'ADD' && editFormHelper.authorId === 'NEW'){
            SourceMaterialService.addBookAuthor(author).then(res=>{
                F_showToastMessage(t(res.data.message),"success");
                setEditFormHelper({isOpen: false, openType: undefined, authorId: undefined});
            }).catch(err=>{
                setErrors(err?.response?.data?.errors)
            });
        }
        else{
            SourceMaterialService.updateBookAuthor(author).then(res=>{
                F_showToastMessage(t(res.data.message),"success");
                setEditFormHelper({isOpen: false, openType: undefined, authorId: undefined});
            }).catch(err=>{
                setErrors(err?.response?.data?.errors)
            });
        }
    };

    function remove(){
        SourceMaterialService.removeBookAuthor(author?._id).then(res=>{
            F_showToastMessage(t(res.data.message),"success");
            setEditFormHelper({isOpen: false, openType: undefined, authorId: undefined});
        }).catch(err=>console.log(err))
    }

    const sampleDataHandler=()=>{
        setAuthor(p=>({...p, name: 'Sample author name', lastname: 'Surname'}));
    }

    return(
        <Card className="p-0 d-flex flex-column m-0">
            <CardHeader className='pb-0' title={(
                <Typography variant="h3" component="h5" className="text-left" style={{fontSize:"32px", color:theme.palette.primary.lightViolet}}>
                { author?.name ? `${author.name} ${author?.lastname}` : t("Author name")}
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
                        <TextField label="Name" style={{maxWidth:'400px'}}
                                   InputProps={{
                                       readOnly: editFormHelper.openType === 'PREVIEW'
                                   }}
                                   required
                                   fullWidth={true}
                                   margin="normal"
                                   inputRef={tooltip3}
                                   name='name'
                                   variant="filled"
                                   InputLabelProps={{
                                       shrink: true,
                                   }}
                                   error={errors?.name}
                                   helperText={errors?.name && errors?.name?.message}
                                   value={author.name}
                                   onClick={({target:{isOnBoarding=false}})=>{
                                       if (isOnBoarding) sampleDataHandler();
                                   }}
                                   onChange={({target:{name,value}})=>{
                                       setAuthor(p=>({...p,[name]: value}));
                                   }}
                        />
                    </Grid>
                    <Grid item xs={12} md={6} className='d-flex justify-content-center px-1'>
                        <TextField label="Surname" style={{maxWidth:'400px'}}
                                   InputProps={{
                                       readOnly: editFormHelper.openType === 'PREVIEW'
                                   }}
                                   required
                                   fullWidth={true}
                                   error={errors?.lastname}
                                   helperText={errors?.lastname && errors?.lastname?.message}
                                   margin="normal"
                                   name='lastname'
                                   variant="filled"
                                   InputLabelProps={{
                                       shrink: true,
                                   }}
                                   value={author.lastname}
                                   onChange={({target:{name,value}})=>{
                                       setAuthor(p=>({...p,[name]: value}));
                                   }}
                        />
                    </Grid>
                </Grid>
            </CardContent>
            <CardActionArea>
                <CardActions className="d-flex justify-content-between align-items-center" >
                    <Grid container>
                        <Grid item xs={6}>
                            <Button variant="contained" size="small" color="secondary" onClick={() =>  {
                                F_showToastMessage("No change",)
                                setEditFormHelper({isOpen: false, openType: undefined, authorId: undefined});
                            }}>
                                {t("Dismiss")}
                            </Button>
                        </Grid>
                        <Grid item xs={6} className="p-0 d-flex justify-content-end">
                            <EButton eVariant='primary' style={{display:'none'}}
                                onClick={sampleDataHandler}
                            >
                                Sample form data
                            </EButton>
                            {editFormHelper.openType === 'EDIT' && (
                                <Button variant="contained" size="small" color="inherit"
                                        onClick={async () => {
                                            let confirm = await isConfirmed(t("Are you sure you want to remove this author? The action is not reversible!"),{promptHeader: t("Removing author")});
                                            if (confirm) setActionModal({isOpen: true, returnedValue: false, removeId: author._id})
                                        }}
                                >
                                    {t("Remove")}
                                </Button>
                            )}
                            {editFormHelper.openType !== 'PREVIEW' &&(
                                <Button size="small" variant="contained" color="primary"
                                        ref={tooltip4}
                                        onClick={save} className="ml-5"
                                >{t("Save")}</Button>
                            )}
                        </Grid>
                    </Grid>
                </CardActions>
            </CardActionArea>
            <ConfirmActionModal actionModal={actionModal}
                                setActionModal={setActionModal}
                                actionModalTitle={t("Removing author")}
                                actionModalMessage={t("Are you sure you want to remove this author? The action is not reversible!")}
            />
        </Card>
    )
}