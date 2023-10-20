import { useEffect, useState } from 'react'
import { Typography, Grid, Divider, Paper, Box } from '@mui/material'
import {useTranslation} from "react-i18next";
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import ESwitchWithTooltip from "styled_components/SwitchWithTooltip";
import { EButton } from "styled_components";
import UserService from "services/user.service";

const AwaitingApprovalList = () => {
    const { t } = useTranslation();

    const { setMyCurrentRoute, F_showToastMessage, F_getHelper, F_handleSetShowLoader, F_showToastMessageMui } = useMainContext();
    setMyCurrentRoute("Approve Verifications")
    const [certificationsByUsers, setCertificationsByUsers] = useState([])

    useEffect(()=>{
      UserService.getUsersCertifications().then((res)=>{
          setCertificationsByUsers(res.data)
      })
    },[])

    const changeCertification = (userId, certId, check) => {
      UserService.approveVerification(certId, check)
      .then((res)=>{
        setCertificationsByUsers(prev=>{
          let newCertificationsByUsers = Object.assign([], prev)
          let userIndex = newCertificationsByUsers.findIndex(x=>x._id===userId)
          let certIndex = newCertificationsByUsers[userIndex].certificates.findIndex(x=>x._id===certId)
          newCertificationsByUsers[userIndex].certificates[certIndex].moduleManagerAproval = check
          return newCertificationsByUsers
        })
      })
      .catch((err)=>{
          console.log(err);
      })
    }

    const approveAll = () => {
        UserService.approveAll(certificationsByUsers.map(_=>_._id)).then((res)=>{
            F_showToastMessage(res.data.message, "success")
        })
    }

    let awaitingList = certificationsByUsers.flatMap(u=>{
      return u.certificates.map((cert,index)=>(
        <Paper key={index} sx={{p:2, m:1}} elevation={3}>
            <Box item xs={12} key={index}>
                <ESwitchWithTooltip
                    checked={cert.moduleManagerAproval}
                    onChange={(e,check)=>{
                        changeCertification(u._id, cert._id, check)
                    }}
                    style={{fontWeight: "bold"}}
                    // disabled={cert.moduleManagerAprovalDate}
                    name={`${u.name} ${u.surname}`}
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
    })

  return (
    <Grid container>
        <Grid item xs={12}>
            <Typography variant="h6" style={{fontWeight: "bold"}}>{t("Awaiting items for approval")}</Typography>
        </Grid>
        <Grid item xs={12}>
            <Divider />
        </Grid>
        <Grid item xs={12}>
            {awaitingList}
        </Grid>
        <Grid item xs={12}>
            <Divider />
        </Grid>
        <Grid item xs={12} className="pt-2" >
            <EButton eVariant="primary" disabled={awaitingList.length===0} onClick={approveAll}>{awaitingList.length>0? t("Approve all"):t("No item is awaiting")}</EButton>
        </Grid>
    </Grid>
  )
}

export default AwaitingApprovalList