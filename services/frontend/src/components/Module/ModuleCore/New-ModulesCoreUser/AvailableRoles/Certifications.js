import React, {useEffect, useState} from "react";
import Grid from "@mui/material/Grid";
import { Divider } from "@mui/material";
import { useTranslation } from "react-i18next";
import Typography from "@mui/material/Typography";
import ESwitchWithTooltip from "styled_components/SwitchWithTooltip";
import { Box, Paper } from "@mui/material";
import UserServices from "services/user.service";

export default function Certifications({editFormHelper, setEditFormHelper, currentUser, setCurrentUser}){
    const { t } = useTranslation();
    const [certifications, setCertifications] = useState(currentUser.certificates);

    const changeCertification = (certId,check) => {
        UserServices.approveVerification(certId, check)
        .then((res)=>{
            setEditFormHelper(p=>({...p, isBlocking: true}));
            setCurrentUser((prev) => {
                let val = Object.assign({},prev);
                val.certificates = val.certificates.map(cert=>{
                    if(cert._id===certId) {
                        cert.moduleManagerAproval = check
                    }
                    return cert
                })
                setCertifications(val.certificates)
                return val
            })
            console.log(res);
        })
        .catch((err)=>{
            console.log(err);
        })
    }

    const certificationList = certifications.map((cert,index)=>(
        <Paper key={index} sx={{p:2, m:1}} elevation={3}>
            <Box item xs={12} key={index}>
                <ESwitchWithTooltip
                    checked={cert.moduleManagerAproval}
                    onChange={(e,check)=>{
                        changeCertification(cert._id,check)
                    }}
                    style={{fontWeight: "bold"}}
                    // disabled={cert.moduleManagerAprovalDate}
                    name={`Certification ${index+1}`}
                    id={cert._id}
                    description={cert.additionalComment}
                    ></ESwitchWithTooltip>
                <div>
                    <Typography variant="body1" style={{fontSize: "12px", display:"inline-block", marginLeft:"10px"}}>{`Verification date: ${new Date(cert.verificationDate)}`}</Typography>
                </div>
                <div>
                    <Typography variant="body1" style={{fontSize: "12px", display:"inline-block", marginLeft:"10px"}}>{`Blockchain status: ${cert.blockchainStatus? cert.blockchainNetworkId: 'none'}`}</Typography>
                </div>
                <div>
                    <Typography variant="body1" style={{fontSize: "12px", display:"inline-block", marginLeft:"10px"}}>{`Internship status: ${cert.internshipStatus? 'Completed': 'none'}`}</Typography>
                </div>
                <div>
                    <Typography variant="body1" style={{fontSize: "12px", display:"inline-block", marginLeft:"10px"}}>{`Module manager approval: ${cert.moduleManagerAproval? 'Approved': 'Pending'}`}</Typography>
                </div>
                {cert.moduleManagerAprovalDate && <Typography variant="body1" style={{fontSize: "12px", display:"inline-block", marginLeft:"10px"}}>{`Module manager approval date: ${cert.moduleManagerAprovalDate}`}</Typography>}
            </Box>
        </Paper>
    ));


    return(
        <Grid container>
            <Grid item xs={12} className='mt-1'>
                <small style={{color: `rgba(82, 57, 112, 1)`}} className='mt-3'>{t("Verify certifications")}</small>
                <Divider variant="insert" />
            </Grid>
            <Grid item xs={12} className='mt-4'>
                <Grid container>
                    <Grid item xs={12} md={6}>
                            {certificationList}
                    </Grid>
                </Grid>
            </Grid>
           
        </Grid>
    )
}