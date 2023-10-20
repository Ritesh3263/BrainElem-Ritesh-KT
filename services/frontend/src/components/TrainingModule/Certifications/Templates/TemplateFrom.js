import React, {useEffect, useState} from "react";
import {Card, CardHeader} from "@material-ui/core";
import CardContent from "@material-ui/core/CardContent";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import {useNavigate} from "react-router-dom";
import { makeStyles} from "@material-ui/core/styles";
import CertificateService from "../../../../services/certificate.service"
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import Input from "@material-ui/core/Input";
import MenuItem from "@material-ui/core/MenuItem";
import {useTranslation} from "react-i18next";
import ConfirmActionModal from "../../../common/ConfirmActionModal";
import Typography from "@material-ui/core/Typography";
import Chip from "@material-ui/core/Chip";
import {useMainContext} from "../../../_ContextProviders/MainDataContextProvider/MainDataProvider";

const useStyles = makeStyles(theme=>({}))

export default function TemplateFrom({formIsOpen, setFormIsOpen}){
    const { t, i18n, translationsLoaded } = useTranslation();
    const {F_showToastMessage} = useMainContext();
    const [actionModal, setActionModal] = useState({isOpen: false, returnedValue: false});
    const classes = useStyles();
    const navigate = useNavigate();
    const [categories, setCategories] = useState([
        {
            _id: "o78fhgw7ed",
            name: "Category 1"
        },
        {
            _id: "9peyfg9r",
            name: "Category 2"
        }
    ])
    const [template, setTemplate] = useState({
        level: "",
        title: "",
        category: "",
        formatTemplate:"",
        templateFile: "",
    });

    useEffect(()=>{
        if(actionModal.returnedValue){
            remove();
        }
    },[actionModal.returnedValue]);

    useEffect(()=>{
        if(formIsOpen.templateId !== ""){
            CertificateService.readTemplate(formIsOpen.templateId).then(res=>{
                setTemplate(p=>
                    ({...p,
                        level: res.data.level ? res.data.level : "",
                        title: res.data.title ? res.data.title : "",
                        category: res.data.category ? res.data.category : "",
                        formatTemplate: res.data.formatTemplate ? res.data.formatTemplate : "",
                        templateFile: res.data.templateFile ? res.data.templateFile : "",
                    })
                );
            })
        } else{
            setTemplate({
                level: "",
                title: "",
                category: "",
                formatTemplate:"",
                templateFile: "",
            })
        }
    },[formIsOpen])

    function save(){
        if(!formIsOpen.isNew){
            console.log("save-update");
            setFormIsOpen({isOpen: false, isNew: false, templateId: ""});
            // CertificateService.uploadTemplate(template).then(res=>{
            //
            // })
            F_showToastMessage(t("Data was updated"),"success");
        }else{
            console.log("save-add");
            setFormIsOpen({isOpen: false, isNew: false, templateId: ""});
            // CertificateService.uploadTemplate(template).then(res=>{
            //
            // })
            F_showToastMessage(t("Data was created"),"success");
        }

    }

    function remove(){
        console.log("remove");
        setFormIsOpen({isOpen: false, isNew: false, templateId: ""});
        // CertificateService.remove(templateId).then(res=>{
        //
        // })
        F_showToastMessage(t("Data was removed"),"success");
    }


    const categoriesList = categories.map((item, index)=><MenuItem key={item._id} value={item.name}>{item.name}</MenuItem>)

    return(
        <Card className="p-0 d-flex flex-column m-0">
            {/*<CardHeader title={` ${template.title}`}/>*/}
            <CardHeader title={(
                <Typography variant="h5" component="h2" className="text-left" style={{color: `rgba(82, 57, 112, 1)`}}>
                    {` ${template?.title || t("Templete name")}`}
                </Typography>
            )} avatar={<Chip label={formIsOpen.isNew ? t("Add"):t("Edit")} color="primary" />}
            />
            <CardContent>
                <Grid container spacing={1}>
                    <Grid item xs={12} className='d-flex flex-column'>
                        <TextField label={t("Template title")} style={{ width:"50%"}} margin="normal"
                                   variant="filled"
                                   InputLabelProps={{
                                       shrink: true,
                                   }}
                                   value={template.title}
                                   onChange={(e)=>
                                       setTemplate(p=>({...p,title: e.target.value}))
                                   }
                        />
                        <FormControl style={{width:"50%"}} margin="normal" variant="filled">
                            <InputLabel id="demo-simple-select-label">{t("Category")}</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={template.category}
                                // renderValue={p=> p.name}
                                //input={<Input/>}
                                onChange={(e)=>
                                    setTemplate(p=>({...p,category: e.target.value}))
                                }
                            >
                                {categoriesList}
                            </Select>
                        </FormControl>
                        <TextField label={t("Format HTML template")} style={{ width:"100%"}} margin="normal"
                                   variant="filled"
                                   InputLabelProps={{
                                       shrink: true,
                                   }}
                                   multiline={true}
                                   value={template.formatTemplate}
                                   onChange={(e)=>
                                       setTemplate(p=>({...p,formatTemplate: e.target.value}))
                                   }
                        />
                        <small className="mt-3">{t("or")}</small>
                        <TextField label={t("Template file")} style={{ width:"50%"}} margin="normal"
                                   variant="filled"
                                   InputLabelProps={{
                                       shrink: true,
                                   }}
                                   value={template.title}
                                   onChange={(e)=>
                                       setTemplate(p=>({...p,templateFile: e.target.value}))
                                   }
                        />
                    </Grid>
                </Grid>
            </CardContent>
            <CardActionArea>
                <CardActions className="d-flex justify-content-between align-items-center" >
                    <Grid container>
                        <Grid item xs={6}>
                            <Button classes={{root: classes.root}} variant="contained" size="small" color="secondary" onClick={() =>  {
                                F_showToastMessage(t("No change"),)
                                setFormIsOpen({isOpen: false, isNew: false, templateId: ""});
                            }}>
                                {t("Dismiss")}
                            </Button>
                        </Grid>
                        <Grid item xs={6} className="p-0 d-flex justify-content-end">
                            {
                                !formIsOpen.isNew && (
                                    <Button classes={{root: classes.root}} variant="contained" size="small" color="inherit"
                                            onClick={()=>setActionModal({isOpen: true, returnedValue: false})}>
                                        {t("Remove")}
                                    </Button>
                                )
                            }
                            <Button classes={{root: classes.root}} size="small" variant="contained" color="primary"
                                    onClick={save} className="ml-5"
                            >{t("Save")}</Button>
                        </Grid>
                    </Grid>
                </CardActions>
            </CardActionArea>
            <ConfirmActionModal actionModal={actionModal}
                                setActionModal={setActionModal}
                                actionModalTitle={t("Removing template")}
                                actionModalMessage={t("Are you sure you want to remove template? The action is not reversible!")}
            />
        </Card>
    )
}