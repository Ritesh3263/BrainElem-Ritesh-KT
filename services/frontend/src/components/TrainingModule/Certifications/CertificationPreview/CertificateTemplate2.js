import React, {useEffect, useRef} from "react";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import { makeStyles} from "@material-ui/core/styles";
import SaveAltIcon from "@material-ui/icons/SaveAlt";
import {Divider, Paper} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import {useReactToPrint} from "react-to-print";
import {useTranslation} from "react-i18next";
import {useMainContext} from "../../../_ContextProviders/MainDataContextProvider/MainDataProvider";
import certBorder from "../../../../img/certificate/Background.svg";

const useStyles = makeStyles({
    root:{
        maxWidth:"780px", 
        maxHeight: '640px',
        marginLeft:"auto",
        marginRight:"auto"
    },
    card:{
        transform:"scale(0.4) translate(-65%, -65%)", 
        maxHeight:'470px'
    },
    certificateHeader:{
        marginTop:"35px",
        color: `rgba(168, 92, 255, 1)`,
        fontFamily: "Didot",
        fontWeight: 400,
        fontStyle: "normal",
        fontSize: "144px",
        letterSpacing:"5px",
    },
    certificateTitle:{
        color: `rgba(48, 56, 56, 1)`,
        fontFamily: "Didot",
        fontWeight: "normal",
        fontStyle: "normal",
        fontSize: "32px",
        marginTop:"50px",
    },
    certificateFooter:{
        color: `rgba(82, 57, 112, 1)`,
        fontFamily: "Didot",
        fontWeight: 400,
        fontStyle: "normal",
        fontSize: "24px",
    },
    certificateName:{
        color: `rgba(21, 163, 165, 1)`,
        fontFamily: "Didot",
        fontWeight: 400,
        fontStyle: "normal",
        fontSize: "32px",
        lineHeight:"54px"
    },
    nameOfTrainee:{
        color: `rgba(42, 41, 69, 1)`,
        fontFamily: "Snell Roundhand",
        fontWeight: 400,
        fontStyle: "italic",
        fontSize: "54px",
    },
    Completed:{
        color: `rgba(90, 89, 117, 1)`,
        fontFamily: "Snell Roundhand",
        fontWeight: 400,
        fontStyle: "italic",
        fontSize: "48px",
    },
    Completed2:{
        marginLeft:"auto",
        marginRight:"auto"
    },
    courseName:{
     
        fontFamily: "Snell Roundhand",
        fontWeight: 400,
        fontStyle: "italic",
        fontSize: "48px",
    },
    logo:{
        width: "200px",
        height: "200px",
        marginBottom:"35px",
        marginTop:"20px",
        marginLeft:"250px"
    },
    footer:{
        width: "250px"
    },
    signature:{
        fontFamily:"'AlexBrush', cursive", 
        fontSize:"33px",
        letterSpacing:"1px",
        whiteSpace: 'nowrap'
    },
    print:{      
        background:"white"  
    }, 
    divider:{
        backgroundColor: "black"
    },
    certBorder:{
        
        backgroundImage: `url(${certBorder})`,
        backgroundRepeat:"no-repeat",
        backgroundSize:"cover",
        height:"1096px",
        width:"1542px",
        minWidth:"100%",
    }
});

const pageStyle = `
  @page {
    size: auto;
    margin: 5mm;
    size: landscape;
  }
`;

export default function CertificatePreviewModal({isOpenPreviewModal, setIsOpenPreviewModal, certificate, getVerificationBlock, directDownload, setDirectDownload}){
    const {F_getHelper} = useMainContext();
    const {user} = F_getHelper();
    const componentRef = useRef();
    const classes = useStyles();
    const { t, i18n, translationsLoaded } = useTranslation();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        removeAfterPrint: false,
        onBeforeGetContent: async () => {
            // F_handleSetShowLoader(true)
        },
        onAfterPrint: () => {
            // This is not working when using using custom `print` function
            setIsOpenPreviewModal(false)
            setDirectDownload(false)
        },
        
    });

    useEffect(()=>{
        if (directDownload){handlePrint()}

    },[directDownload])


    return(
        <Dialog className={classes.root} 
            open={isOpenPreviewModal}
            style={{display:  (directDownload ? "none" : "")}}
            onClose={()=>setIsOpenPreviewModal(false)}
            maxWidth={'false'}
            
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogContent>
                <div className={classes.card}>
                    <div ref={componentRef} className={classes.certBorder}>
                    <Grid container spacing={1}>
                        <div
                            className={`align-items-center justify-content-center mt-5 ${classes.Completed2}`}>
                            <img src="/img/certificate/shortFrame U.svg" width={"350px"}  />
                         </div>
                        <Grid item xs={12} className="d-flex align-items-center justify-content-center ">
                            <Typography variant="h1" className={classes.certificateTitle}>{certificate.trainingCenterName}</Typography>
                        </Grid>
                        <Grid item xs={12} className="d-flex align-items-center justify-content-center  ">
                            <Typography variant="h1" className={classes.certificateHeader}>{t("Certificate")}</Typography>
                        </Grid>

                        <Grid item xs={12} className="d-flex align-items-center justify-content-center mb-1">
                            <Typography variant="h1" className={classes.certificateName}>{certificate.name}</Typography>
                        </Grid>

                        <Grid item xs={12} className="d-flex align-items-center justify-content-center mb-1">
                            <Typography variant="h4" className={classes.nameOfTrainee}>{`${user?.name??"Name"} ${user?.surname??"Surname"}`}</Typography>
                        </Grid>

                        <Grid item xs={12} className="d-flex flex-column align-items-center justify-content-center ">
                            <Typography variant="h5 mb-1" className={classes.Completed}>{t("has successfilly completed")}</Typography>
                            <Typography variant="h5 mt-5" className={classes.courseName}>{certificate.courseName}</Typography>
                        </Grid>

                        <Grid item xs={3} className="d-flex flex-column align-items-center justify-content-center">
                            <div className="text-center" style={{fontFamily:"Didot" ,width: "300px", marginLeft:"280px" }}>
                                {getVerificationBlock()}
                            </div>
                        </Grid>
                        
                        <Grid item xs={4} className="d-flex align-items-center justify-content-center mt-2">
                            <div
                                 className={` align-items-center justify-content-center ${classes.logo}`}>
                                    <img src="/img/certificate/certificat_stemp.png" height={"200px"} />
                                    <img src="/img/certificate/shortFrame D.svg" style={{ width:"350px", marginLeft:"-70px", marginTop:"50px" }}  />
                            </div>
                        </Grid>

                        <Grid item xs={4} className="d-flex flex-column align-items-center justify-content-center mt-5">
                            <div className="text-center" style={{fontFamily:"Didot" ,width: "300px", marginLeft:"80px"}}>
                                
                                <span>
                                    <div className={classes.signature}>
                                        {certificate.trainingManager}
                                    </div>
                                </span>
                                <Divider className={`mt-1 ${classes.divider}`}/>
                                <small>{t("Training Manager")}</small>
                            </div>
                        </Grid>
                        {/* <Grid item xs={6} className="d-flex align-items-center justify-content-start mb-3 pl-4">
                            <Typography variant="body1" className={classes.certificateFooter}>{`${t("Certificate number")}: #${certificate.customNumber}`}</Typography>
                        </Grid>
                        <Grid item xs={6} className="d-flex align-items-center justify-content-end mb-3 pr-4">
                            <Typography variant="body1" className={classes.certificateFooter}>{`${t("Unique Id")}: ${certificate._id}`}</Typography>
                        </Grid> */}
                    </Grid>
                    </div>
                </div> 
            </DialogContent>
            <DialogActions className="d-flex justify-content-between ml-3 mr-3">
                <style type="text/css" media="print">{"\ @page {\ size: A4 landscape;\ }\ "}</style>
            </DialogActions>
        </Dialog>
    )
}