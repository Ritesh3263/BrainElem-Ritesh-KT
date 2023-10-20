import React, {useEffect, useState} from "react";
import {Card,CardHeader,Divider} from "@material-ui/core";
import CardContent from "@material-ui/core/CardContent";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import {useNavigate} from "react-router-dom";
import { makeStyles} from "@material-ui/core/styles";
import CertificateService from "../../../../services/certificate.service"
import TextField from "@material-ui/core/TextField";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import TraineesList from "./Evaluation/TraineesList";
import {useTranslation} from "react-i18next";
import {useMainContext} from "../../../_ContextProviders/MainDataContextProvider/MainDataProvider";
import Confirm from "components/common/Hooks/Confirm";

const useStyles = makeStyles(theme=>({}))

export default function CertificationForm({formIsOpen, setFormIsOpen}){
    const { t } = useTranslation();
    const { isConfirmed } = Confirm();
    const {F_showToastMessage} = useMainContext();
    const classes = useStyles();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState(0);
    const [EQFLevels, setEQFLevels] = useState([]);

    const [certificate, setCertificate] = useState({
        name: "",
        EQFLevel:"",
        expires: "",
        template: "",
        description: "",

        additionalCompetences: [{_id:"",name:""}],
        assignedCompetenceBlocks: [{_id:"",name:""}],
    });

    useEffect(()=>{

        if(formIsOpen.certificateId !== ""){
            CertificateService.readCertification(formIsOpen.certificateId).then(res=>{
                setEQFLevels(res.data?.certificate?.EQFLevels);
                setCertificate(p=>
                    ({...p,
                        _id: res.data._id ?? "",
                        name: res.data.name ?? "",
                        EQFLevel: res.data.EQFLevel ?? "",
                        expires: res.data.expires ? new Date (res.data.expires).toISOString() : "",
                        template: res.data.template ?? "",
                        description: res.data.description ?? "",

                        additionalCompetences: res.data.additionalCompetences ?? [],
                        assignedCompetenceBlocks: res.data.assignedCompetenceBlocks ?? [],
                    })
                );
            })
        } else{
            setCertificate({
                name: "",
                EQFLevel:"",
                expires: "",
                template: "",
                description: "",

                additionalCompetences: [],
                assignedCompetenceBlocks: [],
            });
        }
    },[formIsOpen]);



    function save(){
        setFormIsOpen({isOpen: false, isNew: false, certificateId: ""});
        // refresh list and table
    }

    async function remove(){
        let confrim = await isConfirmed("Are you sure you want to delete this certification?");
        if(confrim) setFormIsOpen({isOpen: false, isNew: false, certificateId: ""});
    }


    return(
        <Card className="p-0 d-flex flex-column m-0">
            <CardHeader name={` ${certificate.name}`}/>
            <CardContent>
                <ButtonGroup size="small" color="primary" aria-label="large outlined primary button group" className="d-flex flex-fill justify-content-center">
                    <Button  size="small" variant="contained" color={activeTab === 0 ? "primary" : "secondary"}
                             className="Nav-btn"
                            style={{width: "50%", maxWidth: '400px'}}
                            onClick={()=>{setActiveTab(0)}}
                    >{t("Overview")}</Button>
                    {/* <Button  size="small" variant="contained" color={activeTab === 1 ? "primary" : "secondary"}
                             className="Nav-btn"
                            style={{width: "50%", maxWidth: '400px'}}
                            onClick={()=>{setActiveTab(1)}}
                    >{t("Course trainees")}</Button> */}
                </ButtonGroup>
                <Grid container spacing={1}>
                    <Grid item xs={12} className='d-flex flex-column'>
                        {activeTab === 0 && (
                            <>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} lg={6} className='d-flex flex-column'>
                                        <hr/>
                                        <small>{t("General information")}</small>
                                        <Divider variant="insert" />
                                        <TextField label={t("Certification name")} style={{ width:"50%"}} margin="normal"
                                                   InputLabelProps={{
                                                       shrink: true,
                                                   }}
                                                   InputProps={{
                                                       readOnly: true,
                                                       disableUnderline: true
                                                   }}
                                                   value={certificate.name}
                                        />
                                        <TextField label={t("Blocks")} style={{ width:"50%"}} margin="normal"
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                InputProps={{
                                                    readOnly: true,
                                                }}
                                                multiline={true}
                                                value={certificate.assignedCompetenceBlocks?.map((t,index)=>(index+1+". "+t.title)).join('\n\n') ?? null}
                                        />
                                        <TextField label={t("Assesment Criteria")} style={{ width:"50%"}} margin="normal"
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                InputProps={{
                                                    readOnly: true,
                                                }}
                                                multiline={true}
                                                value={certificate.assignedCompetenceBlocks?.map((t,index)=>(index+1+". "+t.assesmentCriteria?.name)).join('\n\n') ?? null}
                                        />
                                        <TextField label={t("Assesment Method")} style={{ width:"50%"}} margin="normal"
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                InputProps={{
                                                    readOnly: true,
                                                }}
                                                multiline={true}
                                                value={certificate.assignedCompetenceBlocks?.map((t,index)=>(index+1+". "+t.assesmentMethod?.name)).join('\n\n') ?? null}
                                        />
                                        <TextField label={t("Description")} style={{ width:"50%"}} margin="normal"
                                                   multiline={true}
                                                   InputLabelProps={{
                                                       shrink: true,
                                                   }}
                                                   InputProps={{
                                                       readOnly: true,
                                                       disableUnderline: true
                                                   }}
                                                   value={certificate.description}
                                        />
                                        {/*<hr/>*/}
                                        {/*<small>{t("Linked course")}</small>*/}
                                        {/*<Divider variant="insert" />*/}
                                    </Grid>
                                    <Grid item xs={12} className='d-flex flex-column'>
                                        {/*<SessionProvider>*/}
                                        {/*<SessionsList disableAdd={true} inCertificate={formIsOpen.certificateId} />*/}
                                        {/*</SessionProvider>*/}
                                    </Grid>
                                </Grid>

                            </>
                        )}

                        {activeTab === 1 && (
                            <>
                                {/* <hr/>
                                <small>{t("Course trainees")}</small>
                                <Divider variant="insert" />
                                <TraineesList formIsOpen={formIsOpen} setFormIsOpen={setFormIsOpen}/> */}
                            </>
                        )}
                    </Grid>
                </Grid>
            </CardContent>
            <CardActionArea>
                <CardActions className="d-flex justify-content-between align-items-center" >
                    <Grid container>
                        <Grid item xs={6}>
                            <Button variant="contained" size="small" color="secondary" onClick={() =>  {
                                F_showToastMessage("No change",)
                                setFormIsOpen({isOpen: false, isNew: false, certificateId: ""});
                            }}>
                                {t("Dismiss")}
                            </Button>
                        </Grid>
                        <Grid item xs={6} className="p-0 d-flex justify-content-end">
                            {!formIsOpen.isNew && (
                                <Button variant="contained" size="small" color="inherit" onClick={remove}>
                                    {t("Remove")}
                                </Button>
                            )}
                            <Button size="small" variant="contained" color="primary"
                                    onClick={save} className="ml-5"
                            >{t("Save")}</Button>
                        </Grid>
                    </Grid>
                </CardActions>
            </CardActionArea>
        </Card>
    )
}