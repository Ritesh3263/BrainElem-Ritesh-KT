import React, {useEffect, useState} from "react";
import {Card, CardHeader, Typography, Slider} from "@material-ui/core";
import CardContent from "@material-ui/core/CardContent";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import {useNavigate} from "react-router-dom";
import { makeStyles} from "@material-ui/core/styles";
import {now} from "moment";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import Input from "@material-ui/core/Input";
import MenuItem from "@material-ui/core/MenuItem";
import CertificateService from "../../../../../../services/certificate.service";
import {useMainContext} from "../../../../../_ContextProviders/MainDataContextProvider/MainDataProvider";
import {useTranslation} from "react-i18next";

const useStyles = makeStyles(theme=>({}));

const marks = [
    {
        value: 0,
        label: '',
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

export default function EvaluationForm({studentFormHelper, setStudentFormHelper, sessionId, detail, setDetail}){
    const { t } = useTranslation();
    const classes = useStyles();
    const {F_showToastMessage, F_getHelper} = useMainContext();
    const {user} = F_getHelper();
    const [trainee, setTrainee] = useState({
        username: "",
        email: "",
        name: "",
        surname: "",
        createdAt: "",
        isCertificated: "",
        additionalComment: "",
    });
    // const [detail, setDetail] = useState(null)
    const [certificate, setCertificate] = useState(null);

    useEffect(()=>{
        studentFormHelper?.studentId && CertificateService.readTraineeInSession(studentFormHelper.studentId, sessionId).then(res=>{
            let currentCert = res.data.certificates.find(x=>x.certificationSession._id === sessionId);
            setCertificate(currentCert?.certificationSession.certificate);
            let currentDetail = currentCert?.details.find(y=>y.examiner === user.id)||{}
            setDetail(currentDetail)
            setTrainee(res.data);
        }).catch(error=>console.log(error))
    },[studentFormHelper]);



    function save(){
        trainee?._id && CertificateService.updateTraineeDetailInSession(trainee._id, sessionId, detail).then(res=>{
            if(res.status === 200){
                F_showToastMessage(res.data.message, "success");
            }
        })
        setStudentFormHelper({isOpen: false, type: 'PREVIEW', groupIndex: undefined, studentId: undefined});
    }
    return(
        <Card className="p-0 d-flex flex-column m-0 flex-grow-1">
            <CardHeader title={` ${trainee.name} ${trainee.surname}`}/>
            <CardContent>
                <Grid container spacing={1}>
                    <Grid item xs={12} className='d-flex flex-column'>
                        {certificate?.assignedCompetenceBlocks?.map((cb, index)=>(
                            <Card className={"p-3 d-flex flex-column"+(index?" mt-3":"")} >
                                <Typography variant="h6" id={`discrete-slider-block-${index}`} gutterBottom>
                                    {cb.title}
                                </Typography>
                                {cb.competences.map((c,i)=>(
                                    <div className={i&&"mt-3"} >
                                        <Typography variant="caption" id={`discrete-slider-${i}`} gutterBottom>
                                            {c.title}
                                            {/* name to be loaded after population */}
                                        </Typography>
                                        <Slider
                                            defaultValue={0}
                                            value={((detail?.competenceBlocks?.find(x=>[x.block._id,x.block].includes(cb._id)))?.competences?.find(y=>[y.competence._id,y.competence].includes(c._id)))?.grade??'0'}
                                            aria-labelledby={`discrete-slider-${i}`}
                                            valueLabelDisplay="auto"
                                            step={1}
                                            marks={marks}
                                            min={0}
                                            max={6}
                                            onChange={(e,newVal)=>{
                                                setDetail(p=>{
                                                    let val = Object.assign({},p||{});
                                                    let block = val.competenceBlocks?.find(x=>[x.block._id,x.block].includes(cb._id))
                                                    if(block){
                                                        var comp = block.competences?.find(x=>[x.competence._id,x.competence].includes(c._id));
                                                        if(comp){
                                                            val.competenceBlocks = val.competenceBlocks.map(x=>{
                                                                if([x.block._id,x.block].includes(cb._id)){
                                                                    x.competences = x.competences.map(y=>{
                                                                        if([y.competence._id,y.competence].includes(c._id)){
                                                                            y.grade = newVal;
                                                                        }
                                                                        return y;
                                                                    })
                                                                }
                                                                return x;
                                                            })
                                                        }else{
                                                            if (block.competences) {
                                                                block.competences.push({
                                                                    competence: c._id,
                                                                    grade: newVal
                                                                })
                                                            } else {
                                                                block.competences = [{
                                                                    competence: c._id,
                                                                    grade: newVal
                                                                }]
                                                            }
                                                        }
                                                    } else {
                                                        if (val.competenceBlocks) {
                                                            val.competenceBlocks.push({
                                                                block: cb._id,
                                                                competences: [{
                                                                    competence: c._id,
                                                                    grade: newVal
                                                                }]
                                                            })
                                                        } else {
                                                            val.competenceBlocks = [{
                                                                block: cb._id,
                                                                competences: [{
                                                                    competence: c._id,
                                                                    grade: newVal
                                                                }]
                                                            }]
                                                        }
                                                    }
                                                    return val;
                                                })
                                            }}
                                        />
                                    </div>
                                ))}
                            </Card>
                        ))}
                        {certificate?.externalCompetences?.length>0 &&
                            <Card className={"p-3 d-flex flex-column mt-3"} >
                                <Typography variant="h6" color="primary" id={`discrete-slider-block-external`} gutterBottom>
                                    {"External Competences"}
                                </Typography>
                                {certificate.externalCompetences.map((ec,j)=>(
                                    <div className={j&&"mt-3"} >
                                        <Typography variant="caption" id={`discrete-slider-e${j}`} gutterBottom>
                                            {ec.title}
                                            {/* name to be loaded after population */}
                                        </Typography>
                                        <Slider
                                            defaultValue={0}
                                            value={detail?.externalCompetences?.find(x=>[x.competence._id,x.competence].includes(ec._id))?.grade??'0'}
                                            aria-labelledby={`discrete-slider-e${j}`}
                                            valueLabelDisplay="auto"
                                            step={1}
                                            marks={marks}
                                            min={0}
                                            max={6}
                                            onChange={(e,newVal)=>{
                                                setDetail(p=>{
                                                    let val = Object.assign({},p||{});
                                                    let comp = val.externalCompetences?.find(x=>[x.competence._id,x.competence].includes(ec._id));
                                                    if(comp){
                                                        val.externalCompetences = val.externalCompetences.map(x=>{
                                                            if([x.competence._id,x.competence].includes(ec._id)){
                                                                x.grade = newVal;
                                                            }
                                                            return x;
                                                        })
                                                    }else{
                                                        if(val.externalCompetences){
                                                            val.externalCompetences.push({
                                                                competence: ec._id,
                                                                grade: newVal
                                                            })
                                                        }else{
                                                            val.externalCompetences = [{
                                                                competence: ec._id,
                                                                grade: newVal
                                                            }]
                                                        }
                                                    }
                                                    return val;
                                                })
                                            }}
                                        />
                                    </div>
                                ))}
                            </Card>
                        }
                        <TextField label="Additional comment" style={{ width:"50%"}} margin="normal"
                                   InputLabelProps={{
                                       shrink: true,
                                   }}
                                   value={detail?.comment??''}
                                   onChange={(e)=>
                                       setDetail(p=>({...p, comment: e.target.value}))
                                   }
                        />
                        {/* Trainers no more certify */}
                        {/* <FormControl style={{width:"50%"}} margin="normal">
                            <InputLabel id="demo-simple-select-label">Certificated</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={detail?.status}
                                disabled={detail?.status}
                                // renderValue={p=> p.name}
                                input={<Input/>}
                                onChange={(e)=>
                                    setDetail(p=>({...p, status: e.target.value}))
                                    // setTrainee(p=>({...p,isCertificated: e.target.value}))
                                }
                            >
                                <MenuItem value={true}>TRUE</MenuItem>
                                <MenuItem value={false}>FALSE</MenuItem>
                            </Select>
                        </FormControl> */}
                    </Grid>
                </Grid>
            </CardContent>
            <CardActionArea>
                <CardActions className="d-flex justify-content-between align-items-center" >
                    <Grid container>
                        <Grid item xs={6}>
                            <Button variant="contained" size="small" color="secondary" onClick={() =>  {
                                F_showToastMessage("No change",)
                                setStudentFormHelper({isOpen: false, type: 'PREVIEW', groupIndex: undefined, studentId: undefined});
                            }}>
                                {t("Dismiss")}
                            </Button>
                        </Grid>
                        <Grid item xs={6} className="p-0 d-flex justify-content-end">
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