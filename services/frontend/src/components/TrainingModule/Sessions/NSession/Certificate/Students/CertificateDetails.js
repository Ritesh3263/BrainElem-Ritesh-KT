import React, {useEffect, useState} from "react";
import Grid from "@material-ui/core/Grid";
import {Divider, Button} from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import {useTranslation} from "react-i18next";
import CertificateService from "../../../../../../services/certificate.service";


export default function CertificateDetails({certificateId}){
    const { t } = useTranslation();
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

        if(certificateId !== ""){
            CertificateService.readCertification(certificateId).then(res=>{
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
    },[certificateId]);
    return(
        <Grid container >
            <Grid item xs={12} className='p-2 d-flex flex-column'>
                <hr/>
                <small>{t("General information")}</small>
                <Divider variant="insert" />
                <TextField label={t("Certification name")} margin="normal"
                           InputLabelProps={{
                               shrink: true,
                           }}
                           InputProps={{
                               readOnly: true,
                               disableUnderline: true
                           }}
                           value={certificate.name}
                />
                <TextField label={t("Blocks")} margin="normal"
                           InputLabelProps={{
                               shrink: true,
                           }}
                           InputProps={{
                               readOnly: true,
                           }}
                           multiline={true}
                           value={certificate.assignedCompetenceBlocks?.map((t,index)=>(index+1+". "+t.title)).join('\n\n') ?? null}
                />
                <TextField label={t("Assesment Criteria")} margin="normal"
                           InputLabelProps={{
                               shrink: true,
                           }}
                           InputProps={{
                               readOnly: true,
                           }}
                           multiline={true}
                           value={certificate.assignedCompetenceBlocks?.map((t,index)=>(index+1+". "+t.assesmentCriteria?.name)).join('\n\n') ?? null}
                />
                <TextField label={t("Assesment Method")} margin="normal"
                           InputLabelProps={{
                               shrink: true,
                           }}
                           InputProps={{
                               readOnly: true,
                           }}
                           multiline={true}
                           value={certificate.assignedCompetenceBlocks?.map((t,index)=>(index+1+". "+t.assesmentMethod?.name)).join('\n\n') ?? null}
                />
                <TextField label={t("Description")} margin="normal"
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
            <Grid item xs={6} className="d-flex justify-content-end">
                <Button variant="contained" size="small" color="primary"
                    onClick={()=>{
                        // TODO: open modal with the list of trainers and the ability to certify students by teachers
                    }}>
                    {t("Certify")}
                </Button>
            </Grid>
        </Grid>
    )
}