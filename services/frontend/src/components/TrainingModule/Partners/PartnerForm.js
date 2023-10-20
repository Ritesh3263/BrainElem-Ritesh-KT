import React, {useEffect, useState} from "react";
import {Card, CardHeader, Divider, Tooltip} from "@material-ui/core";
import CardContent from "@material-ui/core/CardContent";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import Grid from "@material-ui/core/Grid";
import {useNavigate} from "react-router-dom";
import { makeStyles} from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import CompanyService from "services/company.service"
import PartnerExaminersList from "../PartnersExaminers/PartnerExaminersList";
import ConfirmActionModal from "components/common/ConfirmActionModal"
import {useTranslation} from "react-i18next";
import Typography from "@material-ui/core/Typography";
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import { theme } from "MuiTheme";
import {EButton, ETab, ETabBar} from "styled_components";

const useStyles = makeStyles(theme=>({}))

export default function PartnerForm(props){
    const{
        formIsOpen,
        setFormIsOpen,
    }=props;
    const { t } = useTranslation();
    const {F_showToastMessage, F_handleSetShowLoader, F_getHelper} = useMainContext();
    const classes = useStyles();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState(0);
    const [addingNewEmployee,setAddingNewEmployee] = useState(false);
    const {user:{role}} = F_getHelper();
    const [isPartner, setIsPartner] = useState(role === "Partner");
    const [staffTooltip, setStaffTooltip] = useState(false);
    const [actionModal, setActionModal] = useState({isOpen: false, returnedValue: false});
    const [commercialSectors, setCommercialSectors] = useState([
        {
            _id: "o78fhgw7ed",
            name: "Sector 1"
        },
        {
            _id: "9peyfg9r",
            name: "Sector 2"
        }
    ]);

    const [partner, setPartner] = useState({
        isActive: true,
        name: "",
        email: "",
        commercialSector: "",
        phone: "",
        street: "",
        buildNr: "",
        city: "",
        postcode: "",
        country: "",
        description: "",

    });

    useEffect(()=>{
        F_handleSetShowLoader(true)
        if (isPartner) setActiveTab(1)
        if(formIsOpen.partnerId !== "" && formIsOpen.partnerId !== "new"){
            setStaffTooltip(false);
            CompanyService.read(formIsOpen.partnerId).then(res=>{
                setPartner(p=>
                    ({...p,
                        _id: res.data._id,
                        createdAt: res.data.createdAt,
                        updatedAt: res.data.updatedAt,
                        isActive: res.data.isActive,
                        name: res.data?.name??"",
                        email: res.data?.email??"",
                        commercialSector: res.data?.commercialSector??"",
                        phone: res.data?.phone??"",
                        street: res.data?.street??"",
                        buildNr: res.data?.buildNr??"",
                        city: res.data?.city??"",
                        postcode: res.data?.postcode??"",
                        country: res.data?.country??"",
                        description: res.data?.description??"",
                    })
                );
            })
            F_handleSetShowLoader(false)
        } else if(formIsOpen.partnerId === "new"){
            setStaffTooltip(true);
            setPartner({
                isActive: true,
                name: "",
                email: "",
                commercialSector: "",
                phone: "",
                street: "",
                buildNr: "",
                city: "",
                postcode: "",
                country: "",
                description: "",
            });
            F_handleSetShowLoader(false);
        }

    },[formIsOpen.partnerId]);

    useEffect(()=>{
        if(actionModal.returnedValue){
            remove();
        }else{
            //setActionModal({isOpen: false, returnedValue: false});
        }
    },[actionModal.returnedValue])

    function save(){
        setStaffTooltip(false);
        setAddingNewEmployee(false);
        if(formIsOpen.partnerId === "new"){
            console.log("save");
            CompanyService.add(partner).then(res=>{
                //console.log(res.data);
                setFormIsOpen({isOpen: false, isNew: false, partnerId: undefined});
            }).catch(error=>console.log(error))
        }else{
            console.log("update");
            CompanyService.update(partner).then(res=>{
                //console.log(res.data);
                setFormIsOpen({isOpen: false, isNew: false, partnerId: undefined});
            }).catch(error=>console.log(error))
        }
    }

    function remove(){
        setActionModal({isOpen: false, returnedValue: false});
            setStaffTooltip(false);
            setFormIsOpen({isOpen: false, isNew: false, partnerId: "new"});
            setAddingNewEmployee(false);
            console.log("remove");
            CompanyService.remove(partner).then(res=>{
                //console.log(res.data);
            }).catch(error=>console.log(error))
    }


    // const commercialSectorsList = commercialSectors.map((item, index)=><MenuItem key={item._id} value={item._id}>{item.name}</MenuItem>);

    return(
        <Card className="p-0 d-flex flex-column m-0">
            {/*<CardHeader title={` ${formIsOpen.isNew ? `${t("Create")}: ` : `${t("Edit")}: `} ${partner.name}`}/>*/}
            <CardHeader title={(
                <Typography variant="h3" component="h5" className="text-left" style={{fontSize:"32px", color:theme.palette.primary.lightViolet}}>
                    {` ${partner?.name || t("Partner name")}`}
                </Typography>
            )} 
            // avatar={<Chip label={formIsOpen.isNew ? t("Add"):t("Edit")} color="primary" />}
            />
            <CardContent>

            <ETabBar className="d-flex flex-fill justify-content-center"
                    style={{maxWidth:'400px'}}
                    eSize='small'
                    value={activeTab}
                    onChange={(e,i)=>setActiveTab(i)}
                >
                    <ETab label='General information'style={{minWidth:'50px'}}   eSize='small'/>
                    <Tooltip title="Staff member will be available, only after saving the partner, and entering the edit form" open={staffTooltip}>
                    <ETab label='Company Users' style={{minWidth:'50px'}} disabled={formIsOpen.partnerId === "new" || formIsOpen.partnerId === ""}  eSize='small'/>
                    </Tooltip>
            </ETabBar>
                <Grid container>
                    <Grid item xs={12}>
                        {activeTab === 0 && (
                            <>
                                <Grid container spacing={1}>
                                    <Grid item xs={12} className='mt-3'>
                                        <small  style={{ color:theme.palette.primary.darkViolet}}>{t("About the company")}</small>
                                        <Divider variant="insert" />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField label={t("Company name")} style={{ maxWidth:"400px"}} margin="dense"
                                                   fullWidth={true}
                                                   variant="filled"
                                                   required={true}
                                                   disabled={isPartner}
                                                   InputLabelProps={{
                                                       shrink: true,
                                                   }}
                                                   value={partner.name}
                                                   onChange={(e)=>
                                                       setPartner(p=>({...p,name: e.target.value}))
                                                   }
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField label={t("Short description")} style={{maxWidth:"400px"}} margin="dense"
                                                   variant="filled"
                                                   fullWidth={true}
                                                   multiline={true}
                                                   disabled={isPartner}
                                                   InputLabelProps={{
                                                       shrink: true,
                                                   }}
                                                   value={partner.description}
                                                   onChange={(e)=>
                                                       setPartner(p=>({...p,description: e.target.value}))
                                                   }
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        {/* <FormControl style={{maxWidth:"400px"}} margin="dense" fullWidth={true}>
                                        <InputLabel id="demo-simple-select-label">Commercial sector</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={partner.commercialSector}
                                            // renderValue={p=> p.name}
                                            input={<Input/>}
                                            onChange={(e)=>
                                                setPartner(p=>({...p,commercialSector: e.target.value}))
                                            }
                                        >
                                            {commercialSectorsList}
                                        </Select>
                                    </FormControl> */}
                                    </Grid>
                                    <Grid item xs={12} className='mt-3'>
                                        <small  style={{ color:theme.palette.primary.darkViolet}}>{t("Contact information")}</small>
                                        <Divider variant="insert" />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField label={t("E-mail")} style={{ maxWidth:"400px"}} margin="dense"
                                                   variant="filled"
                                                   fullWidth={true}
                                                   disabled={isPartner}
                                                   InputLabelProps={{
                                                       shrink: true,
                                                   }}
                                                   value={partner.email}
                                                   onChange={(e)=>
                                                       setPartner(p=>({...p,email: e.target.value}))
                                                   }
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField label={t("Phone")} style={{ maxWidth:"400px"}} margin="dense"
                                                   fullWidth={true}
                                                   disabled={isPartner}
                                                   variant="filled"
                                                   InputLabelProps={{
                                                       shrink: true,
                                                   }}
                                                   value={partner.phone}
                                                   onChange={(e)=>
                                                       setPartner(p=>({...p,phone: e.target.value}))
                                                   }
                                        />
                                    </Grid>
                                    <Grid item xs={12} className='mt-3'>
                                        <small  style={{ color:theme.palette.primary.darkViolet}}>{t("Contact address")}</small>
                                        <Divider variant="insert" />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField label={t("Street")} style={{ maxWidth:"400px"}} margin="dense"
                                                   fullWidth={true}
                                                   variant="filled"
                                                   disabled={isPartner}
                                                   InputLabelProps={{
                                                       shrink: true,
                                                   }}
                                                   value={partner.street}
                                                   onChange={(e)=>
                                                       setPartner(p=>({...p,street: e.target.value}))
                                                   }
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField label={t("Build nr / flat")} style={{ maxWidth:"400px"}} margin="dense"
                                                   fullWidth={true}
                                                   variant="filled"
                                                   disabled={isPartner}
                                                   InputLabelProps={{
                                                       shrink: true,
                                                   }}
                                                   value={partner.buildNr}
                                                   onChange={(e)=>
                                                       setPartner(p=>({...p,buildNr: e.target.value}))
                                                   }
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField label={t("City")} style={{ maxWidth:"400px"}} margin="dense"
                                                   fullWidth={true}
                                                   variant="filled"
                                                   disabled={isPartner}
                                                   InputLabelProps={{
                                                       shrink: true,
                                                   }}
                                                   value={partner.city}
                                                   onChange={(e)=>
                                                       setPartner(p=>({...p,city: e.target.value}))
                                                   }
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField label={t("Postcode")} style={{ maxWidth:"400px"}} margin="dense"
                                                   fullWidth={true}
                                                   variant="filled"
                                                   disabled={isPartner}
                                                   InputLabelProps={{
                                                       shrink: true,
                                                   }}
                                                   value={partner.postcode}
                                                   onChange={(e)=>
                                                       setPartner(p=>({...p,postcode: e.target.value}))
                                                   }
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField label={t("Country")} style={{ maxWidth:"400px"}} margin="dense"
                                                   fullWidth={true}
                                                   variant="filled"
                                                   disabled={isPartner}
                                                   InputLabelProps={{
                                                       shrink: true,
                                                   }}
                                                   value={partner.country}
                                                   onChange={(e)=>
                                                       setPartner(p=>({...p,country: e.target.value}))
                                                   }
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <FormControl style={{maxWidth:'400px'}} margin="dense" variant="filled" fullWidth={true}>
                                            <InputLabel id="demo-simple-select-label">{t("Status")}</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                disabled={isPartner}
                                                value={partner.isActive}
                                                // renderValue={p=> p.name}
                                                //input={<Input/>}
                                                onChange={(e)=>
                                                    setPartner(p=>({...p,isActive: e.target.value}))
                                                }
                                            >
                                                <MenuItem value="true">{t("Active")}</MenuItem>
                                                <MenuItem value="false">{t("InActive")}</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            </>
                        )}
                        {activeTab === 1 && (
                            <div className="mt-4">
                                <PartnerExaminersList partnerId={formIsOpen.partnerId} formIsOpen={formIsOpen}/>
                            </div>
                        )}
                    </Grid>
                </Grid>
            </CardContent>
            <CardActionArea>
                <CardActions className="d-flex justify-content-between align-items-center mb-2" >
                    <Grid container>
                        <Grid item xs={6}>
                            <EButton eVariant="secondary" eSize="small"
                                    onClick={() =>  {
                                F_showToastMessage("No change",);
                                setAddingNewEmployee(false);
                                setStaffTooltip(false);
                                setFormIsOpen({isOpen: false, isNew: false, partnerId: "new"});
                            }}>
                                {t("Dismiss")}
                            </EButton>
                        </Grid>
                        <Grid item xs={6} className="p-0 d-flex justify-content-end">
                            
                            {
                                // !formIsOpen.isNew && (
                                //     <Button classes={{root: classes.root}} variant="contained" size="small" color="inherit"
                                //             onClick={()=>setActionModal({isOpen: true, returnedValue: false})}>
                                //         {t("Remove partner")}
                                //     </Button>
                                // )
                            }
                            {activeTab === 0 && !isPartner && (
                            <EButton eSize="small" eVariant="primary"
                                    onClick={save}
                            >{t("Save partner")}</EButton>
                            )}
                        </Grid>
                    </Grid>
                </CardActions>
            </CardActionArea>
            <ConfirmActionModal actionModal={actionModal}
                                setActionModal={setActionModal}
                                actionModalTitle={t("Removing Partner")}
                                actionModalMessage={t("Are you sure you want to remove your partner? The action is not reversible!")}
            />
        </Card>
    )
}